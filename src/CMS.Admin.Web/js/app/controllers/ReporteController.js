'use strict';
angular
    .module('app.controllers')

    .controller('ReporteController', ['$scope', 'APIService', '$window', '$cookies', '$route', 'DTOptionsBuilder', 'DTColumnBuilder', 'AlertService', '$rootScope', '$filter', '$http', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);
        console.log("lega");
        $scope.errorMessage = "";


        //TRAE TODOS LOS ORIGENES
        function GetReporte1(query) {
            console.log(query);
            $scope.show = true;

            var servCallType = APIService.GetReporte1(query);
            servCallType.then(function (u) {
                console.log(u);
                $scope.reporte1 = u.data;

                $scope.errorMessage = "";


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
                $scope.dtInstance.rerender();

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

    }])
        .controller('Reporte2Controller', ['$scope', 'APIService', '$window', '$cookies', '$route', 'DTOptionsBuilder', 'DTColumnBuilder', 'AlertService', '$rootScope', '$filter', '$http', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

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



            $scope.dateDesdeinp = new Date(moment().subtract(30, 'days'));
            $scope.dateHastainp = new Date(moment());

            //-----------------------------------------------------------------------------------------------------------------

            //Display message if necessary
            AlertService.ShowAlert($scope);
            console.log("lega al 2");


            //TRAE TODOS LOS ORIGENES
            function GetReporte2(dateDesde, dateHasta, tipo) {
                $scope.show = true;
                $scope.errorMessage = "";



                var servCallType = APIService.GetReporte2(dateDesde, dateHasta, tipo);
                servCallType.then(function (u) {
                    console.log(u);
                    $scope.reporte2 = u.data;
                    // $scope.dtInstance.DataTable.Draw();
                    console.log("-------------");

                    console.log($scope.dtInstance);
                    $scope.errorMessage = "";


                }, function (error) {
                    $scope.errorMessage = "La OP no existe";
                });
            };



            ;

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
    leftColumns: 1
})






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
                estados: [
             { valor: "T", label: "Todas las OP" },
             { valor: "A", label: "OP Abiertas" },
             { valor: "E", label: "OP Cerradas" }
                ],
                selectedOption: { valor: 'T', label: "Todas las OP" } //This sets the default value of the select in the ui
            };




            $scope.doSearch = function () {



                if ($scope.dateDesdeinp != "" && $scope.dateDesdeinp != null && $scope.dateHastainp != "" && $scope.dateHastainp != null) {

                    $scope.dtInstance.rerender();

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





        //}]).controller('ReporteRomaneoController', ['$scope', 'APIService', '$window', '$cookies', '$route', 'DTOptionsBuilder', 'DTColumnBuilder', 'AlertService','$mdDialog', '$rootScope', '$filter', '$http', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http, $mdDialog) {

        }]).controller('ReporteRomaneoController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder, $filter, $http, $route) {

            console.log("lega al 2");

      $scope.dateDesdeinp = new Date(moment().subtract(30, 'days'));
      $scope.dateHastainp = new Date(moment());

      //-----------------------------------------------------------------------------------------------------------------

      //Display message if necessary
      AlertService.ShowAlert($scope);


      //TRAE TODOS LOS ORIGENES
      function GetReporteRomaneo(pNroOf, pCodProducto, dateDesde, dateHasta, pTurno, pTipoRomaneo) {
          $scope.show = true;


          var servCallType = APIService.GetReporteRomaneo(pNroOf, pCodProducto, dateDesde, dateHasta, pTurno, pTipoRomaneo);
          servCallType.then(function (u) {
              $scope.reporteRomaneo = u.data;

          }, function (error) {
              $scope.errorMessage = "No hay datos";
          });
      };

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
                   leftColumns: 1
                  })
                  .withOption('footerCallback', function (row, data, start, end, display) {
                  var api = this.api(), data;
                      var total = 0;
                      var pageTotal = 0;

              // Remove the formatting to get integer data for summation
              var intVal = function (i) {
                  return typeof i === 'string' ?
                      i.replace(',', '.') : "0";
                      
                  };

                      
                      var columnasArray = [8,9,10,11,12,13,14,15];

                      angular.forEach(columnasArray, function (value, key) {


                          if (value != 8) {
                              // Total over all pages
                              total = api
                                  .column(value)
                                  .data()
                                  .reduce(function (a, b) {

                                      return parseFloat(a.toString().replace(',', '.')) + parseFloat(b.toString().replace(',', '.'));
                                  }, 0);
                              console.log("Total no en 8", total)

                             // Total over this page
                              pageTotal = api
                                  .column(value, { page: 'current' })
                                  .data()
                                  .reduce(function (a, b) {
                                      return parseFloat(a.toString().replace(',', '.')) + parseFloat(b.toString().replace(',', '.'));
                                  }, 0);
                              console.log("Pagetotal no en 8", pageTotal)


                          } else {


                              angular.forEach(api.column(value, { page: 'current' }).data(), function (value, key) {

                                  pageTotal++;
                                  console.log("pageTotal en 8",pageTotal)


                              });

                              angular.forEach(api.column(8).data(), function (value, key) {

                                  total++;
                                  console.log("Total en 8", total)


                              });


                          }

              // Update footer
                          $(api.column(value).footer()).html(
                              '<strong class="tablaromaneospan">' + (pageTotal).toLocaleString() + '</strong>' + '<br>(' + (total).toLocaleString() + ')'
                          );

                      });
                  });
            $scope.cambiarNumero = function (data) {
                data = data.toLocaleString();
                return data;
            }

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
          turnos: [
              { valor: '', label: "Todos" },

       { valor: 1, label: "TM" },
       { valor: 2, label: "TT" },
       { valor: 3, label: "TN" }
          ],
          selectedOption: { valor: '', label: "TODOS" } //This sets the default value of the select in the ui
      };

      $scope.data2 = {
          tipos: [
              { valor: '', label: "Todos" },

              { valor: "doypack", label: "DoyPack" },
              { valor: "mangas", label: "Mangas" },
              { valor: "por metro", label: "x Mts" },
              { valor: "por kilo", label: "x Kgs" },
              { valor: "por kilo y metros", label: "x Kgs - Mts" },
              { valor: "por metro cuadrado", label: "x Mts2" }

          ],
          selectedOption: { valor: '', label: "Todos" } //This sets the default value of the select in the ui
      };




      $scope.doSearch = function () {



          if ($scope.dateDesdeinp != "" && $scope.dateDesdeinp != null && $scope.dateHastainp != "" && $scope.dateHastainp != null) {

              if ($scope.dtInstance == null) {
                  $scope.dtInstance.rerender();
              }
              

              $scope.fechaDesde = moment($scope.dateDesdeinp).format('DD/MM/YYYY');
              $scope.fechaHasta = moment($scope.dateHastainp).format('DD/MM/YYYY');

              GetReporteRomaneo($scope.pNroOf, $scope.pCodProducto, $scope.fechaDesde, $scope.fechaHasta, $scope.data.selectedOption.valor, $scope.data2.selectedOption.valor);
              $scope.mensaje = "";
          } else {

              $scope.mensaje = "Fecha/s Invalida/s";
          }



            }




            //Delete User
            $scope.deleteRomaneo = function (ev, id) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Eliminar Romaneo')
                    .textContent('Esta seguro de eliminar esta registro?')
                    .ariaLabel('Borrar')
                    .targetEvent(ev)
                    .ok('Borrar')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function () {
                    //confirmed
                    var data = $.param({
                        id: id,
                    })
                    var servCall = APIService.deleteRomaneo(id);

                    servCall.then(function (u) {
                        //Set message
                        AlertService.SetAlert("El registro ha sido eliminado con exito", "success");
                        GetReporteRomaneo($scope.pNroOf, $scope.pCodProducto, $scope.fechaDesde, $scope.fechaHasta, $scope.data.selectedOption.valor, $scope.data2.selectedOption.valor);

                    }, function (error) {
                        $scope.errorMessage = "Oops, algo salio mal";
                    })
                }, function () {
                    //cancel
                });
            }


      //---------------------------------------------------------------------------------------------------------------


      //Start*To Export SearchTable data in excel  
      // create XLS template with your field.  
      var mystyle = {
          headers: true,
          columns: [


                  { columnid: 'NroOf', title: 'NroOf' },
            { columnid: 'CodProducto', title: 'CodProducto' },
            { columnid: 'DescProducto', title: 'DescProducto' },
            { columnid: 'Legajo', title: 'Legajo' },
            { columnid: 'Fecha', title: 'Fecha' },
            { columnid: 'Turno', title: 'Turno' },

            { columnid: 'TipoRomaneo', title: 'TipoRomaneo' },
            { columnid: 'NroPallet', title: 'NroPallet' },

            { columnid: 'CantBultos', title: 'CantBultos' },
            { columnid: 'Unidades', title: 'Unidades' },
            { columnid: 'Bobinas', title: 'Bobinas' },
              { columnid: 'MTS', title: 'MTS' },
              { columnid: 'MTS2', title: 'MTS2' },

            { columnid: 'PesoBruto', title: 'PesoBruto' },
            { columnid: 'PesoNeto', title: 'PesoNeto' },

            { columnid: 'Obs', title: 'Obs' },
          

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



          console.log($scope.reporteRomaneo);


          //Create XLS format using alasql.js file.  
          alasql('SELECT NroOf,CodProducto,DescProducto,Legajo,Fecha,Turno,TipoRomaneo,NroPallet,CantBultos,Unidades,Bobinas,MTS,MTS2,PesoBruto,PesoNeto,Obs INTO XLSX("Reporte Romaneo - Desde (' + $scope.fechaDesde + ') Hasta (' + $scope.fechaHasta + ').xlsx",?) FROM ?', [mystyle, $scope.reporteRomaneo]);
      };
      //End*To Export SearchTable data in excel  





  });






