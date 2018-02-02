'use strict';
angular
    .module('app.controllers')

    .controller('ProgrammingGuideController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http, $localStorage) {
        //reset local storage
        $localStorage.$reset();

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('ProgramName', 'Name').renderWith(renderTitle),
            DTColumnBuilder.newColumn('Day', 'Air Days').renderWith(renderAirDays).notSortable(),
            DTColumnBuilder.newColumn('Channel', 'Channel').renderWith(renderDate)
        ];

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
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

            //filter by day
            var fs = "";
            if ($scope.filterByStatus) {
                fs = " AND Day:" + $scope.filterByStatus.Status;
            }

            var fc = "";
            if ($scope.filterByChannel) {
                fc = ' AND Channel:"' + $scope.filterByChannel.Channel + '"';
            }

            //query constructor
            var qs = "?q=" + q + fs + fc + "&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,ProgramName,Day,InitHour,InitMinute,Channel&sort=" + sort + "&facet.field=Channel&facet.field=Day&facet=on&facet.mincount=1&no-pace";

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/ProgrammingGuide/GetAllSolr" + qs,
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

                //render filter by Day
                var statusFilterArr = result.data.facet_counts.facet_fields.Day;
                $scope.statusFilter = [];

                for (var i = 0; i < statusFilterArr.length; i++) {
                    $scope.statusFilter.push({
                        Name: statusFilterArr[i],
                        Value: statusFilterArr[++i]
                    });
                }

                //render filter by Channel
                var channelFilterArr = result.data.facet_counts.facet_fields.Channel;
                $scope.channelFilter = [];

                for (var i = 0; i < channelFilterArr.length; i++) {
                    $scope.channelFilter.push({
                        Name: channelFilterArr[i],
                        Value: channelFilterArr[++i]
                    });
                }
            });
        }

        //status filter selection
        $scope.filterList = function (key) {
            if (key) {
                $scope.filterByStatus = { Status: key };
            } else {
                $scope.filterByStatus = null;
            }
            $scope.doSearch();
        }

        //status filter selection
        $scope.filterChannel = function (key) {
            if (key) {
                $scope.filterByChannel = { Channel: key };
            } else {
                $scope.filterByChannel = null;
            }
            $scope.doSearch();
        }

        //datatables render name field
        function renderTitle(data, type, full, meta) {
            var html = '<a href="/#/cms/content/programming-guide/crud/' + full.Id + '"><strong>' + full.ProgramName + '</strong></a>';
            return html;
        }

        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
            return html;
        }

        //datatables render air days field
        function renderAirDays(data, type, full, meta) {
            if (data) {
                var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
                var html = '';

                for (var i = 0, len = data.length; i < len; i++) {
                    html += '<span class="tag day'+data[i]+'">' + weekday[data[i]];
                    if (full.InitMinute[i].toString().length == 1)
                        full.InitMinute[i] = "0" + full.InitMinute[i];
                    html += ' ' + full.InitHour[i] + ':' + full.InitMinute[i] +'</span>';
                }

                return html;
            } else {
                return "";
            }
        }

        //datatables render name field
        function renderHour(data, type, full, meta) {
            if (full.InitMinute.toString().length == 1)
                full.InitMinute = "0" + full.InitMinute;
            if (full.EndMinute.toString().length == 1)
                full.EndMinute = "0" + full.EndMinute;

            var html = full.InitHour + ':' + full.InitMinute + ' - ' + full.EndHour + ':' + full.EndMinute;
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

    .controller('ProgrammingGuideCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage) {

        var id = $stateParams.id;

        $scope.programData = {};

        //labels
        if (id) {
            $scope.PageTitle = 'Edit Program';
            $scope.SubmitButton = 'Update Program';
        } else {
            $scope.PageTitle = 'Create Program';
            $scope.SubmitButton = 'Create Program';
        }

        $scope.channels = ['Teletica 7', 'Teletica Radio', 'TD+', 'Xper TV'];

        $scope.weekdays = [
            { Id: 0, Name: 'Sunday' },
            { Id: 1, Name: 'Monday' },
            { Id: 2, Name: 'Tuesday' },
            { Id: 3, Name: 'Wednesday' },
            { Id: 4, Name: 'Thursday' },
            { Id: 5, Name: 'Friday' },
            { Id: 6, Name: 'Saturday' }
        ];

        $scope.ImagePath = $rootScope.mediaurl;
        $scope.programImage = "../images/placeholders/picture.png";

        $scope.treeOptions = {
            nodeChildren: "Childs",
            dirSelectable: true,
            multiSelection: true
        }

        $scope.selectedNodes = [];
        $scope.expandedNodes = [];

        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }

        function parseTree(parent, tree) {
            angular.forEach(tree, function (value, key) {

                if (arrayObjectIndexOf($scope.Nodes, value.Id, "Id") !== -1) {
                    //console.log(value.$parentNode);
                    $scope.selectedNodes.push(value);
                    if (parent != null) {
                        console.log(parent);
                        $scope.expandedNodes.push(parent);
                    }
                }

                if (value.Childs.length > 0) {
                    parseTree(value, value.Childs);
                }

            });
        }

        function getNodeTree() {
            var servCall = APIService.getNodeTree();
            servCall.then(function (n) {
                $scope.dataForTheTree = n.data.data;

                angular.forEach($scope.programData.Nodes, function (value, key) {
                    var index = getIndexBy($scope.dataForTheTree, "Id", value.Id);
                    //$scope.selectedNodes.push($scope.dataForTheTree[index]);

                    $scope.Nodes.push({
                        Id: value.Id
                    });
                });

                $scope.expandedNodes.push($scope.dataForTheTree[0]);

                parseTree(null, $scope.dataForTheTree);

                //$scope.expandedNodes = $scope.selectedNodes;

            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        if ($localStorage.ProgramData) {
            $scope.programData = $localStorage.ProgramData;
            $localStorage.ProgramData = null;

            if ($scope.programData.Media) {
                var sizesPaths = angular.fromJson($scope.programData.Media[0].SizesPaths);
                $scope.programImage = $scope.ImagePath + sizesPaths.Size1Path;
            }

            getNodeTree();
        } else {
            if (id) {
                var servCall = APIService.getProgramById(id);
                servCall.then(function (u) {
                    $scope.programData = u.data.data;

                    angular.forEach($scope.programData.Schedule, function (value, key) {
                        var InitFullHour = new Date(1970, 0, 1, value.InitHour, value.InitMinute, 0);
                        var EndFullHour = new Date(1970, 0, 1, value.EndHour, value.EndMinute, 0);

                        value.InitFullHour = InitFullHour;
                        value.EndFullHour = EndFullHour;
                    });

                    if ($scope.programData.Media.length > 0) {
                        if ($scope.programData.Media[0].Size1Path != undefined)
                            $scope.programImage = $scope.ImagePath + $scope.programData.Media[0].Size1Path;
                    }

                    getNodeTree();
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $window.location.href = "/#/cms/content/programming-guide/list";
                });
            } else {
                $scope.programData.Schedule = [{ id: 'd1' }];
                getNodeTree();
            }
        }

        $scope.Nodes = [];
        $scope.showSelected = function (node, selected) {
            if (selected) {
                $scope.Nodes.push({
                    Id: node.Id
                });
            } else {
                var index = getIndexBy($scope.Nodes, "Id", node.Id);
                $scope.Nodes.splice(index, 1);
            }
        };

        $scope.addNewAirDay = function () {
            var newItemNo = $scope.programData.Schedule.length + 1;
            $scope.programData.Schedule.push({ 'id': 'd' + newItemNo });
        };

        $scope.removeAirDay = function () {
            var lastItem = $scope.programData.Schedule.length - 1;
            $scope.programData.Schedule.splice(lastItem);
        };

        //User update
        $scope.processForm = function () {

            //prepare schedule
            angular.forEach($scope.programData.Schedule, function (value, key) {
                var initFullDate = value.InitFullHour;
                var endFullDate = value.EndFullHour;

                value.InitHour = initFullDate.getHours();
                value.InitMinute = initFullDate.getMinutes();
                value.EndHour = endFullDate.getHours();
                value.EndMinute = endFullDate.getMinutes();

                delete value.id;
                delete value.initFullDate;
                delete value.endFullDate;
            });

            //prepare media
            if ($scope.programData.Media !== undefined) {
                if ($scope.programData.Media.length > 0) {
                    var featuredImageId = $scope.programData.Media[0].Id;
                    delete $scope.programData['Media'];
                    $scope.programData['Media[0].Id'] = featuredImageId;
                }
            }

            $scope.programData.Nodes = $scope.Nodes;

            var data = $.param($scope.programData);

            if (id) {
                var servCall = APIService.updateProgram(data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("The program has been updated successfully", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createProgram(data);
                servCall.then(function (u) {
                    var programData = u.data.data;
                    //Set message
                    AlertService.SetAlert("The program has been created successfully", "success");
                    $window.location.href = "/#/cms/content/programming-guide/crud/" + programData.Id;
                }, function (error) {
                    console.log(error);
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteProgram = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Program')
                  .textContent('Are you sure you want to delete this program?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteProgram(data);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("The program has been removed successfully", "success");
                    $window.location.href = "/#/cms/content/programming-guide/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        function getIndexBy(obj, name, value) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][name] == value) {
                    return i;
                }
            }
            return -1;
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.ChooseFile = function () {
            $scope.programData.Nodes = $scope.Nodes;
            $localStorage.ProgramData = $scope.programData;
            $window.location.href = "/#/cms/multimedia/library/choose";
        }
    })
