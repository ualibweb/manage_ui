angular.module('manage.manageUserGroups', [])
    .controller('userGroupsCtrl', ['$scope', '$http', '$window', 'ugFactory',
        function userGroupsCtrl($scope, $http, $window, ugFactory){
        $scope.expUser = -1;
        $scope.users = $window.users;
        $scope.apps = $window.apps;
        $scope.wpUsers = $window.wpUsers;
        $scope.newUser = $scope.wpUsers[0];
        $scope.newUserAccess = [];
        for (var i = 0; i < $scope.apps.length; i++)
            $scope.newUserAccess[i] = false;

        $scope.tabs = [
            { name: 'Users',
                number: 0,
                active: true
            },
            { name: 'Applications',
                number: 1,
                active: false
            }];

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
        $http.defaults.headers.post = { "X-CSRF-libAdmin" : $scope.GetCSRFCookie("CSRF-libAdmin") };

        $scope.expandUser = function(user){
            $scope.result = "";
            $scope.expUser = user.id;
        };
        $scope.isExpUser = function(uID){
            if ($scope.expUser === uID)
                return true;
            return false;
        };

        $scope.updateUser = function(user){
            $scope.isLoading = true;
            ugFactory.postData({action : 1}, user)
                .success(function(data) {
                    if (data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not save data!";
                    $scope.isLoading = false;
                    console.dir(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.result = "Error! Could not save data!";
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
                ugFactory.postData({action : 3}, user)
                    .success(function(data) {
                        if (data == 1){
                            $scope.result = "User access deleted!";
                            $scope.users.splice(index, 1);
                        } else
                            $scope.result = "Error! Could not delete user access!";
                        $scope.isLoading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.result = "Error! Could not delete user access!";
                        $scope.isLoading = false;
                    });
            }
        };

    }])
    .directive('userGroupsList', function() {
        return {
            restrict: 'A',
            scope: {},
            controller: 'userGroupsCtrl',
            templateUrl: 'manageUserGroups/manageUG.tpl.html'
        };
    })
    .controller('myWebAppsCtrl', ['$scope', '$window',
        function myWebAppsCtrl($scope, $window){
            $scope.apps = $window.apps;
            $scope.userName = $window.userName;
        }])
    .directive('viewMyWebApps', function() {
        return {
            restrict: 'A',
            scope: {},
            controller: 'myWebAppsCtrl',
            templateUrl: 'manageUserGroups/viewMyWebApps.tpl.html'
        };
    })