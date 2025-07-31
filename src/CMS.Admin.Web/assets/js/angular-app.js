var app = angular.module("app", [
            'ui.router',
            'ui.bootstrap',
            'oc.lazyLoad',
            "app.services",
            "app.controllers",
            'ngRoute',
            'datatables',
            'ngCookies',
            'am.multiselect',
            'angular.filter',
            'ngFileUpload',
            'ngMaterial',
            'ngMessages',
            'treeControl',
            'textAngular',
            'ngStorage',
            'blueimp.fileupload',
            'ui.bootstrap',
            'ngCroppie',
            'dndLists',
            'ngSanitize',
            'ngMaterialDatePicker',
            'slugifier',
            'colorpicker.module',
            "isteven-multi-select",
            "ngPrint",
            "ngCsv",
            "datatables.fixedcolumns"
]);

app.run(function ($rootScope, $http, $window, $state, setting) {


    $rootScope.$state = $state;
    $rootScope.setting = setting;

    $rootScope.webapiurl = getAPIUrl(); //Switch between local and dev environments
    $rootScope.mediaurl = getAPIUrl();


    //$rootScope.webapiurl = 'http://stash-ba.ddns.net/'; //Switch between local and dev environments
    //$rootScope.mediaurl = 'http://stash-ba.ddns.net/';

    var token = angular.element('#token').val(); //Gets token from session

    $http.defaults.headers.common.Authorization = "Bearer " + token; //Sets token header globally for all requests
    $http.defaults.headers.put = { 'Content-Type': 'application/x-www-form-urlencoded' } //Sets content header globally for put requests
    $http.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded' } //Sets content header globally for post requests

    //$http.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

    $rootScope.$on("$locationChangeSuccess", function (event, next, current) {
        //console.log('page changed');
    });
});


app.config(function ($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {



    $urlRouterProvider.otherwise('/blsp/dashboard');

    $stateProvider
        .state('blsp', {
            url: '/blsp',
            templateUrl: 'pages/shared/app.html',
            abstract: true
        })
            .state('blsp.dashboard', {
                url: '/dashboard',
                templateUrl: 'pages/dashboard.html',
                controller: 'DashboardController'
            })






    /* Users */
        .state('blsp.users', {
            url: '/users',
            template: '<div ui-view></div>',
            abstract: true
        })
            .state('blsp.users.list', {
                url: '/list',
                data: { pageTitle: 'Users' },
                templateUrl: 'pages/users/user-list.html'
            })
            .state('blsp.users.new', {
                url: '/new',
                data: { pageTitle: 'New User' },
                templateUrl: 'pages/users/user-new.html'
            })
            .state('blsp.users.edit', {
                url: '/edit/:id',
                data: { pageTitle: 'Edit User' },
                templateUrl: 'pages/users/user-edit.html'
            })

  

        /* Maquinas */
            .state('blsp.maquinas', {
                url: '/maquinas',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.maquinas.list', {
                    url: '/list',
                    data: { pageTitle: 'Maquinas' },
                    templateUrl: 'pages/maquinas/list.html'
                })
                .state('blsp.maquinas.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Maquinas CRUD' },
                    templateUrl: 'pages/maquinas/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })


        /* Etiquetas */
            .state('blsp.etiquetas', {
                url: '/etiquetas',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.etiquetas.list', {
                    url: '/list',
                    data: { pageTitle: 'Etiquetas' },
                    templateUrl: 'pages/etiquetas/list.html'
                })
                .state('blsp.etiquetas.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Etiquetas CRUD' },
                    templateUrl: 'pages/etiquetas/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

         /* Operadores */
            .state('blsp.operadores', {
                url: '/operadores',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.operadores.list', {
                    url: '/list',
                    data: { pageTitle: 'Operadores' },
                    templateUrl: 'pages/operadores/list.html'
                })
                .state('blsp.operadores.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Operadores CRUD' },
                    templateUrl: 'pages/operadores/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })



        /* Operadores */
        .state('blsp.valoresPorPeriodoMensual', {
            url: '/valoresPorPeriodoMensual',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('blsp.valoresPorPeriodoMensual.list', {
            url: '/list',
            data: { pageTitle: 'Valores por periodo Mensual' },
            templateUrl: 'pages/valoresPorPeriodoMensual/list.html'
        })
        .state('blsp.valoresPorPeriodoMensual.crud', {
            url: '/crud/:id',
            data: { pageTitle: 'Valores por periodo Mensual CRUD' },
            templateUrl: 'pages/valoresPorPeriodoMensual/crud.html',
            params: {
                id: { squash: true, value: null }
            }
        })



        /* Operadores */
        .state('blsp.motivosscrap', {
            url: '/motivosscrap',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('blsp.motivosscrap.list', {
            url: '/list',
            data: { pageTitle: 'motivosscrap' },
            templateUrl: 'pages/motivosscrap/list.html'
        })


    

         /* Tipo Material */
            .state('blsp.tipoMaterial', {
                url: '/tipoMaterial',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.tipoMaterial.list', {
                    url: '/list',
                    data: { pageTitle: 'Tipo de material' },
                    templateUrl: 'pages/tipoMaterial/list.html'
                })
                .state('blsp.tipoMaterial.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Tipo de Material CRUD' },
                    templateUrl: 'pages/tipoMaterial/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })



        /* Operadores */
        .state('blsp.trabajocilindros', {
            url: '/trabajocilindros',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('blsp.trabajocilindros.list', {
            url: '/list',
            data: { pageTitle: 'trabajocilindros' },
            templateUrl: 'pages/trabajocilindros/list.html'
        })
        .state('blsp.trabajocilindros.crud', {
            url: '/crud/:id',
            data: { pageTitle: 'trabajocilindros CRUD' },
            templateUrl: 'pages/trabajocilindros/crud.html',
            params: {
                id: { squash: true, value: null }
            }
        })





        /* Productos */
        .state('blsp.productos', {
            url: '/productos',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('blsp.productos.list', {
            url: '/list',
            data: { pageTitle: 'Productos' },
            templateUrl: 'pages/productos/list.html'
        })
        .state('blsp.productos.crud', {
            url: '/crud/:id',
            data: { pageTitle: 'Productos' },
            templateUrl: 'pages/productos/crud.html',
            params: {
                id: { squash: true, value: null }
            }
        })
        .state('blsp.productos.dashboard', {
            url: '/dashboard',
            data: { pageTitle: 'Productos Dashboard' },
            templateUrl: 'pages/productos/dashboard.html'
        })

        .state('blsp.dashboardProductos', {
            url: '/dashboardProductos',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('blsp.dashboardProductos.dashboard', {
            url: '/dashboard',
            data: { pageTitle: 'Dashboard Productos' },
            templateUrl: 'pages/dashboardProductos/dashboard.html'
        })



        //MOTIVOS
        .state('blsp.motivos', {
            url: '/motivos',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('blsp.motivos.list', {
            url: '/list',
            data: { pageTitle: 'Motivos' },
            templateUrl: 'pages/motivos/list.html'
        })
        .state('blsp.motivos.crud', {
            url: '/crud/:id',
            data: { pageTitle: 'Motivos' },
            templateUrl: 'pages/motivos/crud.html',
            params: {
                id: { squash: true, value: null }
            }
        })

    

          /* Origen de Scrap */
            .state('blsp.origenScrap', {
                url: '/origenScrap',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.origenScrap.list', {
                    url: '/list',
                    data: { pageTitle: 'Origen de Scrap' },
                    templateUrl: 'pages/origenScrap/list.html'
                })
                .state('blsp.origenScrap.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Origen de Scrap CRUD' },
                    templateUrl: 'pages/origenScrap/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })



         /* Reporte 1 */
            .state('blsp.reporte1', {
                url: '/reporte1',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.reporte1.list', {
                    url: '/list',
                    data: { pageTitle: 'Reporte Scrap 1' },
                    templateUrl: 'pages/reportes/reporte1/list.html'
                })
                .state('blsp.reporte1.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Origen de Scrap CRUD' },
                    templateUrl: 'pages/reportes/reporte1/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

         /* Reporte 2 */
            .state('blsp.reporte2', {
                url: '/reporte2',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.reporte2.list', {
                    url: '/list',
                    data: { pageTitle: 'Reporte Scrap 2' },
                    templateUrl: 'pages/reportes/reporte2/list.html'
                })
                .state('blsp.reporte2.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Origen de Scrap CRUD' },
                    templateUrl: 'pages/reportes/reporte2/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })


          /* Reporte 2 */
            .state('blsp.reporteRomaneo', {
                url: '/reporteRomaneo',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.reporteRomaneo.list', {
                    url: '/list',
                    data: { pageTitle: 'Reporte Romaneo' },
                    templateUrl: 'pages/reportes/reporteRomaneo/list.html'
                })
                .state('blsp.reporteRomaneo.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Origen de Scrap CRUD' },
                    templateUrl: 'pages/reportes/reporte2/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

         /* Origen de Scrap */
            .state('blsp.JobTrack', {
                url: '/JobTrack',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.JobTrack.list', {
                    url: '/list',
                    data: { pageTitle: 'JobTrack' },
                    templateUrl: 'pages/JobTrack/list.html'
                })
                .state('blsp.JobTrack.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'JobTrack CRUD' },
                    templateUrl: 'pages/JobTrack/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })


         /* Origen de Scrap */
            .state('blsp.actividades', {
                url: '/actividades',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.actividades.list', {
                    url: '/list',
                    data: { pageTitle: 'Actividades' },
                    templateUrl: 'pages/actividades/list.html'
                })
                .state('blsp.actividades.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Actividades CRUD' },
                    templateUrl: 'pages/actividades/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })


         /*  Scrap */
            .state('blsp.scrap', {
                url: '/scrap',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.scrap.list', {
                    url: '/list',
                    data: { pageTitle: 'Scrap' },
                    templateUrl: 'pages/scrap/list.html'
                })
                .state('blsp.scrap.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Scrap CRUD' },
                    templateUrl: 'pages/scrap/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })


        /* Configuration */
            .state('blsp.config', {
                url: '/config',
                template: '<div ui-view></div>',
                abstract: true
            })
                .state('blsp.config.cars', {
                    url: '/cars',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('blsp.config.cars.list', {
                    url: '/list',
                    data: { pageTitle: 'Vehiculos' },
                    templateUrl: 'pages/cars/list.html'
                })
                .state('blsp.config.cars.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Vehiculos CRUD' },
                    templateUrl: 'pages/cars/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

                .state('blsp.config.models', {
                    url: '/models',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('blsp.config.models.list', {
                    url: '/list',
                    data: { pageTitle: 'Modelos' },
                    templateUrl: 'pages/models/list.html'
                })
                .state('blsp.config.models.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Modelos CRUD' },
                    templateUrl: 'pages/models/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

                .state('blsp.config.concepts', {
                    url: '/concepts',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('blsp.config.concepts.list', {
                    url: '/list',
                    data: { pageTitle: 'Conceptos' },
                    templateUrl: 'pages/concepts/list.html'
                })
                .state('blsp.config.concepts.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Conceptos CRUD' },
                    templateUrl: 'pages/concepts/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

                .state('blsp.config.subconcepts', {
                    url: '/subconcepts',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('blsp.config.subconcepts.list', {
                    url: '/list',
                    data: { pageTitle: 'SubConceptos' },
                    templateUrl: 'pages/subconcepts/list.html'
                })
                .state('blsp.config.subconcepts.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'SubConceptos CRUD' },
                    templateUrl: 'pages/subconcepts/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

                .state('blsp.config.servicetype', {
                    url: '/servicetype',
                    template: '<div ui-view></div>',
                    abstract: true
                })
                .state('blsp.config.servicetype.list', {
                    url: '/list',
                    data: { pageTitle: 'Service type' },
                    templateUrl: 'pages/service-type/list.html'
                })
                .state('blsp.config.servicetype.crud', {
                    url: '/crud/:id',
                    data: { pageTitle: 'Service type CRUD' },
                    templateUrl: 'pages/service-type/crud.html',
                    params: {
                        id: { squash: true, value: null }
                    }
                })

    /* Profile */
        .state('blsp.profile', {
            url: '/profile',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('blsp.profile.edit', {
            url: '/edit',
            templateUrl: 'pages/my-profile/profile.html',
            data: { pageTitle: 'Profile' }
        })
        .state('blsp.profile.reset', {
            url: '/reset',
            templateUrl: 'pages/my-profile/reset-password.html',
            data: { pageTitle: 'Reset Password' }
        })
});


//app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
//    cfpLoadingBarProvider.latencyThreshold = 500; //Minimum request time to execute loadingbar(miliseconds)
//}]);

app.config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        if (!date)
            return null;
        return moment(date).format('YYYY-MM-DD');
    };
    $mdDateLocaleProvider.parseDate = function (dateString) {
        if (!dateString)
            return null;
        var m = moment(dateString, 'YYYY-MM-DD', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
});

var url = 'http://api.admin.stg.teletica.ray.media/api/Backload/';


app.config(function ($httpProvider, fileUploadProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    fileUploadProvider.defaults.redirect = window?.location?.href?.replace(
        /\/[^\/]*$/,
        '/cors/result.html?%s'
    );
    //if (isOnGitHub) {
    //    // Demo settings:
    //    angular.extend(fileUploadProvider.defaults, {
    //        // Enable image resizing, except for Android and Opera,
    //        // which actually support image resizing, but fail to
    //        // send Blob objects via XHR requests:
    //        disableImageResize: /Android(?!.*Chrome)|Opera/
    //            .test(window.navigator.userAgent),
    //        maxFileSize: 999000,
    //        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
    //    });
    //}
}
);

app.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://media.stg.teletica.ray.media/**']);
})

//WYSIWYG config options
app.config(function ($provide) {
    // this demonstrates how to register a new tool and add it to the default toolbar
    //$provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
    //    taOptions.toolbar = [
    //      ['h3', 'p', 'quote'],
    //      ['bold', 'italics', 'underline', 'ul', 'ol'],
    //      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
    //      ['redo', 'undo', 'clear', 'html']
    //    ];
    //    return taOptions;
    //}]);

    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', 'taSelection', 'taToolFunctions', function (taRegisterTool, taOptions, taSelection, taToolFunctions) {

        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('CMSinsertImage', {
            iconclass: "fa fa-image red",
            onElementSelect: {
                element: 'img',
                action: taToolFunctions.imgOnSelectAction
            },
            action: function (deferred, restoreSelection) {
                //var txt= window.getSelection();
                //var sel = angular.element(taSelection.getSelectionElement());
                ///*                alert(txt);
                //                alert(sel[0].tagName);*/
                //if(sel[0].tagName == 'OFICIO'){
                //    sel.replaceWith(sel.html());
                //}
                //else{
                //    this.$editor().wrapSelection('insertHTML', ''+txt+'',true);
                //}
                //alert('insert image!!');
                angular.element(document.getElementById('CreateAsset')).scope().ChooseFile('texteditor');
                //this.$editor.ChooseFile;
            }
        });

        taOptions.toolbar = [
          ['h3', 'h5', 'p', 'quote'],
          ['bold', 'italics', 'underline'],
          ['ul', 'ol'],
          ['insertLink','CMSinsertImage'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
          ['redo', 'undo', 'clear', 'html']
        ];

        // add the button to the default toolbar definition
        //taOptions.toolbar[1].push('colourRed');
        return taOptions;
    }]);
});

app.filter('capitalize', function () {
    return function (input) {
        input = input?.replace(/_/g, " ");
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.filter('weekday', function () {
    return function (input) {
        var days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        input = input?.replace(/_/g, " ");
        return (!!input) ? days[input] : '';
    }
});

app.filter('trustUrl', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
});


app.factory('uploadManager', function ($rootScope) {
    var _files = [];
    return {
        add: function (file) {
            _files.push(file);
            $rootScope.$broadcast('fileAdded', file.files[0].name);
        },
        clear: function () {
            _files = [];
        },
        files: function () {
            var fileNames = [];
            $.each(_files, function (index, file) {
                fileNames.push(file.files[0].name);
            });
            return fileNames;
        },
        upload: function () {
            $.each(_files, function (index, file) {
                file.submit();
            });
            this.clear();
        },
        setProgress: function (percentage) {
            $rootScope.$broadcast('uploadProgress', percentage);
        }
    };
});

app.directive('upload', ['uploadManager', function factory(uploadManager) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).fileupload({
                dataType: 'text',
                add: function (e, data) {
                    uploadManager.add(data);
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    uploadManager.setProgress(progress);
                },
                done: function (e, data) {
                    uploadManager.setProgress(0);
                }
            });
        }
    };
}]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
          function (scope) {
              // watch the 'compile' expression for changes
              return scope.$eval(attrs.compile);
          },
          function (value) {
              // when the 'compile' expression changes
              // assign it into the current DOM
              element.html(value);

              // compile the new DOM and link it to the current
              // scope.
              // NOTE: we only compile .childNodes so that
              // we don't get into infinite loop compiling ourselves
              $compile(element.contents())(scope);
          }
      );
    };
}]);

//DRAG & DROP DIRECTIVE FOR CATEGORIES TREE CONTROL
var xnode;
var xparentNode;

app.directive('treednd', function () {
    return {
        restrict: 'A',
        link: function (scope, elt, attrs) {
            //common functions
            function getIndexBy(obj, name, value) {
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i][name] == value) {
                        return i;
                    }
                }
                return -1;
            }

            elt.draggable({
                cursor: 'move',
                appendTo: 'body',
                disabled: !scope.$parentNode,
                drag: function (event, ui) {
                    var destination = ui.helper.data('destination')
                    if (destination) {
                        var cursorPos = event.pageY;
                        var destPos = destination.offset().top;
                        var offset = cursorPos - destPos;
                        var h = destination.height();

                        var position;
                        if (offset <= h / 3) {
                            position = 'up';
                        } else if (offset >= 2 * h / 3) {
                            position = 'down';
                        } else {
                            position = 'middle';
                        }
                        ui.helper.data('position', position);
                        destination.removeClass('hover-up hover-middle hover-down');
                        destination.addClass('hover-' + position);
                    }
                },
                helper: function (event) {
                    var helper = $('<div class="helper">' + scope.node.Content[0].Title + '</div>');
                    // fill some data to be catched up by droppable() of receiver directives
                    //helper.data('node', scope.node);
                    //helper.data('parentNode', scope.$parentNode);

                    //localStorage.setItem("xnode", JSON.stringify(scope.node));
                    //localStorage.setItem("xparentNode", JSON.stringify(scope.$parentNode));

                    xnode = scope.node;
                    xparentNode = scope.$parentNode;

                    //console.log(helper.data('node'));

                    return helper;
                }

            });
            elt.droppable({
                tolerance: 'pointer',
                over: function (event, ui) {
                    ui.helper.data('destination', elt);
                    elt.addClass('hover');
                },
                out: function (event, ui) {
                    ui.helper.data('destination', null);
                    elt.removeClass('hover hover-up hover-middle hover-down');
                },
                drop: function (event, ui) {

                    var toNode = scope.node;
                    var toParent = scope.$parentNode ? scope.$parentNode.Childs : null;
                    var fromNode = xnode; //JSON.parse(localStorage.getItem("xnode")); //ui.helper.data('node');
                    var fromParentNode = xparentNode; //JSON.parse(localStorage.getItem("xparentNode")); //ui.helper.data('parentNode');
                    var position = ui.helper.data('position');

                    //console.log(localStorage.getItem("xparentNode"));

                    scope.$apply(function () {
                        //scope.showSaveOrder = true;

                        var idx;
                        if (fromParentNode && toParent) {
                            idx = fromParentNode.Childs.indexOf(fromNode);

                            if (idx != -1) {
                                fromParentNode.Childs.splice(idx, 1);
                            }
                        }

                        if (position === 'middle') {
                            if (toNode.Childs) {
                                // inside
                                //scope.createNodeData['ParentNode.Id'] = toNode.Id;
                                fromNode.ParentNode = toNode.Id;
                                toNode.Childs.push(fromNode);
                            }
                        } else if (position === 'up') {
                            if (toParent) {
                                //scope.createNodeData['ParentNode.Id'] = scope.$parentNode.Id;
                                fromNode.ParentNode = scope.$parentNode.Id;
                                idx = toParent.indexOf(toNode);
                                toParent.splice(idx, 0, fromNode);
                            }
                        } else if (position === 'down') {
                            if (toParent) {
                                //scope.createNodeData['ParentNode.Id'] = scope.$parentNode.Id;
                                fromNode.ParentNode = scope.$parentNode.Id;
                                idx = toParent.indexOf(toNode);
                                toParent.splice(idx + 1, 0, fromNode);
                            }
                        }

                        //UPDATE DDBB ON DROP
                        if (fromParentNode && toParent) {
                            //create node to ddbb update
                            var unode = {
                                Id: fromNode.Id,
                                'ParentNode.Id': fromNode.ParentNode,
                                Description: fromNode.Description,
                                'Content[0].Title': fromNode.Content[0].Title,
                                'Content[0].LanguageId': fromNode.Content[0].LanguageId,
                                Visible: fromNode.Visible,
                                IsEnabled: fromNode.IsEnabled
                            }
                            var index = getIndexBy(scope.updatedNodes, "Id", unode.Id);

                            //fill updated nodes to update on ddbb
                            if (index !== -1) {
                                scope.updatedNodes.splice(index, 1);
                            }
                            scope.updatedNodes.push(unode);

                            //fill parent nodes for reorder updates
                            var index = scope.updatedParentNodes.indexOf(toParent);
                            if (index === -1) {
                                scope.updatedParentNodes.push(toParent);
                            }

                            scope.showSaveOrder = true;

                           $('#SaveOrder').removeClass('ng-hide');

                        }
                    });
                    elt.removeClass('hover hover-up hover-middle hover-down');

                }
            });

            var dereg = scope.$on('$destroy', function () {
                try {
                    elet.draggable('destroy');
                } catch (e) {
                    // may fail
                }
                dereg();
                dereg = null;
            });

        }
    };
});
