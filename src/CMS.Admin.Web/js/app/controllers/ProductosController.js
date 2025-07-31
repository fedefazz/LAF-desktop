'use strict';

angular
    .module('app.controllers')
    .controller('productosController', function ($scope, $filter, APIService, DTOptionsBuilder, $timeout) {
        // Inicialización de variables

        // Obtener la fecha actual
        var today = new Date();

        // Formatear la fecha en yyyy-mm
        var day = String(today.getDate()).padStart(2, '0');
        var month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
        var year = today.getFullYear();
        $scope.dateHastainp2 = today;

        $scope.date1900 = new Date('01/01/1900');

        $scope.isDivVisible = false; // Inicialmente oculto

        $scope.toggleDiv = function () {
            $scope.isDivVisible = !$scope.isDivVisible; // Cambia el estado
        };
        $scope.estados = ['Abierto', 'Stand By', 'Cerrado', 'Cancelado'];
        $scope.booleans = [{ 'key': false, 'value': 'No' }, { 'key': true, 'value': 'Si' }];

        $scope.selectedColumn = ''; // Columna seleccionada para filtrar
        $scope.filterValue = ''; // Valor para filtrar
        $scope.filters = [{ selectedColumn: '', filterValue: $scope.date1900, dateComparison: 'equals' }]; // Inicializa con un filtro vacío

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
                'NoUsaPrePrensa',
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
                'CerradoPrePrensa',
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
        $scope.sortColumn = '';
        $scope.reverseSort = false;
        $scope.dateComparison = 'equals'; // Comparación para fechas
        $scope.dataLoaded = false; // Bandera para indicar si los datos están cargados

        // Obtener productos desde la API
        GetProductos();

        function GetProductos() {
            APIService.GetProductos().then(function (response) {
                $scope.productos = response.data;
                $scope.productos = response.data.filter(function (producto) {
                    return producto.Estado !== "Migrado";
                });
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
                $scope.dataLoaded = true; // Indicar que los datos están cargados
                // Usar $timeout para asegurarse de que Angular haya procesado los cambios antes de inicializar la tabla
                $timeout(function () {
                    $scope.applyFilters();
                    if ($scope.dtInstance && $scope.dtInstance.reloadData) {
                        $scope.dtInstance.reloadData();
                    }
                }, 30);

                //$scope.applyFilters(); // Aplicar filtros después de obtener los datos
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

                            if (filter.selectedColumn === 'CerradoIng' || filter.selectedColumn === 'CerradoPrePrensa' || filter.selectedColumn === 'ArteModificado' || filter.selectedColumn === 'RushOrder' || filter.selectedColumn === 'NoUsaPrePrensa') {
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
            if ($scope.filters === 0){
                GetProductos();
                return;

            }
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
                    console.log('$scope.dataForExcel', $scope.dataForExcel);

                    $scope.dataForExcel = $scope.dataForExcel.filter(function (producto) {
                        return producto.Estado !== "Migrado";
                    });
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


        $scope.exportExcel2 = function () {

            $scope.butonVisible = true;
            $scope.successMessage2 = "Preparando Archivo...";

          

                    var servCallType = APIService.getProductoParaExcel2();

                servCallType.then(function (u) {
                    $scope.dataForExcel2 = u.data;
                    console.log('$scope.dataForExcel2', $scope.dataForExcel2);
                    $scope.exportData2();
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
           



        }

        $scope.exportData2 = function () {
            var date = new Date();
            $scope.CurrentDateTime = $filter('date')(new Date().getTime(), 'MM-dd-yyyy_HH-mm-ss');

            //alasql('SELECT * INTO XLSX("Productos_' + $scope.CurrentDateTime + '.xlsx",?) FROM ?', [mystyle, $scope.dataForExcel]);

            // Llamar a applyStylesToExcel para aplicar estilos
            $timeout(function () {
                $scope.exportDataWithExceljs2();
            }, 1000); // Delay to ensure the file is fully created before applying styles
        };

       


        $scope.exportData = function () {
            var date = new Date();
            $scope.CurrentDateTime = $filter('date')(new Date().getTime(), 'MM-dd-yyyy_HH-mm-ss');

            //alasql('SELECT * INTO XLSX("Productos_' + $scope.CurrentDateTime + '.xlsx",?) FROM ?', [mystyle, $scope.dataForExcel]);

            // Llamar a applyStylesToExcel para aplicar estilos
            $timeout(function () {
                $scope.exportDataWithExceljs();
            }, 1000); // Delay to ensure the file is fully created before applying styles
        };



        $scope.exportDataWithExceljs = function () {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sheet1');


          

            // Definir columnas
            worksheet.columns = [
                { header: 'Cod_Producto', key: 'Cod_Producto', width: 15 },
                { header: 'Descripcion', key: 'Descripcion', width: 30 },
                { header: 'Estado', key: 'Estado', width: 15 },
                { header: 'FechaStandBy', key: 'FechaStandBy', width: 20 },
                { header: 'FechaFinStandBy', key: 'FechaFinStandBy', width: 20 },
                { header: 'LastRefreshDate', key: 'LastRefreshDate', width: 30 },
                { header: 'ObsProducto', key: 'ObsProducto', width: 30 },
                { header: 'Nombre_Cliente', key: 'Nombre_Cliente', width: 30 },


                { header: 'Unid_Medida', key: 'Unid_Medida', width: 15 },
                { header: 'CodCliente', key: 'CodCliente', width: 15 },
                { header: 'Fecha_Creacion', key: 'Fecha_Creacion', width: 20 },
                { header: 'Nro_Pedido_Original', key: 'Nro_Pedido_Original', width: 20 },
                { header: 'Fecha_Deseada_Cliente', key: 'Fecha_Deseada_Cliente', width: 20 },
                { header: 'Tipo_Adm', key: 'Tipo_Adm', width: 15 },
                { header: 'RushOrder', key: 'RushOrder', width: 10 },
                { header: 'ResponsableComercial', key: 'ResponsableComercial', width: 25 },
                { header: 'ResponsableCustomer', key: 'ResponsableCustomer', width: 25 },
                { header: 'Cilindros', key: 'Cilindros', width: 15 },
                { header: 'OC_Cliente', key: 'OC_Cliente', width: 20 },
                { header: 'Cod_Producto_Cliente', key: 'Cod_Producto_Cliente', width: 20 },
                { header: 'Fecha_Pedido_Original', key: 'Fecha_Pedido_Original', width: 20 },
                { header: 'Reemplazo_Prod', key: 'Reemplazo_Prod', width: 15 },
                { header: 'Referencia_Item', key: 'Referencia_Item', width: 20 },
                { header: 'ReChequeoProducto', key: 'ReChequeoProducto', width: 20 },

                { header: 'FechaDocumento', key: 'FechaDocumento', width: 20 },
                { header: 'Liberacion', key: 'Liberacion', width: 20 },
                { header: 'Fecha_Liberacion', key: 'Fecha_Liberacion', width: 20 },
                { header: 'Categoria', key: 'Categoria', width: 20 },
                { header: 'ResponsableConfeccionIng', key: 'ResponsableConfeccionIng', width: 25 },
                { header: 'FechaConfeccionIng', key: 'FechaConfeccionIng', width: 20 },
                { header: 'ResponsableLiberacionLet', key: 'ResponsableLiberacionLet', width: 25 },
                { header: 'FechaLiberacionLet', key: 'FechaLiberacionLet', width: 20 },
                { header: 'ResponsableLiberacionFinalIng', key: 'ResponsableLiberacionFinalIng', width: 25 },
                { header: 'FechaLiberacionFinalIng', key: 'FechaLiberacionFinalIng', width: 20 },
                { header: 'CerradoIng', key: 'CerradoIng', width: 10 },
                { header: 'HabilitaCierreLet', key: 'HabilitaCierreLet', width: 20 },
                { header: 'ObservacionesIng', key: 'ObservacionesIng', width: 30 },

              
                
                { header: 'NoUsaPrePrensa', key: 'NoUsaPrePrensa', width: 10 },
                { header: 'TipoImpresora', key: 'TipoImpresora', width: 20 },
                { header: 'Impresora', key: 'Impresora', width: 10 },
                { header: 'Proveedor', key: 'Proveedor', width: 20 },
                { header: 'ResponsablePrePrensa', key: 'ResponsablePrePrensa', width: 25 },
                { header: 'TipoMaterial', key: 'TipoMaterial', width: 20 },
                { header: 'PerfilImpresion', key: 'PerfilImpresion', width: 20 },
                { header: 'EstadoPrePrensa', key: 'EstadoPrePrensa', width: 20 },
                { header: 'Colores', key: 'Colores', width: 20 },
                { header: 'ArteModificado', key: 'ArteModificado', width: 10 },
                { header: 'FechaArteOriginal', key: 'FechaArteOriginal', width: 20 },
                { header: 'AcuerdoDirectoProveedor', key: 'AcuerdoDirectoProveedor', width: 20 },
                { header: 'OC_PROVEEDOR', key: 'OC_PROVEEDOR', width: 20 },
                { header: 'FechaRecepcionArte', key: 'FechaRecepcionArte', width: 20 },
                { header: 'FechaEnvioArte_ET', key: 'FechaEnvioArte_ET', width: 20 },
                { header: 'FechaPDFModulo', key: 'FechaPDFModulo', width: 20 },
                { header: 'FechaAprobacionPDFCliente', key: 'FechaAprobacionPDFCliente', width: 20 },
                { header: 'FechaEnvioCromalin', key: 'FechaEnvioCromalin', width: 20 },
                { header: 'FechaAprobacionCromalin', key: 'FechaAprobacionCromalin', width: 20 },
                { header: 'FechaPDFArmado', key: 'FechaPDFArmado', width: 20 },
                { header: 'FechaLiberadoAGrabado', key: 'FechaLiberadoAGrabado', width: 20 },
                { header: 'ObsPerfiles', key: 'ObsPerfiles', width: 30 },
                { header: 'ComentariosColores', key: 'ComentariosColores', width: 30 },
                { header: 'ObservacionesPrePrensa', key: 'ObservacionesPrePrensa', width: 30 },
                { header: 'CerradoPrePrensa', key: 'CerradoPrePrensa', width: 10 },
                { header: 'CantCodigosCilindros', key: 'CantCodigosCilindros', width: 10 },

                


                { header: 'OT', key: 'OT', width: 20 },
                { header: 'TipoCilindros', key: 'TipoCilindros', width: 20 },
                { header: 'FechaEntregaNuevosCilindros', key: 'FechaEntregaNuevosCilindros', width: 20 },
                { header: 'CodigosCilindros', key: 'CodigosCilindros', width: 20 },
                { header: 'FechaRecepcionCodigosCilindros', key: 'FechaRecepcionCodigosCilindros', width: 20 },
                { header: 'FechaPreparacionCilindros', key: 'FechaPreparacionCilindros', width: 20 },
                { header: 'FechaLiberacionMontaje', key: 'FechaLiberacionMontaje', width: 20 },
                { header: 'FechaRetiroCilindro', key: 'FechaRetiroCilindro', width: 20 },
                { header: 'FechaPromesaProveedorGrabado', key: 'FechaPromesaProveedorGrabado', width: 20 },
                { header: 'FechaSacaPrueba', key: 'FechaSacaPrueba', width: 20 },
                { header: 'FechaAprobacionSacaPrueba', key: 'FechaAprobacionSacaPrueba', width: 20 },
                { header: 'FechaRecepcionHerramental', key: 'FechaRecepcionHerramental', width: 20 },
                { header: 'ObsHerramental', key: 'ObsHerramental', width: 30 },
                { header: 'Dif_FechaCreacion_FechaPedido', key: 'Dif_FechaCreacion_FechaPedido', width: 15 },
                { header: 'Dif_FechaPedido_FechaDocumento', key: 'Dif_FechaPedido_FechaDocumento', width: 15 },
                { header: 'Dif_FechaDocumento_FechaLiberacion', key: 'Dif_FechaDocumento_FechaLiberacion', width: 15 },
                { header: 'Dif_FechaLiberacion_FechaConfeccion', key: 'Dif_FechaLiberacion_FechaConfeccion', width: 15 },
                { header: 'Dif_FechaLiberacion_FechaLibFinal', key: 'Dif_FechaLiberacion_FechaLibFinal', width: 15 },
                { header: 'Dif_FechaDocArte_FechaEnvioET', key: 'Dif_FechaDocArte_FechaEnvioET', width: 15 },
                { header: 'Dif_FechaPDF_FechaRespCliente', key: 'Dif_FechaPDF_FechaRespCliente', width: 15 },
                { header: 'Dif_FechaEnvCroma_FechaAprobCroma', key: 'Dif_FechaEnvCroma_FechaAprobCroma', width: 15 },
                { header: 'Dif_FechaAprobCroma_FechaPDFArmado', key: 'Dif_FechaAprobCroma_FechaPDFArmado', width: 15 },
                { header: 'Dif_FechaPDFArmado_FechaLibGrabado', key: 'Dif_FechaPDFArmado_FechaLibGrabado', width: 15 },
                { header: 'Dif_FechaLibGrabado_FechaHerramental', key: 'Dif_FechaLibGrabado_FechaHerramental', width: 15 },
                { header: 'Dif_FechaSacaPrueba_FechaAprobSacaPrueba', key: 'Dif_FechaSacaPrueba_FechaAprobSacaPrueba', width: 15 },
                { header: 'Dif_FechaPrepCil_FechaLibMonaje', key: 'Dif_FechaPrepCil_FechaLibMonaje', width: 15 },
                { header: 'Dif_FechaLibMontaje_FechaRetiro', key: 'Dif_FechaLibMontaje_FechaRetiro', width: 15 },
                { header: 'Dif_FechaPromesaProv_FechaRecepHerra', key: 'Dif_FechaPromesaProv_FechaRecepHerra', width: 15 },
                { header: 'Dif_FechaPedido_FechaRecepHerra', key: 'Dif_FechaPedido_FechaRecepHerra', width: 15 },
                { header: 'Dif_FechaArte_FechaRecepHerra', key: 'Dif_FechaArte_FechaRecepHerra', width: 15 },
                { header: 'Dif_Nivel_Servicio', key: 'Dif_Nivel_Servicio', width: 15 },

                { header: 'Dif_LiberadoAGrabado_FechaArte', key: 'Dif_LiberadoAGrabado_FechaArte', width: 15 },
                { header: 'Dif_RecepcionHerramental_LiberadoAGrabado', key: 'Dif_RecepcionHerramental_LiberadoAGrabado', width: 15 },
                { header: 'Dif_LiberacionLet_FechaPedido', key: 'Dif_LiberacionLet_FechaPedido', width: 15 },
            ];

            // Agregar datos y formatear fechas
            $scope.dataForExcel.forEach(row => {
                let formattedRow = {};
                Object.keys(row).forEach(key => {
                    if ((key.toLowerCase().includes("fecha") || key.toLowerCase().includes("date")) && !key.includes("Dif_") && row[key]) {

                        // Formatear fecha si es una cadena con formato ISO
                        let date = new Date(row[key]);
                        if (!isNaN(date.getTime())) {
                            formattedRow[key] = date;
                        } else {
                            formattedRow[key] = row[key];
                        }
                    } else {
                        formattedRow[key] = row[key];
                    }
                });
                worksheet.addRow(formattedRow);
            });

            function formatDate(date) {
                let day = ('0' + date.getDate()).slice(-2);
                let month = ('0' + (date.getMonth() + 1)).slice(-2);
                let year = date.getFullYear();
                var datetest = moment(date).format('DD/MM/YYYY');
                console.log('datetest', datetest);
                return datetest;
            }


            // Establecer el formato para las columnas de fechas
            //const fechaColumns = [
            //    'FechaStandBy', 'FechaFinStandBy', 'LastRefreshDate', 'Fecha_Creacion', // Agrega aquí los nombres de las columnas que contienen fechas
            //    'Fecha_Deseada_Cliente', 'FechaDocumento', 'Fecha_Liberacion', // Continúa según sea necesario
            //];

            //fechaColumns.forEach(col => {
            //    const columnIndex = worksheet.getColumn(col).number; // Obtén el índice de la columna
            //    console.log('fechaColumns', columnIndex);
            //    worksheet.getColumn(columnIndex).numFmt = 'dd/mm/yyyy'; // Ajusta el formato según lo que necesites
            //});


            worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            });

            

            for (let col = 1; col <= 7; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCC' } };
                    }
                });
            }

            for (let col = 8; col <= 24; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCFF' } };
                    }
                });
            }

            for (let col = 25; col <= 37; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC' } };
                    }
                });
            }

            for (let col = 38; col <= 63; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CCFFCC' } };
                    }
                });
            }

            for (let col = 64; col <= 76; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D2B48C' } };
                    }
                });
            }

            for (let col = 77; col <= 97; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CFCFCF' } };
                    }
                });
            }


            workbook.xlsx.writeBuffer().then(data => {
                var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, "Productos_" + $scope.CurrentDateTime + ".xlsx");
            });
        };


        $scope.exportDataWithExceljs2 = function () {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sheet1');




            // Definir columnas
            worksheet.columns = [
                { header: 'FECHA PEDIDO', key: 'Fecha_Pedido', width: 15 },
                { header: 'CODIGO ARTICULO', key: 'Cod_Producto', width: 30 },
                { header: 'PRODUCTO ENTREGADO?', key: 'Producto_Entregado', width: 15 },
                { header: 'PEDIDO PENDIENTE?', key: 'Pedido_Pendiente', width: 20 },
                { header: 'Apariciones', key: 'Apariciones', width: 20 },
                { header: 'CLIENTE', key: 'Cliente', width: 30 },
                { header: 'PRODUCTO', key: 'Descripcion', width: 30 },
                { header: 'N° Pedido', key: 'Pedido', width: 30 },
                { header: 'Impresión FLEXO  / HUECO', key: 'TipoImpresora', width: 15 },
                { header: 'Cant Almas', key: 'Cant_Almas', width: 15 },
                { header: 'Cant Colores', key: 'Cant_Colores', width: 15 },
                { header: 'Cant Colores Facturados', key: 'Cant_Colores_Facturados', width: 15 },
                { header: 'Valor UNITARIO Grabado Cilindro', key: 'Valor_Unit_Grabado_Cilindro', width: 20 },
                { header: 'Valor UNITARIO Fotopolimero/Color', key: 'Valor_Unit_Fotopolimero_Color', width: 20 },
                { header: 'SE FACTURA', key: 'Se_Factura', width: 20 },
                { header: 'OC NRO', key: 'OC_NRO', width: 15 },
                { header: 'Observaciones', key: 'Observaciones', width: 10 },
                { header: 'N° Factura (Completa Marisa)', key: 'Nro_Factura', width: 25 },
                { header: 'COMENTARIOS', key: 'Comentarios', width: 25 },
                
            ];

            // Agregar datos y formatear fechas
            $scope.dataForExcel2.forEach(row => {
                let formattedRow = {};
                Object.keys(row).forEach(key => {
                    console.log('key', key);
                    if ((key.toLowerCase().includes("fecha") || key.toLowerCase().includes("date")) && !key.includes("Dif_") && row[key]) {
                        console.log('key entro', row[key]);

                        // Formatear fecha si es una cadena con formato ISO
                        let date = new Date(row[key]);
                        if (!isNaN(date.getTime())) {
                            formattedRow[key] = date;
                        } else {
                            formattedRow[key] = row[key];
                        }
                    } else {
                        formattedRow[key] = row[key];
                    }
                });
                worksheet.addRow(formattedRow);
            });

            function formatDate(date) {
                let day = ('0' + date.getDate()).slice(-2);
                let month = ('0' + (date.getMonth() + 1)).slice(-2);
                let year = date.getFullYear();
                var datetest = moment(date).format('DD/MM/YYYY');
                console.log('datetest', datetest);
                return datetest;
            }


            // Establecer el formato para las columnas de fechas
            //const fechaColumns = [
            //    'FechaStandBy', 'FechaFinStandBy', 'LastRefreshDate', 'Fecha_Creacion', // Agrega aquí los nombres de las columnas que contienen fechas
            //    'Fecha_Deseada_Cliente', 'FechaDocumento', 'Fecha_Liberacion', // Continúa según sea necesario
            //];

            //fechaColumns.forEach(col => {
            //    const columnIndex = worksheet.getColumn(col).number; // Obtén el índice de la columna
            //    console.log('fechaColumns', columnIndex);
            //    worksheet.getColumn(columnIndex).numFmt = 'dd/mm/yyyy'; // Ajusta el formato según lo que necesites
            //});


            worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
                cell.font = { bold: true, colors: 'FFFFFF' };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3366FF' } };
            });



            for (let col = 1; col <= 8; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } };
                    }
                });
            }

            for (let col = 9; col <= 12; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    }
                });
            }

            for (let col = 13; col <= 15; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC000' } };
                    }
                });
            }

            for (let col = 16; col <= 17; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
                    }
                });
            }

            for (let col = 18; col <= 19; col++) {
                worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                    if (rowNumber !== 1) { // Saltar el encabezado
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A5A5A5' } };
                    }
                });
            }



            workbook.xlsx.writeBuffer().then(data => {
                var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, "Productos_Grabados" + $scope.CurrentDateTime + ".xlsx");
            });
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
                $scope.isTrabajoCilindrosPanelOpen = false;



            }
        } else {
            $scope.isIngenieriaPanelOpen = false;
            $scope.isProductoPanelOpen = false;
            $scope.isPrensaPanelOpen = false;
            $scope.isHerramentalPanelOpen = false;
            $scope.isTrabajoCilindrosPanelOpen = false;

        }


        var id = $stateParams.id;
        $scope.fechaAuxiliarParaMostrar = {};



        GetTrabajoCilindros();

        //TRAE TODOS LOS MATERIALES
        function GetTrabajoCilindros() {
            var servCallType = APIService.GetTrabajoCilindros();
            servCallType.then(function (u) {
                console.log(u);
                $scope.trabajosCilindros = u.data.filter(function (trabajo) {
                    return trabajo.Estado === 3 && trabajo.Cod_Producto === id;
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

        $scope.toggleTrabajoCilindrosPanel = function () {
            $scope.isTrabajoCilindrosPanelOpen = !$scope.isTrabajoCilindrosPanelOpen;
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

                $scope.impresoraRangos = {
                    '3': 8,
                    '43': 11,
                    '1': 12,
                    '2': 9
                };
                // Inicializar el valor de la impresora seleccionada
                $scope.selectedImpresora = null;

                // Función para obtener el rango de valores basado en la impresora seleccionada
                $scope.getValueOptions = function () {
                    console.log('$scope.$watch 3', $scope.productoData.Impresora);

                    if ($scope.productoData.Impresora) {
                        let maxValue = $scope.impresoraRangos[$scope.productoData.Impresora];
                        return Array.from({ length: maxValue }, (_, i) => i + 1);
                    }
                    return [];
                };

                // Actualiza las opciones de valores cuando se selecciona una impresora
                $scope.updateValueOptions = function () {
                    console.log('$scope.$watch 2');

                    $scope.valueOptions = $scope.getValueOptions();
                };

                // Observar cambios en la impresora seleccionada
                $scope.$watch('productoData.Impresora', function (newValue) {
                    console.log('$scope.$watch', newValue);
                    if (newValue) {
                        $scope.updateValueOptions();
                    }
                });
                
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
                //if ($scope.validarFecha($scope.fechaAuxiliarParaMostrar.Fecha_Liberacion)) {
                //    // La fecha de confección es menor que la fecha de documento
                //    validas.push(false);
                //    // Establece el campo como inválido manualmente
                //    $scope.editAuthorForm.Fecha_Liberacion.$setValidity('customValidacion', false);
                //    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                //    $scope.editAuthorForm.Fecha_Liberacion.$setTouched();
                //    // Opcionalmente, enfoca el campo
                //    document.getElementById('Fecha_Liberacion').focus();
                //} else {
                //    // La validación pasó, establece el campo como válido
                //    $scope.editAuthorForm.Fecha_Liberacion.$setValidity('customValidacion', true);
                //    validas.push(true);

                //}


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


                if ((($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion || $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionLet)) && $scope.productoData?.HabilitaCierreLet) {
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


                if ((($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion || $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaConfeccionIng) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng) && ($scope.productoData?.HabilitaCierreLet && $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng < $scope.fechaAuxiliarParaMostrar.FechaLiberacionLet))) {
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


                //if (($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje || $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba)) {
                //    // La fecha de confección es menor que la fecha de documento
                //    validas.push(false);
                //    // Establece el campo como inválido manualmente
                //    $scope.editAuthorForm.FechaSacaPrueba.$setValidity('customValidacion', false);
                //    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                //    $scope.editAuthorForm.FechaSacaPrueba.$setTouched();
                //    // Opcionalmente, enfoca el campo
                //    document.getElementById('FechaSacaPrueba').focus();
                //} else {
                //    // La validación pasó, establece el campo como válido
                //    $scope.editAuthorForm.FechaSacaPrueba.$setValidity('customValidacion', true);
                //    validas.push(true);

                //}

                //if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPromesaProveedorGrabado || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaPreparacionCilindros || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberacionMontaje || $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaRetiroCilindro) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba)) {
                //    // La fecha de confección es menor que la fecha de documento
                //    validas.push(false);
                //    // Establece el campo como inválido manualmente
                //    $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setValidity('customValidacion', false);
                //    // Marca el campo como tocado para mostrar mensajes de error si es necesario
                //    $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setTouched();
                //    // Opcionalmente, enfoca el campo
                //    document.getElementById('FechaAprobacionSacaPrueba').focus();
                //} else {
                //    // La validación pasó, establece el campo como válido
                //    $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setValidity('customValidacion', true);
                //    validas.push(true);

                //}


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

                if ($scope.productoData.EstadoParaMostrar.IDEstadoProducto === 3 && !$scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng)) {

                    console.log('CERRADO no pasa')
                    $scope.editAuthorForm.FechaLiberacionFinalIng.$setValidity('customValidacion2', false);
                    $scope.editAuthorForm.FechaLiberacionFinalIng.$setTouched();

                    validas.push(false);



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
            console.log('$scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng', $scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng);
            console.log('$scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIn)', $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng));

            if ($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaLiberacionFinalIng)) {
                $scope.productoData.CerradoIng = true; // Activar el toggle
                $scope.editAuthorForm.FechaLiberacionFinalIng.$setValidity('customValidacion2', true);
                $scope.editAuthorForm.FechaLiberacionFinalIng.$setTouched();
            } else {
                $scope.productoData.CerradoIng = false; // Desactivar el toggle
            }
        };

        $scope.actualizarFechas = function () {
            // Validación FechaConfeccionIng vs FechaDocumento
            //if ($scope.validarFecha($scope.fechaAuxiliarParaMostrar.Fecha_Liberacion)) {
            //    $scope.fechaAuxiliarParaMostrar.Fecha_Liberacion = $scope.fechaAuxiliarParaMostrar.FechaDocumento;
            //}
            //else {
            //    $scope.editAuthorForm.Fecha_Liberacion.$setValidity('customValidacion', true);

            //}


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

        $scope.$watchGroup(['fechaAuxiliarParaMostrar.Fecha_Liberacion', 'fechaAuxiliarParaMostrar.FechaConfeccionIng', 'fechaAuxiliarParaMostrar.FechaLiberacionLet', 'fechaAuxiliarParaMostrar.FechaLiberacionFinalIng'], function (newValues, oldValues) {
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

        $scope.AcuerdoDirectoProveedorChange = function () {
            console.log('AcuerdoDirectoProveedorChange');
            if ($scope.productoData.AcuerdoDirectoProveedor === true) {
                console.log('AcuerdoDirectoProveedorChange', true);

                $scope.productoData.OC_Proveedor = '';
            }

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
            console.log('fechaString', fechaString);


            // Obtén la fecha como un objeto Date
            var fecha = new Date(fechaString);

            console.log('fecha', fecha);

            // Compara las fechas
            console.log('comparacion', fecha.getTime() !== fechaComparacion.getTime());
            console.log('fecha 1', fecha.getTime());
            console.log('fecha 2', fechaComparacion.getTime());

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

            //if (($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaSacaPrueba)) {
            //    $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba = $scope.fechaAuxiliarParaMostrar.FechaLiberadoAGrabado;
            //} else {
            //    $scope.editAuthorForm.FechaSacaPrueba.$setValidity('customValidacion', true);

            //}


            //if (($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba < $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba) && $scope.validarFecha($scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba)) {
            //    $scope.fechaAuxiliarParaMostrar.FechaAprobacionSacaPrueba = $scope.fechaAuxiliarParaMostrar.FechaSacaPrueba;
            //} else {
            //    $scope.editAuthorForm.FechaAprobacionSacaPrueba.$setValidity('customValidacion', true);

            //}


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


        $scope.activeTab = 'grafico1'; // Tab activo por defecto
        $scope.activeTab2 = 'grafico1'; // Tab activo por defecto

        //$scope.setActiveTab = function (tab) {
        //    $scope.activeTab = tab;
        //};

        $scope.setActiveTab = function (tab) {
            $scope.activeTab = tab;
            setTimeout(() => {
                $scope.redibujarGrafico(tab);
            }, 100); // Retraso de 100 ms para asegurarte de que el DOM se haya actualizado
        };

        $scope.redibujarGrafico = function (tab) {
            if (tab === 'grafico1') {
                $scope.selectValue1 = 'Todas'
                $('#visitors-line-chart10').empty();
                getDataForDashboardProductosKpiPrePrensaProveedorFunction()
              
               
            } else if (tab === 'grafico2') {
                console.log('grafico 2');
                $scope.selectValue2 = 'Todas'
                $('#visitors-line-chart9').empty();
                getDataForDashboardProductosKpiPrePrensaImpresoraFunction()
               
            } else if (tab === 'grafico3') {
                $scope.selectValue3 = 'Todas'
                $('#visitors-line-chart7').empty();
                getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction()
                

            }
            else if (tab === 'grafico4') {
                $scope.selectValue4 = 'Todas';
                $('#visitors-line-chart6').empty();
                getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction();

            }
            else if (tab === 'grafico5') {
                getDataForDashboardProductosKpiPrePrensaDiasFunction();
            }

            else if (tab === 'grafico6') {
                getDataForDashboardProductosKpiPrePrensaResponsableFunction();
            }




            
        };


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
             xLabelAngle: 45,

             ykeys: ['SLA_SCP', 'SLA_SNP', 'SLA_SND', 'SLA_SNPS'],
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ['SLA SCP', 'SLA SNP', 'SLA SND','SLA SNPS'],
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
                     var sla = data['SLA_' + ykey.split('_')[1]];

                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "SLA: " + sla + "</div>";
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

         console.log('dataForDashboard2', $scope.dataForDashboard2);

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
             xLabelAngle: 45,

             ykeys: ['SLA_SCP', 'SLA_SNP', 'SLA_SND', 'SLA_SNPS'],
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ['SLA_SCP', 'SLA_SNP', 'SLA_SND', 'SLA_SNPS'],
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
                     var sla = data['SLA_' + ykey.split('_')[1]];

                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "SLA: " + sla + "</div>";
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
             xLabelAngle: 45,

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
                     var sla = data['SLA_' + ykey.split('_')[1]];

                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "SLA: " + sla + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Quantity: " + qty + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Worst: " + worst + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Best: " + best + "</div>";
                 });

                 return tooltipContent;
             }
         });

     });



     //-------------------------------------------
     // getDataForDashboardProductosKpiPrePrensaDias
     //-------------------------------------------

     getDataForDashboardProductosKpiPrePrensaDiasFunction();
     function getDataForDashboardProductosKpiPrePrensaDiasFunction(period) {
     var getDataForDashboardProductosKpiPrePrensaDias = APIService.getDataForDashboardProductosKpiPrePrensaDias();
     getDataForDashboardProductosKpiPrePrensaDias.then(function (u) {
         $scope.getDataForDashboardProductosKpiPrePrensaDias = u.data;

         console.log('getDataForDashboardProductosKpiPrePrensaDias', $scope.getDataForDashboardProductosKpiPrePrensaDias);

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period?.split('-');
             console.log('yearMonth b', yearMonth);
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.getDataForDashboardProductosKpiPrePrensaDias.sort(function (a, b) {
             console.log('getDataForDashboardProductosKpiPrePrensaDias a', a.Periodo);
             console.log('getDataForDashboardProductosKpiPrePrensaDias b', b.Periodo);

             return parseDate(a?.Periodo) - parseDate(b?.Periodo);
         });


         // Inicializar objeto de totales
         const totalsKpiPrePrensaDias = {
             QTY_DIAS_EnvioArteET: 0,
             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         $scope.getDataForDashboardProductosKpiPrePrensaDias.forEach(entry => {
             console.log('entry', entry);
             for (let key in totalsKpiPrePrensaDias) {
                 if (entry.hasOwnProperty(key)) {
                     totalsKpiPrePrensaDias[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsKpiPrePrensaDias.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsgeneralprensadias2 = totalsKpiPrePrensaDias;
         console.log('$scope.totalsgeneralprensadias', $scope.totalsgeneralprensadias2);


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
             element: 'visitors-line-chart5',
             data: $scope.getDataForDashboardProductosKpiPrePrensaDias,
             xLabels: "month",
             xkey: 'Periodo',
             xLabelAngle: 45,

             ykeys: ['QTY_DIAS_EnvioArteET'],
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ['QTY_DIAS_EnvioArteET'],
             lineColors: [red],
             pointFillColors: [red],
             lineWidth: '2px',
             pointStrokeColors: [red],
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto'

         });

     });
     }


     //-------------------------------------------
     // getDataForDashboardProductosKpiPrePrensaDLibgrabado
     //-------------------------------------------

        getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction();

        $scope.selectValues4 = ['Sin Asignar', 'Flexo', 'Hueco'];
        $scope.selectValue4 = 'Todas'; // Asegúrate de que coincida exactamente
        var selectedYkeys4 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_SinAsignar', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Flexo', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Hueco'];



        $scope.updateChart4 = function (value) {
            console.log('value', value);
            var ykeysToDisplay4 = [];
            if (value === "Todas") {
                ykeysToDisplay4 = selectedYkeys4;
            } else {
                ykeysToDisplay4 = [`AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_${value.replace(/\s+/g, '')}`];
            }

            $('#visitors-line-chart6').empty();
            getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction(ykeysToDisplay4);

        };

        function getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction(ykeysToDisplay4) {

            console.log('ykeys inside', ykeysToDisplay4);
            if (!ykeysToDisplay4) {

                ykeysToDisplay4 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_SinAsignar', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Flexo', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Hueco'];;



            }

         var getDataForDashboardProductosKpiPrePrensaDLibgrabado = APIService.getDataForDashboardProductosKpiPrePrensaDLibgrabado();
         getDataForDashboardProductosKpiPrePrensaDLibgrabado.then(function (u) {
         $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado = u.data;

         console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabado', $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado);

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period?.split('-');
             console.log('yearMonth b', yearMonth);
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado.sort(function (a, b) {
             console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabado a', a.PERIODO);
             console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabado b', b.PERIODO);

             return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
         });


         // Inicializar objeto de totales
         const totalsKpiPrePrensaDLibgrabado = {
             QTY_LiberadoGrabadoVsRecepcionHerramental_SinAsignar: 0,
             QTY_LiberadoGrabadoVsRecepcionHerramental_Flexo: 0,
             QTY_LiberadoGrabadoVsRecepcionHerramental_Hueco: 0,


             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado.forEach(entry => {
             console.log('entry', entry);
             for (let key in totalsKpiPrePrensaDLibgrabado) {
                 if (entry.hasOwnProperty(key)) {
                     totalsKpiPrePrensaDLibgrabado[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsKpiPrePrensaDLibgrabado.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsKpiPrePrensaDLibgrabado2 = totalsKpiPrePrensaDLibgrabado;
         console.log('$scope.totalsKpiPrePrensaDLibgrabado', $scope.totalsKpiPrePrensaDLibgrabado2);


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
             var colors4 = [red, orange, greenLight];

             if (ykeysToDisplay4[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_SinAsignar' && ykeysToDisplay4.length === 1) {

                 colors4 = [red]

             }

             if (ykeysToDisplay4[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Flexo') {
                 colors4 = [orange]
             }

             if (ykeysToDisplay4[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Hueco') {
                 colors4 = [greenLight]

             }

           

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
             element: 'visitors-line-chart6',
             data: $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado,
             xLabels: "month",
             xkey: 'PERIODO',
             xLabelAngle: 45,

             ykeys: ykeysToDisplay4,
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ykeysToDisplay4.map(key => key.split('_')[3]),
             lineColors: colors4,
             pointFillColors: colors4,
             lineWidth: '2px',
             pointStrokeColors: colors4,
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto',
             hoverCallback: function (index, options, content, row) {
                 console.log('hoverCallback options', options);

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

                     console.log('console   1', data);
                     console.log('console   2', ykey.split('_')[1]);

                     var label = options.labels[i];
                     var avg = data['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];
                     var max = data['MAX_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];
                     var min = data['MIN_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];
                     var qty = data['QTY_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];


                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Avg: " + avg + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

                 });

                 return tooltipContent;
             }

         });

     });
     }



     //-------------------------------------------
     // getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor
     //-------------------------------------------

        getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction();


        $scope.selectValues3 = ['Bosisio', 'Lynch',  'Longo'];
        $scope.selectValue3 = 'Todas'; // Asegúrate de que coincida exactamente
        var selectedYkeys3 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo',
            'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco',
            'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo',
            'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco',
            'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo',
            'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco'];



        $scope.updateChart3 = function (value) {
            console.log('value', value);
            var ykeysToDisplay3 = [];
            if (value === "Todas") {
                ykeysToDisplay3 = selectedYkeys3;
            } else {
                ykeysToDisplay3 = [`AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_${value.replace(/\s+/g, '')}_Flexo`,
                                   `AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_${value.replace(/\s+/g, '')}_Hueco`];
            }

            $('#visitors-line-chart7').empty();
            getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction(ykeysToDisplay3);

        };



        function getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction(ykeysToDisplay3) {

            console.log('ykeys inside', ykeysToDisplay3);
            if (!ykeysToDisplay3) {

                ykeysToDisplay3 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo',
                    'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco',
                    'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo',
                    'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco',
                    'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo',
                    'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco'];



            }

     var getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor = APIService.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor();
     getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor.then(function (u) {
         $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor = u.data;


         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period?.split('-');
             console.log('yearMonth b', yearMonth);
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor.sort(function (a, b) {

             return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
         });


         // Inicializar objeto de totales
         const totalsKpiPrePrensaDLibgrabadoProveedor = {
             QTY_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo: 0,
             QTY_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco: 0,
             QTY_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo: 0,
             QTY_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco: 0,
             QTY_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo: 0,
             QTY_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco: 0,


             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor.forEach(entry => {
             for (let key in totalsKpiPrePrensaDLibgrabadoProveedor) {
                 console.log('key', key);
                 if (entry.hasOwnProperty(key)) {
                     totalsKpiPrePrensaDLibgrabadoProveedor[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsKpiPrePrensaDLibgrabadoProveedor.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsKpiPrePrensaDLibgrabadoProveedor2 = totalsKpiPrePrensaDLibgrabadoProveedor;



         /* Line Chart
         ------------------------- */
         var red = 'red';
         var orange = '#df6c79';
         var greenLight = '#52913f';
         var blue = '#3539a4';
         var blueLight = '#1c9ce9';
         var green = '#8de65d';
         var blackTransparent = 'rgba(0,0,0,0.6)';
         var whiteTransparent = 'rgba(255,255,255,0.4)';
         var month = [];
         var colors3 = [red, orange, blue, blueLight, green, greenLight];

        

         if ((ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo' || ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco') && ykeysToDisplay3.length === 2) {
             console.log('Bosisio', ykeysToDisplay3[0]);

             colors3 = [red, orange];
         }

       

         if (ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo' || ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco') {
             console.log('Lynch', ykeysToDisplay3[0]);

             colors3 = [blue, blueLight]

         }


         if (ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo' || ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco') {
             console.log('Longo', ykeysToDisplay3[0]);

             colors3 = [green, greenLight]

         }

        




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
             element: 'visitors-line-chart7',
             data: $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor,
             xLabels: "month",
             xkey: 'PERIODO',
             xLabelAngle: 45,

             ykeys: ykeysToDisplay3,
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ykeysToDisplay3.map(key => key.split('_')[3]),
             lineColors: colors3,

             pointFillColors: colors3,
             lineWidth: '2px',
             pointStrokeColors: colors3,
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
                     console.log('ykey',ykey);

                     var label = options.labels[i];
                     var avg = data['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_'+ ykey.split('_')[4]];
                     var max = data['MAX_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_' + ykey.split('_')[4]];
                     var min = data['MIN_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_' + ykey.split('_')[4]];
                     var qty = data['QTY_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_' + ykey.split('_')[4]];


                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Avg: " + avg + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

                 });

                 return tooltipContent;
             }

         });

     });

     }

     //-------------------------------------------
     // getDataForDashboardProductosKpiIngenieriaGeneral
     //-------------------------------------------

     getDataForDashboardProductosKpiIngenieriaGeneralFunction();
     function getDataForDashboardProductosKpiIngenieriaGeneralFunction() {
     var getDataForDashboardProductosKpiIngenieriaGeneral = APIService.getDataForDashboardProductosKpiIngenieriaGeneral();
     getDataForDashboardProductosKpiIngenieriaGeneral.then(function (u) {
         $scope.getDataForDashboardProductosKpiIngenieriaGeneral = u.data;

         console.log('getDataForDashboardProductosKpiIngenieriaGeneral', $scope.getDataForDashboardProductosKpiIngenieriaGeneral);

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period?.split('-');
             console.log('yearMonth b', yearMonth);
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.getDataForDashboardProductosKpiIngenieriaGeneral.sort(function (a, b) {
             console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor a', a.PERIODO);
             console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor b', b.PERIODO);

             return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
         });


         // Inicializar objeto de totales
         const totalsKpiIngenieriaGeneral = {
             QTY_DocumentoVSPedido: 0,
             QTY_FechaConfeccionVSLiberacionTec: 0,
             QTY_LiberacionTecVsDocumento: 0,
             QTY_LiberacionFinalVsLiberacionTec: 0,


             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         $scope.getDataForDashboardProductosKpiIngenieriaGeneral.forEach(entry => {
             console.log('entry', entry);
             for (let key in totalsKpiIngenieriaGeneral) {
                 if (entry.hasOwnProperty(key)) {
                     totalsKpiIngenieriaGeneral[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsKpiIngenieriaGeneral.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsKpiIngenieriaGeneral2 = totalsKpiIngenieriaGeneral;
         console.log('$scope.totalsKpiIngenieriaGeneral2', $scope.totalsKpiIngenieriaGeneral2);


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
             element: 'visitors-line-chart8',
             data: $scope.getDataForDashboardProductosKpiIngenieriaGeneral,
             xLabels: "month",
             xkey: 'PERIODO',
             xLabelAngle: 45,

             ykeys: ['AVG_DAYS_DocumentoVSPedido', 'AVG_DAYS_FechaConfeccionVSLiberacionTec', 'AVG_DAYS_LiberacionTecVsDocumento', 'AVG_DAYS_LiberacionFinalVsLiberacionTec'],
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ['AVG_DAYS_DocumentoVSPedido', 'AVG_DAYS_FechaConfeccionVSLiberacionTec', 'AVG_DAYS_LiberacionTecVsDocumento', 'AVG_DAYS_LiberacionFinalVsLiberacionTec'],
             lineColors: [red, orange, greenLight, blue],
             pointFillColors: [red, orange, greenLight, blue],
             lineWidth: '2px',
             pointStrokeColors: [red, orange, greenLight, blue],
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto',
             hoverCallback: function (index, options, content, row) {
                 console.log('hoverCallback options', options);

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

                     console.log('console   1', data);
                     console.log('console  1', ykey);

                     console.log('console   2', ykey.split('_')[2]);
                     console.log('console   2', ykey.split('_')[1]);

                     var label = options.labels[i];
                     var avg = data['AVG_DAYS_' + ykey.split('_')[2]];
                     var max = data['MAX_DAYS_' + ykey.split('_')[2]];
                     var min = data['MIN_DAYS_' + ykey.split('_')[2]];
                     var qty = data['QTY_' + ykey.split('_')[2]];


                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Avg: " + avg + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
                     tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

                 });

                 return tooltipContent;
             }

         });

     });
     }


     //-------------------------------------------
     // getDataForDashboardProductosKpiPrePrensaImpresora
     //-------------------------------------------

        getDataForDashboardProductosKpiPrePrensaImpresoraFunction();

        $scope.selectValues2 = ['Sin Asignar', 'Flexo', 'Hueco'];
        $scope.selectValue2 = 'Todas'; // Asegúrate de que coincida exactamente
        var selectedYkeys2 = ['QTY_SinAsignar',
            'QTY_Flexo',
            'QTY_Hueco'];



        $scope.updateChart2 = function (value) {
            console.log('value', value);
            var ykeysToDisplay2 = [];
            if (value === "Todas") {
                ykeysToDisplay2 = selectedYkeys2;
            } else {
                ykeysToDisplay2 = [`QTY_${value.replace(/\s+/g, '')}`];
            }

            $('#visitors-line-chart9').empty();
            getDataForDashboardProductosKpiPrePrensaImpresoraFunction(ykeysToDisplay2);

        };



        function getDataForDashboardProductosKpiPrePrensaImpresoraFunction(ykeysToDisplay2) {
            console.log('ykeys inside', ykeysToDisplay2);
            if (!ykeysToDisplay2) {

                ykeysToDisplay2 = ['QTY_SinAsignar',
                    'QTY_Flexo',
                    'QTY_Hueco'];



            }
     var getDataForDashboardProductosKpiPrePrensaImpresora = APIService.getDataForDashboardProductosKpiPrePrensaImpresora();
     getDataForDashboardProductosKpiPrePrensaImpresora.then(function (u) {
         $scope.getDataForDashboardProductosKpiPrePrensaImpresora = u.data;

         console.log('getDataForDashboardProductosKpiPrePrensaImpresora', $scope.getDataForDashboardProductosKpiPrePrensaImpresora);

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period?.split('-');
             console.log('yearMonth b', yearMonth);
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.getDataForDashboardProductosKpiPrePrensaImpresora.sort(function (a, b) {
             console.log('getDataForDashboardProductosKpiPrePrensaImpresora a', a.PERIODO);
             console.log('getDataForDashboardProductosKpiPrePrensaImpresora b', b.PERIODO);

             return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
         });


         // Inicializar objeto de totales
         const totalsgeneralprensadiasimpresora = {
             QTY_SinAsignar: 0,
             QTY_Flexo: 0,
             QTY_Hueco: 0,

             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         $scope.getDataForDashboardProductosKpiPrePrensaImpresora.forEach(entry => {
             console.log('entry', entry);
             for (let key in totalsgeneralprensadiasimpresora) {
                 if (entry.hasOwnProperty(key)) {
                     totalsgeneralprensadiasimpresora[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsgeneralprensadiasimpresora.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsgeneralprensadiasimpresora2 = totalsgeneralprensadiasimpresora;
         console.log('$scope.totalsgeneralprensadiasimpresora2', $scope.totalsgeneralprensadiasimpresora2);


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
         var colors2 = [red, orange, greenLight];

         if (ykeysToDisplay2[0] === 'QTY_SinAsignar' && ykeysToDisplay2.length === 1) {

             colors2 = [red]

         }

         if (ykeysToDisplay2[0] === 'QTY_Flexo') {
             colors2 = [orange]
         }

         if (ykeysToDisplay2[0] === 'QTY_Hueco') {
             colors2 = [greenLight]

         }

        
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

         console.log('PARA EL GRAFICO IMPRESORA', $scope.getDataForDashboardProductosKpiPrePrensaImpresora);

         Morris.Line({
             element: 'visitors-line-chart9',
             data: $scope.getDataForDashboardProductosKpiPrePrensaImpresora,
             xLabels: "month",
             xkey: 'PERIODO',
             xLabelAngle: 45,
             ykeys: ykeysToDisplay2,
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 console.log('X',x);

                 return x.toString();
             },
             labels: ykeysToDisplay2.map(key => key.split('_')[1]),
             lineColors: colors2,
             pointFillColors: colors2,
             lineWidth: '2px',
             pointStrokeColors: colors2,
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto'

         });

     });
     }


     //-------------------------------------------
     // getDataForDashboardProductosKpiPrePrensaProveedor
     //-------------------------------------------

        getDataForDashboardProductosKpiPrePrensaProveedorFunction();

       
        $scope.selectValues1 = ['Sin Asignar', 'Bosisio', 'Lynch', 'Longo'];
        $scope.selectValue1 = 'Todas'; // Asegúrate de que coincida exactamente
        var selectedYkeys1 = ['QTY_SinAsignar',
            'QTY_Bosisio',
            'QTY_Lynch',
            'QTY_Longo'];

        

        $scope.updateChart1 = function (value) {
            console.log('value', value);
            var ykeysToDisplay1 = [];
            if (value === "Todas") {
                ykeysToDisplay1 = selectedYkeys1;
            } else {
                ykeysToDisplay1 = [`QTY_${value.replace(/\s+/g, '')}`];
            }

            $('#visitors-line-chart10').empty();
            getDataForDashboardProductosKpiPrePrensaProveedorFunction(ykeysToDisplay1);

        };


        function getDataForDashboardProductosKpiPrePrensaProveedorFunction(ykeysToDisplay1) {


        console.log('ykeys inside', ykeysToDisplay1);
            if (!ykeysToDisplay1) {
                console.log('vacio inside', ykeysToDisplay1);

                ykeysToDisplay1 = ['QTY_SinAsignar',
                    'QTY_Bosisio',
                    'QTY_Lynch',
                    'QTY_Longo'];

                console.log('vacio inside 2', ykeysToDisplay1);


            }
        
        var getDataForDashboardProductosKpiPrePrensaProveedor = APIService.getDataForDashboardProductosKpiPrePrensaProveedor();
        getDataForDashboardProductosKpiPrePrensaProveedor.then(function (u) {
         $scope.getDataForDashboardProductosKpiPrePrensaProveedor = u.data;

         console.log('getDataForDashboardProductosKpiPrePrensaProveedor', $scope.getDataForDashboardProductosKpiPrePrensaProveedor);

         // Función para convertir el período a un objeto Date
         function parseDate(period) {
             var yearMonth = period?.split('-');
             console.log('yearMonth b', yearMonth);
             var year = parseInt(yearMonth[0], 10);
             var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
             return new Date(year, month);
         }

         // Ordenar los datos por período
         $scope.getDataForDashboardProductosKpiPrePrensaProveedor.sort(function (a, b) {
             console.log('getDataForDashboardProductosKpiPrePrensaProveedor a', a.PERIODO);
             console.log('getDataForDashboardProductosKpiPrePrensaProveedor b', b.PERIODO);

             return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
         });


         // Inicializar objeto de totales
         const totalsgeneralprensadiasproveedor = {
             QTY_SinAsignar: 0,
             QTY_Bosisio: 0,
             QTY_Lynch: 0,
             QTY_Longo: 0,

             totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



         };

         $scope.getDataForDashboardProductosKpiPrePrensaProveedor.forEach(entry => {
             console.log('entry', entry);
             for (let key in totalsgeneralprensadiasproveedor) {
                 if (entry.hasOwnProperty(key)) {
                     totalsgeneralprensadiasproveedor[key] += entry[key];

                     // Sumar las cantidades específicas
                     if (key.startsWith('QTY_')) {
                         totalsgeneralprensadiasproveedor.totalQTY += entry[key];
                     }
                 }
             }
         });

         $scope.totalsgeneralprensadiasproveedor2 = totalsgeneralprensadiasproveedor;
         console.log('$scope.totalsgeneralprensadiasproveedor2', $scope.totalsgeneralprensadiasproveedor2);


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
            var colors1 = [red, orange, greenLight, blue];
           
            if (ykeysToDisplay1[0] === 'QTY_SinAsignar' && ykeysToDisplay1.length === 1) {

                colors1 = [red]

            }

            if (ykeysToDisplay1[0] === 'QTY_Bosisio') {
                colors1 = [orange]
            }

            if (ykeysToDisplay1[0] === 'QTY_Lynch') {
                colors1 = [greenLight]

            }

            if (ykeysToDisplay1[0] === 'QTY_Longo') {
                colors1 = [blue]

            }

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

            console.log('PARA EL GRAFICO', $scope.getDataForDashboardProductosKpiPrePrensaProveedor);

         Morris.Line({
             element: 'visitors-line-chart10',
             data: $scope.getDataForDashboardProductosKpiPrePrensaProveedor,
             xLabels: "month",
             xkey: 'PERIODO',
             xLabelAngle: 45,

             ykeys: ykeysToDisplay1,
             xLabelFormat: function (x) {
                 x = month[x.getMonth()];

                 return x.toString();
             },
             labels: ykeysToDisplay1.map(key => key.split('_')[1]),
             lineColors: colors1,
             pointFillColors: colors1,
             lineWidth: '2px',
             pointStrokeColors: colors1,
             resize: true,
             gridTextFamily: 'Open Sans',
             gridTextColor: whiteTransparent,
             gridTextWeight: 'normal',
             gridTextSize: '11px',
             gridLineColor: 'rgba(0,0,0,0.5)',
             hideHover: 'auto',
             

         });

     });
        }



        //-------------------------------------------
        // getDataForDashboardProductosKpiPrePrensaResponsable
        //-------------------------------------------

       getDataForDashboardProductosKpiPrePrensaResponsableFunction();


        $scope.selectValues5 = [
            { key: 'RICARDO BOSISIO', value: '10' },
            { key: 'AGUSTIN DE JONGE', value: '17' },
            { key: 'ARIEL PROZAPAS', value: '18' }
        ];
        $scope.selectValue5 = 'Todas'; // Usar solo el valor
        var selectedYkeys5 = [
            'SLA_DAYS_10',
            'SLA_DAYS_17',
            'SLA_DAYS_18'
        ];


        $scope.updateChart5 = function (value) {
            console.log('value', value);
            var ykeysToDisplay5 = [];
            if (value === "Todas") {
                ykeysToDisplay5 = selectedYkeys5;
            } else {
                ykeysToDisplay5 = [`SLA_DAYS_${value.replace(/\s+/g, '')}`];
            }

            $('#visitors-line-chart11').empty();
            getDataForDashboardProductosKpiPrePrensaResponsableFunction(ykeysToDisplay5);

        };


        function getDataForDashboardProductosKpiPrePrensaResponsableFunction(ykeysToDisplay5) {


            console.log('ykeys inside', ykeysToDisplay5);
            if (!ykeysToDisplay5) {
                console.log('vacio inside', ykeysToDisplay5);

                ykeysToDisplay5 = [
                    'SLA_DAYS_10',
                    'SLA_DAYS_17',
                    'SLA_DAYS_18'];

                console.log('vacio inside 5', ykeysToDisplay5);


            }

            var getDataForDashboardProductosKpiPrePrensaResponsable = APIService.getDataForDashboardProductosKpiPrePrensaResponsable();
            getDataForDashboardProductosKpiPrePrensaResponsable.then(function (u) {
                $scope.getDataForDashboardProductosKpiPrePrensaResponsable = u.data;

                console.log('getDataForDashboardProductosKpiPrePrensaResponsable', $scope.getDataForDashboardProductosKpiPrePrensaResponsable);

                // Función para convertir el período a un objeto Date
                function parseDate(period) {
                    var yearMonth = period?.split('-');
                    console.log('yearMonth b', yearMonth);
                    var year = parseInt(yearMonth[0], 10);
                    var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
                    return new Date(year, month);
                }

                // Ordenar los datos por período
                $scope.getDataForDashboardProductosKpiPrePrensaResponsable.sort(function (a, b) {
                    console.log('getDataForDashboardProductosKpiPrePrensaResponsable a', a.PERIODO);
                    console.log('getDataForDashboardProductosKpiPrePrensaResponsable b', b.PERIODO);

                    return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
                });


                // Inicializar objeto de totales
                const totalsgeneralprensaresponsable = {
                    QTY_10: 0,
                    QTY_17: 0,
                    QTY_18: 0,

                    totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



                };

                $scope.getDataForDashboardProductosKpiPrePrensaResponsable.forEach(entry => {
                    console.log('entry', entry);
                    for (let key in totalsgeneralprensaresponsable) {
                        if (entry.hasOwnProperty(key)) {
                            totalsgeneralprensaresponsable[key] += entry[key];

                            // Sumar las cantidades específicas
                            if (key.startsWith('QTY_')) {
                                totalsgeneralprensaresponsable.totalQTY += entry[key];
                            }
                        }
                    }
                });

                $scope.totalsgeneralprensaresponsable2 = totalsgeneralprensaresponsable;
                console.log('$scope.totalsgeneralprensaresponsable2', $scope.totalsgeneralprensaresponsable2);


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
                var colors5 = [red, orange, greenLight];

                if (ykeysToDisplay5[0] === 'SLA_DAYS_10' && ykeysToDisplay5.length === 1) {

                    colors5 = [red]

                }


                if (ykeysToDisplay5[0] === 'SLA_DAYS_17') {
                    colors5 = [orange]

                }

                if (ykeysToDisplay5[0] === 'SLA_DAYS_18') {
                    colors5 = [greenLight]

                }

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

                console.log('PARA EL GRAFICO', $scope.getDataForDashboardProductosKpiPrePrensaResponsable);

                Morris.Line({
                    element: 'visitors-line-chart11',
                    data: $scope.getDataForDashboardProductosKpiPrePrensaResponsable,
                    xLabels: "month",
                    xkey: 'PERIODO',
                    xLabelAngle: 45,

                    ykeys: ykeysToDisplay5,
                    xLabelFormat: function (x) {
                        x = month[x.getMonth()];

                        return x.toString();
                    },
                    labels: ykeysToDisplay5.map(key => key.split('_')[2]),
                    lineColors: colors5,
                    pointFillColors: colors5,
                    lineWidth: '2px',
                    pointStrokeColors: colors5,
                    resize: true,
                    gridTextFamily: 'Open Sans',
                    gridTextColor: whiteTransparent,
                    gridTextWeight: 'normal',
                    gridTextSize: '11px',
                    gridLineColor: 'rgba(0,0,0,0.5)',
                    hideHover: 'auto',
                    hoverCallback: function (index, options, content, row) {
                        console.log('hoverCallback options', options);

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

                            console.log('console   1', data);
                            console.log('console  1', ykey);

                            console.log('console   2', ykey.split('_')[2]);
                            console.log('console   2', ykey.split('_')[1]);

                            var label = options.labels[i];
                            var avg = data['SLA_DAYS_' + ykey.split('_')[2]];
                            var max = data['MAX_DAYS_' + ykey.split('_')[2]];
                            var min = data['MIN_DAYS_' + ykey.split('_')[2]];
                            var qty = data['QTY_' + ykey.split('_')[2]];


                            tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Sla: " + avg + "</div>";
                            tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
                            tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
                            tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

                        });

                        return tooltipContent;
                    }

                });

            });
        }



        

 });
