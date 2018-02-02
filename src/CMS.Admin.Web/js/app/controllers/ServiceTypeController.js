'use strict';
angular
    .module('app.controllers')

    .controller('ServiceTypeController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('Name', 'Servicio').renderWith(renderTitle),
            DTColumnBuilder.newColumn('Price', 'Precio Auto'),
            DTColumnBuilder.newColumn('Price2', 'Precio Camioneta'),
            DTColumnBuilder.newColumn('Price3', 'Precio 4x4'),
            DTColumnBuilder.newColumn('Price4', 'Precio Utilitario')
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
            var qs = "?q=" + q + " AND IsDeleted:false AND IsEnabled:true&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=TypeServiceId,Name,Price,Price2,Price3,Price4&sort=" + sort;

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/ServiceTypes/GetAllSolr" + qs,
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
            html += '<a href="/#/cms/config/servicetype/crud/' + full.TypeServiceId + '"><strong>' + full.Name + '</strong></a>';
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

    .controller('ServiceTypeCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {

        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.typeServiceData = {
            IsDeleted: false,
            IsEnabled: true,
            Duration: 6
        };

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Tipo de Servicio';
            $scope.SubmitButton = 'Actualizar Tipo de Servicio';
        } else {
            $scope.PageTitle = 'Crear Tipo de Servicio';
            $scope.SubmitButton = 'Crear Tipo de Servicio';
        }

        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetServiceTypeById(id);
            servCall.then(function (u) {
                $scope.typeServiceData = u.data;
                delete $scope.typeServiceData.$id;
                delete $scope.typeServiceData.Branch;
                delete $scope.typeServiceData.Service;
                console.log($scope.typeServiceData);
                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/cms/config/servicetype/list";
            });
        }

        //User update
        $scope.processForm = function () {
            
            var data = $.param($scope.typeServiceData);
            if (id) {
                var servCall = APIService.updateServiceType(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El tipo de servicio fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createServiceType(data);
                servCall.then(function (u) {
                    var typeServiceData = u.data;
                    //Set message
                    AlertService.SetAlert("El tipo de servicio fue creado con éxito", "success");
                    $window.location.href = "/#/cms/config/servicetype/crud/" + typeServiceData.Id;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteTypeService = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Tipo de Servicio')
                  .textContent('Esta seguro que desea eliminar este registro?')
                  .ariaLabel('Borrar')
                  .targetEvent(ev)
                  .ok('Borrar')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteTypeService(data, id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El tipo de servicio fue eliminado con éxito", "success");
                    $window.location.href = "/#/cms/config/servicetype/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
