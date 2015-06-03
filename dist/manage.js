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
    'manage.staffDirectory',
    'manage.manageDatabases',
    'manage.manageSoftware',
    'manage.manageNews',
    'manage.submittedForms'
])

    .constant('HOURS_MANAGE_URL', '//wwwdev2.lib.ua.edu/libhours2/')
    .constant('USER_GROUPS_URL', '//wwwdev2.lib.ua.edu/userGroupsAdmin/')
    .constant('SITE_FEEDBACK_URL', '//wwwdev2.lib.ua.edu/siteSurvey/')
    .constant('ONE_SEARCH_URL', '//wwwdev2.lib.ua.edu/oneSearch/')
    .constant('STAFF_DIR_URL', '//wwwdev2.lib.ua.edu/staffDir/')
    .constant('DATABASES_URL', '//wwwdev2.lib.ua.edu/databases/')
    .constant('SOFTWARE_URL', '//wwwdev2.lib.ua.edu/softwareList/')
    .constant('FORMS_URL', '//wwwdev2.lib.ua.edu/form/')
    .constant('NEWS_URL', '//wwwdev2.lib.ua.edu/newsApp/')

angular.module('manage.common', [
    'common.manage'
])
angular.module('common.manage', [])


    .factory('tokenFactory', ['$http', function tokenFactory($http){
        return function(tokenName){
            var cookies;
            this.GetCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }
                c = document.cookie.split('; ');
                cookies = {};
                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }
                return cookies[name];
            };
            var header = {};
            header["X-" + tokenName] = this.GetCookie(tokenName);
            $http.defaults.headers.post = header;
        }
    }])

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
            getData: function(){
                return $http({method: 'GET', url: url + "api/reclist", params: {}})
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
    }])
    .factory('mdbFactory', ['$http', 'DATABASES_URL', function mdbFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('swFactory', ['$http', 'SOFTWARE_URL', function swFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('newsFactory', ['$http', 'NEWS_URL', function newsFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('formFactory', ['$http', 'FORMS_URL', function formFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            },
            submitForm: function(data){
                return $http({method: 'POST', url: url + "api/process", params: {}, data: data})
            }
        }
    }])

angular.module('manage.manageDatabases', [])
    .controller('manageDBCtrl', ['$scope', '$window', 'tokenFactory', 'mdbFactory',
        function manageDBCtrl($scope, $window, tokenFactory, mdbFactory){
            $scope.DBList = {};
            $scope.titleFilter = '';
            $scope.titleStartFilter = '';
            $scope.descrFilter = '';
            $scope.subjectFilter = '';
            $scope.typeFilter = '';
            $scope.disValues = [
                {name:'Show all', value:''},
                {name:'Enabled only', value:'0'},
                {name:'Disabled only', value:'1'}
            ];
            $scope.disFilter = $scope.disValues[0];
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'dateCreated', reverse:false},
                {by:'lastModified', reverse:false},
                {by:'tmpDisabled', reverse:true}
                ];
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.newDB = {};
            $scope.newDB.updatedBy = $window.userName;
            $scope.newDB.subjects = [];
            $scope.newDB.types = [];
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            //primary, secondary
            $scope.subjectValues = [ 1, 2 ];

            tokenFactory("CSRF-libDatabases");

            mdbFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.databases.length; i++){
                        data.databases[i].show = false;
                        data.databases[i].class = "";
                        data.databases[i].selSubj = data.subjects[0];
                        data.databases[i].subjType = 1;
                        data.databases[i].selType = data.types[0];
                    }
                    $scope.newDB.selSubj = data.subjects[0];
                    $scope.newDB.subjType = 1;
                    $scope.newDB.selType = data.types[0];
                    $scope.DBList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.startTitle = function(actual, expected){
                if (!expected)
                    return true;
                if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                    return true;
                return false;
            };
            $scope.toggleDB = function(db){
                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].show =
                    !$scope.DBList.databases[$scope.DBList.databases.indexOf(db)].show;
            };
            $scope.setOver = function(db){
                $scope.mOver = db.id;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteDB = function(db){
                if (confirm("Delete " + db.title  + " permanently?") == true){
                    mdbFactory.postData({action : 1}, db)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.DBList.databases.splice($scope.DBList.databases.indexOf(db), 1);
                                $scope.formResponse = "Database has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete database! " + data;
                            }
                            alert($scope.formResponse);
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete database! " + data;
                            alert($scope.formResponse);
                            console.log(data);
                        });
                }
            };
            $scope.updateDB = function(db){
                if (db.title.length < 1){
                    alert("Form error: Please fill out Title field!");
                    return false;
                }
                if (db.url.length < 11){
                    alert("Form error: Please fill out URL field!");
                    return false;
                }
                if (db.coverage.length < 1){
                    alert("Form error: Please fill out Coverage field!");
                    return false;
                }
                if (db.description.length < 1){
                    alert("Form error: Please fill out Description field!");
                    return false;
                }
                db.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 2}, db)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.formResponse = "Database has been updated.";
                        } else {
                            $scope.formResponse = "Error: Can not update database! " + data;
                        }
                        alert($scope.formResponse);
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not update database! " + data;
                        alert($scope.formResponse);
                        console.log(data);
                    });
            };
            $scope.createDB = function(){
                console.dir($scope.newDB);
                mdbFactory.postData({action : 3}, $scope.newDB)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newDB = {};
                            newDB = angular.copy($scope.newDB);
                            newDB.id = data.id;
                            newDB.subjects = angular.copy(data.subjects);
                            newDB.types = angular.copy(data.types);
                            newDB.show = false;
                            newDB.class = "";
                            newDB.selSubj = data.subjects[0];
                            newDB.subjType = 1;
                            newDB.selType = data.types[0];
                            $scope.DBList.databases.push(newDB);
                            $scope.formResponse = "Database has been created.";
                        } else {
                            $scope.formResponse = "Error: Can not create database! " + data;
                        }
                        alert($scope.formResponse);
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not create database! " + data;
                        alert($scope.formResponse);
                        console.dir(data);
                    });
            };

            $scope.addSubject = function(db){
                var newSubject = {};
                newSubject.dbid = db.id;
                newSubject.type = db.subjType;
                newSubject.sid = db.selSubj.sid;
                newSubject.subject = db.selSubj.subject;
                newSubject.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 4}, newSubject)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            newSubject.id = data.id;
                            if (typeof $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects == 'undefined')
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects = [];
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects.push(newSubject);
                            $scope.formResponse = "Subject has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add subject! " + data;
                        }
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add subject! " + data;
                        console.dir(data);
                    });
            };
            $scope.deleteSubject = function(db,subject){
                subject.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 5}, subject)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects.splice(
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects.indexOf(subject),1
                            );
                            $scope.formResponse = "Subject has been deleted.";
                        } else {
                            $scope.formResponse = "Error: Can not delete subject! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete subject! " + data;
                    });
            };
            $scope.addType = function(db){
                var newType = {};
                newType.dbid = db.id;
                newType.tid = db.selType.tid;
                newType.type = db.selType.type;
                newType.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 6}, newType)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            newType.id = data.id;
                            if (typeof $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types == 'undefined')
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types = [];
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types.push(newType);
                            $scope.formResponse = "Type has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add type! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add type! " + data;
                    });
            };
            $scope.deleteType = function(db,type){
                type.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 7}, type)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types.splice(
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types.indexOf(type),1
                            );
                            $scope.formResponse = "Type has been deleted.";
                        } else {
                            $scope.formResponse = "Error: Can not delete type! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete type! " + data;
                    });
            };

            $scope.delSubjNewDB = function(index){
                $scope.newDB.subjects.splice(index, 1);
            };
            $scope.addSubjNewDB = function(){
                var newSubject = {};
                newSubject.type = $scope.newDB.subjType;
                newSubject.sid = $scope.newDB.selSubj.sid;
                newSubject.subject = $scope.newDB.selSubj.subject;
                if (typeof $scope.newDB.subjects == 'undefined')
                    $scope.newDB.subjects = [];
                var isPresent = false;
                for (var i = 0; i < $scope.newDB.subjects.length; i++)
                    if ($scope.newDB.subjects[i].sid == newSubject.sid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newDB.subjects.push(newSubject);
            };
            $scope.delTypeNewDB = function(index){
                $scope.newDB.types.splice(index, 1);
            };
            $scope.addTypeNewDB = function(){
                var newType = {};
                newType.tid = $scope.newDB.selType.tid;
                newType.type = $scope.newDB.selType.type;
                if (typeof $scope.newDB.types == 'undefined')
                    $scope.newDB.types = [];
                var isPresent = false;
                for (var i = 0; i < $scope.newDB.types.length; i++)
                    if ($scope.newDB.types[i].tid == newType.tid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newDB.types.push(newType);
            };
        }])

    .directive('databasesManageList', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageDBCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'DBList.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("Databases loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageDatabases/manageDatabases.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })

angular.module('manage.manageHours', [])
    .constant('HOURS_FROM', [
        {name:'Closed 24hrs', value:'-1'},
        {name:'Midnight', value:'0'},
        {name:'6:00 am', value:'600'},
        {name:'7:00 am', value:'700'},
        {name:'7:30 am', value:'730'},
        {name:'7:45 am', value:'745'},
        {name:'8:00 am', value:'800'},
        {name:'9:00 am', value:'900'},
        {name:'10:00 am', value:'1000'},
        {name:'11:00 am', value:'1100'},
        {name:'Noon', value:'1200'},
        {name:'1:00 pm', value:'1300'}
    ])
    .constant('HOURS_TO', [
        {name:'1:00 am', value:'100'},
        {name:'2:00 am', value:'200'},
        {name:'3:00 am', value:'300'},
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
        {name:'4:45 pm', value:'1645'},
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
    .constant('DP_FORMAT', 'MM/dd/yyyy')

    .controller('manageHrsCtrl', ['$scope', '$animate', 'tokenFactory', 'hmFactory', 'HOURS_FROM', 'HOURS_TO', 'DP_FORMAT',
        function manageHrsCtrl($scope, $animate, tokenFactory, hmFactory, hoursFrom, hoursTo, dpFormat){
            $scope.allowedLibraries = [];
            $scope.format = dpFormat;
            $scope.hrsFrom = hoursFrom;
            $scope.hrsTo = hoursTo;
            $scope.selLib = {};

            tokenFactory("CSRF-libHours");

            $scope.initSemesters = function(semesters){
                for (var sem = 0; sem < semesters.length; sem++){
                    semesters[sem].startdate = new Date(semesters[sem].startdate);
                    semesters[sem].enddate = new Date(semesters[sem].enddate);
                    semesters[sem].dp = false;
                }
                return semesters;
            };

            hmFactory.getData("semesters")
                .success(function(data) {
                    console.dir(data);
                    $scope.selLib = data.libraries[0];
                    for (var lib = 0; lib < data.libraries.length; lib++){
                        for (var ex = 0; ex < data.exc[lib].length; ex++){
                            data.exc[lib][ex].datems = new Date(data.exc[lib][ex].date * 1000);
                            data.exc[lib][ex].dp = false;
                        }
                        data.sem[lib] = $scope.initSemesters(data.sem[lib]);
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
    }])

    .directive('manageHours', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageHrsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'allowedLibraries',
                    function(newVal, oldVal){
                        if (scope.allowedLibraries.totalTime > 0){
                            $animate.leave(spinner);
                            console.log("Hours loaded");
                        }
                    },
                    true
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
        $scope.newSemester.dp = false;
        $scope.newSemester.dow = [];

        for (var day = 0; day < 7; day++) {
            $scope.newSemester.dow[day] = {};
            $scope.newSemester.dow[day].from = -1;
            $scope.newSemester.dow[day].to = 0;
        }

        $scope.onSemFocus = function($event, index){
            $event.preventDefault();
            $event.stopPropagation();
            if (typeof index != 'undefined' && index >= 0)
                $scope.allowedLibraries.sem[$scope.selLib.index][index].dp = true;
            else
                $scope.newSemester.dp = true;
        };

        $scope.expandSem = function($event, semester){
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
            } else {
                $event.preventDefault();
                $event.stopPropagation();
            }
            $scope.expSem = semester.dsid;
        };
        $scope.isExpSem = function(semID){
            if ($scope.expSem === semID)
                return true;
            return false;
        };

        $scope.saveChanges = function(semester){
            semester.lid = $scope.selLib.lid;
            semester.libName = $scope.selLib.name;
            $scope.loading = true;
            hmFactory.postData({action : 1}, semester)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result = "Semester updated";
                        $scope.allowedLibraries.sem[$scope.selLib.index] = $scope.initSemesters(data);
                    } else
                        $scope.result = "Error! Could not save data!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };
        $scope.deleteSem = function(semester, index){
            if (confirm("Are you sure you want to delete " + semester.name + " semester?")){
                $scope.loading = true;
                semester.lid = $scope.selLib.lid;
                semester.libName = $scope.selLib.name;
                hmFactory.postData({action : 3}, semester)
                    .success(function(data) {
                        if ((typeof data === 'object') && (data !== null)){
                            $scope.result = "Semester deleted";
                            $scope.allowedLibraries.sem[$scope.selLib.index] = $scope.initSemesters(data);
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
            $scope.newSemester.lid = $scope.selLib.lid;
            $scope.newSemester.libName = $scope.selLib.name;
            hmFactory.postData({action : 2}, $scope.newSemester)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result = "Semester created";
                        $scope.allowedLibraries.sem[$scope.selLib.index] = $scope.initSemesters(data);
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
            restrict: 'A',
            controller: 'semListCtrl',
            templateUrl: 'manageHours/manageSem.tpl.html'
        };
    })

    .controller('exListCtrl', ['$scope', 'hmFactory', function exListCtrl($scope, hmFactory) {
        $scope.newException = {};
        $scope.newException.from = -1;
        $scope.newException.to = 0;
        $scope.newException.dp = false;
        $scope.newException.isGlobal = false;
        $scope.expExc = -1;

        $scope.onExcFocus = function($event, index){
            $event.preventDefault();
            $event.stopPropagation();
            if (typeof index != 'undefined' && index >= 0)
                $scope.allowedLibraries.exc[$scope.selLib.index][index].dp = true;
            else
                $scope.newException.dp = true;
        };
        $scope.expandExc = function($event, exception){
            if ($scope.expExc != exception.id){
                $scope.result = "";
                $scope.resultDel = "";
            } else {
                $event.preventDefault();
                $event.stopPropagation();
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
            exception.lid = $scope.selLib.lid;
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
                exception.lid = $scope.selLib.lid;
                hmFactory.postData({action : 5}, exception)
                    .success(function(data) {
                        if ( data == 1){
                            $scope.allowedLibraries.exc[$scope.selLib.index].splice(index, 1);
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
            $scope.newException.lid = $scope.selLib.lid;
            hmFactory.postData({action : 6}, $scope.newException)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        var i = 0;
                        for (i = 0; i < data.length; i++){
                            var newExc = {};
                            newExc.id = data[i].id;
                            newExc.datems = $scope.newException.datems;
                            newExc.days = $scope.newException.days;
                            newExc.desc = $scope.newException.desc;
                            newExc.from = $scope.newException.from;
                            newExc.to = $scope.newException.to;
                            newExc.dp = false;
                            var l = 0;
                            for (l = 0; l < $scope.allowedLibraries.libraries.length; l++)
                                if ($scope.allowedLibraries.libraries[l].lid === data[i].lid)
                                    break;
                            $scope.allowedLibraries.exc[$scope.allowedLibraries.libraries[l].index].push(newExc);
                        }
                        $scope.result = "Created exceptions count: " + i;
                    }else
                        $scope.result = "Error! Could not create an exception!";
                    $scope.loading = false;
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };

        $scope.deleteOldExc = function(){
            $scope.loading = true;
            hmFactory.postData({action : 7}, $scope.selLib)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.expExc = -1;
                        for (var ex = 0; ex < data.length; ex++){
                            data[ex].datems = new Date(data[ex].date * 1000);
                            data[ex].dp = false;
                        }
                        $scope.allowedLibraries.exc[$scope.selLib.index] = data;
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
            restrict: 'A',
            controller: 'exListCtrl',
            link: function(scope, elem, attrs) {

            },
            templateUrl: 'manageHours/manageEx.tpl.html'
        };
    })

angular.module('manage.manageHoursUsers', [])
    .controller('manageHrsUsersCtrl', ['$scope', '$window', '$animate', 'tokenFactory', 'hmFactory',
        function manageHrsUsersCtrl($scope, $window, $animate, tokenFactory, hmFactory){
            $scope.isLoading = true;
            $scope.dataUL = {};
            $scope.dataUL.users = [];
            $scope.dataUL.locations = [];
            $scope.user = {};
            $scope.user.name = $window.userName;

            tokenFactory("CSRF-libHours");

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

angular.module('manage.manageNews', ['ngFileUpload'])
    .controller('manageNewsCtrl', ['$scope', '$window', '$timeout', 'tokenFactory', 'newsFactory',
        function manageNewsCtrl($scope, $window, $timeout, tokenFactory, newsFactory){
            $scope.data = {};
            $scope.dpFormat = 'MM/dd/yyyy';
            $scope.newNews = {};
            $scope.newNews.creator = $window.author;
            $scope.newExh = {};
            $scope.newExh.creator = $window.author;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'activeFrom', reverse:false},
                {by:'activeUntil', reverse:false}
            ];

            tokenFactory("CSRF-libNews");

            newsFactory.getData("all")
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.news.length; i++){
                        data.news[i].activeFrom = new Date(data.news[i].activeFrom * 1000);
                        data.news[i].activeUntil = new Date(data.news[i].activeUntil * 1000);
                        for (var j = 0; j < data.people.length; j++)
                            if (data.news[i].contactID.uid === data.people[j].uid){
                                data.news[i].contactID = data.people[j];
                                break;
                            }
                        data.news[i].show = false;
                        data.news[i].class = "";
                        data.news[i].dpFrom = false;
                        data.news[i].dpUntil = false;
                    }
                    for (var i = 0; i < data.exhibitions.length; i++){
                        data.exhibitions[i].activeFrom = new Date(data.exhibitions[i].activeFrom * 1000);
                        data.exhibitions[i].activeUntil = new Date(data.exhibitions[i].activeUntil * 1000);
                        for (var j = 0; j < data.people.length; j++)
                            if (data.exhibitions[i].contactID.uid === data.people[j].uid){
                                data.exhibitions[i].contactID = data.people[j];
                                break;
                            }
                        data.exhibitions[i].show = false;
                        data.exhibitions[i].class = "";
                        data.exhibitions[i].dpFrom = false;
                        data.exhibitions[i].dpUntil = false;
                    }
                    $scope.newNews.contactID = data.people[0];
                    $scope.newExh.contactID = data.people[0];
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'News',
                    number: 0,
                    active: true
                },
                { name: 'Exhibitions',
                    number: 1,
                    active: false
                }];
            
            $scope.validateNews = function(news){
                if (news.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (news.description.length < 1)
                    return "Form error: Please fill out Description!";

                return "";
            };
            $scope.generateThumb = function(file) {
                if (file != null) {
                    if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.dataUrl = e.target.result;
                                });
                            }
                        });
                    }
                }
            };
        }])

    .directive('newsExhibitionsMain', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageNewsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'data.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("News data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageNews/manageNews.tpl.html'
        };
    })

    .controller('manageNewsListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageNewsListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newNews.type = 0; // news
            $scope.newNews.activeFrom = new Date();
            $scope.newNews.activeUntil = new Date();
            $scope.newNews.dpFrom = false;
            $scope.newNews.dpUntil = false;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.onNewsDPFocusFrom = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.news[index].dpFrom = true;
                else
                    $scope.newNews.dpFrom = true;
            };
            $scope.onNewsDPFocusUntil = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.news[index].dpUntil = true;
                else
                    $scope.newNews.dpUntil = true;
            };

            $scope.toggleNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].show =
                    !$scope.data.news[$scope.data.news.indexOf(news)].show;
            };
            $scope.setOver = function(news){
                $scope.mOver = news.nid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteNews = function(news){
                if (confirm("Delete " + news.title  + " permanently?") == true){
                    newsFactory.postData({action : 1}, news)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.news.splice($scope.data.news.indexOf(news), 1);
                                $scope.formResponse = "News item has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete news item! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete news item! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = $scope.validateNews(news);
                if ($scope.data.news[$scope.data.news.indexOf(news)].formResponse.length > 0)
                    return false;
                news.tsFrom = news.activeFrom.valueOf() / 1000;
                news.tsUntil = news.activeUntil.valueOf() / 1000;
                if (typeof news.picFile === 'undefined'){
                    newsFactory.postData({action : 21}, news)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "News has been updated, Icon has not changed.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "Error: Can not update news! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not update news! " + data;
                            console.log(data);
                        });
                } else {
                    news.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: news
                        },
                        file: news.picFile,
                        fileFormDataName: 'editNewsExh' + news.nid
                    });
                    news.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = "News has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.data.news[$scope.data.news.indexOf(news)].formResponse += "Icon uploaded.";
                                else
                                    $scope.data.news[$scope.data.news.indexOf(news)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = 
                                    "Error: Can not update news! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse = response.status + ': ' + response.data;
                    });
                    news.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        news.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createNews = function(){
                if (typeof $scope.newNews.picFile === 'undefined'){
                    $scope.newNews.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newNews.formResponse = $scope.validateNews($scope.newNews);
                if ($scope.newNews.formResponse.length > 0)
                    return false;
                $scope.newNews.tsFrom = $scope.newNews.activeFrom.valueOf() / 1000;
                $scope.newNews.tsUntil = $scope.newNews.activeUntil.valueOf() / 1000;
                $scope.newNews.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        news: $scope.newNews
                    },
                    file: $scope.newNews.picFile,
                    fileFormDataName: 'addNewsExh'
                });
                $scope.newNews.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newNews = {};
                            newNews.nid = response.data.id;
                            newNews.title = $scope.newNews.title;
                            newNews.description = $scope.newNews.description;
                            newNews.show = false;
                            newNews.class = "";
                            $scope.data.news.push(newNews);
                            $scope.newNews.formResponse = "News has been added.";
                        } else {
                            $scope.newNews.formResponse = "Error: Can not add news! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newNews.formResponse = response.status + ': ' + response.data;
                });
                $scope.newNews.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newNews.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };
        }])

    .directive('manageNewsList', function() {
        return {
            restrict: 'A',
            controller: 'manageNewsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsList.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })
    .controller('manageExhListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageExhListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newExh.type = 1;//exhibition
            $scope.newExh.activeFrom = new Date();
            $scope.newExh.activeUntil = new Date();
            $scope.newExh.dpFrom = false;
            $scope.newExh.dpUntil = false;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.onExhDPFocusFrom = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.exhibitions[index].dpFrom = true;
                else
                    $scope.newExh.dpFrom = true;
            };
            $scope.onExhDPFocusUntil = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.exhibitions[index].dpUntil = true;
                else
                    $scope.newExh.dpUntil = true;
            };

            $scope.toggleExhibitions = function(exh){
                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].show =
                    !$scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].show;
            };
            $scope.setOver = function(exh){
                $scope.mOver = exh.nid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteExhibition = function(exh){
                if (confirm("Delete " + exh.title  + " permanently?") == true){
                    newsFactory.postData({action : 1}, exh)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.exhibitions.splice($scope.data.exhibitions.indexOf(exh), 1);
                                $scope.formResponse = "Exhibition item has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete exhibition item! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete Exhibition item! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateExhibition = function(exh){
                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = $scope.validateNews(exh);
                if ($scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse.length > 0)
                    return false;
                exh.tsFrom = exh.activeFrom.valueOf() / 1000;
                exh.tsUntil = exh.activeUntil.valueOf() / 1000;
                if (typeof exh.picFile === 'undefined'){
                    newsFactory.postData({action : 21}, exh)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Exhibition has been updated, Icon has not changed.";
                            } else {
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Error: Can not update Exhibition! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                "Error: Could not update Exhibition! " + data;
                            console.log(data);
                        });
                } else {
                    exh.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: exh
                        },
                        file: exh.picFile,
                        fileFormDataName: 'editNewsExh' + exh.nid
                    });
                    exh.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = "Exhibition has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse += "Icon uploaded.";
                                else
                                    $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Error: Can not update Exhibition! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = response.status + ': ' + response.data;
                    });
                    exh.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        exh.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createExhibition = function(){
                if (typeof $scope.newExh.picFile === 'undefined'){
                    $scope.newExh.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newExh.formResponse = $scope.validateNews($scope.newExh);
                if ($scope.newExh.formResponse.length > 0)
                    return false;
                $scope.newExh.tsFrom = $scope.newExh.activeFrom.valueOf() / 1000;
                $scope.newExh.tsUntil = $scope.newExh.activeUntil.valueOf() / 1000;
                $scope.newExh.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        news: $scope.newExh
                    },
                    file: $scope.newExh.picFile,
                    fileFormDataName: 'addNewsExh'
                });
                $scope.newExh.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newExh = {};
                            newExh.nid = response.data.id;
                            newExh.title = $scope.newExh.title;
                            newExh.description = $scope.newExh.description;
                            newExh.show = false;
                            newExh.class = "";
                            $scope.data.exhibitions.push(newExh);
                            $scope.newExh.formResponse = "Exhibition has been added.";
                        } else {
                            $scope.newExh.formResponse = "Error: Can not add Exhibition! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newExh.formResponse = response.status + ': ' + response.data;
                });
                $scope.newExh.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newExh.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };
        }])
    .directive('manageExhibitionsList', function() {
        return {
            restrict: 'A',
            controller: 'manageExhListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageExhibitionsList.tpl.html'
        };
    })

    .controller('viewNEECtrl', ['$scope', '$timeout', 'newsFactory',
        function viewNEECtrl($scope, $timeout, newsFactory){
            $scope.data = {};

            newsFactory.getData("today")
                .success(function(data) {
                    console.dir(data);
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            //events will be pulled from XML feed
            //http://events.ua.edu/category/22/feed

        }])
    .directive('viewNewsEventsExhibitions', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'viewNEECtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'data.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("News data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageNews/viewNewsEventsExhibitions.tpl.html'
        };
    })

angular.module('manage.manageOneSearch', [])
    .controller('manageOneSearchCtrl', ['$scope', 'tokenFactory', 'osFactory',
        function manageOneSearchCtrl($scope, tokenFactory, osFactory){
            $scope.recList = [];
            $scope.addRec = {};
            $scope.addRec.keyword = "";
            $scope.addRec.link = "";
            $scope.addRec.title = "";
            $scope.response = "";
            $scope.filterKeyword = '';
            $scope.filterLink = '';
            $scope.filterLinkTitle = '';

            tokenFactory("CSRF-libOneSearch");

            osFactory.getData()
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
angular.module('manage.manageSoftware', ['ngFileUpload'])
    .controller('manageSWCtrl', ['$scope', 'tokenFactory', 'swFactory',
        function manageSWCtrl($scope, tokenFactory, swFactory){
            $scope.SWList = {};
            $scope.newSW = {};
            $scope.newSW.newLoc = {};
            $scope.os = [
                {name:'MS Windows', value:1},
                {name:'Apple Mac', value:2}
            ];

            tokenFactory("CSRF-libSoftware");

            swFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.software.length; i++){
                        data.software[i].show = false;
                        data.software[i].class = "";
                        data.software[i].selCat = data.categories[0];
                        data.software[i].newVer = {};
                        data.software[i].newVer.selOS = $scope.os[0];
                        data.software[i].newLoc = {};
                        data.software[i].newLoc.selLoc = data.locations[0];
                        data.software[i].newLoc.devices = [];
                        for (var j = 0; j < data.devices.length; j++)
                            data.software[i].newLoc.devices[j] = false;
                        data.software[i].newLink = {};
                    }
                    $scope.newSW.newLoc.selLoc = data.locations[0];
                    $scope.newSW.newLoc.devices = [];
                    for (var j = 0; j < data.devices.length; j++)
                        $scope.newSW.newLoc.devices[j] = false;
                    $scope.newSW.selCat = data.categories[0];
                    $scope.SWList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'Software List',
                    number: 0,
                    active: true
                },
                { name: 'Locations and Categories',
                    number: 1,
                    active: false
                }];
        }])

    .directive('manageSoftwareMain', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageSWCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'SWList.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("Software loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageSoftware/manageSoftware.tpl.html'
        };
    })

    .controller('manageSWListCtrl', ['$scope', '$timeout', 'Upload', 'swFactory', 'SOFTWARE_URL',
        function manageSWListCtrl($scope, $timeout, Upload, swFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'location', reverse:false}
            ];
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newSW.versions = [];
            $scope.newSW.links = [];
            $scope.newSW.categories = [];
            $scope.newSW.newVer = {};
            $scope.newSW.newVer.selOS = $scope.os[0];
            $scope.newSW.newLink = {};
            $scope.newSW.details = '';

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.startTitle = function(actual, expected){
                if (!expected)
                    return true;
                if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                    return true;
                return false;
            };
            $scope.toggleSW = function(sw){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].show =
                    !$scope.SWList.software[$scope.SWList.software.indexOf(sw)].show;
            };
            $scope.setOver = function(sw){
                $scope.mOver = sw.sid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteSW = function(sw){
                if (confirm("Delete " + sw.title  + " permanently?") == true){
                    swFactory.postData({action : 1}, sw)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.SWList.software.splice($scope.SWList.software.indexOf(sw), 1);
                                $scope.formResponse = "Software has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete software! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete software! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateSW = function(sw){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = $scope.validateSW(sw);
                if ($scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse.length > 0)
                    return false;
                console.dir(sw);
                if (typeof sw.picFile === 'undefined'){
                    swFactory.postData({action : 21}, sw)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse =
                                    "Software has been updated, Icon has not changed.";
                            } else {
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse =
                                    "Error: Can not update software! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse =
                                "Error: Could not delete software! " + data;
                            console.log(data);
                        });
                } else {
                    sw.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            sw: sw
                        },
                        file: sw.picFile,
                        fileFormDataName: 'editSW' + sw.sid
                    });
                    sw.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = "Software has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse += "Icon uploaded.";
                                else
                                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = "Error: Can not update software! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = response.status + ': ' + response.data;
                    });
                    sw.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        sw.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createSW = function(){
                if (typeof $scope.newSW.picFile === 'undefined'){
                    $scope.newSW.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newSW.formResponse = $scope.validateSW($scope.newSW);
                if ($scope.newSW.formResponse.length > 0)
                    return false;
                $scope.newSW.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        sw: $scope.newSW
                    },
                    file: $scope.newSW.picFile,
                    fileFormDataName: 'addNewSW'
                });
                $scope.newSW.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newSW = {};
                            newSW.sid = response.data.id;
                            newSW.title = $scope.newSW.title;
                            newSW.description = $scope.newSW.description;
                            newSW.modules = $scope.newSW.modules;
                            newSW.versions = angular.copy(response.data.versions);
                            newSW.links = angular.copy(response.data.links);
                            newSW.categories = angular.copy(response.data.categories);
                            newSW.show = false;
                            newSW.class = "";
                            newSW.newLoc = {};
                            newSW.newLoc.selLoc = $scope.SWList.locations[0];
                            newSW.newLoc.devices = [];
                            for (var j = 0; j < $scope.SWList.devices.length; j++)
                                newSW.newLoc.devices[j] = false;
                            newSW.selCat = response.data.categories[0];
                            newSW.newVer = {};
                            newSW.newVer.selOS = $scope.os[0];
                            newSW.newLink = {};
                            $scope.SWList.software.push(newSW);
                            $scope.newSW.formResponse = "Software has been added.";
                        } else {
                            $scope.newSW.formResponse = "Error: Can not add software! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newSW.formResponse = response.status + ': ' + response.data;
                });
                $scope.newSW.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newSW.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };
            $scope.validateSW = function(sw){
                if (sw.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (sw.description.length < 1)
                    return "Form error: Please fill out Description!";
                if (sw.versions.length < 1)
                    return "Form error: Please add a version!";
                if (sw.categories.length < 1)
                    return "Form error: Please add a category!";

                return "";
            };
            $scope.checkDevices = function(device, number){
                device = parseInt(device);
                number = parseInt(number);
                if ((device & number) === number)
                    return true;
                return false;
            };

            $scope.addVersion = function(sw){
                if (sw.newVer.version.length > 0){
                    var newVer = {};
                    newVer.vid = -1;
                    newVer.sid = sw.sid;
                    newVer.version = sw.newVer.version;
                    newVer.os = sw.newVer.selOS.value;
                    newVer.locations = [];
                    var isPresent = false;
                    for (var i = 0; i < sw.versions.length; i++)
                        if (sw.versions[i].version === newVer.version &&
                            sw.versions[i].os === newVer.os){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.push(newVer);
                }
            };
            $scope.deleteVersion = function(sw, version){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version),1
                );
            };
            $scope.addLocation = function(sw,version){
                var newLoc = {};
                newLoc.id = -1;
                newLoc.sid = sw.sid;
                newLoc.vid = version.vid;
                newLoc.lid = sw.newLoc.selLoc.lid;
                newLoc.name = sw.newLoc.selLoc.name;
                newLoc.parent = sw.newLoc.selLoc.parent;
                newLoc.devices = 0;
                var isPresent = false;
                for (var i = 0; i < version.locations.length; i++)
                    if (version.locations[i].lid == newLoc.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent){
                    for (var i = 0; i < $scope.SWList.devices.length; i++)
                        if (sw.newLoc.devices[i])
                            newLoc.devices += parseInt($scope.SWList.devices[i].did);
                    if (newLoc.devices > 0)
                        $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions[$scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version)].locations.push(newLoc);
                    else
                        alert("Please select at least one device type!");
                }
            };
            $scope.deleteLocation = function(sw, version, location){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions[$scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version)].locations.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions[$scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version)].locations.indexOf(location),1
                );
            };
            $scope.addCategory = function(sw){
                var newCat = {};
                newCat.id = -1;
                newCat.cid = sw.selCat.cid;
                newCat.name = sw.selCat.name;
                var isPresent = false;
                for (var i = 0; i < sw.categories.length; i++)
                    if (sw.categories[i].cid == newCat.cid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].categories.push(newCat);
            };
            $scope.deleteCategory = function(sw, category){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].categories.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].categories.indexOf(category),1
                );
            };
            $scope.addLink = function(sw){
                if (sw.newLink.title.length > 0 && sw.newLink.url.length > 1){
                    var newLink = {};
                    newLink.linkid = -1;
                    newLink.sid = sw.sid;
                    newLink.description = sw.newLink.description;
                    newLink.title = sw.newLink.title;
                    newLink.url = sw.newLink.url;
                    var isPresent = false;
                    for (var i = 0; i < sw.links.length; i++)
                        if (sw.links[i].title === newLink.title &&
                            sw.links[i].url === newLink.url){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.push(newLink);
                }
            };
            $scope.deleteLink = function(sw, link){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.indexOf(link),1
                );
            };

            $scope.delNewSWVer = function(version){
                $scope.newSW.versions.splice($scope.newSW.versions.indexOf(version), 1);
            };
            $scope.delNewSWLoc = function(version,location){
                $scope.newSW.versions[$scope.newSW.versions.indexOf(version)].locations.splice(
                    $scope.newSW.versions[$scope.newSW.versions.indexOf(version)].locations.indexOf(location),
                    1
                );
            };
            $scope.delNewSWCat = function(category){
                $scope.newSW.categories.splice($scope.newSW.categories.indexOf(category), 1);
            };
            $scope.delNewSWLink = function(link){
                $scope.newSW.links.splice($scope.newSW.links.indexOf(link), 1);
            };
            $scope.addNewSWVer = function(){
                if ($scope.newSW.newVer.version.length > 0){
                    var newVersion = {};
                    newVersion.version = $scope.newSW.newVer.version;
                    newVersion.os = $scope.newSW.newVer.selOS.value;
                    newVersion.locations = [];
                    var isPresent = false;
                    for (var i = 0; i < $scope.newSW.versions.length; i++)
                        if ($scope.newSW.versions[i].version == newVersion.version &&
                            $scope.newSW.versions[i].os == newVersion.os){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.newSW.versions.push(newVersion);
                }
            };
            $scope.addNewSWLoc = function(version){
                var newLoc = {};
                newLoc.lid = $scope.newSW.newLoc.selLoc.lid;
                newLoc.name = $scope.newSW.newLoc.selLoc.name;
                newLoc.parent = $scope.newSW.newLoc.selLoc.parent;
                newLoc.devices = 0;
                var isPresent = false;
                for (var i = 0; i < version.locations.length; i++)
                    if (version.locations[i].lid == newLoc.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent){
                    for (var i = 0; i < $scope.SWList.devices.length; i++)
                        if ($scope.newSW.newLoc.devices[i])
                            newLoc.devices += parseInt($scope.SWList.devices[i].did);
                    if (newLoc.devices > 0)
                        $scope.newSW.versions[$scope.newSW.versions.indexOf(version)].locations.push(newLoc);
                    else
                        alert("Please select at least one device type!");
                }
            };
            $scope.addNewSWCat = function(){
                var newCategory = {};
                newCategory.cid = $scope.newSW.selCat.cid;
                newCategory.name = $scope.newSW.selCat.name;
                var isPresent = false;
                for (var i = 0; i < $scope.newSW.categories.length; i++)
                    if ($scope.newSW.categories[i].cid == newCategory.cid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newSW.categories.push(newCategory);
            };
            $scope.addNewSWLink = function(){
                if ($scope.newSW.newLink.title.length > 0 && $scope.newSW.newLink.url.length > 11){
                    var newLink = {};
                    newLink.description = $scope.newSW.newLink.description;
                    newLink.title = $scope.newSW.newLink.title;
                    newLink.url = $scope.newSW.newLink.url;
                    var isPresent = false;
                    for (var i = 0; i < $scope.newSW.links.length; i++)
                        if ($scope.newSW.links[i].title == newLink.title &&
                            $scope.newSW.links[i].url == newLink.url){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.newSW.links.push(newLink);
                }
            };

            $scope.generateThumb = function(file) {
                if (file != null) {
                    if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.dataUrl = e.target.result;
                                });
                            }
                        });
                    }
                }
            };

    }])

    .directive('softwareManageList', function() {
        return {
            restrict: 'A',
            controller: 'manageSWListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareList.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })
    .controller('manageSWLocCatCtrl', ['$scope', '$timeout', 'swFactory',
        function manageSWLocCatCtrl($scope, $timeout, swFactory){
            $scope.selLocation = -1;
            $scope.selCategory = -1;
            $scope.newLocation = {};
            $scope.newLocation.name = '';
            $scope.newLocation.parent = 0;
            $scope.newCategory = '';
            $scope.locResponse = '';
            $scope.catResponse = '';


            $scope.selectLocation = function(location){
                $scope.selLocation = location.lid;
            };
            $scope.selectCategory = function(category){
                $scope.selCategory = category.cid;
            };
            $scope.addLocation = function(){
                swFactory.postData({action : 4}, $scope.newLocation)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newLoc = {};
                            newLoc.lid = data.id;
                            newLoc.name = $scope.newLocation.name;
                            newLoc.parent = 0;
                            if ($scope.newLocation.parent > 0)
                                newLoc.parent = $scope.newLocation.parent;
                            $scope.SWList.locations.push(newLoc);
                            $scope.locResponse = "Location has been added!";
                        } else {
                            $scope.locResponse = "Error: Can not add location! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.locResponse = "Error: Could not add location! " + data;
                        console.log(data);
                    });
            };
            $scope.deleteLocation = function(location){
                if (confirm("Delete " + location.name  + " permanently?") == true){
                    swFactory.postData({action : 5}, location)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.SWList.locations.splice($scope.SWList.locations.indexOf(location), 1);
                                $scope.locResponse = "Location has been deleted!";
                            } else {
                                $scope.locResponse = "Error: Can not delete location! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.locResponse = "Error: Could not delete location! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.editLocation = function(location){
                swFactory.postData({action : 6}, location)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.locResponse = "Location name has been updated!";
                        } else {
                            $scope.locResponse = "Error: Can not update location! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.locResponse = "Error: Could not update location! " + data;
                        console.log(data);
                    });
            };
            $scope.addCategory = function(){
                swFactory.postData({action : 7}, {name: $scope.newCategory})
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newCat = {};
                            newCat.cid = data.id;
                            newCat.name = $scope.newCategory;
                            $scope.SWList.categories.push(newCat);
                            $scope.catResponse = "Category has been added!";
                        } else {
                            $scope.catResponse = "Error: Can not add category! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.catResponse = "Error: Could not add category! " + data;
                        console.log(data);
                    });
            };
            $scope.deleteCategory = function(category){
                if (confirm("Delete " + category.name  + " permanently?") == true){
                    swFactory.postData({action : 8}, category)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.SWList.categories.splice($scope.SWList.categories.indexOf(category), 1);
                                $scope.catResponse = "Category has been deleted!";
                            } else {
                                $scope.catResponse = "Error: Can not delete category! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.catResponse = "Error: Could not delete category! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.editCategory = function(category){
                swFactory.postData({action : 9}, category)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.catResponse = "Category name has been updated!";
                        } else {
                            $scope.catResponse = "Error: Can not update category! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.catResponse = "Error: Could not update category! " + data;
                        console.log(data);
                    });
            };
        }])
    .directive('softwareManageLocCat', function() {
        return {
            restrict: 'A',
            controller: 'manageSWLocCatCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareLocCat.tpl.html'
        };
    })

angular.module('manage.manageUserGroups', [])
    .controller('userGroupsCtrl', ['$scope', '$window', 'tokenFactory', 'ugFactory',
        function userGroupsCtrl($scope, $window, tokenFactory, ugFactory){
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

        tokenFactory("CSRF-libAdmin");

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

    .controller('staffDirCtrl', ['$scope', '$window', 'tokenFactory', 'sdFactory', 'STAFF_DIR_RANKS', 'STAFF_DIR_DEPTS', 'STAFF_DIR_URL',
        function staffDirCtrl($scope, $window, tokenFactory, sdFactory, ranks, departments, appUrl){
            $scope.sortMode = 'lastname';
            $scope.lastNameFilter = '';
            $scope.firstNameFilter = '';
            $scope.titleFilter = '';
            $scope.deptFilter = '';
            $scope.sortButton = 'last';
            $scope.Directory = {};
            $scope.hasAccess = $window.isAdmin;
            $scope.ranks = ranks;
            $scope.departments = departments;
            $scope.mOver = 0;
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 15;

            tokenFactory("CSRF-libStaffDir");

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

            $scope.deletePerson = function(person){
                if (confirm("Delete " + person.lastname + ", " + person.firstname  + " record permanently?") == true){
                    sdFactory.postData({delete : 1}, person)
                        .success(function(data, status, headers, config) {
                            $scope.formResponse = data;
                            $scope.Directory.list.splice($scope.Directory.list.indexOf(person), 1);
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
    .directive('staffDirectoryList', function($animate) {
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
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'Directory',
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
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    })
angular.module('manage.submittedForms', [])
    .controller('manageSubFormsCtrl', ['$scope', '$timeout', 'tokenFactory', 'formFactory',
        function manageSubFormsCtrl($scope, $timeout, tokenFactory, formFactory){
            $scope.data = {};
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;
            $scope.titleFilter = '';
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'status', reverse:false},
                {by:'created', reverse:false}
            ];
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;

            tokenFactory("CSRF-libForms");

            formFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.forms.length; i++){
                        data.forms[i].show = false;
                        data.forms[i].class = "";
                    }
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.setOver = function(form){
                $scope.mOver = form.fid;
            };
            $scope.toggleForms = function(form){
                $scope.data.forms[$scope.data.forms.indexOf(form)].show =
                    !$scope.data.forms[$scope.data.forms.indexOf(form)].show;
            };
        }])

    .directive('submittedFormsList', function($animate) {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'manageSubFormsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'data.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("Forms data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'submittedForms/submittedForms.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })

    .controller('customFormCtrl', ['$scope', 'formFactory',
    function customFormCtrl($scope, formFactory){

        $scope.submit = function(event){
            var form = {};
            form.length = event.target.length - 1;
            form.url = event.target.baseURI;
            console.dir(event.target);
            //copy every field but the submit button
            for (var i = 0; i < event.target.length - 1; i++){
                form[i] = {};
                form[i].name = event.target[i].name;
                form[i].value = event.target[i].value;
                if (event.target[i].type == 'checkbox' || event.target[i].type == 'radio')
                    if (!event.target[i].checked)
                        form[i].value = "";
            }
            formFactory.submitForm(form)
                .success(function(data) {
                    $scope.formResponse = data;
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.formResponse = "Error! " + data;
                    console.log(data);
                });

        };
    }])