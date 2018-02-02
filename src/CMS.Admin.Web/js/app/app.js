var app;
(function () {
    app = angular.module("app", ["app.services", "app.controllers", 'angular-loading-bar', 'ngRoute', 'datatables', 'ngCookies', 'am.multiselect', 'angular.filter', 'ngFileUpload', 'ngMaterial', 'ngMessages', 'treeControl', 'textAngular', 'ngStorage', 'blueimp.fileupload', 'ui.bootstrap', 'pmImageEditor']);
})();

app.run(function ($rootScope, $http, $window) {
    $rootScope.webapiurl = 'http://api.admin.stg.teletica.ray.media/'; //Switch between local and dev environments
    $rootScope.mediaurl = 'http://static.stg.teletica.ray.media/'; //Switch between local and dev environments

    var token = angular.element('#token').val(); //Gets token from session

    $http.defaults.headers.common.Authorization = "Bearer " + token; //Sets token header globally for all requests
    $http.defaults.headers.put = { 'Content-Type': 'application/x-www-form-urlencoded' } //Sets content header globally for put requests
    $http.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded' } //Sets content header globally for post requests

    $rootScope.$on("$locationChangeSuccess", function (event, next, current) {
        console.log('page changed');
    });

});

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider

    .when("/", {
        templateUrl: "pages/dashboard.html",
        controller: 'DashboardController'
    })

    .when('/EditProfile', {
        templateUrl: 'pages/my-profile/profile.html',
        controller: 'ProfileEditController'
    })

    .when('/ResetPassword', {
        templateUrl: 'pages/my-profile/reset-password.html',
        controller: 'ResetPasswordController'
    })

    //USERS CRUD

    .when('/Users', {
        templateUrl: 'pages/users/user-list.html',
        controller: 'APIController'
    })

    .when('/Users/New', {
        templateUrl: 'pages/users/user-new.html',
        controller: 'CreateUserController'
    })

    .when('/Users/Edit/:id', {
        templateUrl: 'pages/users/user-edit.html',
        controller: 'UserEditController'
    })

    //CATEGORIES CRUD

    .when('/Content/Categories', {
        templateUrl: 'pages/content/category-list.html',
        controller: 'CategoriesController'
    })

    //ASSETS CRUD

    .when('/Content/Assets', {
        templateUrl: 'pages/content/asset-list.html',
        controller: 'AssetsController'
    })

    .when('/Content/Assets/New', {
        templateUrl: 'pages/content/asset-new.html',
        controller: 'CreateAssetController'
    })

    .when('/Content/Assets/Edit/:id', {
        templateUrl: 'pages/content/asset-edit.html',
        controller: 'AssetEditController'
    })

    //AUTHORS CRUD

    .when('/Authors', {
        templateUrl: 'pages/authors/author-list.html',
        controller: 'AuthorsController'
    })

    .when('/Authors/New', {
        templateUrl: 'pages/authors/author-new.html',
        controller: 'CreateAuthorController'
    })

    .when('/Authors/Edit/:id', {
        templateUrl: 'pages/authors/author-edit.html',
        controller: 'AuthorEditController'
    })

    //MEDIA LIBRARY CRUD

    .when('/MediaLibrary', {
        templateUrl: 'pages/media-library/list.html',
        controller: 'MediaLibraryController'
    })

    .when('/MediaLibrary/New', {
        templateUrl: 'pages/media-library/new.html',
        controller: 'CreateMediaController'
    })

    .when('/MediaLibrary/Edit/:id', {
        templateUrl: 'pages/media-library/edit.html',
        controller: 'MediaEditController'
    })

    .when('/MediaLibrary/ImageEditor/:id', {
        templateUrl: 'pages/media-library/image-editor.html',
        controller: 'ImageEditor'
    })

    .when('/MediaLibrary/ChooseFile', {
        templateUrl: 'pages/media-library/choose-file.html',
        controller: 'ChooseFileController'
    })

    //MEDIA GALLERY CRUD

    .when('/MediaGallery', {
        templateUrl: 'pages/media-gallery/list.html',
        controller: 'MediaGalleryController'
    })

    .when('/MediaGallery/New', {
        templateUrl: 'pages/media-gallery/new.html',
        controller: 'CreateGalleryController'
    })

    .when('/MediaGallery/Edit/:id', {
        templateUrl: 'pages/media-gallery/edit.html',
        controller: 'GalleryEditController'
    })

    //LAYOUT CRUD

    .when('/Content/Layouts', {
        templateUrl: 'pages/content/layout-list.html',
        controller: 'LayoutController'
    })

    .when('/Content/Layouts/New', {
        templateUrl: 'pages/content/layout-new.html',
        controller: 'CreateLayoutController'
    })

    .when('/Content/Layouts/Edit/:id', {
        templateUrl: 'pages/content/layout-edit.html',
        controller: 'EditLayoutController'
    })

    .when('/Content/Layouts/Editor', {
        templateUrl: 'pages/content/layout-editor.html',
        controller: 'EditorLayoutController'
    })

    //$locationProvider.html5Mode(true); //Removes /#/ from Angular views URL
});


app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default').dark();
});


app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 500; //Minimum request time to execute loadingbar(miliseconds)
}]);

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
    fileUploadProvider.defaults.redirect = window.location.href.replace(
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

//WYSIWYG config options
app.config(function($provide) {
    // this demonstrates how to register a new tool and add it to the default toolbar
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
        taOptions.toolbar = [
          ['h3', 'p', 'quote'],
          ['bold', 'italics', 'underline','ul', 'ol'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
          ['redo', 'undo', 'clear', 'html']
        ];
        /*
        taOptions.toolbar = [
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
          ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
          ['html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
        ];
        */
        return taOptions;
    }]);
});

app.filter('capitalize', function () {
    return function (input) {
        input = input.replace(/_/g, " ");
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
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
                            console.log(idx);

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
                                console.log(scope.$parentNode);
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
                            if (index!==-1) {
                                scope.updatedNodes.splice(index, 1);
                            }
                            scope.updatedNodes.push(unode);

                            //fill parent nodes for reorder updates
                            var index = scope.updatedParentNodes.indexOf(toParent);
                            if (index === -1) {
                                scope.updatedParentNodes.push(toParent);
                            }

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

