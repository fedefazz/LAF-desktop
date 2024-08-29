'use strict';
angular
    .module('app.controllers')

    .controller('JobTrackController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);
        GetJobTrack();

        //TRAE TODOS LOS ORIGENES
        function GetJobTrack() {
            var servCallType = APIService.GetJobTrack();
            servCallType.then(function (u) {
                console.log(u);
                $scope.JobTrack = u.data;
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

    .controller('JobTrackCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {











        var id = $stateParams.id;

        $scope.todasLasOpciones = [
            { IdModuloApp: '1', Descripcion: 'Empaque' },
            { IdModuloApp: '2', Descripcion: 'Tabaco Pallets' },
            { IdModuloApp: '3', Descripcion: 'Tabaco Bobinas' },
            { IdModuloApp: '4', Descripcion: 'Scrap' },


        ];

        $scope.selectedModules = [];

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Job Track';
            $scope.SubmitButton = 'Actualizar Job Track';



         





        } else {
            $scope.PageTitle = 'Crear Job Track';
            $scope.SubmitButton = 'Crear Job Track';






        






        }




        //Gets category by Id for edit fields
        if (id) {
            console.log("llamar por ID");

            var servCall = APIService.GetJobTrackById(id);
            servCall.then(function (u) {
                $scope.JobTrackData = u.data;
                delete $scope.JobTrackData.$id;

                console.log($scope.JobTrackData);
                console.log("$scope.JobTrackData $scope.JobTrackData $scope.JobTrackData", $scope.JobTrackData);
                $scope.selectedModules = angular.copy($scope.JobTrackData.PSSJobtrackModulos);
                console.log("$scope.selectedModulesa", $scope.selectedModules);
                console.log("  $scope.todasLasOpciones", $scope.todasLasOpciones);

                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/JobTrack/list";
            });
        }


        


        //User update
        $scope.processForm = function () {
            $scope.JobTrackData.PSSJobtrackModulos = $scope.selectedModules;


            if (id) {
                console.log("$scope.selectedModules antes", $scope.JobTrackData)

                angular.forEach($scope.JobTrackData.PSSJobtrackModulos, function (value, key) {

                    value.IdJobtrack = $scope.JobTrackData.IDJobTrack;


                });
            }
            
            var data = $.param($scope.JobTrackData);
            console.log($scope.JobTrackData)
            console.log("$scope.selectedModules",$scope.selectedModules)

            if (id) {
                var servCall = APIService.updateJobTrack(id, data);
              

                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El JobTrack fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createJobTrack(data);
                servCall.then(function (u) {
                    var JobTrackData = u.data;
                    //Set message
                    AlertService.SetAlert("El JobTrack fue creado con éxito", "success");
                    $window.location.href = "/#/blsp/JobTrack/crud/" + JobTrackData.IdJobTrack;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteJobTrack = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar JobTrack')
                  .textContent('Esta seguro de eliminar este JobTrack?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteJobTrack(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El JobTrack ha sido eliminado con exito", "success");
                    $window.location.href = "/#/blsp/JobTrack/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
