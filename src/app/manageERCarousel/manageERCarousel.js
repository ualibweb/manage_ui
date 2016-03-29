angular.module('manage.manageERCarousel', ['ngFileUpload'])
    .constant('ERC_GROUP', 1024)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-erc', {
            controller: 'manageErcCtrl',
            templateUrl: 'manageERCarousel/manageERCarousel.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageErcCtrl', ['$scope', 'ercFactory', 'userData', 'ERC_GROUP', 'AuthService',
    function manageErcCtrl($scope, ercFactory, userData, ERC_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.slides = {};
        $scope.numShow = 0;
        $scope.admin = false;
        $scope.newSlide = {};
        $scope.newSlide.selectedFiles = [];
        $scope.newSlide.picFile = [];
        $scope.updating = true;

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & ERC_GROUP) === ERC_GROUP) {
                $scope.hasAccess = true;
            }
        }

        ercFactory.slides().get()
            .$promise.then(function(data){
                $scope.updating = false;
                console.dir(data.slides);
                for (var i = 0; i < data.slides.length; i++) {
                    data.slides[i].priority = parseInt(data.slides[i].priority);
                    data.slides[i].show = false;
                    data.slides[i].selectedFiles = [];
                    data.slides[i].tmpPriority = data.slides[i].priority;
                }
                $scope.slides = data.slides;
                $scope.numShow = data.numShow;
                $scope.admin = data.admin;
            }, function(data, status){
                $scope.updating = false;
                console.dir(data);
            });
    }])

    .controller('manageSlideListCtrl', ['$scope', '$timeout', 'Upload', 'ercFactory', 'ERCAROUSEL_URL',
        function manageSlideListCtrl($scope, $timeout, Upload, ercFactory, appURL){
            $scope.appURL = appURL;
            $scope.uploading = false;

            $scope.newSlide.title = '';
            $scope.newSlide.tmpPriority = 0;
            $scope.newSlide.url = '';

            $scope.toggleSlide = function(slide){
                $scope.slides[$scope.slides.indexOf(slide)].show =
                    !$scope.slides[$scope.slides.indexOf(slide)].show;
            };

            $scope.validateSlide = function(slide){
                if (slide.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (slide.url.length < 11)
                    return "Form error: Please fill out URL!";
                return "";
            };
            $scope.approveSlide = function(slide){
                if (confirm("Are you sure you want to approve " + slide.title  + "?") == true){
                    $scope.uploading = true;
                    slide.approve = true;
                    ercFactory.slides().save({slideID: slide.sid}, slide)
                        .$promise.then(function(data){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].status = data.status;
                        }, function(data, status){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = data.message;
                            console.dir(data);
                        });
                }
            };
            $scope.deleteSlide = function(slide){
                if (confirm("Delete " + slide.title  + " permanently?") == true){
                    $scope.uploading = true;
                    slide.approve = true;
                    ercFactory.slides().delete({slideID: slide.sid})
                        .$promise.then(function(data){
                            $scope.uploading = false;
                            $scope.slides.splice($scope.slides.indexOf(slide), 1);
                        }, function(data, status){
                            $scope.uploading = false;
                            $scope.formResponse = "Error: Could not delete slide! " + data;
                            console.dir(data);
                        });
                }
            };
            $scope.updateSlide = function(slide){
                console.dir(slide);
                $scope.slides[$scope.slides.indexOf(slide)].formResponse = $scope.validateSlide(slide);
                if ($scope.slides[$scope.slides.indexOf(slide)].formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                slide.title = slide.title.replace(/\//g, ' ');
                slide.priority = slide.tmpPriority;
                if (slide.selectedFiles.length < 1){
                    ercFactory.slides().save({slideID: slide.sid}, slide)
                        .$promise.then(function(data){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = data.message;
                        }, function(data, status){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = data.message;
                            console.dir(data);
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < slide.selectedFiles.length; i++)
                        names.push(slide.selectedFiles[i].name);
                    slide.selectedFiles.upload = Upload.upload({
                        url: appURL + 'slides/' + slide.sid,
                        method: 'POST',
                        fields: {
                            erCarousel: slide
                        },
                        file: slide.selectedFiles,
                        fileFormDataName: names
                    });
                    slide.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            slide.selectedFiles.length = 0;
                            slide.picFile.length = 0;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = response.data.message;
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0) {
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = response.status + ': ' + response.data;
                        }
                        $scope.uploading = false;
                    });
                    slide.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        slide.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createSlide = function(slide){
                slide.formResponse = $scope.validateSlide(slide);
                if (slide.formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                slide.title = slide.title.replace(/\//g, ' ');
                slide.priority = slide.tmpPriority;
                if (slide.selectedFiles.length > 0){
                    var names = [];
                    for (var i = 0; i < slide.selectedFiles.length; i++)
                        names.push(slide.selectedFiles[i].name);
                    slide.selectedFiles.upload = Upload.upload({
                        url: appURL + 'slides/',
                        method: 'POST',
                        fields: {
                            erCarousel: slide
                        },
                        file: slide.selectedFiles,
                        fileFormDataName: names
                    });
                    slide.selectedFiles.upload.then(function(res) {
                        $timeout(function() {
                            $scope.uploading = false;
                            if (angular.isDefined(res.data.sid) && angular.isDefined(res.data.status) && angular.isDefined(res.data.image)) {
                                var newSlide = {};
                                newSlide.sid = res.data.sid;
                                newSlide.status = res.data.status;
                                newSlide.image = res.data.image;
                                newSlide.title = slide.title;
                                newSlide.priority = slide.priority;
                                newSlide.url = slide.url;
                                newSlide.show = false;
                                newSlide.selectedFiles = [];
                                $scope.slides.push(newSlide);
                            }
                            slide.formResponse = res.data.message;
                        });
                    }, function(response) {
                        $scope.uploading = false;
                        if (response.status > 0)
                            slide.formResponse = response.status + ': ' + response.data;
                    });
                    slide.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        slide.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                } else {
                    slide.formResponse = "Please select a slide image.";
                }
            };
        }])

    .directive('manageSlideList', [ function() {
        return {
            restrict: 'A',
            controller: 'manageSlideListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageERCarousel/manageSlideList.tpl.html'
        };
    }])

    .controller('slideFieldsCtrl', ['$scope', '$timeout', 'Upload',
        function slideFieldsCtrl($scope, $timeout, Upload){
            $scope.generateThumb = function(files, slide) {
                if (files.length > 0 && files !== null) {
                    for (var i = 0; i < files.length; i++){
                        $scope.slide.selectedFiles.push(files[i]);
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

    .directive('slideFieldsList', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                slide: '='
            },
            controller: 'slideFieldsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'manageERCarousel/manageSlideFields.tpl.html'
        };
    }]);
