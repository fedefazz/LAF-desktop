'use strict';
angular
    .module('app.controllers')

    .controller('MaquinasController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);


        GetMaquinas();

        //TRAE TODOS LAS MAQUINAS
        function GetMaquinas() {
            var servCallType = APIService.GetMaquinas();
            servCallType.then(function (u) {
                console.log(u);
                $scope.Maquinas = u.data;
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




        //datatables render name field
      

        $scope.renderTitle = function (full) {
            var css = "times-circle red";
            if (full.Habilitado == true)
                css = "check-circle blue";

            var html = '<i class="fa fa-blue"></i>';
            html += '<a href="/#/blsp/maquinas/crud/' + full.IDMaq + '"><strong>' + full.Descripcion + '</strong></a>';
            return html;
        }

     

        //datatables render Array Origenes
        $scope.renderArrayOrigenes = function (full) {
            var html = "<ul>";
            angular.forEach(full.PSSOrigenesScrap, function (value, key) {

                html += '<li class="listaTabla">' + value.Descripcion + '</li>';


            });

            html += "</ul>";
            return html;
        }

        //datatables render Array Materiales
        function renderArrayMateriales(full) {
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

    .controller('MaquinasCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {








        var CallAreas = APIService.GetAreas();
        CallAreas.then(function (u) {
            $scope.areas = u.data;
            console.log($scope.areas);


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });


        var CallOrigenes = APIService.GetOrigenes();
        CallOrigenes.then(function (u) {
            $scope.origenes = u.data;
            console.log("ORIGENES");

            console.log($scope.origenes);


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });




        var CallJobTrack = APIService.GetJobTrack();
        CallJobTrack.then(function (u) {
            $scope.jobtrack = u.data;
            console.log("JobTrack");

            console.log($scope.jobtrack);


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });




        var CallTipos = APIService.GetTipos();
        CallTipos.then(function (u) {
            $scope.tipos = u.data;
            console.log($scope.tipos);


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });


        var CallActividad = APIService.GetActividad();
        CallActividad.then(function (u) {
            $scope.actividades = u.data;
            console.log("ACTIVIDADES");
            console.log($scope.actividades);


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var CallOperadores = APIService.GetOperadores();
        CallOperadores.then(function (u) {
            $scope.operadores = u.data;
            console.log("OPERADORES");
            console.log($scope.operadores);


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Maquina';
            $scope.SubmitButton = 'Actualizar Maquina';



         





        } else {
            $scope.PageTitle = 'Crear Maquina';
            $scope.SubmitButton = 'Crear Maquina';






        






        }

        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetMaquinaById(id);
            servCall.then(function (u) {
                $scope.maquinaData = u.data;
                delete $scope.maquinaData.$id;
                console.log("DATA MAQUINA");

                console.log($scope.maquinaData);

                //getLastestServices($scope.maquinaData.IDMaq);
                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/maquinas/list";
            });
        }


        //User update
        $scope.processForm = function () {
            
            //$scope.clientData.IsEnabled = true;
            //$scope.clientData.CompanyId = 2;

            var data = $.param($scope.maquinaData);
            if (id) {
                var servCall = APIService.updateMaquina(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("La maquina fue actualizada con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createMaquina(data);
                servCall.then(function (u) {
                    var maquinaData = u.data;
                    //Set message
                    AlertService.SetAlert("La maquina fue creada con éxito", "success");
                    $window.location.href = "/#/blsp/maquinas/crud/" + maquinaData.Id;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

       

        //Delete User
        $scope.deleteMaquina = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Maquina')
                  .textContent('Esta seguro de eliminar esta Maquina?')
                  .ariaLabel('Borrar')
                  .targetEvent(ev)
                  .ok('Borrar')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteMaquina(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("La maquina ha sido eliminada con exito", "success");
                    $window.location.href = "/#/blsp/maquinas/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
