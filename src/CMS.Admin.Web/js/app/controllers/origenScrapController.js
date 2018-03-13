'use strict';
angular
    .module('app.controllers')

    .controller('origenScrapController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);
        GetOrigenes();

        //TRAE TODOS LOS ORIGENES
        function GetOrigenes() {
            var servCallType = APIService.GetOrigenes();
            servCallType.then(function (u) {
                console.log(u);
                $scope.Origenes = u.data;
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
            html += '<a href="/#/blsp/origenScrap/crud/' + full.IDOrigen + '"><strong>' + full.Descripcion + '</strong></a>';
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

    .controller('origenScrapCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {











        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Origen Scrap';
            $scope.SubmitButton = 'Actualizar Origen Scrap';



         





        } else {
            $scope.PageTitle = 'Crear Origen Scrap';
            $scope.SubmitButton = 'Crear Origen Scrap';






        






        }




        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetOrigenById(id);
            servCall.then(function (u) {
                $scope.origenData = u.data;
                delete $scope.origenData.$id;

                console.log($scope.origenData);

                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/origenScrap/list";
            });
        }


        //User update
        $scope.processForm = function () {
            
            //$scope.clientData.IsEnabled = true;
            //$scope.clientData.CompanyId = 2;

            var data = $.param($scope.origenData);
            if (id) {
                var servCall = APIService.updateOrigen(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El Origen fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createOrigen(data);
                servCall.then(function (u) {
                    var origenData = u.data;
                    //Set message
                    AlertService.SetAlert("El Origen de Scrap fue creado con éxito", "success");
                    $window.location.href = "/#/blsp/origenScrap/crud/" + origenData.IDOrigen;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteOrigen = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Origen Scrap')
                  .textContent('Esta seguro de eliminar este Origen de Scrap?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteOrigen(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El Origen de Scrap ha sido eliminado con exito", "success");
                    $window.location.href = "/#/blsp/origenScrap/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
