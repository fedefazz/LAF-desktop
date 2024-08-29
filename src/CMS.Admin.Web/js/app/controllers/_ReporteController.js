'use strict';
angular
    .module('app.controllers')

    .controller('ReporteController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);
        console.log("lega");


        //TRAE TODOS LOS ORIGENES
        function GetReporte1(query) {
            console.log(query);
            $scope.show = true;

            var servCallType = APIService.GetReporte1(query);
            servCallType.then(function (u) {
                console.log(u);
                $scope.reporte1 = u.data;



                var servCallReporte1_1 = APIService.GetReporte1_1(query);
                servCallReporte1_1.then(function (e) {

                    console.log(e);
                    $scope.totalOp = e.data;


                })

               



                

            }, function (error) {
                $scope.errorMessage = "La OP no existe";
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

            if ($scope.searchQuery != "" && $scope.searchQuery != null) {

                GetReporte1($scope.searchQuery);
                $scope.mensaje = "";
            } else {

                $scope.mensaje = "OP Invalida";
            }

            //$scope.dtInstance.DataTable.search($scope.searchQuery).draw();




        }



        //Start*To Export SearchTable data in excel  
        // create XLS template with your field.  
        var mystyle = {
            headers: true,
            columns: [

                
              { columnid: 'CodAtiv', title: 'CodAtiv' },
              { columnid: 'CodRecurso', title: 'CodRecurso' },
              { columnid: 'DescripcionOP', title: 'DescripcionOP' },
              { columnid: 'FatorPesoProducao', title: 'FatorPesoProducao' },
              { columnid: 'KGScrap', title: 'KGScrap' },
              { columnid: 'NUMORDEM', title: 'NUMORDEM' },

              { columnid: 'QtdProduzidaKg', title: 'QtdProduzidaKg' },
              { columnid: 'QtdProduzidaMts', title: 'QtdProduzidaMts' },
              { columnid: 'incidencia', title: 'incidencia' },

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

            //for (var i = 0; i < $scope.Scraps.length; i++) {


            //    $scope.Scraps[i].Fecha = moment($scope.Scraps[i].Fecha).format('dd/MM/yyyy HH:mm:ss');


            //}


            
            console.log($scope.reporte1);


            //Create XLS format using alasql.js file.  
            alasql('SELECT CodAtiv,CodRecurso,DescripcionOP,FatorPesoProducao,KGScrap,NUMORDEM,QtdProduzidaKg,QtdProduzidaMts, incidencia INTO XLSX("Reporte OP Cerrada - ' + $scope.searchQuery + '.xlsx",?) FROM ?', [mystyle, $scope.reporte1]);
        };
        //End*To Export SearchTable data in excel  

    })
        .controller('Reporte2Controller', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //    //Display message if necessary
        //    AlertService.ShowAlert($scope);

        ////TRAE TODOS LOS ORIGENES
        //function GetReporte2(dateDesde,dateHasta) {
        //    console.log(dateDesde);
        //    console.log(dateHasta);

        //    var servCallType = APIService.GetReporte2(dateDesde, dateHasta);
        //    servCallType.then(function (u) {
        //        $scope.show = true;

        //        console.log(u);
        //        $scope.reporte2 = u.data;
        //        $scope.dtInstance = {};

        //        $scope.dtOptions = DTOptionsBuilder
        //                    .newOptions()
        //                    .withLanguageSource('/js/angular-datatables-spanish.json')
        //                    .withOption('paging', true)
        //                    .withPaginationType('full_numbers')
        //                    .withDisplayLength(20)
        //                    .withOption('order', [0, 'asc'])
        //                    .withOption('scrollX', 'true')






        //    }, function (error) {
        //        $scope.errorMessage = "La OP no existe";
        //        $scope.show = false;

        //    });
        //};
        //$scope.dtInstance = {};

        //$scope.dtOptions = DTOptionsBuilder
        //                .newOptions()
        //                .withLanguageSource('/js/angular-datatables-spanish.json')
        //                .withOption('paging', true)
        //                .withPaginationType('full_numbers')
        //                .withDisplayLength(20)
        //                .withOption('order', [1, 'asc'])
        //                .withOption('scrollX', 'true')




        //$scope.doSearch = function () {

          

        //    if ($scope.dateDesdeinp != "" && $scope.dateDesdeinp != null && $scope.dateHastainp != "" && $scope.dateHastainp != null) {



        //        $scope.fechaDesde = moment($scope.dateDesdeinp).format('DD/MM/YYYY');
        //        $scope.fechaHasta = moment($scope.dateHastainp).format('DD/MM/YYYY');

        //        GetReporte2($scope.fechaDesde, $scope.fechaHasta);
        //        $scope.mensaje = "";
        //    } else {

        //        $scope.mensaje = "Fecha/s Invalida/s";
        //    }





        //}


            //-----------------------------------------------------------------------------------------------------------------

            //Display message if necessary
        AlertService.ShowAlert($scope);
        console.log("lega al 2");


            //TRAE TODOS LOS ORIGENES
        function GetReporte2(dateDesde, dateHasta, tipo) {
            $scope.show = true;

            var servCallType = APIService.GetReporte2(dateDesde, dateHasta,tipo);
            servCallType.then(function (u) {
                console.log(u);
                $scope.reporte2 = u.data;

                $scope.dtInstance = {};

                $scope.dtOptions = DTOptionsBuilder
                            .newOptions()
                            .withLanguageSource('/js/angular-datatables-spanish.json')
                            .withOption('paging', true)
                            .withPaginationType('full_numbers')
                            .withDisplayLength(40)
                            .withOption('order', [1, 'asc'])
                            .withOption('scrollX', 'true')
                            .withOption('scrollY', '400px')
.withFixedColumns({
    leftColumns: 1});







            }, function (error) {
                $scope.errorMessage = "La OP no existe";
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
                                        .withOption('scrollX', 'true')



       

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

        $scope.data = {
            estados :  [
         { valor: "T", label: "Todas las OP" },
         { valor: "A", label: "OP Abiertas" },
         { valor: "E", label: "OP Cerradas" }
            ],
            selectedOption: { valor: 'T', label: "Todas las OP" } //This sets the default value of the select in the ui
        };
       



        $scope.doSearch = function () {

            if ($scope.dateDesdeinp != "" && $scope.dateDesdeinp != null && $scope.dateHastainp != "" && $scope.dateHastainp != null) {

                console.log($scope.data.selectedOption.valor);

                $scope.fechaDesde = moment($scope.dateDesdeinp).format('DD/MM/YYYY');
                $scope.fechaHasta = moment($scope.dateHastainp).format('DD/MM/YYYY');

                GetReporte2($scope.fechaDesde, $scope.fechaHasta, $scope.data.selectedOption.valor);
                $scope.mensaje = "";
            } else {

                $scope.mensaje = "Fecha/s Invalida/s";
            }



        }


            //---------------------------------------------------------------------------------------------------------------


            //Start*To Export SearchTable data in excel  
            // create XLS template with your field.  
        var mystyle = {
            headers: true,
            columns: [


              { columnid: 'NUMOP', title: 'OP' },
              { columnid: 'CORTE_N1', title: 'CORTE_N1' },
              { columnid: 'CORTE_N2', title: 'CORTE_N2' },
              { columnid: 'CORTE_N3', title: 'CORTE_N3' },
              { columnid: 'DOYPACK', title: 'DOYPACK' },
              { columnid: 'EMBOSSING', title: 'EMBOSSING' },

              { columnid: 'IMPRESION_F', title: 'IMPRESION_F' },
              { columnid: 'IMPRESION_H', title: 'IMPRESION_H' },

              { columnid: 'LAMINACION_1', title: 'LAMINACION_1' },
              { columnid: 'LAMINACION_2', title: 'LAMINACION_2' },
              { columnid: 'LAMINACION_3', title: 'LAMINACION_3' },
              { columnid: 'MANGAS_COR', title: 'MANGAS_COR' },
              { columnid: 'MANGAS_PEG', title: 'MANGAS_PEG' },
              { columnid: 'MANGAS_REV', title: 'MANGAS_REV' },

              { columnid: 'PLIEGOS_COR', title: 'PLIEGOS_COR' },
              { columnid: 'PLIEGOS_EMB', title: 'PLIEGOS_EMB' },

              { columnid: 'PLIEGOS_TROQ', title: 'PLIEGOS_TROQ' },

              { columnid: 'REVISADO_N1', title: 'REVISADO_N1' },
              { columnid: 'REVISADO_N2', title: 'REVISADO_N2' },

               { columnid: 'REVISADO_N3', title: 'REVISADO_N3' },
              { columnid: 'REVISADO_N4', title: 'REVISADO_N4' },


              { columnid: 'PorcentajeTotalScrap', title: 'PorcentajeTotalScrap' },

               { columnid: 'TotalKgProducidos', title: 'TotalKgProducidos' },
              { columnid: 'TotalScrap', title: 'TotalScrap' },

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

            //for (var i = 0; i < $scope.Scraps.length; i++) {


            //    $scope.Scraps[i].Fecha = moment($scope.Scraps[i].Fecha).format('dd/MM/yyyy HH:mm:ss');


            //}



            console.log($scope.reporte2);


            //Create XLS format using alasql.js file.  
            alasql('SELECT NUMOP,CORTE_N1,CORTE_N2,CORTE_N3,DOYPACK,EMBOSSING,IMPRESION_F,IMPRESION_H,LAMINACION_1,LAMINACION_2,LAMINACION_3,MANGAS_COR,MANGAS_PEG,MANGAS_REV,PLIEGOS_COR,PLIEGOS_EMB,PLIEGOS_TROQ,REVISADO_N1,REVISADO_N2,REVISADO_N3,REVISADO_N4,PorcentajeTotalScrap,TotalKgProducidos,TotalScrap INTO XLSX("Reporte OP x FECHA - Desde (' + $scope.fechaDesde + ') Hasta (' + $scope.fechaHasta + ').xlsx",?) FROM ?', [mystyle, $scope.reporte2]);
        };
            //End*To Export SearchTable data in excel  





    })












    //.controller('scrapCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder, 
    //    $element) {











    //    var id = $stateParams.id;

    //    $scope.dtInstance = {};

    //    $scope.dtOptions = DTOptionsBuilder
    //                .newOptions()
    //                .withLanguageSource('/js/angular-datatables-spanish.json');

    //    //labels
    //    if (id) {
    //        $scope.PageTitle = 'Editar Scrap';
    //        $scope.SubmitButton = 'Actualizar Scrap';



         





    //    } else {
    //        $scope.PageTitle = 'Crear Origen Scrap';
    //        $scope.SubmitButton = 'Crear Origen Scrap';



    //    }




    //    //Gets category by Id for edit fields
    //    if (id) {
    //        var servCall = APIService.GetScrapById(id);
    //        servCall.then(function (u) {
    //            $scope.scrapData = u.data;
    //            //$scope.scrapData.Fecha = moment($scope.scrapData.Fecha).format('DD/MM/YYYY HH:mm:ss');

    //            delete $scope.scrapData.$id;

    //            console.log($scope.scrapData);

                
    //            AlertService.ShowAlert($scope);
    //        }, function (error) {
    //            $window.location.href = "/#/blsp/scrap/list";
    //        });
    //    }

    //    var CallAreas = APIService.GetAreas();
    //    CallAreas.then(function (u) {
    //        $scope.areas = u.data;
    //        console.log($scope.areas);


    //        AlertService.ShowAlert($scope);
    //    }, function (error) {
    //        $window.location.href = "/#/blsp/maquinas/list";
    //    });

    //    var CallMaquinas = APIService.GetMaquinas();
    //    CallMaquinas.then(function (u) {
    //        $scope.maquinas = u.data;
    //        console.log($scope.maquinas);


    //        AlertService.ShowAlert($scope);
    //    }, function (error) {
    //        $window.location.href = "/#/blsp/maquinas/list";
    //    });


    //    var CallOrigenes = APIService.GetOrigenes();
    //    CallOrigenes.then(function (u) {
    //        $scope.origenes = u.data;
    //        console.log("ORIGENES");

    //        console.log($scope.origenes);


    //        AlertService.ShowAlert($scope);
    //    }, function (error) {
    //        $window.location.href = "/#/blsp/maquinas/list";
    //    });




    //    var CallJobTrack = APIService.GetJobTrack();
    //    CallJobTrack.then(function (u) {
    //        $scope.jobtrack = u.data;
    //        console.log("JobTrack");

    //        console.log($scope.jobtrack);


    //        AlertService.ShowAlert($scope);
    //    }, function (error) {
    //        $window.location.href = "/#/blsp/maquinas/list";
    //    });




    //    var CallTipos = APIService.GetTipos();
    //    CallTipos.then(function (u) {
    //        $scope.tipos = u.data;
    //        console.log($scope.tipos);


    //        AlertService.ShowAlert($scope);
    //    }, function (error) {
    //        $window.location.href = "/#/blsp/maquinas/list";
    //    });


    //    var CallActividad = APIService.GetActividad();
    //    CallActividad.then(function (u) {
    //        $scope.actividades = u.data;
    //        console.log("ACTIVIDADES");
    //        console.log($scope.actividades);


    //        AlertService.ShowAlert($scope);
    //    }, function (error) {
    //        $window.location.href = "/#/blsp/maquinas/list";
    //    });

    //    var CallOperadores = APIService.GetOperadores();
    //    CallOperadores.then(function (u) {
    //        $scope.operadores = u.data;
    //        console.log("OPERADORES");
    //        console.log($scope.operadores);


    //        AlertService.ShowAlert($scope);
    //    }, function (error) {
    //        $window.location.href = "/#/blsp/maquinas/list";
    //    });


    //    //User update
    //    $scope.processForm = function () {
            
    //        //$scope.clientData.IsEnabled = true;
    //        //$scope.clientData.CompanyId = 2;

    //        var data = $.param($scope.scrapData);
    //        console.log("------------------------");

    //        if (id) {
    //            console.log(data);

    //            var servCall = APIService.updateScrap(id, data);
    //            servCall.then(function (u) {
    //                //Set and display message
    //                AlertService.SetAlert("El Scrap fue actualizado con éxito", "success");
    //                $window.location.href = "/#/blsp/scrap/list";

    //                AlertService.ShowAlert($scope);
    //            }, function (error) {
    //                $scope.errorMessage = "Oops, something went wrong.";
    //            });
    //        } else {
    //            var servCall = APIService.createOrigen(data);
    //            servCall.then(function (u) {
    //                var origenData = u.data;
    //                //Set message
    //                AlertService.SetAlert("El Origen fue creado con éxito", "success");
    //                $window.location.href = "/#/blsp/origenScrap/crud/" + origenData.IDOrigen;
    //            }, function (error) {
    //                $scope.errorMessage = "Oops, something went wrong.";
    //            });
    //        }
    //    }

       
    //    $scope.vegetables = ['Corn', 'Onions', 'Kale', 'Arugula', 'Peas', 'Zucchini'];
    //    $scope.searchTerm;
    //    $scope.clearSearchTerm = function () {
    //        $scope.searchTerm = '';
    //    };
    //    // The md-select directive eats keydown events for some quick select
    //    // logic. Since we have a search input here, we don't need that logic.
    //    $element.find('input').on('keydown', function (ev) {
    //        ev.stopPropagation();
    //    });
        




    //    //Delete User
    //    $scope.deleteScrap = function (ev, id) {
    //        //var custName = id;

    //        // Appending dialog to document.body to cover sidenav in docs app
    //        var confirm = $mdDialog.confirm()
    //              .title('Eliminar Scrap')
    //              .textContent('Esta seguro de eliminar este Scrap?')
    //              .ariaLabel('Borrar')
    //              .targetEvent(ev)
    //              .ok('Borrar')
    //              .cancel('Cancel');

    //        $mdDialog.show(confirm).then(function () {
    //            //confirmed
    //            var data = $.param({
    //                id: id,
    //            })
    //            var servCall = APIService.deleteScrap(id);
    //            servCall.then(function (u) {
    //                //Set message
    //                AlertService.SetAlert("El Scrap ha sido eliminado con exito", "success");
    //                $window.location.href = "/#/blsp/scrap/list";
    //            }, function (error) {
    //                $scope.errorMessage = "Oops, something went wrong.";
    //            })
    //        }, function () {
    //            //cancel
    //        });
    //    }

    //})

