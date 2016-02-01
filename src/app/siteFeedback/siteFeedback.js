angular.module('manage.siteFeedback', [])
    .controller('siteFeedbackCtrl', ['$scope', 'tokenFactory', 'wpTestFactory',
        function siteFeedbackCtrl($scope, tokenFactory, wpTestFactory){
            $scope.responses = [];
            $scope.userInfo = {};

            console.log("checking current user...");
            wpTestFactory.getCurrentUser()
                .success(function(data) {
                    console.dir(data);
                    $scope.userInfo = data;
                    console.log("retrieving current user details...");
                    wpTestFactory.getUserDetails($scope.userInfo.id)
                        .success(function(data) {
                            console.dir(data);
                        })
                        .error(function(data, status, headers, config) {
                            console.log(data);
                        });
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
