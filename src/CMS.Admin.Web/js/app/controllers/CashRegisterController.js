'use strict';
angular
    .module('app.controllers')

    .controller('CashRegisterController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, AlertService, $rootScope, $filter, $http, $timeout, $mdDialog) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        $scope.PaymentTypes = [{ name: 'Credito', value: 'credit' }, { name: 'Debito', value: 'debit' }];

        $scope.PaymentMethods = [{ name: 'Efectivo', value: 'cash' }, { name: 'Tarjeta de Credito', value: 'creditCard' }, { name: 'Tarjeta de Debito', value: 'debitCard' }];


        $scope.recordData = {};
        $scope.recordData.Type = 'credit';
        $scope.recordData.PaymentMethod = 'Efectivo';


        $scope.CreationDate = new Date();

        //Get Concepts
        getKeywordsByType('Concept');

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('CreationDate', 'Fecha').renderWith(renderDate),
            DTColumnBuilder.newColumn('Type', 'Tipo').renderWith(renderType),
            DTColumnBuilder.newColumn('Concept', 'Concepto'),
            DTColumnBuilder.newColumn('PaymentMethod', 'Metodo Pago'),
            DTColumnBuilder.newColumn('Description', 'Descripción'),
            DTColumnBuilder.newColumn('Amount', 'Monto').renderWith(renderAmount)
        ];

        $('#DataTables_Table_0').dataTable({
            "columnDefs": [{
                "targets": 1,
                "width": 5
            }]
        });

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json')
                    .withFnServerData(serverData)
                    .withDataProp('data')
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    .withOption('paging', true)
                    .withOption('rowCallback', rowCallback)
                    .withPaginationType('full_numbers')
                    .withDisplayLength(20)
                    .withOption('order', [0, 'desc']);

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
            var from = $scope.CreationDate;
            var to = angular.copy($scope.CreationDate);
            to.setDate(to.getDate() + 1);

            var qf = "fq=CreationDate:[" + moment(from).format('YYYY-MM-DD') + "T00:00:00Z TO " + moment(to).format('YYYY-MM-DD') + "T00:00:00Z]";

            //query constructor
            var qs = "?q=" + q + "&" + qf + "&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,Type,Amount,Concept,CreationDate,PaymentMethod,Description&sort=" + sort + "&no-pace&json.facet={total:'sum(Amount)'}";

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/CashRegister/GetAllSolr" + qs,
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

                //Genero el Total restando los debitos
                var _cashTotal = 0;
                angular.forEach(result.data.response.docs, function (value, key)
                {
                    if (value.Type == "debit") {
                    //Le agrego un menos a los debitos para hacerlos negativos
                    value.Amount = -value.Amount;
                    }

                    _cashTotal = _cashTotal + value.Amount;

                 });

                $scope.CashTotal = _cashTotal;
                fnCallback(records);
            });
        }

        function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function () {
                $scope.$apply(function () {
                    GetRecord(aData);
                });
            });
            return nRow;
        }

        function GetRecord(info) {
            if (info.Id !== undefined) {
                var servCall = APIService.GetCashRegisterById(info.Id);
                servCall.then(function (u) {
                    $scope.recordData = u.data;
                    delete $scope.recordData.$id;

                    console.log($scope.recordData);

                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $window.location.href = "/#/cms/cashregister/list";
                });
            }
        }

        //datatables render name field
        function renderAmount(data, type, full, meta) {
            var amount = "$ " + $filter('number')(full.Amount, "2");
            if (full.Type == 'debit')
                amount = "- " + amount;

            return "<div class='" + full.Type + "'>" + amount + "</div>";
        }

        //datatables render name field
        function renderType(data, type, full, meta) {
            if (full.Type == 'credit')
                return "Crédito";
            else
                return "Débito";
        }

        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy hh:mm");
            return html;
        }

        $scope.doSearch = function ($event) {
            $scope.dtInstance.rerender();
            if ($event != undefined) {
                var target = $event.target;
                target.blur();
            }
        }

        //Keywords
        function getKeywordsByType(type) {
            var servCallType = APIService.getKeywordsByType(type);
            servCallType.then(function (u) {
                $scope.Keywords = u.data.response.docs;
                getUsers();
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        //Employees
        function getUsers() {
            var servCallType = APIService.getUsersSolr();
            servCallType.then(function (u) {
                $scope.Users = u.data.response.docs;
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };


        //CRUD OPERATIONS
        $scope.processForm = function () {
            delete $scope.recordData.CreationUser;
            delete $scope.recordData.LastModificationUser;
            delete $scope.recordData.Service;
            delete $scope.recordData.User;

            if ($scope.recordData.UserId === null)
                delete $scope.recordData.UserId;

            var data = $.param($scope.recordData);
            if ($scope.recordData.Id!==undefined) {
                var servCall = APIService.updateCashRegister($scope.recordData.Id, data);
            } else {
                var servCall = APIService.createCashRegister(data);
            }

            servCall.then(function (u) {
                //Set and display message
                AlertService.SetAlert("El registro fue actualizado con éxito", "success");
                $timeout($scope.doSearch(), 300);

                $scope.recordData = {};
                $scope.recordData.Type = 'credit';
                $scope.recordData.PaymentMethod = 'Efectivo';

                $scope.recordDataForm.$setPristine(true);
                $scope.recordDataForm.$setUntouched();


            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        }

        //Delete Record
        $scope.deleteCashRegister = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Borrar Registro')
                  .textContent('Esta seguro de eliminar este registro?')
                  .ariaLabel('Borrar')
                  .targetEvent(ev)
                  .ok('Borrar')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteCashRegister(data, id);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El registro ha sido eliminado con éxito", "success");
                    $timeout($scope.doSearch(), 1000);

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })

    .controller('CashRegisterCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {

        var id = $stateParams.id;

        $scope.PaymentTypes = [{ name: 'Credito', value: 'credit' }, { name: 'Debito', value: 'debit' }];
        $scope.PaymentMethods = [{ name: 'Efectivo', value: 'cash' }, { name: 'Tarjeta de Credito', value: 'creditCard' }, { name: 'Tarjeta de Debito', value: 'debitCard' }];

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Registro';
            $scope.SubmitButton = 'Actualizar Registro';
        } else {
            $scope.PageTitle = 'Crear Registro';
            $scope.SubmitButton = 'Crear Registro';
        }

        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetCashRegisterById(id);
            servCall.then(function (u) {
                $scope.recordData = u.data;
                delete $scope.recordData.$id;

                console.log($scope.recordData);

                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/cms/cashregister/list";
            });
        }

        //User update
        $scope.processForm = function () {
            var data = $.param($scope.recordData);
            if (id) {
                var servCall = APIService.updateCashRegister(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El registro fue actualizado con éxito", "success");

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createCashRegister(data);
                servCall.then(function (u) {
                    var clientData = u.data;
                    //Set message
                    AlertService.SetAlert("El registro fue creado con éxito", "success");

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
            $window.location.href = "/#/cms/cashregister/list";
        }

        //Delete User
        $scope.deleteCashRegister = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Registro')
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
                var servCall = APIService.deleteCashRegister(data);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("The category has been removed successfully", "success");
                    $window.location.href = "/#/cms/cashregister/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })
