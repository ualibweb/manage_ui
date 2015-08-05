angular.module('manage.manageNews', ['ngFileUpload'])
    .controller('manageNewsCtrl', ['$scope', '$window', '$timeout', 'tokenFactory', 'newsFactory',
        function manageNewsCtrl($scope, $window, $timeout, tokenFactory, newsFactory){
            $scope.data = {};
            $scope.dpFormat = 'MM/dd/yyyy';
            $scope.newNews = {};
            $scope.newNews.creator = $window.author;
            $scope.newNews.selectedFiles = [];
            $scope.isAdmin = false;
            if (typeof $window.admin !== 'undefined')
                if ($window.admin === "1")
                    $scope.isAdmin = true;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'created', reverse:true}
            ];

            tokenFactory("CSRF-libNews");

            newsFactory.getData("all")
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.news.length; i++){
                        data.news[i].created = new Date(data.news[i].created * 1000);
                        if (data.news[i].activeFrom !== null)
                            data.news[i].activeFrom = new Date(data.news[i].activeFrom * 1000);
                        if (data.news[i].activeUntil !== null)
                            data.news[i].activeUntil = new Date(data.news[i].activeUntil * 1000);
                        for (var j = 0; j < data.people.length; j++)
                            if (data.news[i].contactID.uid === data.people[j].uid){
                                data.news[i].contactID = data.people[j];
                                break;
                            }
                        data.news[i].show = false;
                        data.news[i].class = "";
                        data.news[i].dpFrom = false;
                        data.news[i].dpUntil = false;
                        data.news[i].selectedFiles = [];
                    }
                    $scope.newNews.contactID = data.people[0];
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'News and Exhibits',
                    number: 0,
                    active: true
                },
                { name: 'Admins',
                    number: 1,
                    active: false
                }];
            
            $scope.validateNews = function(news){
                if (news.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (news.description.length < 1)
                    return "Form error: Please fill out Description!";

                return "";
            };
            $scope.generateThumb = function(files, news) {
                if (files != null) {
                    for (var i = 0; i < files.length; i++){
                        if (news !== null) {
                            $scope.data.news[$scope.data.news.indexOf(news)].selectedFiles.push(files[i]);
                        } else {
                            $scope.newNews.selectedFiles.push(files[i]);
                        }
                        if ($scope.fileReaderSupported && files[i].type.indexOf('image') > -1) {
                            $timeout(function() {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(files[i]);
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        files[i].dataUrl = e.target.result;
                                    });
                                }
                            });
                        }
                    }
                }
            };
        }])

    .directive('newsExhibitionsMain', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageNewsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'data.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("News data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageNews/manageNews.tpl.html'
        };
    })

    //from http://codepen.io/paulbhartzog/pen/Ekztl?editors=101
    .value('uiTinymceConfig', {plugins: 'link spellchecker', toolbar: 'undo redo | bold italic | link', menubar : false})
    .directive('uiTinymce', ['uiTinymceConfig', function(uiTinymceConfig) {
        uiTinymceConfig = uiTinymceConfig || {};
        var generatedIds = 0;
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ngModel) {
                var expression, options, tinyInstance;
                // generate an ID if not present
                if (!attrs.id) {
                    attrs.$set('id', 'uiTinymce' + generatedIds++);
                }
                options = {
                    // Update model when calling setContent (such as from the source editor popup)
                    setup: function(ed) {
                        ed.on('init', function(args) {
                            ngModel.$render();
                        });
                        // Update model on button click
                        ed.on('ExecCommand', function(e) {
                            ed.save();
                            ngModel.$setViewValue(elm.val());
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                        // Update model on keypress
                        ed.on('KeyUp', function(e) {
                            console.log(ed.isDirty());
                            ed.save();
                            ngModel.$setViewValue(elm.val());
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                    },
                    mode: 'exact',
                    elements: attrs.id
                };
                if (attrs.uiTinymce) {
                    expression = scope.$eval(attrs.uiTinymce);
                } else {
                    expression = {};
                }
                angular.extend(options, uiTinymceConfig, expression);
                setTimeout(function() {
                    tinymce.init(options);
                });


                ngModel.$render = function() {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.setContent(ngModel.$viewValue || '');
                    }
                };
            }
        };
    }])

    .controller('manageNewsListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageNewsListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 1;
            $scope.appURL = appURL;
            $scope.uploading = false;

            $scope.newNews.activeFrom = new Date();
            $scope.newNews.activeUntil = new Date();
            $scope.newNews.dpFrom = false;
            $scope.newNews.dpUntil = false;
            $scope.newNews.contactName = '';
            $scope.newNews.contactEmail = '';
            $scope.newNews.contactPhone = '';
            $scope.newNews.sticky = 0;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.onNewsDPFocusFrom = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.news[index].dpFrom = true;
                else
                    $scope.newNews.dpFrom = true;
            };
            $scope.onNewsDPFocusUntil = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.news[index].dpUntil = true;
                else
                    $scope.newNews.dpUntil = true;
            };

            $scope.toggleNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].show =
                    !$scope.data.news[$scope.data.news.indexOf(news)].show;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.approveNews = function(news){
                news.admin = $scope.newNews.creator;
                if (confirm("Are you sure you want to approve " + news.title  + "?") == true){
                    newsFactory.postData({action : 4}, news)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.news[$scope.data.news.indexOf(news)].status = 1;
                            } else {
                                alert("Error: Can not approve news item! " + data);
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            alert("Error: Could not approve news item! " + data);
                            console.log(data);
                        });
                }
            };
            $scope.deleteNews = function(news){
                if (confirm("Delete " + news.title  + " permanently?") == true){
                    newsFactory.postData({action : 1}, news)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.news.splice($scope.data.news.indexOf(news), 1);
                                $scope.formResponse = "News item has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete news item! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete news item! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = $scope.validateNews(news);
                if ($scope.data.news[$scope.data.news.indexOf(news)].formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                if (news.activeFrom !== null)
                    news.tsFrom = news.activeFrom.valueOf() / 1000;
                else
                    news.tsFrom = null;
                if (news.activeUntil !== null)
                    news.tsUntil = news.activeUntil.valueOf() / 1000;
                else
                    news.tsUntil = null;
                if (news.selectedFiles.length < 1){
                    newsFactory.postData({action : 21}, news)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "News has been updated.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "Error: Can not update news! " + data;
                            }
                            console.log(data);
                            $scope.uploading = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not update news! " + data;
                            console.log(data);
                            $scope.uploading = false;
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < news.selectedFiles.length; i++)
                        names.push(news.selectedFiles[i].name);
                    news.selectedFiles.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: news
                        },
                        file: news.selectedFiles,
                        fileFormDataName: names
                    });
                    news.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].images = [];
                                $scope.data.news[$scope.data.news.indexOf(news)].images = angular.copy(response.data.images);
                                news.selectedFiles.length = 0;
                                news.picFile.length = 0;
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = "News has been updated, images have been uploaded.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = 
                                    "Error: Can not update news! " + response.data;
                            }
                            console.log(response.data);
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse = response.status + ': ' + response.data;
                        $scope.uploading = false;
                    });
                    news.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        news.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createNews = function(){
                $scope.newNews.formResponse = $scope.validateNews($scope.newNews);
                if ($scope.newNews.formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                if ($scope.newNews.activeFrom !== null)
                    $scope.newNews.tsFrom = $scope.newNews.activeFrom.valueOf() / 1000;
                else
                    $scope.newNews.tsFrom = null;
                if ($scope.newNews.activeUntil !== null)
                    $scope.newNews.tsUntil = $scope.newNews.activeUntil.valueOf() / 1000;
                else
                    $scope.newNews.tsUntil = null;

                if ($scope.newNews.selectedFiles.length < 1){
                    newsFactory.postData({action : 31}, $scope.newNews)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                var newNews = {};
                                newNews.nid = data.id;
                                newNews.images = angular.copy(data.images);
                                newNews.title = $scope.newNews.title;
                                newNews.description = $scope.newNews.description;
                                if ($scope.newNews.activeFrom > 0)
                                    newNews.activeFrom = new Date($scope.newNews.activeFrom * 1000);
                                else
                                    newNews.activeFrom = null;
                                if ($scope.newNews.activeUntil > 0)
                                    newNews.activeUntil = new Date($scope.newNews.activeUntil * 1000);
                                else
                                    newNews.activeUntil = null;
                                newNews.contactName = $scope.newNews.contactName;
                                newNews.contactEmail = $scope.newNews.contactEmail;
                                newNews.contactPhone = $scope.newNews.contactPhone;
                                newNews.sticky = $scope.newNews.sticky;
                                for (var j = 0; j < $scope.data.people.length; j++)
                                    if ($scope.newNews.contactID.uid === $scope.data.people[j].uid){
                                        newNews.contactID = $scope.data.people[j];
                                        break;
                                    }
                                newNews.show = false;
                                newNews.class = "";
                                newNews.status = 0;
                                newNews.selectedFiles = [];
                                $scope.data.news.push(newNews);
                                $scope.newNews.formResponse = "News has been added.";
                            } else {
                                $scope.newNews.formResponse = "Error: Can not add news 2! " + data;
                            }
                            console.dir(data);
                            $scope.uploading = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not add news 2! " + data;
                            console.log(data);
                            $scope.uploading = false;
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < $scope.newNews.selectedFiles.length; i++)
                        names.push($scope.newNews.selectedFiles[i].name);
                    $scope.newNews.selectedFiles.upload = Upload.upload({
                        url: appURL + 'processData.php?action=3',
                        method: 'POST',
                        fields: {
                            news: $scope.newNews
                        },
                        file: $scope.newNews.selectedFiles,
                        fileFormDataName: names
                    });
                    $scope.newNews.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                var newNews = {};
                                newNews.nid = response.data.id;
                                newNews.images = angular.copy(response.data.images);
                                newNews.title = $scope.newNews.title;
                                newNews.description = $scope.newNews.description;
                                if ($scope.newNews.activeFrom > 0)
                                    newNews.activeFrom = new Date($scope.newNews.activeFrom * 1000);
                                else
                                    newNews.activeFrom = null;
                                if ($scope.newNews.activeUntil > 0)
                                    newNews.activeUntil = new Date($scope.newNews.activeUntil * 1000);
                                else
                                    newNews.activeUntil = null;
                                newNews.contactName = $scope.newNews.contactName;
                                newNews.contactEmail = $scope.newNews.contactEmail;
                                newNews.contactPhone = $scope.newNews.contactPhone;
                                newNews.sticky = $scope.newNews.sticky;
                                for (var j = 0; j < $scope.data.people.length; j++)
                                    if ($scope.newNews.contactID.uid === $scope.data.people[j].uid){
                                        newNews.contactID = $scope.data.people[j];
                                        break;
                                    }
                                newNews.show = false;
                                newNews.class = "";
                                newNews.status = 0;
                                newNews.selectedFiles = [];
                                $scope.data.news.push(newNews);
                                $scope.newNews.formResponse = "News has been added.";
                            } else {
                                $scope.newNews.formResponse = "Error: Can not add news! " + response.data;
                            }
                            console.dir(response.data);
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.newNews.formResponse = response.status + ': ' + response.data;
                        $scope.uploading = false;
                    });
                    $scope.newNews.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.newNews.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
        }])

    .directive('manageNewsList', function() {
        return {
            restrict: 'A',
            controller: 'manageNewsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsList.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })

    .controller('manageAdminsListCtrl', ['$scope', 'newsFactory',
        function manageAdminsListCtrl($scope, newsFactory){

        }])

    .directive('manageAdminsList', function() {
        return {
            restrict: 'A',
            controller: 'manageAdminsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsAdmins.tpl.html'
        };
    })
