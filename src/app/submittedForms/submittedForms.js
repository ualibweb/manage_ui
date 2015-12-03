angular.module('manage.submittedForms', ['ngFileUpload'])
    .controller('manageSubFormsCtrl', ['$scope', '$timeout', 'tokenFactory', 'formFactory',
        function manageSubFormsCtrl($scope, $timeout, tokenFactory, formFactory){
            $scope.data = {};
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;
            $scope.titleFilter = '';
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'status', reverse:false},
                {by:'created', reverse:true}
            ];
            $scope.sortMode = 2;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;

            tokenFactory("CSRF-libForms");

            formFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.forms.length; i++){
                        data.forms[i].show = false;
                        data.forms[i].class = "";
                    }
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.toggleForms = function(form){
                $scope.data.forms[$scope.data.forms.indexOf(form)].show =
                    !$scope.data.forms[$scope.data.forms.indexOf(form)].show;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };
        }])

    .directive('submittedFormsList', ['$animate', function($animate) {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'manageSubFormsCtrl',
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
                            console.log("Forms data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'submittedForms/submittedForms.tpl.html'
        };
    }])
    .filter('startFrom', [ function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    }])

    .controller('customFormCtrl', ['$scope', 'formFactory', 'Upload', 'FORMS_URL',
    function customFormCtrl($scope, formFactory, Upload, API){
        $scope.mailToLib = 0;
        $scope.form = {};
        $scope.form.attachment = [];
        $scope.uploading = false;

        $scope.submit = function(event){
            var form = {};
            form.length = event.target.length - 1;
            form.url = event.target.baseURI;
            console.dir(event.target);
            //copy every field but the submit button
            for (var i = 0; i < event.target.length - 1; i++){
                form[i] = {};
                form[i].name = event.target[i].name;
                form[i].value = event.target[i].value;
                if (event.target[i].type == 'checkbox' || event.target[i].type == 'radio')
                    if (!event.target[i].checked)
                        form[i].value = "";
            }
            if ($scope.form.attachment.length < 1) {
                formFactory.submitForm(form)
                    .success(function (data) {
                        $scope.formResponse = data;
                        console.log(data);
                    })
                    .error(function (data, status, headers, config) {
                        $scope.formResponse = "Error! " + data;
                        console.log(data);
                    });
            } else {
                $scope.uploading = true;
                var names = [];
                for (var i = 0; i < $scope.form.attachment.length; i++)
                    names.push($scope.form.attachment[i].name);
                $scope.form.attachment.upload = Upload.upload({
                    url: API + 'api/process/upload',
                    method: 'POST',
                    fields: {
                        form: form
                    },
                    file: form.attachment,
                    fileFormDataName: names
                });
                $scope.form.attachment.upload.then(function(response) {
                    $timeout(function() {
                        $scope.formResponse = response.data;
                        console.dir(response.data);
                        $scope.uploading = false;
                    });
                }, function(response) {
                    $scope.formResponse = response.data;
                    console.dir(response.data);
                    $scope.uploading = false;
                });
                $scope.form.attachment.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.form.attachment.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        };
    }])