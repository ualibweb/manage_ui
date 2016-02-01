angular.module('manage.siteFeedback', [])
    .controller('siteFeedbackCtrl', ['$scope', 'tokenFactory', 'wpTestFactory',
        function siteFeedbackCtrl($scope, tokenFactory, wpTestFactory){
            $scope.responses = [];
            $scope.userInfo = {};

            tokenFactory("CSRF-libSiteFeedback");

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
