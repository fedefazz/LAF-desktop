'use strict';
angular
    .module('app.controllers')

    .controller('ActividadController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);


        GetTipos();

        //TRAE TODOS LOS MATERIALES
        function GetTipos() {
            var servCallType = APIService.GetTipos();
            servCallType.then(function (u) {
                console.log(u);
                $scope.Materials = u.data;
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
        function renderTitle(data, type, full, meta) {
            var css = "times-circle red";
            if (full.Habilitado == true)
                css = "check-circle blue";

            var html = '<i class="fa fa-' + css + '"></i>';
            html += '<a href="/#/blsp/tipoMaterial/crud/' + full.IDTipoMat + '"><strong>' + full.Descripcion + '</strong></a>';
            return html;
        }

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

    .controller('tipoMaterialCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {






        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Material';
            $scope.SubmitButton = 'Actualizar Material';



         





        } else {
            $scope.PageTitle = 'Crear Material';
            $scope.SubmitButton = 'Crear Material';






        






        }



      



        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetMaterialById(id);
            servCall.then(function (u) {
                $scope.materialData = u.data;
                delete $scope.materialData.$id;

                console.log($scope.materialData);


                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/tipoMaterial/list";
            });
        }







        //User update
        $scope.processForm = function () {
            
            //$scope.clientData.IsEnabled = true;
            //$scope.clientData.CompanyId = 2;

            var data = $.param($scope.materialData);
            if (id) {
                var servCall = APIService.updateMaterial(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El material fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createMaterial(data);
                servCall.then(function (u) {
                    var materialData = u.data;
                    //Set message
                    AlertService.SetAlert("El material fue creado con éxito", "success");
                    $window.location.href = "/#/blsp/tipoMaterial/crud/" + materialData.IDTipoMat;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteMaterial = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Material')
                  .textContent('Esta seguro de eliminar este tipo de material?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteMaterial(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El Material ha sido eliminado con exito", "success");
                    $window.location.href = "/#/blsp/tipoMaterial/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
