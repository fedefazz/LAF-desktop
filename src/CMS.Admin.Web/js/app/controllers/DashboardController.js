'use strict';
angular
    .module('app.controllers')

    .controller('DashboardController', function ($scope, APIService, $localStorage, $window, $filter) {

        //Get Current User
        var servCall = APIService.getProfileInfo();
        servCall.then(function (u) {
            $scope._currentUser = u.data;


            var servCallUser = APIService.getUserById($scope._currentUser.Id);
            servCallUser.then(function (e) {
                $scope.currentUser = e.data;


                    var usersroles = []
                    if (!$scope.currentUser.Role) {
                        return false;
                    }


                    angular.forEach($scope.currentUser.Role, function (element) {

                        usersroles.push(element.Name);




                    });

        
               if (!usersroles.includes("Admin") && !usersroles.includes("Employee")) {
                    console.log('ENTRA ACA', usersroles);

                     $window.location.href = "/#/blsp/productos/list"
                }


                
            }, function (error) {
                //$window.location.href = "/Login/LogOut";
                //

                $scope.errorMessage = "Oops, something went wrong.";
            })

        }, function (error) {
            //$window.location.href = "/Login/LogOut";
            //

            $scope.errorMessage = "Oops, something went wrong.";
        })

        //OBTENER ROLES
        //var datosString = $window.localStorage.getItem('datosUsuario');
        // Convertir la cadena JSON de nuevo a un objeto
        //var datos = JSON.parse(datosString);
        // Asignar los datos al $scope para mostrarlos en la vista
        //$scope.currentUser = datos?.currentUser;
        //$scope.usersroles = datos?.usersroles;

        //console.log("$scope.currentUser", $scope?.currentUser)
        //console.log("$scope.usersroles", $scope?.usersroles)

        //if ($scope?.usersroles?.indexOf("Admin") === -1 || $scope?.usersroles?.indexOf("Employee") === -1) {

         //   console.log("NO ES ADMINISTRADOR NI USUARIO")
         //   $window.location.href = "/#/blsp/productos/list"
        //}


        var CallTotalPlanta = APIService.GetTotalPlanta();
        CallTotalPlanta.then(function (u) {
            $scope.total = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/tiposMaterial/list";
        });

        var CallTotalPlantaCerradas = APIService.GetTotalPlantaCerradas();
        CallTotalPlantaCerradas.then(function (u) {
            $scope.totalCerradas = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/tiposMaterial/list";
        });


        var CallTotalAreaImpresionTotal = APIService.GetTotalAreaImpresion();
        CallTotalAreaImpresionTotal.then(function (u) {
            $scope.ImpresionTotal = u.data;


            var a = parseFloat(Math.round($scope.ImpresionTotal.incidenciaFischer));
            var b = parseFloat(Math.round($scope.ImpresionTotal.incidenciaHeliostar));
            var c = parseFloat(Math.round($scope.ImpresionTotal.incidenciaRotomec));
            var d = parseFloat(Math.round($scope.ImpresionTotal.incidenciaAllstein));

            /* Donut Chart
            ------------------------- */
            var red = 'red';
            var blue = '#348fe2';
            var orange = '#ffcc00';
            var greenLight = '#00ACAC';

            Morris.Donut({
                element: 'visitors-donut-chart',
                data: [
                    { label: "Fischer", value: a, formatted: a + '%' },
                    { label: "Heliostar", value: b, formatted: b + '%' },
                    { label: "Rotomec", value: c, formatted: c + '%' },
                    { label: "Allstein", value: d, formatted: d + '%' }

                ],
                colors: [red, orange, blue, greenLight],
                labelFamily: 'Open Sans',
                labelColor: 'rgba(255,255,255,0.4)',
                labelTextSize: '11px',
                backgroundColor: '#242a30',
                formatter: function (x, data) { return data.formatted; }
            });



        }, function (error) {
            $window.location.href = "/#/blsp/tiposMaterial/list";
        });



        var CallTotalAreaLaminacionTotal = APIService.GetTotalLaminacion();
        CallTotalAreaLaminacionTotal.then(function (u) {
            $scope.LaminacionTotal = u.data;
            console.log('laminacion', $scope.LaminacionTotal);
            $scope.datadonnut = [];


            angular.forEach($scope.LaminacionTotal.listadodetallemaquina, function (value, key) {
                var object = { label: value.nombre, value: Math.round(value.incidencia), formatted: Math.round(value.incidencia) + '%' };
            $scope.datadonnut.push(object);
            })







            /* Donut Chart
            ------------------------- */
            var red = 'red';
            var blue = '#348fe2';
            var orange = '#ffcc00';
            var greenLight = '#00ACAC';
            $scope.color = [red, orange, blue, greenLight];

            Morris.Donut({
                element: 'visitors-donut-chart2',
                data: $scope.datadonnut,
                colors: $scope.color,
                labelFamily: 'Open Sans',
                labelColor: 'rgba(255,255,255,0.4)',
                labelTextSize: '12px',
                backgroundColor: '#242a30',
                formatter: function (x, data) { return data.formatted; }
            });



        }, function (error) {
            $window.location.href = "/#/blsp/tiposMaterial/list";
        });





        var CallTotalGetImpresionDetalle = APIService.GetImpresionDetalle();
        CallTotalGetImpresionDetalle.then(function (u) {
            $scope.GetImpresionDetalle = u.data;


            angular.forEach($scope.GetImpresionDetalle, function (value, key) {
                

            })

            /* Line Chart
            ------------------------- */
            var red = 'red';
            var orange = '#ffcc00';
            var greenLight = '#00ACAC';
            var blue = '#3273B1';
            var blueLight = '#348FE2';
            var blackTransparent = 'rgba(0,0,0,0.6)';
            var whiteTransparent = 'rgba(255,255,255,0.4)';
            var month = [];
            month[0] = "Enero";
            month[1] = "Febrero";
            month[2] = "Marzo";
            month[3] = "Abril";
            month[4] = "Mayo";
            month[5] = "Junio";
            month[6] = "Julio";
            month[7] = "Agosto";
            month[8] = "Septiembre";
            month[9] = "Octubre";
            month[10] = "Noviembre";
            month[11] = "Diciembre";

            Morris.Line({
                element: 'visitors-line-chart',
                data: $scope.GetImpresionDetalle,
                xkey: 'DTPRODUCAO',
                ykeys: ['FISCHER', 'HELIOSTAR', 'ROTOMEC', 'ALLSTEIN'],
                xLabelFormat: function (x) {
                    x = month[x.getMonth()];
                    return x.toString();
                },
                xLabels : "month",
                labels: ['Fischer', 'Heliostar', 'Rotomec', 'Allstein'],
                lineColors: [red, orange, blueLight, greenLight],
                pointFillColors: [red, orange, blueLight, greenLight],
                lineWidth: '2px',
                pointStrokeColors: [red, orange, blueLight, greenLight],
                resize: true,
                gridTextFamily: 'Open Sans',
                gridTextColor: whiteTransparent,
                gridTextWeight: 'normal',
                gridTextSize: '11px',
                gridLineColor: 'rgba(0,0,0,0.5)',
                hideHover: 'auto',
            });






        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });





        var CallTotalLaminacionDetalle = APIService.GetLaminacionDetalle();
        CallTotalLaminacionDetalle.then(function (u) {
            $scope.GetLaminacionDetalle = u.data;
            console.log('GetLaminacionDetalle', $scope.GetLaminacionDetalle);


           
            /* Line Chart
           ------------------------- */
            var red = 'red';
            var orange = '#ffcc00';
            var greenLight = '#00ACAC';
            var blue = '#3273B1';
            var blueLight = '#348FE2';
            var blackTransparent = 'rgba(0,0,0,0.6)';
            var whiteTransparent = 'rgba(255,255,255,0.4)';
            var month = [];
            month[0] = "Enero";
            month[1] = "Febrero";
            month[2] = "Marzo";
            month[3] = "Abril";
            month[4] = "Mayo";
            month[5] = "Junio";
            month[6] = "Julio";
            month[7] = "Agosto";
            month[8] = "Septiembre";
            month[9] = "Octubre";
            month[10] = "Noviembre";
            month[11] = "Diciembre";

            Morris.Line({
                element: 'visitors-line-chart2',
                data: $scope.GetImpresionDetalle,
                xkey: 'DTPRODUCAO',
                ykeys: ['FISCHER', 'HELIOSTAR', 'ROTOMEC', 'ALLSTEIN'],
                xLabelFormat: function (x) {
                    x = month[x.getMonth()];
                    return x.toString();
                },
                xLabels: "month",
                labels: ['Fischer', 'Heliostar', 'Rotomec', 'Allstein'],
                lineColors: [red, orange, blueLight, greenLight],
                pointFillColors: [red, orange, blueLight, greenLight],
                lineWidth: '2px',
                pointStrokeColors: [red, orange, blueLight, greenLight],
                resize: true,
                gridTextFamily: 'Open Sans',
                gridTextColor: whiteTransparent,
                gridTextWeight: 'normal',
                gridTextSize: '11px',
                gridLineColor: 'rgba(0,0,0,0.5)',
                hideHover: 'auto',
            });






        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });




        var CallTotalIndicadoresTotalesOp = APIService.GetIndicadoresTotalesOp();
        CallTotalIndicadoresTotalesOp.then(function (u) {
            $scope.IndicadoresTotalesOp = u.data;


            angular.forEach($scope.IndicadoresTotalesOp, function (value, key) {


            })

            /* Line Chart
            ------------------------- */
            var red = 'red';
            var orange = '#ffcc00';
            var greenLight = '#00ACAC';
            var blue = '#3273B1';
            var blueLight = '#348FE2';
            var blackTransparent = 'rgba(0,0,0,0.6)';
            var whiteTransparent = 'rgba(255,255,255,0.4)';
            var month = [];
            month[0] = "Enero";
            month[1] = "Febrero";
            month[2] = "Marzo";
            month[3] = "Abril";
            month[4] = "Mayo";
            month[5] = "Junio";
            month[6] = "Julio";
            month[7] = "Agosto";
            month[8] = "Septiembre";
            month[9] = "Octubre";
            month[10] = "Noviembre";
            month[11] = "Diciembre";

            Morris.Line({
                element: 'visitors-line-chart3',
                data: $scope.IndicadoresTotalesOp,
                xkey: 'DTPRODUCAO',
                ykeys: ['Todas'],
                xLabelFormat: function (x) {
                    x = month[x.getMonth()];
                    return x.toString();
                },
                xLabels: "month",
                labels: ['Todas'],
                lineColors: [orange],
                pointFillColors: [orange],
                lineWidth: '2px',
                pointStrokeColors: [orange],
                resize: true,
                gridTextFamily: 'Open Sans',
                gridTextColor: whiteTransparent,
                gridTextWeight: 'normal',
                gridTextSize: '11px',
                gridLineColor: 'rgba(0,0,0,0.5)',
                hideHover: 'auto',
            });






        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });



        var CallTotalIndicadoresTotalScrap = APIService.GetIndicadoresTotalScrap();
        CallTotalIndicadoresTotalScrap.then(function (u) {
            $scope.IndicadoresTotalScrap = u.data;


            angular.forEach($scope.IndicadoresTotalScrap, function (value, key) {


            })

            /* Line Chart
            ------------------------- */
            var red = '#ffcc00';
            var orange = '#ffcc00';
            var greenLight = '#00ACAC';
            var blue = '#3273B1';
            var blueLight = '#348FE2';
            var blackTransparent = 'rgba(0,0,0,0.6)';
            var whiteTransparent = 'rgba(255,255,255,0.4)';
            var month = [];
            month[0] = "Enero";
            month[1] = "Febrero";
            month[2] = "Marzo";
            month[3] = "Abril";
            month[4] = "Mayo";
            month[5] = "Junio";
            month[6] = "Julio";
            month[7] = "Agosto";
            month[8] = "Septiembre";
            month[9] = "Octubre";
            month[10] = "Noviembre";
            month[11] = "Diciembre";

            Morris.Line({
                element: 'visitors-line-chart4',
                data: $scope.IndicadoresTotalScrap,
                xkey: 'DTPRODUCAO',
                ykeys: ['PRODUCCION_KGS', 'SCRAP'],
                xLabelFormat: function (x) {
                    x = month[x.getMonth()];
                    return x.toString();
                },
                xLabels: "month",
                labels: ['PRODUCCION_KGS', 'SCRAP'],
                lineColors: [greenLight, red],
                pointFillColors: [greenLight, red],
                lineWidth: '2px',
                pointStrokeColors: [greenLight, red],
                resize: true,
                gridTextFamily: 'Open Sans',
                gridTextColor: whiteTransparent,
                gridTextWeight: 'normal',
                gridTextSize: '11px',
                gridLineColor: 'rgba(0,0,0,0.5)',
                hideHover: 'auto',
            });






        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });






        var CallTotalAreaImpresion = APIService.GetTotalAreas(1);
        CallTotalAreaImpresion.then(function (u) {
            $scope.totalAreaImpresion = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var CallTotalAreaCorte = APIService.GetTotalAreas(2);
        CallTotalAreaCorte.then(function (u) {
            $scope.totalAreaCorte = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });



        var CallTotalAreaMangas = APIService.GetTotalAreas(3);
        CallTotalAreaMangas.then(function (u) {
            $scope.totalAreaMangas = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var CallTotalAreaDoypack = APIService.GetTotalAreas(4);
        CallTotalAreaDoypack.then(function (u) {
            $scope.totalAreaDoypack = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var CallTotalAreaTabaco = APIService.GetTotalAreas(5);
        CallTotalAreaTabaco.then(function (u) {
            $scope.totalAreaTabaco = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        var CallTotalAreaLaminado = APIService.GetTotalAreas(6);
        CallTotalAreaLaminado.then(function (u) {
            $scope.totalAreaLaminado = u.data;


        }, function (error) {
            $window.location.href = "/#/blsp/maquinas/list";
        });

        //reset local storage
        //$localStorage.$reset();

        //getLastestNews();

        ////Get Lastest News
        //function getLastestNews() {
        //    var servCall = APIService.getLastestNews();
        //    servCall.then(function (u) {
        //        $scope.lastestNews = u.data.response.docs;
        //        getNewsStats();
        //    }, function (error) {
        //        $scope.errorMessage = "Oops, something went wrong.";
        //    })
        //}

        ////Get News Stats
        //function getNewsStats() {
        //    var servCall = APIService.getNewsStats();
        //    servCall.then(function (u) {
        //        var newsStatsArr = u.data.facet_counts.facet_fields.Status;
        //        $scope.newsStats = [];

        //        for (var i = 0; i < newsStatsArr.length; i++) {
        //            $scope.newsStats.push({
        //                Name: newsStatsArr[i],
        //                Value: newsStatsArr[++i]
        //            });
        //        }

        //    }, function (error) {
        //        $scope.errorMessage = "Oops, something went wrong.";
        //    })
        //}



    /* NEW DASHBOARD */
        angular.element(document).ready(function () {

            
            


            /* Vector Map
            ------------------------- */ 
            $('#visitors-map').vectorMap({
                map: 'world_merc_en',
                scaleColors: ['#e74c3c', '#0071a4'],
                container: $('#visitors-map'),
                normalizeFunction: 'linear',
                hoverOpacity: 0.5,
                hoverColor: false,
                markerStyle: {
                    initial: {
                        fill: '#4cabc7',
                        stroke: 'transparent',
                        r: 3
                    }
                },
                regions: [{ attribute: 'fill' }],
                regionStyle: {
                    initial: {
                        fill: 'rgb(97,109,125)',
                        "fill-opacity": 1,
                        stroke: 'none',
                        "stroke-width": 0.4,
                        "stroke-opacity": 1
                    },
                    hover: { "fill-opacity": 0.8 },
                    selected: { fill: 'yellow' }
                },
                series: {
                    regions: [{
                        values: {
                            IN: '#00acac',
                            US: '#00acac',
                            KR: '#00acac'
                        }
                    }]
                },
                focusOn: { x: 0.5, y: 0.5, scale: 2 },
                backgroundColor: '#2d353c'
            });

        });

    /* END NEW DASHBOARD */
        
    })