'use strict';
angular
    .module('app.controllers')

    .controller('CategoriesController', function ($scope, APIService, $route, $mdDialog, AlertService, $location, $localStorage) {
        //reset local storage
        $localStorage.$reset();

        $scope.showForm = false;
        $scope.showSaveOrder = false;

        $scope.updatedNodes = [];
        $scope.updatedParentNodes = [];

        $scope.createNodeData = {
            Visible: 'True'
        };

        function getNodeTree(clearCache) {
            var servCall = APIService.getNodeTree(clearCache);
            servCall.then(function (n) {
                $scope.dataForTheTree = n.data.data;
                $scope.createNodeData.Id = 0;
                $scope.expandedNodes = [$scope.dataForTheTree[0]];
                AlertService.ShowAlert($scope);
            }, function (error) {
                //$scope.errorMessage = "Oops, something went wrong.";
                //todo: set a limit of reloads because a performance issue
                getNodeTree(clearCache);
            })
        }

        $scope.treeOptions = {
            nodeChildren: "Childs",
            dirSelectable: true
        }

        getNodeTree(false);

        $scope.showSelected = function (sel, selected) {
            $scope.pageData = {
                IsEnabled: true
            };

            if (selected) {
                $scope.SelectedNode = sel;

                //get Page Data from Solr
                var servCall = APIService.getPageByNodeIdSolr(sel.Id);
                servCall.then(function (u) {
                    if (u.data.response.docs.length > 0) {
                        var page = u.data.response.docs[0];

                        $scope.pageData.Id = page.Id;
                        $scope.pageData['Content[0].Title'] = page.Title_en;
                    }

                    var SelContent = $scope.SelectedNode.Content[0];

                    $scope.createNodeData.Id = sel.Id;
                    $scope.createNodeData['Content[0].Title'] = SelContent.Title;
                    $scope.createNodeData.Description = $scope.SelectedNode.Description;
                    $scope.createNodeData.Visible = $scope.SelectedNode.Visible;
                    $scope.createNodeData.IsEnabled = $scope.SelectedNode.IsEnabled;
                    $scope.createNodeData.HasCustomLayout = $scope.SelectedNode.HasCustomLayout;
                    $scope.createNodeData.Order = $scope.SelectedNode.Order;
                    $scope.createNodeData['Content[0].LanguageId'] = 1;

                }, function (error) {
                    //error
                });

            } else {
                //$scope.showSaveOrder = true;
                $scope.SelectedNode = {};
                $scope.createNodeData = {};
                $scope.createNodeData.Id = 0;
                $scope.createNodeData['Content[0].LanguageId'] = 1;
                $scope.createNodeData.Visible = true;
                $scope.createNodeData.IsEnabled = true;
                $scope.createNodeData.HasCustomLayout = false;
            }
        };

        //create new node
        $scope.createNodeData = {};
        $scope.createNode = function () {
            var data = $.param($scope.createNodeData);

            //console.log(data);
            if ($scope.createNodeData.Id == 0 || $scope.createNodeData.Id == undefined)
                var servCall = APIService.createNode(data);
            else
                var servCall = APIService.updateNode(data);

            servCall.then(function (u) {
                if ($scope.createNodeData.Id == 0 || $scope.createNodeData.Id == undefined)
                    var nodeId = u.data.data.Id;
                else
                    var nodeId = $scope.createNodeData.Id;

                //Page CRUD
                if ($scope.createNodeData.HasCustomLayout === true) {
                    if ($scope.pageData.Id === undefined) {
                        //create
                        $scope.pageData.Url = $scope.createNodeData.Description;
                        $scope.pageData['Content[0].LanguageId'] = 1;
                        $scope.pageData['Nodes[0].Id'] = nodeId;

                        var dataPage = $.param($scope.pageData);
                        var servPageCall = APIService.createPage(dataPage);
                    } else {
                        //update
                        $scope.pageData.Url = $scope.createNodeData.Description;
                        $scope.pageData['Content[0].LanguageId'] = 1;
                        $scope.pageData['Nodes[0].Id'] = nodeId;

                        var dataPage = $.param($scope.pageData);
                        var servPageCall = APIService.updatePage(dataPage);
                    }
                } else {
                    if ($scope.pageData.Id !== undefined) {
                        //delete
                        var data = $.param({
                            id: $scope.pageData.Id,
                        })
                        var servCall = APIService.deletePage(data);
                        servCall.then(function (u) {
                            //ok
                        }, function (error) {
                            //error
                        })
                    }
                }



                //reset form
                $scope.selected = null;
                $scope.SelectedNode = {};
                $scope.createNodeData = {};
                $scope.createNodeData.Id = 0;
                $scope.createNodeData['Content[0].LanguageId'] = 1;
                $scope.createNodeData.Visible = true;
                $scope.createNodeData.IsEnabled = true;
                $scope.createNodeData.HasCustomLayout = false;

                //Set and display message
                if ($scope.createNodeData.Id == 0 || $scope.createNodeData.Id == undefined) {
                    AlertService.SetAlert("The category has been created successfully", "success");
                } else {
                    AlertService.SetAlert("The category has been updated successfully", "success");
                }

                //update tree
                getNodeTree(true);

                $scope.createNodeForm.$setPristine();
                $scope.createNodeForm.$setUntouched();

                $scope.showForm = false;
                //$scope.showSaveOrder = true;

            }, function (error) {
                console.log(error);
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Cancel
        $scope.Cancel = function () {
            $scope.showForm = false;
            $scope.createNodeData = {};
        }

        //Edit Node
        $scope.newNode = function () {
            var totalChildren = $scope.SelectedNode.Childs.length;

            $scope.showForm = true;
            $scope.createNodeData = {};
            $scope.createNodeData.Id = 0;
            $scope.createNodeData['ParentNode.Id'] = $scope.SelectedNode.Id;
            $scope.createNodeData['Content[0].LanguageId'] = 1;
            $scope.createNodeData.Order = totalChildren + 1;
            $scope.createNodeData.Visible = true;
            $scope.createNodeData.IsEnabled = true;
            $scope.createNodeData.HasCustomLayout = false;
            $scope.pageData = {
                IsEnabled: true
            };
        }

        //Delete Node
        $scope.deleteNode = function (ev) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Category')
                  .textContent('Are you sure you want to delete this category?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: $scope.SelectedNode.Id,
                })
                var servCall = APIService.deleteNode(data);
                servCall.then(function (u) {
                    //reset form
                    $scope.SelectedNode = {};
                    $scope.createNodeData = {};
                    $scope.createNodeData.Id = 0;
                    $scope.createNodeData['Content[0].LanguageId'] = 1;

                    //Set and display message
                    AlertService.SetAlert("The category has been removed successfully", "success");

                    //update tree
                    getNodeTree(true);

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        $scope.updateTree = function () {

            //nodes ddbb update
            angular.forEach($scope.updatedNodes, function (value, key) {
                console.log(value);
                var data = $.param(value);
                var servCall = APIService.updateNode(data);

                servCall.then(function (u) {

                }, function (error) {
                    console.log(error);
                    //$scope.errorMessage = "Oops, something went wrong.";
                })

            });

            console.log("//order ddbb update");

            //order ddbb update
            angular.forEach($scope.updatedParentNodes, function (nodes, key) {
                var i = 1;
                angular.forEach(nodes, function (item, key) {
                    console.log(item);
                    item.Order = i;
                    var data = $.param(item);
                    var servCall = APIService.updateNode(data);
                    servCall.then(function (u) {

                    }, function (error) {
                        console.log(error);
                        //$scope.errorMessage = "Oops, something went wrong.";
                    })

                    i++;
                });
            });

            //update tree
            getNodeTree(true);

            AlertService.SetAlert("The new order has been saved successfully", "success");

            $scope.showSaveOrder = false;
            angular.element(document.querySelector('#SaveOrder')).addClass('ng-hide');

        };

    })

    .controller('AssetsController', function ($scope, APIService, $route, $mdDialog, $cookies, $window, DTOptionsBuilder, DTColumnBuilder, $timeout, AlertService, $rootScope, $http, $filter, $localStorage) {
        //reset local storage
        $localStorage.$reset();

        //Display message if necessary
        AlertService.ShowAlert($scope);

        $scope.PublicationDateFrom = null;
        $scope.PublicationDateTo = null;

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
                    .withDisplayLength(20)
                    .withOption('order', [2, 'desc']);

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
            if ($scope.filterByStatus) {
                fs = " AND Status:" + $scope.filterByStatus.Status;
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

            console.log(qs);

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/News/GetAllSolr" + qs,
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
                //html += '<span class="tag">' + value + '</span>';
                html += '' + value + '';
            });
            return html;
        }

        //datatables render title field
        function renderTitle(data, type, full, meta) {
            var css = 'gray';
            switch (full.Status) {
                case 'DRAFT':
                    css = "cog gray";
                    break;
                case 'PENDING_APPROVAL':
                    css = "clock-o yellow";
                    break;
                case 'APPROVED':
                    css = "check-circle-o green";
                    break;
                case 'PUBLISHED':
                    css = "check-circle blue";
                    break;
            }

            var html = '<i class="fa fa-' + css + '" title="' + full.Status + '"></i>';
            html += '<a href="/#/cms/content/assets/crud/' + full.Id + '" class="title"><strong>' + full.Title_en + '</strong></a>';
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

        getNodeTree();

        function getNodeTree() {
            var servCall = APIService.getNodeTree();
            servCall.then(function (n) {
                $scope.dataForTheTree = n.data.data;
                $scope.expandedNodes = [$scope.dataForTheTree[0]];
                //getKeywords();
            }, function (error) {
                //$scope.errorMessage = "Oops, something went wrong.";
                getNodeTree();
            })
        }

        //node tree selection
        $scope.Nodes = [];
        $scope.showSelected = function (node, selected) {
            if (selected) {
                $scope.Nodes.push(node.Content[0].Id);
            } else {
                var index = getIndexBy($scope.Nodes, "Id", node.Content[0].Id);
                $scope.Nodes.splice(index, 1);
            }
            $scope.doSearch();
        };

        //status filter selection
        $scope.filterList = function (key) {
            if (key) {
                $scope.filterByStatus = { Status: key };
            } else {
                $scope.filterByStatus = null;
            }
            $scope.doSearch();
        }

        //common functions
        function getIndexBy(obj, name, value) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][name] == value) {
                    return i;
                }
            }
            return -1;
        }

        $scope.doSearch = function ($event) {
            $scope.dtInstance.rerender();
            if ($event != undefined) {
                var target = $event.target;
                target.blur();
            }
        }

    })

    .controller('AssetCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, $http, $timeout, $q, $log, textAngularManager, AlertService, $stateParams, $localStorage, Slug) {

        var id = $stateParams.id;

        //labels
        if (id) {
            $scope.PageTitle = 'Edit Asset';
            $scope.SubmitButton = 'Update Asset';
        } else {
            $scope.PageTitle = 'Create Asset';
            $scope.SubmitButton = 'Create Asset';
        }

        $scope.date = new Date();

        $scope.ImagePath = $rootScope.mediaurl;
        $scope.featuredImage = "../images/placeholders/picture.png";
        $scope.abc = [];

        $scope.treeOptions = {
            nodeChildren: "Childs",
            dirSelectable: true,
            multiSelection: true
        }

        $scope.selectedNodes = [];
        $scope.assetData = {};
        $scope.assetData.AssetMedia = {};

        //Get Authors
        function getAllAuthors() {
            var servCall = APIService.getAuthors();
            servCall.then(function (u) {
                $scope.authors = u.data.response.docs;
                getNodeTree();
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

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

                angular.forEach($scope.assetData.Nodes, function (value, key) {
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

        if ($localStorage.AssetData) {
            $scope.assetData = $localStorage.AssetData;
            $localStorage.AssetData = null;

            if ($scope.assetData.AssetMedia.length > 0) {
                $scope.featuredImage = $scope.ImagePath + "Files/" + $scope.assetData.AssetMedia[0].Media.FileName;
            }

            //check if there is an image to insert in texteditor
            if ($scope.assetData.ImageToInsert != undefined) {
                var obj = angular.fromJson($scope.assetData.ImageToInsert.SizesPaths);
                var imagePath = $scope.ImagePath + "Files/Sizes/" + obj.Size2Path.replace(/\\/g, "/");

                console.log(imagePath);

                $scope.assetData.Content[0].Content += '<img src="' + imagePath + '"/>';
            }

            if ($scope.assetData.Content[0].Keywords) {
                var listKeywords = $scope.assetData.Content[0].Keywords.split(',');

                angular.forEach(listKeywords, function (value) {
                    $scope.abc.push({
                        Id: value,
                        Name: value
                    });
                });
            }

            getAllAuthors();

        } else {

            //Gets User by Id for edit fields
            if (id) {
                var servCall = APIService.getAssetById(id);
                servCall.then(function (u) {
                    $scope.assetData = u.data.data;

                    //console.log($scope.assetData);
                    if ($scope.assetData.PublicationDate) {
                        $scope.assetData.PublicationDate = new Date($scope.assetData.PublicationDate);
                        $scope.assetData.PublicationDate.setDate($scope.assetData.PublicationDate.getDate() + 1);
                    }

                    if ($scope.assetData.ExpirationDate) {
                        $scope.assetData.ExpirationDate = new Date($scope.assetData.ExpirationDate);
                        $scope.assetData.ExpirationDate.setDate($scope.assetData.ExpirationDate.getDate() + 1);
                    }

                    if ($scope.assetData.Content[0].Keywords) {
                        var listKeywords = $scope.assetData.Content[0].Keywords.split(',');

                        angular.forEach(listKeywords, function (value) {
                            $scope.abc.push({
                                Id: value,
                                Name: value
                            });
                        });
                    }

                    if ($scope.assetData.AssetMedia.length > 0) {
                        $scope.featuredImage = $scope.ImagePath + "Files/" + $scope.assetData.AssetMedia[0].Media.FileName;
                    }

                    getAllAuthors();
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    //$scope.errorMessage = "Oops, something went wrong.";
                    $window.location.href = "/#/cms/content/assets/list";
                });
            } else {
                getAllAuthors();
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

        //User update
        $scope.processForm = function () {

            //fix date format problem, see to implement in configuration section
            if ($scope.assetData.PublicationDate) {
                $scope.assetData.PublicationDate = moment($scope.assetData.PublicationDate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.assetData.ExpirationDate) {
                $scope.assetData.ExpirationDate = moment($scope.assetData.ExpirationDate).format('YYYY-MM-DD HH:mm:ss');
            }

            $scope.assetData.Nodes = $scope.Nodes;

            $scope.assetData.Content[0].Keywords = createString($scope.abc, "Name");

            if ($scope.assetData.AssetMedia.length > 0) {
                var featuredImageId = $scope.assetData.AssetMedia[0].Media.Id;
                delete $scope.assetData['AssetMedia'];
                $scope.assetData['AssetMedia[0].Media.Id'] = featuredImageId;
            }

            var data = $.param($scope.assetData);

            if (id) {
                var servCall = APIService.updateAsset(data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("The asset has been updated successfully", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createAsset(data);
                servCall.then(function (u) {
                    var assetData = u.data.data;
                    //Set message
                    AlertService.SetAlert("The asset has been created successfully", "success");
                    $window.location.href = "/#/cms/content/assets/crud/" + assetData.Id;
                }, function (error) {
                    console.log(error);
                    $scope.errorMessage = "Oops, something went wrong.";
                });
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

        function createString(arr, key) {
            return arr.map(function (obj) {
                return obj[key];
            }).join(',');
        }

        // list of `keywords` Id/Name objects
        $scope.selected = [];

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

            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }
            chip = chip.toLowerCase();
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

        //Delete Asset
        $scope.deleteAsset = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Asset')
                  .textContent('Are you sure you want to delete this asset?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteAsset(data);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("The asset has been removed successfully", "success");
                    $window.location.href = "/#/cms/content/assets/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        //Approval request
        $scope.sendApproval = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Approval Request Asset')
                  .textContent('Are you sure you want to request approval this asset?')
                  .ariaLabel('Approval Request')
                  .targetEvent(ev)
                  .ok('Request')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.sendApproval(data);
                servCall.then(function (u) {
                    $scope.assetData.Status = 'PENDING_APPROVAL';
                    //Set and display message
                    AlertService.SetAlert("The approval request has been sent successfully", "success");
                    AlertService.ShowAlert($scope);
                    //$window.location.href = "/#/Content/Assets";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        //Approve
        $scope.approve = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Approve Asset')
                  .textContent('Are you sure you want to approve this asset?')
                  .ariaLabel('Approve')
                  .targetEvent(ev)
                  .ok('Approve')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.approve(data);
                servCall.then(function (u) {
                    $scope.assetData.Status = 'APPROVED';
                    //Set and display message
                    AlertService.SetAlert("The asset has been approved successfully", "success");
                    AlertService.ShowAlert($scope);
                    //$window.location.href = "/#/Content/Assets";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        //Disapprove
        $scope.disapprove = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Disapprove Asset')
                  .textContent('Are you sure you want to disapprove this asset?')
                  .ariaLabel('Disapprove')
                  .targetEvent(ev)
                  .ok('Disapprove')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.disapprove(data);
                servCall.then(function (u) {
                    $scope.assetData.Status = 'DRAFT';
                    //Set and display message
                    AlertService.SetAlert("The asset has been disapproved successfully", "success");
                    AlertService.ShowAlert($scope);
                    //$window.location.href = "/#/Content/Assets";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        //Publish
        $scope.publish = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Publish Asset')
                  .textContent('Are you sure you want to publish this asset?')
                  .ariaLabel('Publish')
                  .targetEvent(ev)
                  .ok('Publish')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.publish(data);
                servCall.then(function (u) {
                    $scope.assetData.Status = 'PUBLISHED';
                    //Set and display message
                    AlertService.SetAlert("The asset has been published successfully", "success");
                    AlertService.ShowAlert($scope);
                    //$window.location.href = "/#/Content/Assets";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.ChooseFile = function (dest) {
            $scope.assetData.Nodes = $scope.Nodes;
            $scope.assetData.Content[0].Keywords = createString($scope.abc, "Name");
            $scope.assetData.ImageDest = dest;
            $localStorage.AssetData = $scope.assetData;
            $window.location.href = "/#/cms/multimedia/library/choose";
        }

        //Add Gallery
        $scope.AddGallery = function () {
            $scope.assetData.Nodes = $scope.Nodes;
            $scope.assetData.Content[0].Keywords = createString($scope.abc, "Name");
            $localStorage.AssetData = $scope.assetData;
            $window.location.href = "/#/cms/multimedia/gallery/list";
        }

        $scope.editGallery = function (id) {
            $scope.assetData.Nodes = $scope.Nodes;
            $scope.assetData.Content[0].Keywords = createString($scope.abc, "Name");
            $localStorage.AssetData = $scope.assetData;
            $window.location.href = "/#/cms/multimedia/gallery/crud/" + id;
        }

        $scope.removeGallery = function (index) {
            $scope.assetData.Galleries.splice(index, 1);
        }

        $scope.validateDates = function () {
            if ($scope.assetData.ExpirationDate < $scope.assetData.PublicationDate)
                $scope.assetData.ExpirationDate = null;
        }

        $scope.SetSlug = function () {
            $scope.assetData.Url = Slug.slugify($scope.assetData.Content[0].Title);
        };

        $scope.slugify = function () {
            $scope.assetData.Url = Slug.slugify($scope.assetData.Url);
        };
    });
