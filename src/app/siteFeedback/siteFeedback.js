angular.module('manage.siteFeedback', [])
    .controller('siteFeedbackCtrl', ['$scope', '$http', 'sfFactory',
        function siteFeedbackCtrl($scope, $http, sfFactory){
            $scope.responses = [];

            var cookies;
            $scope.GetCSRFCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }

                c = document.cookie.split('; ');
                cookies = {};

                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }
                return cookies[name];
            };
            $http.defaults.headers.post = { "X-CSRF-libSiteFeedback" : $scope.GetCSRFCookie("CSRF-libSiteFeedback") };

            sfFactory.getData({json : 1})
                .success(function(data) {
                    console.dir(data);
                    $scope.responses = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });
        }])
    .directive('siteFeedbackList', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'siteFeedbackCtrl',
            templateUrl: 'siteFeedback/siteFeedback.tpl.html'
        };
    })
