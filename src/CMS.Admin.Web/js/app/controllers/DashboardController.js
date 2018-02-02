'use strict';
angular
    .module('app.controllers')

    .controller('DashboardController', function ($scope, APIService, $localStorage) {
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
            /* Line Chart
            ------------------------- */
            var green = '#0D888B';
            var greenLight = '#00ACAC';
            var blue = '#3273B1';
            var blueLight = '#348FE2';
            var blackTransparent = 'rgba(0,0,0,0.6)';
            var whiteTransparent = 'rgba(255,255,255,0.4)';
            var month = [];
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "Jun";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";

            Morris.Line({
                element: 'visitors-line-chart',
                data: [
                    { x: '2014-02-01', y: 60, z: 30 },
                    { x: '2014-03-01', y: 70, z: 40 },
                    { x: '2014-04-01', y: 40, z: 10 },
                    { x: '2014-05-01', y: 100, z: 70 },
                    { x: '2014-06-01', y: 40, z: 10 },
                    { x: '2014-07-01', y: 80, z: 50 },
                    { x: '2014-08-01', y: 70, z: 40 }
                ],
                xkey: 'x',
                ykeys: ['y', 'z'],
                xLabelFormat: function (x) {
                    x = month[x.getMonth()];
                    return x.toString();
                },
                labels: ['Page Views', 'Unique Visitors'],
                lineColors: [green, blue],
                pointFillColors: [greenLight, blueLight],
                lineWidth: '2px',
                pointStrokeColors: [blackTransparent, blackTransparent],
                resize: true,
                gridTextFamily: 'Open Sans',
                gridTextColor: whiteTransparent,
                gridTextWeight: 'normal',
                gridTextSize: '11px',
                gridLineColor: 'rgba(0,0,0,0.5)',
                hideHover: 'auto',
            });

            /* Donut Chart
            ------------------------- */
            var green = '#00acac';
            var blue = '#348fe2';
            Morris.Donut({
                element: 'visitors-donut-chart',
                data: [
                    { label: "New Visitors", value: 900 },
                    { label: "Return Visitors", value: 1200 }
                ],
                colors: [green, blue],
                labelFamily: 'Open Sans',
                labelColor: 'rgba(255,255,255,0.4)',
                labelTextSize: '12px',
                backgroundColor: '#242a30'
            });


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