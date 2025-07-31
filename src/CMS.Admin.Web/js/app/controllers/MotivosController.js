'use strict';

angular
    .module('app.controllers')
    .controller('motivosController', function ($scope, $filter, APIService, DTOptionsBuilder, $timeout) {
        // Obtener productos desde la API
        GetMotivos();

        function GetMotivos() {
            APIService.GetMotivos().then(function (response) {
                $scope.motivos = response.data;
                console.log('$scope.motivos', $scope.motivos);
             }, function (error) {
                $scope.errorMessage = "Oops, algo salió mal.";
            });
        }
        $scope.dtInstance = {};

        $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withLanguageSource('/js/angular-datatables-spanish.json')
            .withOption('paging', true)
            .withPaginationType('full_numbers')
            .withDisplayLength(20)

      
        $scope.doSearch = function () {
            $timeout(function () {
                if ($scope.dtInstance && $scope.dtInstance.DataTable) {
                    $scope.dtInstance.DataTable.search($scope.searchQuery).draw();
                } else {
                    console.error("El DataTable no está disponible o no está inicializado correctamente.");
                }
            }, 0);
        };
    



       

       


        









    }
    )












    .controller('motivosCRUDController', function ($scope, APIService, $window, $cookies, $rootScope, $mdDialog, AlertService, $stateParams, $localStorage, DTOptionsBuilder, DTColumnBuilder, $http) {

        var id = $stateParams.id;
        $scope.modalIsOpen = false;
        $scope.editMode = false;


        $scope.motivoData = {
        Descripcion: '',
        Habilitado: false,
        PorcentajeSimulacionMejora : 0
        };




        $scope.vinculos = [];
        $scope.objetivos = [];
        $scope.fechaAuxiliarParaMostrar = $scope.fechaAuxiliarParaMostrar || {}; // Inicializa el objeto si no existe

        var currentDate = new Date();
        // Crear una nueva instancia para Vigencia_Hasta
        var unMesMas = new Date(currentDate); // Clonamos currentDate
        unMesMas.setMonth(currentDate.getMonth() + 1); // Sumamos un mes a la nueva fecha       



        $scope.objetivoData = {
            Id_Objetivo: null,
            Id_Motivo: '',
            Indicador_Inicio: 0,
            Indicador_Objetivo: 0,
            PSSMotivosScrap: {},
            // Asigna las fechas formateadas
            Vigencia_Desde: currentDate, // '08/03/2025'
            Vigencia_Hasta: unMesMas, // '08/03/2025'
        };

        console.log($scope.objetivoData.Vigencia_Desde); // '2025-03-08'
        console.log($scope.objetivoData.Vigencia_Hasta); // '2025-03-08'

        $scope.vinculosData = {

        Id_MaquinaImpute: '',
        Id_Motivo: '',
        Id_Origen:'',
        Id_Recurso:'',
        Id_TipoMaterial:'',
        PSSMaquinas :{},
        PSSMotivosScrap : {},
        PSSOrigenesScrap : {},
        PSSTiposMaterial : {},
        Metrics_Recursos_Habilitados : {},
        maquinas : [],
        tiposMaterial : [],
        origenes: [],
        recursos : []
           
        };


        $scope.maquinas = [];
        $scope.origenes = [];
        $scope.tiposMaterial = [];
        $scope.recursos = [];

       


        if (id) {

            $scope.editMode = true;
            $scope.PageTitle = 'Editar Motivo';
            $scope.SubmitButton = 'Editar Motivo';

            getMotivoById(id);

            //TRAE TODOS LOS MATERIALES
            function getMotivoById(id) {
                var servCallType = APIService.getMotivoById(id);
                servCallType.then(function (u) {
                    console.log('motivo data', u);
                    $scope.motivoData = u.data[0];

                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });
            };


            //VINCULOS
            //Traer vinculo con ID de motivo


            getVinculoById(id);

          

            getObjetivoById(id);




            //OBJETIVOS

        }

        if (!id) {

            $scope.PageTitle = 'Crear Motivo';
            $scope.SubmitButton = 'Crear Motivo';

            
        }

        $scope.processForm = function () {

            var data = $scope.motivoData;


           


            if (!id) {



                

                var data = $.param(data);
                var servCall = APIService.createMotivo(data);
                servCall.then(function (u) {
                    var motivoData = u.data;
                    //Set message
                    //AlertService.SetAlert("El Motivo fue creado con éxito", "success");
                    $window.location.href = "/#/blsp/motivos/list";
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });


            }

            if (id) {



                var data = $.param(data);
                var servCall = APIService.editMotivo(id, data);
                servCall.then(function (u) {
                    console.log('put hecho: ', u.data);

                    var cilindrorData = u.data;
                    //Set message
                    //AlertService.SetAlert("El Motivo fue editado con éxito", "success");
                    $window.location.href = "/#/blsp/motivos/list";

                    //$window.location.href = "/#/blsp/trabajocilindros/crud/" + cilindrorData.Nro_Version + "-" + cilindrorData.Cod_Producto;
                }, function (error) {
                    $scope.errorMessage = "Oops, something went wrong.";
                });



               


            }



        }
        $scope.createVinculoAction = function () {

            $scope.modalIsOpen = true;


           
        }

        $scope.closeModal = function () {

            $scope.modalIsOpen = false;



        }

        


        $scope.createVinculoSubmit = function () {



            


            $scope.vinculosData.Id_Motivo = parseInt(id, 10); // El 10 es la base decimal.

                var maquina = $scope.maquinas.find(function (item) {
                    return item.IDMaq === $scope.vinculosData.Id_MaquinaImpute;  // Suponiendo que 'Id' es la propiedad para buscar
                });
                $scope.vinculosData.PSSMaquinas = maquina || {};  // Asigna el objeto encontrado o un objeto vacío si no se encuentra
            

            var origen = $scope.origenes.find(function (item) {
                    return item.IDOrigen === $scope.vinculosData.Id_Origen;  // Buscar por 'Id' en el array de origenes
                });
                $scope.vinculosData.PSSOrigenesScrap = origen || {};  // Asigna el objeto encontrado o un objeto vacío si no se encuentra
            

            var tipoMaterial = $scope.tiposMaterial.find(function (item) {
                    return item.IDTipoMat === $scope.vinculosData.Id_TipoMaterial;  // Buscar por 'Id' en el array de tipos de material
                });
                $scope.vinculosData.PSSTiposMaterial = tipoMaterial || {};  // Asigna el objeto encontrado o un objeto vacío si no se encuentra

            var recurso = $scope.recursos.find(function (item) {
                return item.Id === $scope.vinculosData.Id_Recurso;  // Buscar por 'Id' en el array de tipos de material
                });
                $scope.vinculosData.Metrics_Recursos_Habilitados = recurso || {};  // Asigna el objeto encontrado o un objeto vacío si no se encuentra

            console.log('$scope.vinculosData: ', $scope.vinculosData);

            const existeVinculo = $scope.vinculos.some(function (existingVinculo) {
                return existingVinculo.Id_Motivo === $scope.vinculosData.Id_Motivo &&
                    existingVinculo.Id_MaquinaImpute === $scope.vinculosData.Id_MaquinaImpute &&
                    existingVinculo.Id_Origen === $scope.vinculosData.Id_Origen &&
                    existingVinculo.Id_TipoMaterial === $scope.vinculosData.Id_TipoMaterial &&
                    existingVinculo.Id_Recurso === $scope.vinculosData.Id_Recurso  // Excluir el vínculo que estamos editando
            });
            console.log('existingVinculo: ', existeVinculo);

            if (existeVinculo) {
                console.log('Error: Ya existe un vínculo con esta combinación de datos.');
                // Mostrar un mensaje de error al usuario
                alert("Ya existe un vínculo con esta combinación de datos.");
                return
            }




            var data = $scope.vinculosData;
            console.log('newVinculoData', data);

            var data = $.param(data);
            var servCall = APIService.createVinculo(data);
            servCall.then(function (u) {
                getVinculoById(id);
                $scope.vinculosData = null;
                $scope.modalIsOpen = false;
                $scope.resetForm();
                //Set message
                //AlertService.SetAlert("El Vinculo fue creado con éxito", "success");
                //$window.location.href = "/#/blsp/motivos/list";
            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        }


        $scope.createObjetivoSubmit = function () {
            $scope.objetivoData.Id_Motivo = parseInt(id, 10); // El 10 es la base decimal.

            // Obtener todas las fechas Vigencia_Hasta de los objetivos existentes
            const fechasHasta = $scope.objetivos.map(objetivo => new Date(objetivo.Vigencia_Hasta));

            // Convertir la fecha Vigencia_Desde del nuevo objetivo a un objeto Date
            const fechaDesdeNueva = new Date($scope.objetivoData.Vigencia_Desde);

            // Verificar si la fecha Vigencia_Desde es mayor que alguna fecha Vigencia_Hasta existente
            const fechaInvalida = fechasHasta.some(fechaHasta => fechaDesdeNueva < fechaHasta);

            if (fechaInvalida) {
                alert("La fecha 'Vigencia Desde' no puede ser mayor que alguna fecha 'Vigencia Hasta' de otros objetivos.");
                return;
            }

            console.log('data create antes: ', $scope.objetivoData);

            delete $scope.objetivoData.Id_Objetivo;
            var data = $scope.objetivoData;
            data.Vigencia_Desde = data.Vigencia_Desde.toISOString().split('.')[0];
            data.Vigencia_Hasta = data.Vigencia_Hasta.toISOString().split('.')[0];

            console.log('data create: ', data);

            var data = $.param(data);
            var servCall = APIService.createObjetivo(data);
            servCall.then(function (u) {
                return getObjetivoById(id);
            }).then(function () {
                $scope.resetForm();
                $scope.objetivoData = null;
                $scope.modalIsOpen = false;
                
            }).catch(function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        //TRAE TODOS LOS MATERIALES
        function getVinculoById(id) {
            var servCallType = APIService.getVinculoById(id);
            servCallType.then(function (u) {

                if (u.data && u.data.length > 0) {
                    // Filtrar los vínculos que tienen algún ID nulo o indefinido
                    const filteredVinculos = u.data.filter(function (vinculo) {
                        return vinculo.Id_Motivo && vinculo.Id_MaquinaImpute && vinculo.Id_Origen && vinculo.Id_TipoMaterial && vinculo.Id_Recurso;
                    });

                   
                    $scope.maquinas = u.data[0].maquinas.sort((a, b) => a.Descripcion.localeCompare(b.Descripcion));
                    $scope.origenes = u.data[0].origenes.sort((a, b) => a.Descripcion.localeCompare(b.Descripcion));
                    $scope.tiposMaterial = u.data[0].tiposMaterial.sort((a, b) => a.Descripcion.localeCompare(b.Descripcion));
                    $scope.recursos = u.data[0].recursos.sort((a, b) => a.Descripcion.localeCompare(b.Descripcion));
                    

                    $scope.vinculos = filteredVinculos;
                    console.log('$scope.vinculos', $scope.vinculos);
                }

            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        };

        function getObjetivoById(id) {
            var servCallType = APIService.getObjetivoById(id);

            return servCallType.then(function (u) { // Añadir return aquí
                console.log('$scope.objetivos 1', u.data);

                if (Array.isArray(u.data)) {
                    u.data.forEach(function (objetivo) {
                        // Convertir las fechas a objetos Date
                        if (objetivo.Vigencia_Desde) {
                            objetivo.Vigencia_Desde = new Date(objetivo.Vigencia_Desde);
                        }
                        if (objetivo.Vigencia_Hasta) {
                            objetivo.Vigencia_Hasta = new Date(objetivo.Vigencia_Hasta);
                        }
                    });
                }

                $scope.objetivos = u.data;
                console.log('$scope.objetivos 2', $scope.objetivos);

            }, function (error) {
                $scope.errorMessage = "Oops, something went wrong.";
            });
        }


        $scope.resetForm = function () {
            // Restablecer el formulario a su estado inicial (prístino y no tocado)
            $scope.vinculoForm.$setPristine();
            $scope.vinculoForm.$setUntouched();
           // $scope.objetivoForm.$setPristine();
            //$scope.objetivoForm.$setUntouched();
            // Limpiar los datos del modelo (si los tienes asociados al formulario)
            $scope.vinculoData = {};  // O lo que sea el objeto asociado
            console.log('$scope.objetivoData.Id_Motivo', $scope.objetivoData.Id_Motivo);
            getObjetivoById($scope.objetivoData.Id_Motivo).then(function () {
                // Encontrar la fecha Vigencia_Hasta más alta de los objetivos existentes
                const maxFechaHasta = $scope.objetivos.reduce((max, obj) => {
                    const fechaHasta = new Date(obj.Vigencia_Hasta);
                    return fechaHasta > max ? fechaHasta : max;
                }, new Date(0));

                // Calcular la nueva fecha Vigencia_Desde (un día más)
                const nuevaFechaDesde = new Date(maxFechaHasta);
                nuevaFechaDesde.setDate(nuevaFechaDesde.getDate() + 1);

                // Calcular la nueva fecha Vigencia_Hasta (un mes más)
                const nuevaFechaHasta = new Date(nuevaFechaDesde);
                nuevaFechaHasta.setMonth(nuevaFechaHasta.getMonth() + 1);

                // Asignar estas fechas al formulario
                $scope.objetivoData = {
                    Vigencia_Desde: nuevaFechaDesde,
                    Vigencia_Hasta: nuevaFechaHasta
                };

                // Resetear otros campos del formulario si es necesario
                // $scope.objetivoData.Campo1 = '';
                // $scope.objetivoData.Campo2 = '';
                // etc.
            });
             

        };

        $scope.getMaquina = function (id) {
            return $scope.maquinas.find(function (maquina) {
                return maquina.IDMaq === id;
            });
        };

        $scope.getTipoMaterial = function (id) {
            return $scope.tiposMaterial.find(function (tipoMaterial) {
                return tipoMaterial.IDTipoMat === id;
            });
        };

        $scope.getRecurso = function (id) {
            return $scope.recursos.find(function (recurso) {
                return recurso.Id === id;
            });
        };

        $scope.getOrigen = function (id) {
            return $scope.origenes.find(function (origen) {
                return origen.IDOrigen === id;
            });
        };

        $scope.editVinculo = function (vinculo) {
            // Cambiar el estado de edición
            vinculo.isEditing = true;

            // Guardar los valores actuales para cuando el usuario cancele la edición
            vinculo.originalData = angular.copy(vinculo);
        };


        $scope.editObjetivo = function (objetivo) {
            // Cambiar el estado de edición
            objetivo.isEditing = true;

            // Guardar los valores actuales para cuando el usuario cancele la edición
            console.log('editObjetivo', objetivo)
            objetivo.originalData = angular.copy(objetivo);
            console.log('editObjetivo 2', objetivo)

        };
        //$scope.saveVinculo = function (vinculo) {
        //    // Aquí puedes realizar la lógica para guardar los cambios, como hacer una llamada a la API para actualizar el vinculo
        //    console.log("Vinculo guardado:", vinculo);

        //    // Volver a la vista de solo lectura
        //    vinculo.isEditing = false;

        //    // Si deseas, puedes hacer una llamada a la API para guardar los cambios en la base de datos.
        //    // APIService.saveVinculo(vinculo).then(function(response) {
        //    //    vinculo = response.data; // Actualizar el vinculo con los datos de la respuesta del backend
        //    // });
        //};

        $scope.saveVinculo = function (vinculo) {
            // Validar si ya existe un vínculo con la misma combinación en el array cargado
            const existeVinculo = $scope.vinculos.some(function (existingVinculo) {
                console.log('existingVinculo.originalData ', existingVinculo.originalData);
                console.log('$scope.vinculos: ', $scope.vinculos);

                return existingVinculo?.originalData?.Id_Motivo === vinculo.Id_Motivo &&
                    existingVinculo?.originalData?.Id_MaquinaImpute === vinculo.Id_MaquinaImpute &&
                    existingVinculo?.originalData?.Id_Origen === vinculo.Id_Origen &&
                    existingVinculo?.originalData?.Id_TipoMaterial === vinculo.Id_TipoMaterial &&
                    existingVinculo?.originalData?.Id_Recurso === vinculo.Id_Recurso  // Excluir el vínculo que estamos editando
            });


            if (existeVinculo) {
                console.log('Error: Ya existe un vínculo con esta combinación de datos.');
                // Mostrar un mensaje de error al usuario
                alert("Ya existe un vínculo con esta combinación de datos.");
            } else {
                // Si no existe, proceder con la llamada al backend
                var requestData = {
                    originalData: {
                        Id_Motivo: vinculo.originalData.Id_Motivo,
                        Id_MaquinaImpute: vinculo.originalData.Id_MaquinaImpute,
                        Id_Origen: vinculo.originalData.Id_Origen,
                        Id_TipoMaterial: vinculo.originalData.Id_TipoMaterial,
                        Id_Recurso: vinculo.originalData.Id_Recurso
                    },
                    newData: {
                        Id_Motivo: vinculo.Id_Motivo,
                        Id_MaquinaImpute: vinculo.Id_MaquinaImpute,
                        Id_Origen: vinculo.Id_Origen,
                        Id_TipoMaterial: vinculo.Id_TipoMaterial,
                        Id_Recurso: vinculo.Id_Recurso
                    }
                };

                console.log('requestData: ', requestData);

                $http.put($rootScope.webapiurl + 'api/PSSScraps/updateVinculo/', requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        console.log('Vinculo actualizado con éxito:', response.data);
                        vinculo.isEditing = false;

                    })
                    .catch(function (error) {
                        console.error('Error al actualizar el vínculo:', error);
                    });
            }
        };


        $scope.saveObjetivo = function (objetivo) {

            // Obtener todas las fechas Vigencia_Hasta de los objetivos existentes, excluyendo el objetivo que se está editando
            const fechasHasta = $scope.objetivos
                .filter(obj => obj.Id_Objetivo !== objetivo.Id_Objetivo)
                .map(obj => new Date(obj.Vigencia_Hasta));

            // Convertir la fecha Vigencia_Desde del objetivo editado a un objeto Date
            const fechaDesdeEditada = new Date(objetivo.Vigencia_Desde);

            // Verificar si la fecha Vigencia_Desde es mayor que alguna fecha Vigencia_Hasta existente
            const fechaInvalida = fechasHasta.some(fechaHasta => fechaDesdeEditada < fechaHasta);

            if (fechaInvalida) {
                alert("La fecha 'Vigencia Desde' no puede ser mayor que alguna fecha 'Vigencia Hasta' de otros objetivos.");
                return;
            }

            var requestData = {
                originalData: {
                    Id_Objetivo: objetivo.originalData.Id_Objetivo,
                    Id_Motivo: objetivo.originalData.Id_Motivo,
                    Indicador_Inicio: objetivo.originalData.Indicador_Inicio,
                    Indicador_Objetivo: objetivo.originalData.Indicador_Objetivo,
                    Indice1: objetivo.originalData.Indice1,
                    Indice2: objetivo.originalData.Indice2,
                    Indice3: objetivo.originalData.Indice3,
                    Indice4: objetivo.originalData.Indice4,
                    Indice5: objetivo.originalData.Indice5,
                    Indice6: objetivo.originalData.Indice6,
                    Indice7: objetivo.originalData.Indice7,
                    Indice8: objetivo.originalData.Indice8,
                    Indice9: objetivo.originalData.Indice9,
                    PorcentajeMejora: objetivo.originalData.Indice1,
                    Vigencia_Desde: objetivo.originalData.Vigencia_Desde,
                    Vigencia_Hasta: objetivo.originalData.Vigencia_Hasta,

                    },
                    newData: {
                        Id_Motivo: objetivo.Id_Motivo,
                        Indicador_Inicio: objetivo.Indicador_Inicio,
                        Indicador_Objetivo: objetivo.Indicador_Objetivo,
                        Indice1: objetivo.Indice1,
                        Indice2: objetivo.Indice2,
                        Indice3: objetivo.Indice3,
                        Indice4: objetivo.Indice4,
                        Indice5: objetivo.Indice5,
                        Indice6: objetivo.Indice6,
                        Indice7: objetivo.Indice7,
                        Indice8: objetivo.Indice8,
                        Indice9: objetivo.Indice9,
                        PorcentajeMejora: objetivo.Indice1,
                        Vigencia_Desde: objetivo.Vigencia_Desde,
                        Vigencia_Hasta: objetivo.Vigencia_Hasta,
                    }
                };

                console.log('requestData objetivo: ', requestData);

                $http.put($rootScope.webapiurl + 'api/PSSScraps/updateObjetivo/', requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        console.log('Objetivo actualizado con éxito:', response.data);
                        objetivo.isEditing = false;

                    })
                    .catch(function (error) {
                        console.error('Error al actualizar el vínculo:', error);
                    });
            
        };

        $scope.cancelVinculoEdit = function (vinculo) {
            // Restaurar los datos originales si el usuario cancela la edición
            angular.copy(vinculo.originalData, vinculo);
            vinculo.isEditing = false;
        };

        $scope.cancelObjetivoEdit = function (objetivo) {
            // Restaurar los datos originales si el usuario cancela la edición
            angular.copy(objetivo.originalData, objetivo);
            objetivo.isEditing = false;
        };

        $scope.deleteVinculo = function (vinculo) {
            // Preguntar si realmente quiere eliminar
            if (confirm("¿Estás seguro de que deseas eliminar este vínculo?")) {
                // Marcar el vínculo como eliminado para que se active la animación
                vinculo.deleted = true;

                // Eliminar el vínculo de la vista (frontend) después de la animación
                setTimeout(function () {
                    const index = $scope.vinculos.indexOf(vinculo);
                    if (index !== -1) {
                        $scope.vinculos.splice(index, 1);
                    }


                    // Aquí haces el llamado DELETE a la API
                    const vinculoData = {
                        Id_Motivo: vinculo.Id_Motivo,
                        Id_MaquinaImpute: vinculo.Id_MaquinaImpute,
                        Id_Origen: vinculo.Id_Origen,
                        Id_TipoMaterial: vinculo.Id_TipoMaterial,
                        Id_Recurso: vinculo.Id_Recurso
                    };

                    $http({
                        method: 'DELETE',
                        url: $rootScope.webapiurl + 'api/PSSScraps/deleteVinculo/',
                        data: vinculoData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        console.log("Vinculo eliminado", response);
                    }).catch(function (error) {
                        console.log("Error al eliminar el vínculo", error);
                        alert("No se pudo eliminar el vínculo.");
                    });
                }, 500); // La animación dura 0.5s, luego se elimina realmente
            }
        };

        $scope.deleteObjetivo = function (objetivo) {
            // Preguntar si realmente quiere eliminar
            if (confirm("¿Estás seguro de que deseas eliminar este objetivo?")) {
                // Marcar el vínculo como eliminado para que se active la animación
                objetivo.deleted = true;
                console.log('deleteobjetivos', objetivo);

                // Eliminar el vínculo de la vista (frontend) después de la animación
                setTimeout(function () {
                    const index = $scope.objetivos.indexOf(objetivo);
                    if (index !== -1) {
                        $scope.objetivos.splice(index, 1);
                    }

                    // Aquí haces el llamado DELETE a la API
                    const objetivoData = {
                        Id_Objetivo: objetivo.Id_Objetivo,
                        Id_Motivo: objetivo.Id_Motivo,
                        Indicador_Inicio: objetivo.Indicador_Inicio,
                        Indicador_Objetivo: objetivo.Indicador_Objetivo,
                        Indice1: objetivo.Indice1,
                        Indice2: objetivo.Indice2,
                        Indice3: objetivo.Indice3,
                        Indice4: objetivo.Indice4,
                        Indice5: objetivo.Indice5,
                        Indice6: objetivo.Indice6,
                        Indice7: objetivo.Indice7,
                        Indice8: objetivo.Indice8,
                        Indice9: objetivo.Indice9,
                        PorcentajeMejora: objetivo.Indice1,
                        Vigencia_Desde: objetivo.Vigencia_Desde,
                        Vigencia_Hasta: objetivo.Vigencia_Hasta,
                    };

                    $http({
                        method: 'DELETE',
                        url: $rootScope.webapiurl + 'api/PSSScraps/deleteObjetivo/',
                        data: objetivoData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        console.log("Objetivo eliminado", response);
                    }).catch(function (error) {
                        console.log("Error al eliminar el objetivo", error);
                        alert("No se pudo eliminar el vínculo.");
                    });
                }, 500); // La animación dura 0.5s, luego se elimina realmente
            }
        };

        // Inicializamos la primera pestaña (Vinculos)
        $scope.selectedTab = 1;

       

       



    })


 //   .controller('ProductoDashboardController', function ($scope, APIService, $localStorage, $window, $filter) {


 //       $scope.activeTab = 'grafico1'; // Tab activo por defecto
 //       $scope.activeTab2 = 'grafico1'; // Tab activo por defecto

 //       //$scope.setActiveTab = function (tab) {
 //       //    $scope.activeTab = tab;
 //       //};

 //       $scope.setActiveTab = function (tab) {
 //           $scope.activeTab = tab;
 //           setTimeout(() => {
 //               $scope.redibujarGrafico(tab);
 //           }, 100); // Retraso de 100 ms para asegurarte de que el DOM se haya actualizado
 //       };

 //       $scope.redibujarGrafico = function (tab) {
 //           if (tab === 'grafico1') {
 //               $scope.selectValue1 = 'Todas'
 //               $('#visitors-line-chart10').empty();
 //               getDataForDashboardProductosKpiPrePrensaProveedorFunction()
              
               
 //           } else if (tab === 'grafico2') {
 //               console.log('grafico 2');
 //               $scope.selectValue2 = 'Todas'
 //               $('#visitors-line-chart9').empty();
 //               getDataForDashboardProductosKpiPrePrensaImpresoraFunction()
               
 //           } else if (tab === 'grafico3') {
 //               $scope.selectValue3 = 'Todas'
 //               $('#visitors-line-chart7').empty();
 //               getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction()
                

 //           }
 //           else if (tab === 'grafico4') {
 //               $scope.selectValue4 = 'Todas';
 //               $('#visitors-line-chart6').empty();
 //               getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction();

 //           }
 //           else if (tab === 'grafico5') {
 //               getDataForDashboardProductosKpiPrePrensaDiasFunction();
 //           }

 //           else if (tab === 'grafico6') {
 //               getDataForDashboardProductosKpiPrePrensaResponsableFunction();
 //           }




            
 //       };


 //    var dataForDashboard = APIService.getDataForDashboard();
 //    dataForDashboard.then(function (u) {
 //        $scope.dataForDashboard = u.data;
 //        console.log('data', $scope.dataForDashboard);
 //        // Filtrar los elementos donde TipoImpresora es igual a 2
 //        $scope.dataForDashboard1 = $scope.dataForDashboard.filter(function (item) {
 //            return item.TipoImpresora === 'Hueco';
 //        });

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period.split('-');
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.dataForDashboard1.sort(function (a, b) {
 //            return parseDate(a.PERIODO) - parseDate(b.PERIODO);
 //        });




 //        console.log('$scope.dataForDashboard1', $scope.dataForDashboard1);

 //        // Inicializar objeto de totales
 //        const totals = {
 //            SLA_SNP: 0,
 //            QTY_SNP: 0,
 //            BEST_SNP: 0,
 //            WORST_SNP: 0,
 //            SLA_SND: 0,
 //            QTY_SND: 0,
 //            BEST_SND: 0,
 //            WORST_SND: 0,
 //            SLA_SNPS: 0,
 //            QTY_SNPS: 0,
 //            BEST_SNPS: 0,
 //            WORST_SNPS: 0,
 //            SLA_SCP: 0,
 //            QTY_SCP: 0,
 //            BEST_SCP: 0,
 //            WORST_SCP: 0,
 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades

 //        };

 //        // Iterar sobre los datos para sumar las cantidades
 //        $scope.dataForDashboard1.forEach(entry => {
 //            for (let key in totals) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totals[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totals.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totals = totals;
 //        console.log('$scope.totals1', $scope.totals);


 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        Morris.Line({
 //            element: 'visitors-line-chart2',
 //            data: $scope.dataForDashboard1,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,

 //            ykeys: ['SLA_SCP', 'SLA_SNP', 'SLA_SND', 'SLA_SNPS'],
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ['SLA SCP', 'SLA SNP', 'SLA SND','SLA SNPS'],
 //            lineColors: [red, orange, blueLight, greenLight],
 //            pointFillColors: [red, orange, blueLight, greenLight],
 //            lineWidth: '2px',
 //            pointStrokeColors: [red, orange, blueLight, greenLight],
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto',
 //            hoverCallback: function (index, options, content, row) {
 //                // Obtener los datos del punto
 //                var data = options.data[index];
 //                var period = data.PERIODO; // El período en formato YYYY-MM

 //                // Extraer año y mes del período
 //                var yearMonth = period.split('-');
 //                var year = yearMonth[0];
 //                var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

 //                // Verificar que el índice esté dentro del rango
 //                if (monthIndex < 0 || monthIndex > 11) {
 //                    monthIndex = 0; // Default a Enero si hay un índice fuera del rango
 //                }

 //                // Obtener el nombre del mes
 //                var monthName = month[monthIndex];

 //                // Construir el contenido del tooltip
 //                var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

 //                // Iterar sobre cada línea para mostrar la información de cada punto
 //                options.ykeys.forEach(function (ykey, i) {
 //                    // Mostrar solo la información para el punto de datos actual
                    

 //                    var label = options.labels[i];
 //                    var sla = data[ykey];
 //                    var worst = data['WORST_' + ykey.split('_')[1]];
 //                    var best = data['BEST_' + ykey.split('_')[1]];
 //                    var qty = data['QTY_' + ykey.split('_')[1]];
 //                    var sla = data['SLA_' + ykey.split('_')[1]];

 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "SLA: " + sla + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Quantity: " + qty + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Worst: " + worst + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Best: " + best + "</div>";
 //                });

 //                return tooltipContent;
 //            }
 //        });





 //        // Filtrar los elementos donde TipoImpresora es igual a 2
 //        $scope.dataForDashboard2 = $scope.dataForDashboard.filter(function (item) {
 //            return item.TipoImpresora === 'Flexo';
             
 //        });

 //        console.log('dataForDashboard2', $scope.dataForDashboard2);

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period.split('-');
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.dataForDashboard2.sort(function (a, b) {
 //            return parseDate(a.PERIODO) - parseDate(b.PERIODO);
 //        });

 //        // Inicializar objeto de totales
 //        const totalsflexo = {
 //            SLA_SNP: 0,
 //            QTY_SNP: 0,
 //            BEST_SNP: 0,
 //            WORST_SNP: 0,
 //            SLA_SND: 0,
 //            QTY_SND: 0,
 //            BEST_SND: 0,
 //            WORST_SND: 0,
 //            SLA_SNPS: 0,
 //            QTY_SNPS: 0,
 //            BEST_SNPS: 0,
 //            WORST_SNPS: 0,
 //            SLA_SCP: 0,
 //            QTY_SCP: 0,
 //            BEST_SCP: 0,
 //            WORST_SCP: 0,
 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        // Iterar sobre los datos para sumar las cantidades
 //        $scope.dataForDashboard2.forEach(entry => {
 //            console.log('entry', entry);
 //            for (let key in totalsflexo) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsflexo[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsflexo.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsflexo = totalsflexo;
 //        console.log('$scope.totalsflexo', $scope.totalsflexo);

 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        Morris.Line({
 //            element: 'visitors-line-chart3',
 //            data: $scope.dataForDashboard2,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,

 //            ykeys: ['SLA_SCP', 'SLA_SNP', 'SLA_SND', 'SLA_SNPS'],
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ['SLA_SCP', 'SLA_SNP', 'SLA_SND', 'SLA_SNPS'],
 //            lineColors: [red, orange, blueLight, greenLight],
 //            pointFillColors: [red, orange, blueLight, greenLight],
 //            lineWidth: '2px',
 //            pointStrokeColors: [red, orange, blueLight, greenLight],
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto',
 //            hoverCallback: function (index, options, content, row) {
 //                // Obtener los datos del punto
 //                var data = options.data[index];
 //                var period = data.PERIODO; // El período en formato YYYY-MM

 //                // Extraer año y mes del período
 //                var yearMonth = period.split('-');
 //                var year = yearMonth[0];
 //                var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

 //                // Verificar que el índice esté dentro del rango
 //                if (monthIndex < 0 || monthIndex > 11) {
 //                    monthIndex = 0; // Default a Enero si hay un índice fuera del rango
 //                }

 //                // Obtener el nombre del mes
 //                var monthName = month[monthIndex];

 //                // Construir el contenido del tooltip
 //                var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

 //                // Iterar sobre cada línea para mostrar la información de cada punto
 //                options.ykeys.forEach(function (ykey, i) {
 //                    var label = options.labels[i];
 //                    var sla = data[ykey];
 //                    var worst = data['WORST_' + ykey.split('_')[1]];
 //                    var best = data['BEST_' + ykey.split('_')[1]];
 //                    var qty = data['QTY_' + ykey.split('_')[1]];
 //                    var sla = data['SLA_' + ykey.split('_')[1]];

 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "SLA: " + sla + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Quantity: " + qty + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Worst: " + worst + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Best: " + best + "</div>";
 //                });

 //                return tooltipContent;
 //            }
 //        });



 //    }, function (error) {
 //        $window.location.href = "/#/blsp/maquinas/list";
 //    });



 //    var dataForDashboardtotal = APIService.getDataForDashboard2();
 //    dataForDashboardtotal.then(function (u) {
 //        $scope.dataForDashboardtotal = u.data;

 //        console.log('dataForDashboardtotal2', $scope.dataForDashboardtotal);

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period.split('-');
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.dataForDashboardtotal.sort(function (a, b) {
 //            return parseDate(a.PERIODO) - parseDate(b.PERIODO);
 //        });


 //        // Inicializar objeto de totales
 //        const totalsgeneral = {
 //            QTY_FLEXO: 0,
 //            QTY_HUECO: 0,

 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        // Iterar sobre los datos para sumar las cantidades
 //        $scope.dataForDashboardtotal.forEach(entry => {
 //            console.log('entry', entry);
 //            for (let key in totalsgeneral) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsgeneral[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsgeneral.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsgeneral = totalsgeneral;
 //        console.log('$scope.totalsgeneral', $scope.totalsgeneral);


 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        Morris.Line({
 //            element: 'visitors-line-chart4',
 //            data: $scope.dataForDashboardtotal,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,

 //            ykeys: ['SLA_FLEXO', 'SLA_HUECO'],
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ['SLA FLEXO', 'SLA HUECO'],
 //            lineColors: [red, orange],
 //            pointFillColors: [red, orange],
 //            lineWidth: '2px',
 //            pointStrokeColors: [red, orange],
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto',
 //            hoverCallback: function (index, options, content, row) {
 //                // Obtener los datos del punto
 //                var data = options.data[index];
 //                var period = data.PERIODO; // El período en formato YYYY-MM

 //                // Extraer año y mes del período
 //                var yearMonth = period.split('-');
 //                var year = yearMonth[0];
 //                var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

 //                // Verificar que el índice esté dentro del rango
 //                if (monthIndex < 0 || monthIndex > 11) {
 //                    monthIndex = 0; // Default a Enero si hay un índice fuera del rango
 //                }

 //                // Obtener el nombre del mes
 //                var monthName = month[monthIndex];

 //                // Construir el contenido del tooltip
 //                var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

 //                // Iterar sobre cada línea para mostrar la información de cada punto
 //                options.ykeys.forEach(function (ykey, i) {
 //                    // Mostrar solo la información para el punto de datos actual


 //                    var label = options.labels[i];
 //                    var sla = data[ykey];
 //                    var worst = data['WORST_' + ykey.split('_')[1]];
 //                    var best = data['BEST_' + ykey.split('_')[1]];
 //                    var qty = data['QTY_' + ykey.split('_')[1]];
 //                    var sla = data['SLA_' + ykey.split('_')[1]];

 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "SLA: " + sla + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Quantity: " + qty + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Worst: " + worst + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Best: " + best + "</div>";
 //                });

 //                return tooltipContent;
 //            }
 //        });

 //    });



 //    //-------------------------------------------
 //    // getDataForDashboardProductosKpiPrePrensaDias
 //    //-------------------------------------------

 //    getDataForDashboardProductosKpiPrePrensaDiasFunction();
 //    function getDataForDashboardProductosKpiPrePrensaDiasFunction(period) {
 //    var getDataForDashboardProductosKpiPrePrensaDias = APIService.getDataForDashboardProductosKpiPrePrensaDias();
 //    getDataForDashboardProductosKpiPrePrensaDias.then(function (u) {
 //        $scope.getDataForDashboardProductosKpiPrePrensaDias = u.data;

 //        console.log('getDataForDashboardProductosKpiPrePrensaDias', $scope.getDataForDashboardProductosKpiPrePrensaDias);

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period?.split('-');
 //            console.log('yearMonth b', yearMonth);
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.getDataForDashboardProductosKpiPrePrensaDias.sort(function (a, b) {
 //            console.log('getDataForDashboardProductosKpiPrePrensaDias a', a.Periodo);
 //            console.log('getDataForDashboardProductosKpiPrePrensaDias b', b.Periodo);

 //            return parseDate(a?.Periodo) - parseDate(b?.Periodo);
 //        });


 //        // Inicializar objeto de totales
 //        const totalsKpiPrePrensaDias = {
 //            QTY_DIAS_EnvioArteET: 0,
 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        $scope.getDataForDashboardProductosKpiPrePrensaDias.forEach(entry => {
 //            console.log('entry', entry);
 //            for (let key in totalsKpiPrePrensaDias) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsKpiPrePrensaDias[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsKpiPrePrensaDias.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsgeneralprensadias2 = totalsKpiPrePrensaDias;
 //        console.log('$scope.totalsgeneralprensadias', $scope.totalsgeneralprensadias2);


 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        Morris.Line({
 //            element: 'visitors-line-chart5',
 //            data: $scope.getDataForDashboardProductosKpiPrePrensaDias,
 //            xLabels: "month",
 //            xkey: 'Periodo',
 //            xLabelAngle: 45,

 //            ykeys: ['QTY_DIAS_EnvioArteET'],
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ['QTY_DIAS_EnvioArteET'],
 //            lineColors: [red],
 //            pointFillColors: [red],
 //            lineWidth: '2px',
 //            pointStrokeColors: [red],
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto'

 //        });

 //    });
 //    }


 //    //-------------------------------------------
 //    // getDataForDashboardProductosKpiPrePrensaDLibgrabado
 //    //-------------------------------------------

 //       getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction();

 //       $scope.selectValues4 = ['Sin Asignar', 'Flexo', 'Hueco'];
 //       $scope.selectValue4 = 'Todas'; // Asegúrate de que coincida exactamente
 //       var selectedYkeys4 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_SinAsignar', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Flexo', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Hueco'];



 //       $scope.updateChart4 = function (value) {
 //           console.log('value', value);
 //           var ykeysToDisplay4 = [];
 //           if (value === "Todas") {
 //               ykeysToDisplay4 = selectedYkeys4;
 //           } else {
 //               ykeysToDisplay4 = [`AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_${value.replace(/\s+/g, '')}`];
 //           }

 //           $('#visitors-line-chart6').empty();
 //           getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction(ykeysToDisplay4);

 //       };

 //       function getDataForDashboardProductosKpiPrePrensaDLibgrabadoFunction(ykeysToDisplay4) {

 //           console.log('ykeys inside', ykeysToDisplay4);
 //           if (!ykeysToDisplay4) {

 //               ykeysToDisplay4 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_SinAsignar', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Flexo', 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Hueco'];;



 //           }

 //        var getDataForDashboardProductosKpiPrePrensaDLibgrabado = APIService.getDataForDashboardProductosKpiPrePrensaDLibgrabado();
 //        getDataForDashboardProductosKpiPrePrensaDLibgrabado.then(function (u) {
 //        $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado = u.data;

 //        console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabado', $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado);

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period?.split('-');
 //            console.log('yearMonth b', yearMonth);
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado.sort(function (a, b) {
 //            console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabado a', a.PERIODO);
 //            console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabado b', b.PERIODO);

 //            return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
 //        });


 //        // Inicializar objeto de totales
 //        const totalsKpiPrePrensaDLibgrabado = {
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_SinAsignar: 0,
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Flexo: 0,
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Hueco: 0,


 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado.forEach(entry => {
 //            console.log('entry', entry);
 //            for (let key in totalsKpiPrePrensaDLibgrabado) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsKpiPrePrensaDLibgrabado[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsKpiPrePrensaDLibgrabado.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsKpiPrePrensaDLibgrabado2 = totalsKpiPrePrensaDLibgrabado;
 //        console.log('$scope.totalsKpiPrePrensaDLibgrabado', $scope.totalsKpiPrePrensaDLibgrabado2);


 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //            var month = [];
 //            var colors4 = [red, orange, greenLight];

 //            if (ykeysToDisplay4[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_SinAsignar' && ykeysToDisplay4.length === 1) {

 //                colors4 = [red]

 //            }

 //            if (ykeysToDisplay4[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Flexo') {
 //                colors4 = [orange]
 //            }

 //            if (ykeysToDisplay4[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Hueco') {
 //                colors4 = [greenLight]

 //            }

           

 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        Morris.Line({
 //            element: 'visitors-line-chart6',
 //            data: $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabado,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,

 //            ykeys: ykeysToDisplay4,
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ykeysToDisplay4.map(key => key.split('_')[3]),
 //            lineColors: colors4,
 //            pointFillColors: colors4,
 //            lineWidth: '2px',
 //            pointStrokeColors: colors4,
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto',
 //            hoverCallback: function (index, options, content, row) {
 //                console.log('hoverCallback options', options);

 //                // Obtener los datos del punto
 //                var data = options.data[index];
 //                var period = data.PERIODO; // El período en formato YYYY-MM

 //                // Extraer año y mes del período
 //                var yearMonth = period.split('-');
 //                var year = yearMonth[0];
 //                var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

 //                // Verificar que el índice esté dentro del rango
 //                if (monthIndex < 0 || monthIndex > 11) {
 //                    monthIndex = 0; // Default a Enero si hay un índice fuera del rango
 //                }

 //                // Obtener el nombre del mes
 //                var monthName = month[monthIndex];

 //                // Construir el contenido del tooltip
 //                var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

 //                // Iterar sobre cada línea para mostrar la información de cada punto
 //                options.ykeys.forEach(function (ykey, i) {
 //                    // Mostrar solo la información para el punto de datos actual

 //                    console.log('console   1', data);
 //                    console.log('console   2', ykey.split('_')[1]);

 //                    var label = options.labels[i];
 //                    var avg = data['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];
 //                    var max = data['MAX_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];
 //                    var min = data['MIN_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];
 //                    var qty = data['QTY_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3]];


 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Avg: " + avg + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

 //                });

 //                return tooltipContent;
 //            }

 //        });

 //    });
 //    }



 //    //-------------------------------------------
 //    // getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor
 //    //-------------------------------------------

 //       getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction();


 //       $scope.selectValues3 = ['Bosisio', 'Lynch',  'Longo'];
 //       $scope.selectValue3 = 'Todas'; // Asegúrate de que coincida exactamente
 //       var selectedYkeys3 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo',
 //           'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco',
 //           'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo',
 //           'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco',
 //           'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo',
 //           'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco'];



 //       $scope.updateChart3 = function (value) {
 //           console.log('value', value);
 //           var ykeysToDisplay3 = [];
 //           if (value === "Todas") {
 //               ykeysToDisplay3 = selectedYkeys3;
 //           } else {
 //               ykeysToDisplay3 = [`AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_${value.replace(/\s+/g, '')}_Flexo`,
 //                                  `AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_${value.replace(/\s+/g, '')}_Hueco`];
 //           }

 //           $('#visitors-line-chart7').empty();
 //           getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction(ykeysToDisplay3);

 //       };



 //       function getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedorFunction(ykeysToDisplay3) {

 //           console.log('ykeys inside', ykeysToDisplay3);
 //           if (!ykeysToDisplay3) {

 //               ykeysToDisplay3 = ['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo',
 //                   'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco',
 //                   'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo',
 //                   'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco',
 //                   'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo',
 //                   'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco'];



 //           }

 //    var getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor = APIService.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor();
 //    getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor.then(function (u) {
 //        $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor = u.data;


 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period?.split('-');
 //            console.log('yearMonth b', yearMonth);
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor.sort(function (a, b) {

 //            return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
 //        });


 //        // Inicializar objeto de totales
 //        const totalsKpiPrePrensaDLibgrabadoProveedor = {
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo: 0,
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco: 0,
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo: 0,
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco: 0,
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo: 0,
 //            QTY_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco: 0,


 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor.forEach(entry => {
 //            for (let key in totalsKpiPrePrensaDLibgrabadoProveedor) {
 //                console.log('key', key);
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsKpiPrePrensaDLibgrabadoProveedor[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsKpiPrePrensaDLibgrabadoProveedor.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsKpiPrePrensaDLibgrabadoProveedor2 = totalsKpiPrePrensaDLibgrabadoProveedor;



 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#df6c79';
 //        var greenLight = '#52913f';
 //        var blue = '#3539a4';
 //        var blueLight = '#1c9ce9';
 //        var green = '#8de65d';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //        var colors3 = [red, orange, blue, blueLight, green, greenLight];

        

 //        if ((ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Flexo' || ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Bosisio_Hueco') && ykeysToDisplay3.length === 2) {
 //            console.log('Bosisio', ykeysToDisplay3[0]);

 //            colors3 = [red, orange];
 //        }

       

 //        if (ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Flexo' || ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Lynch_Hueco') {
 //            console.log('Lynch', ykeysToDisplay3[0]);

 //            colors3 = [blue, blueLight]

 //        }


 //        if (ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Flexo' || ykeysToDisplay3[0] === 'AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_Longo_Hueco') {
 //            console.log('Longo', ykeysToDisplay3[0]);

 //            colors3 = [green, greenLight]

 //        }

        




 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        Morris.Line({
 //            element: 'visitors-line-chart7',
 //            data: $scope.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,

 //            ykeys: ykeysToDisplay3,
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ykeysToDisplay3.map(key => key.split('_')[3]),
 //            lineColors: colors3,

 //            pointFillColors: colors3,
 //            lineWidth: '2px',
 //            pointStrokeColors: colors3,
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto',
 //            hoverCallback: function (index, options, content, row) {

 //                // Obtener los datos del punto
 //                var data = options.data[index];
 //                var period = data.PERIODO; // El período en formato YYYY-MM

 //                // Extraer año y mes del período
 //                var yearMonth = period.split('-');
 //                var year = yearMonth[0];
 //                var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

 //                // Verificar que el índice esté dentro del rango
 //                if (monthIndex < 0 || monthIndex > 11) {
 //                    monthIndex = 0; // Default a Enero si hay un índice fuera del rango
 //                }

 //                // Obtener el nombre del mes
 //                var monthName = month[monthIndex];

 //                // Construir el contenido del tooltip
 //                var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

 //                // Iterar sobre cada línea para mostrar la información de cada punto
 //                options.ykeys.forEach(function (ykey, i) {
 //                    // Mostrar solo la información para el punto de datos actual
 //                    console.log('ykey',ykey);

 //                    var label = options.labels[i];
 //                    var avg = data['AVG_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_'+ ykey.split('_')[4]];
 //                    var max = data['MAX_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_' + ykey.split('_')[4]];
 //                    var min = data['MIN_DAYS_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_' + ykey.split('_')[4]];
 //                    var qty = data['QTY_LiberadoGrabadoVsRecepcionHerramental_' + ykey.split('_')[3] + '_' + ykey.split('_')[4]];


 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Avg: " + avg + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

 //                });

 //                return tooltipContent;
 //            }

 //        });

 //    });

 //    }

 //    //-------------------------------------------
 //    // getDataForDashboardProductosKpiIngenieriaGeneral
 //    //-------------------------------------------

 //    getDataForDashboardProductosKpiIngenieriaGeneralFunction();
 //    function getDataForDashboardProductosKpiIngenieriaGeneralFunction() {
 //    var getDataForDashboardProductosKpiIngenieriaGeneral = APIService.getDataForDashboardProductosKpiIngenieriaGeneral();
 //    getDataForDashboardProductosKpiIngenieriaGeneral.then(function (u) {
 //        $scope.getDataForDashboardProductosKpiIngenieriaGeneral = u.data;

 //        console.log('getDataForDashboardProductosKpiIngenieriaGeneral', $scope.getDataForDashboardProductosKpiIngenieriaGeneral);

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period?.split('-');
 //            console.log('yearMonth b', yearMonth);
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.getDataForDashboardProductosKpiIngenieriaGeneral.sort(function (a, b) {
 //            console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor a', a.PERIODO);
 //            console.log('getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor b', b.PERIODO);

 //            return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
 //        });


 //        // Inicializar objeto de totales
 //        const totalsKpiIngenieriaGeneral = {
 //            QTY_DocumentoVSPedido: 0,
 //            QTY_FechaConfeccionVSLiberacionTec: 0,
 //            QTY_LiberacionTecVsDocumento: 0,
 //            QTY_LiberacionFinalVsLiberacionTec: 0,


 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        $scope.getDataForDashboardProductosKpiIngenieriaGeneral.forEach(entry => {
 //            console.log('entry', entry);
 //            for (let key in totalsKpiIngenieriaGeneral) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsKpiIngenieriaGeneral[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsKpiIngenieriaGeneral.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsKpiIngenieriaGeneral2 = totalsKpiIngenieriaGeneral;
 //        console.log('$scope.totalsKpiIngenieriaGeneral2', $scope.totalsKpiIngenieriaGeneral2);


 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        Morris.Line({
 //            element: 'visitors-line-chart8',
 //            data: $scope.getDataForDashboardProductosKpiIngenieriaGeneral,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,

 //            ykeys: ['AVG_DAYS_DocumentoVSPedido', 'AVG_DAYS_FechaConfeccionVSLiberacionTec', 'AVG_DAYS_LiberacionTecVsDocumento', 'AVG_DAYS_LiberacionFinalVsLiberacionTec'],
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ['AVG_DAYS_DocumentoVSPedido', 'AVG_DAYS_FechaConfeccionVSLiberacionTec', 'AVG_DAYS_LiberacionTecVsDocumento', 'AVG_DAYS_LiberacionFinalVsLiberacionTec'],
 //            lineColors: [red, orange, greenLight, blue],
 //            pointFillColors: [red, orange, greenLight, blue],
 //            lineWidth: '2px',
 //            pointStrokeColors: [red, orange, greenLight, blue],
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto',
 //            hoverCallback: function (index, options, content, row) {
 //                console.log('hoverCallback options', options);

 //                // Obtener los datos del punto
 //                var data = options.data[index];
 //                var period = data.PERIODO; // El período en formato YYYY-MM

 //                // Extraer año y mes del período
 //                var yearMonth = period.split('-');
 //                var year = yearMonth[0];
 //                var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

 //                // Verificar que el índice esté dentro del rango
 //                if (monthIndex < 0 || monthIndex > 11) {
 //                    monthIndex = 0; // Default a Enero si hay un índice fuera del rango
 //                }

 //                // Obtener el nombre del mes
 //                var monthName = month[monthIndex];

 //                // Construir el contenido del tooltip
 //                var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

 //                // Iterar sobre cada línea para mostrar la información de cada punto
 //                options.ykeys.forEach(function (ykey, i) {
 //                    // Mostrar solo la información para el punto de datos actual

 //                    console.log('console   1', data);
 //                    console.log('console  1', ykey);

 //                    console.log('console   2', ykey.split('_')[2]);
 //                    console.log('console   2', ykey.split('_')[1]);

 //                    var label = options.labels[i];
 //                    var avg = data['AVG_DAYS_' + ykey.split('_')[2]];
 //                    var max = data['MAX_DAYS_' + ykey.split('_')[2]];
 //                    var min = data['MIN_DAYS_' + ykey.split('_')[2]];
 //                    var qty = data['QTY_' + ykey.split('_')[2]];


 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Avg: " + avg + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
 //                    tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

 //                });

 //                return tooltipContent;
 //            }

 //        });

 //    });
 //    }


 //    //-------------------------------------------
 //    // getDataForDashboardProductosKpiPrePrensaImpresora
 //    //-------------------------------------------

 //       getDataForDashboardProductosKpiPrePrensaImpresoraFunction();

 //       $scope.selectValues2 = ['Sin Asignar', 'Flexo', 'Hueco'];
 //       $scope.selectValue2 = 'Todas'; // Asegúrate de que coincida exactamente
 //       var selectedYkeys2 = ['QTY_SinAsignar',
 //           'QTY_Flexo',
 //           'QTY_Hueco'];



 //       $scope.updateChart2 = function (value) {
 //           console.log('value', value);
 //           var ykeysToDisplay2 = [];
 //           if (value === "Todas") {
 //               ykeysToDisplay2 = selectedYkeys2;
 //           } else {
 //               ykeysToDisplay2 = [`QTY_${value.replace(/\s+/g, '')}`];
 //           }

 //           $('#visitors-line-chart9').empty();
 //           getDataForDashboardProductosKpiPrePrensaImpresoraFunction(ykeysToDisplay2);

 //       };



 //       function getDataForDashboardProductosKpiPrePrensaImpresoraFunction(ykeysToDisplay2) {
 //           console.log('ykeys inside', ykeysToDisplay2);
 //           if (!ykeysToDisplay2) {

 //               ykeysToDisplay2 = ['QTY_SinAsignar',
 //                   'QTY_Flexo',
 //                   'QTY_Hueco'];



 //           }
 //    var getDataForDashboardProductosKpiPrePrensaImpresora = APIService.getDataForDashboardProductosKpiPrePrensaImpresora();
 //    getDataForDashboardProductosKpiPrePrensaImpresora.then(function (u) {
 //        $scope.getDataForDashboardProductosKpiPrePrensaImpresora = u.data;

 //        console.log('getDataForDashboardProductosKpiPrePrensaImpresora', $scope.getDataForDashboardProductosKpiPrePrensaImpresora);

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period?.split('-');
 //            console.log('yearMonth b', yearMonth);
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.getDataForDashboardProductosKpiPrePrensaImpresora.sort(function (a, b) {
 //            console.log('getDataForDashboardProductosKpiPrePrensaImpresora a', a.PERIODO);
 //            console.log('getDataForDashboardProductosKpiPrePrensaImpresora b', b.PERIODO);

 //            return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
 //        });


 //        // Inicializar objeto de totales
 //        const totalsgeneralprensadiasimpresora = {
 //            QTY_SinAsignar: 0,
 //            QTY_Flexo: 0,
 //            QTY_Hueco: 0,

 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        $scope.getDataForDashboardProductosKpiPrePrensaImpresora.forEach(entry => {
 //            console.log('entry', entry);
 //            for (let key in totalsgeneralprensadiasimpresora) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsgeneralprensadiasimpresora[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsgeneralprensadiasimpresora.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsgeneralprensadiasimpresora2 = totalsgeneralprensadiasimpresora;
 //        console.log('$scope.totalsgeneralprensadiasimpresora2', $scope.totalsgeneralprensadiasimpresora2);


 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //        var colors2 = [red, orange, greenLight];

 //        if (ykeysToDisplay2[0] === 'QTY_SinAsignar' && ykeysToDisplay2.length === 1) {

 //            colors2 = [red]

 //        }

 //        if (ykeysToDisplay2[0] === 'QTY_Flexo') {
 //            colors2 = [orange]
 //        }

 //        if (ykeysToDisplay2[0] === 'QTY_Hueco') {
 //            colors2 = [greenLight]

 //        }

        
 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //        month[11] = "Diciembre";

 //        console.log('PARA EL GRAFICO IMPRESORA', $scope.getDataForDashboardProductosKpiPrePrensaImpresora);

 //        Morris.Line({
 //            element: 'visitors-line-chart9',
 //            data: $scope.getDataForDashboardProductosKpiPrePrensaImpresora,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,
 //            ykeys: ykeysToDisplay2,
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                console.log('X',x);

 //                return x.toString();
 //            },
 //            labels: ykeysToDisplay2.map(key => key.split('_')[1]),
 //            lineColors: colors2,
 //            pointFillColors: colors2,
 //            lineWidth: '2px',
 //            pointStrokeColors: colors2,
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto'

 //        });

 //    });
 //    }


 //    //-------------------------------------------
 //    // getDataForDashboardProductosKpiPrePrensaProveedor
 //    //-------------------------------------------

 //       getDataForDashboardProductosKpiPrePrensaProveedorFunction();

       
 //       $scope.selectValues1 = ['Sin Asignar', 'Bosisio', 'Lynch', 'Longo'];
 //       $scope.selectValue1 = 'Todas'; // Asegúrate de que coincida exactamente
 //       var selectedYkeys1 = ['QTY_SinAsignar',
 //           'QTY_Bosisio',
 //           'QTY_Lynch',
 //           'QTY_Longo'];

        

 //       $scope.updateChart1 = function (value) {
 //           console.log('value', value);
 //           var ykeysToDisplay1 = [];
 //           if (value === "Todas") {
 //               ykeysToDisplay1 = selectedYkeys1;
 //           } else {
 //               ykeysToDisplay1 = [`QTY_${value.replace(/\s+/g, '')}`];
 //           }

 //           $('#visitors-line-chart10').empty();
 //           getDataForDashboardProductosKpiPrePrensaProveedorFunction(ykeysToDisplay1);

 //       };


 //       function getDataForDashboardProductosKpiPrePrensaProveedorFunction(ykeysToDisplay1) {


 //       console.log('ykeys inside', ykeysToDisplay1);
 //           if (!ykeysToDisplay1) {
 //               console.log('vacio inside', ykeysToDisplay1);

 //               ykeysToDisplay1 = ['QTY_SinAsignar',
 //                   'QTY_Bosisio',
 //                   'QTY_Lynch',
 //                   'QTY_Longo'];

 //               console.log('vacio inside 2', ykeysToDisplay1);


 //           }
        
 //       var getDataForDashboardProductosKpiPrePrensaProveedor = APIService.getDataForDashboardProductosKpiPrePrensaProveedor();
 //       getDataForDashboardProductosKpiPrePrensaProveedor.then(function (u) {
 //        $scope.getDataForDashboardProductosKpiPrePrensaProveedor = u.data;

 //        console.log('getDataForDashboardProductosKpiPrePrensaProveedor', $scope.getDataForDashboardProductosKpiPrePrensaProveedor);

 //        // Función para convertir el período a un objeto Date
 //        function parseDate(period) {
 //            var yearMonth = period?.split('-');
 //            console.log('yearMonth b', yearMonth);
 //            var year = parseInt(yearMonth[0], 10);
 //            var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //            return new Date(year, month);
 //        }

 //        // Ordenar los datos por período
 //        $scope.getDataForDashboardProductosKpiPrePrensaProveedor.sort(function (a, b) {
 //            console.log('getDataForDashboardProductosKpiPrePrensaProveedor a', a.PERIODO);
 //            console.log('getDataForDashboardProductosKpiPrePrensaProveedor b', b.PERIODO);

 //            return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
 //        });


 //        // Inicializar objeto de totales
 //        const totalsgeneralprensadiasproveedor = {
 //            QTY_SinAsignar: 0,
 //            QTY_Bosisio: 0,
 //            QTY_Lynch: 0,
 //            QTY_Longo: 0,

 //            totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //        };

 //        $scope.getDataForDashboardProductosKpiPrePrensaProveedor.forEach(entry => {
 //            console.log('entry', entry);
 //            for (let key in totalsgeneralprensadiasproveedor) {
 //                if (entry.hasOwnProperty(key)) {
 //                    totalsgeneralprensadiasproveedor[key] += entry[key];

 //                    // Sumar las cantidades específicas
 //                    if (key.startsWith('QTY_')) {
 //                        totalsgeneralprensadiasproveedor.totalQTY += entry[key];
 //                    }
 //                }
 //            }
 //        });

 //        $scope.totalsgeneralprensadiasproveedor2 = totalsgeneralprensadiasproveedor;
 //        console.log('$scope.totalsgeneralprensadiasproveedor2', $scope.totalsgeneralprensadiasproveedor2);


 //        /* Line Chart
 //        ------------------------- */
 //        var red = 'red';
 //        var orange = '#ffcc00';
 //        var greenLight = '#00ACAC';
 //        var blue = '#3273B1';
 //        var blueLight = '#348FE2';
 //        var blackTransparent = 'rgba(0,0,0,0.6)';
 //        var whiteTransparent = 'rgba(255,255,255,0.4)';
 //        var month = [];
 //           var colors1 = [red, orange, greenLight, blue];
           
 //           if (ykeysToDisplay1[0] === 'QTY_SinAsignar' && ykeysToDisplay1.length === 1) {

 //               colors1 = [red]

 //           }

 //           if (ykeysToDisplay1[0] === 'QTY_Bosisio') {
 //               colors1 = [orange]
 //           }

 //           if (ykeysToDisplay1[0] === 'QTY_Lynch') {
 //               colors1 = [greenLight]

 //           }

 //           if (ykeysToDisplay1[0] === 'QTY_Longo') {
 //               colors1 = [blue]

 //           }

 //        month[0] = "Enero";
 //        month[1] = "Febrero";
 //        month[2] = "Marzo";
 //        month[3] = "Abril";
 //        month[4] = "Mayo";
 //        month[5] = "Junio";
 //        month[6] = "Julio";
 //        month[7] = "Agosto";
 //        month[8] = "Septiembre";
 //        month[9] = "Octubre";
 //        month[10] = "Noviembre";
 //           month[11] = "Diciembre";

 //           console.log('PARA EL GRAFICO', $scope.getDataForDashboardProductosKpiPrePrensaProveedor);

 //        Morris.Line({
 //            element: 'visitors-line-chart10',
 //            data: $scope.getDataForDashboardProductosKpiPrePrensaProveedor,
 //            xLabels: "month",
 //            xkey: 'PERIODO',
 //            xLabelAngle: 45,

 //            ykeys: ykeysToDisplay1,
 //            xLabelFormat: function (x) {
 //                x = month[x.getMonth()];

 //                return x.toString();
 //            },
 //            labels: ykeysToDisplay1.map(key => key.split('_')[1]),
 //            lineColors: colors1,
 //            pointFillColors: colors1,
 //            lineWidth: '2px',
 //            pointStrokeColors: colors1,
 //            resize: true,
 //            gridTextFamily: 'Open Sans',
 //            gridTextColor: whiteTransparent,
 //            gridTextWeight: 'normal',
 //            gridTextSize: '11px',
 //            gridLineColor: 'rgba(0,0,0,0.5)',
 //            hideHover: 'auto',
             

 //        });

 //    });
 //       }



 //       //-------------------------------------------
 //       // getDataForDashboardProductosKpiPrePrensaResponsable
 //       //-------------------------------------------

 //      getDataForDashboardProductosKpiPrePrensaResponsableFunction();


 //       $scope.selectValues5 = [
 //           { key: 'RICARDO BOSISIO', value: '10' },
 //           { key: 'AGUSTIN DE JONGE', value: '17' },
 //           { key: 'ARIEL PROZAPAS', value: '18' }
 //       ];
 //       $scope.selectValue5 = 'Todas'; // Usar solo el valor
 //       var selectedYkeys5 = [
 //           'SLA_DAYS_10',
 //           'SLA_DAYS_17',
 //           'SLA_DAYS_18'
 //       ];


 //       $scope.updateChart5 = function (value) {
 //           console.log('value', value);
 //           var ykeysToDisplay5 = [];
 //           if (value === "Todas") {
 //               ykeysToDisplay5 = selectedYkeys5;
 //           } else {
 //               ykeysToDisplay5 = [`SLA_DAYS_${value.replace(/\s+/g, '')}`];
 //           }

 //           $('#visitors-line-chart11').empty();
 //           getDataForDashboardProductosKpiPrePrensaResponsableFunction(ykeysToDisplay5);

 //       };


 //       function getDataForDashboardProductosKpiPrePrensaResponsableFunction(ykeysToDisplay5) {


 //           console.log('ykeys inside', ykeysToDisplay5);
 //           if (!ykeysToDisplay5) {
 //               console.log('vacio inside', ykeysToDisplay5);

 //               ykeysToDisplay5 = [
 //                   'SLA_DAYS_10',
 //                   'SLA_DAYS_17',
 //                   'SLA_DAYS_18'];

 //               console.log('vacio inside 5', ykeysToDisplay5);


 //           }

 //           var getDataForDashboardProductosKpiPrePrensaResponsable = APIService.getDataForDashboardProductosKpiPrePrensaResponsable();
 //           getDataForDashboardProductosKpiPrePrensaResponsable.then(function (u) {
 //               $scope.getDataForDashboardProductosKpiPrePrensaResponsable = u.data;

 //               console.log('getDataForDashboardProductosKpiPrePrensaResponsable', $scope.getDataForDashboardProductosKpiPrePrensaResponsable);

 //               // Función para convertir el período a un objeto Date
 //               function parseDate(period) {
 //                   var yearMonth = period?.split('-');
 //                   console.log('yearMonth b', yearMonth);
 //                   var year = parseInt(yearMonth[0], 10);
 //                   var month = parseInt(yearMonth[1], 10) - 1; // El mes en Date es 0 basado
 //                   return new Date(year, month);
 //               }

 //               // Ordenar los datos por período
 //               $scope.getDataForDashboardProductosKpiPrePrensaResponsable.sort(function (a, b) {
 //                   console.log('getDataForDashboardProductosKpiPrePrensaResponsable a', a.PERIODO);
 //                   console.log('getDataForDashboardProductosKpiPrePrensaResponsable b', b.PERIODO);

 //                   return parseDate(a?.PERIODO) - parseDate(b?.PERIODO);
 //               });


 //               // Inicializar objeto de totales
 //               const totalsgeneralprensaresponsable = {
 //                   QTY_10: 0,
 //                   QTY_17: 0,
 //                   QTY_18: 0,

 //                   totalQTY: 0 // Nueva propiedad para la suma combinada de todas las cantidades



 //               };

 //               $scope.getDataForDashboardProductosKpiPrePrensaResponsable.forEach(entry => {
 //                   console.log('entry', entry);
 //                   for (let key in totalsgeneralprensaresponsable) {
 //                       if (entry.hasOwnProperty(key)) {
 //                           totalsgeneralprensaresponsable[key] += entry[key];

 //                           // Sumar las cantidades específicas
 //                           if (key.startsWith('QTY_')) {
 //                               totalsgeneralprensaresponsable.totalQTY += entry[key];
 //                           }
 //                       }
 //                   }
 //               });

 //               $scope.totalsgeneralprensaresponsable2 = totalsgeneralprensaresponsable;
 //               console.log('$scope.totalsgeneralprensaresponsable2', $scope.totalsgeneralprensaresponsable2);


 //               /* Line Chart
 //               ------------------------- */
 //               var red = 'red';
 //               var orange = '#ffcc00';
 //               var greenLight = '#00ACAC';
 //               var blue = '#3273B1';
 //               var blueLight = '#348FE2';
 //               var blackTransparent = 'rgba(0,0,0,0.6)';
 //               var whiteTransparent = 'rgba(255,255,255,0.4)';
 //               var month = [];
 //               var colors5 = [red, orange, greenLight];

 //               if (ykeysToDisplay5[0] === 'SLA_DAYS_10' && ykeysToDisplay5.length === 1) {

 //                   colors5 = [red]

 //               }


 //               if (ykeysToDisplay5[0] === 'SLA_DAYS_17') {
 //                   colors5 = [orange]

 //               }

 //               if (ykeysToDisplay5[0] === 'SLA_DAYS_18') {
 //                   colors5 = [greenLight]

 //               }

 //               month[0] = "Enero";
 //               month[1] = "Febrero";
 //               month[2] = "Marzo";
 //               month[3] = "Abril";
 //               month[4] = "Mayo";
 //               month[5] = "Junio";
 //               month[6] = "Julio";
 //               month[7] = "Agosto";
 //               month[8] = "Septiembre";
 //               month[9] = "Octubre";
 //               month[10] = "Noviembre";
 //               month[11] = "Diciembre";

 //               console.log('PARA EL GRAFICO', $scope.getDataForDashboardProductosKpiPrePrensaResponsable);

 //               Morris.Line({
 //                   element: 'visitors-line-chart11',
 //                   data: $scope.getDataForDashboardProductosKpiPrePrensaResponsable,
 //                   xLabels: "month",
 //                   xkey: 'PERIODO',
 //                   xLabelAngle: 45,

 //                   ykeys: ykeysToDisplay5,
 //                   xLabelFormat: function (x) {
 //                       x = month[x.getMonth()];

 //                       return x.toString();
 //                   },
 //                   labels: ykeysToDisplay5.map(key => key.split('_')[2]),
 //                   lineColors: colors5,
 //                   pointFillColors: colors5,
 //                   lineWidth: '2px',
 //                   pointStrokeColors: colors5,
 //                   resize: true,
 //                   gridTextFamily: 'Open Sans',
 //                   gridTextColor: whiteTransparent,
 //                   gridTextWeight: 'normal',
 //                   gridTextSize: '11px',
 //                   gridLineColor: 'rgba(0,0,0,0.5)',
 //                   hideHover: 'auto',
 //                   hoverCallback: function (index, options, content, row) {
 //                       console.log('hoverCallback options', options);

 //                       // Obtener los datos del punto
 //                       var data = options.data[index];
 //                       var period = data.PERIODO; // El período en formato YYYY-MM

 //                       // Extraer año y mes del período
 //                       var yearMonth = period.split('-');
 //                       var year = yearMonth[0];
 //                       var monthIndex = parseInt(yearMonth[1], 10) - 1; // El mes está en el rango 1-12, pero los índices de los arrays son 0-11

 //                       // Verificar que el índice esté dentro del rango
 //                       if (monthIndex < 0 || monthIndex > 11) {
 //                           monthIndex = 0; // Default a Enero si hay un índice fuera del rango
 //                       }

 //                       // Obtener el nombre del mes
 //                       var monthName = month[monthIndex];

 //                       // Construir el contenido del tooltip
 //                       var tooltipContent = "<div class='morris-hover-row-label'>" + monthName + " " + year + "</div>";

 //                       // Iterar sobre cada línea para mostrar la información de cada punto
 //                       options.ykeys.forEach(function (ykey, i) {
 //                           // Mostrar solo la información para el punto de datos actual

 //                           console.log('console   1', data);
 //                           console.log('console  1', ykey);

 //                           console.log('console   2', ykey.split('_')[2]);
 //                           console.log('console   2', ykey.split('_')[1]);

 //                           var label = options.labels[i];
 //                           var avg = data['SLA_DAYS_' + ykey.split('_')[2]];
 //                           var max = data['MAX_DAYS_' + ykey.split('_')[2]];
 //                           var min = data['MIN_DAYS_' + ykey.split('_')[2]];
 //                           var qty = data['QTY_' + ykey.split('_')[2]];


 //                           tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Sla: " + avg + "</div>";
 //                           tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Max: " + max + "</div>";
 //                           tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Min: " + min + "</div>";
 //                           tooltipContent += "<div class='morris-hover-point' style='color: " + options.lineColors[i] + "'>" + "Qty: " + qty + "</div>";

 //                       });

 //                       return tooltipContent;
 //                   }

 //               });

 //           });
 //       }



        

 //});
