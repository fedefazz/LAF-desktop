'use strict';
angular
    .module('app.controllers')

    .controller('GruposEmpaqueController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {
        AlertService.ShowAlert($scope);

        function load() {
            var servCall = APIService.GetGruposEmpaque();
            servCall.then(function (u) {
                $scope.Grupos = u.data;
            }, function () {
                $scope.errorMessage = 'Oops, something went wrong.';
            });
        }
        load();

        $scope.dtInstance = {};
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json')
            .withOption('paging', true)
            .withPaginationType('full_numbers')
            .withDisplayLength(20)
            .withOption('order', [0, 'asc']);

        $scope.doSearch = function () {
            $scope.dtInstance.DataTable.search($scope.searchQuery).draw();
        };
    })

    .controller('GruposEmpaqueCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder, $q) {
        var id = $stateParams.id;

        function loadTiposEtiquetas() {
            return APIService.GetTiposEtiquetas()
                .then(function (response) {
                    if (response.data && Array.isArray(response.data)) {
                        return response.data.map(function (item) {
                            return {
                                Id: parseInt(item.IdEtiqueta, 10),
                                Description: item.Descripcion
                            };
                        });
                    }
                    return [];
                });
        }

        $scope.dtInstance = {};
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json');

        if (id) {
            $scope.PageTitle = 'Editar Grupo de Empaque';
            $scope.SubmitButton = 'Actualizar Grupo';
            $scope.grupoEmpaqueData = {
                Descripcion: '',
                EtiquetaInterna: false,
                TipoEtiquetaInterna: 1,
                EtiquetaExterna: false,
                TipoEtiquetaExterna: 1,
                TipoEtiquetaPallet: 1,
                Habilitado: true,
                ModoPattern: 0,
                TipoPattern: 'N/A'
            };

            $q.all([loadTiposEtiquetas(), APIService.GetGrupoEmpaqueById(id)])
                .then(function (results) {
                    $scope.tiposEtiqueta = results[0] || [];
                    var u = results[1];
                    var data = (u && u.data) || {};

                    $scope.grupoEmpaqueData.Descripcion = (data.Descripcion || '').toString();
                    $scope.grupoEmpaqueData.EtiquetaInterna = !!data.EtiquetaInterna;
                    $scope.grupoEmpaqueData.EtiquetaExterna = !!data.EtiquetaExterna;
                    $scope.grupoEmpaqueData.Habilitado = data.Habilitado !== false;

                    $scope.grupoEmpaqueData.TipoEtiquetaInterna = (data.TipoEtiquetaInterna !== undefined ? parseInt(data.TipoEtiquetaInterna, 10) : 1);
                    $scope.grupoEmpaqueData.TipoEtiquetaExterna = (data.TipoEtiquetaExterna !== undefined ? parseInt(data.TipoEtiquetaExterna, 10) : 1);
                    $scope.grupoEmpaqueData.TipoEtiquetaPallet = (data.TipoEtiquetaPallet !== undefined ? parseInt(data.TipoEtiquetaPallet, 10) : 1);
                    $scope.grupoEmpaqueData.IDGrupoEmpaque = data.IDGrupoEmpaque || data.Id || data.IdGrupoEmpaque;

                    $scope.grupoEmpaqueData.ModoPattern = data.ModoPattern !== undefined ? parseInt(data.ModoPattern, 10) : 0;
                    $scope.grupoEmpaqueData.TipoPattern = data.TipoPattern || 'N/A';

                    ensureDependentZero();
                    $scope.$evalAsync(revalidateForm);
                })
                .catch(function () {
                    $window.location.href = '/#/blsp/gruposempaque/list';
                });
        } else {
            $scope.PageTitle = 'Crear Grupo de Empaque';
            $scope.SubmitButton = 'Crear Grupo';
            $scope.grupoEmpaqueData = {
                Descripcion: '',
                EtiquetaInterna: false,
                TipoEtiquetaInterna: 1,
                EtiquetaExterna: false,
                TipoEtiquetaExterna: 1,
                TipoEtiquetaPallet: 1,
                Habilitado: true,
                ModoPattern: 0,
                TipoPattern: 'N/A'
            };
            loadTiposEtiquetas()
                .then(function (tipos) {
                    $scope.tiposEtiqueta = tipos || [];
                    ensureDependentZero();
                    $scope.$evalAsync(revalidateForm);
                })
                .catch(function () {
                    $scope.tiposEtiqueta = [];
                });
        }

        // Patterns
        $scope.patterns = [];
        APIService.GetPatterns()
            .then(function (response) {
                $scope.patterns = (response.data && Array.isArray(response.data)) ? response.data : [];
                console.log('Patterns cargados exitosamente:', $scope.patterns);
            })
            .catch(function () {
                $scope.patterns = [];
            });

        function ensureDependentZero() {
            if ($scope.grupoEmpaqueData) {
                if (!$scope.grupoEmpaqueData.EtiquetaInterna) {
                    $scope.grupoEmpaqueData.TipoEtiquetaInterna = 1;
                }
                if (!$scope.grupoEmpaqueData.EtiquetaExterna) {
                    $scope.grupoEmpaqueData.TipoEtiquetaExterna = 1;
                }
                if ($scope.grupoEmpaqueData.ModoPattern === 0) {
                    $scope.grupoEmpaqueData.TipoPattern = 'N/A';
                }
            }
        }

        function revalidateForm() {
            var f = $scope.editForm;
            if (!f) return;

            // Solo revalidar, no forzar $setViewValue/$render
            if (f.TipoEtiquetaInterna) f.TipoEtiquetaInterna.$validate();
            if (f.TipoEtiquetaExterna) f.TipoEtiquetaExterna.$validate();
            if (f.TipoEtiquetaPallet) f.TipoEtiquetaPallet.$validate();

            // Si el toggle está apagado, el required no debe bloquear
            if (!$scope.grupoEmpaqueData.EtiquetaInterna && f.TipoEtiquetaInterna) {
                f.TipoEtiquetaInterna.$setValidity('required', true);
            }
            if (!$scope.grupoEmpaqueData.EtiquetaExterna && f.TipoEtiquetaExterna) {
                f.TipoEtiquetaExterna.$setValidity('required', true);
            }

            // Tras poblar desde la API, dejar el form “limpio”
            if (f.$setPristine) f.$setPristine();
            if (f.$setUntouched) f.$setUntouched();
        }

        $scope.onModoPatternChange = function () {
            if ($scope.grupoEmpaqueData.ModoPattern === 0) {
                $scope.grupoEmpaqueData.TipoPattern = 'N/A';
            }
        };

        $scope.onToggleChange = function (which) {
            if (which === 'EtiquetaInterna' && !$scope.grupoEmpaqueData.EtiquetaInterna) {
                $scope.grupoEmpaqueData.TipoEtiquetaInterna = 1;
            }
            if (which === 'EtiquetaExterna' && !$scope.grupoEmpaqueData.EtiquetaExterna) {
                $scope.grupoEmpaqueData.TipoEtiquetaExterna = 1;
            }
        };

        $scope.$watch('grupoEmpaqueData.EtiquetaInterna', function (val) {
            if (!$scope.grupoEmpaqueData) return;
            if (!val) $scope.grupoEmpaqueData.TipoEtiquetaInterna = 1;
        });

        $scope.$watch('grupoEmpaqueData.EtiquetaExterna', function (val) {
            if (!$scope.grupoEmpaqueData) return;
            if (!val) $scope.grupoEmpaqueData.TipoEtiquetaExterna = 1;
        });

        function normalizeForSubmit(m) {
            m = angular.copy(m || {});
            m.Descripcion = (m.Descripcion || '').toString();
            m.EtiquetaInterna = !!m.EtiquetaInterna;
            m.EtiquetaExterna = !!m.EtiquetaExterna;
            m.Habilitado = m.Habilitado !== false;

            if (m.EtiquetaInterna && (m.TipoEtiquetaInterna === null || m.TipoEtiquetaInterna === undefined)) {
                m._errorCampo = 'TipoEtiquetaInterna';
                return m;
            }
            if (m.EtiquetaExterna && (m.TipoEtiquetaExterna === null || m.TipoEtiquetaExterna === undefined)) {
                m._errorCampo = 'TipoEtiquetaExterna';
                return m;
            }

            m.TipoEtiquetaInterna = parseInt(m.TipoEtiquetaInterna, 10) || 1;
            m.TipoEtiquetaExterna = parseInt(m.TipoEtiquetaExterna, 10) || 1;
            m.TipoEtiquetaPallet = parseInt(m.TipoEtiquetaPallet, 10) || 1;

            if (!m.EtiquetaInterna) m.TipoEtiquetaInterna = 1;
            if (!m.EtiquetaExterna) m.TipoEtiquetaExterna = 1;

            var modo = parseInt(m.ModoPattern, 10);
            m.ModoPattern = isNaN(modo) ? 0 : modo;
            m.TipoPattern = m.TipoPattern || 'N/A';
            if (m.ModoPattern === 0) m.TipoPattern = 'N/A';

            return m;
        }

        $scope.processForm = function () {
            var payload = normalizeForSubmit($scope.grupoEmpaqueData);
            if (payload._errorCampo) {
                var msg = payload._errorCampo === 'TipoEtiquetaInterna'
                    ? 'Debe seleccionar un Tipo de etiqueta interna.'
                    : 'Debe seleccionar un Tipo de etiqueta externa.';
                AlertService.SetAlert(msg, 'error');
                AlertService.ShowAlert($scope);
                return;
            }
            var data = $.param(payload);

            if (id) {
                APIService.updateGrupoEmpaque(id, data).then(function () {
                    $window.location.href = '/#/blsp/gruposempaque/list';
                }, function () {
                    $scope.errorMessage = 'Error al actualizar el grupo.';
                    $window.location.href = '/#/blsp/gruposempaque/list';
                });
            } else {
                APIService.createGrupoEmpaque(data).then(function (u) {
                    AlertService.SetAlert('El grupo fue creado con éxito', 'success');
                    $window.location.href = '/#/blsp/gruposempaque/list';
                }, function () {
                    $scope.errorMessage = 'Error al crear el grupo.';
                });
            }
        };

        $scope.deleteGrupoEmpaque = function (ev, idDel) {
            var confirm = $mdDialog.confirm()
                .title('Eliminar Grupo de Empaque')
                .textContent('¿Está seguro de eliminar este grupo?')
                .ariaLabel('Delete')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                APIService.deleteGrupoEmpaque(idDel).then(function () {
                    AlertService.SetAlert('El grupo ha sido eliminado con éxito', 'success');
                    $window.location.href = '/#/blsp/gruposempaque/list';
                }, function () {
                    $scope.errorMessage = 'Oops, something went wrong.';
                });
            }, function () { });
        };
    });