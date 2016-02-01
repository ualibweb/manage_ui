angular.module('manage.siteFeedback', [])
    .controller('siteFeedbackCtrl', ['$scope', 'tokenFactory', 'sfFactory', 'wpTestFactory',
        function siteFeedbackCtrl($scope, tokenFactory, sfFactory, wpTestFactory){
            $scope.responses = [];
            $scope.userInfo = {};

            tokenFactory("CSRF-libSiteFeedback");
/*
            sfFactory.getData({json : 1})
                .success(function(data) {
                    console.dir(data);
                    $scope.responses = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });
*/
            wpTestFactory.getCurrentUser()
                .success(function(data) {
                    console.dir(data);
                    $scope.userInfo = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])
    .directive('siteFeedbackList', [ function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'siteFeedbackCtrl',
            templateUrl: 'siteFeedback/siteFeedback.tpl.html'
        };
    }]);
