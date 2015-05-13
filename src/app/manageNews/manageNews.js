angular.module('manage.manageNews', ['ngFileUpload'])
    .controller('manageNewsCtrl', ['$scope', '$window', '$timeout', 'tokenFactory', 'newsFactory',
        function manageNewsCtrl($scope, $window, $timeout, tokenFactory, newsFactory){
            $scope.data = {};
            $scope.dpFormat = 'MM/dd/yyyy';
            $scope.newNews = {};
            $scope.newNews.creator = $window.author;
            $scope.newExh = {};
            $scope.newExh.creator = $window.author;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'activeFrom', reverse:false},
                {by:'activeUntil', reverse:false}
            ];

            tokenFactory("CSRF-libNews");

            newsFactory.getData("all")
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.news.length; i++){
                        data.news[i].activeFrom = new Date(data.news[i].activeFrom * 1000);
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
                    }
                    for (var i = 0; i < data.exhibitions.length; i++){
                        data.exhibitions[i].activeFrom = new Date(data.exhibitions[i].activeFrom * 1000);
                        data.exhibitions[i].activeUntil = new Date(data.exhibitions[i].activeUntil * 1000);
                        for (var j = 0; j < data.people.length; j++)
                            if (data.exhibitions[i].contactID.uid === data.people[j].uid){
                                data.exhibitions[i].contactID = data.people[j];
                                break;
                            }
                        data.exhibitions[i].show = false;
                        data.exhibitions[i].class = "";
                        data.exhibitions[i].dpFrom = false;
                        data.exhibitions[i].dpUntil = false;
                    }
                    $scope.newNews.contactID = data.people[0];
                    $scope.newExh.contactID = data.people[0];
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'News',
                    number: 0,
                    active: true
                },
                { name: 'Exhibitions',
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
            $scope.generateThumb = function(file) {
                if (file != null) {
                    if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.dataUrl = e.target.result;
                                });
                            }
                        });
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

    .controller('manageNewsListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageNewsListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newNews.type = 0; // news
            $scope.newNews.activeFrom = new Date();
            $scope.newNews.activeUntil = new Date();
            $scope.newNews.dpFrom = false;
            $scope.newNews.dpUntil = false;

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
            $scope.setOver = function(news){
                $scope.mOver = news.nid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
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
                news.tsFrom = news.activeFrom.valueOf() / 1000;
                news.tsUntil = news.activeUntil.valueOf() / 1000;
                if (typeof news.picFile === 'undefined'){
                    newsFactory.postData({action : 21}, news)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "News has been updated, Icon has not changed.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "Error: Can not update news! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not update news! " + data;
                            console.log(data);
                        });
                } else {
                    news.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: news
                        },
                        file: news.picFile,
                        fileFormDataName: 'editNewsExh' + news.nid
                    });
                    news.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = "News has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.data.news[$scope.data.news.indexOf(news)].formResponse += "Icon uploaded.";
                                else
                                    $scope.data.news[$scope.data.news.indexOf(news)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = 
                                    "Error: Can not update news! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse = response.status + ': ' + response.data;
                    });
                    news.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        news.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createNews = function(){
                if (typeof $scope.newNews.picFile === 'undefined'){
                    $scope.newNews.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newNews.formResponse = $scope.validateNews($scope.newNews);
                if ($scope.newNews.formResponse.length > 0)
                    return false;
                $scope.newNews.tsFrom = $scope.newNews.activeFrom.valueOf() / 1000;
                $scope.newNews.tsUntil = $scope.newNews.activeUntil.valueOf() / 1000;
                $scope.newNews.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        news: $scope.newNews
                    },
                    file: $scope.newNews.picFile,
                    fileFormDataName: 'addNewsExh'
                });
                $scope.newNews.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newNews = {};
                            newNews.nid = response.data.id;
                            newNews.title = $scope.newNews.title;
                            newNews.description = $scope.newNews.description;
                            newNews.show = false;
                            newNews.class = "";
                            $scope.data.news.push(newNews);
                            $scope.newNews.formResponse = "News has been added.";
                        } else {
                            $scope.newNews.formResponse = "Error: Can not add news! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newNews.formResponse = response.status + ': ' + response.data;
                });
                $scope.newNews.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newNews.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
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
    .controller('manageExhListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageExhListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newExh.type = 1;//exhibition
            $scope.newExh.activeFrom = new Date();
            $scope.newExh.activeUntil = new Date();
            $scope.newExh.dpFrom = false;
            $scope.newExh.dpUntil = false;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.onExhDPFocusFrom = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.exhibitions[index].dpFrom = true;
                else
                    $scope.newExh.dpFrom = true;
            };
            $scope.onExhDPFocusUntil = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.exhibitions[index].dpUntil = true;
                else
                    $scope.newExh.dpUntil = true;
            };

            $scope.toggleExhibitions = function(exh){
                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].show =
                    !$scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].show;
            };
            $scope.setOver = function(exh){
                $scope.mOver = exh.nid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteExhibition = function(exh){
                if (confirm("Delete " + exh.title  + " permanently?") == true){
                    newsFactory.postData({action : 1}, exh)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.exhibitions.splice($scope.data.exhibitions.indexOf(exh), 1);
                                $scope.formResponse = "Exhibition item has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete exhibition item! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete Exhibition item! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateExhibition = function(exh){
                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = $scope.validateNews(exh);
                if ($scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse.length > 0)
                    return false;
                exh.tsFrom = exh.activeFrom.valueOf() / 1000;
                exh.tsUntil = exh.activeUntil.valueOf() / 1000;
                if (typeof exh.picFile === 'undefined'){
                    newsFactory.postData({action : 21}, exh)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Exhibition has been updated, Icon has not changed.";
                            } else {
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Error: Can not update Exhibition! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                "Error: Could not update Exhibition! " + data;
                            console.log(data);
                        });
                } else {
                    exh.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: exh
                        },
                        file: exh.picFile,
                        fileFormDataName: 'editNewsExh' + exh.nid
                    });
                    exh.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = "Exhibition has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse += "Icon uploaded.";
                                else
                                    $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Error: Can not update Exhibition! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = response.status + ': ' + response.data;
                    });
                    exh.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        exh.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createExhibition = function(){
                if (typeof $scope.newExh.picFile === 'undefined'){
                    $scope.newExh.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newExh.formResponse = $scope.validateNews($scope.newExh);
                if ($scope.newExh.formResponse.length > 0)
                    return false;
                $scope.newExh.tsFrom = $scope.newExh.activeFrom.valueOf() / 1000;
                $scope.newExh.tsUntil = $scope.newExh.activeUntil.valueOf() / 1000;
                $scope.newExh.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        news: $scope.newExh
                    },
                    file: $scope.newExh.picFile,
                    fileFormDataName: 'addNewsExh'
                });
                $scope.newExh.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newExh = {};
                            newExh.nid = response.data.id;
                            newExh.title = $scope.newExh.title;
                            newExh.description = $scope.newExh.description;
                            newExh.show = false;
                            newExh.class = "";
                            $scope.data.exhibitions.push(newExh);
                            $scope.newExh.formResponse = "Exhibition has been added.";
                        } else {
                            $scope.newExh.formResponse = "Error: Can not add Exhibition! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newExh.formResponse = response.status + ': ' + response.data;
                });
                $scope.newExh.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newExh.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };
        }])
    .directive('manageExhibitionsList', function() {
        return {
            restrict: 'A',
            controller: 'manageExhListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageExhibitionsList.tpl.html'
        };
    })


    .controller('viewNEECtrl', ['$scope', '$timeout', 'newsFactory',
        function viewNEECtrl($scope, $timeout, newsFactory){
            $scope.data = {};

            newsFactory.getData("today")
                .success(function(data) {
                    console.dir(data);
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])

    .directive('viewNewsEventsExhibitions', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'viewNEECtrl',
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
            templateUrl: 'manageNews/viewNewsEventsExhibitions.tpl.html'
        };
    })
