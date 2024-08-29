'use strict';
angular
    .module('app.controllers')

    .controller('etiquetasController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);


        GetEtiquetas();

        //TRAE TODOS LOS MATERIALES
        function GetEtiquetas() {
            var servCallType = APIService.GetEtiquetas();
            servCallType.then(function (u) {
                console.log(u);
                $scope.Etiquetas = u.data;
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
            html += '<a href="/#/blsp/etiquetas/crud/' + full.id + '"><strong>' + full.nombre + '</strong></a>';
            return html;
        }

        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
            return html;
        }

        

        $scope.doSearch = function () {
            $scope.dtInstance.DataTable.search($scope.searchQuery).draw();

        }

    })

    .controller('etiquetasCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {






        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Etiqueta';
            $scope.SubmitButton = 'Actualizar Etiqueta';



         





        } else {
            $scope.PageTitle = 'Crear Etiqueta';
            $scope.SubmitButton = 'Crear Etiqueta';






        






        }



      



        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetEtiquetaById(id);
            servCall.then(function (u) {
                $scope.etiquetaData = u.data;
                delete $scope.etiquetaData.$id;

                console.log($scope.etiquetaData);


                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/etiquetas/list";
            });
        }







        //User update
        $scope.processForm = function () {
            
            //$scope.clientData.IsEnabled = true;
            //$scope.clientData.CompanyId = 2;

            var data = $.param($scope.etiquetaData);
            if (id) {
                var servCall = APIService.updateEtiqueta(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("La etiqueta fue actualizada con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createEtiqueta(data);
                servCall.then(function (u) {
                    var etiquetaData = u.data;
                    //Set message
                    AlertService.SetAlert("La etiqueta fue creada con éxito", "success");
                    $window.location.href = "/#/blsp/etiquetas/crud/" + etiquetaData.id;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteEtiqueta = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Etiqueta')
                  .textContent('Esta seguro de eliminar esta etiqueta?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteEtiqueta(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("La etiqueta ha sido eliminada con exito", "success");
                    $window.location.href = "/#/blsp/etiquetas/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
