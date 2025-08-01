﻿angular
    .module('app.services', []);

angular
    .module('app.services')

    .service("APIService", function ($http, $rootScope, $cacheFactory) {

        //GET Requests
        this.getUsers = function () {
            return $http.get($rootScope.webapiurl + "api/Users")
        }
        this.getServices = function () {
            return $http.get($rootScope.webapiurl + "api/Services")
        }

        this.getServiceTypes= function () {
            return $http.get($rootScope.webapiurl + "api/ServiceTypes/GetAllSolr?q=* AND IsDeleted:false AND IsEnabled:true&rows=50&sort=Name asc&no-pace", { cache: false })
        }


        this.GetScrap = function (fechaDesde,fechaHasta) {
            return $http.get($rootScope.webapiurl + "api/PSSScraps?dateDesde=" + fechaDesde + "&dateHasta=" + fechaHasta)
        }


        this.GetMotivos = function () {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/GetMotivos");
        }
        this.GetPeriodos = function () {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/valoresporperiodomensual");
        }


        

        this.getMotivoById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/getMotivoById?id=" + id);
        }



        this.getPeriodoById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/getPeriodoById?id=" + id);
        }
        
        this.getVinculoById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/getVinculoById?id=" + id);
        }

    
        this.getObjetivoById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/getObjetivoById?id=" + id);
        }




        this.createMotivo = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSScraps/createMotivo", data)
        }

        this.postPsscrapValoresPorPeriodoMensual = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSScraps/postPsscrapValoresPorPeriodoMensual", data)
        }
        



        this.createVinculo = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSScraps/createVinculo", data)
        }

        this.createObjetivo = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSScraps/createObjetivo", data)
        }
        


        this.GetPSSScrapServerSide = function () {
            return $http.get($rootScope.webapiurl + "api/GetPSSScrapServerSide")
        }


        this.GetAreas = function () {
            return $http.get($rootScope.webapiurl + "api/PSSAreas")
        }

        this.GetEtiquetas = function () {
            return $http.get($rootScope.webapiurl + "api/PSSEtiquetas")
        }


        this.GetTotalPlanta = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetTotalPlanta")
        }
       
        

        this.GetTotalPlantaCerradas = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetTotalPlantaCerradas")
        }

        this.GetImpresionDetalle = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetImpresionDetalle")
        }

        this.GetLaminacionDetalle = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetLaminacionDetalle")
        }

        this.GetIndicadoresTotalesOp = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetIndicadoresTotalesOp")
        }

        this.GetIndicadoresTotalScrap = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetIndicadoresTotalScrap")
        }

        this.GetTotalLaminacion = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetTotalLaminacion")
        }

        this.GetTotalArea = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetTotalArea")
        }

        this.GetTotalAreaImpresion = function () {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetTotalImpresion")
        }

        this.GetTotalAreas = function (area) {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetTotalAreas?area=" + area)
        }

        this.GetReporte1 = function (op) {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetReportePorOpCerrada?op=" + op)
        }


        this.GetReporte1_1 = function (op) {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetReportePorOpCerradaTotal?op=" + op)
        }



        this.GetReporte2 = function (dateDesde, dateHasta, tipo) {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetReportePorFecha?dateDesde=" + dateDesde + "&dateHasta=" + dateHasta + "&tipo=" + tipo)
        }

        this.scrapExcel = function (dateDesde, dateHasta) {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/scrapExcel?dateDesde=" + dateDesde + "&dateHasta=" + dateHasta)
        }

        this.getProductoParaExcel = function (dateDesde, dateHasta, estado) {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getProductoParaExcel?dateDesde=" + dateDesde + "&dateHasta=" + dateHasta + "&estado=" + estado )
        }

        this.getCilindrooParaExcel = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getCilindrooParaExcel")
        }

        this.getProductoParaExcel2 = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getProductoParaExcel2")
        }

        this.getDataForDashboard = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboard")
        }

        this.getDataForDashboard2 = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboard2")
        }




        this.getDataForDashboardProductosKpiPrePrensaDias = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboardProductosKpiPrePrensaDias")
        }
        this.getDataForDashboardProductosKpiPrePrensaDLibgrabado = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboardProductosKpiPrePrensaDLibgrabado")
        }
        this.getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboardProductosKpiPrePrensaDLibgrabadoProveedor")
        }
        this.getDataForDashboardProductosKpiIngenieriaGeneral = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboardProductosKpiIngenieriaGeneral")
        }

        this.getDataForDashboardProductosKpiPrePrensaImpresora = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboardProductosKpiPrePrensaImpresora")
        }
        this.getDataForDashboardProductosKpiPrePrensaProveedor = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboardProductosKpiPrePrensaProveedor")
        }


        this.getDataForDashboardProductosKpiPrePrensaResponsable = function () {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getDataForDashboardProductosKpiPrePrensaResponsable")
        }

        

        this.GetProductos = function (filter) {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getProductos?filter=" + filter)
        }

        this.GetReporteRomaneo = function (pNroOf, pCodProducto, dateDesde, dateHasta, pTurno, pTipoRomaneo) {
            return $http.get($rootScope.webapiurl + "api/Dashboard/GetReporteRomaneo?pNroOf=" + pNroOf + "&pCodProducto=" + pCodProducto + "&dateDesde=" + dateDesde + "&dateHasta=" + dateHasta + "&pTurno=" + pTurno + "&pTipoRomaneo=" + pTipoRomaneo)
        }



        this.GetMaquinas = function () {
            return $http.get($rootScope.webapiurl + "api/PSSMaquinas")
        }

        this.GetOperadores = function () {
            return $http.get($rootScope.webapiurl + "api/PSSOperadores")
        }

        this.GetTrabajoCilindros = function (filter) {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getTrabajosCilindros?filter=" + filter)
        }

        this.GetTrabajosCilindrosPorVersion = function (version, codProd) {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getTrabajosCilindrosPorVersion?version=" + version + "&codProd=" + codProd )
        }

        this.GetMaxVersion = function (codProd) {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getMaxVersion?codProd=" + codProd)
        }

        

        this.GetOrigenes = function () {
            return $http.get($rootScope.webapiurl + "api/PSSOrigenesScraps")
        }

        this.GetJobTrack = function () {
            return $http.get($rootScope.webapiurl + "api/PSSJobTrack")
        }

        this.GetActividad = function () {
            return $http.get($rootScope.webapiurl + "api/PSSActividades")
        }

        this.GetTipos = function () {
            return $http.get($rootScope.webapiurl + "api/PSSTiposMaterials")
        }

        this.GetMaquinaById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSMaquinas?id=" + id + "&no-pace")
        }

        this.GetEtiquetaById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSEtiquetas?id=" + id + "&no-pace")
        }

        this.GetMaquinaByOperador = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSMaquinas/GetPSSMaquinasPorOperador?id=" + id + "&no-pace")
        }


        this.GetActividadById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSActividades?id=" + id + "&no-pace")
        }


        this.GetScrapById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSScraps?id=" + id + "&no-pace")
        }


        this.GetMotivosScrap = function () {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/GetMotivosScrap")
        }

        this.GetMotivosScrap2 = function () {
            return $http.get($rootScope.webapiurl + "api/PSSScraps/GetMotivosScrap2")
        }

        this.GetProductoPorCodigo = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getProductoPorCodigo?Cod_Producto=" + id)
        }


        this.GetProductoById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSProductos/getProducto?Cod_Producto=" + id)
        }
        

        this.GetOperadorById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSOperadores?id=" + id + "&no-pace")
        }

        this.GetMaterialById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSTiposMaterials?id=" + id + "&no-pace")
        }

        this.GetOrigenById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSOrigenesScraps?id=" + id + "&no-pace")
        }

        this.GetJobTrackById = function (id) {
            return $http.get($rootScope.webapiurl + "api/PSSJobTrack?id=" + id + "&no-pace")
        }
        
        this.GetClientByDni = function (dni) {
            return $http.get($rootScope.webapiurl + "api/Clients/GetClientByDni?dni=" + dni)
        }

        this.GetClientByEmail = function (email) {
            return $http.get($rootScope.webapiurl + "api/Clients/GetClientByEmail?email=" + email)
        }

        this.getLastestServices = function (id) {
            return $http.get($rootScope.webapiurl + "api/Services/GetAllSolr?q=VehicleId:" + id + "&fq=CreationDate:[* TO NOW-1DAY]&fl=CreationDate,ServiceTypeName&rows=5&sort=CreationDate desc&no-pace")
        }

        this.getLastestServicesByClient = function (id) {
            return $http.get($rootScope.webapiurl + "api/Services/GetAllSolr?q=ClientId:" + id + "&fl=CreationDate,ServiceTypeName,Brand,Model,License&rows=5&sort=CreationDate desc")
        }

        this.GetCashRegisterById = function (id) {
            return $http.get($rootScope.webapiurl + "api/CashRegister?id=" + id)
        }

        this.getKeywordsByType = function (type) {
            return $http.get($rootScope.webapiurl + "api/keyword/GetAllSolr?q=Type:" + type + "&sort=Name asc")
        }
        this.getUsersSolr = function () {
            return $http.get($rootScope.webapiurl + "api/Users/GetAllSolr?q=IsDeleted:false&fl=Id,FirstName,LastName&sort=FirstName asc")
        }

        this.GetKeywordById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Keywords?id=" + id + "&no-pace")
        }

        this.getBrands = function (id) {
            return $http.get($rootScope.webapiurl + "api/Keyword/GetAllSolr?q=Type:Brand AND IsEnabled:true&fl=Id,Name&sort=Name asc&rows=50&no-pace")
        }

        this.getConcepts = function (id) {
            return $http.get($rootScope.webapiurl + "api/Keyword/GetAllSolr?q=Type:Concept AND IsEnabled:true&fq=-ParentKeywordId:*&fl=Id,Name&sort=Name asc&no-pace")
        }

        this.getModels = function (brand) {
            return $http.get($rootScope.webapiurl + "api/Keyword/GetAllSolr?q=ParentName:" + brand + " AND IsEnabled:true&fl=Id,Name,Key&sort=Name asc&no-pace")
        }

        this.GetServiceTypeById = function (id) {
            return $http.get($rootScope.webapiurl + "api/ServiceTypes?id=" + id)
        }

        // ------------------------------------- //

        
        this.getPages = function () {
            return $http.get($rootScope.webapiurl + "api/Page")
        }
        this.getNodes = function () {
            return $http.get($rootScope.webapiurl + "api/Node")
        }
        this.getUserById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Users?id=" + id)
        }
        this.getServiceById = function () {
            return $http.get($rootScope.webapiurl + "api/Services?id=" + id)
        }
        this.getProfileInfo = function () {
            return $http.get($rootScope.webapiurl + "api/Account/UserInfo")
        }
        this.getNodeTree = function (clearCache) {
            var url = $rootScope.webapiurl + "api/Node/GetTree?includeContent=true&languageId=1";
            if (clearCache != undefined) {
                if (clearCache === true) {
                    this.ClearCache(url);
                }
            }
            return $http.get(url, { cache: true })
        }
        this.getNodeTreeNoPace = function () {
            var url = $rootScope.webapiurl + "api/Node/GetTree?includeContent=true&languageId=1&no-pace";
            return $http.get(url, { cache: true })
        }
        this.getAssetById = function (id) {
            return $http.get($rootScope.webapiurl + "api/News?id=" + id + "&includeContent=true&includeAuthors=true&includeNodes=true&includeMedia=true&includeGalleries=true")
        }
        this.getAssetByIdSolr = function (id) {
            return $http.get($rootScope.webapiurl + "api/News/GetAllSolr?q=Id:" + id + "&fl=Id,Title_en,Nodes_en,MediaSizesPaths:[json]&no-pace")
        }
        this.getPageById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Page?id=" + id)
        }
        this.getPageByIdSolr = function (id) {
            return $http.get($rootScope.webapiurl + "api/Page/GetAllSolr?q=Id:" + id + "&fl=Id,Title_en,Nodes_en,Media_id,MediaSizesPaths:[json]&no-pace")
        }
        this.getAuthors = function () {
            return $http.get($rootScope.webapiurl + "api/Author/GetAllSolr?q=* AND IsDeleted:false&fl=Id,FirstName,LastName,Email&sort=LastName asc&&rows=200")
        }

        this.getServicesSolr = function (q) {
            return $http.get($rootScope.webapiurl + "api/Services/GetAllSolr?q=*" + q)
        }

        

        this.getAuthorById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Author?id=" + id + '&includeMedia=true')
        }
        
        this.getMedia = function (url) {
            if (url != undefined) {
                return $http.get($rootScope.webapiurl + url);
            } else {
                return $http.get($rootScope.webapiurl + "api/Media/GetAllSolr?q=*&start=0&rows=12&fl=Id,Title,Keywords,FileName,SizesPaths&sort=Id desc&facet.field=Categories_Name&facet.field=Categories_Id&facet=on&facet.mincount=1");
            }
        }
        this.getMediaById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Media?id=" + id + "&includeCategories=true")
        }
        this.getMediaByIdSolr = function (id) {
            return $http.get($rootScope.webapiurl + "api/Media/GetAllSolr?q=Id:" + id + "&fl=Id,Title,Categories_Name,SizesPaths:[json]&no-pace")
        }
        this.getGalleries = function () {
            return $http.get($rootScope.webapiurl + "api/Gallery")
        }
        this.getGalleryById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Gallery?includeMedia=true&id=" + id)
        }
        this.getLayoutIntances = function () {
            return $http.get($rootScope.webapiurl + "api/LayoutInstance")
        }
        this.getNodesCustomLayout = function () {
            return $http.get($rootScope.webapiurl + "api/Node/GetAllSolr?q=HasCustomLayout:true&fl=Title_en,Id,LayoutInstance_Id,LayoutInstance_PublicationDate&sort=Title_en asc&rows=100")
        }
        this.getLayouts = function () {
            return $http.get($rootScope.webapiurl + "api/Layout")
        }
        this.getLayoutById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Layout?id=" + id)
        }
        this.getLayoutIntancesSolr = function () {
            return $http.get($rootScope.webapiurl + "api/LayoutInstance/GetAllSolr?q=*:*&wt=json&rows=100&group=true&group.field=NodeId&group.main=true&group.sort=CreationDate%20desc&sort=Node_en%20asc")
        }
        this.getLayoutIntanceById = function (id) {
            return $http.get($rootScope.webapiurl + "api/LayoutInstance?id=" + id)
        }
        this.getLayoutIntanceByNodeId = function (nodeid) {
            return $http.get($rootScope.webapiurl + "api/LayoutInstance/GetByNodeId?nodeId=" + nodeid)
        }
        this.getLayoutIntanceSolr = function (id) {
            return $http.get($rootScope.webapiurl + "api/LayoutInstance/GetAllSolr?q=NodeId:" + id + "&sort=Id desc")
        }
        this.getMediaCategoryById = function (id) {
            return $http.get($rootScope.webapiurl + "api/Category?id=" + id + '&includeMedia=false')
        }
        this.getMediaCategories = function () {
            return $http.get($rootScope.webapiurl + "api/Category/GetAllSolr?q=*&fl=Id,Name,IsEnabled,Featured&sort=Name asc&rows=200&no-pace")
        }
        this.getProgramById = function (id) {
            return $http.get($rootScope.webapiurl + "api/ProgrammingGuide?id=" + id + '&includeMedia=true&includeNodes=true')
        }
        this.getPageByNodeIdSolr = function (id) {
            return $http.get($rootScope.webapiurl + "api/Page/GetAllSolr?q=Nodes_id:" + id + "&fl=Id,Title_en,Url,Media_id,SocialNetworkId_en,SocialNetworkUrl_en,MediaSizesPaths:[json]&no-pace")
        }

        //PUT Requests
        this.updateMaquina = function (id,data) {
            return $http.put($rootScope.webapiurl + "api/PSSMaquinas?id=" + id, data)
        }

        this.updateEtiqueta = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSEtiquetas?id=" + id, data)
        }

        this.updateOperador = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSOperadores?id=" + id, data)
        }

        this.updateMaterial = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSTiposMaterials?id=" + id, data)
        }

        this.updateActividad = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSActividades?id=" + id, data)
        }

        this.updateOrigen = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSOrigenesScraps?id=" + id, data)
        }

        this.updateProducto = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSProductos?id=" + id, data)
        }

        this.editMotivo = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSScraps/editMotivo?id=" + id, data)
        }

        this.editVinculo = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSScraps/editMotivo?id=" + id, data)
        }

        this.valoresporperiodomensualput = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSScraps/valoresporperiodomensualput?id=" + id, data)
        }
        



        this.editTrabajoCilindo = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSProductos/editTrabajoCilindo?id=" + id, data)
        }

        

        this.updateScrap = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSScraps?id=" + id, data)
        }


        this.updateJobTrack = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/PSSJobTrack?id=" + id, data)
        }

        this.UpdateService = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/Services?id=" + id, data)
        }

        this.updateCashRegister = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/CashRegister?id=" + id, data)
        }

        this.updateKeyword = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/Keywords?id=" + id, data)
        }

        this.updateServiceType = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/ServiceTypes?id=" + id, data)
        }


        this.enableUsers = function (data) {
            return $http.put($rootScope.webapiurl + "api/Users/Enable?id=" + id, data)
        }
        this.disableUsers = function (data) {
            return $http.put($rootScope.webapiurl + "/api/User/Disable", data)
        }
        this.updateUsers = function (id, data) {
            return $http.put($rootScope.webapiurl + "api/Users?id=" + id, data)
        }
        this.updateNode = function (data) {
            return $http.put($rootScope.webapiurl + "api/Node/", data)
        }
        this.updateAsset = function (data) {
            return $http.put($rootScope.webapiurl + "api/News/", data)
        }
        this.updateAuthor = function (data) {
            return $http.put($rootScope.webapiurl + "api/Author/", data)
        }
        this.updateMedia = function (data) {
            return $http.put($rootScope.webapiurl + "api/Media/", data)
        }
        this.updateGallery = function (data) {
            return $http.put($rootScope.webapiurl + "api/Gallery/", data)
        }
        this.updateLayoutInstance = function (data) {
            return $http.put($rootScope.webapiurl + "api/LayoutInstance/", data)
        }
        this.updateMediaCategory = function (data) {
            return $http.put($rootScope.webapiurl + "api/Category/", data)
        }
        this.updateProgram = function (data) {
            return $http.put($rootScope.webapiurl + "api/ProgrammingGuide/", data)
        }
        this.updatePage = function (data) {
            return $http.put($rootScope.webapiurl + "api/Page/", data)
        }

        //POST Requests



        this.saveGridDate = function (date, Slots) {
            return $http.post($rootScope.webapiurl + "api/Services/saveGridDate", date, Slots)
        }


        this.createUsers = function (data) {
            return $http.post($rootScope.webapiurl + "api/Account/CreateUserRequest", data)
        }

        this.NewService = function (data) {
            return $http.post($rootScope.webapiurl + "api/Services", data)
        }

        this.createMaquina = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSMaquinas", data)
        }

        this.createEtiqueta = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSEtiquetas", data)
        }

        this.createOperador = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSOperadores", data)
        }

        this.createOrigen = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSOrigenesScraps", data)
        }

        this.createJobTrack = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSJobTrack", data)
        }

        this.createMaterial = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSTiposMaterials", data)
        }

        this.createActividad = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSActividades", data)
        }

        this.createVehicle = function (data) {
            return $http.post($rootScope.webapiurl + "api/Vehicles", data)
        }

        this.createCashRegister = function (data) {
            return $http.post($rootScope.webapiurl + "api/CashRegister", data)
        }
        this.createKeyword = function (data) {
            return $http.post($rootScope.webapiurl + "api/Keywords", data)
        }

        this.createServiceType = function (data) {
            return $http.post($rootScope.webapiurl + "api/ServiceTypes", data)
        }

        this.createTrabajoCilindo = function (data) {
            return $http.post($rootScope.webapiurl + "api/PSSProductos/postTrabajosCilindros", data)
        }



        this.changePassword = function (data) {
            return $http.post($rootScope.webapiurl + "api/Account/ChangePassword", data)
        }
        this.resendUserRequest = function (data) {
            return $http.post($rootScope.webapiurl + "api/Account/ResendUserRequest", data)
        }
        this.createNode = function (data) {
            return $http.post($rootScope.webapiurl + "api/Node", data)
        }
        this.createPage = function (data) {
            return $http.post($rootScope.webapiurl + "api/Page", data)
        }
        this.createAsset = function (data) {
            return $http.post($rootScope.webapiurl + "api/News", data)
        }
        this.createAuthor = function (data) {
            return $http.post($rootScope.webapiurl + "api/Author", data)
        }
        this.sendApproval = function (data) {
            return $http.post($rootScope.webapiurl + "api/News/SendApproval", data)
        }
        this.approve = function (data) {
            return $http.post($rootScope.webapiurl + "api/News/Approve", data)
        }
        this.disapprove = function (data) {
            return $http.post($rootScope.webapiurl + "api/News/Disapprove", data)
        }
        this.publish = function (data) {
            return $http.post($rootScope.webapiurl + "api/News/Publish", data)
        }
        this.createGallery = function (data) {
            return $http.post($rootScope.webapiurl + "api/Gallery", data)
        }
        this.BackloadUpdate = function (data) {
            return $http.post($rootScope.webapiurl + "api/Media/BackloadUpdate", data)
        }
        this.createLayoutInstance = function (data) {
            return $http.post($rootScope.webapiurl + "api/LayoutInstance", data)
        }
        this.createMediaCategory = function (data) {
            return $http.post($rootScope.webapiurl + "api/Category", data)
        }
        this.createMedia = function (data) {
            return $http.post($rootScope.webapiurl + "api/Media/Post", data)
        }
        this.createProgram = function (data) {
            return $http.post($rootScope.webapiurl + "api/ProgrammingGuide", data)
        }

        //DELETE Requests
        this.deleteUsers = function (id, data) {
            return $http.delete($rootScope.webapiurl + "api/Users?id=" + id, data)
        }
        this.deletePsscrapValoresPorPeriodoMensual = function (id) {
            return $http.delete($rootScope.webapiurl + "api/PSSScraps/deletePsscrapValoresPorPeriodoMensual?id=" + id)
        }

        

            this.deleteOperador = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSOperadores?id=" + id)

            }

            this.deleteEtiqueta = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSEtiquetas?id=" + id)

            }

            this.DeleteMultiple = function (data) {
                return $http.delete($rootScope.webapiurl + "api/PSSScraps/DeleteMultiple?id=" + data)

            }


            this.deleteMaterial = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSTiposMaterials?id=" + id)

            }

            this.deleteActividad = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSActividades?id=" + id)

            }


            this.deleteMaquina = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSMaquinas?id=" + id, data)

        }

        this.deleteRomaneo = function (id, data) {
            return $http.delete($rootScope.webapiurl + "api/Dashboard/deleteRomaneo?id=" + id, data)

        }


            this.deleteOrigen = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSOrigenesScraps?id=" + id)

            }

            this.deleteScrap = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSScraps?id=" + id)

            }

            this.deleteJobTrack = function (id, data) {
                return $http.delete($rootScope.webapiurl + "api/PSSJobTrack?id=" + id)

            }
            //return $http({
            //    url: $rootScope.webapiurl + "api/User/Delete",
            //    method: 'DELETE',
            //    data: data, // Make sure to inject the service you choose to the controller
            //    headers: {
            //        'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
            //    }
            //}).success(function (response) { /* do something here */ });
        
        this.deleteCashRegister = function (data, id) {
            return $http({
                url: $rootScope.webapiurl + "api/CashRegister/?id=" + id,
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deleteKeyword = function (data, id) {
            return $http({
                url: $rootScope.webapiurl + "api/Keywords/?id=" + id,
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deleteTypeService = function (id, data) {
            return $http.delete($rootScope.webapiurl + "api/ServiceTypes?" + id, data);
        }



        this.deleteAsset = function (data) {
            return $http({
                url: $rootScope.webapiurl + "api/News/Delete",
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deleteAuthor = function (data) {
            return $http({
                url: $rootScope.webapiurl + "api/Author/Delete",
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deleteMedia = function (filename) {
            return $http({
                url: $rootScope.webapiurl + "api/Backload?fileName=" + filename,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deleteGallery = function (data) {
            return $http({
                url: $rootScope.webapiurl + "api/Gallery/Delete",
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deleteMediaCategory = function (data) {
            return $http({
                url: $rootScope.webapiurl + "api/Category/Delete",
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deleteProgram = function (data) {
            return $http({
                url: $rootScope.webapiurl + "api/ProgrammingGuide/Delete",
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }
        this.deletePage = function (data) {
            return $http({
                url: $rootScope.webapiurl + "api/Page/Delete",
                method: 'DELETE',
                data: data, // Make sure to inject the service you choose to the controller
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                }
            }).success(function (response) { /* do something here */ });
        }

        this.ClearCache = function (url) {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(url);
            return true;
        }
    })

    .service("AlertService", function ($localStorage, $timeout) {

        this.SetAlert = function (message, type) {
            var messageObj = {
                type: type,
                message: message
            };
            $localStorage.alertMessage = messageObj;
        };

        this.clearAlert = function () {
            delete $localStorage.alertMessage;
        };

        this.ShowAlert = function ($scope) {
            if ($localStorage.alertMessage) {
                var messageObj = $localStorage.alertMessage;
                if (messageObj.type == "success") {
                    $scope.successMessage = messageObj.message;
                } else {
                    $scope.errorMessage = messageObj.message;
                }

                // Limpiar la alerta después de 3 segundos (3000 milisegundos)
                $timeout(function () {
                    this.clearAlert();
                }.bind(this), 3000);

                return true;
            } else {
                return false;
            }
        };


    });


