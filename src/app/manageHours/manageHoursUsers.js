angular.module('manage.manageHoursUsers', [])
    .constant('HOURS_GROUP', 2)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-hours-users', {
            controller: 'manageHrsUsersCtrl',
            templateUrl: 'manageHours/manageHoursUsers.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageHrsUsersCtrl', ['$scope', '$animate', 'wpUsersFactory', 'hmFactory', 'userData', 'HOURS_GROUP',
        function manageHrsUsersCtrl($scope, $animate, wpUsersFactory, hmFactory, userData, HOURS_GROUP){
            $scope.isLoading = true;
            $scope.dataUL = {};
            $scope.dataUL.users = [];
            $scope.dataUL.locations = [];
            $scope.wpUsers = [];
            $scope.hasAccess = false;
            if (angular.isDefined($scope.userInfo.group)) {
                if ($scope.userInfo.group & HOURS_GROUP === HOURS_GROUP) {
                    $scope.hasAccess = true;
                }
            }

            wpUsersFactory.getAllUsersWP()
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].fullName = data[i].last_name + ", " + data[i].first_name + " (" + data[i].nickname + ")";
                    }
                    $scope.wpUsers = data;
                    console.dir(data);
                    hmFactory.getData("users")
                        .success(function(data2){
                            for (var i = 0; i < data2.users.length; i++)
                                for (var j = 0; j < $scope.wpUsers.length; j++)
                                    if (data2.users[i].name === $scope.wpUsers[j].login) {
                                        data2.users[i].fullName = $scope.wpUsers[j].fullName;
                                        break;
                                    }
                            $scope.dataUL = data2;
                            $scope.isLoading = false;
                            console.dir(data2);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.isLoading = false;
                        });
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    console.dir(data);
                });

            $scope.tabs = [
                { name: 'Users',
                    number: 0,
                    active: true
                },
                { name: 'Locations',
                    number: 1,
                    active: false
                }];
    }])

    .controller('hrsUserListCtrl', ['$scope', 'hmFactory', function hrsUserListCtrl($scope, hmFactory) {
        $scope.expUser = -1;
        $scope.expUserIndex = -1;
        $scope.newUser = $scope.wpUsers[0];
        $scope.newUserAdmin = false;
        $scope.newUserAccess = [false, false, false, false, false, false, false, false, false, false, false, false];

        $scope.expandUser = function(user){
            if ($scope.expUser != user.uid){
                for (var i = 0; i < $scope.dataUL.users.length; i++)
                    if ($scope.dataUL.users[i].uid == user.uid){
                        $scope.expUserIndex = i;
                        break;
                    }
            }
            $scope.result = "";
            $scope.result2 = "";
            $scope.expUser = user.uid;
        };
        $scope.isExpUser = function(uID){
            if ($scope.expUser === uID)
                return true;
            return false;
        };

        $scope.updateUser = function(user){
            $scope.isLoading = true;
            user.locations = $scope.dataUL.locations;
            hmFactory.postData({action : 8}, user)
                .success(function(data) {
                    if (data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not save data!";
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.result = "Error! Could not save data!";
                    $scope.isLoading = false;
                });
        };

        $scope.createUser = function(user){
            $scope.isLoading = true;
            user.admin = $scope.newUserAdmin;
            user.access = $scope.newUserAccess;
            user.locations = $scope.dataUL.locations;
            hmFactory.postData({action : 9}, user)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result2 = "Access granted!";
                        var createdUser = {};
                        createdUser.name = user.login;
                        createdUser.fullName = user.fullName;
                        createdUser.uid = data.uid;
                        createdUser.role = user.admin;
                        createdUser.access = [];
                        for (var i = 0; i < user.access.length; i++)
                            if (user.access[i])
                                createdUser.access[i] = true;
                            else
                                createdUser.access[i] = false;
                        $scope.dataUL.users.push(createdUser);
                        $scope.expandUser(createdUser);
                    }else
                        $scope.result2 = "Error! Could not grant access!";
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    $scope.result2 = "Error! Could not grant access!";
                });
        };

        $scope.deleteUser = function(user, index){
            if (confirm("Are you sure you want to remove access for " + user.name + "?")){
                $scope.isLoading = true;
                hmFactory.postData({action : 10}, user)
                    .success(function(data) {
                        if (data == 1){
                            $scope.result = "User access deleted!";
                            $scope.dataUL.users.splice(index, 1);
                        } else
                            $scope.result = "Error! Could not delete user access!" + data;
                        $scope.isLoading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.result = "Error! Could not delete user access!";
                        $scope.isLoading = false;
                    });
            }
        };

    }])
    .directive('hoursUserList', [function() {
        return {
            restrict: 'AC',
            controller: 'hrsUserListCtrl',
            templateUrl: 'manageHours/manageUsers.tpl.html'
        };
    }])

    .controller('hrsLocationsCtrl', ['$scope', 'hmFactory', function hrsUserListCtrl($scope, hmFactory) {
        $scope.newLocation = "";
        $scope.newParent = $scope.dataUL.locations[0];

        $scope.createLoc = function(loc, par){
            if (loc.length < 3){
                alert("Library name is too short!");
                return false;
            }
            $scope.isLoading = true;
            var newLoc = {};
            newLoc.name = loc;
            if (typeof par === 'undefined')
                newLoc.parent = "0";
            else
            if (par === null)
                newLoc.parent = "0";
            else
            if (par.lid > 0)
                newLoc.parent = par.lid;
            else
                newLoc.parent = "0";
            hmFactory.postData({action : 11}, newLoc)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        newLoc.lid = data.lid;
                        $scope.dataUL.locations.push(newLoc);
                        $scope.result2 = "Location created!";
                    }else
                        $scope.result2 = "Error! Could not create location!";
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    $scope.result2 = "Error! Could not create location!";
                });
        };
    }])
    .directive('hoursLocationList', [function() {
        return {
            restrict: 'AC',
            controller: 'hrsLocationsCtrl',
            templateUrl: 'manageHours/manageLoc.tpl.html'
        };
    }])
