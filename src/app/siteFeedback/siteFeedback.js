angular.module('manage.siteFeedback', [])
    .controller('siteFeedbackCtrl', ['$scope', 'tokenFactory', 'wpTestFactory', 'AuthService',
        function siteFeedbackCtrl($scope, tokenFactory, wpTestFactory, AuthService){
            $scope.responses = [];
            $scope.userInfo = {};

            console.log("checking current user...");
            wpTestFactory.getCurrentUser()
                .success(function(data) {
                    if (angular.isDefined(data.id)) {
                        console.log("retrieving current user details...");
                        wpTestFactory.getUserDetails(data.id)
                            .success(function (data2) {
                                console.dir(data2);
                                $scope.userInfo = AuthService.isAuthorized();
                            })
                            .error(function (data, status, headers, config) {
                                console.log(data);
                            });
                    }
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
