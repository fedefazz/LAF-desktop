'use strict';
angular
    .module('app.controllers')

    .controller('MaquinasController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('Descripcion', 'Nombre').renderWith(renderTitle),
            DTColumnBuilder.newColumn('PSSAreas.Descripcion', 'Area'),
            DTColumnBuilder.newColumn('PSSOrigenesScrap.Descripcion', 'Origenes Scrap').renderWith(renderArrayOrigenes),
            DTColumnBuilder.newColumn('PSSTiposMaterials.Materiales', 'Tipos Material').renderWith(renderArrayMateriales)

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

           
            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/PSSMaquinas",
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .then(function (result) {

                console.log(result);
                var records = {
                    'draw': result.data.draw,
                    'recordsTotal': result.data.length,
                    'recordsFiltered': result.data.length,
                    'data': result.data
                };
                fnCallback(records);
                $scope.total = result.data.length;
            });
        }

        //datatables render name field
        function renderTitle(data, type, full, meta) {
            var css = "times-circle red";
            if (full.IsEnabled == true)
                css = "check-circle blue";

            var html = '<i class="fa fa-blue"></i>';
            html += '<a href="/#/blsp/maquinas/crud/' + full.IDMaq + '"><strong>' + full.Descripcion + '</strong></a>';
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

        $scope.doSearch = function ($event) {
            $scope.dtInstance.rerender();
            if ($event != undefined) {
                var target = $event.target;
                target.blur();
            }
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
            console.log($scope.origenes);


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
                console.log($scope.maquinaData);

                getLastestServices($scope.maquinaData.IDMaq);
                
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
                var servCall = APIService.updateClient(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El cliente fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createMaquina(data);
                servCall.then(function (u) {
                    var maquinaData = u.data;
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
