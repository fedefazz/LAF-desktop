'use strict';
angular
    .module('app.controllers')

    .controller('LayoutController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $localStorage, $http) {
        //reset local storage
        $localStorage.$reset();

        ////Display message if necessary
        //AlertService.ShowAlert($scope);

        ////datatables configuration
        //$scope.dtInstance = {};

        //$scope.dtColumns = [
        //    DTColumnBuilder.newColumn('Node_en', 'Page'),
        //    DTColumnBuilder.newColumn('NodeDescription', 'Path'),
        //    DTColumnBuilder.newColumn('PublicationDate', 'Publication Date').renderWith(renderDate)
        //];

        //$scope.dtOptions = DTOptionsBuilder
        //            .newOptions()
        //            .withFnServerData(serverData)
        //            .withDataProp('data')
        //            .withOption('processing', true)
        //            .withOption('serverSide', true)
        //            .withOption('paging', true)
        //            //.withOption('rowCallback', rowCallback)
        //            .withPaginationType('full_numbers')
        //            .withDisplayLength(20)
        //            .withOption('order', [1, 'desc']);

        ////Solr interface function
        //function serverData(sSource, aoData, fnCallback, oSettings) {

        //    //sorting
        //    var sortColumnIndex = aoData[2].value[0].column;
        //    var sortDirection = aoData[2].value[0].dir;
        //    var sortColumn = $scope.dtColumns[sortColumnIndex].mData;
        //    var sort = sortColumn + " " + sortDirection;

        //    //search text
        //    var q = '*';
        //    if ($scope.searchQuery != undefined && $scope.searchQuery != "") {
        //        q = $scope.searchQuery;
        //    }

        //    //query constructor
        //    //var qs = "?q=" + q + " AND IsDeleted:false&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,FirstName,LastName,Email,CreationDate,IsEnabled&sort=" + sort + "&no-pace";
        //    var qs = "?q=*:*&wt=json&rows=100&group=true&group.field=NodeId&group.main=true&group.sort=CreationDate%20desc&sort=Node_en%20asc";

        //    //query execution
        //    $http({
        //        method: 'GET',
        //        url: $rootScope.webapiurl + "api/LayoutInstance/GetAllSolr" + qs,
        //        headers: {
        //            'Content-type': 'application/json'
        //        }
        //    })
        //    .then(function (result) {
        //        var records = {
        //            'draw': result.data.draw,
        //            'recordsTotal': result.data.response.numFound,
        //            'recordsFiltered': result.data.response.numFound,
        //            'data': result.data.response.docs
        //        };
        //        fnCallback(records);
        //    });
        //}

        ////datatables render date field
        //function renderDate(data, type, full, meta) {
        //    var html = $filter('date')(data, "d-MMM-yyyy");
        //    return html;
        //}

        getNodesCustomLayout();
        //Get Users
        function getNodesCustomLayout() {
            var servCall = APIService.getLayoutIntancesSolr();
            servCall.then(function (u) {
                $scope.Nodes = u.data.response.docs;
                //console.log($scope.Nodes);
                $scope.sortUser = 'NodeDescription'; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.searchUser = '';     // set the default search/filter term
                //Display message if necessary
                AlertService.ShowAlert($scope);
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.getUser = function (id) {
            $window.location.href = "/#/cms/users/edit/" + id;
        }

        $scope.filterList = function (key) {
            if (key) {
                $scope.filterByRol = { Roles: key };
            } else {
                $scope.filterByRol = null;
            }
            $scope.rerender();
        }

        $scope.activeList = function (key) {
            if (key) {
                $scope.filterByStatus = { IsEnabled: key };
            } else {
                $scope.filterByStatus = null;
            }
            $scope.rerender();
        }

        $scope.rerender = function () {
            $scope.dtInstance.rerender();
        }

        $scope.doSearch = function () {
            $scope.dtInstance.DataTable.search($scope.searchText).draw();
        }
    })

    .controller('CreateLayoutController', function ($scope, APIService, $window, $localStorage, $rootScope) {

        $scope.ImagePath = $rootScope.mediaurl;
        $scope.headerImage = "../images/placeholders/picture.png";
        $scope.pageImage = "../images/placeholders/picture.png";

        $scope.SNList = [
            { Id: 1, Name: 'Faceebook' },
            { Id: 2, Name: 'Twitter' },
            { Id: 3, Name: 'Instagram' },
            { Id: 4, Name: 'Youtube' }
        ];

        $scope.newLayoutData = {};
        $scope.newLayoutData.pageData = {
            IsEnabled: true
        };

        $scope.date = new Date();

        if ($localStorage.LayoutData) {
            $scope.newLayoutData = $localStorage.LayoutData;
            $localStorage.LayoutData = null;

            if ($scope.newLayoutData.ImageDest !== 'pageImage') {
                if ($scope.newLayoutData.Media) {
                    var sizesPaths = angular.fromJson($scope.newLayoutData.Media[0].SizesPaths);
                    $scope.headerImage = $scope.ImagePath + sizesPaths.Size1Path;
                }

                if ($scope.newLayoutData.pageData.AssetMedia) {
                    var sizesPaths = angular.fromJson($scope.newLayoutData.pageData.AssetMedia[0].Media.SizesPaths);
                    $scope.pageImage = $scope.ImagePath + sizesPaths.Size1Path;
                }
            } else {
                if ($scope.newLayoutData.MediaSize1Path) {
                    $scope.headerImage = $scope.ImagePath + $scope.newLayoutData.MediaSize1Path;
                } else {
                    if ($scope.newLayoutData.Media) {
                        var sizesPaths = angular.fromJson($scope.newLayoutData.Media[0].SizesPaths);
                        $scope.headerImage = $scope.ImagePath + sizesPaths.Size1Path;
                    }
                }

                if ($scope.newLayoutData.pageData.AssetMedia[0].Media) {
                    var sizesPaths = angular.fromJson($scope.newLayoutData.pageData.AssetMedia[0].Media.SizesPaths);
                    $scope.pageImage = $scope.ImagePath + sizesPaths.Size1Path;
                }
            }
        }

        getNodesCustomLayout();

        //Get Nodes enables for custom layouts
        function getNodesCustomLayout() {
            var servCall = APIService.getNodesCustomLayout();
            servCall.then(function (u) {
                $scope.Nodes = u.data.response.docs;
                getLayouts();
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Get Nodes enables for custom layouts
        function getLayouts() {
            var servCall = APIService.getLayouts();
            servCall.then(function (u) {
                $scope.Layouts = u.data.data;
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Submit Layout form
        $scope.processForm = function () {
            if ($scope.newLayoutData.pageData.Content[0].SocialNetwork[0].Id==undefined) {
                delete $scope.newLayoutData.pageData.Content[0].SocialNetwork;
            }

            //update page
            var dataPage = $.param($scope.newLayoutData.pageData);
            var servPageCall = APIService.updatePage(dataPage);
            servPageCall.then(function (u) {
                $localStorage.LayoutData = $scope.newLayoutData;
                $window.location.href = "/#/cms/content/layouts/editor";
            }, function (error) {
                //error
            });
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.ChooseFile = function (source) {
            $scope.newLayoutData.ImageDest = source;
            $localStorage.LayoutData = $scope.newLayoutData;
            $window.location.href = "/#/cms/multimedia/library/choose";
        }

        $scope.GetPage = function () {
            //get Page Data from Solr
            var servCall = APIService.getPageByNodeIdSolr($scope.newLayoutData.Node.Id);
            servCall.then(function (u) {

                if (u.data.response.docs.length > 0) {
                    var page = u.data.response.docs[0];

                    $scope.newLayoutData.pageData.Id = page.Id;
                    $scope.newLayoutData.pageData.Url = page.Url;

                    $scope.newLayoutData.pageData.Content = [];
                    var Content = {
                        Title: page.Title_en,
                        LanguageId: 1
                    }
                    $scope.newLayoutData.pageData.Content.push(Content);

                    $scope.newLayoutData.pageData['Nodes[0].Id'] = $scope.newLayoutData.Node.Id;

                    if (page.MediaSizesPaths) {
                        $scope.newLayoutData.pageData.AssetMedia = [];
                        var MediaObj = {
                            Media: {
                                Id: page.Media_id[0],
                                SizesPaths: page.MediaSizesPaths
                            }
                        }
                        $scope.newLayoutData.pageData.AssetMedia.push(MediaObj);

                        $scope.pageImage = $scope.ImagePath + page.MediaSizesPaths.Size1Path;
                    }

                    $scope.newLayoutData.pageData.Content[0].SocialNetwork = [];

                    if (page.SocialNetworkId_en) {
                        var i = 0;
                        angular.forEach(page.SocialNetworkId_en, function (value, key) {
                            var item = {
                                Id: value,
                                Url: page.SocialNetworkUrl_en[i]
                            };

                            $scope.newLayoutData.pageData.Content[0].SocialNetwork.push(item);
                            i++;
                        });
                    } else {
                        $scope.newLayoutData.pageData.Content[0].SocialNetwork.push({});
                    }
                }
            }, function (error) {
                //error
            });
        }

        $scope.addSN = function () {
            var newItemNo = $scope.newLayoutData.pageData.Content[0].SocialNetwork.length + 1;
            $scope.newLayoutData.pageData.Content[0].SocialNetwork.push({});
        };

        $scope.removeSN = function () {
            var lastItem = $scope.newLayoutData.pageData.Content[0].SocialNetwork.length - 1;
            $scope.newLayoutData.pageData.Content[0].SocialNetwork.splice(lastItem);
        };

        $scope.RemoveMedia = function (source) {
            if (source === 'headerImage') {
                $scope.newLayoutData.Media = [];
                $scope.headerImage = "../images/placeholders/picture.png";
            }
            if (source === 'pageImage') {
                delete $scope.newLayoutData.pageData.AssetMedia;
                $scope.pageImage = "../images/placeholders/picture.png";
            }
        };
    })

    .controller('EditLayoutController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, $stateParams, AlertService, $localStorage) {

        //Gets User by Id for edit fields
        var id = $stateParams.id;

        $scope.ImagePath = $rootScope.mediaurl;
        $scope.headerImage = "../images/placeholders/picture.png";
        $scope.pageImage = "../images/placeholders/picture.png";

        $scope.layoutData = {};

        $scope.SNList = [
            { Id: 1, Name: 'Faceebook' },
            { Id: 2, Name: 'Twitter' },
            { Id: 3, Name: 'Instagram' },
            { Id: 4, Name: 'Youtube' }
        ];


        if ($localStorage.LayoutData) {
            $scope.layoutData = $localStorage.LayoutData;
            $localStorage.LayoutData = null;

            if ($scope.layoutData.ImageDest !== 'pageImage') {
                if ($scope.layoutData.Media) {
                    var sizesPaths = angular.fromJson($scope.layoutData.Media[0].SizesPaths);
                    $scope.headerImage = $scope.ImagePath + sizesPaths.Size1Path;
                }

                if ($scope.layoutData.pageData.AssetMedia) {
                    var sizesPaths = angular.fromJson($scope.layoutData.pageData.AssetMedia[0].Media.SizesPaths);
                    $scope.pageImage = $scope.ImagePath + sizesPaths.Size1Path;
                }
            } else {
                if ($scope.layoutData.MediaSize1Path) {
                    $scope.headerImage = $scope.ImagePath + $scope.layoutData.MediaSize1Path;
                } else {
                    if ($scope.layoutData.Media) {
                        var sizesPaths = angular.fromJson($scope.layoutData.Media[0].SizesPaths);
                        $scope.headerImage = $scope.ImagePath + sizesPaths.Size1Path;
                    }
                }

                if ($scope.layoutData.pageData.AssetMedia[0].Media) {
                    var sizesPaths = angular.fromJson($scope.layoutData.pageData.AssetMedia[0].Media.SizesPaths);
                    $scope.pageImage = $scope.ImagePath + sizesPaths.Size1Path;
                }
            }

            getLayoutInstances(id);

        } else {

            var servCall = APIService.getLayoutIntanceByNodeId(id);
            servCall.then(function (u) {
                $scope.layoutData = u.data.data;

                $scope.layoutData.pageData = {
                    IsEnabled: true
                };

                $scope.layoutData.PublicationDate = new Date($scope.layoutData.PublicationDate);

                if ($scope.layoutData.MediaSize1Path) {
                    $scope.headerImage = $scope.ImagePath + $scope.layoutData.MediaSize1Path;
                }

                getPageByNodeId(id);
                //getLayoutInstances(id);

                AlertService.ShowAlert($scope);
            }, function (error) {
                $window.location.href = "/#/cms/content/layouts/list";
            });
        }

        //get page info
        function getPageByNodeId(id) {
            //get Page Data from Solr
            var servCall = APIService.getPageByNodeIdSolr(id);
            servCall.then(function (u) {

                if (u.data.response.docs.length > 0) {
                    var page = u.data.response.docs[0];

                    $scope.layoutData.pageData.Id = page.Id;
                    $scope.layoutData.pageData.Url = page.Url;

                    $scope.layoutData.pageData.Content = [];
                    var Content = {
                        Title: page.Title_en,
                        LanguageId: 1
                    }
                    $scope.layoutData.pageData.Content.push(Content);

                    $scope.layoutData.pageData['Nodes[0].Id'] = id;

                    if (page.MediaSizesPaths) {
                        $scope.layoutData.pageData.AssetMedia = [];
                        var MediaObj = {
                                Media: {
                                    Id: page.Media_id[0]
                                }
                        }
                        $scope.layoutData.pageData.AssetMedia.push(MediaObj);

                        $scope.pageImage = $scope.ImagePath + page.MediaSizesPaths.Size1Path;
                    }

                    $scope.layoutData.pageData.Content[0].SocialNetwork = [];

                    if (page.SocialNetworkId_en) {
                        var i = 0;
                        angular.forEach(page.SocialNetworkId_en, function (value, key) {
                            var item = {
                                Id: value,
                                Url: page.SocialNetworkUrl_en[i]
                            };

                            $scope.layoutData.pageData.Content[0].SocialNetwork.push(item);
                            i++;
                        });
                    } else {
                        $scope.layoutData.pageData.Content[0].SocialNetwork.push({});
                    }
                }

                getLayoutInstances(id);

            }, function (error) {
                //error
            });
        }

        //Get Nodes enables for custom layouts
        function getLayoutInstances() {
            var servCall = APIService.getLayoutIntanceSolr(id);
            servCall.then(function (u) {
                $scope.LayoutInstances = u.data.response.docs;

                angular.forEach($scope.LayoutInstances, function (value, key) {
                    if ($scope.layoutData.Id === value.Id) {
                        value.css = 'check-circle blue';
                    } else {
                        if (new Date(value.PublicationDate) > new Date()) {
                            value.css = 'plus-circle green';
                        } else {
                            value.css = 'minus-circle red';
                        }
                    }
                });

            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //layout instance update
        $scope.processForm = function () {

            if ($scope.layoutData.pageData.Content[0].SocialNetwork[0].Id == undefined) {
                delete $scope.layoutData.pageData.Content[0].SocialNetwork;
            }

            $scope.layoutData.PublicationDate = moment($scope.layoutData.PublicationDate).format('YYYY-MM-DD HH:mm:ss');

            var data = $.param($scope.layoutData)
            var servCall = APIService.updateLayoutInstance(data);
            servCall.then(function (u) {
                //update page
                var dataPage = $.param($scope.layoutData.pageData);
                var servPageCall = APIService.updatePage(dataPage);

                //Set and display message
                AlertService.SetAlert("The layout instance has been updated successfully", "success");
                AlertService.ShowAlert($scope);
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        $scope.ShowEditor = function () {
            $window.location.href = "/#/cms/content/layouts/editor/" + $scope.layoutData.Id;
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.ChooseFile = function (source) {
            $scope.layoutData.ImageDest = source;
            $localStorage.LayoutData = $scope.layoutData;
            $window.location.href = "/#/cms/multimedia/library/choose";
        }

        $scope.addSN = function () {
            var newItemNo = $scope.layoutData.pageData.Content[0].SocialNetwork.length + 1;
            $scope.layoutData.pageData.Content[0].SocialNetwork.push({});
        };

        $scope.removeSN = function () {
            var lastItem = $scope.layoutData.pageData.Content[0].SocialNetwork.length - 1;
            $scope.layoutData.pageData.Content[0].SocialNetwork.splice(lastItem);
        };

        $scope.RemoveMedia = function (source) {
            if (source === 'headerImage') {
                $scope.layoutData.Media = [];
                $scope.headerImage = "../images/placeholders/picture.png";
            }
            if (source === 'pageImage') {
                delete $scope.layoutData.pageData.AssetMedia;
                $scope.pageImage = "../images/placeholders/picture.png";
            }
        };
    })

    .controller('EditorLayoutController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, $localStorage, $filter, $stateParams) {

        var id = $stateParams.id;

        if (id) {
            var servCall = APIService.getLayoutIntanceById(id);
            servCall.then(function (u) {
                $scope.layoutData = u.data.data;

                $scope.layoutData.PublicationDate = new Date($scope.layoutData.PublicationDate);

                $scope.newLayoutData = $scope.layoutData;

                //clean object before post it.
                angular.forEach($scope.newLayoutData.RegionInstances, function (reg) {

                    angular.forEach(reg.ComponentInstances, function (comp) {

                        if (comp.ReplacementData) {
                            if (comp.ReplacementData.AssetId !== 0) {
                                var asset = {
                                    Id: comp.ReplacementData.AssetId
                                }
                                comp.Assets.push(asset);
                            }

                            if (comp.ReplacementData.MediaId !== 0) {
                                var media = {
                                    Id: comp.ReplacementData.MediaId
                                }
                                comp.Media.push(media);
                            }
                        }

                    });

                });

                var servCall = APIService.getLayoutById($scope.newLayoutData.Layout.Id);
                servCall.then(function (u) {
                    $scope.layoutData = u.data.data;
                    //console.log($scope.layoutData);

                    RenderEditor();
                }, function (error) {
                    $window.location.href = "/#/cms/content/layouts/list";
                });

            }, function (error) {
                $window.location.href = "/#/cms/content/layouts/list";
            });
        } else {
            $scope.newLayoutData = $localStorage.LayoutData;
            $scope.newLayoutData.RegionInstances = [];

            var servCall = APIService.getLayoutById($scope.newLayoutData.Layout.Id);
            servCall.then(function (u) {
                $scope.layoutData = u.data.data;
                //console.log($scope.layoutData);

                RenderEditor();
            }, function (error) {
                $window.location.href = "/#/cms/content/layouts/list";
            });
        }

        //var editLayout = $localStorage.LayoutData;

        $rootScope.$on("CallRenderEditor", function () {
            if ($scope.layoutData != undefined) {
                RenderEditor();
            }
        });

        function RenderEditor() {

            //Main layout
            $scope.template = $scope.layoutData.Html;

            //Regions
            $scope.regions = $scope.layoutData.Regions;

            $scope.availableRegions = [];

            //get available regions
            angular.forEach($scope.regions, function (value) {
                $scope.availableRegions.push(value.ReplacementKey);
            })

            var reg_num = 0;

            angular.forEach($scope.availableRegions, function (value) {
                //Replace Keys
                var regionLayout = $filter("filter")($scope.regions, { ReplacementKey: value });

                //console.log("-----");
                if ($scope.newLayoutData.RegionInstances[reg_num]) {
                    //console.log('entro!!');

                    var currentLayoutId = $scope.newLayoutData.RegionInstances[reg_num].RegionLayout.Id;

                    //console.log(value + currentLayoutId);

                    var currentRegionLayout = $filter("filter")(regionLayout[0].RegionLayouts, { Id: currentLayoutId });

                    var regionLayoutTemplate = currentRegionLayout[0].Html;
                } else {
                    var regionLayoutTemplate = regionLayout[0].RegionLayouts[0].Html;
                }

                //default instance
                var RegionInstance = {
                    RegionLayout: {
                        Id: regionLayout[0].RegionLayouts[0].Id
                    },
                    ComponentInstances: []
                };

                regionLayoutTemplate = regionLayoutTemplate.replace("[{RegionInstance}]", reg_num);
                regionLayoutTemplate = regionLayoutTemplate.replace("[{RegionId}]", regionLayout[0].ReplacementKey);

                //components replace
                var comp_num = 0;
                angular.forEach(regionLayout[0].RegionLayouts[0].Component, function (comp) {

                    var compHtml = comp.ComponentLayouts[0].Html;

                    compHtml = compHtml.split('[{RegionInstance}]').join(reg_num);
                    compHtml = compHtml.split('[{ComponentInstance}]').join(comp_num);
                    compHtml = compHtml.replace('[{NODE-TITLE}]', '{{newLayoutData.RegionInstances[' + reg_num + '].ComponentInstances[' + comp_num + '].ReplacementData.NodeContentTitle}}');
                    compHtml = compHtml.replace('[{ASSET-TITLE}]', '{{newLayoutData.RegionInstances[' + reg_num + '].ComponentInstances[' + comp_num + '].ReplacementData.AssetContentTitle}}');
                    compHtml = compHtml.replace('[{MEDIA-TITLE}]', '{{newLayoutData.RegionInstances[' + reg_num + '].ComponentInstances[' + comp_num + '].ReplacementData.MediaTitle}}');

                    var sizeMedia = 'AssetMediaSizePath1';

                    switch(comp.Size) {
                        case 'size1':
                            sizeMedia = 'AssetMediaSizePath1';
                            break;
                        case 'size2':
                            sizeMedia = 'AssetMediaSizePath2';
                            break;
                        case 'size3':
                            sizeMedia = 'AssetMediaSizePath3';
                            break;
                        default:
                            sizeMedia = 'AssetMediaSizePath1';
                    }

                    compHtml = compHtml.replace('[{ASSETMEDIA-URL}]', '{{newLayoutData.RegionInstances[' + reg_num + '].ComponentInstances[' + comp_num + '].ReplacementData.' + sizeMedia + '}}');

                    var sizeMedia = 'MediaSizePath1';

                    switch (comp.Size) {
                        case 'size1':
                            sizeMedia = 'MediaSizePath1';
                            break;
                        case 'size2':
                            sizeMedia = 'MediaSizePath2';
                            break;
                        case 'size3':
                            sizeMedia = 'MediaSizePath3';
                            break;
                        default:
                            sizeMedia = 'MediaSizePath1';
                    }

                    compHtml = compHtml.replace('[{MEDIA-URL}]', '{{newLayoutData.RegionInstances[' + reg_num + '].ComponentInstances[' + comp_num + '].ReplacementData.' + sizeMedia + '}}');

                    regionLayoutTemplate = regionLayoutTemplate.replace(comp.ReplacementKey + "[{" + comp.Position + "}]", compHtml);

                    var ComponentInstance = {
                        ComponentLayout: {
                            Id: comp.ComponentLayouts[0].Id
                        },
                        Assets: [],
                        Media: [],
                        Position: comp.Position,
                        Size: comp.Size
                    }

                    RegionInstance.ComponentInstances.push(ComponentInstance);

                    comp_num++;
                });

                //default instance
                if (!id) {
                    $scope.newLayoutData.RegionInstances.push(RegionInstance);
                }

                $scope.template = $scope.template.replace(value, regionLayoutTemplate);

                reg_num++;
            });

            $rootScope.newLayoutData = $scope.newLayoutData;

        }


        function occurrences(string, subString, allowOverlapping) {

            string += "";
            subString += "";
            if (subString.length <= 0) return (string.length + 1);

            var n = 0,
                pos = 0,
                step = allowOverlapping ? 1 : subString.length;

            while (true) {
                pos = string.indexOf(subString, pos);
                if (pos >= 0) {
                    ++n;
                    pos += step;
                } else break;
            }
            return n;
        }

        //Submit NewUser form
        $scope.processForm = function () {

            $rootScope.newLayoutData.PublicationDate = moment($rootScope.newLayoutData.PublicationDate).format('YYYY-MM-DD HH:mm:ss');

            //clean object before post it.
            angular.forEach($rootScope.newLayoutData.RegionInstances, function (reg) {

                angular.forEach(reg.ComponentInstances, function (comp) {

                    angular.forEach(comp.Assets, function (asset) {
                        delete asset.Content;
                        delete asset.Nodes;
                        delete asset.Galleries;
                        delete asset.Authors;
                        delete asset.AssetMedia;
                    });

                });

            });

            if ($rootScope.newLayoutData.Id!=undefined)
                $rootScope.newLayoutData.ParentLayoutInstanceId = $rootScope.newLayoutData.Id;

            //console.log($rootScope.newLayoutData);

            var data = $.param($rootScope.newLayoutData);
            var servCall = APIService.createLayoutInstance(data);
            servCall.then(function (u) {
                //var authorData = u.data.data;
                ////Set message
                //AlertService.SetAlert("The author has been created successfully", "success");
                $rootScope.newLayoutData = null;

                $window.location.href = "/#/cms/content/layouts/list";
            }, function (error) {
                //console.log(error);
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //modal assets
        $scope.showAssets = function (ev, reg_num, comp_num, asset_type) {

            if (asset_type == undefined)
                asset_type = 'News';
            //console.log(ev);

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'pages/content/dialog-assets.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                locals: {
                    reg_num: reg_num,
                    comp_num: comp_num,
                    asset_type: asset_type
                },
                onRemoving: function (event, removePromise) {
                    ReloadImages();
                }
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        function DialogController($scope, $mdDialog, APIService, DTOptionsBuilder, DTColumnBuilder, $http, $compile, $rootScope, reg_num, comp_num, asset_type) {

            $scope.ImagePath = $rootScope.mediaurl;
            $scope.featuredImage = "../images/placeholders/picture.png";

            $scope.reg_num = reg_num;
            $scope.comp_num = comp_num;

            $scope.PublicationDateFrom = null;
            $scope.PublicationDateTo = null;

            $scope.Nodes = [];
            $scope.selectedNodes = [];

            // --------- agrego filtro x nodo segun region (TODO: Hacer dinamico)
            if (reg_num === 4) {
                $scope.Nodes = [2];
            }

            if (reg_num === 5) {
                $scope.Nodes = [3];
            }

            if (reg_num === 6) {
                $scope.Nodes = [4];
            }
            // -------- agrego filtro x nodo segun region (TODO: Hacer dinamico)

            //datatables configuration
            $scope.dtInstance = {};

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('Title_en', 'Title').renderWith(renderTitle),
                DTColumnBuilder.newColumn('Nodes_en', 'Categories').renderWith(renderCat).notSortable(),
                DTColumnBuilder.newColumn('PublicationDate', 'Publication Date').renderWith(renderDate)
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
                        .withDisplayLength(10)
                        .withOption('order', [2, 'desc']);

            $scope.dtOptions.withOption('fnRowCallback',
             function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                 $compile(nRow)($scope);
             });

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

                //filter by categories
                var fc = "";
                angular.forEach($scope.Nodes, function (value, key) {
                    if (fc != "")
                        fc += " OR ";
                    fc += "Nodes_Id:" + value;
                });
                if (fc != "")
                    fc = " AND (" + fc + ")";

                //filter by status
                var fs = "";
                if (asset_type == 'News') {
                    fs = " AND Status:PUBLISHED";
                }

                //filter by publication date
                var fd = "";
                if ($scope.PublicationDateFrom || $scope.PublicationDateTo) {
                    var dateFrom = "*";
                    if ($scope.PublicationDateFrom)
                        dateFrom = moment($scope.PublicationDateFrom).format('YYYY-MM-DD') + "T00:00:00Z";

                    var dateTo = "*";
                    if ($scope.PublicationDateTo)
                        dateTo = moment($scope.PublicationDateTo).format('YYYY-MM-DD') + "T00:00:00Z";

                    fd = "&fq=PublicationDate:[" + dateFrom + " TO " + dateTo + "]";
                }

                //facets
                var fa = "&facet=true&facet.field=Status";

                //query constructor
                var qs = "?q=" + q + fc + fs + " AND IsDeleted:false" + fd + "&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,Title_en,Nodes_en,PublicationDate,Status&sort=" + sort + fa + "&no-pace";

                //console.log(qs);

                //query execution
                $http({
                    method: 'GET',
                    url: $rootScope.webapiurl + "api/" + asset_type + "/GetAllSolr" + qs,
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

                    //render filter by Status
                    var statusFilterArr = result.data.facet_counts.facet_fields.Status;
                    $scope.statusFilter = [];

                    for (var i = 0; i < statusFilterArr.length; i++) {
                        $scope.statusFilter.push({
                            Name: statusFilterArr[i],
                            Value: statusFilterArr[++i]
                        });
                    }
                });
            }

            //datatables render category field
            function renderCat(data, type, full, meta) {
                var html = '';
                angular.forEach(data, function (value, key) {
                    html += '<span class="tag">' + value + '</span>';
                });
                return html;
            }

            //datatables render title field
            function renderTitle(data, type, full, meta) {
                var css = 'gray';
                switch (full.Status) {
                    case 'DRAFT':
                        css = "gray";
                        break;
                    case 'PENDING_APPROVAL':
                        css = "yellow";
                        break;
                    case 'APPROVED':
                        css = "blue";
                        break;
                    case 'PUBLISHED':
                        css = "green";
                        break;
                }

                var html = '<i class="fa fa-circle ' + css + '" title="' + full.Status + '"></i>';
                html += '<a ng-click="SetAsset(' + full.Id + ', \'' + asset_type + '\')" class="title"><strong>' + full.Title_en + '</strong></a>';
                html += '<span class="ref">' + full.Id + '</span>';

                return html;
            }

            //datatables render date field
            function renderDate(data, type, full, meta) {
                if (data) {
                    var html = $filter('date')(data, "d-MMM-yyyy");
                    return html;
                }
                return "";
            }

            //render tree category list
            $scope.treeOptions = {
                nodeChildren: "Childs",
                dirSelectable: true,
                multiSelection: true
            }

            function parseTree(parent, tree) {
                angular.forEach(tree, function (value, key) {

                    if ($scope.Nodes.indexOf(value.Id) !== -1) {
                    //if (arrayObjectIndexOf($scope.Nodes, value.Id, "Id") !== -1) {
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

            getNodeTree();

            function getNodeTree() {
                var servCall = APIService.getNodeTreeNoPace();
                servCall.then(function (n) {
                    $scope.dataForTheTree = n.data.data;
                    $scope.expandedNodes = [$scope.dataForTheTree[0]];
                    if ($scope.Nodes.length>0)
                        parseTree(null, $scope.dataForTheTree);
                    //getKeywords();
                }, function (error) {
                    //$scope.errorMessage = "Oops, something went wrong.";
                    getNodeTree();
                })
            }

            //node tree selection
            $scope.showSelected = function (node, selected) {
                if (selected) {
                    $scope.Nodes.push(node.Content[0].Id);
                } else {
                    var index = getIndexBy($scope.Nodes, "Id", node.Content[0].Id);
                    $scope.Nodes.splice(index, 1);
                }
                $scope.doSearch();
            };

            $scope.doSearch = function ($event) {
                $scope.dtInstance.rerender();
                if ($event != undefined) {
                    var target = $event.target;
                    target.blur();
                }
            }

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            //common functions
            function getIndexBy(obj, name, value) {
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i][name] == value) {
                        return i;
                    }
                }
                return -1;
            }

            //add asset to component instance
            $scope.SetAsset = function (id, asset_type) {
                //alert($scope.reg_num);

                //get Asset Info
                if (asset_type == 'News') {
                    var servCall = APIService.getAssetByIdSolr(id);
                } else {
                    var servCall = APIService.getPageByIdSolr(id);
                }
                servCall.then(function (u) {
                    var asset = u.data.response.docs[0];

                    //console.log(asset);

                    var assetNode = {
                        Id: asset.Id
                    }

                    if (asset.MediaSizesPaths != undefined) {
                        var ReplacementData = {
                            AssetContentTitle: asset.Title_en,
                            NodeContentTitle: asset.Nodes_en[0],
                            AssetMediaSizePath1: asset.MediaSizesPaths.Size1Path,
                            AssetMediaSizePath2: asset.MediaSizesPaths.Size2Path,
                            AssetMediaSizePath3: asset.MediaSizesPaths.Size3Path
                        }
                    } else {
                        var ReplacementData = {
                            AssetContentTitle: asset.Title_en,
                            NodeContentTitle: asset.Nodes_en[0]
                        }
                    }

                    $rootScope.newLayoutData.RegionInstances[$scope.reg_num].ComponentInstances[$scope.comp_num].Assets.splice(0, 1);
                    $rootScope.newLayoutData.RegionInstances[$scope.reg_num].ComponentInstances[$scope.comp_num].Assets.push(assetNode);

                    $rootScope.newLayoutData.RegionInstances[$scope.reg_num].ComponentInstances[$scope.comp_num].ReplacementData = ReplacementData;

                    //fixes problem with image replace TODO: find better solution
                    setTimeout(function () {
                        $mdDialog.hide();
                    }, 50);

                }, function (error) {
                    //$scope.errorMessage = "Oops, something went wrong.";
                })



            };
        }

        //modal regions layouts
        $scope.showRegions = function (ev, reg_id, reg_num) {

            //console.log(ev);

            $mdDialog.show({
                controller: DialogRegionController,
                templateUrl: 'pages/content/dialog-regions.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                locals: {
                    reg_id: reg_id,
                    reg_num: reg_num,
                    layoutData: $scope.layoutData
                }
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        function DialogRegionController($scope, $mdDialog, APIService, DTOptionsBuilder, DTColumnBuilder, $http, $compile, $rootScope, reg_id, layoutData, reg_num) {

            //get current region
            var currentRegion = $filter("filter")(layoutData.Regions, { ReplacementKey: reg_id }, true);
            // current region layouts
            $scope.availableRegionLayouts = currentRegion[0].RegionLayouts;

            //console.log($scope.availableRegionLayouts);
            $scope.activeLayout = $rootScope.newLayoutData.RegionInstances[reg_num].RegionLayout.Id;

            $scope.SetLayout = function (id) {
                $rootScope.newLayoutData.RegionInstances[reg_num].RegionLayout.Id = id;
                $scope.activeLayout = id;

                $rootScope.$emit("CallRenderEditor", {});
            };

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }

        //Video Widget Options
        $scope.showVideoOpt = function (ev) {
            $mdDialog.show({
                controller: DialogVideoController,
                templateUrl: 'pages/content/dialog-video-widget.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        function DialogVideoController($scope, $mdDialog, APIService) {
            $scope.selected = [];

            getMediaCategories();

            function getMediaCategories() {
                var servCall = APIService.getMediaCategories();
                servCall.then(function (u) {
                    $scope.categories = u.data.response.docs;

                    angular.forEach($scope.categories, function (value, key) {
                        if (value.Featured === true) {
                            $scope.selected.push(value);
                        }
                    });

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }

            $scope.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    if (list.length<4)
                        list.push(item);
                }
            };

            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.save = function () {

                angular.forEach($scope.categories, function (value, key) {
                    if ($scope.exists(value, $scope.selected)) {
                        value.Featured = true;
                    } else {
                        value.Featured = false;
                    }

                    var data = $.param(value);
                    var servCall = APIService.updateMediaCategory(data);
                    servCall.then(function (u) {
                        $mdDialog.hide();
                    }, function (error) {
                        $scope.errorMessage = "Oops, something went wrong.";
                    })
                });


            };
        }

        //modal assets
        $scope.showMedia = function (ev, reg_num, comp_num, asset_type) {

            if (asset_type == undefined)
                asset_type = 'News';
            //console.log(ev);

            $mdDialog.show({
                controller: MediaDialogController,
                templateUrl: 'pages/content/dialog-media.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                locals: {
                    reg_num: reg_num,
                    comp_num: comp_num,
                    asset_type: asset_type
                },
                onRemoving: function (event, removePromise) {
                    ReloadImages();
                }
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        function MediaDialogController($scope, $mdDialog, APIService, DTOptionsBuilder, DTColumnBuilder, $http, $compile, $rootScope, reg_num, comp_num, asset_type) {

            $scope.reg_num = reg_num;
            $scope.comp_num = comp_num;

            $scope.ImagePath = $rootScope.mediaurl;

            $scope.currentPage = 1;

            var url = "api/Media/GetAllSolr?q=*&start=0&rows=6&fl=Id,Title,Keywords,FileName,SizesPaths&sort=Id desc&facet.field=Categories_Name&facet.field=Categories_Id&facet=on&facet.mincount=1";
            getAllMedia(url);
            //Get Media
            function getAllMedia(url) {
                var servCall = APIService.getMedia(url);
                servCall.then(function (u) {

                    $scope.medias = u.data.response.docs;
                    ////$scope.pagination = u.data.pagination;

                    $scope.paginationTotalItems = u.data.response.numFound;
                    $scope.paginationShowFrom = ($scope.currentPage - 1) * 6 + 1;
                    $scope.paginationShowTo = $scope.paginationShowFrom + 5;
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
                    //AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }

            $scope.pageChanged = function () {
                var q = '*';
                if ($scope.searchQuery != undefined && $scope.searchQuery != "") {
                    q = $scope.searchQuery;
                }

                //filter by status
                var fs = "";
                if ($scope.filterByStatus) {
                    fs = " AND Categories_Id:" + $scope.filterByStatus.Status;
                }

                var url = "api/Media/GetAllSolr?q=" + q + fs + "&start=" + ($scope.currentPage - 1) * 6 + "&rows=6&fl=Id,Title,Keywords,FileName,SizesPaths&sort=Id desc&facet.field=Categories_Name&facet.field=Categories_Id&facet=on&facet.mincount=1";
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
            $scope.setMedia = function (id) {
                //get Asset Info
                var servCall = APIService.getMediaByIdSolr(id);

                servCall.then(function (u) {
                    var asset = u.data.response.docs[0];

                    //console.log(asset);

                    var assetNode = {
                        Id: asset.Id
                    }

                    var Category = '';
                    if (asset.Categories_Name != undefined)
                        Category = asset.Categories_Name[0];

                    if (asset.SizesPaths != undefined) {
                        var ReplacementData = {
                            MediaTitle: asset.Title,
                            NodeContentTitle: Category,
                            MediaSizePath1: asset.SizesPaths.Size1Path,
                            MediaSizePath2: asset.SizesPaths.Size2Path,
                            MediaSizePath3: asset.SizesPaths.Size3Path
                        }
                    } else {
                        var ReplacementData = {
                            MediaTitle: asset.Title,
                            NodeContentTitle: Category
                        }
                    }

                    $rootScope.newLayoutData.RegionInstances[$scope.reg_num].ComponentInstances[$scope.comp_num].Media.splice(0, 1);
                    $rootScope.newLayoutData.RegionInstances[$scope.reg_num].ComponentInstances[$scope.comp_num].Media.push(assetNode);

                    $rootScope.newLayoutData.RegionInstances[$scope.reg_num].ComponentInstances[$scope.comp_num].ReplacementData = ReplacementData;

                    //fixes problem with image replace TODO: find better solution
                    setTimeout(function () {
                        $mdDialog.hide();
                    }, 50);

                }, function (error) {
                    //$scope.errorMessage = "Oops, something went wrong.";
                })
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
        }
    })
