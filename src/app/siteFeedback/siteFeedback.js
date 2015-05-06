angular.module('manage.siteFeedback', [])
    .controller('siteFeedbackCtrl', ['$scope', 'tokenFactory', 'sfFactory',
        function siteFeedbackCtrl($scope, tokenFactory, sfFactory){
            $scope.responses = [];

            tokenFactory("CSRF-libSiteFeedback");

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
