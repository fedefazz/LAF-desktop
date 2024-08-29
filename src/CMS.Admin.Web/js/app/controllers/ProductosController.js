'use strict';

angular
    .module('app.controllers')
    .controller('productosController', function ($scope, $filter, APIService, DTOptionsBuilder, $timeout) {
        // Inicialización de variables
        $scope.isDivVisible = false; // Inicialmente oculto

        $scope.toggleDiv = function () {
            $scope.isDivVisible = !$scope.isDivVisible; // Cambia el estado
        };
        $scope.estados = ['Abierto', 'Stand By', 'Cerrado', 'Cancelado'];
        $scope.booleans = [{ 'key': false, 'value': 'No' }, { 'key': true, 'value': 'Si' }];

        $scope.selectedColumn = ''; // Columna seleccionada para filtrar
        $scope.filterValue = ''; // Valor para filtrar
        $scope.filters = [{ selectedColumn: '', filterValue: '', dateComparison: 'equals' }]; // Inicializa con un filtro vacío

        $scope.filterOptions = {
            PRODUCTO: [
                'Cod_Producto',
                'Estado',
                'FechaStandBy',
                'FechaFinStandBy',
                'LastRefreshDate',
                'Fecha_Inicial',
                'Fecha_Final',
                'Dias',
                'DiasStandby'
            ],
            CUSTOMER: [
                'Nombre_Cliente',
                'Fecha_Creacion',
                'Fecha_Pedido_Original',
                'Fecha_Deseada_Cliente',
                'Tipo_Adm',
                'RushOrder',
                'ResponsableComercial',
                'ResponsableCustomer',
                'Cilindros'
            ],
            INGENIERIA: [
                'FechaDocumento',
                'Liberacion',
                'Fecha_Liberacion',
                'Categoria',
                'ResponsableConfeccionIng',
                'FechaConfeccionIng',
                'ResponsableLiberacionLet',
                'FechaLiberacionLet',
                'ResponsableLiberacionFinalIng',
                'FechaLiberacionFinalIng',
                'CerradoIng'
            ],
            PREPRENSA: [
                'TipoImpresora',
                'Impresora',
                'Proveedor',
                'ResponsablePrePrensa',
                'PerfilImpresion',
                'EstadoPrePrensa',
                'ArteModificado',
                'FechaArteOriginal',
                'FechaRecepcionArte',
                'FechaEnvioArte_ET',
                'FechaPDFModulo',
                'FechaAprobacionPDFCliente',
                'FechaEnvioCromalin',
                'FechaAprobacionCromalin',
                'FechaPDFArmado',
                'FechaLiberadoAGrabado',
                'CerradoPrePrensa'
            ],
            HERRAMENTAL: [
                'TipoCilindros',
                'FechaEntregaNuevosCilindros',
                'CodigosCilindros',
                'FechaRecepcionCodigosCilindros',
                'FechaPreparacionCilindros',
                'FechaLiberacionMontaje',
                'FechaRetiroCilindro',
                'FechaPromesaProveedorGrabado',
                'FechaSacaPrueba',
                'FechaAprobacionSacaPrueba'
            ]
        };

        $scope.codProductoValues = [];
        $scope.ResponsableComercialValues = [];
        $scope.ResponsableCustomerlValues = [];
        $scope.CilindrosValues = [];
        $scope.LiberacionValues = [];
        $scope.ResponsableConfeccionIngValues = [];
        $scope.ResponsableLiberacionLetValues = [];
        $scope.ResponsableLiberacionFinalIngValues = [];
        $scope.TipoImpresoraValues = [];
        $scope.ImpresoraValues = [];
        $scope.ProveedorValues = [];
        $scope.ResponsablePrePrensaValues = [];
        $scope.PerfilImpresionValues = [];
        $scope.TipoCilindrosValues = [];
        $scope.CodigosCilindrosValues = [];

        $scope.categoriaValues = [];
        $scope.EstadoPrePrensaValues = [];
        $scope.Nombre_ClienteValues = [];
        $scope.Tipo_AdmValues = [];

        $scope.filteredProductos = [];
        $scope.sortColumn = 'Cod_Producto';
        $scope.reverseSort = false;
        $scope.dateComparison = 'equals'; // Comparación para fechas

        // Obtener productos desde la API
        GetProductos();

        function GetProductos() {
            APIService.GetProductos().then(function (response) {
                $scope.productos = response.data;
                console.log('$scope.productos', $scope.productos);
                $scope.codProductoValues = [...new Set($scope.productos.map(p => p.Cod_Producto))]; // Obtener valores únicos para Cod_Producto
                $scope.ResponsableComercialValues = [...new Set($scope.productos.map(p => p.ResponsableComercial))]; // Obtener valores únicos para ResponsableComercial
                $scope.categoriaValues = [...new Set($scope.productos.map(p => p.Categoria))];
                $scope.EstadoPrePrensaValues = [...new Set($scope.productos.map(p => p.EstadoPrePrensa))];
                $scope.Nombre_ClienteValues = [...new Set($scope.productos.map(p => p.Nombre_Cliente))];
                $scope.Tipo_AdmValues = [...new Set($scope.productos.map(p => p.Tipo_Adm))];
                $scope.ResponsableCustomerlValues = [...new Set($scope.productos.map(p => p.ResponsableCustomer))];
                $scope.CilindrosValues = [...new Set($scope.productos.map(p => p.Cilindros))];
                $scope.LiberacionValues = [...new Set($scope.productos.map(p => p.Liberacion))];
                $scope.ResponsableConfeccionIngValues = [...new Set($scope.productos.map(p => p.ResponsableConfeccionIng))];
                $scope.ResponsableLiberacionLetValues = [...new Set($scope.productos.map(p => p.ResponsableLiberacionLet))];
                $scope.ResponsableLiberacionFinalIngValues = [...new Set($scope.productos.map(p => p.ResponsableLiberacionFinalIng))];
                $scope.TipoImpresoraValues = [...new Set($scope.productos.map(p => p.TipoImpresora))];
                $scope.ImpresoraValues = [...new Set($scope.productos.map(p => p.Impresora))];
                $scope.ProveedorValues = [...new Set($scope.productos.map(p => p.Proveedor))];
                $scope.ResponsablePrePrensaValues = [...new Set($scope.productos.map(p => p.ResponsablePrePrensa))];
                $scope.PerfilImpresionValues = [...new Set($scope.productos.map(p => p.PerfilImpresion))];
                $scope.TipoCilindrosValues = [...new Set($scope.productos.map(p => p.TipoCilindros))];
                $scope.CodigosCilindrosValues = [...new Set($scope.productos.map(p => p.CodigosCilindros))];


                $scope.applyFilters(); // Aplicar filtros después de obtener los datos
            }, function (error) {
                $scope.errorMessage = "Oops, algo salió mal.";
            });
        }

        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json')
            .withOption('paging', true)
            .withPaginationType('full_numbers')
            .withDisplayLength(20)
            .withOption('order', [6, 'desc']);

        // Función para aplicar los filtros
        $scope.applyFilters = _.debounce(function () {

            $timeout(function () {
                let productosFiltrados = $scope.productos;

                $scope.filters.forEach(filter => {
                    if (filter.selectedColumn && filter.filterValue) {
                        productosFiltrados = productosFiltrados.filter(producto => {
                            let fieldValue = producto[filter.selectedColumn];
                            let filtroValor = filter.filterValue;
                            let dateComparison = filter.dateComparison;

                            if (filter.selectedColumn.startsWith('Fecha') || filter.selectedColumn === 'LastRefreshDate') {
                                let productoFecha = new Date(fieldValue);
                                let filtroFecha = new Date(filtroValor);

                                switch (dateComparison) {
                                    case 'equals':
                                        return productoFecha.toDateString() === filtroFecha.toDateString();
                                    case 'greater':
                                        return productoFecha > filtroFecha;
                                    case 'less':
                                        return productoFecha < filtroFecha;
                                    default:
                                        return false;
                                }
                            }

                            if (filter.selectedColumn === 'Dias' || filter.selectedColumn === 'DiasStandby') {
                                console.log('fieldValue.toString())', fieldValue.toString());

                                console.log('filtroValor.toString()', filtroValor.toString());

                                console.log('fieldValue.toString() === filtroValor.toString()', fieldValue.toString() === filtroValor.toString());
                                switch (dateComparison) {
                                    case 'equals':
                                        return fieldValue.toString() === filtroValor.toString();
                                    case 'greater':
                                        return fieldValue > filtroValor;
                                    case 'less':
                                        return fieldValue < filtroValor;
                                    default:
                                        return false;
                                }
                                //return fieldValue && fieldValue.toString() === filtroValor.toString();
                            }

                            if (filter.selectedColumn === 'Estado' ||
                                filter.selectedColumn === 'Cod_Producto' ||
                                filter.selectedColumn === 'ResponsableComercial' ||
                                filter.selectedColumn === 'Categoria' ||
                                filter.selectedColumn === 'EstadoPrePrensa' ||
                                filter.selectedColumn === 'Nombre_Cliente' ||
                                filter.selectedColumn === 'Tipo_Adm' ||
                                filter.selectedColumn === 'ResponsableCustomer' ||
                                filter.selectedColumn === 'Cilindros' || 
                                filter.selectedColumn === 'Liberacion' ||
                                filter.selectedColumn === 'ResponsableConfeccionIng' ||
                                filter.selectedColumn === 'ResponsableLiberacionLet' ||
                                filter.selectedColumn === 'ResponsableLiberacionFinalIng' ||
                                filter.selectedColumn === 'TipoImpresora' ||
                                filter.selectedColumn === 'Impresora' ||
                                filter.selectedColumn === 'Proveedor' ||
                                filter.selectedColumn === 'ResponsablePrePrensa' ||
                                filter.selectedColumn === 'PerfilImpresion' ||
                                filter.selectedColumn === 'TipoCilindros' ||
                                filter.selectedColumn === 'CodigosCilindros'

                            ) {
                                return fieldValue && fieldValue.toString().toLowerCase().includes(filtroValor.toString().toLowerCase());
                            }

                            if (filter.selectedColumn === 'CerradoIng' || filter.selectedColumn === 'CerradoPrePrensa' || filter.selectedColumn === 'ArteModificado' || filter.selectedColumn === 'RushOrder') {
                                return fieldValue.toString().toLowerCase().trim() === filtroValor.toString().toLowerCase().trim();
                            }

                            return false;
                        });
                    }
                });

                $scope.filteredProductos = $filter('orderBy')(productosFiltrados, $scope.sortColumn, $scope.reverseSort);
            }, 200);
        }, 300); // Ajusta el tiempo de debounce según sea necesario



        // Añadir un nuevo filtro
        $scope.addFilter = function () {
            $scope.filters.push({ selectedColumn: '', filterValue: '', dateComparison: 'equals' });
        };

        // Eliminar un filtro
        $scope.removeFilter = function (index) {
            $scope.filters.splice(index, 1);
            $scope.applyFilters(); // Reaplicar filtros después de eliminar
        };

        $scope.sortBy = function (column) {
            $scope.sortColumn = column;
            $scope.reverseSort = !$scope.reverseSort;
            $scope.applyFilters(); // Reaplicar filtros y ordenación
        };
        // Aplicar filtros cuando se cambie la columna seleccionada o el valor de filtro
        $scope.$watch('filters', function () {
            $scope.applyFilters();
        }, true);

        $scope.doSearch = function () {
            $scope.applyFilters(); // Reaplicar filtros y ordenación
        };
    
        $scope.exportExcel = function () {

            $scope.butonVisible = true;
            $scope.successMessage2 = "Preparando Archivo...";

            if ($scope.dateDesdeinp2 != "" && $scope.dateDesdeinp2 != null && $scope.dateDesdeinp2 != undefined && $scope.dateHastainp2 != "" && $scope.dateHastainp2 != null && $scope.dateHastainp2 != undefined) {
                $scope.fechaDesde2 = moment($scope.dateDesdeinp2);
                $scope.fechaHasta2 = moment($scope.dateHastainp2);

                $scope.fechaDesde2 = moment($scope.fechaDesde2).format('DD/MM/YYYY');
                $scope.fechaHasta2 = moment($scope.fechaHasta2).format('DD/MM/YYYY');

                 var servCallType = APIService.getProductoParaExcel($scope.fechaDesde2, $scope.fechaHasta2, $scope.filtroEstadoParamandar);

                servCallType.then(function (u) {
                    $scope.dataForExcel = u.data;
                    $scope.exportData();
                    $scope.butonVisible = false;

                    $scope.successMessage2 = "Archivo Descargado con Exito";
                    $scope.errorMessage2 = "";

                    $timeout(function () {
                        $scope.successMessage2 = null;
                    }, 3000);

                }, function (error) {
                    $scope.butonVisible = false;

                    $scope.errorMessage2 = "Oops, something went wrong.";
                });
                $scope.mensaje = "";
            } else {
                $scope.successMessage2 = "";

                $scope.errorMessage2 = "Fecha/s Invalida/s";
                $scope.butonVisible = false;

            }



        }

        {
   
  
  
}

        var mystyle = {
            headers: true,
            columns: [
                { columnid: 'Cod_Producto', title: 'Cod_Producto' },
                { columnid: 'Descripcion', title: 'Descripcion' },
                { columnid: 'Unid_Medida', title: 'Unid_Medida' },
                { columnid: 'Fecha_Creacion', title: 'Fecha_Creacion' },
                { columnid: 'Tipo_Adm', title: 'Tipo_Adm' },
                { columnid: 'Reemplazo_Prod', title: 'Reemplazo_Prod' },
                { columnid: 'Cilindros', title: 'Cilindros' },
                { columnid: 'Referencia_Item', title: 'Referencia_Item' },
                { columnid: 'Liberacion', title: 'Liberacion' },
                { columnid: 'Fecha_Liberacion', title: 'Fecha_Liberacion' },
                { columnid: 'Nro_Pedido_Original', title: 'Nro_Pedido_Original' },
                { columnid: 'Fecha_Pedido_Original', title: 'Fecha_Pedido_Original' },
                { columnid: 'CodCliente', title: 'CodCliente' },
                { columnid: 'Nombre_Cliente', title: 'Nombre_Cliente' },
                { columnid: 'OC_Cliente', title: 'OC_Cliente' },
                { columnid: 'Cod_Producto_Cliente', title: 'Cod_Producto_Cliente' },
                { columnid: 'Fecha_Deseada_Cliente', title: 'Fecha_Deseada_Cliente' },
                { columnid: 'ResponsableComercial', title: 'ResponsableComercial' },
                { columnid: 'ResponsableCustomer', title: 'ResponsableCustomer' },
                { columnid: 'Categoria', title: 'Categoria' },
                { columnid: 'ResponsableConfeccionIng', title: 'ResponsableConfeccionIng' },
                { columnid: 'FechaConfeccionIng', title: 'FechaConfeccionIng' },
                { columnid: 'IdentificadorCierreIng', title: 'IdentificadorCierreIng' },
                { columnid: 'HabilitaCierreLet', title: 'HabilitaCierreLet' },
                { columnid: 'ResponsableLiberacionLet', title: 'ResponsableLiberacionLet' },
                { columnid: 'FechaLiberacionLet', title: 'FechaLiberacionLet' },
                { columnid: 'ResponsableLiberacionFinalIng', title: 'ResponsableLiberacionFinalIng' },
                { columnid: 'FechaLiberacionFinalIng', title: 'FechaLiberacionFinalIng' },
                { columnid: 'ObservacionesIng', title: 'ObservacionesIng' },
                { columnid: 'CerradoIng', title: 'CerradoIng' },
                { columnid: 'RushOrder', title: 'RushOrder' },
                { columnid: 'ReChequeoProducto', title: 'ReChequeoProducto' },
                { columnid: 'TipoImpresora', title: 'TipoImpresora' },
                { columnid: 'Impresora', title: 'Impresora' },
                { columnid: 'Proveedor', title: 'Proveedor' },
                { columnid: 'ResponsablePrePrensa', title: 'ResponsablePrePrensa' },
                { columnid: 'EstadoPrePrensa', title: 'EstadoPrePrensa' },
                { columnid: 'ObservacionesPrePrensa', title: 'ObservacionesPrePrensa' },
                { columnid: 'FechaRecepcionArte', title: 'FechaRecepcionArte' },
                { columnid: 'FechaEnvioArte_ET', title: 'FechaEnvioArte_ET' },
                { columnid: 'FechaPDFModulo', title: 'FechaPDFModulo' },
                { columnid: 'FechaAprobacionPDFCliente', title: 'FechaAprobacionPDFCliente' },
                { columnid: 'FechaEnvioCromalin', title: 'FechaEnvioCromalin' },
                { columnid: 'FechaAprobacionCromalin', title: 'FechaAprobacionCromalin' },
                { columnid: 'FechaPDFArmado', title: 'FechaPDFArmado' },
                { columnid: 'FechaLiberadoAGrabado', title: 'FechaLiberadoAGrabado' },
                { columnid: 'FechaSacaPrueba', title: 'FechaSacaPrueba' },
                { columnid: 'FechaAprobacionSacaPrueba', title: 'FechaAprobacionSacaPrueba' },
                { columnid: 'PerfilImpresion', title: 'PerfilImpresion' },
                { columnid: 'Colores', title: 'Colores' },
                { columnid: 'ComentariosColores', title: 'ComentariosColores' },
                { columnid: 'CerradoPrePrensa', title: 'CerradoPrePrensa' },
                { columnid: 'FechaDocumento', title: 'FechaDocumento' },
                { columnid: 'Estado', title: 'Estado' },
                { columnid: 'FechaStandBy', title: 'FechaStandBy' },
                { columnid: 'ObsProducto', title: 'ObsProducto' },
                { columnid: 'FechaFinStandBy', title: 'FechaFinStandBy' },
                { columnid: 'LastRefreshDate', title: 'LastRefreshDate' },
                { columnid: 'ObsPerfiles', title: 'ObsPerfiles' },
                { columnid: 'ArteModificado', title: 'ArteModificado' },
                { columnid: 'FechaArteOriginal', title: 'FechaArteOriginal' },
                { columnid: 'OT', title: 'OT' },
                { columnid: 'TipoCilindros', title: 'TipoCilindros' },
                { columnid: 'FechaEntregaNuevosCilindros', title: 'FechaEntregaNuevosCilindros' },
                { columnid: 'CodigosCilindros', title: 'CodigosCilindros' },
                { columnid: 'FechaRecepcionCodigosCilindros', title: 'FechaRecepcionCodigosCilindros' },
                { columnid: 'FechaPreparacionCilindros', title: 'FechaPreparacionCilindros' },
                { columnid: 'FechaLiberacionMontaje', title: 'FechaLiberacionMontaje' },
                { columnid: 'FechaRetiroCilindro', title: 'FechaRetiroCilindro' },
                { columnid: 'FechaPromesaProveedorGrabado', title: 'FechaPromesaProveedorGrabado' },
                { columnid: 'FechaRecepcionHerramental', title: 'FechaRecepcionHerramental' },
                { columnid: 'ObsHerramental', title: 'ObsHerramental' },

            ],
        };

        $scope.exportData = function () {
            var date = new Date();
            $scope.CurrentDateTime = $filter('date')(new Date().getTime(), 'MM/dd/yyyy HH:mm:ss');
            alasql('SELECT Cod_Producto, Descripcion, Unid_Medida, Fecha_Creacion, Tipo_Adm, Reemplazo_Prod, Cilindros, Referencia_Item, Liberacion, Fecha_Liberacion, ' +
                'Nro_Pedido_Original, Fecha_Pedido_Original, CodCliente, Nombre_Cliente, OC_Cliente, Cod_Producto_Cliente, Fecha_Deseada_Cliente, ResponsableComercial, ' +
                'ResponsableCustomer, Categoria, ResponsableConfeccionIng, FechaConfeccionIng, IdentificadorCierreIng, HabilitaCierreLet, ResponsableLiberacionLet, ' +
                'FechaLiberacionLet, ResponsableLiberacionFinalIng, FechaLiberacionFinalIng, ObservacionesIng, CerradoIng, RushOrder, ReChequeoProducto, TipoImpresora, ' +
                'Impresora, Proveedor, ResponsablePrePrensa, EstadoPrePrensa, ObservacionesPrePrensa, FechaRecepcionArte, FechaEnvioArte_ET, FechaPDFModulo, ' +
                'FechaAprobacionPDFCliente, FechaEnvioCromalin, FechaAprobacionCromalin, FechaPDFArmado, FechaLiberadoAGrabado, FechaSacaPrueba, FechaAprobacionSacaPrueba, ' +
                'PerfilImpresion, Colores, ComentariosColores, CerradoPrePrensa, FechaDocumento, Estado, FechaStandBy, ObsProducto, FechaFinStandBy, LastRefreshDate, ' +
                'ObsPerfiles, ArteModificado, FechaArteOriginal, OT, TipoCilindros, FechaEntregaNuevosCilindros, CodigosCilindros, FechaRecepcionCodigosCilindros, ' +
                'FechaPreparacionCilindros, FechaLiberacionMontaje, FechaRetiroCilindro, FechaPromesaProveedorGrabado, FechaRecepcionHerramental, ObsHerramental ' +
                'INTO XLSX("Productos' + $scope.CurrentDateTime + '.xlsx",?) FROM ?', [mystyle, $scope.dataForExcel]);
        };


    }
    )












    .controller('productosCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {

        // Leer el objeto JSON desde localStorage
        var datosUsuario = $window.localStorage.getItem('datosUsuario');
        $scope.tieneRolAdminProducto = false;
        $scope.tieneRolIngenieria = false;
        $scope.tieneRolProducto = false;
        $scope.tieneRolPrensa = false;
        $scope.tieneRolHerramental = false;

        if (datosUsuario) {
            datosUsuario = JSON.parse(datosUsuario);


            if (datosUsuario.currentUser && datosUsuario.currentUser.Role) {
                var userRoles = datosUsuario.currentUser.Role;

                $scope.tieneRolIngenieria = userRoles.some(function (role) {
                    return role.Name === 'Ingenieria';
                });

                $scope.tieneRolProducto = userRoles.some(function (role) {
                    return role.Name === 'Producto';
                });

                $scope.tieneRolPrensa = userRoles.some(function (role) {
                    return role.Name === 'Pre Prensa';
                });


                $scope.tieneRolAdminProducto = userRoles.some(function (role) {
                    return role.Name === 'Admin Producto';
                });

                $scope.tieneRolHerramental = userRoles.some(function (role) {
                    return role.Name === 'Herramental';
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
                console.log('scope.productoData',$scope.productoData);
                $scope.estados = $scope.productoData.estados;
                $scope.productoData.EstadoParaMostrar = $scope.estados.find(function (estado) {
                    return estado?.IDEstadoProducto === $scope.productoData.Estado;
                });
                $scope.impresorasDisponibles = [{ id: 1, nombre: 'Sin Asignar' }, { id: 2, nombre: 'Flexo' }, { id: 3, nombre: 'Hueco' }];
                $scope.cilindrosDisponibles = [{ id: 1, nombre: 'Sin Asignar' }, { id: 2, nombre: 'Bolsapel' }, { id: 3, nombre: 'Nuevos' }, { id: 4, nombre: 'Ambos' }];

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


                if ($scope.productoData.FechaEntregaNuevosCilindros) {
                    $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros = new Date($scope.productoData.FechaEntregaNuevosCilindros);
                }

                if ($scope.productoData.FechaPreparacionCilindros) {
                    $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros = new Date($scope.productoData.FechaPreparacionCilindros);
                }

                if ($scope.productoData.FechaLiberacionMontaje) {
                    $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje = new Date($scope.productoData.FechaLiberacionMontaje);
                }

                if ($scope.productoData.FechaRetiroCilindro) {
                    $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro = new Date($scope.productoData.FechaRetiroCilindro);
                }

                if ($scope.productoData.FechaPromesaProveedorGrabado) {
                    $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado = new Date($scope.productoData.FechaPromesaProveedorGrabado);
                }


                AlertService.ShowAlert($scope);
            }, function (error) {
                AlertService.SetAlert("Error al cargar el producto", "error");
            });


            var servCallGetProductoPorCodigo = APIService.GetProductoPorCodigo(id);
            servCallGetProductoPorCodigo.then(function (u) {
                $scope.servCallGetProductoPorCodigoData = u.data[0];
                console.log('$scope.servCallGetProductoPorCodigoData', $scope.servCallGetProductoPorCodigoData);

            },

                function (error) {
                    AlertService.SetAlert("Error al cargar el producto", "error");
                });


        }

        $scope.procesarFecha = function (fechaoriginal, fechanooriginal, forzarlo = false) {
            if (fechanooriginal instanceof Date) {
                var fechaModificada = $scope.fechaFueModificada(fechaoriginal, fechanooriginal);
                if (!fechaModificada || fechaoriginal === undefined) {
                    if (fechaoriginal === undefined) {
                        return fechaoriginal;

                    }

                     
                    var fechaoriginal = new Date(fechaoriginal);
                    const año = fechaoriginal.getFullYear();
                    const mes = fechaoriginal.getMonth() + 1; // Los meses van de 0 a 11
                    const dia = fechaoriginal.getDate();
                    let horas = fechaoriginal.getHours();
                    let minutos = fechaoriginal.getMinutes();
                    let segundos = fechaoriginal.getSeconds();
                    const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}T${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                    return fechaFormateada;
                }

                var fechaProcesada = new Date(fechanooriginal);
                var fechaparahoras = new Date();


                const año = fechaProcesada.getFullYear();
                const mes = fechaProcesada.getMonth() + 1; // Los meses van de 0 a 11
                const dia = fechaProcesada.getDate();
                let horas = fechaparahoras.getHours();
                let minutos = fechaparahoras.getMinutes();
                let segundos = fechaparahoras.getSeconds();

                if (año === 1900 && mes === 1 && dia === 1) {
                    horas = 0;
                    minutos = 0;
                    segundos = 0;
                }

                if (forzarlo) {
                    horas = fechaProcesada.getHours();
                    minutos = fechaProcesada.getMinutes();
                    segundos = fechaProcesada.getSeconds();
                }

                const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}T${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                return fechaFormateada;
            }
            return fechaoriginal;


            };
        

        $scope.fechaFueModificada = function (fechaoriginal, fechanooriginal) {


            let fechaOriginalDate = new Date(fechaoriginal);
            let fechaNoOriginalDate = new Date(fechanooriginal);
            return fechaOriginalDate.getTime() !== fechaNoOriginalDate.getTime();
        };

        $scope.processForm = function () {
            // Llamados para procesar las fechas
            $scope.productoData.Fecha_Creacion = $scope.procesarFecha($scope.productoData.Fecha_Creacion , $scope.fechaAuxiliarParaMostrar.Fecha_Creacion);
            $scope.productoData.Fecha_Liberacion = $scope.procesarFecha($scope.productoData.Fecha_Liberacion,$scope.fechaAuxiliarParaMostrar.Fecha_Liberacion);
            $scope.productoData.Fecha_Deseada_Cliente = $scope.procesarFecha($scope.productoData.Fecha_Deseada_Cliente,$scope.fechaAuxiliarParaMostrar.Fecha_Deseada_Cliente);
            $scope.productoData.Fecha_Pedido_Original = $scope.procesarFecha($scope.productoData.Fecha_Pedido_Original,$scope.fechaAuxiliarParaMostrar.Fecha_Pedido_Original);
            $scope.productoData.FechaConfeccionIng = $scope.procesarFecha($scope.productoData.FechaConfeccionIng,$scope.fechaAuxiliarParaMostrar.FechaConfeccionIng);
            $scope.productoData.FechaLiberacionLet = $scope.procesarFecha($scope.productoData.FechaLiberacionLet,$scope.fechaAuxiliarParaMostrar.FechaLiberacionLet);
            $scope.productoData.FechaLiberacionFinalIng = $scope.procesarFecha($scope.productoData.FechaLiberacionFinalIng,$scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng);
            $scope.productoData.FechaRecepcionArte = $scope.procesarFecha($scope.productoData.FechaRecepcionArte,$scope.fechaAuxiliarParaMostrar.FechaRecepcionArte);
            $scope.productoData.FechaEnvioArte_ET = $scope.procesarFecha($scope.productoData.FechaEnvioArte_ET,$scope.fechaAuxiliarParaMostrar.FechaEnvioArte_ET);
            $scope.productoData.FechaPDFModulo = $scope.procesarFecha($scope.productoData.FechaPDFModulo,$scope.fechaAuxiliarParaMostrar.FechaPDFModulo);
            $scope.productoData.FechaAprobacionPDFCliente = $scope.procesarFecha($scope.productoData.FechaAprobacionPDFCliente,$scope.fechaAuxiliarParaMostrar.FechaAprobacionPDFCliente);
            $scope.productoData.FechaEnvioCromalin = $scope.procesarFecha($scope.productoData.FechaEnvioCromalin,$scope.fechaAuxiliarParaMostrar.FechaEnvioCromalin);
            $scope.productoData.FechaAprobacionCromalin = $scope.procesarFecha($scope.productoData.FechaAprobacionCromalin,$scope.fechaAuxiliarParaMostrar.FechaAprobacionCromalin);
            $scope.productoData.FechaPDFArmado = $scope.procesarFecha($scope.productoData.FechaPDFArmado,$scope.fechaAuxiliarParaMostrar.FechaPDFArmado);
            $scope.productoData.FechaLiberadoAGrabado = $scope.procesarFecha($scope.productoData.FechaLiberadoAGrabado,$scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado);
            $scope.productoData.FechaSacaPrueba = $scope.procesarFecha($scope.productoData.FechaSacaPrueba,$scope.fechaAuxiliarParaMostrar.FechaSacaPrueba);
            $scope.productoData.FechaAprobacionSacaPrueba = $scope.procesarFecha($scope.productoData.FechaAprobacionSacaPrueba,$scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba);
            $scope.productoData.FechaRecepcionGrabado = $scope.procesarFecha($scope.productoData.FechaRecepcionGrabado,$scope.fechaAuxiliarParaMostrar.FechaRecepcionGrabado);
            $scope.productoData.FechaRecepcionHerramental = $scope.procesarFecha($scope.productoData.FechaRecepcionHerramental,$scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental);
            $scope.productoData.FechaDocumento = $scope.procesarFecha($scope.productoData.FechaDocumento,$scope.fechaAuxiliarParaMostrar.FechaDocumento);
            $scope.productoData.FechaEntregaNuevosCilindros = $scope.procesarFecha($scope.productoData.FechaEntregaNuevosCilindros,$scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros);
            $scope.productoData.FechaPreparacionCilindros = $scope.procesarFecha($scope.productoData.FechaPreparacionCilindros,$scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros);
            $scope.productoData.FechaLiberacionMontaje = $scope.procesarFecha($scope.productoData.FechaLiberacionMontaje,$scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje);
            $scope.productoData.FechaRetiroCilindro = $scope.procesarFecha($scope.productoData.FechaRetiroCilindro,$scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro);
            $scope.productoData.FechaPromesaProveedorGrabado = $scope.procesarFecha($scope.productoData.FechaPromesaProveedorGrabado, $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado);
            $scope.productoData.FechaArteOriginal = $scope.procesarFecha($scope.productoData.FechaArteOriginal, $scope.fechaAuxiliarParaMostrar.FechaArteOriginal,true);


            if ($scope.productoData.EstadoParaMostrar?.IDEstadoProducto == 2) {

                var fechaoriginal = new Date();

                const año = fechaoriginal.getFullYear();
                const mes = fechaoriginal.getMonth() + 1; // Los meses van de 0 a 11
                const dia = fechaoriginal.getDate();
                const horas = fechaoriginal.getHours();
                const minutos = fechaoriginal.getMinutes();
                const segundos = fechaoriginal.getSeconds();
                const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}T${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;


                $scope.productoData.FechaStandBy = fechaFormateada;
            }

            if (($scope.productoData.EstadoParaMostrar?.IDEstadoProducto == 1 || $scope.productoData.EstadoParaMostrar?.IDEstadoProducto == 3) && $scope.productoData.Estado == 2) {


                var fechaoriginal = new Date();

                const año = fechaoriginal.getFullYear();
                const mes = fechaoriginal.getMonth() + 1; // Los meses van de 0 a 11
                const dia = fechaoriginal.getDate();
                const horas = fechaoriginal.getHours();
                const minutos = fechaoriginal.getMinutes();
                const segundos = fechaoriginal.getSeconds();
                const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}T${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;




                $scope.productoData.FechaFinStandBy = fechaFormateada;
            }

           

            $scope.productoData.Estado = $scope.productoData.EstadoParaMostrar.IDEstadoProducto;

            var data = $.param($scope.productoData);


            $scope.validarFechasFinal = function () {
                var validas = [];
                if ($scope.fechaAuxiliarParaMostrar.Fecha_Liberacion < $scope.fechaAuxiliarParaMostrar.FechaDocumento && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.Fecha_Liberacion)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.Fecha_Liberacion.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.Fecha_Liberacion.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('Fecha_Liberacion').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.Fecha_Liberacion.$setValidity('customValidacion', true);
                    validas.push(true);

                }


                if ($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng < $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng)) {
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


                if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion || $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng || $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.FechaDocumento) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet) && $scope.productoData?.HabilitaCierreLet) {
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


                if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion || $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng || $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaDocumento) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng) && ($scope.productoData?.HabilitaCierreLet && $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet)) {
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

                


                if (($scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros < $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaPreparacionCilindros.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaPreparacionCilindros.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaPreparacionCilindros').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaPreparacionCilindros.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje < $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros || $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaLiberacionMontaje.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaLiberacionMontaje.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaLiberacionMontaje').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaLiberacionMontaje.$setValidity('customValidacion', true);
                    validas.push(true);

                }


                if (($scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro < $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros || $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros || $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaRetiroCilindro.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaRetiroCilindro.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaRetiroCilindro').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaRetiroCilindro.$setValidity('customValidacion', true);
                    validas.push(true);

                }

                if (($scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros || $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros || $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje || $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaPromesaProveedorGrabado.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaPromesaProveedorGrabado.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaPromesaProveedorGrabado').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaPromesaProveedorGrabado.$setValidity('customValidacion', true);
                    validas.push(true);

                }


                if (($scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros || $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros || $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje || $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaPromesaProveedorGrabado.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaPromesaProveedorGrabado.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaPromesaProveedorGrabado').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaPromesaProveedorGrabado.$setValidity('customValidacion', true);
                    validas.push(true);

                }


                if (($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba)) {
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

                if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba)) {
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


                if (($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaLiberacionMontaje.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaLiberacionMontaje.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaLiberacionMontaje').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaLiberacionMontaje.$setValidity('customValidacion', true);
                    validas.push(true);

                }






                if ($scope.productoData.TipoImpresora == 3) {


                    if (($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental < $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba && $scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental < $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental)) {
                    // La fecha de confección es menor que la fecha de documento
                    validas.push(false);
                    // Establece el campo como inválido manualmente
                    $scope.editAuthorForm.FechaRecepcionHerramental.$setValidity('customValidacion', false);
                    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                    $scope.editAuthorForm.FechaRecepcionHerramental.$setTouched();
                    // Opcionalmente, enfoca el campo
                    document.getElementById('FechaRecepcionHerramental').focus();
                } else {
                    // La validación pasó, establece el campo como válido
                    $scope.editAuthorForm.FechaRecepcionHerramental.$setValidity('customValidacion', true);
                    validas.push(true);

                    }

                }

                if ($scope.productoData.TipoImpresora == 2) {


                    if ($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental < $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental)) {
                        // La fecha de confección es menor que la fecha de documento
                        validas.push(false);
                        // Establece el campo como inválido manualmente
                        $scope.editAuthorForm.FechaRecepcionHerramental.$setValidity('customValidacion', false);
                        // Marca el campo como tocado para mostrar mensajes de error si es necesario
                        $scope.editAuthorForm.FechaRecepcionHerramental.$setTouched();
                        // Opcionalmente, enfoca el campo
                        document.getElementById('FechaRecepcionHerramental2').focus();
                    } else {
                        // La validación pasó, establece el campo como válido
                        $scope.editAuthorForm.FechaRecepcionHerramental.$setValidity('customValidacion', true);
                        validas.push(true);

                    }

                }

                return validas;

            }



            if (id && !$scope.validarFechasFinal().some(function (element) {
                return element === false;
            })) {
                var servCall = APIService.updateProducto(id, data);
                servCall.then(function (u) {
                    AlertService.SetAlert("El Producto fue actualizado con éxito", "success");
                    $scope.ShowAlert();
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
            if (($scope.fechaAuxiliarParaMostrar.Fecha_Liberacion < $scope.fechaAuxiliarParaMostrar.FechaDocumento) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.Fecha_Liberacion)) {
                $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion = $scope.fechaAuxiliarParaMostrar.FechaDocumento;
            }
            else {
                $scope.editAuthorForm.Fecha_Liberacion.$setValidity('customValidacion', true);

            }


            if (($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng < $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaConfeccionIng)) {
                $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng = $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion;
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

        $scope.$watchGroup(['fechaAuxiliarParaMostrar.FechaDocumento', 'fechaAuxiliarParaMostrar.Fecha_Liberacion', 'fechaAuxiliarParaMostrar.FechaConfeccionIng', 'fechaAuxiliarParaMostrar.FechaLiberacionLet', 'fechaAuxiliarParaMostrar.FechaLiberacionFinalIng'], function (newValues, oldValues) {
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


        

        $scope.actualizarEstadoGeneralCerrado = function () {
            $scope.productoData.Estado = 3;
            $scope.productoData.EstadoParaMostrar = $scope.productoData.estados[2];
            
        };



        $scope.noUsaPrePresa = function (newValue) {
            console.log('productoData.NoUsaPrePrensa', newValue)

                if (newValue === false && newValue !== undefined) {
                    console.log('RESETEO')
                    $scope.productoData.ObservacionesPrePrensa = "";
                } else {
                    $scope.productoData.ObservacionesPrePrensa = "Cerrado por no utilizar pre prensa ya que comparte herramental con referencia";
                }
            };

        //$scope.$watch('productoData.NoUsaPrePrensa', function (newValue, oldValue) {
        //    console.log('productoData.NoUsaPrePrensa', newValue)
        //    if (newValue === false && newValue !== undefined) {
        //        console.log('RESETEO')

        //        $scope.productoData.ObservacionesPrePrensa = "";
        //    } else {
        //        $scope.productoData.ObservacionesPrePrensa = "Cerrado por no utilizar pre prensa ya que comparte herramental con referencia";
        //    }
        //});


        $scope.$watch('productoData.ArteModificado', function (newValue, oldValue) {
            if (newValue === true && oldValue === false) {


                $scope.fechaAuxiliarParaMostrar.FechaArteOriginal = $scope.fechaAuxiliarParaMostrar.FechaRecepcionArte;

                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaRecepcionArte');
                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaEnvioArte_ET');
                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaPDFModulo');
                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaAprobacionPDFCliente');
                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaEnvioCromalin');
                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaAprobacionCromalin');
                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaPDFArmado');
                $scope.setFechaDefault($scope.fechaAuxiliarParaMostrar, 'FechaLiberadoAGrabado');
                $scope.productoData.CerradoPrePrensa = false;


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

            $scope.editAuthorForm.FechaRecepcionHerramental.$setValidity('customValidacion', true);

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
            
            
            
        }

        $scope.actualizarEstadoCerradoPrePrensa = function () {
            if ($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado) {
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
            // Compara las fechas
            return fecha.getTime() !== fechaComparacion.getTime();
        };


        $scope.setFechaDefault = function (obj, fieldName) {
            // Verificar si obj y fieldName son válidos
            if (obj && fieldName && obj.hasOwnProperty(fieldName)) {
                // Convertir la fecha a formato ISO
                var fechaDefault = new Date(1900, 0, 1, 0, 0, 0); // Año, mes (0-indexado), día, hora, minuto, segundo
                obj[fieldName] = fechaDefault; // Asignar la fecha al objeto
            }
        };


        $scope.$watchGroup([
            'fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros',
            'fechaAuxiliarParaMostrar.FechaPreparacionCilindros',
            'fechaAuxiliarParaMostrar.FechaLiberacionMontaje',
            'fechaAuxiliarParaMostrar.FechaRetiroCilindro',
            'fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado',
            'fechaAuxiliarParaMostrar.FechaSacaPrueba',
            'fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba',
            'fechaAuxiliarParaMostrar.FechaRecepcionHerramental'
            
            




        ], function (newValues, oldValues) {
            $scope.actualizarFechasHerramental();

        });

        $scope.actualizarFechasHerramental = function () {


            if (($scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros < $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros)) {
                $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros = $scope.fechaAuxiliarParaMostrar.FechaEntregaNuevosCilindros;
            } else {
                $scope.editAuthorForm.FechaPreparacionCilindros.$setValidity('customValidacion', true);

            }

            if (($scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje)) {
                $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje = $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros;
            } else {
                $scope.editAuthorForm.FechaLiberacionMontaje.$setValidity('customValidacion', true);

            }

            if (($scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro)) {
                $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro = $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje;
            } else {
                $scope.editAuthorForm.FechaRetiroCilindro.$setValidity('customValidacion', true);

            }

            if (($scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado < $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado)) {
                $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado = $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro;
            } else {
                $scope.editAuthorForm.FechaPromesaProveedorGrabado.$setValidity('customValidacion', true);

            }


            if (($scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje)) {
            } else {
                $scope.editAuthorForm.FechaLiberacionMontaje.$setValidity('customValidacion', true);

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


            if ($scope.productoData?.TipoImpresora == 3) {


                if (($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental < $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba && $scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental < $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental)) {

                } else {
                    $scope.editAuthorForm.FechaRecepcionHerramental.$setValidity('customValidacion', true);

                }

            }

            if ($scope.productoData?.TipoImpresora == 2) {


                if ($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental < $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaRecepcionHerramental)) {

                } else {
                    $scope.editAuthorForm.FechaRecepcionHerramental.$setValidity('customValidacion', true);

                }

            }
        }

    })


 .controller('ProductoDashboardController', function ($scope, APIService, $localStorage, $window, $filter) {


     var dataForDashboard = APIService.getDataForDashboard();
     dataForDashboard.then(function (u) {
         $scope.dataForDashboard = u.data;
         console.log('data', $scope.dataForDashboard);
         // Filtrar los elementos donde TipoImpresora es igual a 2
         $scope.dataForDashboard1 = $scope.dataForDashboard.filter(function (item) {
             return item.TipoImpresora === 'Hueco';
         });

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period.split('-');
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.dataForDashboard1.sort(function (a, b) {
             return parseDate(a.PERIODO) - parseDate(b.PERIODO);
         });




         console.log('$scope.dataForDashboard1', $scope.dataForDashboard1);

         // Inicializar objeto de totales
         const totals = {
             SLA_SNP: 0,
             QTY_SNP: 0,
             BEST_SNP: 0,
             WORST_SNP: 0,
             SLA_SND: 0,
             QTY_SND: 0,
             BEST_SND: 0,
             WORST_SND: 0,
             SLA_SNPS: 0,
             QTY_SNPS: 0,
             BEST_SNPS: 0,
             WORST_SNPS: 0,
             SLA_SCP: 0,
             QTY_SCP: 0,
             BEST_SCP: 0,
             WORST_SCP: 0,
             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades

         };

         // Iterar sobre los datos para sumar las cantidades
         $scope.dataForDashboard1.forEach(entry => {
             for (let key in totals) {
                 if (entry.hasOwnProperty(key)) {
                     totals[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totals.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totals = totals;
         console.log('$scope.totals1', $scope.totals);


         /* Line Chart
         ------------------------- */
         var red = 'red';
         var orange = '#ffcc00';
         var greenLight = '#00ACAC';
         var blue = '#3273B1';
         var blueLight = '#348FE2';
         var blackTransparent = 'rgba(0,0,0,0.6)';
         var whiteTransparent = 'rgba(255,255,255,0.4)';
         var month = [];
         month[0] = "Enero";
         month[1] = "Febrero";
         month[2] = "Marzo";
         month[3] = "Abril";
         month[4] = "Mayo";
         month[5] = "Junio";
         month[6] = "Julio";
         month[7] = "Agosto";
         month[8] = "Septiembre";
         month[9] = "Octubre";
         month[10] = "Noviembre";
         month[11] = "Diciembre";

         Morris.Line({
             element: 'visitors-line-chart2',
             data: $scope.dataForDashboard1,
             xLabels: "month",
             xkey: 'PERIODO',

             ykeys: ['SLA_SCP', 'SLA_SND', 'SLA_SNP', 'SLA_SNPS'],
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ['SLA SCP', 'SLA SND', 'SLA SNP', 'SLA SNPS'],
             lineColors: [red, orange, blueLight, greenLight],
             pointFillColors: [red, orange, blueLight, greenLight],
             lineWidth: '2px',
             pointStrokeColors: [red, orange, blueLight, greenLight],
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto',
             hoverCallback: function (index, options, content, row) {
                 // Obtener los datos del punto
                 var data = options.data[index];
                 var period = data.PERIODO; // El período en formato YYYY-MM

                 // Extraer año y mes del período
                 var yearMonth = period.split('-');
                 var year = yearMonth[0];
                 var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

                 // Verificar que el índice esté dentro del rango
                 if (monthIndex < 0 || monthIndex > 11) {
                     monthIndex = 0; // Default a Enero si hay un índice fuera del rango
                 }

                 // Obtener el nombre del mes
                 var monthName = month[monthIndex];

                 // Construir el contenido del tooltip
                 var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

                 // Iterar sobre cada línea para mostrar la información de cada punto
                 options.ykeys.forEach(function (ykey, i) {
                     // Mostrar solo la información para el punto de datos actual
                    

                     var label = options.labels[i];
                     var sla = data[ykey];
                     var worst = data['WORST_' + ykey.split('_')[1]];
                     var best = data['BEST_' + ykey.split('_')[1]];
                     var qty = data['QTY_' + ykey.split('_')[1]];

                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Quantity: " + qty + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Worst: " + worst + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Best: " + best + "</div>";
                 });

                 return tooltipContent;
             }
         });





         // Filtrar los elementos donde TipoImpresora es igual a 2
         $scope.dataForDashboard2 = $scope.dataForDashboard.filter(function (item) {
             return item.TipoImpresora === 'Flexo';
         });

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period.split('-');
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.dataForDashboard2.sort(function (a, b) {
             return parseDate(a.PERIODO) - parseDate(b.PERIODO);
         });

         // Inicializar objeto de totales
         const totalsflexo = {
             SLA_SNP: 0,
             QTY_SNP: 0,
             BEST_SNP: 0,
             WORST_SNP: 0,
             SLA_SND: 0,
             QTY_SND: 0,
             BEST_SND: 0,
             WORST_SND: 0,
             SLA_SNPS: 0,
             QTY_SNPS: 0,
             BEST_SNPS: 0,
             WORST_SNPS: 0,
             SLA_SCP: 0,
             QTY_SCP: 0,
             BEST_SCP: 0,
             WORST_SCP: 0,
             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         // Iterar sobre los datos para sumar las cantidades
         $scope.dataForDashboard2.forEach(entry => {
             console.log('entry', entry);
             for (let key in totalsflexo) {
                 if (entry.hasOwnProperty(key)) {
                     totalsflexo[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsflexo.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsflexo = totalsflexo;
         console.log('$scope.totalsflexo', $scope.totalsflexo);

         /* Line Chart
         ------------------------- */
         var red = 'red';
         var orange = '#ffcc00';
         var greenLight = '#00ACAC';
         var blue = '#3273B1';
         var blueLight = '#348FE2';
         var blackTransparent = 'rgba(0,0,0,0.6)';
         var whiteTransparent = 'rgba(255,255,255,0.4)';
         var month = [];
         month[0] = "Enero";
         month[1] = "Febrero";
         month[2] = "Marzo";
         month[3] = "Abril";
         month[4] = "Mayo";
         month[5] = "Junio";
         month[6] = "Julio";
         month[7] = "Agosto";
         month[8] = "Septiembre";
         month[9] = "Octubre";
         month[10] = "Noviembre";
         month[11] = "Diciembre";

         Morris.Line({
             element: 'visitors-line-chart3',
             data: $scope.dataForDashboard2,
             xLabels: "month",
             xkey: 'PERIODO',

             ykeys: ['SLA_SCP', 'SLA_SND', 'SLA_SNP', 'SLA_SNPS'],
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ['SLA SCP', 'SLA SND', 'SLA SNP', 'SLA SNPS'],
             lineColors: [red, orange, blueLight, greenLight],
             pointFillColors: [red, orange, blueLight, greenLight],
             lineWidth: '2px',
             pointStrokeColors: [red, orange, blueLight, greenLight],
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto',
             hoverCallback: function (index, options, content, row) {
                 // Obtener los datos del punto
                 var data = options.data[index];
                 var period = data.PERIODO; // El período en formato YYYY-MM

                 // Extraer año y mes del período
                 var yearMonth = period.split('-');
                 var year = yearMonth[0];
                 var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

                 // Verificar que el índice esté dentro del rango
                 if (monthIndex < 0 || monthIndex > 11) {
                     monthIndex = 0; // Default a Enero si hay un índice fuera del rango
                 }

                 // Obtener el nombre del mes
                 var monthName = month[monthIndex];

                 // Construir el contenido del tooltip
                 var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

                 // Iterar sobre cada línea para mostrar la información de cada punto
                 options.ykeys.forEach(function (ykey, i) {
                     var label = options.labels[i];
                     var sla = data[ykey];
                     var worst = data['WORST_' + ykey.split('_')[1]];
                     var best = data['BEST_' + ykey.split('_')[1]];
                     var qty = data['QTY_' + ykey.split('_')[1]];

                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Quantity: " + qty + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Worst: " + worst + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Best: " + best + "</div>";
                 });

                 return tooltipContent;
             }
         });



     }, function (error) {
         $window.location.href = "/#/blsp/maquinas/list";
     });



     var dataForDashboardtotal = APIService.getDataForDashboard2();
     dataForDashboardtotal.then(function (u) {
         $scope.dataForDashboardtotal = u.data;

         console.log('dataForDashboardtotal2', $scope.dataForDashboardtotal);

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period.split('-');
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.dataForDashboardtotal.sort(function (a, b) {
             return parseDate(a.PERIODO) - parseDate(b.PERIODO);
         });


         // Inicializar objeto de totales
         const totalsgeneral = {
             QTY_FLEXO: 0,
             QTY_HUECO: 0,
            
             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         // Iterar sobre los datos para sumar las cantidades
         $scope.dataForDashboardtotal.forEach(entry => {
             console.log('entry', entry);
             for (let key in totalsgeneral) {
                 if (entry.hasOwnProperty(key)) {
                     totalsgeneral[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsgeneral.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsgeneral = totalsgeneral;
         console.log('$scope.totalsgeneral', $scope.totalsgeneral);


         /* Line Chart
         ------------------------- */
         var red = 'red';
         var orange = '#ffcc00';
         var greenLight = '#00ACAC';
         var blue = '#3273B1';
         var blueLight = '#348FE2';
         var blackTransparent = 'rgba(0,0,0,0.6)';
         var whiteTransparent = 'rgba(255,255,255,0.4)';
         var month = [];
         month[0] = "Enero";
         month[1] = "Febrero";
         month[2] = "Marzo";
         month[3] = "Abril";
         month[4] = "Mayo";
         month[5] = "Junio";
         month[6] = "Julio";
         month[7] = "Agosto";
         month[8] = "Septiembre";
         month[9] = "Octubre";
         month[10] = "Noviembre";
         month[11] = "Diciembre";

         Morris.Line({
             element: 'visitors-line-chart4',
             data: $scope.dataForDashboardtotal,
             xLabels: "month",
             xkey: 'PERIODO',

             ykeys: ['SLA_FLEXO', 'SLA_HUECO'],
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ['SLA FLEXO', 'SLA HUECO'],
             lineColors: [red, orange],
             pointFillColors: [red, orange],
             lineWidth: '2px',
             pointStrokeColors: [red, orange],
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto',
             hoverCallback: function (index, options, content, row) {
                 // Obtener los datos del punto
                 var data = options.data[index];
                 var period = data.PERIODO; // El período en formato YYYY-MM

                 // Extraer año y mes del período
                 var yearMonth = period.split('-');
                 var year = yearMonth[0];
                 var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

                 // Verificar que el índice esté dentro del rango
                 if (monthIndex < 0 || monthIndex > 11) {
                     monthIndex = 0; // Default a Enero si hay un índice fuera del rango
                 }

                 // Obtener el nombre del mes
                 var monthName = month[monthIndex];

                 // Construir el contenido del tooltip
                 var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

                 // Iterar sobre cada línea para mostrar la información de cada punto
                 options.ykeys.forEach(function (ykey, i) {
                     // Mostrar solo la información para el punto de datos actual


                     var label = options.labels[i];
                     var sla = data[ykey];
                     var worst = data['WORST_' + ykey.split('_')[1]];
                     var best = data['BEST_' + ykey.split('_')[1]];
                     var qty = data['QTY_' + ykey.split('_')[1]];

                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Quantity: " + qty + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Worst: " + worst + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Best: " + best + "</div>";
                 });

                 return tooltipContent;
             }
         });

     });

 });
