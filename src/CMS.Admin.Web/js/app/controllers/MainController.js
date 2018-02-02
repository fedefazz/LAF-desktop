'use strict';
angular
    .module('app.controllers', []);

angular
    .module('app.controllers')

    .controller('headerController', function ($scope, APIService, $window, $rootScope) {
        $rootScope.ProfileImagePath = "/images/placeholders/user.png";

        //Get Current User
        var servCall = APIService.getProfileInfo();
        servCall.then(function (u) {
            $scope.currentUser = u.data;
            
            //if ($scope.currentUser.ProfileImagePath) {
            //    $rootScope.ProfileImagePath = $rootScope.mediaurl + $scope.currentUser.ProfileImagePath;
            //} else {
            //    $rootScope.ProfileImagePath = "/images/placeholders/user.png";
            //}

        }, function (error) {
            //$window.location.href = "/Login/LogOut";
            //

            $scope.errorMessage = "Oops, something went wrong.";
        })

    })

    .controller('ProfileEditController', function ($scope, APIService, $route, Upload, $timeout, $rootScope) {

        $scope.ImageProfilePath = $rootScope.mediaurl;

        GetLoggedUser();
        //Get logged user
        function GetLoggedUser() {
            var servCall = APIService.getProfileInfo();
            servCall.then(function (data) {
                var secondCall = APIService.getUserById(data.data.Id);
                secondCall.then(function (u) {

                    $scope.profileData = u.data;

                    //if ($scope.profileData.ProfileImagePath) {
                    //    $rootScope.ProfileImagePath = $scope.ImageProfilePath + $scope.profileData.ProfileImagePath;
                    //} else {
                    //    $rootScope.ProfileImagePath = "/images/placeholders/user.png";
                    //}
                })
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Profile update




        $scope.processForm = function () {



            $scope.successMessage = null;
            $scope.errorMessage = null;


            console.log($scope.profileData);

            var id = $scope.profileData.Id;
            var data = $.param($scope.profileData)
            
            var servCall = APIService.updateUsers(id, data);
            servCall.then(function (u) {
                $scope.successMessage = "The profile information has been updated successfully";

                //$route.reload();
            }, function (error) {
                console.log(error);

                var errorMsg = "";
                angular.forEach(error.data.ModelState, function (element) {
                    errorMsg += element[0];
                });

                $scope.errorMessage = errorMsg;
            })
        }

        //upload image profile
        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: $rootScope.webapiurl + 'api/Users/UpdateProfileImage',
                    data: { Image: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                        GetLoggedUser();
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                                             evt.loaded / evt.total));
                });
            }
        }

    })

    .controller('ResetPasswordController', function ($scope, APIService, $route) {

        //Reset Password
        $scope.processForm = function () {
    
            $scope.successMessage = null;
            $scope.errorMessage = null;

            var data = $.param($scope.profileData)
            var servCall = APIService.changePassword(data);
            servCall.then(function (u) {
    
                $scope.resetForm.$setPristine();
                $scope.resetForm.$setUntouched();

                $scope.successMessage = "The password has been updated successfully";
                $scope.profileData = "";

                //$route.reload();
            }, function (error) {
                var errorMsg = "";
                angular.forEach(error.data.ModelState, function (element) {
                    errorMsg += element[0];
                });

                $scope.errorMessage = errorMsg;
            })
        }


    })

    .controller('MenuController', function ($scope, $location) {
        $scope.isMenuActive = function (path) {
            
            var locationPath = $location.path();

            if ($location.path().length===1) {
                locationPath = '/Dashboard';
            }

            return (locationPath.substr(0, path.length) === path) ? 'active' : '';
        }

    })

    