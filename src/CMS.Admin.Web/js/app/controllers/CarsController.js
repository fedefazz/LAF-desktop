'use strict';
angular
    .module('app.controllers')

    .controller('CarsController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('Name', 'Marca').renderWith(renderTitle),
            DTColumnBuilder.newColumn('Key', 'Codigo')
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
            var qs = "?q=" + q + " AND Type:Brand AND IsEnabled:true&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,Name,Key&sort=" + sort;

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/Keyword/GetAllSolr" + qs,
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
            html += '<a href="/#/cms/config/cars/crud/' + full.Id + '"><strong>' + full.Name + '</strong></a>';
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

    .controller('CarsCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {

        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.keywordData = {
            Type: "Brand",
            IsEnabled: true
        };

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Marca';
            $scope.SubmitButton = 'Actualizar Marca';
        } else {
            $scope.PageTitle = 'Crear Marca';
            $scope.SubmitButton = 'Crear Marca';
        }

        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetKeywordById(id);
            servCall.then(function (u) {
                $scope.keywordData = u.data;
                delete $scope.keywordData.$id;
                delete $scope.keywordData.Vehicle;
                delete $scope.keywordData.Keyword1;
                delete $scope.keywordData.Keyword2;
                console.log($scope.keywordData);
                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/cms/config/cars/list";
            });
        }

        //User update
        $scope.processForm = function () {
            
            var data = $.param($scope.keywordData);
            if (id) {
                var servCall = APIService.updateKeyword(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("La marca fue actualizada con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createKeyword(data);
                servCall.then(function (u) {
                    var keywordData = u.data;
                    //Set message
                    AlertService.SetAlert("La marca fue creada con éxito", "success");
                    $window.location.href = "/#/cms/config/cars/crud/" + keywordData.Id;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteKeyword = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Marca')
                  .textContent('Esta seguro que desea eliminar este registro?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Borrar')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteKeyword(data, id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("La marca fue eliminada con éxito", "success");
                    $window.location.href = "/#/cms/config/cars/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
