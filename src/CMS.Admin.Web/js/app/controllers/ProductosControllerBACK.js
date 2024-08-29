'use strict';

angular
    .module('app.controllers')
    .controller('productosController', function ($scope, $compile, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, AlertService, $rootScope, $filter, $http, $timeout, $mdDialog) {


        GetProductos();

        //TRAE TODOS LOS MATERIALES
        function GetProductos() {
            var servCallType = APIService.GetProductos();
            servCallType.then(function (u) {
                console.log(u);
                $scope.productos = u.data;
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
            .withOption('order', [6, 'desc']);


        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
            return html;
        }





        $scope.doSearch = function () {
            console.log("bsuqueda", $scope.searchQuery)
            $scope.dtInstance.DataTable.search($scope.searchQuery).draw();

        }




    }
    )












    .controller('productosCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {

        // Leer el objeto JSON desde localStorage
        var datosUsuario = $window.localStorage.getItem('datosUsuario');
        $scope.tieneRolAdminProducto = false;
        $scope.tieneRolIngenieria = false;
        $scope.tieneRolProducto = false;
        $scope.tieneRolPrensa = false;

        // Parsear el objeto JSON a un objeto JavaScript
        if (datosUsuario) {
            datosUsuario = JSON.parse(datosUsuario);
            console.log("datosUsuario", datosUsuario);


            // Determinar qué panel debe estar abierto según el rol del usuario
            if (datosUsuario.currentUser && datosUsuario.currentUser.Role) {
                var userRoles = datosUsuario.currentUser.Role;

                // Verificar si el usuario tiene el rol 'Ingenieria'
                $scope.tieneRolIngenieria = userRoles.some(function (role) {
                    return role.Name === 'Ingenieria';
                });

                // Verificar si el usuario tiene el rol 'Producto'
                $scope.tieneRolProducto = userRoles.some(function (role) {
                    return role.Name === 'Producto';
                });

                // Verificar si el usuario tiene el rol 'Producto'
                $scope.tieneRolPrensa = userRoles.some(function (role) {
                    return role.Name === 'Pre Prensa';
                });


                $scope.tieneRolAdminProducto = userRoles.some(function (role) {
                    return role.Name === 'Admin Producto';
                });






            } else {
                // Si no se encuentran roles o datos de usuario, cerrar ambos paneles por defecto
                $scope.isIngenieriaPanelOpen = false;
                $scope.isProductoPanelOpen = false;
                $scope.isPrensaPanelOpen = false;
                $scope.isHerramentalPanelOpen = false;



            }
        } else {
            $scope.isIngenieriaPanelOpen = false;
            $scope.isProductoPanelOpen = false;
            $scope.isPrensaPanelOpen = false;
            $scope.isHerramentalPanelOpen = false;

        }


        var id = $stateParams.id;
        $scope.fechaAuxiliarParaMostrar = {};




        $scope.toggleProductoPanel = function () {
            $scope.isProductoPanelOpen = !$scope.isProductoPanelOpen;
        };


        $scope.toggleIngenieriaPanel = function () {
            $scope.isIngenieriaPanelOpen = !$scope.isIngenieriaPanelOpen;
        };

        $scope.togglePrensaPanel = function () {
            $scope.isPrensaPanelOpen = !$scope.isPrensaPanelOpen;
        };

        $scope.toggleHerramentalPanel = function () {
            $scope.isHerramentalPanelOpen = !$scope.isHerramentalPanelOpen;
        };

        if (id) {
            $scope.PageTitle = 'Editar Producto';
            $scope.SubmitButton = 'Actualizar Producto';
            var servCall = APIService.GetProductoById(id);
            servCall.then(function (u) {
                $scope.productoData = u.data;
                console.log("$scope.productoData", $scope.productoData);
                $scope.estados = $scope.productoData.estados;
                $scope.productoData.EstadoParaMostrar = $scope.estados.find(function (estado) {
                    return estado.IDEstadoProducto === $scope.productoData.GPEstadosProductos.IDEstadoProducto;
                });
                $scope.impresorasDisponibles = [{ id: 1, nombre: 'Sin Asignar' }, { id: 2, nombre: 'Flexo' }, { id: 3, nombre: 'Hueco' }];
                $scope.proveedoresDisponibles = [{ id: 1, nombre: 'Sin Asignar' }, { id: 2, nombre: 'Bosisio' }, { id: 3, nombre: 'lynch' }, { id: 4, nombre: 'longo' }];
                var responsableCustomerEncontrado = $scope.productoData.responsables.find(function (responsable) {
                    return responsable.Id === $scope.productoData.ResponsableCustomer;
                })
                var responsableComercialEncontrado = $scope.productoData.responsables.find(function (responsable) {
                    return responsable.Id === $scope.productoData.ResponsableComercial;
                })
                $scope.responsableCustomerNombreApellido = responsableCustomerEncontrado.GPResponsables.Nombre + ' ' + responsableCustomerEncontrado.GPResponsables.Apellido;
                $scope.responsableComercialNombreApellido = responsableComercialEncontrado.GPResponsables.Nombre + ' ' + responsableComercialEncontrado.GPResponsables.Apellido;


                
                if ($scope.productoData.Fecha_Creacion) {
                    $scope.fechaAuxiliarParaMostrar.Fecha_Creacion = new Date($scope.productoData.Fecha_Creacion);

                }
                if ($scope.productoData.Fecha_Liberacion) {
                    $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion = new Date($scope.productoData.Fecha_Liberacion);
                }
                if ($scope.productoData.Fecha_Deseada_Cliente) {
                    $scope.fechaAuxiliarParaMostrar.Fecha_Deseada_Cliente = new Date($scope.productoData.Fecha_Deseada_Cliente);
                }
                if ($scope.productoData.Fecha_Pedido_Original) {
                    $scope.fechaAuxiliarParaMostrar.Fecha_Pedido_Original = new Date($scope.productoData.Fecha_Pedido_Original);
                }

                if ($scope.productoData.FechaConfeccionIng) {
                    $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng = new Date($scope.productoData.FechaConfeccionIng);
                }

                if ($scope.productoData.FechaLiberacionLet) {
                    $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet = new Date($scope.productoData.FechaLiberacionLet);
                }

                if ($scope.productoData.FechaLiberacionFinalIng) {
                    $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng = new Date($scope.productoData.FechaLiberacionFinalIng);
                }
                if ($scope.productoData.FechaRecepcionArte) {
                    $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte = new Date($scope.productoData.FechaRecepcionArte);

                }
                if ($scope.productoData.FechaEnvioArte_ET) {
                    $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET = new Date($scope.productoData.FechaEnvioArte_ET);
                }
                if ($scope.productoData.FechaPDFModulo) {
                    $scope.fechaAuxiliarParaMostrar.FechaPDFModulo = new Date($scope.productoData.FechaPDFModulo);
                }
                if ($scope.productoData.FechaAprobacionPDFCliente) {
                    $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente = new Date($scope.productoData.FechaAprobacionPDFCliente);
                }

                if ($scope.productoData.FechaEnvioCromalin) {
                    $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin = new Date($scope.productoData.FechaEnvioCromalin);
                }

                if ($scope.productoData.FechaAprobacionCromalin) {
                    $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin = new Date($scope.productoData.FechaAprobacionCromalin);
                }

                if ($scope.productoData.FechaPDFArmado) {
                    $scope.fechaAuxiliarParaMostrar.FechaPDFArmado = new Date($scope.productoData.FechaPDFArmado);
                }

                if ($scope.productoData.FechaLiberadoAGrabado) {
                    $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado = new Date($scope.productoData.FechaLiberadoAGrabado);
                }

                if ($scope.productoData.FechaSacaPrueba) {
                    $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba = new Date($scope.productoData.FechaSacaPrueba);
                }

                if ($scope.productoData.FechaAprobacionSacaPrueba) {
                    $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba = new Date($scope.productoData.FechaAprobacionSacaPrueba);
                }
                if ($scope.productoData.FechaRecepcionGrabado) {
                    $scope.fechaAuxiliarParaMostrar.FechaRecepcionGrabado = new Date($scope.productoData.FechaRecepcionGrabado);
                }

                if ($scope.productoData.FechaRecepcionHerramental) {
                    $scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental = new Date($scope.productoData.FechaRecepcionHerramental);
                }

                if ($scope.productoData.FechaDocumento) {
                    $scope.fechaAuxiliarParaMostrar.FechaDocumento = new Date($scope.productoData.FechaDocumento);
                }

                AlertService.ShowAlert($scope);
            }, function (error) {
                AlertService.SetAlert("Error al cargar el producto", "error");
            });


            var servCallGetProductoPorCodigo = APIService.GetProductoPorCodigo(id);
            servCallGetProductoPorCodigo.then(function (u) {
                $scope.servCallGetProductoPorCodigoData = u.data[0];
                console.log("servCallGetProductoPorCodigo", $scope.servCallGetProductoPorCodigoData);

            },

                function (error) {
                    AlertService.SetAlert("Error al cargar el producto", "error");
                });


        }

        $scope.processForm = function () {
            if ($scope.fechaAuxiliarParaMostrar.Fecha_Creacion instanceof Date) {
                $scope.productoData.Fecha_Creacion = $scope.fechaAuxiliarParaMostrar.Fecha_Creacion.toISOString().split('T')[0]; // Solo la parte de la fecha
            }
            if ($scope.fechaAuxiliarParaMostrar.Fecha_Liberacion instanceof Date) {
                $scope.productoData.Fecha_Liberacion = $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria

            }
            if ($scope.fechaAuxiliarParaMostrar.Fecha_Deseada_Cliente instanceof Date) {
                $scope.productoData.Fecha_Deseada_Cliente = $scope.fechaAuxiliarParaMostrar.Fecha_Deseada_Cliente.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria

            }
            if ($scope.fechaAuxiliarParaMostrar.Fecha_Pedido_Original instanceof Date) {
                $scope.productoData.Fecha_Pedido_Original = $scope.fechaAuxiliarParaMostrar.Fecha_Pedido_Original.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria

            }

            if ($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng instanceof Date) {
                $scope.productoData.FechaConfeccionIng = $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria


            }
            if ($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet instanceof Date) {
                $scope.productoData.FechaLiberacionLet = $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria

            }
            if ($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng instanceof Date) {
                $scope.productoData.FechaLiberacionFinalIng = $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria

            }

            if ($scope.fechaAuxiliarParaMostrar.FechaRecepcionArte instanceof Date) {
                $scope.productoData.FechaRecepcionArte = $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }
            if ($scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET instanceof Date) {
                $scope.productoData.FechaEnvioArte_ET = $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }
            if ($scope.fechaAuxiliarParaMostrar.FechaPDFModulo instanceof Date) {
                $scope.productoData.FechaPDFModulo = $scope.fechaAuxiliarParaMostrar.FechaPDFModulo.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }
            if ($scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente instanceof Date) {
                $scope.productoData.FechaAprobacionPDFCliente = $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin instanceof Date) {
                $scope.productoData.FechaEnvioCromalin = $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin instanceof Date) {
                $scope.productoData.FechaAprobacionCromalin = $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaPDFArmado instanceof Date) {
                $scope.productoData.FechaPDFArmado = $scope.fechaAuxiliarParaMostrar.FechaPDFArmado.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado instanceof Date) {
                $scope.productoData.FechaLiberadoAGrabado = $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba instanceof Date) {
                $scope.productoData.FechaSacaPrueba = $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba instanceof Date) {
                $scope.productoData.FechaAprobacionSacaPrueba = $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaRecepcionGrabado instanceof Date) {
                $scope.productoData.FechaRecepcionGrabado = $scope.fechaAuxiliarParaMostrar.FechaRecepcionGrabado.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental instanceof Date) {
                $scope.productoData.FechaRecepcionHerramental = $scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.fechaAuxiliarParaMostrar.FechaDocumento instanceof Date) {
                $scope.productoData.FechaDocumento = $scope.fechaAuxiliarParaMostrar.FechaDocumento.toISOString().split('T')[0]; // Para eliminar la parte de la hora si no es necesaria
            }

            if ($scope.productoData.EstadoParaMostrar.IDEstadoProducto == 2) {
                $scope.productoData.FechaStandBy = new Date(moment()).toISOString().split('T')[0]
            }

            if (($scope.productoData.EstadoParaMostrar.IDEstadoProducto == 1 || $scope.productoData.EstadoParaMostrar.IDEstadoProducto == 3) && $scope.productoData.Estado == 2) {
                $scope.productoData.FechaFinStandBy = new Date(moment()).toISOString().split('T')[0];
            }

           

            $scope.productoData.Estado = $scope.productoData.EstadoParaMostrar.IDEstadoProducto;

            var data = $.param($scope.productoData);


            $scope.validarFechasFinal = function () {
                var validas = [];
                console.log("compara", $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng < $scope.fechaAuxiliarParaMostrar.FechaDocumento);
                if ($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng < $scope.fechaAuxiliarParaMostrar.FechaDocumento && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaConfeccionIng.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaConfeccionIng.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaConfeccionIng').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaConfeccionIng.$setValidity('customValidacion', true);
                    validas.push(true);

                }


                if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng || $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.FechaDocumento) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet) && $scope.productoData?.HabilitaCierreLet ) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaLiberacionLet.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaLiberacionLet.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaLiberacionLet').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaLiberacionLet.$setValidity('customValidacion', true);
                    validas.push(true);

                }


                if ($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng || $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaDocumento && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng || ($scope.productoData?.HabilitaCierreLet && $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet ) )) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaLiberacionFinalIng.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaLiberacionFinalIng.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaLiberacionFinalIng').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaLiberacionFinalIng.$setValidity('customValidacion', true);
                    validas.push(true);

                }


                if ($scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaEnvioArte_ET.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaEnvioArte_ET.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaEnvioArte_ET').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaEnvioArte_ET.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaPDFModulo < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaPDFModulo < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPDFModulo)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaPDFModulo.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaEnvioArte_ET.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaPDFModulo').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaPDFModulo.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo || $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaAprobacionPDFCliente.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaAprobacionPDFCliente.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaAprobacionPDFCliente').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaAprobacionPDFCliente.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin < $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente || $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo || $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaEnvioCromalin.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaEnvioCromalin.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaEnvioCromalin').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaEnvioCromalin.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin < $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin || $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin < $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente || $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo || $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaAprobacionCromalin.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaAprobacionCromalin.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaAprobacionCromalin').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaAprobacionCromalin.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaPDFArmado < $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin || $scope.fechaAuxiliarParaMostrar.FechaPDFArmado < $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin || $scope.fechaAuxiliarParaMostrar.FechaPDFArmado < $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente || $scope.fechaAuxiliarParaMostrar.FechaPDFArmado < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo || $scope.fechaAuxiliarParaMostrar.FechaPDFArmado < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaPDFArmado < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPDFArmado)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaPDFArmado.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaPDFArmado.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaPDFArmado').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaPDFArmado.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaPDFArmado || $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin || $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin || $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente || $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo || $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaLiberadoAGrabado.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaLiberadoAGrabado.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaLiberadoAGrabado').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaLiberadoAGrabado.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPDFArmado || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaSacaPrueba.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaSacaPrueba.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaSacaPrueba').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaSacaPrueba.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPDFArmado || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaAprobacionSacaPrueba').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                return validas;

            }


            console.log('$scope.validarFechasFinal()', $scope.validarFechasFinal());

            if (id && !$scope.validarFechasFinal().some(function (element) {
                return element === false;
            })) {
                var servCall = APIService.updateProducto(id, data);
                console.log('data para mandar', $scope.productoData)
                servCall.then(function (u) {
                    AlertService.SetAlert("El Producto fue actualizado con éxito", "success");
                    $scope.ShowAlert();
                    console.log("processForm", $scope.productoData);
                    $window.location.href = "/#/blsp/productos/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
        }
        $scope.ShowAlert = function () {
            AlertService.ShowAlert($scope);
        };


        $scope.actualizarEstadoCerrado = function () {
            // Verificar la lógica para activar el toggle basado en la fecha
            // Por ejemplo, si la fecha es válida y no es nula
            if ($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng) {
                $scope.productoData.CerradoIng = true; // Activar el toggle
            } else {
                $scope.productoData.CerradoIng = false; // Desactivar el toggle
            }
        };

        $scope.actualizarFechas = function () {
            // Validación FechaConfeccionIng vs FechaDocumento
            if (($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng < $scope.fechaAuxiliarParaMostrar.FechaDocumento) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng)) {
                $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng = $scope.fechaAuxiliarParaMostrar.FechaDocumento;
            }
            else {
                $scope.editAuthorForm.FechaConfeccionIng.$setValidity('customValidacion', true);

            }

            // Validación FechaLiberacionLet vs FechaConfeccionIng
            if ($scope.productoData?.HabilitaCierreLet) {
                if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet)) {
                    $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet = $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng;
                }
                else {
                    $scope.editAuthorForm.FechaLiberacionLet.$setValidity('customValidacion', true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng)) {
                    $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng = $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet;
                }
                else {
                    $scope.editAuthorForm.FechaLiberacionFinalIng.$setValidity('customValidacion', true);

                }
            }
            

            // Validación FechaLiberacionFinalIng vs FechaLiberacionLet
            if (!$scope.productoData?.HabilitaCierreLet) {
                if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng)) {
                    $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng = $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng;
                } else {
                    $scope.editAuthorForm.FechaLiberacionFinalIng.$setValidity('customValidacion', true);

                }
            }
        }

        $scope.$watchGroup(['fechaAuxiliarParaMostrar.FechaDocumento', 'fechaAuxiliarParaMostrar.FechaConfeccionIng', 'fechaAuxiliarParaMostrar.FechaLiberacionLet', 'fechaAuxiliarParaMostrar.FechaLiberacionFinalIng'], function (newValues, oldValues) {
            // Ejecutar la validación cada vez que una de las fechas cambie
            $scope.actualizarFechas();
        });

        $scope.$watch('productoData.HabilitaCierreLet', function (newValue, oldValue) {
            if (newValue === false) {
                $scope.editAuthorForm.FechaLiberacionLet.$setValidity('customValidacion', true);
                // Reseteamos FechaLiberacionLet y FechaLiberacionFinalIng si HabilitaCierreLet es false
                //$scope.fechaAuxiliarParaMostrar.FechaLiberacionLet = null;
                //$scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng = null;
            } else {
                // Si HabilitaCierreLet es true, actualizamos las fechas

                $scope.actualizarFechas();
            }
        });

        var primeraEjecucion = true;
        // Observa el cambio en productoData.TipoImpresora y llama a la función
        $scope.$watchCollection('productoData.TipoImpresora', function (newTipoImpresora, oldTipoImpresora) {
            // Verifica que no sea la primera ejecución y que realmente haya un cambio en el tipo de impresora
            if (!primeraEjecucion && newTipoImpresora !== oldTipoImpresora) {
                seleccionarPrimeraImpresoraDisponible();
            }

            // Desactiva la bandera después de la primera ejecución
            if (newTipoImpresora != null || oldTipoImpresora != null) {
                primeraEjecucion = false;

            }
        });

        // Función para seleccionar automáticamente la primera impresora disponible
        function seleccionarPrimeraImpresoraDisponible() {
            // Obtén las impresoras disponibles para el tipo seleccionado
            var impresorasFiltradas = $scope.productoData.impresoras.filter(function (impresora) {
                return impresora.IdTipoImpresora === $scope.productoData.TipoImpresora;
            });

            // Si hay impresoras disponibles, selecciona la primera
            if (impresorasFiltradas.length > 0) {
                $scope.productoData.Impresora = impresorasFiltradas[0].IdImpresora;
            } else {
                // Si no hay impresoras disponibles, limpia la selección (opcional)
                $scope.productoData.Impresora = null;
            }
        }


        $scope.$watchGroup([
            'fechaAuxiliarParaMostrar.FechaRecepcionArte',
            'fechaAuxiliarParaMostrar.FechaEnvioArte_ET',
            'fechaAuxiliarParaMostrar.FechaPDFModulo',
            'fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente',
            'fechaAuxiliarParaMostrar.FechaEnvioCromalin',
            'fechaAuxiliarParaMostrar.FechaAprobacionCromalin',
            'fechaAuxiliarParaMostrar.FechaPDFArmado',
            'fechaAuxiliarParaMostrar.FechaLiberadoAGrabado',
            'fechaAuxiliarParaMostrar.FechaSacaPrueba',
            'fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba'
        ], function (newValues, oldValues) {
             $scope.actualizarFechasPrePrensa();
            
        });

        $scope.actualizarFechasPrePrensa = function () {
            if (($scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET < $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET)) {
                $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET = $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte;
            } else {
                $scope.editAuthorForm.FechaEnvioArte_ET.$setValidity('customValidacion', true);

            }
            if (($scope.fechaAuxiliarParaMostrar.FechaPDFModulo < $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPDFModulo) ) {
                $scope.fechaAuxiliarParaMostrar.FechaPDFModulo = $scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET;
            } else {
                $scope.editAuthorForm.FechaPDFModulo.$setValidity('customValidacion', true);

            }

            if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente < $scope.fechaAuxiliarParaMostrar.FechaPDFModulo) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente)) {
                $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente = $scope.fechaAuxiliarParaMostrar.FechaPDFModulo;
            } else {
                $scope.editAuthorForm.FechaAprobacionPDFCliente.$setValidity('customValidacion', true);

            }
            if (($scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin < $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin)) {
                $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin = $scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente;
            } else {
                $scope.editAuthorForm.FechaEnvioCromalin.$setValidity('customValidacion', true);

            }

            if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin < $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin) ) {
                $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin = $scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin;
            } else {
                $scope.editAuthorForm.FechaAprobacionCromalin.$setValidity('customValidacion', true);

            }
            if (($scope.fechaAuxiliarParaMostrar.FechaPDFArmado < $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPDFArmado)) {
                $scope.fechaAuxiliarParaMostrar.FechaPDFArmado = $scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin;
            } else {
                $scope.editAuthorForm.FechaPDFArmado.$setValidity('customValidacion', true);

            }
            if (($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaPDFArmado) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado)) {
                $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado = $scope.fechaAuxiliarParaMostrar.FechaPDFArmado;
            } else {
                $scope.editAuthorForm.FechaLiberadoAGrabado.$setValidity('customValidacion', true);

            }
            if (($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba)) {
                $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba = $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado;
            } else {
                $scope.editAuthorForm.FechaSacaPrueba.$setValidity('customValidacion', true);

            }
            if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba)) {
                $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba = $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba;
            } else {
                $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setValidity('customValidacion', true);

            }
            
        }

        $scope.actualizarEstadoCerradoPrePrensa = function () {
            if ($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba) {
                $scope.productoData.CerradoPrePrensa = true; // Activar el toggle
            } else {
                $scope.productoData.CerradoPrePrensa = false; // Desactivar el toggle
            }
        };

        // Función para validar la fecha
        $scope.validarFecha = function (fechaString) {
            // Crea una fecha de comparación en formato específico
            var fechaComparacion = new Date("Tue Jan 01 1900");
          

            // Obtén la fecha como un objeto Date
            var fecha = new Date(fechaString);
            console.log("fechaComparacion", fechaComparacion);
            console.log("fecha", fecha);
            // Compara las fechas
            return fecha.getTime() !== fechaComparacion.getTime();
        };


        $scope.setFechaDefault = function (obj, fieldName) {
            // Verificar si obj y fieldName son válidos
            if (obj && fieldName && obj.hasOwnProperty(fieldName)) {
                // Convertir la fecha a formato ISO
                var fechaDefaultISO = 'Tue Jan 01 1900';
                obj[fieldName] = new Date(fechaDefaultISO); // Convertir a objeto Date
            }
        };


    });

