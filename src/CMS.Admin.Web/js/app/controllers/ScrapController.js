'use strict';

angular
    .module('app.controllers')


 .controller('scrapController', function ($scope,$compile, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, AlertService, $rootScope, $filter, $http, $timeout, $mdDialog) {



     $scope.fechaDesde = new Date(moment().subtract(10, 'years'));
     $scope.fechaHasta = new Date(moment());

     $scope.fechaDesde = moment($scope.fechaDesde).format('DD/MM/YYYY');
     $scope.fechaHasta = moment($scope.fechaHasta).format('DD/MM/YYYY');

    
     $scope.dateDesdeinp = new Date(moment().subtract(30, 'days'));
     $scope.dateHastainp = new Date(moment());

     $scope.dateDesdeinp2 = new Date(moment().subtract(30, 'days'));
     $scope.dateHastainp2 = new Date(moment());


     $scope.data = {
         estados: [
             { valor: "10", label: "10" },
             { valor: "100", label: "100" },
             { valor: "1000", label: "1000" },
             { valor: "10000", label: "10000" },
             { valor: "100000", label: "100000" }


         ],
         length: { valor: '100', label: "100" } //This sets the default value of the select in the ui
     };


     $scope.length = { valor: '100', label: "100" };
     var vm = this;
     $scope.selected = {};
     vm.selectAll = false;
     vm.toggleAll = toggleAll;
     vm.toggleOne = toggleOne;
     $scope.show = false;

     var titleHtml = '<input type="checkbox" ng-model="aCtrl.selectAll" ng-click="aCtrl.toggleAll(aCtrl.selectAll, selected)">';

    //datatables configuration
     vm.dtInstance = {};
         vm.dtColumns = [

             DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
                 .renderWith(function (data, type, full, meta) {
                     $scope.selected[full.IdRegScrap] = false;
                     return '<input type="checkbox" ng-model="selected[' + data.IdRegScrap + ']" ng-click="aCtrl.toggleOne(selected)">';
                 }),


             DTColumnBuilder.newColumn('IdRegScrap').withTitle('ID'),

             DTColumnBuilder.newColumn('Fecha').withTitle('Fecha').renderWith(renderDate),

             DTColumnBuilder.newColumn('NumOP').withTitle('OP'),
             DTColumnBuilder.newColumn('PSSMaquinas.Descripcion.toLowerCase()').withTitle('Maquina'),
             DTColumnBuilder.newColumn('IdMaqImputaScrapName.toLowerCase()').withTitle('Maquina Imputa'),

             //DTColumnBuilder.newColumn('FechaRegistro').withTitle('FechaRegistro'),
             DTColumnBuilder.newColumn('PSSActividades.Descripcion').withTitle('Actividad'),
             DTColumnBuilder.newColumn('PSSOperadores.Nombre').withTitle('Operador').renderWith(renderName),

             //DTColumnBuilder.newColumn('IdMaqImputaScrap').withTitle('IdMaqImputaScrap'),
             DTColumnBuilder.newColumn('PSSOrigenesScrap.Descripcion').withTitle('Origen Scrap').renderWith(renderOrigen),

             DTColumnBuilder.newColumn('PSSTiposMaterial.Descripcion.toLowerCase()').withTitle('Tipo Material'),
             DTColumnBuilder.newColumn('Peso').withTitle('Peso'),

             DTColumnBuilder.newColumn('Observaciones').withTitle('Observaciones').notSortable(),
             DTColumnBuilder.newColumn(null).withTitle('Editar').notSortable()
                 .renderWith(actionsHtml)
         ];

         vm.dtOptions = DTOptionsBuilder



             .newOptions()


             .withLanguageSource('/js/angular-datatables-spanish.json')
             .withFnServerData(GetScrapForTable)
             .withDataProp('data')
             .withOption('processing', true)
             .withOption('serverSide', true)
             .withOption('paging', true)
             .withPaginationType('full_numbers')
             .withDisplayLength(100)
             .withOption('scrollX', true)
             .withOption('order', [0, 'desc'])
             .withOption('createdRow', function (row, data, dataIndex) {
                 // Recompiling so we can bind Angular directive to the DT
                 $compile(angular.element(row).contents())($scope);
             })
             .withOption('headerCallback', function (header) {
                 if (!vm.headerCompiled) {
                     // Use this headerCompiled field to only compile header once
                     vm.headerCompiled = true;
                     $compile(angular.element(header).contents())($scope);
                 }
             })
     $scope.start = "";
     


     function GetScrapForTable(sSource, aoData, fnCallback, oSettings) {
         console.log("$scope.dateDesdeinp", $scope.dateDesdeinp);


         var QS = "?start=" + aoData[3].value + "&length=" + aoData[4].value + "&search=" + aoData[5].value.value + "&order=" + aoData[2].value[0].column + "&orderDir=" + aoData[2].value[0].dir + "&draw=" + aoData[0].value + "&dateDesde=" + $scope.fechaDesde + "&dateHasta=" + $scope.fechaHasta;

            $http({
                method: 'GET',
                
                url: $rootScope.webapiurl + "api/PSSScraps/GetPSSScrapServerSide" + QS,
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then(function (result) {
                    console.log("result", result);
                    $scope.Scraps = result.data.data;
                var records = {
                    'draw': result.data.draw,
                    'recordsTotal': result.data.recordsTotal,
                    'recordsFiltered': result.data.recordsFiltered,
                    'data': result.data.data
                };

               

                fnCallback(records);
            });

           
        };

        function actionsHtml(data, type, full, meta) {
            ////        html += '<a href="/#/blsp/origenScrap/crud/' + full.IDOrigen + '"><strong>' + full.Descripcion + '</strong></a>';


            return '<a class="btn btn-danger"  href="/#/blsp/scrap/crud/' + data.IdRegScrap + '"><i style="position:inherit" class="fa fa-edit"></i></a>' +
                '&nbsp;';
        }


        function toggleAll(selectAll, selectedItems) {
            var verdaderos = [];
            var falsos = [];
            angular.forEach($scope.selected, function (value, key) {


                if (!value) {


                    verdaderos.push(key);

                } else {

                    falsos.push(key);


                }




            });

            if (verdaderos.length > 0) {

                $scope.show = true;

            }
            else if (verdaderos.length === 0) {


                $scope.show = false;


            }

            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;


                }
            }
        }
        function toggleOne(selectedItems) {

            var verdaderos = [];
            var falsos = [];
            angular.forEach($scope.selected, function (value, key) {


                if (value) {


                    verdaderos.push(key);

                } else
                {

                    falsos.push(key);


                }

             


            });

            if (verdaderos.length > 0)
            {

                $scope.show = true;

            }
            else if (verdaderos.length === 0)
            {


                $scope.show = false;


            }


            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        vm.selectAll = false;

                        

                        return;
                    }
                }
            }
            vm.selectAll = true;
        }

        $scope.deleteMultiple = function (ev, selected) {

        // $scope.deleteMultiple = function (selected){
          // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                          .title('Eliminar Scrap')
                          .textContent('Esta seguro de eliminar estos registros?')
                          .ariaLabel('Borrar')
                          .targetEvent(ev)
                          .ok('Borrar')
                          .cancel('Cancel');

                    $mdDialog.show(confirm).then(function () {
                        //confirmed

                        angular.forEach(selected, function (value, key) {
                            if (value) {

                                var servCallType = APIService.deleteScrap(key);
                                servCallType.then(function (u) {
                                    $scope.Deleted = u.data;
                                    vm.dtInstance.DataTable.draw();
                                    $scope.show = false;

                                })


                            }


                         });





          
                    })



        }


        function capitalize(s) {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
        }

     //datatables render name field
        function renderName(data, type, full, meta) {

            var nombre = full.nombre;
            var apellido = full.apellido;


            return capitalize(full.PSSOperadores.Nombre) + ", " + capitalize(full.PSSOperadores.Apellido);
        }

        function renderOrigen(data, type, full, meta) {

            

            return capitalize(full.PSSOrigenesScrap.Descripcion);;
        }

     //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy HH:mm");
            return html;
        }

    //TRAE TODOS LOS ORIGENES
     function GetScrap() {
         console.log("1");
            var servCallType = APIService.GetPSSScrapServerSider($scope.fechaDesde,$scope.fechaHasta);
         servCallType.then(function (u) {
             console.log("2");
                $scope.ScrapsTotal = u.data;



                for (var i = 0; i < $scope.ScrapsTotal.length; i++) {

                    $scope.ScrapsTotal[i].Fecha = moment($scope.Scraps[i].Fecha).format('DD/MM/YYYY HH:mm:ss');



                }

            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };


        $scope.doSearch = function () {
        vm.dtInstance.DataTable.search($scope.searchQuery).draw();

       }


     $scope.changeLength = function (valor) {
         console.log($scope.length);
         vm.dtInstance.DataTable.draw();

     }



    //.controller('scrapController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

    //    //Display message if necessary
    //    AlertService.ShowAlert($scope);
        //GetScrap();

        //TRAE TODOS LOS ORIGENES
     $scope.GetScrap = function (newScrop) {
            var servCallType = APIService.GetScrap();
         servCallType.then(function (u) {
             console.log("2 2");
                $scope.Scraps = newScrop;

               

                for (var i = 0; i < $scope.Scraps.length; i++) {

                    $scope.Scraps[i].Fecha = moment($scope.Scraps[i].Fecha).format();


                }


            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        $scope.doSearch2 = function () {

            if ($scope.dateDesdeinp != "" && $scope.dateDesdeinp != null && $scope.dateHastainp != "" && $scope.dateHastainp != null) {

                $scope.fechaDesde = moment($scope.dateDesdeinp);
                $scope.fechaHasta = moment($scope.dateHastainp);

                $scope.fechaDesde = moment($scope.fechaDesde).format('DD/MM/YYYY');
                $scope.fechaHasta = moment($scope.fechaHasta).format('DD/MM/YYYY');

                vm.dtInstance.DataTable.draw();

               
                //$scope.exportData();

                $scope.mensaje = "";
            } else {

                $scope.mensaje = "Fecha/s Invalida/s";
            }



     }

     $scope.doSearch3 = function () {

         $scope.butonVisible = true;
         $scope.successMessage2 = "Preparando Archivo...";

         if ($scope.dateDesdeinp2 != "" && $scope.dateDesdeinp2 != null && $scope.dateHastainp2 != "" && $scope.dateHastainp2 != null) {
             $scope.fechaDesde2 = moment($scope.dateDesdeinp2);
             $scope.fechaHasta2 = moment($scope.dateHastainp2);

             $scope.fechaDesde2 = moment($scope.fechaDesde2).format('DD/MM/YYYY');
             $scope.fechaHasta2 = moment($scope.fechaHasta2).format('DD/MM/YYYY');


             console.log("$scope.fechaDesde2", $scope.fechaDesde2);
             console.log("$scope.fechaHasta2", $scope.fechaHasta2);

             var servCallType = APIService.scrapExcel($scope.fechaDesde2, $scope.fechaHasta2);

             servCallType.then(function (u) {
                 console.log("9");
                 $scope.ScrapsTotal = u.data;
                 $scope.exportData();
                 $scope.butonVisible = false;

                 console.log("$scope.ScrapsTotal", $scope.ScrapsTotal)
                 $scope.successMessage2 = "Archivo Descargado con Exito";

                 $timeout(function () {
                     $scope.successMessage2 = null;
                 }, 3000);

             }, function (error) {
                     $scope.butonVisible = false;

                 $scope.errorMessage2 = "Oops, something went wrong.";
             });
            








             $scope.mensaje = "";
         } else {

             $scope.mensaje = "Fecha/s Invalida/s";
         }



     }

        

    //    function ServerSideProcessingCtrl(DTOptionsBuilder, DTColumnBuilder) {
    //        var vm = this;
    //        alert("llega");
    //        vm.dtOptions = DTOptionsBuilder.newOptions()
    //            .withOption('ajax', {
    //                // Either you specify the AjaxDataProp here
    //                dataSrc: $scope.Scraps,
    //                //url: 'data/serverSideProcessing',
    //                type: 'POST'
    //            })
    //         // or here
    //         .withDataProp('data')
    //            .withOption('processing', true)
    //            .withOption('serverSide', true)
    //            .withPaginationType('full_numbers');
    //        vm.dtColumns = [
    //            DTColumnBuilder.newColumn('Fecha').withTitle('Fecha'),
    //            DTColumnBuilder.newColumn('FechaRegistro').withTitle('FechaRegistro'),
    //            DTColumnBuilder.newColumn('IdActividad').withTitle('IdActividad')
    //        ];
    //    }

        

    //    //$scope.dtInstance = {};

    //    //$scope.dtOptions = DTOptionsBuilder
    //    //            .newOptions()
    //    //            .withLanguageSource('/js/angular-datatables-spanish.json')
    //    //            .withOption('paging', true)
    //    //            .withPaginationType('full_numbers')
    //    //            .withDisplayLength(30)
    //    //            .withOption('order', [1, 'asc'])
    //    //            .withOption('serverSide', true)

        



    //    //datatables render name field
    ////    function renderTitle(data, type, full, meta) {
    ////        var css = "times-circle red";
    ////        if (full.Habilitado == true)
    ////            css = "check-circle blue";

    ////        var html = '<i class="fa fa-' + css + '"></i>';
    ////        html += '<a href="/#/blsp/origenScrap/crud/' + full.IDOrigen + '"><strong>' + full.Descripcion + '</strong></a>';
    ////        return html;
    ////    }

    ////    //datatables render date field
    ////    function renderDate(data, type, full, meta) {
    ////        var html = $filter('date')(data, "d-MMM-yyyy");
    ////        return html;
    ////    }

    ////    //datatables render Array Origenes
    ////    function renderArrayOrigenes(data, type, full, meta) {
    ////        var html = "<ul>";
    ////        angular.forEach(full.PSSOrigenesScrap, function (value, key) {

    ////            html += '<li class="listaTabla">' + value.Descripcion + '</li>';


    ////        });

    ////        html += "</ul>";
    ////        return html;
    ////    }

    ////    //datatables render Array Materiales
    ////    function renderArrayMateriales(data, type, full, meta) {
    ////        var html = "<ul>";
    ////        angular.forEach(full.PSSTiposMaterial, function (value, key) {

    ////            html += '<li class="listaTabla">' + value.Descripcion + '</li>';


    ////        });

    ////        html += "</ul>";
    ////        return html;
    ////    }

      




    ////    $scope.doSearch = function () {
    ////        $scope.dtInstance.DataTable.search($scope.searchQuery).draw();

    ////    }



        //Start*To Export SearchTable data in excel  
        // create XLS template with your field.  
        var mystyle = {
            headers: true,
            columns: [

                
                { columnid: 'ID', title: 'Id' },
                { columnid: 'FECHA', title: 'Fecha' },
                { columnid: 'OP', title: 'OP' },
                { columnid: 'MAQUINA', title: 'Maquina' },
                { columnid: 'MAQUINA_IMPUTA', title: 'Maquina Imputa' },
                { columnid: 'ACTIVIDAD', title: 'Actividad' },

                { columnid: 'OPERADOR', title: 'Operador Nombre' },
                { columnid: 'ORIGEN_SCRAP', title: 'Origen Scrap' },
                { columnid: 'TIPO_MATERIAL', title: 'TIpo Material' },

                { columnid: 'PESO', title: 'Peso' },
                { columnid: 'OBSERVACIONES', title: 'Observaciones' },
                { columnid: 'PRODUCTO', title: 'producto' },

            ],
        };





        // function to use on ng-click.  
        //$scope.searchCaseResult is your json data which cominmg from database or Controller.  
        $scope.exportData = function () {
            //get current system date.         
            var date = new Date();
            $scope.CurrentDateTime = $filter('date')(new Date().getTime(), 'MM/dd/yyyy HH:mm:ss');
            


            //for (var i = 0; i < $scope.ScrapsTotal.length; i++) {
            //    console.log("test",$scope.ScrapsTotal[i]);
            //    $scope.ScrapsTotal[i].Maquina = $scope.ScrapsTotal[i].PSSMaquinas.Descripcion;
            //    $scope.ScrapsTotal[i].Actividad = $scope.ScrapsTotal[i].PSSActividades.Descripcion;
            //    $scope.ScrapsTotal[i].Operador = $scope.ScrapsTotal[i].PSSOperadores.Nombre + ", " + $scope.ScrapsTotal[i].PSSOperadores.Apellido;
            //    $scope.ScrapsTotal[i].Origen = $scope.ScrapsTotal[i].PSSOrigenesScrap.Descripcion;
            //    $scope.ScrapsTotal[i].Material = $scope.ScrapsTotal[i].PSSTiposMaterial.Descripcion;





            //}

         


            console.log("haciendo excel");
            console.log($scope.ScrapsTotal);

        

            //Create XLS format using alasql.js file. 
            alasql('SELECT  ID,FECHA,OP,PRODUCTO,MAQUINA,MAQUINA_IMPUTA,ACTIVIDAD,OPERADOR,ORIGEN_SCRAP,TIPO_MATERIAL,PESO,OBSERVACIONES  INTO XLSX("SCRAP' + $scope.CurrentDateTime + '.xlsx",?) FROM ?', [mystyle, $scope.ScrapsTotal]);
        };
        //End*To Export SearchTable data in excel  





    })












    .controller('scrapCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder, 
        $element) {











        var id = $stateParams.id;

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json');

        //labels
        if (id) {
            $scope.PageTitle = 'Editar Scrap';
            $scope.SubmitButton = 'Actualizar Scrap';



         





        } else {
            $scope.PageTitle = 'Crear Origen Scrap';
            $scope.SubmitButton = 'Crear Origen Scrap';



        }




        //Gets category by Id for edit fields
        if (id) {
            var servCall = APIService.GetScrapById(id);
            servCall.then(function (u) {
                $scope.scrapData = u.data;
                //$scope.scrapData.Fecha = moment($scope.scrapData.Fecha).format('DD/MM/YYYY HH:mm:ss');

                delete $scope.scrapData.$id;


                
                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/blsp/scrap/list";
            });
        }

        var CallAreas = APIService.GetAreas();
        CallAreas.then(function (u) {
            $scope.areas = u.data;


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var CallMaquinas = APIService.GetMaquinas();
        CallMaquinas.then(function (u) {
            $scope.maquinas = u.data;


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });


        var CallOrigenes = APIService.GetOrigenes();
        CallOrigenes.then(function (u) {
            $scope.origenes = u.data;
          

            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });




        var CallJobTrack = APIService.GetJobTrack();
        CallJobTrack.then(function (u) {
            $scope.jobtrack = u.data;
   

            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });




        var CallTipos = APIService.GetTipos();
        CallTipos.then(function (u) {
            $scope.tipos = u.data;


            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });


        var CallActividad = APIService.GetActividad();
        CallActividad.then(function (u) {
            $scope.actividades = u.data;
          

            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var CallOperadores = APIService.GetOperadores();
        CallOperadores.then(function (u) {
            $scope.operadores = u.data;
           

            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });


        //User update
        $scope.processForm = function () {
            
       
            var data = $.param($scope.scrapData);

            if (id) {

                var servCall = APIService.updateScrap(id, data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("El Scrap fue actualizado con éxito", "success");
                    $window.location.href = "/#/blsp/scrap/list";

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

       
        $scope.vegetables = ['Corn', 'Onions', 'Kale', 'Arugula', 'Peas', 'Zucchini'];
        $scope.searchTerm;
        $scope.clearSearchTerm = function () {
            $scope.searchTerm = '';
        };
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });
        




        //Delete User
        $scope.deleteScrap = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Eliminar Scrap')
                  .textContent('Esta seguro de eliminar este Scrap?')
                  .ariaLabel('Borrar')
                  .targetEvent(ev)
                  .ok('Borrar')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteScrap(id);
                servCall.then(function (u) {
                    //Set message
                    $window.location.href = "/#/blsp/scrap/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

    })

