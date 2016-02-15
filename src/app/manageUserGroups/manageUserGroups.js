angular.module('manage.manageUserGroups', [])
    .constant('USERS_GROUP', 1)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-user-groups', {
            controller: 'userGroupsCtrl',
            templateUrl: 'manageUserGroups/manageUG.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('userGroupsCtrl', ['$scope', 'wpUsersFactory', 'ugFactory', 'userData', 'USERS_GROUP',
    function userGroupsCtrl($scope, wpUsersFactory, ugFactory, userData, USERS_GROUP){
        $scope.isLoading = true;
        $scope.expUser = -1;
        $scope.wpUsers = [];
        $scope.users = [];
        $scope.apps = [];
        $scope.newUserAccess = [];
        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ($scope.userInfo.group & USERS_GROUP === USERS_GROUP) {
                $scope.hasAccess = true;
            }
        }
        wpUsersFactory.getAllUsersWP()
            .success(function(data) {
                //remove admin accounts
                for (var i = 0; i < data.length; i++) {
                    if (data[i].last_name.length < 1) {
                        data.splice(i, 1);
                    }
                }

                for (i = 0; i < data.length; i++) {
                    data[i].fullName = data[i].last_name + ", " + data[i].first_name + " (" + data[i].nickname + ")";
                }
                $scope.wpUsers = data;
                $scope.newUser = $scope.wpUsers[0];
                console.dir(data);
                ugFactory.getData()
                    .success(function(data2) {
                        $scope.users = data2.users;
                        $scope.apps = data2.apps;
                        for (i = 0; i < $scope.apps.length; i++)
                            $scope.newUserAccess[i] = false;
                        $scope.isLoading = false;
                        console.dir(data2);
                    })
                    .error(function(data2, status, headers, config) {
                        $scope.result = "Error! Could not retrieve user data! " + data2;
                        $scope.isLoading = false;
                        console.dir(data2);
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
            { name: 'Applications',
                number: 1,
                active: false
            }];

        $scope.sortMode = 1;
        $scope.sortModes = [
            {by:'wpLogin', reverse:false},
            {by:'name', reverse:false}
        ];

        $scope.expandUser = function(user){
            $scope.result = "";
            $scope.expUser = user.id;
        };
        $scope.isExpUser = function(uID){
            if ($scope.expUser === uID)
                return true;
            return false;
        };
        $scope.sortBy = function(by){
            if ($scope.sortMode === by)
                $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
            else
                $scope.sortMode = by;
        };

        $scope.updateUser = function(user){
            $scope.isLoading = true;
            ugFactory.postData({action : 1}, user)
                .success(function(data) {
                    if (data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not save data! " + data;
                    $scope.isLoading = false;
                    console.dir(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.result = "Error! Could not save data! " + data;
                    $scope.isLoading = false;
                    console.dir(data);
                });
        };

        $scope.createUser = function(user){
            $scope.isLoading = true;
            user.access = $scope.newUserAccess;
            console.dir(user);
            ugFactory.postData({action : 2}, user)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result2 = "Access granted!";
                        var createdUser = {};
                        createdUser.name = user.name;
                        createdUser.wpLogin = user.login;
                        createdUser.id = data.id;
                        createdUser.access = [];
                        for (var i = 0; i < user.access.length; i++)
                            if (user.access[i])
                                createdUser.access[i] = true;
                            else
                                createdUser.access[i] = false;
                        $scope.users.push(createdUser);
                        $scope.expandUser(createdUser);
                    }else
                        $scope.result2 = "Error! Could not grant access! " + data;
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    $scope.result2 = "Error! Could not grant access! " + data;
                });
        };

        $scope.deleteUser = function(user, index){
            if (confirm("Are you sure you want to remove access for " + user.name + "?")){
                $scope.isLoading = true;
                ugFactory.postData({action : 3}, user)
                    .success(function(data) {
                        if (data == 1){
                            $scope.result = "User access deleted!";
                            $scope.users.splice(index, 1);
                        } else
                            $scope.result = "Error! Could not delete user access! " + data;
                        $scope.isLoading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.result = "Error! Could not delete user access! " + data;
                        $scope.isLoading = false;
                    });
            }
        };

    }])

    .controller('myWebAppsCtrl', ['$scope',
        function myWebAppsCtrl($scope){
            $scope.appsAccess = false;
            if (angular.isDefined($scope.userInfo.group)) {
                $scope.appsAccess = true;
            }
        }])
    .directive('viewMyWebApps', [ function() {
        return {
            restrict: 'A',
            controller: 'myWebAppsCtrl',
            templateUrl: 'manageUserGroups/viewMyWebApps.tpl.html'
        };
    }])