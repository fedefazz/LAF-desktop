'use strict';
angular
    .module('app.controllers')

    .controller('AuthorsController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http, $localStorage) {
        //reset local storage
        $localStorage.$reset();

        //Display message if necessary
        AlertService.ShowAlert($scope);

        //datatables configuration
        $scope.dtInstance = {};

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('FirstName', 'Name').renderWith(renderTitle),
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
            var qs = "?q=" + q + " AND IsDeleted:false&start=" + aoData[3].value + "&rows=" + aoData[4].value + "&fl=Id,FirstName,LastName,Email,CreationDate,IsEnabled&sort=" + sort + "&no-pace";

            //query execution
            $http({
                method: 'GET',
                url: $rootScope.webapiurl + "api/Author/GetAllSolr" + qs,
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

        //datatables render name field
        function renderTitle(data, type, full, meta) {
            var css="times-circle red";
            if (full.IsEnabled==true)
                css="check-circle blue";

            var html = '<i class="fa fa-' + css + '"></i>';
            html += '<a href="/#/cms/content/authors/crud/' + full.Id + '"><strong>' + full.FirstName + ' ' + full.LastName + '</strong></a>';
            html += '<em>' + full.Email + '</em>';
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

    .controller('AuthorCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage) {

        var id = $stateParams.id;

        //labels
        if (id) {
            $scope.PageTitle = 'Edit Author';
            $scope.SubmitButton = 'Update Author';
        } else {
            $scope.PageTitle = 'Create Author';
            $scope.SubmitButton = 'Create Author';
        }

        $scope.ImagePath = $rootScope.mediaurl;
        $scope.authorImage = "../images/placeholders/user.png";

        if ($localStorage.AuthorData) {
            $scope.authorData = $localStorage.AuthorData;
            $localStorage.AuthorData = null;

            if ($scope.authorData.Media) {
                var sizesPaths = angular.fromJson($scope.authorData.Media.SizesPaths);
                $scope.authorImage = $scope.ImagePath + sizesPaths.Size1Path;
            }

        } else {
            //Gets Author by Id for edit fields
            if (id) {
                var id = $stateParams.id;

                var servCall = APIService.getAuthorById(id);
                servCall.then(function (u) {
                    $scope.authorData = u.data.data;

                    if ($scope.authorData.Media) {
                        $scope.authorImage = $scope.ImagePath + $scope.authorData.Media.Size1Path;
                    }

                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $window.location.href = "/#/cms/content/authors/list";
                });
            }
        }

        //User update
        $scope.processForm = function () {
            var data = $.param($scope.authorData)
            if (id) {
                var servCall = APIService.updateAuthor(data);
                servCall.then(function (u) {
                    //Set and display message
                    AlertService.SetAlert("The author has been updated successfully", "success");
                    AlertService.ShowAlert($scope);
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            } else {
                var servCall = APIService.createAuthor(data);
                servCall.then(function (u) {
                    var authorData = u.data.data;
                    //Set message
                    AlertService.SetAlert("The author has been created successfully", "success");
                    $window.location.href = "/#/cms/content/authors/crud/" + authorData.Id;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }

        }

        //Delete User
        $scope.deleteAuthor = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete Author')
                  .textContent('Are you sure you want to delete this author?')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteAuthor(data);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("The author has been removed successfully", "success");
                    $window.location.href = "/#/cms/content/authors/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }

        //Gets Id and stores it in a cookie for later edit
        $scope.ChooseFile = function () {
            $localStorage.AuthorData = $scope.authorData;
            $window.location.href = "/#/cms/multimedia/library/choose";
        }
    })
