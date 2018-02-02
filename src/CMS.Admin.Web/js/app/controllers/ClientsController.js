'use strict';
angular
    .module('app.controllers')

    .controller('ClientController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('FirstName', 'Nombre').renderWith(renderTitle),
            DTColumnBuilder.newColumn('Email', 'Email'),
            DTColumnBuilder.newColumn('CreationDate', 'Creado').renderWith(renderDate)
        ];

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json')
                    .withFnServerData(serverData)
                    .withDataProp('data')
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    .withOption('paging', true)
                    //.withOption('rowCallback', rowCallback)
                    .withPaginationType('full_numbers')
                    .withDisplayLength(20)
                    .withOption('order', [0, 'asc']);

        //Solr interface function
        function serverData(sSource, aoData, fnCallback, oSettings) {

            //sorting
            var sortColumnIndex = aoData[2].value[0].column;
            var sortDirection = aoData[2].value[0].dir;
            var sortColumn = $scope.dtColumns[sortColumnIndex].mData;
            var sort = sortColumn + " " + sortDirection;

            //search text
            var q = '*';
            if ($scope.searchQuery != undefined && $scope.searchQuery != "") {
                q = $scope.searchQuery;
            }

            //query constructor
            var qs = "?q=" + q + " AND FirstName:[* TO *]&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,FirstName,LastName,Email,CreationDate&sort=" + sort + "&no-pace";

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/Clients/GetAllSolr" + qs,
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .then(function (result) {
                var records = {
                    'draw': result.data.draw,
                    'recordsTotal': result.data.response.numFound,
                    'recordsFiltered': result.data.response.numFound,
                    'data': result.data.response.docs
                };
                fnCallback(records);
            });
        }

        //datatables render name field
        function renderTitle(data, type, full, meta) {
            var css = "times-circle red";
            if (full.IsEnabled == true)
                css = "check-circle blue";

            var html = '<i class="fa fa-blue"></i>';
            html += '<a href="/#/cms/clients/crud/' + full.Id + '"><strong>' + full.FirstName + ' ' + full.LastName + '</strong></a>';
            return html;
        }

        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
            return html;
        }

        $scope.doSearch = function ($event) {
            $scope.dtInstance.rerender();
            if ($event != undefined) {
                var target = $event.target;
                target.blur();
            }
        }

    })

    .controller('ClientCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {

        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Cliente';
            $scope.SubmitButton = 'Actualizar Cliente';
        } else {
            $scope.PageTitle = 'Crear Cliente';
            $scope.SubmitButton = 'Crear Cliente';
        }

        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetClientById(id);
            servCall.then(function (u) {
                $scope.clientData = u.data;
                delete $scope.clientData.$id;
                console.log($scope.clientData);

                getLastestServices($scope.clientData.Id);
                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/cms/clients/list";
            });
        }

        //TRAIGO ultimos servicios para este auto
        function getLastestServices(ClientId) {
            var servCallType = APIService.getLastestServicesByClient(ClientId);
            servCallType.then(function (u) {
                $scope.LastestServices = u.data.response.docs;

                console.log($scope.LastestServices);

            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        //User update
        $scope.processForm = function () {
            
            $scope.clientData.IsEnabled = true;
            $scope.clientData.CompanyId = 2;

            var data = $.param($scope.clientData);
            if (id) {
                var servCall = APIService.updateClient(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El cliente fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createClient(data);
                servCall.then(function (u) {
                    var clientData = u.data;
                    //Set message
                    AlertService.SetAlert("El cliente fue creado con éxito", "success");
                    $window.location.href = "/#/cms/clients/crud/" + clientData.Id;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteCategory = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Category')
                  .textContent('Are you sure you want to delete this category?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteMediaCategory(data);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("The category has been removed successfully", "success");
                    $window.location.href = "/#/cms/multimedia/category/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
