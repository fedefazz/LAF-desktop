'use strict';
angular
    .module('app.controllers')

    .controller('MediaLibraryController', function ($scope, APIService, AlertService, $rootScope, $cookies, $window) {

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
                $scope.paginationShowFrom = ($scope.currentPage - 1) * 12 + 1;
                $scope.paginationShowTo = $scope.paginationShowFrom + 11;
                $scope.paginationShowTo = Math.min($scope.paginationTotalItems, $scope.paginationShowTo);

                //render filter by Status
                var statusFilterArrIds = u.data.facet_counts.facet_fields.Categories_Id;
                var statusFilterArr = u.data.facet_counts.facet_fields.Categories_Name;
                $scope.statusFilter = [];

                for (var i = 0; i < statusFilterArr.length; i++) {
                    $scope.statusFilter.push({
                        Id: statusFilterArrIds[i],
                        Name: statusFilterArr[i],
                        Value: statusFilterArr[++i]
                    });
                }

                //Display message if necessary
                AlertService.ShowAlert($scope);
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        $scope.pageChanged = function () {
            var q = '*';
            if ($scope.searchQuery != undefined && $scope.searchQuery !="") {
                q = $scope.searchQuery;
            }

            //filter by status
            var fs = "";
            if ($scope.filterByStatus) {
                fs = " AND Categories_Id:" + $scope.filterByStatus.Status;
            }

            var url = "api/Media/GetAllSolr?q=" + q + fs + "&start=" + ($scope.currentPage - 1) * 12 + "&rows=12&fl=Id,Title,Keywords,FileName,SizesPaths&sort=Id desc&facet.field=Categories_Name&facet.field=Categories_Id&facet=on&facet.mincount=1";
            $scope.medias = {};

            console.log(url);

            getAllMedia(url);
        };

        $scope.doSearch = function ($event) {
            $scope.currentPage = 1;
            $scope.pageChanged();
            if ($event != undefined) {
                var target = $event.target;
                target.blur();
            }
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.getMedia = function (id) {
            $window.location.href = "/#/cms/multimedia/library/edit/" + id;
        }

        $scope.getThumb = function (sizesPaths) {
            var obj = angular.fromJson(sizesPaths);
            return $scope.ImagePath + obj.Size1Path.replace(/\\/g, "/");
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
        
    })

    .controller('CreateMediaController', function ($scope, APIService, $http, $window, $filter, AlertService, $localStorage) {

        var token = angular.element('#token').val(); //Gets token from session

        $scope.options = {
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dropZone: angular.element('#droparea'),
            previewMaxWidth: 100,
            previewMaxHeight: 66,
            done: function (e, data) {
                //Set message
                AlertService.SetAlert("The media has been uploaded successfully", "success");
                if ($localStorage.AssetData || $localStorage.AuthorData || $localStorage.ProgramData || $localStorage.LayoutData) {
                    $window.location.href = "/#/cms/multimedia/library/choose";
                } else {
                    $window.location.href = "/#/cms/multimedia/library/list";
                }
                
            },
            submit: function (e, data) {
                angular.element('#Keywords').val(createString($scope.abc, "Name"));
            }
        };

        getAllMediaCategories();

        //Get Media Categories
        function getAllMediaCategories() {
            var servCall = APIService.getMediaCategories();
            servCall.then(function (u) {
                $scope.categories = u.data.response.docs;
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        function createString(arr, key) {
            return arr.map(function (obj) {
                return obj[key];
            }).join(',');
        }

        // list of `keywords` Id/Name objects
        $scope.selected = [];
        $scope.abc = [];
        $scope.querySearch = querySearch;
        $scope.transformChip = transformChip;

        $scope.submitUrl = function () {

            var data = $.param($scope.mediaData)
            var servCall = APIService.createMedia(data);
            servCall.then(function (u) {
                //Set and display message
                AlertService.SetAlert("The media has been created successfully", "success");
                //AlertService.ShowAlert($scope);
                $window.location.href = "/#/cms/multimedia/library/list";
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })

        }

        // ******************************
        // Internal methods
        // ******************************

        function querySearch(query) {
            return $http.get("http://api.admin.stg.teletica.ray.media/api/Keyword/GetAllSolr?q=" + query + "&fl=Id,Name")
            .then(function (response) {
                var resp = response.data.response.docs;
                console.log(resp);
                return resp;
            })
        }

        /**
         * Create chip for new keyword
         */
        function transformChip(chip) {
            //chip = chip.toLowerCase();
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { Name: chip, Id: 0 }
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.Name.indexOf(lowercaseQuery) === 0);
            };

        }

    })

    .controller('FileDestroyController', [
        '$scope', '$http',
        function ($scope, $http) {
            var file = $scope.file,
                state;
            if (file.url) {
                file.$state = function () {
                    return state;
                };
                file.$destroy = function () {
                    state = 'pending';
                    return $http({
                        url: file.deleteUrl,
                        method: file.deleteType
                    }).then(
                        function () {
                            state = 'resolved';
                            $scope.clear(file);
                        },
                        function () {
                            state = 'rejected';
                        }
                    );
                };
            } else if (!file.$cancel && !file._index) {
                file.$cancel = function () {
                    $scope.clear(file);
                };
            }
        }
    ])

    .controller('MediaEditController', function ($scope, APIService, $rootScope, $window, $cookies, AlertService, $mdDialog, $stateParams, $localStorage, $http, $sce) {

        $scope.ImagePath = $rootScope.mediaurl;
        $scope.ExternalMediaUrl = 'about:blank';

        //Gets User by Id for edit fields
        var id = $stateParams.id;

        var servCall = APIService.getMediaById(id);
        servCall.then(function (u) {
            $scope.mediaData = u.data.data;

            if ($scope.mediaData.Keywords) {
                var listKeywords = $scope.mediaData.Keywords.split(',');

                angular.forEach(listKeywords, function (value) {
                    $scope.abc.push({
                        Id: value,
                        Name: value
                    });
                });
            }

            if ($scope.mediaData.MediaUrl!=='') {
                $scope.ExternalMediaUrl = $sce.trustAsResourceUrl($scope.mediaData.MediaUrl);
            }

            getAllMediaCategories();

            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/cms/multimedia/library/list";
        })

        //Get Media Categories
        function getAllMediaCategories() {
            var servCall = APIService.getMediaCategories();
            servCall.then(function (u) {
                $scope.categories = u.data.response.docs;
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Media update
        $scope.processForm = function () {
            
            $scope.mediaData.Keywords = createString($scope.abc, "Name");
            $scope.mediaData.Category = [];

            angular.forEach($scope.mediaData.Categories, function (value) {
                $scope.mediaData.Category.push(value.Id);
            });

            var data = $.param($scope.mediaData)
            var servCall = APIService.updateMedia(data);
            servCall.then(function (u) {
                //Set and display message
                AlertService.SetAlert("The media has been updated successfully", "success");
                AlertService.ShowAlert($scope);
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        function createString(arr, key) {
            return arr.map(function (obj) {
                return obj[key];
            }).join(',');
        }

        // list of `keywords` Id/Name objects
        $scope.selected = [];
        $scope.abc = [];
        $scope.querySearch = querySearch;
        $scope.transformChip = transformChip;

        // ******************************
        // Internal methods
        // ******************************

        function querySearch(query) {
            return $http.get("http://api.admin.stg.teletica.ray.media/api/Keyword/GetAllSolr?q=" + query + "&fl=Id,Name")
            .then(function (response) {
                var resp = response.data.response.docs;
                console.log(resp);
                return resp;
            })
        }

        /**
         * Create chip for new keyword
         */
        function transformChip(chip) {
            chip = chip.toLowerCase();
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { Name: chip, Id: 0 }
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.Name.indexOf(lowercaseQuery) === 0);
            };

        }

        //Delete Media
        $scope.deleteMedia = function (ev, filename) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Media')
                  .textContent('Are you sure you want to delete this media?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var servCall = APIService.deleteMedia(filename);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("The media has been removed successfully", "success");
                    $window.location.href = "/#/cms/multimedia/library/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.imageEditor = function (id) {
            $localStorage.mediaData = $scope.mediaData;
            $window.location.href = "/#/cms/multimedia/library/editor/" + id;
        }

    })

    .controller('ImageEditor', function ($scope, APIService, $rootScope, $window, $cookies, AlertService, $mdDialog, $stateParams, $localStorage, $cacheFactory, $http, $sce) {

        $scope.ImagePath = $rootScope.mediaurl;

        $scope.mediaData = $localStorage.mediaData;

        $scope.inputImage = $scope.ImagePath + 'Files/' + $scope.mediaData.FileName;
        $scope.outputImage1 = null;
        $scope.outputImageEflag1 = 0;
        $scope.outputImage2 = null;
        $scope.outputImageEflag2 = 0;
        $scope.outputImage3 = null;
        $scope.outputImageEflag3 = 0;
        $scope.onUpdate1 = function (data) {
            ++$scope.outputImageEflag1;
        }
        $scope.onUpdate2 = function (data) {
            ++$scope.outputImageEflag2;
        }
        $scope.onUpdate3 = function (data) {
            ++$scope.outputImageEflag3;
        }

        //Gets User by Id for edit fields
        var id = $stateParams.id;

        //Gets Id and stores it in a cookie for later edit
        $scope.getMedia = function (id) {
            $window.location.href = "/#/cms/multimedia/library/edit/" + id;
        }

        $scope.Save = function () {
            
            if ($scope.outputImageEflag1 > 3) {
                console.log("Save 1");

                var MediaUrl = $scope.ImagePath + 'Files/Sizes/' + $scope.mediaData.Size1Path;

                var NewMedia = $scope.outputImage1.split(',')[1];

                $scope.mediaData = { MediaId: id, Width: 380, Height: 260, Base64Image: NewMedia };

                var data = $.param($scope.mediaData)
                var servCall = APIService.BackloadUpdate(data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("The media has been updated successfully", "success");
                    AlertService.ShowAlert($scope);

                    var httpCache = $cacheFactory.get('$http');
                    httpCache.remove(MediaUrl);
                    var refresh = $http.get(MediaUrl);

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });

            }
            if ($scope.outputImageEflag2 > 3) {
                console.log("Save 2");

                var MediaUrl = $scope.ImagePath + 'Files/Sizes/' + $scope.mediaData.Size2Path;

                var NewMedia = $scope.outputImage2.split(',')[1];

                $scope.mediaData = { MediaId: id, Width: 760, Height: 520, Base64Image: NewMedia };

                var data = $.param($scope.mediaData)
                var servCall = APIService.BackloadUpdate(data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("The media has been updated successfully", "success");
                    AlertService.ShowAlert($scope);

                    var httpCache = $cacheFactory.get('$http');
                    httpCache.remove(MediaUrl);
                    var refresh = $http.get(MediaUrl);

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
            if ($scope.outputImageEflag3 > 3) {
                console.log("Save 3");

                var MediaUrl = $scope.ImagePath + 'Files/Sizes/' + $scope.mediaData.Size3Path;

                var NewMedia = $scope.outputImage3.split(',')[1];

                $scope.mediaData = { MediaId: id, Width: 1140, Height: 520, Base64Image: NewMedia };

                var data = $.param($scope.mediaData)
                var servCall = APIService.BackloadUpdate(data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("The media has been updated successfully", "success");
                    AlertService.ShowAlert($scope);

                    var httpCache = $cacheFactory.get('$http');
                    httpCache.remove(MediaUrl);
                    var refresh = $http.get(MediaUrl);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }

    })

    .controller('ChooseFileController', function ($scope, APIService, AlertService, $rootScope, $cookies, $window, $localStorage) {

        $scope.ImagePath = $rootScope.mediaurl;

        if ($localStorage.AssetData) {
            $scope.AssetData = $localStorage.AssetData;
            $scope.AddFileLabel = 'Add file to asset';
            $scope.BackLabel = 'Back to asset';
            $scope.BackUrl = "/#/cms/content/assets/";
        }

        if ($localStorage.AuthorData) {
            $scope.AuthorData = $localStorage.AuthorData;
            $scope.AddFileLabel = 'Add file to author';
            $scope.BackLabel = 'Back to author';
            $scope.BackUrl = "/#/cms/content/authors/";
        }
        
        if ($localStorage.ProgramData) {
            $scope.ProgramData = $localStorage.ProgramData;
            $scope.AddFileLabel = 'Add file to program';
            $scope.BackLabel = 'Back to Programming Guide';
            $scope.BackUrl = "/#/cms/content/programming-guide/";
        }

        if ($localStorage.LayoutData) {
            $scope.LayoutData = $localStorage.LayoutData;
            $scope.AddFileLabel = 'Add file to layout';
            $scope.BackLabel = 'Back to Layout';
            $scope.BackUrl = "/#/cms/content/layouts/";
        }

        $scope.currentPage = 1;

        getAllMedia(undefined);
        //Get Media
        function getAllMedia(url) {
            var servCall = APIService.getMedia(url);
            servCall.then(function (u) {

                $scope.medias = u.data.response.docs;
                ////$scope.pagination = u.data.pagination;

                $scope.paginationTotalItems = u.data.response.numFound;
                $scope.paginationShowFrom = ($scope.currentPage - 1) * 12 + 1;
                $scope.paginationShowTo = $scope.paginationShowFrom + 11;
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
            var url = "api/Media/GetAllSolr?q=" + q + "&start=" + ($scope.currentPage - 1) * 12 + "&rows=12&fl=Id,Title,Keywords,FileName,SizesPaths&sort=Id desc";
            $scope.medias = {};

            console.log(url);

            getAllMedia(url);
        };

        //Gets Id and stores it in a cookie for later edit
        $scope.updateList = function (url) {
            $scope.medias = {};
            getAllMedia(url);
        }

        $scope.selection = [];

        $scope.toggle = function (idx) {
            $scope.selection = [];
            var pos = $scope.selection.indexOf(idx);
            if (pos == -1) {
                $scope.selection.push(idx);
            } else {
                $scope.selection.splice(pos, 1);
            }
        };

        $scope.Media = [];

        $scope.AddFile = function () {
            if ($scope.AssetData != null) {
                $scope.AssetData.ImageToInsert = null;

                if ($scope.AssetData.ImageDest == 'featured') {
                    $scope.AssetData.AssetMedia = [];

                    var FeaturedImage =
                                        {
                                            "Media": $scope.selection[0],
                                            "Asset": null,
                                            "Featured": true
                                        };

                    $scope.AssetData.AssetMedia.push(FeaturedImage);
                } else {
                    $scope.AssetData.ImageToInsert = $scope.selection[0];
                }

                $localStorage.AssetData = $scope.AssetData;

                if ($scope.AssetData.Id != null) {
                    $window.location.href = $scope.BackUrl + "crud/" + $scope.AssetData.Id;
                } else {
                    $window.location.href = $scope.BackUrl + "crud";
                }
            }
            if ($scope.AuthorData != null) {

                $scope.AuthorData.Media = $scope.selection[0];
                $localStorage.AuthorData = $scope.AuthorData;

                if ($scope.AuthorData.Id != null) {
                    $window.location.href = $scope.BackUrl + "crud/" + $scope.AuthorData.Id;
                } else {
                    $window.location.href = $scope.BackUrl + "crud";
                }
            }
            if ($scope.ProgramData != null) {

                if ($scope.ProgramData.Media === undefined) {
                    $scope.ProgramData.Media = [];
                } else {
                    $scope.ProgramData.Media.splice(0, 1);
                }

                $scope.ProgramData.Media.push($scope.selection[0]);
                $localStorage.ProgramData = $scope.ProgramData;

                if ($scope.ProgramData.Id != null) {
                    $window.location.href = $scope.BackUrl + "crud/" + $scope.ProgramData.Id;
                } else {
                    $window.location.href = $scope.BackUrl + "crud";
                }
            }
            if ($scope.LayoutData != null) {
                $scope.LayoutData.ImageToInsert = null;

                if ($scope.LayoutData.ImageDest == 'pageImage') {
                    $scope.LayoutData.pageData.AssetMedia = [];

                    var FeaturedImage =
                                        {
                                            "Media": $scope.selection[0]
                                        };

                    $scope.LayoutData.pageData.AssetMedia.push(FeaturedImage);
                } else {
                    if ($scope.LayoutData.Media === undefined) {
                        $scope.LayoutData.Media = [];
                    } else {
                        $scope.LayoutData.Media.splice(0, 1);
                    }

                    $scope.LayoutData.Media.push($scope.selection[0]);
                }
                
                $localStorage.LayoutData = $scope.LayoutData;

                if ($scope.LayoutData.Id != null) {
                    $window.location.href = $scope.BackUrl + "edit/" + $scope.LayoutData.Node.Id;
                } else {
                    $window.location.href = $scope.BackUrl + "new";
                }
            }
        }

        $scope.goBack = function () {
            if ($scope.AssetData != undefined) {
                var id = $scope.AssetData.Id;
            } else if ($scope.AuthorData != undefined) {
                var id = $scope.AuthorData.Id;
            }

            if (id != undefined) {
                $window.location.href = $scope.BackUrl + "crud/" + id;
            } else {
                $window.location.href = $scope.BackUrl + "crud";
            }
        }

        $scope.getThumb = function (sizesPaths) {
            var obj = angular.fromJson(sizesPaths);
            return $scope.ImagePath + obj.Size1Path.replace(/\\/g, "/");
        }

    });
