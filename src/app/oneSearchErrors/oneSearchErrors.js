angular.module('manage.oneSearchErrors', ['oc.lazyLoad'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/onesearch-errors', {
            controller: 'oneSearchErrorsCtrl',
            templateUrl: 'oneSearchErrors/oneSearchErrors.tpl.html',
            resolve: {
                lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('https://d3js.org/d3.v3.min.js');
                }]
            }
        });
    }])

    .controller('oneSearchErrorsCtrl', ['$scope', 'errorsFactory', 'lazyLoad',
        function oneSearchErrorsCtrl($scope, errorsFactory, lazyLoad){
            $scope.errors = {};

            errorsFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    var errors = {};
                    for (var i = 0; i < data.scout.length; i++){
                        var dt = new Date(data.scout[i]);
                        if (!angular.isDefined(errors[dt.getFullYear()])){
                            errors[dt.getFullYear()] = {};
                        }
                        if (!angular.isDefined(errors[dt.getFullYear()][dt.getMonth()])){
                            errors[dt.getFullYear()][dt.getMonth()] = {};
                        }
                        if (!angular.isDefined(errors[dt.getFullYear()][dt.getMonth()][dt.getDate()])){
                            errors[dt.getFullYear()][dt.getMonth()][dt.getDate()] = {counter: 0, errors: []};
                        }
                        errors[dt.getFullYear()][dt.getMonth()][dt.getDate()]['counter']++;
                        errors[dt.getFullYear()][dt.getMonth()][dt.getDate()]['errors'].push(dt);
                    }
                    $scope.errors = errors;
                    console.dir(errors);
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])

    .controller('errorGraphCtrl', ['$scope', function errorGraphCtrl($scope){

    }])

    .directive('errorGraph', ['$window', function($window) {
        return {
            restrict: 'A',
            scope: {
                errors: '='
            },
            controller: 'errorGraphCtrl',
            link: function(scope, elm, attrs){
                var svg = d3.select(elm[0])
                    .append('svg')
                    .style('width', '100%');
                var margin = 20,
                    barHeight = 20,
                    barPadding = 5;

                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };

                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render(scope.errors);
                });

                scope.render = function(data) {

                }
            },
            template: '<div></div>'
        };
    }]);


