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

    .controller('GruposEmpaqueCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {
        var id = $stateParams.id;

        $scope.dtInstance = {};
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json');

        if (id) {
            $scope.PageTitle = 'Editar Grupo de Empaque';
            $scope.SubmitButton = 'Actualizar Grupo';
        } else {
            $scope.PageTitle = 'Crear Grupo de Empaque';
            $scope.SubmitButton = 'Crear Grupo';
        }

        function ensureDependentZero() {
            if ($scope.grupoEmpaqueData) {
                if (!$scope.grupoEmpaqueData.EtiquetaInterna) {
                    $scope.grupoEmpaqueData.TipoEtiquetaInterna = 0;
                }
                if (!$scope.grupoEmpaqueData.EtiquetaExterna) {
                    $scope.grupoEmpaqueData.TipoEtiquetaExterna = 0;
                }
            }
        }

        if (id) {
            var servCall = APIService.GetGrupoEmpaqueById(id);
            servCall.then(function (u) {
                $scope.grupoEmpaqueData = u.data || {};
                $scope.grupoEmpaqueData.Descripcion = ($scope.grupoEmpaqueData.Descripcion || '').toString();
                $scope.grupoEmpaqueData.EtiquetaInterna = !!$scope.grupoEmpaqueData.EtiquetaInterna;
                $scope.grupoEmpaqueData.EtiquetaExterna = !!$scope.grupoEmpaqueData.EtiquetaExterna;
                $scope.grupoEmpaqueData.Habilitado = $scope.grupoEmpaqueData.Habilitado !== false;
                $scope.grupoEmpaqueData.TipoEtiquetaInterna = parseInt($scope.grupoEmpaqueData.TipoEtiquetaInterna || 0, 10);
                $scope.grupoEmpaqueData.TipoEtiquetaExterna = parseInt($scope.grupoEmpaqueData.TipoEtiquetaExterna || 0, 10);
                $scope.grupoEmpaqueData.TipoEtiquetaPallet = parseInt($scope.grupoEmpaqueData.TipoEtiquetaPallet || 0, 10);

                ensureDependentZero();

                delete $scope.grupoEmpaqueData.$id;
                AlertService.ShowAlert($scope);
            }, function () {
                $window.location.href = '/#/blsp/gruposempaque/list';
            });
        } else {
            $scope.grupoEmpaqueData = {
                Descripcion: '',
                EtiquetaInterna: false,
                TipoEtiquetaInterna: 0,
                EtiquetaExterna: false,
                TipoEtiquetaExterna: 0,
                TipoEtiquetaPallet: 0,
                Habilitado: true
            };
            ensureDependentZero();
        }

        $scope.onToggleChange = function (which) {
            if (which === 'EtiquetaInterna' && !$scope.grupoEmpaqueData.EtiquetaInterna) {
                $scope.grupoEmpaqueData.TipoEtiquetaInterna = 0;
            }
            if (which === 'EtiquetaExterna' && !$scope.grupoEmpaqueData.EtiquetaExterna) {
                $scope.grupoEmpaqueData.TipoEtiquetaExterna = 0;
            }
        };

        $scope.$watch('grupoEmpaqueData.EtiquetaInterna', function (val) {
            if (!val) {
                $scope.grupoEmpaqueData.TipoEtiquetaInterna = 0;
            }
        });
        $scope.$watch('grupoEmpaqueData.EtiquetaExterna', function (val) {
            if (!val) {
                $scope.grupoEmpaqueData.TipoEtiquetaExterna = 0;
            }
        });

        function normalizeForSubmit(m) {
            m = angular.copy(m || {});
            m.Descripcion = (m.Descripcion || '').toString();
            m.EtiquetaInterna = !!m.EtiquetaInterna;
            m.EtiquetaExterna = !!m.EtiquetaExterna;
            m.Habilitado = m.Habilitado !== false;
            m.TipoEtiquetaInterna = parseInt(m.TipoEtiquetaInterna || 0, 10);
            m.TipoEtiquetaExterna = parseInt(m.TipoEtiquetaExterna || 0, 10);
            m.TipoEtiquetaPallet = parseInt(m.TipoEtiquetaPallet || 0, 10);

            if (!m.EtiquetaInterna) m.TipoEtiquetaInterna = 0;
            if (!m.EtiquetaExterna) m.TipoEtiquetaExterna = 0;

            return m;
        }

        $scope.processForm = function () {
            var payload = normalizeForSubmit($scope.grupoEmpaqueData);
            var data = $.param(payload);
            if (id) {
                var servCall = APIService.updateGrupoEmpaque(id, data);
                servCall.then(function () {
                    AlertService.SetAlert('El grupo fue actualizado con \u00E9xito', 'success');
                    AlertService.ShowAlert($scope);
                }, function () {
                    $scope.errorMessage = 'Oops, something went wrong.';
                });
            } else {
                var servCall = APIService.createGrupoEmpaque(data);
                servCall.then(function (u) {
                    var d = u.data || {};
                    var newId = d.Id || d.IDGrupoEmpaque || d.IdGrupoEmpaque || d.id;
                    AlertService.SetAlert('El grupo fue creado con \u00E9xito', 'success');
                    $window.location.href = '/#/blsp/gruposempaque/crud/' + newId;
                }, function () {
                    $scope.errorMessage = 'Oops, something went wrong.';
                });
            }
        };

        $scope.deleteGrupoEmpaque = function (ev, idDel) {
            var confirm = $mdDialog.confirm()
                .title('Eliminar Grupo de Empaque')
                .textContent('\u00BFEst\u00E1 seguro de eliminar este grupo?')
                .ariaLabel('Delete')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                var servCall = APIService.deleteGrupoEmpaque(idDel);
                servCall.then(function () {
                    AlertService.SetAlert('El grupo ha sido eliminado con \u00E9xito', 'success');
                    $window.location.href = '/#/blsp/gruposempaque/list';
                }, function () {
                    $scope.errorMessage = 'Oops, something went wrong.';
                });
            }, function () { });
        };
    });
