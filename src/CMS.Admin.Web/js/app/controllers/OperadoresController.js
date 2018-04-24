'use strict';
angular
    .module('app.controllers')

    .controller('OperadoresController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        GetOperadores();

        //TRAE TODOS LOS MATERIALES
        function GetOperadores() {
            var servCallType = APIService.GetOperadores();
            servCallType.then(function (u) {
                console.log(u);
                $scope.Operadores = u.data;
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };



        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json')
                    .withOption('paging', true)
                    .withPaginationType('full_numbers')
                    .withDisplayLength(20)
                    .withOption('order', [1, 'asc']);


        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
            return html;
        }

        //datatables render Array Origenes
        function renderArrayOrigenes(data, type, full, meta) {
            var html = "<ul>";
            angular.forEach(full.PSSOrigenesScrap, function (value, key) {

                html += '<li class="listaTabla">' + value.Descripcion + '</li>';


            });

            html += "</ul>";
            return html;
        }

        //datatables render Array Materiales
        function renderArrayMateriales(data, type, full, meta) {
            var html = "<ul>";
            angular.forEach(full.PSSTiposMaterial, function (value, key) {

                html += '<li class="listaTabla">' + value.Descripcion + '</li>';


            });

            html += "</ul>";
            return html;
        }

      


        $scope.doSearch = function () {
            $scope.dtInstance.DataTable.search($scope.searchQuery).draw();

        }

    })

    .controller('OperadoresCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {








        //var CallAreas = APIService.GetAreas();
        //CallAreas.then(function (u) {
        //    $scope.areas = u.data;
        //    console.log($scope.areas);


        //    AlertService.ShowAlert($scope);
        //}, function (error) {
        //    $window.location.href = "/#/blsp/maquinas/list";
        //});


        //var CallOrigenes = APIService.GetOrigenes();
        //CallOrigenes.then(function (u) {
        //    $scope.origenes = u.data;
        //    console.log("ORIGENES");

        //    console.log($scope.origenes);


        //    AlertService.ShowAlert($scope);
        //}, function (error) {
        //    $window.location.href = "/#/blsp/maquinas/list";
        //});

       






        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Operario';
            $scope.SubmitButton = 'Actualizar Operario';



         





        } else {
            $scope.PageTitle = 'Crear Operario';
            $scope.SubmitButton = 'Crear Operario';






        






        }






        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetOperadorById(id);
            servCall.then(function (u) {
                $scope.operadorData = u.data;
                delete $scope.operadorData.$id;

                console.log($scope.operadorData);

                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/operadores/list";
            });
        


        var CallMaquinas = APIService.GetMaquinaByOperador(id);
        CallMaquinas.then(function (u) {
            $scope.maquinas = u.data;
            console.log($scope.maquinas);


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/operadores/list";
        });

       }

        //User update
        $scope.processForm = function () {
            
            //$scope.clientData.IsEnabled = true;
            //$scope.clientData.CompanyId = 2;

            var data = $.param($scope.operadorData);
            if (id) {
                var servCall = APIService.updateOperador(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El Operario fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createOperador(data);
                servCall.then(function (u) {
                    var operadorData = u.data;
                    //Set message
                    AlertService.SetAlert("El Operario fue creado con éxito", "success");
                    $window.location.href = "/#/blsp/operadores/crud/" + operadorData.IdOperador;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteOperador = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Operador')
                  .textContent('Esta seguro de eliminar este Operador?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteOperador(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El Operador ha sido eliminado con exito", "success");
                    $window.location.href = "/#/blsp/operadores/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
