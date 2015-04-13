angular.module('manage.manageDatabases', [])
    .controller('manageDBCtrl', ['$scope', '$http', 'dbFactory',
        function manageDBCtrl($scope, $http, dbFactory){
            $scope.DBList = {};
            $scope.sortMode = 'Title';
            $scope.filterBy = '';
            $scope.sortButton = 'title';
            $scope.mOver = 0;

            var cookies;
            $scope.GetCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }

                c = document.cookie.split('; ');
                cookies = {};

                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }

                return cookies[name];
            };
            $http.defaults.headers.post = { 'X-CSRF-libDatabases' : $scope.GetCookie("CSRF-libDatabases") };

            dbFactory.getData({all: 1})
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.results.length; i++){
                        data.results[i].show = false;
                        data.results[i].class = "";
                    }
                    $scope.DBList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.toggleDB = function(db){
                $scope.DBList.results[$scope.DBList.results.indexOf(db)].show =
                    !$scope.DBList.results[$scope.DBList.results.indexOf(db)].show;
            };
            $scope.setOver = function(db){
                $scope.mOver = db.id;
            };
        }])

    .directive('databasesManageList', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageDBCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'DBList',
                    function(newVal, oldVal){
                        if (scope.DBList.totalTime > 0){
                            $animate.leave(spinner);
                            console.log("Databases loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageDatabases/manageDatabases.tpl.html'
        };
    })
