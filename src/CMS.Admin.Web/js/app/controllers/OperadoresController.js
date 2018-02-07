'use strict';
angular
    .module('app.controllers')

    .controller('OperadoresController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('Nombre', 'Nombre').renderWith(renderTitle),
            DTColumnBuilder.newColumn('IdOperador', 'Legajo'),


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
            //var q = '*';
            //if ($scope.searchQuery != undefined && $scope.searchQuery != "") {
            //    q = $scope.searchQuery;
            //}

           
            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/PSSOperadores",
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
            if (full.Habilitado == true)
                css = "check-circle blue";

            var html = '<i class="fa fa-' + css + '"></i>';
            html += '<a href="/#/blsp/operadores/crud/' + full.IdOperador + '"><strong>' + full.Nombre + ' ' + full.Apellido + '</strong></a>';
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
            $scope.dtInstance.DataTable.search($scope.searchText).draw();
        }

    })

    .controller('OperadoresCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {








        //var CallAreas = APIService.GetAreas();
        //CallAreas.then(function (u) {
        //    $scope.areas = u.data;
        //    console.log($scope.areas);


        //    AlertService.ShowAlert($scope);
        //}, function (error) {
        //    $window.location.href = "/#/blsp/maquinas/list";
        //});


        //var CallOrigenes = APIService.GetOrigenes();
        //CallOrigenes.then(function (u) {
        //    $scope.origenes = u.data;
        //    console.log("ORIGENES");

        //    console.log($scope.origenes);


        //    AlertService.ShowAlert($scope);
        //}, function (error) {
        //    $window.location.href = "/#/blsp/maquinas/list";
        //});

        //var CallTipos = APIService.GetTipos();
        //CallTipos.then(function (u) {
        //    $scope.tipos = u.data;
        //    console.log($scope.tipos);


        //    AlertService.ShowAlert($scope);
        //}, function (error) {
        //    $window.location.href = "/#/blsp/maquinas/list";
        //});






        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Operario';
            $scope.SubmitButton = 'Actualizar Operario';



         





        } else {
            $scope.PageTitle = 'Crear Operario';
            $scope.SubmitButton = 'Crear Operario';






        






        }

        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetOperadorById(id);
            servCall.then(function (u) {
                $scope.operadorData = u.data;
                delete $scope.operadorData.$id;
                console.log("DATA MAQUINA");

                console.log($scope.operadorData);

                //getLastestServices($scope.operadorData.IDMaq);
                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/operadores/list";
            });
        }


        //User update
        $scope.processForm = function () {
            
            //$scope.clientData.IsEnabled = true;
            //$scope.clientData.CompanyId = 2;

            var data = $.param($scope.operadorData);
            if (id) {
                var servCall = APIService.updateOperario(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El Operario fue actualizado con éxito", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createOperador(data);
                servCall.then(function (u) {
                    var operadorData = u.data;
                    //Set message
                    AlertService.SetAlert("El Operario fue creado con éxito", "success");
                    $window.location.href = "/#/blsp/operadores/crud/" + operadorData.Id;
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
                  .title('Eliminar Maquina')
                  .textContent('Esta seguro de eliminar esta Maquina?')
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
