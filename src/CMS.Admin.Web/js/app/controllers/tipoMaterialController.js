'use strict';
angular
    .module('app.controllers')

    .controller('tipoMaterialController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('IDTipoMat', 'ID').renderWith(renderTitle),
            DTColumnBuilder.newColumn('Descripcion', 'Nombre'),


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
                url: $rootScope.webapiurl + "api/PSSTiposMaterials",
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
            html += '<a href="/#/blsp/tipoMaterial/crud/' + full.IDTipoMat + '"><strong>' + full.IDTipoMat + '</strong></a>';
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

    .controller('tipoMaterialCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {








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
        $scope.deleteOperador = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Maquina')
                  .textContent('Esta seguro de eliminar este Operador?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteOperador(id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El Operador ha sido eliminado con exito", "success");
                    $window.location.href = "/#/blsp/operadores/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
