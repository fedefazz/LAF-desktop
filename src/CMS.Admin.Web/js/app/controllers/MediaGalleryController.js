'use strict';
angular
    .module('app.controllers')

    .controller('MediaGalleryController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http) {

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('Name', 'Name').renderWith(renderTitle),
            DTColumnBuilder.newColumn('CreationDate', 'Creation Date').renderWith(renderDate)
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
                    .withOption('order', [1, 'desc']);

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

            //query constructor
            var qs = "?q=" + q + "&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,Name,CreationDate,IsEnabled&sort=" + sort + "&no-pace";

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/Gallery/GetAllSolr" + qs,
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
            });
        }

        //datatables render title field
        function renderTitle(data, type, full, meta) {
            var css = "times-circle red";
            if (full.IsEnabled == true)
                css = "check-circle blue";

            var html = '<i class="fa fa-' + css + '"></i>';
            html += '<a href="/#/cms/multimedia/gallery/crud/' + full.Id + '"><strong>' + full.Name + '</strong></a>';
            return html;
        }

        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
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

    .controller('GalleryCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage) {

        var id = $stateParams.id;

        $scope.ImageProfilePath = $rootScope.mediaurl;
        $scope.selection = [];

        //labels
        if (id) {
            $scope.PageTitle = 'Edit Gallery';
            $scope.SubmitButton = 'Update Gallery';
        } else {
            $scope.PageTitle = 'Create Gallery';
            $scope.SubmitButton = 'Create Gallery';
        }

        if ($localStorage.AssetData) {
            $scope.assetData = $localStorage.AssetData;
        } else {
            $scope.assetData = null;
        }

        if (id) {
            getGalleryById(id);
        }

        function getGalleryById(id, callback) {
            var servCall = APIService.getGalleryById(id);
            servCall.then(function (u) {
                $scope.galleryData = u.data.data;
                $scope.selection = $scope.galleryData.Media;
                AlertService.ShowAlert($scope);
                callback();
            }, function (error) {
                $window.location.href = "/#/MediaGallery";
            });
        }

        $scope.ImagePath = $rootScope.mediaurl;

        $scope.currentPage = 1;

        getAllMedia(undefined);
        //Get Media
        function getAllMedia(url) {
            var servCall = APIService.getMedia(url);
            servCall.then(function (u) {
                $scope.medias = u.data.response.docs;
                ////$scope.pagination = u.data.pagination;

                $scope.paginationTotalItems = u.data.response.numFound;
                $scope.paginationShowFrom = ($scope.currentPage - 1) * 9 + 1;
                $scope.paginationShowTo = $scope.paginationShowFrom + 8;
                $scope.paginationShowTo = Math.min($scope.paginationTotalItems, $scope.paginationShowTo);

                //Display message if necessary
                AlertService.ShowAlert($scope);
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        $scope.pageChanged = function () {
            var q = '*';
            if ($scope.searchQuery != undefined && $scope.searchQuery != "") {
                q = $scope.searchQuery;
            }
            var url = "api/Media/GetAllSolr?q=" + q + "&start=" + ($scope.currentPage - 1) * 9 + "&rows=9&fl=Id,Title,Keywords,FileName&sort=Id desc";
            $scope.medias = {};

            console.log(url);

            getAllMedia(url);
        };

        //Gets Id and stores it in a cookie for later edit
        $scope.updateList = function (url) {
            $scope.medias = {};
            getAllMedia(url);
        }

        $scope.isSelected = function (Id) {
            var index = $scope.selection.map(function (o) { return o.Id; }).indexOf(Id);
            if (index != -1) {
                console.log(Id);
                return true;
            }
            //selection.indexOf(media) != -1
            return false;
        }


        $scope.toggle = function (idx) {

            var pos = getIndexBy($scope.selection, "Id", idx.Id);
            //$scope.Nodes.splice(index, 1);

            //var pos = $scope.selection.indexOf(idx);
            if (pos == -1) {
                $scope.selection.push(idx);
            } else {
                $scope.selection.splice(pos, 1);
            }


        };

        $scope.Media = [];

        //User update
        $scope.processForm = function () {

            var galleryDataPut = angular.copy($scope.galleryData);

            if ($scope.selection.length > 0) {
                var i = 1;
                angular.forEach($scope.selection, function (value, key) {
                    $scope.Media.push({
                        Id: value.Id,
                        Order: i
                    });
                    i++;
                });

                galleryDataPut.Media = $scope.Media;
            }

            var data = $.param(galleryDataPut);

            if (id) {
                var servCall = APIService.updateGallery(data);
                servCall.then(function (u) {
                    if ($scope.assetData == null) {
                        //Set and display message
                        AlertService.SetAlert("The gallery has been updated successfully", "success");
                        AlertService.ShowAlert($scope);
                    } else {
                        $scope.addGalleryToAsset();
                    }
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createGallery(data);
                servCall.then(function (u) {
                    var galleryData = u.data.data;
                    if ($scope.assetData == null) {
                        //Set message
                        AlertService.SetAlert("The gallery has been created successfully", "success");
                        $window.location.href = "/#/cms/multimedia/gallery/crud/" + galleryData.Id;
                    } else {
                        getGalleryById(galleryData.Id, function () {
                            $scope.addGalleryToAsset();
                        });
                    }
                }, function (error) {
                    console.log(error);
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

        //Delete User
        $scope.deleteGallery = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Gallery')
                  .textContent('Are you sure you want to delete this gallery?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteGallery(data);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("The gallery has been removed successfully", "success");
                    $window.location.href = "/#/cms/multimedia/gallery/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        $scope.removeFile = function (index) {
            $scope.selection.splice(index, 1);
        }

        //Add Gallery to Asset
        $scope.addGalleryToAsset = function () {
            if ($scope.assetData.Galleries == null) {
                $scope.assetData.Galleries = [];
            }

            //var Gallery =
            //                {
            //                    "Id": $scope.galleryData.Id,
            //                    "Name": $scope.galleryData.Name
            //                };
            var i = arrayObjectIndexOf($scope.assetData.Galleries, $scope.galleryData.Id, "Id");
            if ( i === -1) {
                $scope.assetData.Galleries.push($scope.galleryData);
            } else {
                $scope.assetData.Galleries[i] = $scope.galleryData;
            }

            $localStorage.AssetData = $scope.assetData;

            if ($scope.assetData.Id != null) {
                $window.location.href = "/#/cms/content/assets/crud/" + $scope.assetData.Id;
            } else {
                $window.location.href = "/#/cms/content/assets/crud";
            }
        }

        $scope.goBack = function () {
            if ($scope.assetData.Id != null) {
                $window.location.href = "/#/cms/content/assets/crud/" + $scope.assetData.Id;
            } else {
                $window.location.href = "/#/cms/content/assets/crud";
            }
        }

        function getIndexBy(obj, name, value) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][name] == value) {
                    return i;
                }
            }
            return -1;
        }

        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }

        $scope.getThumb = function (item) {
            if (item.SizesPaths) {
                var obj = angular.fromJson(item.SizesPaths);
                return $scope.ImagePath + obj.Size1Path.replace(/\\/g, "/");
            } else {
                return $scope.ImagePath + item.Size1Path;
            }
        }
    })
