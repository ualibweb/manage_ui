angular.module('manage', [
    'ngAnimate',
    'ui.bootstrap',
    'manage.common',
    'manage.templates',
    'manage.manageHours',
    'manage.manageHoursUsers',
    'manage.manageUserGroups',
    'manage.siteFeedback',
    'manage.manageOneSearch',
    'manage.staffDirectory'
])

    .constant('HOURS_MANAGE_URL', '//wwwdev2.lib.ua.edu/libhours2/')
    .constant('USER_GROUPS_URL', '//wwwdev2.lib.ua.edu/userGroupsAdmin/')
    .constant('SITE_FEEDBACK_URL', '//wwwdev2.lib.ua.edu/siteSurvey/')
    .constant('ONE_SEARCH_URL', '//wwwdev2.lib.ua.edu/oneSearch/')
    .constant('STAFF_DIR_URL', '//wwwdev2.lib.ua.edu/staffDir/')

angular.module('manage.common', [
    'common.manage'
])
angular.module('common.manage', [])

    .factory('hmFactory', ['$http', 'HOURS_MANAGE_URL', function hmFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "manageHours.php", params: params, data: data})
            }
        }
    }])
    .factory('ugFactory', ['$http', 'USER_GROUPS_URL', function ugFactory($http, url){
        return {
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url, params: params, data: data})
            }
        }
    }])
    .factory('sfFactory', ['$http', 'SITE_FEEDBACK_URL', function sfFactory($http, url){
        return {
            getData: function(params){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'GET', url: url, params: params})
            }
        }
    }])
    .factory('osFactory', ['$http', 'ONE_SEARCH_URL', function osFactory($http, url){
        return {
            getData: function(params){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'GET', url: url + "getJSON.php", params: params})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('sdFactory', ['$http', 'STAFF_DIR_URL', function sdFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/people", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }]);

angular.module('manage.manageHours', [])
    .constant('HOURS_FROM', [
        {name:'Closed', value:'-1'},
        {name:'Midnight', value:'0'},
        {name:'1:00 am', value:'100'},
        {name:'2:00 am', value:'200'},
        {name:'3:00 am', value:'300'},
        {name:'4:00 am', value:'400'},
        {name:'5:00 am', value:'500'},
        {name:'6:00 am', value:'600'},
        {name:'7:00 am', value:'700'},
        {name:'7:30 am', value:'730'},
        {name:'7:45 am', value:'745'},
        {name:'8:00 am', value:'800'},
        {name:'9:00 am', value:'900'},
        {name:'10:00 am', value:'1000'},
        {name:'11:00 am', value:'1100'},
        {name:'Noon', value:'1200'},
        {name:'1:00 pm', value:'1300'},
        {name:'2:00 pm', value:'1400'},
        {name:'3:00 pm', value:'1500'},
        {name:'4:00 pm', value:'1600'},
        {name:'4:30 pm', value:'1630'},
        {name:'5:00 pm', value:'1700'},
        {name:'5:30 pm', value:'1730'},
        {name:'6:00 pm', value:'1800'},
        {name:'7:00 pm', value:'1900'},
        {name:'8:00 pm', value:'2000'},
        {name:'9:00 pm', value:'2100'},
        {name:'10:00 pm', value:'2200'},
        {name:'11:00 pm', value:'2300'}
    ])
    .constant('HOURS_TO', [
        {name:'Closed', value:'0'},
        {name:'1:00 am', value:'100'},
        {name:'2:00 am', value:'200'},
        {name:'3:00 am', value:'300'},
        {name:'4:00 am', value:'400'},
        {name:'5:00 am', value:'500'},
        {name:'6:00 am', value:'600'},
        {name:'7:00 am', value:'700'},
        {name:'7:30 am', value:'730'},
        {name:'7:45 am', value:'745'},
        {name:'8:00 am', value:'800'},
        {name:'9:00 am', value:'900'},
        {name:'10:00 am', value:'1000'},
        {name:'11:00 am', value:'1100'},
        {name:'Noon', value:'1200'},
        {name:'1:00 pm', value:'1300'},
        {name:'2:00 pm', value:'1400'},
        {name:'3:00 pm', value:'1500'},
        {name:'4:00 pm', value:'1600'},
        {name:'4:30 pm', value:'1630'},
        {name:'5:00 pm', value:'1700'},
        {name:'5:30 pm', value:'1730'},
        {name:'6:00 pm', value:'1800'},
        {name:'7:00 pm', value:'1900'},
        {name:'8:00 pm', value:'2000'},
        {name:'9:00 pm', value:'2100'},
        {name:'10:00 pm', value:'2200'},
        {name:'11:00 pm', value:'2300'},
        {name:'Midnight', value:'2400'}
    ])

    .controller('manageHrsCtrl', ['$scope', '$http', '$animate', 'hmFactory', 'HOURS_FROM', 'HOURS_TO',
        function manageHrsCtrl($scope, $http, $animate, hmFactory, hoursFrom, hoursTo){
            $scope.allowedLibraries = [];
            $scope.isLoading = false;
            $scope.hrsFrom = hoursFrom;
            $scope.hrsTo = hoursTo;
            $scope.selLib = 0;

            var cookies;
            $scope.GetCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }

                c = document.cookie.split('; ');
                cookies = {};

                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }

                return cookies[name];
            };
            $http.defaults.headers.post = { 'X-CSRF-libHours' : $scope.GetCookie("CSRF-libHours") };

            hmFactory.getData("semesters")
                .success(function(data) {
                    console.dir(data);
                    for (var lib = 0; lib < data.exc.length; lib++)
                        for (var ex = 0; ex < data.exc[lib].ex.length; ex++){
                            data.exc[lib].ex[ex].datems = new Date(data.exc[lib].ex[ex].date * 1000);
                        }
                    $scope.allowedLibraries = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'Semesters',
                    number: 0,
                    active: true
                },
                { name: 'Exceptions',
                    number: 1,
                    active: false
                }];

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
            $scope.format = $scope.formats[4];
    }])

    .directive('manageHours', function($animate) {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'manageHrsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm);

                var loadingWatcher = scope.$watch(
                    'allowedLibraries',
                    function(newVal, oldVal){
                        if (scope.allowedLibraries.totalTime > 0){
                            $animate.leave(spinner);
                            console.log("Hours loaded");
                        }
                    }
                );
            },
            templateUrl: 'manageHours/manageHours.tpl.html'
        };
    })

    .controller('semListCtrl', ['$scope', 'hmFactory', function semListCtrl($scope, hmFactory) {
        $scope.expSem = -1;
        $scope.weekHrs = [];
        $scope.loading = false;
        $scope.newSemester = {};
        $scope.newSemester.dow = [];

        function init(){
            for (var day = 0; day < 7; day++) {
                $scope.newSemester.dow[day] = {};
                $scope.newSemester.dow[day].from = -1;
                $scope.newSemester.dow[day].to = 0;
            }
        }
        init();

        $scope.expandSem = function(semester){
            if ($scope.expSem !== semester.dsid) {
                $scope.result = "";
                $scope.resultDel = "";
                for (var i = 0; i < 7; i++) {
                    var len = $scope.hrsFrom.length;
                    $scope.weekHrs[i] = {};
                    $scope.weekHrs[i].from = $scope.hrsFrom[0];
                    $scope.weekHrs[i].to = $scope.hrsTo[0];
                    for (var j = 0; j < len; j++) {
                        if ($scope.hrsFrom[j].value == semester.dow[i].from) {
                            $scope.weekHrs[i].from = $scope.hrsFrom[j];
                        }
                        if ($scope.hrsTo[j].value == semester.dow[i].to) {
                            $scope.weekHrs[i].to = $scope.hrsTo[j];
                        }
                    }
                }
            }
            $scope.expSem = semester.dsid;
        };
        $scope.isExpSem = function(semID){
            if ($scope.expSem === semID)
                return true;
            return false;
        };

        $scope.saveChanges = function(semester){
            semester.lid = $scope.allowedLibraries.sem[$scope.selLib].library.lid;
            $scope.loading = true;
            hmFactory.postData({action : 1}, semester)
                .success(function(data) {
                    if (data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not save data!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };
        $scope.deleteSem = function(semester){
            if (confirm("Are you sure you want to delete " + semester.name + " semester?")){
                $scope.loading = true;
                semester.lid = $scope.allowedLibraries.sem[$scope.selLib].library.lid;
                hmFactory.postData({action : 3}, semester)
                    .success(function(data) {
                        if ((typeof data === 'object') && (data !== null)){
                            $scope.result = "Semester deleted";
                            $scope.allowedLibraries.sem[$scope.selLib] = data;
                        } else
                            $scope.result = "Error! Could not delete semester!";
                        $scope.loading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.loading = false;
                    });
            }
        };
        $scope.createSem = function(){
            $scope.loading = true;
            $scope.newSemester.lid = $scope.allowedLibraries.sem[$scope.selLib].library.lid;
            hmFactory.postData({action : 2}, $scope.newSemester)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result = "Semester created";
                        $scope.allowedLibraries.sem[$scope.selLib] = data;
                    }else
                        $scope.result = "Error! Could not create semester!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };
    }])

    .directive('semesterList', function() {
        return {
            require: '^manageHours',
            restrict: 'AC',
            controller: 'semListCtrl',
            templateUrl: 'manageHours/manageSem.tpl.html'
        };
    })

    .controller('exListCtrl', ['$scope', 'hmFactory', function exListCtrl($scope, hmFactory) {
        $scope.newException = {};
        $scope.newException.from = -1;
        $scope.newException.to = 0;
        $scope.newException.datepicker = false;
        $scope.dpOpen = false;
        $scope.expExc = -1;
        $scope.blurCount = 0;

        $scope.onExcFocus = function($event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dpOpen = true;
            $scope.blurCount = 0;
            console.log("focus = " + $scope.dpOpen);
        };
        $scope.onExcBlur = function($event){
            if ($scope.blurCount > 0){
                $event.preventDefault();
                $event.stopPropagation();
                $scope.dpOpen = false;
            }
            $scope.blurCount++;
            console.log("blur = " + $scope.dpOpen + ", count = " + $scope.blurCount);
        };
        $scope.expandExc = function(exception){
            if ($scope.expExc != exception.id){
                $scope.result = "";
                $scope.resultDel = "";
                $scope.dpOpen = false;
            }
            $scope.expExc = exception.id;
        };
        $scope.isExpExc = function(excID){
            if ($scope.expExc === excID)
                return true;
            return false;
        };
        $scope.updateExc = function(exception){
            $scope.loading = true;
            hmFactory.postData({action : 4}, exception)
                .success(function(data) {
                    if ( data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not update exception!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };

        $scope.deleteExc = function(exception, index){
            if (confirm("Are you sure you want to delete " + exception.desc + " exception?")){
                $scope.loading = true;
                hmFactory.postData({action : 5}, exception)
                    .success(function(data) {
                        if ( data == 1){
                            $scope.allowedLibraries.exc[$scope.selLib].ex.splice(index, 1);
                            $scope.expExc = -1;
                        } else
                            $scope.result = "Error! Could not delete exception!";
                        $scope.loading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.loading = false;
                    });
            }
        };

        $scope.createExc = function(){
            $scope.loading = true;
            $scope.newException.lid = $scope.allowedLibraries.sem[$scope.selLib].library.lid;
            hmFactory.postData({action : 6}, $scope.newException)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result = "Exception created";
                        $scope.newException.id = data.id;
                        $scope.allowedLibraries.exc[$scope.selLib].ex.push($scope.newException);
                    }else
                        $scope.result = "Error! Could not create an exception!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };

        $scope.deleteOldExc = function(){
            $scope.loading = true;
            hmFactory.postData({action : 7}, $scope.allowedLibraries.sem[$scope.selLib].library.lid)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.expExc = -1;
                        $scope.allowedLibraries.exc[$scope.selLib] = data;
                        $scope.resultDel = "Outdated exceptions deleted";
                    } else
                        $scope.resultDel = "Error! Could not delete exceptions!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };
    }])
    .directive('exceptionList', function($timeout) {
        return {
            require: '^manageHours',
            restrict: 'AC',
            controller: 'exListCtrl',
            link: function(scope, elem, attrs) {

            },
            templateUrl: 'manageHours/manageEx.tpl.html'
        };
    })

angular.module('manage.manageHoursUsers', [])
    .controller('manageHrsUsersCtrl', ['$scope', '$http', '$window', '$animate', 'hmFactory',
        function manageHrsUsersCtrl($scope, $http, $window, $animate, hmFactory){
            $scope.isLoading = true;
            $scope.dataUL = {};
            $scope.dataUL.users = [];
            $scope.dataUL.locations = [];
            $scope.user = {};
            $scope.user.name = $window.userName;

            var cookies;
            $scope.GetCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }

                c = document.cookie.split('; ');
                cookies = {};

                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }

                return cookies[name];
            };
            $http.defaults.headers.post = { 'X-CSRF-libHours' : $scope.GetCookie("CSRF-libHours") };

            hmFactory.getData("users")
                .success(function(data){
                    $scope.dataUL = data;
                    $scope.isLoading = false;
                    console.dir(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
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

    .controller('hrsUserListCtrl', ['$scope', '$window', 'hmFactory', function hrsUserListCtrl($scope, $window, hmFactory) {
        $scope.expUser = -1;
        $scope.expUserIndex = -1;
        $scope.users = $window.users;
        $scope.newUser = $scope.users[0];
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
    .directive('hoursUserList', function() {
        return {
            restrict: 'AC',
            controller: 'hrsUserListCtrl',
            templateUrl: 'manageHours/manageUsers.tpl.html'
        };
    })

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
    .directive('hoursLocationList', function() {
        return {
            restrict: 'AC',
            controller: 'hrsLocationsCtrl',
            templateUrl: 'manageHours/manageLoc.tpl.html'
        };
    })

angular.module('manage.manageOneSearch', [])
    .controller('manageOneSearchCtrl', ['$scope', '$http', 'osFactory',
        function manageOneSearchCtrl($scope, $http, osFactory){
            $scope.recList = [];
            $scope.addRec = {};
            $scope.addRec.keyword = "";
            $scope.addRec.link = "";
            $scope.addRec.title = "";
            $scope.response = "";

            var cookies;
            $scope.GetCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }

                c = document.cookie.split('; ');
                cookies = {};

                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }
                return cookies[name];
            };
            $http.defaults.headers.post = { 'X-CSRF-libOneSearch' : $scope.GetCookie("CSRF-libOneSearch") };

            osFactory.getData({recList : 1})
                .success(function(data) {
                    console.dir(data);
                    $scope.recList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.addRecommendation = function(){
                if ( ($scope.addRec.keyword.length > 0) && ($scope.addRec.link.length > 0) && ($scope.addRec.title.length > 0) )
                {
                    osFactory.postData({addRec : 1}, $scope.addRec)
                        .success(function(data, status, headers, config) {
                            console.dir(data);
                            if ((typeof data === 'object') && (data !== null)){
                                var newRec = {};
                                newRec.id = data.rid;
                                newRec.linkid = data.lid;
                                newRec.keyword = $scope.addRec.keyword;
                                newRec.link = $scope.addRec.link;
                                newRec.description = $scope.addRec.title;
                                $scope.recList.RecList.push(newRec);
                                $scope.response = data.text;
                            } else
                                $scope.response = data;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not add recommendation link! " + data;
                        });
                }
            };
            $scope.deleteRec = function(rec, index){
                if (confirm("Are you sure you want to delete " + rec.description + " link?")){
                    osFactory.postData({delRec : 1}, rec)
                        .success(function(data, status, headers, config) {
                            $scope.response = data;
                            $scope.recList.RecList.splice(index, 1);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not delete recommendation! " + data;
                        });
                }
            };
        }])
    .directive('recommendeLinksList', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'manageOneSearchCtrl',
            templateUrl: 'manageOneSearch/manageOneSearch.tpl.html'
        };
    })
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
            restrict: 'AC',
            scope: {},
            controller: 'userGroupsCtrl',
            templateUrl: 'manageUserGroups/manageUG.tpl.html'
        };
    })

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

angular.module('manage.staffDirectory', [])
    .constant('STAFF_DIR_RANKS', [
        "",
        "Prof.",
        "Asso. Prof.",
        "Asst. Prof."
    ])
    .constant('STAFF_DIR_DEPTS', [
        "Acquisitions",
        "Annex Services",
        "Area Computing Services",
        "Business Library",
        "Business Office",
        "Cataloging & Metadata Services",
        "Collection Management",
        "Digital Humanities Center",
        "Digital Services",
        "Education Library",
        "Electronic Resources",
        "Gorgas Information Services",
        "Gorgas Library, Circulation Department",
        "Government Documents",
        "Health Sciences Library",
        "ILS & E-Resources Management",
        "Interlibrary Loan",
        "Library Administration",
        "Office of Library Technology",
        "Sanford Media Center",
        "School of Social Work",
        "Science and Engineering Library",
        "Special Collections",
        "Web Infrastructure & Application Development",
        "Web Services"
    ])

    .controller('staffDirCtrl', ['$scope', '$http', '$window', 'sdFactory', 'STAFF_DIR_RANKS', 'STAFF_DIR_DEPTS', 'STAFF_DIR_URL',
        function staffDirCtrl($scope, $http, $window, sdFactory, ranks, departments, appUrl){
            $scope.sortMode = 'lastname';
            $scope.filterBy = '';
            $scope.sortButton = 'last';
            $scope.Directory = {};
            $scope.hasAccess = $window.isAdmin;
            $scope.ranks = ranks;
            $scope.departments = departments;
            $scope.mOver = 0;

            var cookies;
            $scope.GetCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }

                c = document.cookie.split('; ');
                cookies = {};

                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }
                return cookies[name];
            };
            $http.defaults.headers.post = { 'X-CSRF-libStaffDir' : $scope.GetCookie("CSRF-libStaffDir") };

            sdFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    $scope.Directory = data;
                    for (var i = 0; i < $scope.Directory.list.length; i++){
                        $scope.Directory.list[i].selSubj = $scope.Directory.subjects[0];
                        $scope.Directory.list[i].class = "";
                        $scope.Directory.list[i].image = appUrl + "staffImages/" + $scope.Directory.list[i].id + ".jpg";
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.togglePerson = function(person){
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].show =
                    !$scope.Directory.list[$scope.Directory.list.indexOf(person)].show;
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "";
            };

            $scope.setOver = function(person){
                $scope.mOver = person.id;
            };

            $scope.resetNewPersonForm = function(){
                $scope.formData.first = "";
                $scope.formData.last = "";
                $scope.formData.email = "";
                $scope.formData.phone = "";
                $scope.formData.fax = "";
            };

            $scope.deletePerson = function(person, index){
                if (confirm("Delete " + person.lastname + ", " + person.firstname  + " record permanently?") == true){
                    sdFactory.postData({delete : 1}, person)
                        .success(function(data, status, headers, config) {
                            $scope.formResponse = data;
                            $scope.Directory.list.splice(index, 1);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete person data! " + data;
                        });
                }
            };
            $scope.updatePerson = function(person){
                sdFactory.postData({update : person.id}, person)
                    .success(function(data, status, headers, config) {
                        $scope.formResponse = "Person has been updated!";
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Person update failed! " + data;
                    });
            };
            $scope.deleteSubject = function(person, subjectID, index){
                if (confirm("Delete this subject from " + person.firstname + " " + person.lastname + "?") == true){
                    sdFactory.postData({deleteSubject : subjectID}, {})
                        .success(function(data, status, headers, config) {
                            $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.splice(index, 1);
                            $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Subject Deleted!";
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse =
                                "Error: Could not delete subject! " + data;
                        });
                }
            };
            $scope.addSubject = function(person){
                sdFactory.postData({addSubject : 1}, person)
                    .success(function(data, status, headers, config) {
                        var newSubj = {};
                        newSubj.id = person.selSubj.id;
                        newSubj.subject = person.selSubj.subject;
                        newSubj.link = person.selSubj.link;
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.push(newSubj);
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Subject Added!";
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse =
                            "Error: Could not add subject! " + data;
                    });
            };

            $scope.formData = {};
            $scope.formData.first = "";
            $scope.formData.last = "";
            $scope.formData.email = "";
            $scope.formData.title = "";
            $scope.formData.phone = "";
            $scope.formData.fax = "";
            $scope.formData.rank = ranks[0];
            $scope.formData.dept = departments[0];
            $scope.formResponse = '';

            $scope.isValidEmailAddress = function(emailAddress) {
                var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
                return pattern.test(emailAddress);
            };

            $scope.addPerson = function() {
                $scope.formResponse = '';
                if ( $scope.formData.first.length > 0 )
                {
                    if ( $scope.formData.last.length > 0 )
                    {
                        if ( $scope.isValidEmailAddress( $scope.formData.email) )
                        {
                            if ( $scope.formData.title.length > 0 )
                            {
                                if ( $scope.formData.phone.length >= 7 )
                                {
                                    if ( $scope.formData.fax.length >= 7 )
                                    {
                                        sdFactory.postData({}, $scope.formData)
                                            .success(function(data, status, headers, config) {
                                                if ((typeof data === 'object') && (data !== null)){
                                                    var createdUser = {};
                                                    createdUser.id = data.id;
                                                    createdUser.lastname = $scope.formData.last;
                                                    createdUser.firstname = $scope.formData.first;
                                                    createdUser.title = $scope.formData.title;
                                                    createdUser.rank = $scope.formData.rank;
                                                    createdUser.department = $scope.formData.dept;
                                                    createdUser.division = "";
                                                    createdUser.phone = $scope.formData.phone;
                                                    createdUser.email = $scope.formData.email;
                                                    createdUser.fax = $scope.formData.fax;
                                                    createdUser.subjects = [];
                                                    createdUser.show = false;
                                                    createdUser.selSubj = $scope.Directory.subjects[0];
                                                    createdUser.class = "";
                                                    createdUser.image = appUrl + "staffImages/" + createdUser.id + ".jpg";
                                                    $scope.Directory.list.push(createdUser);
                                                    $scope.resetNewPersonForm();
                                                    $scope.formResponse = "Person has been added!";
                                                } else
                                                    $scope.formResponse = "Error: Person could not be added! " + data;
                                            })
                                            .error(function(data, status, headers, config) {
                                                $scope.formResponse = "Error: Person Creation failed! " + data;
                                            });
                                    } else
                                        alert("Fax number is too short!");
                                } else
                                    alert("Phone number is too short!");
                            } else
                                alert("Title is too short!");
                        } else
                            alert("User email is invalid!");
                    } else
                        alert("Last Name is too short!");
                } else
                    alert("First Name is too short!");
            };
        }])
    .directive('staffDirectoryList', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'staffDirCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm);

                var loadingWatcher = scope.$watch(
                    'allowedLibraries',
                    function(newVal, oldVal){
                        if (scope.Directory.totalTime > 0){
                            $animate.leave(spinner);
                            console.log("Staff Directory loaded");
                        }
                    }
                );
            },
            templateUrl: 'staffDirectory/staffDirectory.tpl.html'
        };
    })