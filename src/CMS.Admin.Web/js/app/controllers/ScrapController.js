'use strict';
angular
    .module('app.controllers')

    .controller('scrapController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);
        GetScrap();

        //TRAE TODOS LOS ORIGENES
        function GetScrap() {
            var servCallType = APIService.GetScrap();
            servCallType.then(function (u) {
                console.log(u);
                $scope.Scraps = u.data;
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
                    .withOption('order', [1, 'asc'])
                   
        



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



        //Start*To Export SearchTable data in excel  
        // create XLS template with your field.  
        var mystyle = {
            headers: true,
            columns: [

                
              { columnid: 'IdRegScrap', title: 'IdRegScrap' },
              { columnid: 'Fecha', title: 'Fecha' },
              { columnid: 'NumOP', title: 'NumOP' },
              { columnid: 'Maquina', title: 'Maquina' },
              { columnid: 'Operador', title: 'Operador' },
              { columnid: 'Material', title: 'TIpo Material' },
              { columnid: 'Origen', title: 'Origen Scrap' },
              { columnid: 'Peso', title: 'Peso' },
              { columnid: 'Observaciones', title: 'Observaciones' },
            ],
        };


        // function to use on ng-click.  
        //$scope.searchCaseResult is your json data which cominmg from database or Controller.  
        $scope.exportData = function () {

            //get current system date.         
            var date = new Date();
            $scope.CurrentDateTime = $filter('date')(new Date().getTime(), 'MM/dd/yyyy HH:mm:ss');
            //To convert Date[mm/dd/yyyy] from jsonDate "/Date(1355287447277)/"  
            //for (var i = 0; i < $scope.Scraps.length; i++) {
            //    $scope.Scraps[i].DocCreatedDate;
            //    var dateString = $scope.Scraps[i].DocCreatedDate.substr(6);
            //    var currentTime = new Date(parseInt(dateString));
            //    var month = currentTime.getMonth() + 1;
            //    var day = currentTime.getDate();
            //    var year = currentTime.getFullYear();
            //    var date = month + "/" + day + "/" + year;
            //    $scope.Scraps[i].DocCreatedDate = date;
            //}

            for (var i = 0; i < $scope.Scraps.length; i++) {


                $scope.Scraps[i].Fecha = moment($scope.Scraps[i].Fecha).format('DD/MM/YYYY HH:mm:ss');


            }



            //Create XLS format using alasql.js file.  
            alasql('SELECT * INTO XLSX("SCRAP' + $scope.CurrentDateTime + '.xlsx",?) FROM ?', [mystyle, $scope.Scraps]);
        };
        //End*To Export SearchTable data in excel  





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
                    AlertService.SetAlert("El Origen fue creado con éxito", "success");
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
