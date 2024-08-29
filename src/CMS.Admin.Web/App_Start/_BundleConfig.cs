using System.Web.Optimization;

namespace blsp.Admin.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/js/jquery-3.1.1.min.js",
                        "~/js/jquery-ui.min.js",
                        "~/assets/plugins/slimscroll/jquery.slimscroll.min.js",
                        "~/assets/plugins/jquery-cookie/jquery.cookie.js",
                        "~/js/jquery.dataTables.min.js",
                        "~/js/progressive-image.min.js",
                        "~/assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js"
                       




                        ));

            bundles.Add(new Bundle("~/bundles/angular").Include(
                    /* new theme */
                        "~/assets/plugins/angularjs/angular.min.js",
                        "~/assets/plugins/angularjs/angular-ui-route.min.js",
                        "~/assets/plugins/angularjs/ocLazyLoad.min.js",

                        // "~/assets/plugins/ngAnalytics/ng-analytics.min.js",
                        "~/assets/plugins/morris/raphael.min.js",
                        "~/assets/plugins/morris/morris.js",
                        "~/assets/plugins/jquery-jvectormap/jquery-jvectormap.min.js",
                        "~/assets/plugins/jquery-jvectormap/jquery-jvectormap-world-merc-en.js",

                        "~/assets/js/angular-app.js",
                        "~/assets/js/angular-setting.js",
                        "~/assets/js/angular-controller.js",
                        "~/assets/js/angular-directive.js",
                        "~/assets/js/apps.min.js",
                       // "~/assets/js/prism.js",
                        //"~/assets/css/prism.css",
                     /* end new theme */

                        //"~/js/angular.js",
                        "~/js/angular-route.js",
                        "~/js/angular-aria.min.js",
                        "~/js/angular-animate.min.js",
                        "~/js/angular-messages.min.js",
                        "~/js/angular-material.min.js",
                        "~/js/angular-sanitize.min.js",
                        "~/js/ng-file-upload.min.js",
                        "~/js/ng-file-upload-shim.min.js",
                        "~/js/app/services/MainService.js",
                        "~/js/app/controllers/MainController.js",
                        "~/js/app/controllers/ServiceController.js",
                         "~/js/app/controllers/ModalDemoController.js",
                          "~/js/app/controllers/ActividadController.js",
                          "~/js/app/controllers/JobTrackController.js",

                        "~/js/app/controllers/DashboardController.js",
                        "~/js/app/controllers/UserController.js",
                        //"~/js/app/controllers/NewsController.js",
                        //"~/js/app/controllers/AuthorController.js",
                        //"~/js/app/controllers/MediaLibraryController.js",
                        //"~/js/app/controllers/MediaGalleryController.js",
                        "~/js/app/controllers/MaquinasController.js",
                        "~/js/app/controllers/OperadoresController.js",
                         "~/js/app/controllers/tipoMaterialController.js",
                        "~/js/app/controllers/origenScrapController.js",
                        "~/js/app/controllers/scrapController.js",
                                                "~/js/app/controllers/ReporteController.js",

                        //"~/js/app/controllers/LayoutController.js",
                        "~/js/app/controllers/CashRegisterController.js",
                        "~/js/app/controllers/CarsController.js",
                        "~/js/app/controllers/ModelsController.js",
                        "~/js/app/controllers/ConceptsController.js",
                        "~/js/app/controllers/SubConceptsController.js",
                        "~/js/app/controllers/ServiceTypeController.js",
                        /* "~/js/app/app.js", */

                        "~/js/isteven-multi-select.js",
                        "~/js/angular-cookies.min.js",
                        "~/js/angular-tree-control.js",
                        "~/js/angular-filter.min.js",
                        "~/js/textangular/textAngular-rangy.min.js",
                        "~/js/textangular/textAngular-sanitize.min.js",
                        "~/js/textangular/textAngular.min.js",
                        "~/js/ngStorage.min.js",
                        "~/js/fileupload/vendor/jquery.ui.widget.js",
                        "~/js/fileupload/load-image.all.min.js",
                        "~/js/fileupload/jquery.iframe-transport.js",
                        "~/js/fileupload/jquery.fileupload.js",
                        "~/js/fileupload/jquery.fileupload-process.js",
                        "~/js/fileupload/jquery.fileupload-image.js",
                        "~/js/fileupload/jquery.fileupload-audio.js",
                        "~/js/fileupload/jquery.fileupload-video.js",
                        "~/js/fileupload/jquery.fileupload-validate.js",
                        "~/js/fileupload/jquery.fileupload-angular.js",
                        "~/js/ui-bootstrap-2.4.0.min.js",
                        "~/js/angular-ui/ui-bootstrap-tpls.min.js",
                        "~/js/croppie/ng-croppie.js",
                        "~/js/croppie/croppie.js",
                        "~/js/angular-drag-and-drop-lists.min.js",
                        "~/js/angular-material-datetimepicker.js",
                        "~/js/angular-locale_es-ar.js",
                        "~/js/angular-slugify.js",
                        "~/js/bootstrap-colorpicker-module.js",
                        "~/js/ngPrint.min.js",
                        "~/js/alasql.js",
                        "~/js/xlsx.core.min.js",
                                                "~/js/dataTables.fixedColumns.min.js",
                                         "~/js/angular-datatables.fixedcolumns.min.js"




                      ));


            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/js/bootstrap.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/plugins").Include(
                      "~/js/loading-bar.min.js",
                      "~/js/angular-datatables.min.js",
                      "~/js/multiselect-tpls.js",
                      "~/js/moment.min.js",
                      "~/js/moment-with-locales.js",
                      "~/js/ng-csv.js"


                      ));

            bundles.Add(new ScriptBundle("~/bundles/site").Include(
                      "~/js/functions.js"));

            bundles.Add(new StyleBundle("~/styles/css").Include(
                      "~/css/_include.css",
                      "~/DataTables/css/buttons.dataTables.css",
                                            "~/css/fixedColumns.dataTables.min.css"






                      )




                      );
        }
    }
}
