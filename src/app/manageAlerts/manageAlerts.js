angular.module('manage.manageAlerts', [])
    .constant('TYPES', [
        {name:'Success', value:0},
        {name:'Warning', value:1},
        {name:'Danger', value:2}
    ])
    .constant('ALERTS_GROUP', 512)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-alerts', {
            controller: 'manageAlertsCtrl',
            templateUrl: 'manageAlerts/manageAlerts.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageAlertsCtrl', ['$scope', 'alertFactory', 'TYPES', 'userData', 'ALERTS_GROUP', 'AuthService',
    function manageAlertsCtrl($scope, alertFactory, TYPES, userData, ALERTS_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.data = {};
        $scope.newAlert = {};
        $scope.newAlert.message = "";
        $scope.newAlert.selType = TYPES[0];
        $scope.newAlert.dateStartDP = new Date();
        $scope.newAlert.dateStartDP.setHours(0,0,0,0);
        $scope.newAlert.dateEndDP = new Date();
        $scope.newAlert.dateEndDP.setHours(0,0,0,0);
        $scope.newAlert.url = "";
        $scope.newAlert.dpStart = false;
        $scope.newAlert.dpEnd = false;

        $scope.uploading = false;

        $scope.sortModes = [
            {by:'message', reverse:false},
            {by:'type', reverse:false},
            {by:'dateStart', reverse:true},
            {by:'dateEnd', reverse:true}
        ];
        $scope.sortMode = $scope.sortModes[2];
        $scope.sortBy = function(by){
            if ($scope.sortMode === by)
                $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
            else
                $scope.sortMode = by;
        };

        $scope.currentPage = 1;
        $scope.maxPageSize = 10;
        $scope.perPage = 20;

        $scope.hasAccess = false;

        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & ALERTS_GROUP) === ALERTS_GROUP) {
                $scope.hasAccess = true;
            }
        }
        alertFactory.getData("all")
            .success(function(data) {
                console.dir(data);
                for (var i = 0; i < data.alerts.length; i++){
                    data.alerts[i].show = false;
                    data.alerts[i].dpStart = false;
                    data.alerts[i].dpEnd = false;
                    data.alerts[i].selType = TYPES[0];
                    for (var j = 1; j < TYPES.length; j++)
                        if (TYPES[j].value == data.alerts[i].type){
                            data.alerts[i].selType = TYPES[j];
                            break;
                        }
                    data.alerts[i].dateStart = new Date(data.alerts[i].dateStart);
                    data.alerts[i].dateStart.setTime(
                        data.alerts[i].dateStart.getTime() +
                        data.alerts[i].dateStart.getTimezoneOffset()*60*1000
                    );
                    data.alerts[i].dateEnd = new Date(data.alerts[i].dateEnd);
                    data.alerts[i].dateEnd.setTime(
                        data.alerts[i].dateEnd.getTime() +
                        data.alerts[i].dateEnd.getTimezoneOffset()*60*1000
                    );
                }
                $scope.data = data;
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.toggleAlerts = function(alert){
            $scope.data.alerts[$scope.data.alerts.indexOf(alert)].show =
                !$scope.data.alerts[$scope.data.alerts.indexOf(alert)].show;
        };

        $scope.validateAlert = function(alert) {
            if (!angular.isDefined(alert.dateStart)) {
                return "Please enter Active From date!";
            }
            if (!angular.isDefined(alert.dateEnd)) {
                return "Please enter Active Until date!";
            }
            if (angular.isDefined(alert.message) && alert.message.length > 10) {
                return "";
            } else {
                return "Please enter alert Message, minimum 10 characters!";
            }
        };

        $scope.deleteAlert = function(alert){
            if (confirm("Delete alert permanently?") == true){
                $scope.uploading = true;
                alert.formResponse = "";
                alertFactory.postData({action : 1}, alert)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.data.alerts.splice($scope.data.alerts.indexOf(alert), 1);
                        } else {
                            alert.formResponse = "Error: Can not delete alert! " + data;
                        }
                        $scope.uploading = false;
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        alert.formResponse = "Error: Could not delete alert! " + data;
                        $scope.uploading = false;
                        console.log(data);
                    });
            }
        };
        $scope.updateAlert = function(alert){
            alert.formResponse = $scope.validateAlert(alert);
            if (alert.formResponse.length < 1) {
                $scope.uploading = true;
                alert.tsStart = alert.dateStart.valueOf() / 1000;
                alert.tsEnd = alert.dateEnd.valueOf() / 1000;
                alertFactory.postData({action: 2}, alert)
                    .success(function (data, status, headers, config) {
                        if (data == 1) {
                            alert.formResponse = "Alert has been updated!";
                        } else {
                            alert.formResponse = "Error: Can not update alert! " + data;
                        }
                        $scope.uploading = false;
                        console.log(data);
                    })
                    .error(function (data, status, headers, config) {
                        alert.formResponse = "Error: Could not update alert! " + data;
                        $scope.uploading = false;
                        console.log(data);
                    });
            }
        };
        $scope.createAlert = function(alert) {
            $scope.newAlert.formResponse = "";
            $scope.newAlert.formResponse = $scope.validateAlert(alert);
            if ($scope.newAlert.formResponse.length < 1) {
                $scope.uploading = true;
                alert.tsStart = alert.dateStart.valueOf() / 1000;
                alert.tsEnd = alert.dateEnd.valueOf() / 1000;
                alertFactory.postData({action: 3}, alert)
                    .success(function (data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)) {
                            var newAlert = {};
                            newAlert = angular.copy(alert);
                            newAlert.aid = data.id;
                            newAlert.show = false;
                            newAlert.selType = TYPES[0];
                            for (var j = 1; j < TYPES.length; j++)
                                if (TYPES[j].value == alert.type) {
                                    newAlert.selType = TYPES[j];
                                    break;
                                }
                            $scope.data.alerts.push(newAlert);
                            $scope.newAlert.formResponse = "Alert has been created.";
                        } else {
                            $scope.newAlert.formResponse = "Error: Can not create alert! " + data;
                        }
                        console.dir(data);
                        $scope.uploading = false;
                    })
                    .error(function (data, status, headers, config) {
                        $scope.newAlert.formResponse = "Error: Could not create alert! " + data;
                        console.log(data);
                        $scope.uploading = false;
                    });
            }
        };
    }])

    .controller('manageAlertFieldsCtrl', ['$scope', 'TYPES',
    function manageAlertFieldsCtrl($scope, TYPES){
        $scope.types = TYPES;
        $scope.dpFormat = 'MM/dd/yyyy';

        $scope.showDatePicker = function(alert, isFrom) {
            if (alert.aid > 0) {
                if (isFrom === true) {
                    $scope.data.alerts[$scope.data.alerts.indexOf(alert)].dpStart = true;
                } else {
                    $scope.data.alerts[$scope.data.alerts.indexOf(alert)].dpEnd = true;
                }
            } else {
                if (isFrom === true) {
                    $scope.alert.dpStart = true;
                } else {
                    $scope.alert.dpEnd = true;
                }
            }
        };

    }])

    .directive('alertsItemFields', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                alert: '=alertdata',
                data: '=list'
            },
            controller: 'manageAlertFieldsCtrl',
            link: function(scope, elm, attrs){
                scope.onAlertDPFocus = function(alert, isFrom){
                    $timeout(function() {
                        scope.showDatePicker(alert, isFrom);
                        scope.$apply();
                    }, 0);
                };
            },
            templateUrl: 'manageAlerts/manageAlertsItemFields.tpl.html'
        };
    }]);

