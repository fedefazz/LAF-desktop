'use strict';
angular
    .module('app.controllers')
  
    .controller('ServiceController', function ($scope, $timeout, APIService, $window, $cookies, $route, AlertService, $rootScope, $filter, $http, $localStorage, $mdDialog, $interval) {
        $localStorage.$reset();

        //SETEO DATE PICKER
        $scope.dfDate = $scope.myDate = new Date();
        $scope.isOpen = false;

        var Today = moment.locale('es');
        var Today = moment().format();
        $scope.DateToShow = moment(Today).format('LL');
        $scope.DayToShow = moment(Today).format('dddd');

        $scope.NewDate = moment();

        var showAlertMessage = true;

        //inicializo grilla default
        generarGrilla(moment(Today));

        //cambio de dia (flechas)
        $scope.changeDay = function (ev, type) {
            if (type == 0)
                $scope.NewDate = moment($scope.NewDate).add(1, 'days');
            else
                $scope.NewDate = moment($scope.NewDate).subtract(1, 'days');

            $scope.DateToShow = moment($scope.NewDate).format('LL');
            $scope.DayToShow = moment($scope.NewDate).format('dddd');

            showAlertMessage = false;
            generarGrilla($scope.NewDate);
        };

        //OBSERVO EL SELECTOR DE DIA DEL CALENDARIO
        $scope.$watch('myDate', function (newValue) {
            if (newValue !== $scope.dfDate) {
                console.log(newValue);

                showAlertMessage = false;

                $scope.NewDate = moment(newValue);
                $scope.DateToShow = moment(newValue).format('LL');
                $scope.DayToShow = moment(newValue).format('dddd');

                generarGrilla(moment(newValue));
            }

        });

        //SETEO EL SELECTOR DE SLOTS
        $scope.Slots = [
            {
                id: 1,
                label: '08',
                value: 8
            }, {
                id: 2,
                label: '09',
                value: 9
            },
            {
                id: 3,
                label: '10',
                value: 10
            },
            {
                id: 4,
                label: '11',
                value: 11
            },
            {
                id: 5,
                label: '12',
                value: 12
            }
        ];


        $scope.dfSlot = $scope.Slots[2];
        $scope.selected = $scope.Slots[2];

        $scope.$watch('selected', function (newValue) {
            if (newValue !== $scope.dfSlot) {
                generarGrilla($scope.NewDate, newValue.value);

                if ($scope.selected != newValue)
                    saveGridDate($scope.NewDate, newValue.value);

                $scope.dfSlot = newValue;
            }
        });

        //GENERO LA GRILLA DE HORAS CON TURNOS DEFAULT VACIOS
        function generarGrilla(date, turnos) {
            //console.log(date);

            if (date == "" || date == undefined) {
                date = Today;
            }

            if (turnos == undefined) {

                turnos = 10;
            }

            //console.log(turnos);
            var x;
            var hour = 20;
            var y;
            $scope.hours = [];
            for (x = 8; x < hour; x++) {
                $scope.hours[x] = [];
                for (y = 0; y < turnos; y++) {
                    $scope.turnoVacio = {
                        Orden: y + 1,
                        Id: "",
                        Modelo: "",
                        Patente: "",
                        Activo: false,
                        Hora: x
                    }
                    $scope.hours[x][y] = $scope.turnoVacio;
                }
            }

            getAllServices(date);

        }


        function getAllServices(date) {
            
            if (date == "" || date == undefined) {
                date = Today;
            }

            var queryDate = moment(date).format('YYYY-MM-DD');

            var q = moment(queryDate).format('YYYY-MM-DDTHH:mm:ss') + 'Z TO ' + moment(queryDate).add(12, 'hours').format('YYYY-MM-DDTHH:mm:ss') + 'Z';

            //Pace.restart();
            
            var servCall = APIService.getServicesSolr(" AND IsDeleted:false AND -Status:CANCELADO&fl=Date,License,Model,ServiceId,Hour,Order,Status,ServiceType&fq=Date:[" + q + "]&sort=Order asc&&rows=3000")
            servCall.then(function (u) {

                $scope.services = u.data.response.docs;

                if (showAlertMessage) {

                    $("#alertMessage").show(400);
                    AlertService.ShowAlert($scope);
                    $timeout(function () {
                        $("#alertMessage").hide("fast", function () {
                        });
                    }, 2500);

                }
                asignarTurnos(date);
                //Pace.stop();
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });

        };

        //ASIGNA LOS TURNOS DE LA BASE DE DATOS AL PRIMER DISPONIBLE DE CADA HORA
        function asignarTurnos(date) {

            //console.log($scope.services);
            
            var x;
            var orden = 0;
            angular.forEach($scope.services, function (value, key) {

                //var fechaDiaActual = mySplit(date.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z', 0);

                //var fechaDiaTurno = mySplit(value.Date, 0);

                //if (fechaDiaActual == fechaDiaTurno) {
                    var hora = value.Hour;
                    for (x = 0; x < $scope.hours[hora].length; x++) {
                        var slot = $scope.hours[hora][x];
                        if (!slot.Activo) {
                            //console.log(value);
                            $scope.turno = {
                                Orden: x + 1,
                                Id: value.ServiceId,
                                Modelo: value.Model,
                                Patente: value.License,
                                Activo: true,
                                Hora: hora,
                                Status: value.Status
                            }
                            $scope.hours[hora][x] = $scope.turno;

                            break;
                        }
                    }
                //}
            });

            getallServiceTypes();

        };

        //TRAE TODOS LOS TIPOS DE SERVICIO
        function getallServiceTypes() {
            var servCallType = APIService.getServiceTypes();
            servCallType.then(function (u) {
                $scope.serviceTypes = u.data.response.docs;

                getBrands();

            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        //TRAE TODAS LAS MARCAS
        function getBrands() {
            var servCallType = APIService.getBrands();
            servCallType.then(function (u) {
                $scope.Brands = u.data.response.docs;
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        //CUENTA SLOTS DISPONIBLES
        $scope.FilterResults = function (h) {
            if (h!==undefined)
                var selectedCount = $filter('filter')(h, { Activo: true }).length;
            return $scope.selected.value - selectedCount;
        }

        //HACE UN SPLIT DE LOS DIAS PARA COMPARAR
        function mySplit(string, nb) {
            var array = string.split('T');
            return array[nb];
        }


        $scope.$watch('models.dropzones', function (model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

        //modal regions layouts
        $scope.showRegions = function (ev, h, hora, fecha, id) {
            var selectedCount = $filter('filter')(h, { Activo: true }).length;

            var OrdenMasGrande = selectedCount;

            $mdDialog.show({
                controller: DialogRegionController,
                templateUrl: 'pages/content/dialog-regions.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                locals: {
                    OrdenMasGrande: OrdenMasGrande,
                    Hora: hora,
                    fecha: fecha,
                    id: id,
                    serviceTypes: $scope.serviceTypes,
                    Brands: $scope.Brands
                }
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        function DialogRegionController($scope, $mdDialog, APIService, $http, $compile, $rootScope, OrdenMasGrande, Hora, fecha, $window, AlertService, $cookies, $timeout, id, $filter, serviceTypes, Brands) {

            $scope.newServiceData = {};
            $scope.newServiceData.ServiceType = [];
            $scope.Status = 'PENDIENTE';
            $scope.LastestServices = [];
            $scope.CashRegisterId = 0;
            $scope.Payed = 0;
            $scope.Brands = Brands;
            $scope.serviceTypes = serviceTypes;

            if (id != null && id != "" && id != undefined) {
                //si edita busco el servicio
                var servCall = APIService.getServicesSolr("&fq=ServiceId:" + id + "&no-pace");

                servCall.then(function (u) {
                    console.log(u.data.response.docs[0]);
                    
                    $scope.newServiceData.CreationDate = u.data.response.docs[0].CreationDate;

                    $scope.newServiceData.ServiceType = u.data.response.docs[0].ServiceType;

                    $scope.newServiceData.License = u.data.response.docs[0].License;

                    $scope.Id = u.data.response.docs[0].Order;
                    $scope.serviceId = u.data.response.docs[0].ServiceId;
                    $scope.Status = u.data.response.docs[0].Status;

                    if (u.data.response.docs[0].CashRegisterId !== undefined) {
                        $scope.Payed = 1;
                        $scope.CashRegisterId = u.data.response.docs[0].CashRegisterId;
                    }

                    $scope.Vehicle.TypeModel = u.data.response.docs[0].TypeModel;
                    $scope.updateService = true;

                    getallServiceTypes();

                    GetVehicleLicence($scope.newServiceData.License);

                    $scope.newServiceData.Patente = u.data.response.docs[0].License;
                    

                    getLastestServices(u.data.response.docs[0].VehicleId);
                });
            } else {
                getallServiceTypes();
            }

            //inicializa dropdown multiple
            $scope.localLang = {
                selectAll: "Seleccionar Todos",
                selectNone: "Deseleccionar Todos",
                reset: "Borrar Todo",
                search: "Busqueda...",
                nothingSelected: "Nada Seleccionado"         //default-label is deprecated and replaced with this.
            }

            //TRAIGO ultimos servicios para este auto
            function getLastestServices(VehicleId) {
                var servCallType = APIService.getLastestServices(VehicleId);
                servCallType.then(function (u) {
                    $scope.LastestServices = u.data.response.docs;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            };

            //TRAIGO TIPOS DE SERVICIO
            function getallServiceTypes() {
                $scope.modernBrowsers = [];

                var _ticked = false;

                angular.forEach($scope.serviceTypes, function (value, key) {

                    if ($scope.newServiceData.ServiceType !== undefined) {
                        if ($scope.newServiceData.ServiceType.length !== 0) {
                            var a = $scope.newServiceData.ServiceType.indexOf(value.TypeServiceId);

                            if (a !== -1)
                                _ticked = true;
                            else
                                _ticked = false;
                        }
                    }

                    $scope.modernBrowsers.push({ Name: value.Name, Duration: value.Duration, TypeServiceId: value.TypeServiceId, Price: value.Price, Price2: value.Price2, Price3: value.Price3, Price4: value.Price4, ticked: _ticked });
                });

            };

            //CREO VARIABLES
            $scope.fecha = moment(fecha).format('LL');
            $scope.dia = moment(fecha).format('dddd');
            $scope.fechaFormateada = moment(fecha).format("YYYY-MM-DD");
            $scope.Id = OrdenMasGrande + 1;
            $scope.Hora = Hora;
            $scope.newServiceData = {};
            $scope.Vehicle = {};
            $scope.Client = {};

            //OBSERVO cambio de typeservices
            $scope.$watch('outputBrowsers', function () {
                if ($scope.Models!==undefined){
                    var modelType = $filter('filter')($scope.Models, { 'Name': $scope.Vehicle.Model })[0].Key;
                } else {
                    var modelType = $scope.Vehicle.TypeModel;
                }
                console.log(modelType);
                var total = 0;
                angular.forEach($scope.outputBrowsers, function (value, key) {
                    switch (modelType) {
                        case "Auto":
                            total += value.Price;
                            break;
                        case "Camioneta":
                            total += value.Price2;
                            break;
                        case "4x4":
                            total += value.Price3;
                            break;
                        case "Utilitario":
                            total += value.Price4;
                            break;
                        default:
                            total += value.Price;
                    }
                    
                });
                $scope.Total = total;
            });


            //MONITEOREO CAMBIO DE PATENTE
            $scope.newServiceData.Patente = '';
            $scope.UpdateLicense = function () {
                var newValue = $scope.newServiceData.Patente;
                
                if (newValue != undefined) {
                    if (newValue.length > 5 && newValue.length < 8) {
                        GetVehicleLicence(newValue);
                    }
                    else if (newValue.length == 0) {
                        //$scope.Vehicle.Brand = "Ingrese una patente";
                        //$scope.Vehicle.Model = "Ingrese una patente";
                    }
                }
                else {
                    $scope.Vehicle.Brand = "";
                    $scope.Vehicle.Model = "";

                    $scope.Client.FirstName = "";
                    $scope.Client.Dni = "";
                    $scope.Client.Email = "";
                }

            };

            $scope.FindModels = function () {
                console.log($scope.Vehicle.Brand);
                if ($scope.Vehicle.Brand!==undefined){
                    var servCallType = APIService.getModels($scope.Vehicle.Brand);
                    servCallType.then(function (u) {
                        $scope.Models = u.data.response.docs;
                    }, function (error) {
                        $scope.errorMessage = "Oops, something went wrong.";
                    });
                }
            }

            //BUSCAR VEHICULO CON PATENTE
            function GetVehicleLicence(Licence) {
                if (Licence !== undefined) {
                    var servCallVehicle = APIService.GetVehicleLicence(Licence);
                    //SI EXISTE
                    servCallVehicle.then(function (u) {
                        $scope.Vehicle = u.data;
                        getLastestServices($scope.Vehicle.Id);
                        GetClientById($scope.Vehicle.ClientId, true);
                        $scope.FindModels();
                        AlertService.ShowAlert($scope);
                        //SI NO EXISTE
                    }, function (error) {
                        $scope.flag = 2.0;
                        GetClientById($scope.Vehicle.ClientId, false);
                    });
                }
            }

            //BUSCAR CLIENTE CON ID
            function GetClientById(id, newCar) {
                if (newCar) {
                    var servCallClient = APIService.GetClientById(id);

                    //SI EXISTE Y DEJA EL MISMO / ACTUALIZAR CLIENTE
                    servCallClient.then(function (u) {
                        $scope.Client = u.data;
                        $scope.flag = 1.0;
                    }, function (error) { $scope.errorMessage = "Oops, something went wrong." }

                    )
                }
            }

            //busca cliente x email
            $scope.FindClient = function () {
                var newValue = $scope.Client.Email;

                if (newValue != undefined) {
                    var dniabuscar = newValue.trim();

                    if (dniabuscar.length > 8)
                        GetClientByEmail(dniabuscar);
                }
            };

            //BUSCAR CLIENTE CON EMAIL
            function GetClientByEmail(email) {
                var servCallClientEmail = APIService.GetClientByEmail(email);

                //ACTUALIZO CLIENTE Y AUTO
                servCallClientEmail.then(function (u) {
                    $scope.Client = u.data;

                    if ($scope.flag != 2.0) {
                        if ($scope.Client.Id != $scope.Vehicle.ClientId)
                            $scope.flag = 1.1;
                        else
                            $scope.flag = 1.0;
                    }
                    console.log($scope.Client);
                    return $scope.Client;

                    //NO EXISTE LO CREO CLIENTE
                }, function (error) {
                    //$scope.newServiceData.flag = 1.2;
                    //$scope.Client.FirstName = "";
                    //$scope.Client.Email = "";
                    //return false;
                });
            }

            
            $scope.checkPaid = function () {
                if ($scope.CashRegisterId > 0)
                    return true;
                else
                    return false;
            }

            //PROCESAR FORMULARIO
            $scope.processForm = function () {
                console.log($scope.flag);

                if ($scope.updateService) {
                    $scope.flag = 1.1;
                }

                switch ($scope.flag) {
                    case 1:
                        ActualizarCliente();
                        NewService($scope.updateService);
                        break;
                    case 1.1:
                        $scope.Vehicle.Client = $scope.Client;
                        ActualizarCliente();
                        ActualizarAuto();
                        NewService($scope.updateService);
                        break;
                    case 1.2:
                        CrearCliente();
                        //$timeout(function () { GetClientByEmail($scope.Client.Email) }, 1000);
                        ActualizarCliente();
                        ActualizarAuto();
                        NewService($scope.updateService);
                        break;
                    case 2:
                        if ($scope.Client.Id !== undefined) {
                            console.log('2.1');
                            ActualizarCliente();
                            CrearAuto('crear-service');
                        }
                        else {
                            console.log('2.2');
                            CrearCliente('crear-auto', 'crear-service');
                        }
                        break;
                    default:
                        break;
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


            //ACTUALIZA CLIENTE
            function ActualizarCliente() {
                console.log("actualizar cliente");
                delete $scope.Client.Vehicle;

                console.log($scope.Client);

                var dataClient = $.param($scope.Client);
                var servCallUpdate = APIService.updateClient($scope.Client.Id, dataClient);
                servCallUpdate.then(function (u) {
                    $scope.Client = u.data;
                }, function (error) {
                    console.log(error);
                });
            };


            //CREAR CLIENTE
            function CrearCliente(crudAuto, crudService) {
                $scope.Client.Id = null;
                $scope.Client.CompanyId = 2;

                var dataClient = $.param($scope.Client);
                var servCallCreate = APIService.createClient(dataClient);
                servCallCreate.then(function (u) {

                    $scope.Client = u.data;

                    //crear o actualizar vehiculo
                    if (crudAuto == 'crear-auto')
                        CrearAuto(crudService);

                    if (crudAuto == 'actualizar-auto')
                        ActualizarAuto(crudService);

                }, function (error) {
                    alert("No se puedo crear el cliente");
                })
            };

            //ACTUALIZA AUTO
            function ActualizarAuto() {
                delete $scope.Vehicle.Client;
                delete $scope.Vehicle.Service;
                $scope.Vehicle.ClientId = $scope.Client.Id;

                console.log($scope.Vehicle);

                var dataVehicle = $.param($scope.Vehicle);
                var servCallUpdateVehicle = APIService.updateVehicle($scope.Vehicle.Id, dataVehicle);
                servCallUpdateVehicle.then(function (u) {
                    $scope.Vehicle = u.data;
                }, function (error) {
                    console.log(error);
                });
            };

            //CREAR AUTO
            function CrearAuto(crudService) {


                if ($scope.Vehicle.Model == "") {

                    $scope.Vehicle.Model = "Sin Modelo"

                }

                if ($scope.Vehicle.Brand == "") {

                    $scope.Vehicle.Brand = "Sin Marca"

                }

                $scope.Vehicle.ClientId = $scope.Client.Id;
                $scope.Vehicle.IsDeleted = false;
                $scope.Vehicle.IsEnabled = true;
                $scope.Vehicle.License = $scope.newServiceData.Patente;
                var dataVehicle = $.param($scope.Vehicle);
                var servCallCreate = APIService.createVehicle(dataVehicle);

                servCallCreate.then(function (u) {

                    $scope.Vehicle = u.data;
                    console.log($scope.Vehicle);

                    //crear o actualizar servicio
                    if (crudService == 'crear-service')
                        NewService();

                    //if (crudService == 'actualizar-service')
                    //    NewService();


                }, function (error) {
                    console.log(error);
                });
            };

            //CREA SERVICIO
            function NewService(update) {
                $scope.newServiceData.VehicleId = $scope.Vehicle.Id;
                $scope.newServiceData.Order = $scope.Id;
                $scope.newServiceData.Hour = $scope.Hora;
                $scope.newServiceData.Date = $scope.fechaFormateada;
                $scope.newServiceData.Status = $scope.Status;
                
                //tipos de servicio
                $scope.tiposServicio = [];
                angular.forEach($scope.outputBrowsers, function (value, key) {
                    $scope.tiposServicio.push({ TypeServiceId: value.TypeServiceId, Name: value.Name, ticked: value.ticked, Duration: value.Duration });
                });
                
                $scope.newServiceData.ServiceType = $scope.tiposServicio;

                if (update)
                    $scope.newServiceData.serviceId = $scope.serviceId;

                var data = $.param($scope.newServiceData);

                if (update)
                    var servCall = APIService.UpdateService($scope.serviceId, data);
                else
                    var servCall = APIService.NewService(data);

                servCall.then(function (u) {
                    var serviceData = u.data;
                    //Set message

                    $scope.hide();
                    Pace.restart();
                    
                    if (update)
                    {
                        AlertService.SetAlert("El servicio ha sido actualizado de manera exitosa", "success");
                    }
                    else
                    {
                        AlertService.SetAlert("El servicio ha sido creado de manera exitosa", "success");
                        $scope.serviceId = serviceData.ServiceId;
                    }

                    console.log("Pago:" + $scope.Payed);

                    if ($scope.Payed === "1" && $scope.CashRegisterId===0) {
                        //crear registro de pago en cashregister
                        var payrecord = {};
                        payrecord.Type = 'credit';
                        payrecord.Amount = $scope.Total;
                        payrecord.Concept = 'Lavado';
                        payrecord.Description = 'Lavado con cera';
                        payrecord.ServiceId = $scope.serviceId;
                        payrecord.CreationDate = new Date();

                        var data = $.param(payrecord);
                        var servPaymentCall = APIService.createCashRegister(data);
                        servPaymentCall.then(function (u) {
                            console.log('pago acreditado');
                        }, function (error) {
                            console.log('error acreditando pago');
                        })
                    }

                    $timeout(function () {
                        generarGrilla(fecha);
                    }, 1500);

                    

                    //getAllServices(fecha);

                    

                    $window.location.href = "/#/cms/services/list";
                    

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                })
            }
        }
    });
