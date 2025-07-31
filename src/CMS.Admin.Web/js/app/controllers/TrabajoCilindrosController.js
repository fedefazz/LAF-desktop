'use strict';
angular
    .module('app.controllers')

    .controller('TrabajoCilindrosController', function ($scope, APIService, $window, $cookies, $route, DTOptionsBuilder, DTColumnBuilder, AlertService, $rootScope, $filter, $http, $timeout) {


        $scope.today = function () {
            return new Date(); // Devuelve la fecha de hoy
        };


        //Display message if necessary
        AlertService.ShowAlert($scope);
        GetTrabajoCilindros();

        //TRAE TODOS LOS MATERIALES
        function GetTrabajoCilindros() {
            var servCallType = APIService.GetTrabajoCilindros();
            servCallType.then(function (u) {
                console.log(u);
                $scope.trabajosCilindros = u.data.filter(function (trabajo) {
                    return trabajo.Estado !== 3;
                });

                $scope.trabajosCilindros.forEach(function (trabajo) {
                    trabajo.isFechaDeseadaGreaterThanToday = new Date(trabajo.FechaDeseada) < $scope.today();
                    trabajo.isFechaCompromisoGreaterThanToday =new Date(trabajo.FechaCompromiso) < $scope.today();

                });
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        $scope.estados = [{ id: 1, nombre: 'En Curso' }, { id: 2, nombre: 'Stand By' }, { id: 3, nombre: 'Fin' }, { id: 4, nombre: 'Cancelada' }, { id: 5, nombre: 'Observado' }];
        $scope.getEstadoNombre = function (id) {
            var estado = $scope.estados.find(function (e) {
                return e.id === id;
            });
            return estado ? estado.nombre : '';
        };

        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json')
            .withOption('paging', true)
            .withPaginationType('full_numbers')
            .withDisplayLength(20)
            .withOption('order', [1, 'asc']);


        //datatables render date field
        function renderDate(data, type, full, meta) {
            var html = $filter('date')(data, "d-MMM-yyyy");
            return html;
        }

        //datatables render Array Origenes
        function renderArrayOrigenes(data, type, full, meta) {
            var html = "<ul>";
            angular.forEach(full.PSSOrigenesScrap, function (value, key) {

                html += '<li class="listaTabla">' + value.Descripcion + '</li>';


            });

            html += "</ul>";
            return html;
        }

        //datatables render Array Materiales
        function renderArrayMateriales(data, type, full, meta) {
            var html = "<ul>";
            angular.forEach(full.PSSTiposMaterial, function (value, key) {

                html += '<li class="listaTabla">' + value.Descripcion + '</li>';


            });

            html += "</ul>";
            return html;
        }




        $scope.doSearch = function () {
            $scope.dtInstance.DataTable.search($scope.searchQuery).draw();

        }



        $scope.exportExcel2 = function () {

            $scope.butonVisible = true;
            $scope.successMessage2 = "Preparando Archivo...";



            var servCallType = APIService.getCilindrooParaExcel();

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

        $scope.exportDataWithExceljs2 = function () {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sheet1');




            // Definir columnas
            // Definir columnas
            worksheet.columns = [
                { header: 'Cod Producto', key: 'Cod_Producto' },
                { header: 'Nro Version', key: 'Nro_Version' },
                { header: 'OT Bolsapel', key: 'OT_Bolsapel' },
                { header: 'Envio Habilitado', key: 'EnvioHabilitado' },
                { header: 'Solicitado', key: 'Solicitado' },
                { header: 'Fecha Preparacion', key: 'FechaPreparacion' },
                { header: 'Fecha Envio A Proveedor', key: 'FechaEnvioAProveedor' },
                { header: 'Fecha Deseada', key: 'FechaDeseada' },
                { header: 'Fecha Compromiso', key: 'FechaCompromiso' },
                { header: 'Fecha Real Entrega', key: 'FechaRealEntrega' },
                { header: 'Fecha Reprogramacion', key: 'FechaReprogramacion' },
                { header: 'OrdCompra', key: 'OrdCompra' },
                { header: 'Remito Entrada', key: 'RemitoEntrada' },
                { header: 'Remito Retiro', key: 'RemitoRetiro' },
                { header: 'Recibo', key: 'Recibo' },
                { header: 'Cod Facturacion', key: 'Cod_Facturacion' },
                { header: 'Notas', key: 'Notas' },
                { header: 'OT Proveedor', key: 'OT_Proveedor' },
                { header: 'Estado', key: 'Estado' },
                { header: 'Cant Colores', key: 'CantColores' },
                { header: 'Fotocromista', key: 'Fotocromista' },
                { header: 'Causa', key: 'Causa' },
                { header: 'Anexos', key: 'Anexos' },
                
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



            //for (let col = 1; col <= 8; col++) {
            //    worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            //        if (rowNumber !== 1) { // Saltar el encabezado
            //            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } };
            //        }
            //    });
            //}

            //for (let col = 9; col <= 12; col++) {
            //    worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            //        if (rowNumber !== 1) { // Saltar el encabezado
            //            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            //        }
            //    });
            //}

            //for (let col = 13; col <= 15; col++) {
            //    worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            //        if (rowNumber !== 1) { // Saltar el encabezado
            //            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC000' } };
            //        }
            //    });
            //}

            //for (let col = 16; col <= 17; col++) {
            //    worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            //        if (rowNumber !== 1) { // Saltar el encabezado
            //            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
            //        }
            //    });
            //}

            //for (let col = 18; col <= 19; col++) {
            //    worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            //        if (rowNumber !== 1) { // Saltar el encabezado
            //            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A5A5A5' } };
            //        }
            //    });
            //}



            workbook.xlsx.writeBuffer().then(data => {
                var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, "Trabajo_cilindros" + $scope.CurrentDateTime + ".xlsx");
            });
        };




    })

    .controller('TrabajoCilindroCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder) {








        //var CallAreas = APIService.GetAreas();
        //CallAreas.then(function (u) {
        //    $scope.areas = u.data;
        //    console.log($scope.areas);


        //    AlertService.ShowAlert($scope);
        //}, function (error) {
        //    $window.location.href = "/#/blsp/maquinas/list";
        //});


        //var CallOrigenes = APIService.GetOrigenes();
        //CallOrigenes.then(function (u) {
        //    $scope.origenes = u.data;
        //    console.log("ORIGENES");

        //    console.log($scope.origenes);


        //    AlertService.ShowAlert($scope);
        //}, function (error) {
        //    $window.location.href = "/#/blsp/maquinas/list";
        //});



        $scope.volverAtras = function () {
            $window.history.back();
        };




        var id = $stateParams.id;

        $scope.trabajoCilindroData = {
            filtro: '',
            Nro_Version: '',
            OT_Bolsapel: '',
            Causa: '',
            EnvioHabilitado: false,
            Enviado: false,
            FechaPreparacion: new Date("Tue Jan 01 1900"),
            FechaDeseada: new Date("Tue Jan 01 1900"),
            FechaCompromiso: new Date("Tue Jan 01 1900"),
            FechaRealEntrega: new Date("Tue Jan 01 1900"),
            RemitoRetiro: '',
            RemitoEntrada: '',
            Fotocromista: '',
            Recibo: '',
            Cod_Facturacion: '',
            OT_Proveedor: '',
            Estado: '',
            Notas: '',
            CantColores: '',
            Cod_Producto: '',
            FechaEnvioAProveedor: new Date("Tue Jan 01 1900"),
            Fotocromista: '',
            OrdCompra: '',
            CantColores: 0,
            Solicitado: false,
            FechaReprogramacion: new Date("Tue Jan 01 1900"), 


        };

        $scope.fechaAuxiliarParaMostrar = {
            FechaPreparacion: new Date("Tue Jan 01 1900"),
            FechaDeseada: new Date("Tue Jan 01 1900"),
            FechaCompromiso: new Date("Tue Jan 01 1900"),
            FechaRealEntrega: new Date("Tue Jan 01 1900"),
            FechaEnvioAProveedor: new Date("Tue Jan 01 1900"),
            FechaReprogramacion: new Date("Tue Jan 01 1900"),
        };

        $scope.trabajoCilindrosData = {
            filtro: '',
          };

        $scope.resultados = [];
        $scope.flagResultado = false;
        $scope.flagProductoSeleccionado = false;
        $scope.productoSeleccionado = null;
        $scope.causas = [{ id: 1, nombre: 'Lista de reposicion' }, { id: 2, nombre: 'Reclamo' }, { id: 3, nombre: 'Revision' }];
        $scope.estados = [{ id: 1, nombre: 'En Curso' }, { id: 2, nombre: 'Stand By' }, { id: 3, nombre: 'Fin' }, { id: 4, nombre: 'Cancelada' }, { id: 5, nombre: 'Observado' }];
        $scope.esEdicion = false;
        $scope.tiposImpresora = [{ id: 1, nombre: 'Sin Asignar' }, { id: 2, nombre: 'Flexo' }, { id: 3, nombre: 'Hueco' }];
        $scope.proveedoresDisponibles = [{ id: 1, nombre: 'Sin Asignar' }, { id: 2, nombre: 'Bosisio' }, { id: 3, nombre: 'lynch' }, { id: 4, nombre: 'longo' }];


        $scope.selectCilindro = function (producto) {
            $scope.trabajoCilindrosData.filtro = producto.Cod_Producto;
            $scope.flagProductoSeleccionado = true;
            $scope.$applyAsync(function () {
                $scope.productoSeleccionado = producto;
            });
            $scope.getMaxVersion(producto.Cod_Producto);


            if (!id) {

                var servCall = APIService.GetProductoById(producto.Cod_Producto);
                servCall.then(function (p) {
                    console.log('Produto del trabajo', p);
                    $scope.productoDelTrabajo = p.data;

                    $scope.$applyAsync(function () {
                        $scope.productoSeleccionado.TipoImpresora = $scope.tiposImpresora.find(tipo => tipo.id === p.data.TipoImpresora)?.nombre;
                        $scope.productoSeleccionado.Proveedor = $scope.proveedoresDisponibles.find(tipo => tipo.id === p.data.Proveedor)?.nombre;
                        $scope.productoSeleccionado.Impresora = p.data.impresoras.find(tipo => tipo.IdImpresora === p.data.Impresora)?.NombreImpresora;

                    });





                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            }
            $scope.resultados = [];
        }
        $scope.formDeshabilitado = false;

        $scope.getMaxVersion = function (codProd) {

            var servCallgetMaxVersion = APIService.GetMaxVersion(codProd);
            servCallgetMaxVersion.then(function (u) {
                console.log('servCallgetMaxVersion', u);
                $scope.maxVersion = u.data + 1;

                if (!id) {
                    $scope.trabajoCilindroData.Nro_Version = $scope.maxVersion;
                }
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });




        }

        $scope.dtInstance = {};
        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json');

        if (id) {

            let params = id.split('-');
            $scope.versionParam = params[0];
            $scope.codProductoParam = params[1];
            $scope.esEdicion = true;
            $scope.PageTitle = 'Editar Cilindro';
            $scope.SubmitButton = 'Actualizar Cilindro';
            console.log('$scope.versionParam', $scope.versionParam);
            console.log('$scope.codProductoParam', $scope.codProductoParam);

           

            GetTrabajosCilindrosPorVersion();
            $scope.getMaxVersion($scope.codProductoParam);

            function GetTrabajosCilindrosPorVersion() {
                var servCallType = APIService.GetTrabajosCilindrosPorVersion($scope.versionParam, $scope.codProductoParam);
                servCallType.then(function (u) {
                    console.log('GetTrabajosCilindrosPorVersion', u);
                    $scope.trabajosCilindrosPorVersion = u.data;
                    $scope.trabajoCilindroData = u.data[0];



                    if ($scope.trabajoCilindroData.FechaPreparacion) {
                        $scope.trabajoCilindroData.FechaPreparacion = new Date($scope.trabajoCilindroData.FechaPreparacion);
                    }
                    if ($scope.trabajoCilindroData.FechaDeseada) {
                        $scope.trabajoCilindroData.FechaDeseada = new Date($scope.trabajoCilindroData.FechaDeseada);
                    }
                    if ($scope.trabajoCilindroData.FechaCompromiso) {
                        $scope.trabajoCilindroData.FechaCompromiso = new Date($scope.trabajoCilindroData.FechaCompromiso);
                    }
                    if ($scope.trabajoCilindroData.FechaRealEntrega) {
                        $scope.trabajoCilindroData.FechaRealEntrega = new Date($scope.trabajoCilindroData.FechaRealEntrega);
                    }
                    if ($scope.trabajoCilindroData.FechaEnvioAProveedor) {
                        $scope.trabajoCilindroData.FechaEnvioAProveedor = new Date($scope.trabajoCilindroData.FechaEnvioAProveedor);
                    }

                    if ($scope.trabajoCilindroData.FechaReprogramacion) {
                        $scope.trabajoCilindroData.FechaReprogramacion = new Date($scope.trabajoCilindroData.FechaReprogramacion);
                    }


                    if ($scope.trabajoCilindroData.Estado === 3 || $scope.trabajoCilindroData.Estado === 4) {

                        $scope.formDeshabilitado = true;


                    }
                    var servCall = APIService.GetProductoById(u.data[0].Cod_Producto);
                    servCall.then(function (p) {
                        console.log('Produto del trabajo', p);
                        $scope.productoDelTrabajo = p.data;

                        $scope.selectCilindro(p.data);


                        $scope.$applyAsync(function () {
                            $scope.productoSeleccionado.TipoImpresora = $scope.tiposImpresora.find(tipo => tipo.id === $scope.productoSeleccionado.TipoImpresora)?.nombre;
                            $scope.productoSeleccionado.Proveedor = $scope.proveedoresDisponibles.find(tipo => tipo.id === $scope.productoSeleccionado.Proveedor)?.nombre;

                            $scope.productoSeleccionado.Impresora = p.data.impresoras.find(tipo => tipo.IdImpresora === $scope.trabajoCilindroData.GPProductos.Impresora)?.NombreImpresora;

                        });





                    }, function (error) {
                        $scope.errorMessage = "Oops, something went wrong.";
                    });





                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            };




           







        } else {
            $scope.PageTitle = 'Crear Cilindro';
            $scope.SubmitButton = 'Crear Cilindro';



            function GetTrabajoCilindrosProductos(filter) {
                var servCallType = APIService.GetProductos(filter.toUpperCase());
                servCallType.then(function (u) {
                    console.log('producto', u);

                    console.log('data no filtrada', u.data);


                   var dataFiltrada = u.data.filter(function (trabajo) {
                       return trabajo.Estado === "Cerrado" || trabajo.Estado === "Migrado";
                    });

                    $scope.trabajosCilindros = dataFiltrada;
                    console.log('data filtrada', dataFiltrada);
                   
                    $scope.resultados = dataFiltrada;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            };

            $scope.buscarResultados = function () {
                console.log('buscarResultados', $scope.trabajoCilindrosData);
                console.log('entro buscarResultados', $scope.trabajoCilindrosData);
                $scope.flagProductoSeleccionado = false;


                if ($scope.trabajoCilindrosData.filtro) {
                    GetTrabajoCilindrosProductos($scope.trabajoCilindrosData.filtro); }
                if ($scope.trabajoCilindrosData.filtro.length === 0) {
                    $scope.resultados = []; // Limpiamos los resultados después de la selección

                }






            }


          


            









        }

        
        $scope.processForm = function () {

            if ($scope.trabajoCilindroData.FechaPreparacion) {
                let FechaPreparacion = new Date($scope.trabajoCilindroData.FechaPreparacion);
                $scope.trabajoCilindroData.FechaPreparacion = FechaPreparacion.toISOString().split('T')[0];
            }

            if ($scope.trabajoCilindroData.FechaEnvioAProveedor) {
                let FechaEnvioAProveedor = new Date($scope.trabajoCilindroData.FechaEnvioAProveedor);
                $scope.trabajoCilindroData.FechaEnvioAProveedor = FechaEnvioAProveedor.toISOString().split('T')[0];
            }

            if ($scope.trabajoCilindroData.FechaDeseada) {
                let FechaDeseada = new Date($scope.trabajoCilindroData.FechaDeseada);
                $scope.trabajoCilindroData.FechaDeseada = FechaDeseada.toISOString().split('T')[0];
            }

            if ($scope.trabajoCilindroData.FechaCompromiso) {
                let FechaCompromiso = new Date($scope.trabajoCilindroData.FechaCompromiso);
                $scope.trabajoCilindroData.FechaCompromiso = FechaCompromiso.toISOString().split('T')[0];
            }

            if ($scope.trabajoCilindroData.FechaRealEntrega) {
                let FechaRealEntrega = new Date($scope.trabajoCilindroData.FechaRealEntrega);
                $scope.trabajoCilindroData.FechaRealEntrega = FechaRealEntrega.toISOString().split('T')[0];
            }
            
            if ($scope.trabajoCilindroData.FechaReprogramacion) {
                let FechaReprogramacion = new Date($scope.trabajoCilindroData.FechaReprogramacion);
                $scope.trabajoCilindroData.FechaReprogramacion = FechaReprogramacion.toISOString().split('T')[0];
            }

            var data = $scope.trabajoCilindroData;



            if (!id) {

                data.GetProductos = $scope.productoSeleccionado;
                data.Cod_Producto = $scope.productoSeleccionado.Cod_Producto;

                console.log('data create: ', data);


                var data = $.param(data);
                var servCall = APIService.createTrabajoCilindo(data);
                servCall.then(function (u) {
                    var cilindrorData = u.data;
                    //Set message
                    AlertService.SetAlert("El Trabajo Cilindro fue creado con éxito", "success");
                    $window.location.href = "/#/blsp/trabajocilindros/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });


            }

            if (id) {

                //data.GPProductos = $scope.productoDelTrabajo;


                var data = $.param(data);
                var servCall = APIService.editTrabajoCilindo(id,data);
                servCall.then(function (u) {
                    console.log('put hecho: ', u.data);

                    var cilindrorData = u.data;
                    //Set message
                    AlertService.SetAlert("El Trabajo Cilindro fue editado con éxito", "success");
                    $window.location.href = "/#/blsp/trabajocilindros/list";

                    //$window.location.href = "/#/blsp/trabajocilindros/crud/" + cilindrorData.Nro_Version + "-" + cilindrorData.Cod_Producto;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });


            }

           

        }
        $scope.isFormCompleteFlexo = function () {
            const data = $scope.trabajoCilindroData;
            return data.Causa && data.CantColores && data.FechaRealEntrega && data.RemitoEntrada && data.Recibo &&
                    data.OrdCompra && data.Fotocromista;
            
        };

        $scope.isDateInvalidFlexo = function () {
            const data = $scope.trabajoCilindroData;
            const invalidDate = '1900-01-01';
            const fechaRealEntrega = data.FechaRealEntrega.toISOString().split('T')[0];

            return fechaRealEntrega === invalidDate;
        };

        $scope.isFinDisabledFlexo = function () {
            return !$scope.isFormCompleteFlexo() || $scope.isDateInvalidFlexo();

        };


        $scope.isFormCompleteHueco = function () {
            const data = $scope.trabajoCilindroData;
            return data.OT_Bolsapel && data.Causa && data.EnvioHabilitado !== undefined &&
                data.Enviado !== undefined && data.FechaPreparacion && data.FechaEnvioAProveedor &&
                data.RemitoRetiro && data.FechaDeseada && data.FechaCompromiso &&
                data.FechaRealEntrega && data.RemitoEntrada && data.Anexos && data.Recibo &&
                data.Cod_Facturacion && data.OT_Proveedor;

        };

        $scope.isDateInvalidHueco = function () {
            const data = $scope.trabajoCilindroData;
            const invalidDate = '1900-01-01';
            const fechaRealEntrega = data.FechaRealEntrega.toISOString().split('T')[0];
            const fechaDeseada = data.FechaDeseada.toISOString().split('T')[0];
            const fechaCompromiso = data.FechaCompromiso.toISOString().split('T')[0];
            const fechaEnvioAProveedor = data.FechaEnvioAProveedor.toISOString().split('T')[0];
            const fechaPreparacion = data.FechaPreparacion.toISOString().split('T')[0];

            console.log('Validación fechas Hueco:');
            console.log('FechaRealEntrega:', fechaRealEntrega);
            console.log('FechaDeseada:', fechaDeseada);
            console.log('FechaEnvioAProveedor:', fechaEnvioAProveedor);
            console.log('FechaPreparacion:', fechaPreparacion);
            console.log('fechaCompromiso:', fechaCompromiso);


            return fechaRealEntrega === invalidDate ||
                fechaDeseada === invalidDate ||
                fechaCompromiso === invalidDate ||
                fechaEnvioAProveedor === invalidDate ||
                fechaPreparacion === invalidDate;
        };

        $scope.isFinDisabledHueco = function () {
            console.log('isFinDisabledHueco', $scope.isDateInvalidHueco());
            console.log('!$scope.isFormCompleteHueco()', !$scope.isFormCompleteHueco());

            return !$scope.isFormCompleteHueco() || $scope.isDateInvalidHueco();
        };

        $scope.$watch('trabajoCilindroData', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.isFinDisabledFlexo();
                $scope.isFinDisabledHueco();

            }
        }, true);


        document.addEventListener("DOMContentLoaded", function () {
            var menu = document.getElementById('select_container_19');
            console.log('MENU', menu);
            if (menu) {
                var rect = menu.getBoundingClientRect();
                var spaceBelow = window.innerHeight - rect.bottom; // Espacio libre debajo del menú
                var spaceAbove = rect.top; // Espacio libre arriba del menú

                if (spaceBelow < rect.height && spaceAbove > rect.height) {
                    // Si no hay suficiente espacio hacia abajo y hay espacio suficiente arriba
                    menu.style.top = (rect.top - rect.height) + 'px'; // Mueve el menú hacia arriba
                }
            }
        });
       





            //Gets category by Id for edit fields
            //if (id) {
            //    var servCall = APIService.GetOperadorById(id);
            //    servCall.then(function (u) {
            //        $scope.operadorData = u.data;
            //        delete $scope.operadorData.$id;

            //        console.log($scope.operadorData);


            //        AlertService.ShowAlert($scope);
            //    }, function (error) {
            //        $window.location.href = "/#/blsp/operadores/list";
            //    });



            //    var CallMaquinas = APIService.GetMaquinaByOperador(id);
            //    CallMaquinas.then(function (u) {
            //        $scope.maquinas = u.data;
            //        console.log($scope.maquinas);


            //        AlertService.ShowAlert($scope);
            //    }, function (error) {
            //        $window.location.href = "/#/blsp/operadores/list";
            //    });

            //}

            //User update
            //$scope.processForm = function () {

            //    //$scope.clientData.IsEnabled = true;
            //    //$scope.clientData.CompanyId = 2;

            //    var data = $.param($scope.operadorData);
            //    if (id) {
            //        var servCall = APIService.updateOperador(id, data);
            //        servCall.then(function (u) {
            //            //Set and display message
            //            AlertService.SetAlert("El Operario fue actualizado con éxito", "success");
            //            AlertService.ShowAlert($scope);
            //        }, function (error) {
            //            $scope.errorMessage = "Oops, something went wrong.";
            //        });
            //    } else {
            //        var servCall = APIService.createOperador(data);
            //        servCall.then(function (u) {
            //            var operadorData = u.data;
            //            //Set message
            //            AlertService.SetAlert("El Operario fue creado con éxito", "success");
            //            $window.location.href = "/#/blsp/operadores/crud/" + operadorData.IdOperador;
            //        }, function (error) {
            //            $scope.errorMessage = "Oops, something went wrong.";
            //        });
            //    }
            //}

            //Delete User
            //$scope.deleteOperador = function (ev, id) {
            //    //var custName = id;

            //    // Appending dialog to document.body to cover sidenav in docs app
            //    var confirm = $mdDialog.confirm()
            //        .title('Eliminar Operador')
            //        .textContent('Esta seguro de eliminar este Operador?')
            //        .ariaLabel('Delete')
            //        .targetEvent(ev)
            //        .ok('Delete')
            //        .cancel('Cancel');

            //    $mdDialog.show(confirm).then(function () {
            //        //confirmed
            //        var data = $.param({
            //            id: id,
            //        })
            //        var servCall = APIService.deleteOperador(id);
            //        servCall.then(function (u) {
            //            //Set message
            //            AlertService.SetAlert("El Operador ha sido eliminado con exito", "success");
            //            $window.location.href = "/#/blsp/operadores/list";
            //        }, function (error) {
            //            $scope.errorMessage = "Oops, something went wrong.";
            //        })
            //    }, function () {
            //        //cancel
            //    });
            //}

        });
