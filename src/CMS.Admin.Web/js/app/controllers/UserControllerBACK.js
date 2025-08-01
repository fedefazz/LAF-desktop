﻿'use strict';
angular
    .module('app.controllers')

    .controller('UserListController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, $timeout, AlertService, $localStorage, $rootScope, $filter, $http) {
        //reset local storage
        $localStorage.$reset();

        getUsers();

        //TRAE TODOS LOS USUARIOS
        function getUsers() {
            var servCallType = APIService.getUsers();
            servCallType.then(function (u) {

                console.log(u);



                $scope.Usuarios = u.data;
                angular.forEach($scope.Usuarios, function (value, key) {


                    if (value.IsDeleted) {
                        value.habilitado = "Deshabilitado";
                    } else {

                        value.habilitado = "Habilitado";
                    }


                });


            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };



        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withLanguageSource('/js/angular-datatables-spanish.json')
                    .withOption('paging', true)
                    .withPaginationType('full_numbers')
                    .withDisplayLength(20)
                    .withOption('order', [1, 'asc']);



        //datatables render name field
        function renderTitle(data, type, full, meta) {
            var css = "times-circle red";
            if (full.IsEnabled == true)
                css = "check-circle blue";

            var html = '<i class="fa fa-' + css + '"></i>';
            html += '<a href="/#/blsp/users/edit/' + full.Id + '"><strong>' + full.FirstName + ' ' + full.LastName + '</strong></a>';
            html += '<em>' + full.Email + '</em>';
            return html;
        }

        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
            return html;
        }

        $scope.doSearch = function () {
            $scope.dtInstance.DataTable.search($scope.searchQuery).draw();

        }
    })

    .controller('CreateUserController', function ($scope, APIService, $window, AlertService, $cookies) {

        //Submit NewUser form
        $scope.newUserData = {};
        $scope.roles = ["Admin", "Ingenieria", "Producto", "Employee", "Pre Prensa", "Admin Producto"];
        $scope.processForm = function () {

            var data = $.param($scope.newUserData)
            var servCall = APIService.createUsers(data);
            servCall.then(function (u) {

                var userData = u.data;
                //Set message
                console.log(userData);
                AlertService.SetAlert("El usuario ha sido creado con éxito", "success");
                $window.location.href = "/#/blsp/users/edit/" + userData.Id;
            }, function (response) {
                console.log(response);
                if (response.status == 400) {
                    console.log("entro if");

                    //AlertService.SetAlert("El usuario no pudo ser creado, el email ya existe", "success");
                    //$window.location.href = "/#/blsp/users/new";
                    $scope.errorMessage3 = true;

                    $scope.errorMessage2 = Object.values(response.data.ModelState)[0];
                    //$scope.errorMessage = "";

                }

                //console.log(error.data.ModelState.Model);
            })
        }
    })

    .controller('UserEditController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams) {

        $scope.ImageProfilePath = $rootScope.mediaurl;

        //Gets User by Id for edit fields
        var id = $stateParams.id;





        $scope.Roles = [{
            Id: 2, Name: "Admin"
            },
            {
                Id: 3, Name: "Ingenieria"
            },
            {
                Id: 4, Name: "Producto"
            },
            {
                Id: 5, Name: "Employee"
            },
             {
                 Id: 6, Name: "Pre Prensa"
            },
            {
                Id: 7, Name: "Admin Producto"
                
            }

        ]
        console.log($scope.Roles);


        var servCall = APIService.getUserById(id);
        servCall.then(function (u) {
            $scope.userData = u.data;
            console.log("llega");

            console.log("user data");

            console.log($scope.userData);
            AlertService.ShowAlert($scope);
        }, function (error) {
            $window.location.href = "/#/blsp/users/list";
            //$scope.errorMessage = "Oops, something went wrong.";
        })

        //User update
        $scope.processForm = function () {
            var data = $.param($scope.userData)
            var servCall = APIService.updateUsers(id, data);
            servCall.then(function (u) {
                //Set and display message
                AlertService.SetAlert("El usuario ha sido actualizado con éxito", "success");
                AlertService.ShowAlert($scope);
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

      

        //Disable User
        $scope.disableUser = function (id) {

            $scope.successMessage = null;
            $scope.errorMessage = null;

            var data = $.param({
                id: id,
            })
            var servCall = APIService.disableUsers(data);
            servCall.then(function (u) {
                $scope.userData.IsEnabled = false;
                //Set and display message
                AlertService.SetAlert("The user has been disabled successfully", "success");
                AlertService.ShowAlert($scope);
                //$route.reload();
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Resend User Request
        $scope.resendUserRequest = function (userName) {

            $scope.successMessage = null;
            $scope.errorMessage = null;

            var data = $.param({
                UserName: userName,
            })
            var servCall = APIService.resendUserRequest(data);
            servCall.then(function (u) {
                //Set and display message
                AlertService.SetAlert("The notification has been sent successfully", "success");
                AlertService.ShowAlert($scope);
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            })
        }

        //Delete User
        $scope.deleteUser = function (ev, id) {
            //var custName = id;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Borrar Usuario')
                  .textContent('Está seguro que desea eliminar este usuario?')
                  .ariaLabel('Borrar')
                  .targetEvent(ev)
                  .ok('Borrar')
                  .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                //confirmed
                var data = $.param({
                    id: id,
                })
                var servCall = APIService.deleteUsers(id, data);
                servCall.then(function (u) {
                    //Set message
                    AlertService.SetAlert("El usuario ha sido eliminado con éxito", "success");
                    $window.location.href = "/#/blsp/users/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }, function () {
                //cancel
            });
        }
    

//Delete User
$scope.enableUser = function (ev, id) {
    //var custName = id;
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
        .title('Rehabilitar Usuario')
        .textContent('Está seguro que desea rehabilitar este usuario?')
        .ariaLabel('Rehabilitar')
        .targetEvent(ev)
        .ok('Rehabilitar')
        .cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
        //confirmed
        $scope.userData.IsDeleted = false;
        $scope.userData.IsEnabled = true;
        var data = $.param($scope.userData)
        console.log(data);
        var servCall = APIService.updateUsers(id, data);
        servCall.then(function (u) {
            //Set message
            AlertService.SetAlert("El usuario ha sido habilitado", "success");
            $window.location.href = "/#/blsp/users/list";
        }, function (error) {
            $scope.errorMessage = "Oops, something went wrong.";
        })
    }, function () {
        //cancel
    });
}
    })
    .controller('APIController', function ($scope, APIService, $controller, AlertService) {

        angular.extend(this, $controller('UserListController', { $scope: $scope })); //Could be useful later



    })
