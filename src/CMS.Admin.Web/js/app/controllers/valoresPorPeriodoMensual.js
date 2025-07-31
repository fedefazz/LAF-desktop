'use strict';

angular
    .module('app.controllers')
    .controller('valoresPorPeriodoMensualController', function ($scope, $filter, APIService, DTOptionsBuilder, $timeout) {
        // Obtener productos desde la API
        GetPeriodos();

        function GetPeriodos() {
            APIService.GetPeriodos().then(function (response) {
                $scope.periodos = response.data;
                console.log('$scope.periodos', $scope.periodos);


            }, function (error) {
                $scope.errorMessage = "Oops, algo salió mal.";
            });
        }
        $scope.meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        $scope.dtInstance = {};


        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json')
            .withOption('paging', true)
            .withPaginationType('full_numbers')
            .withOption('searching', true)
            .withDisplayLength(20)


        $scope.doSearch = function () {
            $timeout(function () {
                if ($scope.dtInstance && $scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.search($scope.searchQuery).draw();
                } else {
                    console.error("El DataTable no está disponible o no está inicializado correctamente.");
                }
            }, 0);
        };



















    }
    )












    .controller('valoresPorPeriodoMensualCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder, $http) {

        var id = $stateParams.id;
        $scope.editMode = false;

        $scope.getYears = function () {
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let year = 2010; year <= currentYear; year++) {
                years.push(year);
            }
            return years;
        };

        // Inicializa materialData si no está definido
        $scope.materialData = $scope.materialData || {};

        if (id) {

            $scope.editMode = true;
            $scope.PageTitle = 'Editar Periodo';
            $scope.SubmitButton = 'Editar Periodo';


            getPeriodoById(id);

            //TRAE TODOS LOS MATERIALES
            function getPeriodoById(id) {
                var servCallType = APIService.getPeriodoById(id);
                servCallType.then(function (u) {
                    console.log('getPeriodoById data', u);
                    $scope.materialData = u.data[0];

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            };








        }

        if (!id) {

            $scope.PageTitle = 'Crear Periodo';
            $scope.SubmitButton = 'Crear Periodo';


            var currentDate = new Date();
            $scope.materialData.Ano = currentDate.getFullYear(); // Establece el año actual
            $scope.materialData.Mes = currentDate.getMonth() + 1; // Establece el mes actual (getMonth() devuelve 0-11)


        }

        $scope.processForm = function () {



            $scope.data = $scope.materialData;



            if (!id) {


                console.log('data create: ', $scope.data);


                GetPeriodos();

                function GetPeriodos() {
                    APIService.GetPeriodos().then(function (response) {
                        $scope.periodos = response.data;
                        console.log('$scope.periodos', $scope.periodos);
                        let isDuplicate = false;

                        $scope.periodos.forEach(function (periodo) {
                            console.log('periodo.Ano', periodo.Ano);
                            console.log('$scope.data', $scope.data);

                            if (periodo.Ano === $scope.data.Ano && periodo.Mes === $scope.data.Mes) {
                                isDuplicate = true;  // Si ya existe un registro con el mismo Año y Mes, marcamos como duplicado
                            }
                        });

                        if (isDuplicate) {
                            // Si ya existe, mostramos un mensaje de error
                            $scope.errorMessage = "Ya existe un registro con el mismo Año y Mes. No se puede realizar la operación.";
                        } else {

                            var data = $.param($scope.data);

                            var servCall = APIService.postPsscrapValoresPorPeriodoMensual(data);
                            servCall.then(function (u) {
                                var periodoData = u.data;
                                //Set message
                                //AlertService.SetAlert("El Periodo fue creado con éxito", "success");
                                $window.location.href = "/#/blsp/valoresPorPeriodoMensual/list";
                            }, function (error) {
                                $scope.errorMessage = "Oops, something went wrong.";
                            });


                        }







                    }, function (error) {
                        $scope.errorMessage = "Oops, algo salió mal.";
                    });




                }
            }

            if (id) {



               


                            var data = $.param($scope.data);

                            var servCall = APIService.valoresporperiodomensualput(id, data);
                            servCall.then(function (u) {
                                console.log('put hecho: ', u.data);

                                var materialData = u.data;
                                //AlertService.SetAlert("El Periodo fue editado con éxito", "success");
                                $window.location.href = "/#/blsp/valoresPorPeriodoMensual/list";

                            }, function (error) {
                                $scope.errorMessage = "Oops, something went wrong.";
                            });
                        }








        }

        $scope.deletePsscrapValoresPorPeriodoMensual = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Eliminar Periodo')
                .textContent('Esta seguro de eliminar este Periodo?')
                .ariaLabel('Delete')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deletePsscrapValoresPorPeriodoMensual(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El Periodo ha sido eliminado con exito", "success");
                    $window.location.href = "/#/blsp/valoresPorPeriodoMensual/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
        


      

      


