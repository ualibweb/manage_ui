angular.module('manage', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.tinymce',
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
            $http.defaults.headers.get = header;
            $http.defaults.headers.post = header;
        };
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
        };
    }])
    .factory('ugFactory', ['$http', 'USER_GROUPS_URL', function ugFactory($http, url){
        return {
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url, params: params, data: data})
            }
        };
    }])
    .factory('sfFactory', ['$http', 'SITE_FEEDBACK_URL', function sfFactory($http, url){
        return {
            getData: function(params){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'GET', url: url, params: params})
            }
        };
    }])
    .factory('osFactory', ['$http', 'ONE_SEARCH_URL', function osFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('sdFactory', ['$http', 'STAFF_DIR_URL', function sdFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/people", params: {}})
            },
            getProfile: function(login){
                return $http({method: 'GET', url: url + "api/profile/" + login, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
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
        };
    }])
    .factory('swFactory', ['$http', 'SOFTWARE_URL', function swFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all/backend", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
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
        };
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
        };
    }]);

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
            $scope.newDB = {};
            $scope.newDB.updatedBy = $window.userName;
            $scope.newDB.subjects = [];
            $scope.newDB.types = [];
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            //primary, secondary
            $scope.subjectValues = [ 1, 2 ];
            $scope.fullTextValues = [ "", "A", "N", "P", "S" ];
            $scope.inEDSValues = [ "", "Y", "P" ];

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
                                alert($scope.formResponse);
                            }
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
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not create database! " + data;
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
                            alert($scope.formResponse);
                        }
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add subject! " + data;
                        alert($scope.formResponse);
                        console.dir(data);
                    });
            };
            $scope.deleteSubject = function(db,subject){
                subject.dbid = db.id;
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
                            alert($scope.formResponse);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete subject! " + data;
                        alert($scope.formResponse);
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
                            alert($scope.formResponse);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add type! " + data;
                        alert($scope.formResponse);
                    });
            };
            $scope.deleteType = function(db,type){
                type.dbid = db.id;
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
                            alert($scope.formResponse);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete type! " + data;
                        alert($scope.formResponse);
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

    .directive('databasesManageList', ['$animate', function($animate) {
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
    }])
    .filter('startFrom', [ function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    }])

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

    .directive('manageHours',['$animate', function($animate) {
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
    }])

    .controller('semListCtrl', ['$scope', 'hmFactory', function semListCtrl($scope, hmFactory) {
        $scope.expSem = -1;
        $scope.weekHrs = [];
        $scope.loading = false;
        $scope.newSemester = {};
        $scope.newSemester.dp = false;
        $scope.newSemester.dow = [];
        $scope.newSemester.name = "";
        $scope.newSemester.startdate = new Date();

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

    .directive('semesterList', [ function() {
        return {
            require: '^manageHours',
            restrict: 'A',
            controller: 'semListCtrl',
            templateUrl: 'manageHours/manageSem.tpl.html'
        };
    }])

    .controller('exListCtrl', ['$scope', 'hmFactory', function exListCtrl($scope, hmFactory) {
        $scope.newException = {};
        $scope.newException.from = -1;
        $scope.newException.to = 0;
        $scope.newException.dp = false;
        $scope.newException.isGlobal = false;
        $scope.newException.desc = "";
        $scope.newException.days = 1;
        $scope.newException.datems = new Date();
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
    .directive('exceptionList',[ function() {
        return {
            require: '^manageHours',
            restrict: 'A',
            controller: 'exListCtrl',
            link: function(scope, elem, attrs) {

            },
            templateUrl: 'manageHours/manageEx.tpl.html'
        };
    }])

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
                    for (var i = 0; i < data.users.length; i++)
                        for (var j = 0; j < $window.users.length; j++)
                            if (data.users[i].name === $window.users[j].login) {
                                data.users[i].fullName = $window.users[j].fullName;
                                break;
                            }
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

angular.module('manage.manageNews', ['ngFileUpload', 'ui.tinymce'])
    .controller('manageNewsCtrl', ['$scope', '$window', '$timeout', 'tokenFactory', 'newsFactory',
        function manageNewsCtrl($scope, $window, $timeout, tokenFactory, newsFactory){
            $scope.data = {};
            $scope.dpFormat = 'MM/dd/yyyy';
            $scope.newNews = {};
            $scope.newNews.creator = $window.author;
            $scope.newNews.selectedFiles = [];
            $scope.isAdmin = false;
            if (typeof $window.admin !== 'undefined')
                if ($window.admin === "1")
                    $scope.isAdmin = true;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'created', reverse:true}
            ];

            tokenFactory("CSRF-libNews");

            newsFactory.getData("all")
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.news.length; i++){
                        data.news[i].created = new Date(data.news[i].created * 1000);
                        if (data.news[i].activeFrom !== null)
                            data.news[i].activeFrom = new Date(data.news[i].activeFrom * 1000);
                        if (data.news[i].activeUntil !== null)
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
                        data.news[i].selectedFiles = [];
                    }
                    $scope.newNews.contactID = data.people[0];
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'News and Exhibits',
                    number: 0,
                    active: true
                },
                { name: 'Admins',
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
            $scope.generateThumb = function(files, news) {
                if (files != null) {
                    for (var i = 0; i < files.length; i++){
                        if (news !== null) {
                            $scope.data.news[$scope.data.news.indexOf(news)].selectedFiles.push(files[i]);
                        } else {
                            $scope.newNews.selectedFiles.push(files[i]);
                        }
                        if ($scope.fileReaderSupported && files[i].type.indexOf('image') > -1) {
                            $timeout(function() {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(files[i]);
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        files[i].dataUrl = e.target.result;
                                    });
                                }
                            });
                        }
                    }
                }
            };
        }])

    .directive('newsExhibitionsMain', ['$animate', function($animate) {
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
    }])

    .controller('manageNewsListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageNewsListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 1;
            $scope.appURL = appURL;
            $scope.uploading = false;

            $scope.newNews.activeFrom = new Date();
            $scope.newNews.activeUntil = new Date();
            $scope.newNews.dpFrom = false;
            $scope.newNews.dpUntil = false;
            $scope.newNews.contactName = '';
            $scope.newNews.contactEmail = '';
            $scope.newNews.contactPhone = '';
            $scope.newNews.sticky = 0;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.tinymceOptions = {
                onChange: function(e) {
                    // put logic here for keypress and cut/paste changes
                },
                inline: false,
                plugins : 'link spellchecker code',
                toolbar: 'undo redo | bold italic | link | code',
                menubar : false,
                skin: 'lightgray',
                theme : 'modern'
            };

            $scope.onNewsDPFocusFrom = function($event, news){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof news != 'undefined') {
                    if ($scope.data.news[$scope.data.news.indexOf(news)].activeFrom == null) {
                        $scope.data.news[$scope.data.news.indexOf(news)].activeFrom = new Date();
                    }
                    $scope.data.news[$scope.data.news.indexOf(news)].dpFrom = true;
                } else {
                    $scope.newNews.dpFrom = true;
                }
            };
            $scope.onNewsDPFocusUntil = function($event, news){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof news != 'undefined') {
                    if ($scope.data.news[$scope.data.news.indexOf(news)].activeUntil == null) {
                        $scope.data.news[$scope.data.news.indexOf(news)].activeUntil = new Date();
                    }
                    $scope.data.news[$scope.data.news.indexOf(news)].dpUntil = true;
                } else {
                    $scope.newNews.dpUntil = true;
                }
            };

            $scope.toggleNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].show =
                    !$scope.data.news[$scope.data.news.indexOf(news)].show;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.approveNews = function(news){
                news.admin = $scope.newNews.creator;
                if (confirm("Are you sure you want to approve " + news.title  + "?") == true){
                    newsFactory.postData({action : 4}, news)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.news[$scope.data.news.indexOf(news)].status = 1;
                            } else {
                                alert("Error: Can not approve news item! " + data);
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            alert("Error: Could not approve news item! " + data);
                            console.log(data);
                        });
                }
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
                $scope.uploading = true;
                if (news.activeFrom !== null)
                    news.tsFrom = news.activeFrom.valueOf() / 1000;
                else
                    news.tsFrom = null;
                if (news.activeUntil !== null)
                    news.tsUntil = news.activeUntil.valueOf() / 1000;
                else
                    news.tsUntil = null;
                if (news.selectedFiles.length < 1){
                    newsFactory.postData({action : 21}, news)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "News has been updated.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "Error: Can not update news! " + data;
                            }
                            console.log(data);
                            $scope.uploading = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not update news! " + data;
                            console.log(data);
                            $scope.uploading = false;
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < news.selectedFiles.length; i++)
                        names.push(news.selectedFiles[i].name);
                    news.selectedFiles.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: news
                        },
                        file: news.selectedFiles,
                        fileFormDataName: names
                    });
                    news.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].images = [];
                                $scope.data.news[$scope.data.news.indexOf(news)].images = angular.copy(response.data.images);
                                news.selectedFiles.length = 0;
                                news.picFile.length = 0;
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = "News has been updated, images have been uploaded.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = 
                                    "Error: Can not update news! " + response.data;
                            }
                            console.log(response.data);
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse = response.status + ': ' + response.data;
                        $scope.uploading = false;
                    });
                    news.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        news.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createNews = function(){
                $scope.newNews.formResponse = $scope.validateNews($scope.newNews);
                if ($scope.newNews.formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                if ($scope.newNews.activeFrom !== null)
                    $scope.newNews.tsFrom = $scope.newNews.activeFrom.valueOf() / 1000;
                else
                    $scope.newNews.tsFrom = null;
                if ($scope.newNews.activeUntil !== null)
                    $scope.newNews.tsUntil = $scope.newNews.activeUntil.valueOf() / 1000;
                else
                    $scope.newNews.tsUntil = null;

                if ($scope.newNews.selectedFiles.length < 1){
                    newsFactory.postData({action : 31}, $scope.newNews)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                var newNews = {};
                                newNews.nid = data.id;
                                newNews.images = angular.copy(data.images);
                                newNews.title = $scope.newNews.title;
                                newNews.description = $scope.newNews.description;
                                if ($scope.newNews.activeFrom > 0)
                                    newNews.activeFrom = new Date($scope.newNews.activeFrom * 1000);
                                else
                                    newNews.activeFrom = null;
                                if ($scope.newNews.activeUntil > 0)
                                    newNews.activeUntil = new Date($scope.newNews.activeUntil * 1000);
                                else
                                    newNews.activeUntil = null;
                                newNews.contactName = $scope.newNews.contactName;
                                newNews.contactEmail = $scope.newNews.contactEmail;
                                newNews.contactPhone = $scope.newNews.contactPhone;
                                newNews.sticky = $scope.newNews.sticky;
                                for (var j = 0; j < $scope.data.people.length; j++)
                                    if ($scope.newNews.contactID.uid === $scope.data.people[j].uid){
                                        newNews.contactID = $scope.data.people[j];
                                        break;
                                    }
                                newNews.show = false;
                                newNews.class = "";
                                newNews.status = 0;
                                newNews.selectedFiles = [];
                                $scope.data.news.push(newNews);
                                $scope.newNews.formResponse = "News has been added.";
                            } else {
                                $scope.newNews.formResponse = "Error: Can not add news 2! " + data;
                            }
                            console.dir(data);
                            $scope.uploading = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not add news 2! " + data;
                            console.log(data);
                            $scope.uploading = false;
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < $scope.newNews.selectedFiles.length; i++)
                        names.push($scope.newNews.selectedFiles[i].name);
                    $scope.newNews.selectedFiles.upload = Upload.upload({
                        url: appURL + 'processData.php?action=3',
                        method: 'POST',
                        fields: {
                            news: $scope.newNews
                        },
                        file: $scope.newNews.selectedFiles,
                        fileFormDataName: names
                    });
                    $scope.newNews.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                var newNews = {};
                                newNews.nid = response.data.id;
                                newNews.images = angular.copy(response.data.images);
                                newNews.title = $scope.newNews.title;
                                newNews.description = $scope.newNews.description;
                                if ($scope.newNews.activeFrom > 0)
                                    newNews.activeFrom = new Date($scope.newNews.activeFrom * 1000);
                                else
                                    newNews.activeFrom = null;
                                if ($scope.newNews.activeUntil > 0)
                                    newNews.activeUntil = new Date($scope.newNews.activeUntil * 1000);
                                else
                                    newNews.activeUntil = null;
                                newNews.contactName = $scope.newNews.contactName;
                                newNews.contactEmail = $scope.newNews.contactEmail;
                                newNews.contactPhone = $scope.newNews.contactPhone;
                                newNews.sticky = $scope.newNews.sticky;
                                for (var j = 0; j < $scope.data.people.length; j++)
                                    if ($scope.newNews.contactID.uid === $scope.data.people[j].uid){
                                        newNews.contactID = $scope.data.people[j];
                                        break;
                                    }
                                newNews.show = false;
                                newNews.class = "";
                                newNews.status = 0;
                                newNews.selectedFiles = [];
                                $scope.data.news.push(newNews);
                                $scope.newNews.formResponse = "News has been added.";
                            } else {
                                $scope.newNews.formResponse = "Error: Can not add news! " + response.data;
                            }
                            console.dir(response.data);
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.newNews.formResponse = response.status + ': ' + response.data;
                        $scope.uploading = false;
                    });
                    $scope.newNews.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.newNews.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
        }])

    .directive('manageNewsList', [ function() {
        return {
            restrict: 'A',
            controller: 'manageNewsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsList.tpl.html'
        };
    }])
    .filter('startFrom', [ function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    }])

    .controller('manageAdminsListCtrl', ['$scope', 'newsFactory',
        function manageAdminsListCtrl($scope, newsFactory){

        }])

    .directive('manageAdminsList', [ function() {
        return {
            restrict: 'A',
            controller: 'manageAdminsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsAdmins.tpl.html'
        };
    }]);



angular.module('manage.manageOneSearch', [])

    .controller('mainOneSearchCtrl', ['$scope',
        function mainOneSearchCtrl($scope){
            $scope.tabs = [
                { name: 'Recommended Links',
                    number: 0,
                    active: true
                },
                { name: 'Search Statistics',
                    number: 1,
                    active: false
                }
            ];
        }])

    .directive('manageOneSearchMain', ['$animate', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'mainOneSearchCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'manageOneSearch/mainOneSearch.tpl.html'
        };
    }])

    .controller('manageOneSearchCtrl', ['$scope', 'tokenFactory', 'osFactory',
        function manageOneSearchCtrl($scope, tokenFactory, osFactory){
            $scope.recList = [];
            $scope.addRec = {};
            $scope.addRec.keyword = "";
            $scope.addRec.link = "";
            $scope.addRec.description = "";
            $scope.response = "";
            $scope.filterKeyword = '';
            $scope.filterLink = '';
            $scope.filterLinkTitle = '';
            $scope.expanded = -1;

            $scope.sortModes = [
                {by:'keyword', reverse:false},
                {by:'description', reverse:false},
                {by:'link', reverse:false}
            ];

            tokenFactory("CSRF-libOneSearch");

            osFactory.getData('reclist')
                .success(function(data) {
                    $scope.recList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.expand = function(rec){
                $scope.expanded = rec.id;
            };

            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.addRecommendation = function(){
                if ( ($scope.addRec.keyword.length > 0) && ($scope.addRec.link.length > 0) && ($scope.addRec.description.length > 0) ){
                    osFactory.postData({action : 1}, $scope.addRec)
                        .success(function(data, status, headers, config) {
                            console.dir(data);
                            if ((typeof data === 'object') && (data !== null)){
                                var newRec = {};
                                newRec.id = data.rid;
                                newRec.linkid = data.lid;
                                newRec.keyword = $scope.addRec.keyword;
                                newRec.link = $scope.addRec.link;
                                newRec.description = $scope.addRec.description;
                                $scope.recList.RecList.push(newRec);
                                $scope.response = data.text;
                            } else
                                $scope.response = data;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not add recommendation link! " + data;
                        });
                } else
                    alert("Please fill out all required fields!");
            };
            $scope.deleteRec = function(rec, index){
                if (confirm("Are you sure you want to delete " + rec.description + " link?")){
                    osFactory.postData({action : 2}, rec)
                        .success(function(data, status, headers, config) {
                            $scope.response = data;
                            $scope.recList.RecList.splice(index, 1);
                            $scope.expanded = -1;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not delete recommendation! " + data;
                        });
                }
            };
            $scope.updateRec = function(rec){
                osFactory.postData({action : 3}, rec)
                    .success(function(data, status, headers, config) {
                        $scope.response = data;
                        $scope.expanded = -1;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.response = "Error: Could not update recommendation! " + data;
                    });
            };
        }])
    .directive('recommendedLinksList', [ function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'manageOneSearchCtrl',
            templateUrl: 'manageOneSearch/manageOneSearch.tpl.html'
        };
    }])

    .controller('oneSearchStatCtrl', ['$scope', 'osFactory',
        function oneSearchStatCtrl($scope, osFactory){
            $scope.statList = [];

            osFactory.getData('statistics')
                .success(function(data) {
                    $scope.statList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])
    .directive('searchStatisticsList', [ function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'oneSearchStatCtrl',
            templateUrl: 'manageOneSearch/oneSearchStat.tpl.html'
        };
    }]);
angular.module('manage.manageSoftware', ['ngFileUpload'])
    .controller('manageSWCtrl', ['$scope', 'tokenFactory', 'swFactory',
        function manageSWCtrl($scope, tokenFactory, swFactory){
            $scope.SWList = {};
            $scope.newSW = {};
            $scope.newComp = {};

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
                        data.software[i].newVer.version = "";
                        data.software[i].newVer.selOS = $scope.os[0];
                        for (var j = 0; j < data.software[i].versions.length; j++){
                            data.software[i].versions[j].newLoc = {};
                            data.software[i].versions[j].newLoc.selLoc = data.locations[0];
                            data.software[i].versions[j].newLoc.devices = [];
                            for (var k = 0; k < data.devices.length; k++)
                                data.software[i].versions[j].newLoc.devices[k] = false;
                        }
                        for (var j = 0; j < data.licenseModes.length; j++)
                            if (data.licenseModes[j].lmid === data.software[i].lmid){
                                data.software[i].selMode = data.licenseModes[j];
                            }
                        data.software[i].newLink = {};
                        data.software[i].newLink.description = "";
                        data.software[i].newLink.title = "";
                        data.software[i].newLink.url = "";
                    }
                    $scope.newSW.selCat = data.categories[0];
                    $scope.newSW.selMode = data.licenseModes[0];
                    $scope.selMap = data.maps[3];
                    $scope.newComp.selLoc = data.locations[0];

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
                },
                { name: 'Computer Maps',
                    number: 2,
                    active: false
                }
            ];
        }])

    .directive('manageSoftwareMain', ['$animate', function($animate) {
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
    }])

    .controller('manageSWListCtrl', ['$scope', '$timeout', 'Upload', 'swFactory', 'SOFTWARE_URL',
        function manageSWListCtrl($scope, $timeout, Upload, swFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'status', reverse:false}
            ];
            $scope.sortButton = $scope.sortMode;
            $scope.appURL = appURL;

            $scope.newSW.versions = [];
            $scope.newSW.links = [];
            $scope.newSW.categories = [];
            $scope.newSW.newVer = {};
            $scope.newSW.newVer.selOS = $scope.os[0];
            $scope.newSW.newVer.version = "";
            $scope.newSW.newLink = {};
            $scope.newSW.newLink.description = "";
            $scope.newSW.newLink.title = "";
            $scope.newSW.newLink.url = "";
            $scope.newSW.modules = "";
            $scope.newSW.trf = 0;
            $scope.newSW.po = 0;
            $scope.newSW.num_licenses = 0;
            $scope.newSW.trf_notes = "";
            $scope.newSW.purch_date = "2015-1-1";
            $scope.newSW.vendor_name = "";
            $scope.newSW.vendor_contact = "";
            $scope.newSW.vendor_phone = "";
            $scope.newSW.vendor_email = "";
            $scope.newSW.main_effect = "2015-1-1";
            $scope.newSW.main_exp = "2015-1-1";
            $scope.newSW.pkey = "";
            $scope.newSW.devices = "";

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
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.publishSW = function(sw){
                swFactory.postData({action : 10}, sw)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].status = 1;
                            $scope.formResponse = "Software has been published.";
                        } else {
                            $scope.formResponse = "Error: Can not publish software! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not publish software! " + data;
                        console.log(data);
                    });
            };
            $scope.unpublishSW = function(sw){
                swFactory.postData({action : 11}, sw)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].status = 0;
                            $scope.formResponse = "Software has been unpublished.";
                        } else {
                            $scope.formResponse = "Error: Can not publish software! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not publish software! " + data;
                        console.log(data);
                    });
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
                            newSW.status = 0;
                            newSW.icon = response.data.icon;
                            newSW.show = false;
                            newSW.class = "";
                            for (var i = 0; i < newSW.versions.length; i++){
                                newSW.versions[i].newLoc = {};
                                newSW.versions[i].newLoc.selLoc = $scope.SWList.locations[0];
                                newSW.versions[i].newLoc.devices = [];
                                for (var j = 0; j < $scope.SWList.devices.length; j++)
                                    newSW.versions[i].newLoc.devices[j] = false;
                            }
                            newSW.selCat = response.data.categories[0];
                            newSW.newVer = {};
                            newSW.newVer.selOS = $scope.os[0];
                            newSW.newVer.version = "";
                            newSW.newLink = {};
                            newSW.newLink.description = "";
                            newSW.newLink.title = "";
                            newSW.newLink.url = "";
                            newSW.trf = $scope.newSW.trf;
                            newSW.po = $scope.newSW.po;
                            newSW.num_licenses = $scope.newSW.num_licenses;
                            newSW.trf_notes = $scope.newSW.trf_notes;
                            newSW.purch_date = $scope.newSW.purch_date;
                            newSW.vendor_name = $scope.newSW.vendor_name;
                            newSW.vendor_contact = $scope.newSW.vendor_contact;
                            newSW.vendor_phone = $scope.newSW.vendor_phone;
                            newSW.vendor_email = $scope.newSW.vendor_email;
                            newSW.main_effect = $scope.newSW.main_effect;
                            newSW.main_exp = $scope.newSW.main_exp;
                            newSW.pkey = $scope.newSW.pkey;
                            newSW.devices = $scope.newSW.devices;
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
            $scope.copySW = function(sw) {
                $scope.newSW = angular.copy(sw);
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
                    newVer.newLoc = {};
                    newVer.newLoc.selLoc = $scope.SWList.locations[0];
                    newVer.newLoc.devices = [];
                    for (var j = 0; j < $scope.SWList.devices.length; j++)
                        newVer.newLoc.devices[j] = false;
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
                newLoc.lid = version.newLoc.selLoc.lid;
                newLoc.name = version.newLoc.selLoc.name;
                newLoc.parent = version.newLoc.selLoc.parent;
                newLoc.devices = 0;
                var isPresent = false;
                for (var i = 0; i < version.locations.length; i++)
                    if (version.locations[i].lid == newLoc.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent){
                    for (var i = 0; i < $scope.SWList.devices.length; i++)
                        if (version.newLoc.devices[i])
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
                    newVersion.newLoc = {};
                    newVersion.newLoc.selLoc = $scope.SWList.locations[0];
                    newVersion.newLoc.devices = [];
                    for (var j = 0; j < $scope.SWList.devices.length; j++)
                        newVersion.newLoc.devices[j] = false;
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
                newLoc.lid = version.newLoc.selLoc.lid;
                newLoc.name = version.newLoc.selLoc.name;
                newLoc.parent = version.newLoc.selLoc.parent;
                newLoc.devices = 0;
                var isPresent = false;
                for (var i = 0; i < version.locations.length; i++)
                    if (version.locations[i].lid == newLoc.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent){
                    for (var i = 0; i < $scope.SWList.devices.length; i++)
                        if (version.newLoc.devices[i])
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

    .directive('softwareManageList',[  function() {
        return {
            restrict: 'A',
            controller: 'manageSWListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareList.tpl.html'
        };
    }])
    .filter('startFrom', [ function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    }])
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
                            newLoc.fullName = newLoc.name;
                            if ($scope.newLocation.parent > 0)
                                for (var i = 0; i < $scope.SWList.locations.length; i++)
                                    if ($scope.SWList.locations[i].lid === $scope.newLocation.parent){
                                        newLoc.parent = $scope.newLocation.parent;
                                        newLoc.fullName = $scope.SWList.locations[i].name + ": " + newLoc.name;
                                        break;
                                    }
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
    .directive('softwareManageLocCat', [ function() {
        return {
            restrict: 'A',
            controller: 'manageSWLocCatCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareLocCat.tpl.html'
        };
    }])

    .controller('manageSWCompMapsCtrl', ['$scope', '$window', 'swFactory', function manageSWCompMapsCtrl($scope, $window, swFactory){
        $scope.selComp = -1;
        $scope.selCompX = 0;
        $scope.selCompY = 0;
        $scope.selCompOS = {};
        $scope.selCompLoc = {};
        $scope.high = -1;
        $scope.newComp.name = "";
        $scope.newComp.selType = $scope.os[0];
        $scope.showCreate = false;
        $scope.compStatus = [
            {name: 'Off', value: 0},
            {name: 'On', value: 1}
        ];
        $scope.selCompStatus = $scope.compStatus[0];

        $scope.highlight = function(comp){
            $scope.high = comp.compid;
        };
        $scope.expand = function(index){
            if ($scope.selComp !== index){
                $scope.selComp = index;
                var comp = $scope.selMap.computers[index];
                $scope.selCompX = parseInt(comp.mapX) + 15;
                $scope.selCompY = parseInt(comp.mapY) + 15;
                if (comp.type == $scope.os[0].value)
                    $scope.selCompOS = $scope.os[0];
                else
                    $scope.selCompOS = $scope.os[1];
                if (comp.status == 1)
                    $scope.selCompStatus = $scope.compStatus[1];
                else
                    $scope.selCompStatus = $scope.compStatus[0];
                for (var i = 0; i < $scope.SWList.locations.length; i++)
                    if ($scope.SWList.locations[i].lid == comp.lid){
                        $scope.selCompLoc = $scope.SWList.locations[i];
                        break;
                    }
                $scope.compResponse = "";
            } else
                $scope.selComp = -1;
        };
        $scope.updateMap = function(){
            $scope.selComp = -1;
            $scope.showCreate = false;
        };

        $scope.createComp = function(event){
            if (event.button === 2 && event.target.id === "computer-map"){
                $scope.newComp.mid = $scope.selMap.mid;
                var offset = getOffset(event.target);
                $scope.newComp.mapX = Math.round(event.pageX - offset.left);
                $scope.newComp.mapY = Math.round(event.pageY - offset.top);

                $scope.showCreate = true;
                $scope.compResponse = "";
            }
        };

        function getOffset(elm){
            var rect = elm.getBoundingClientRect();
            //return {top: rect.top, left: rect.left};
            var doc = elm.ownerDocument;
            var docElem = doc.documentElement;

            return {
                top: rect.top + $window.pageYOffset - docElem.clientTop,
                left: rect.left + $window.pageXOffset - docElem.clientLeft
            };
        }

        $scope.addComp = function(){
            swFactory.postData({action : 12}, $scope.newComp)
                .success(function(data, status, headers, config) {
                    if ((typeof data === 'object') && (data !== null)){
                        var newComputer = {};
                        newComputer.compid = data.id;
                        newComputer.name = $scope.newComp.name;
                        newComputer.type = $scope.newComp.selType.value;
                        newComputer.lid = $scope.newComp.selLoc.lid;
                        newComputer.mid = $scope.newComp.mid;
                        newComputer.mapX = $scope.newComp.mapX;
                        newComputer.mapY = $scope.newComp.mapY;
                        newComputer.status = 1;
                        $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers.push(newComputer);
                        $scope.showCreate = false;
                        $scope.compResponse = "Computer has been added!";
                    } else {
                        $scope.compResponse = "Error: Can not add Computer! " + data;
                    }
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.compResponse = "Error: Could not add Computer! " + data;
                    console.log(data);
                });
        };
        $scope.deleteComp = function(){
            if (confirm("Delete " + $scope.selMap.computers[$scope.selComp].name + " permanently?") == true){
                swFactory.postData({action : 13}, $scope.selMap.computers[$scope.selComp])
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers.splice($scope.selComp, 1);
                            $scope.selComp = -1;
                            $scope.compResponse = "Computer has been deleted!";
                        } else {
                            $scope.compResponse = "Error: Can not delete Computer! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.compResponse = "Error: Could not delete Computer! " + data;
                        console.log(data);
                    });
            }
        };
        $scope.updateComp = function(){
            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp].type = $scope.selCompOS.value;
            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp].lid = $scope.selCompLoc.lid;
            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp].status = $scope.selCompStatus.value;
            swFactory.postData({action : 14}, $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp])
                .success(function(data, status, headers, config) {
                    if (data == 1){
                        $scope.compResponse = "Computer name has been updated!";
                    } else {
                        $scope.compResponse = "Error: Can not update Computer! " + data;
                    }
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.compResponse = "Error: Could not update Computer! " + data;
                    console.log(data);
                });
        };


    }])
    .directive('softwareManageComputerMaps', [ function() {
        return {
            restrict: 'A',
            controller: 'manageSWCompMapsCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareComputerMaps.tpl.html'
        };
    }])

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

        $scope.sortMode = 1;
        $scope.sortModes = [
            {by:'wpLogin', reverse:false},
            {by:'name', reverse:false}
        ];

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
    .directive('userGroupsList', [ function() {
        return {
            restrict: 'A',
            scope: {},
            controller: 'userGroupsCtrl',
            templateUrl: 'manageUserGroups/manageUG.tpl.html'
        };
    }])
    .controller('myWebAppsCtrl', ['$scope', '$window',
        function myWebAppsCtrl($scope, $window){
            $scope.apps = $window.apps;
            $scope.userName = $window.userName;
        }])
    .directive('viewMyWebApps', [ function() {
        return {
            restrict: 'A',
            scope: {},
            controller: 'myWebAppsCtrl',
            templateUrl: 'manageUserGroups/viewMyWebApps.tpl.html'
        };
    }])
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
    .directive('siteFeedbackList', [ function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'siteFeedbackCtrl',
            templateUrl: 'siteFeedback/siteFeedback.tpl.html'
        };
    }])

angular.module('manage.staffDirectory', ['ui.tinymce'])
    .constant('STAFF_DIR_RANKS', [
        "",
        "Prof.",
        "Assoc. Prof.",
        "Asst. Prof."
    ])

    .controller('staffDirCtrl', ['$scope', 'tokenFactory', 'sdFactory', 'STAFF_DIR_URL',
        function staffDirCtrl($scope, tokenFactory, sdFactory, appUrl){
            $scope.Directory = {};
            $scope.newPerson = {};
            $scope.newDept = {};

            $scope.tabs = [
                { name: 'Directory',
                    number: 0,
                    active: true
                },
                { name: 'Subjects',
                    number: 1,
                    active: false
                },
                { name: 'Departments/Locations',
                    number: 2,
                    active: false
                }
            ];
            $scope.subjectTypes = [
                {name: 'Specialist', value: 1},
                {name: 'Instructor', value: 2},
                {name: 'Both', value: 3}
            ];
            $scope.sortModes = [
                {by:'lastname', reverse:false},
                {by:'title', reverse:false},
                {by:'department', reverse:false}
            ];
            $scope.sortMode = $scope.sortModes[0];
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            tokenFactory("CSRF-libStaffDir");

            sdFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    $scope.Directory = data;
                    for (var i = 0; i < $scope.Directory.list.length; i++){
                        $scope.Directory.list[i].selSubj = $scope.Directory.subjects[0];
                        $scope.Directory.list[i].selType = $scope.subjectTypes[0];
                        for (var j = 0; j < $scope.Directory.departments.length; j++)
                            if ($scope.Directory.departments[j].depid == $scope.Directory.list[i].dept){
                                $scope.Directory.list[i].selDept = $scope.Directory.departments[j];
                                break;
                            }
                        for (var j = 0; j < $scope.Directory.divisions.length; j++)
                            if ($scope.Directory.divisions[j].divid == $scope.Directory.list[i].divis){
                                $scope.Directory.list[i].selDiv = $scope.Directory.divisions[j];
                                break;
                            }
                        $scope.Directory.list[i].class = "";
                        $scope.Directory.list[i].show = false;
                        $scope.Directory.list[i].image = appUrl + "staffImages/" + $scope.Directory.list[i].id + ".jpg";
                    }
                    $scope.newPerson.selSubj = $scope.Directory.subjects[0];
                    for (var i = 0; i < $scope.Directory.subjects.length; i++)
                        $scope.Directory.subjects[i].show = false;
                    $scope.newPerson.selDept = $scope.Directory.departments[0];
                    for (var i = 0; i < $scope.Directory.departments.length; i++){
                        $scope.Directory.departments[i].show = false;
                        for (var j = 0; j < $scope.Directory.libraries.length; j++)
                            if ($scope.Directory.libraries[j].lid == $scope.Directory.departments[i].library){
                                $scope.Directory.departments[i].selLib = $scope.Directory.libraries[j];
                            }
                    }
                    $scope.newPerson.selDiv = $scope.Directory.divisions[0];
                    for (var i = 0; i < $scope.Directory.libraries.length; i++)
                        $scope.Directory.libraries[i].show = false;
                    for (var i = 0; i < $scope.Directory.divisions.length; i++)
                        $scope.Directory.divisions[i].show = false;
                    $scope.newDept.selLib = $scope.Directory.libraries[0];

                    $scope.sortBy(0);
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])
    .directive('staffDirectoryList', ['$animate', function($animate) {
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
    }])
    .controller('staffDirPeopleCtrl', ['$scope', 'sdFactory', 'STAFF_DIR_RANKS', 'STAFF_DIR_URL',
        function staffDirPeopleCtrl($scope, sdFactory, ranks, appUrl){
            $scope.lastNameFilter = '';
            $scope.firstNameFilter = '';
            $scope.titleFilter = '';
            $scope.deptFilter = '';
            $scope.ranks = ranks;

            $scope.newPerson.first = "";
            $scope.newPerson.last = "";
            $scope.newPerson.email = "";
            $scope.newPerson.title = "";
            $scope.newPerson.phone = "";
            $scope.newPerson.fax = "";
            $scope.newPerson.rank = ranks[0];
            $scope.formResponse = '';

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.togglePerson = function(person){
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].show =
                    !$scope.Directory.list[$scope.Directory.list.indexOf(person)].show;
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "";
            };

            $scope.deletePerson = function(person){
                if (confirm("Delete " + person.lastname + ", " + person.firstname  + " record permanently?") == true){
                    sdFactory.postData({action : 1}, person)
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
                sdFactory.postData({action : 2}, person)
                    .success(function(data, status, headers, config) {
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Person has been updated!";
                    })
                    .error(function(data, status, headers, config) {
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Error: Person update failed! " + data;
                    });
            };
            $scope.deleteSubject = function(person, subject, index){
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.splice(index, 1);
            };
            $scope.addSubject = function(person){
                var isPresent = false;
                for (var i = 0; i < person.subjects.length; i++)
                    if (person.subjects[i].sid === person.selSubj.sid){
                        isPresent = true;
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects[i].type = person.selType.value;
                        break;
                    }
                if (!isPresent){
                    var newSubj = {};
                    newSubj.sid = person.selSubj.sid;
                    newSubj.subject = person.selSubj.subject;
                    newSubj.link = person.selSubj.link;
                    newSubj.type = person.selType.value;
                    $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.push(newSubj);
                }
            };

            $scope.isValidEmailAddress = function(emailAddress) {
                var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
                return pattern.test(emailAddress);
            };

            $scope.addPerson = function() {
                $scope.formResponse = '';
                if ( $scope.newPerson.first.length > 0 )
                {
                    if ( $scope.newPerson.last.length > 0 )
                    {
                        if ( $scope.isValidEmailAddress( $scope.newPerson.email) )
                        {
                            if ( $scope.newPerson.title.length > 0 )
                            {
                                if ( $scope.newPerson.phone.length >= 7 )
                                    sdFactory.postData({action : 3}, $scope.newPerson)
                                        .success(function(data, status, headers, config) {
                                            if ((typeof data === 'object') && (data !== null)){
                                                var createdUser = {};
                                                createdUser.id = data.id;
                                                createdUser.lastname = $scope.newPerson.last;
                                                createdUser.firstname = $scope.newPerson.first;
                                                createdUser.title = $scope.newPerson.title;
                                                createdUser.rank = $scope.newPerson.rank;
                                                createdUser.department = $scope.newPerson.selDept.name;
                                                createdUser.division = $scope.newPerson.selDiv.name;
                                                createdUser.phone = $scope.newPerson.phone;
                                                createdUser.email = $scope.newPerson.email;
                                                createdUser.fax = $scope.newPerson.fax;
                                                createdUser.subjects = [];
                                                createdUser.show = false;
                                                createdUser.selSubj = $scope.Directory.subjects[0];
                                                createdUser.selType = $scope.subjectTypes[0];
                                                for (var j = 0; j < $scope.Directory.departments.length; j++)
                                                    if ($scope.Directory.departments[j].depid == $scope.newPerson.selDept.depid){
                                                        createdUser.selDept = $scope.Directory.departments[j];
                                                        break;
                                                    }
                                                for (var j = 0; j < $scope.Directory.divisions.length; j++)
                                                    if ($scope.Directory.divisions[j].divid == $scope.newPerson.selDiv.divid){
                                                        createdUser.selDiv = $scope.Directory.divisions[j];
                                                        break;
                                                    }
                                                createdUser.class = "";
                                                createdUser.image = appUrl + "staffImages/" + createdUser.id + ".jpg";
                                                $scope.Directory.list.push(createdUser);
                                                $scope.formResponse = "Person has been added!";
                                            } else
                                                $scope.formResponse = "Error: Person could not be added! " + data;
                                        })
                                        .error(function(data, status, headers, config) {
                                            $scope.formResponse = "Error: Person Creation failed! " + data;
                                        });
                                else
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
    .directive('manageSdPeople', [ function() {
        return {
            restrict: 'AC',
            controller: 'staffDirPeopleCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'staffDirectory/staffDirectoryPeople.tpl.html'
        };
    }])
    .filter('startFrom', [ function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    }])

    .controller('staffDirSubjectsCtrl', ['$scope', 'sdFactory',
        function staffDirSubjectsCtrl($scope, sdFactory){
            $scope.newSubj = {};
            $scope.newSubj.subject = "";
            $scope.newSubj.link = "";
            $scope.subResponse = '';

            $scope.expandSubject = function(subject){
                if (!$scope.Directory.subjects[$scope.Directory.subjects.indexOf(subject)].show)
                    $scope.Directory.subjects[$scope.Directory.subjects.indexOf(subject)].show = true;
            };

            $scope.editSubject = function(subject){
                sdFactory.postData({action : 6}, subject)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.subjects[$scope.Directory.subjects.indexOf(subject)].show = false;
                        } else {
                            $scope.subResponse = "Error: Can not save subject! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.subResponse = "Error: Could not save subject! " + data;
                    });
            };
            $scope.deleteSubject = function(subject){
                if (confirm("Delete "+ subject.subject + " subject?") == true){
                    sdFactory.postData({action : 7}, subject)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.subjects.splice($scope.Directory.subjects.indexOf(subject), 1);
                                $scope.subResponse = "Subject has been deleted!";
                            } else {
                                $scope.subResponse = "Error: Can not delete subject! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.subResponse = "Error: Could not delete subject! " + data;
                        });
                }
            };
            $scope.addSubject = function(){
                sdFactory.postData({action : 8}, $scope.newSubj)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newSubject = {};
                            newSubject.sid = data.id;
                            newSubject.subject = $scope.newSubj.subject;
                            newSubject.link = $scope.newSubj.link;
                            newSubject.show = false;
                            $scope.Directory.subjects.push(newSubject);
                            $scope.subResponse = "Subject has been added!";
                        } else {
                            $scope.subResponse = "Error: Can not add subject! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.subResponse = "Error: Could not add subject! " + data;
                    });

            };

        }])
    .directive('manageSdSubjects', [ function() {
        return {
            restrict: 'AC',
            controller: 'staffDirSubjectsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'staffDirectory/staffDirectorySubjects.tpl.html'
        };
    }])

    .controller('staffDirDepartmentsCtrl', ['$scope', 'sdFactory',
        function staffDirDepartmentsCtrl($scope, sdFactory){
            $scope.newDept.name = "";
            $scope.newLoc = {};
            $scope.newLoc.name = "";
            $scope.newDiv = {};
            $scope.newDiv.name = "";
            $scope.depResponse = '';
            $scope.libResponse = '';
            $scope.divResponse = '';

            $scope.expandDepartment = function(dept){
                if (!$scope.Directory.departments[$scope.Directory.departments.indexOf(dept)].show)
                    $scope.Directory.departments[$scope.Directory.departments.indexOf(dept)].show = true;
            };
            $scope.expandLibrary = function(lib){
                if (!$scope.Directory.libraries[$scope.Directory.libraries.indexOf(lib)].show)
                    $scope.Directory.libraries[$scope.Directory.libraries.indexOf(lib)].show = true;
            };
            $scope.expandDivision = function(division){
                if (!$scope.Directory.divisions[$scope.Directory.divisions.indexOf(division)].show)
                    $scope.Directory.divisions[$scope.Directory.divisions.indexOf(division)].show = true;
            };

            $scope.editDepartment = function(dept){
                sdFactory.postData({action : 9}, dept)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.departments[$scope.Directory.departments.indexOf(dept)].show = false;
                        } else {
                            $scope.depResponse = "Error: Can not save department! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.depResponse = "Error: Could not save subject! " + data;
                    });
            };
            $scope.deleteDepartment = function(dept){
                if (confirm("Delete "+ dept.name + " department?") == true){
                    sdFactory.postData({action : 10}, dept)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.departments.splice($scope.Directory.departments.indexOf(dept), 1);
                                $scope.depResponse = "Department has been deleted!";
                            } else {
                                $scope.depResponse = "Error: Can not delete department! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.depResponse = "Error: Could not delete department! " + data;
                        });
                }
            };
            $scope.addDepartment = function(){
                sdFactory.postData({action : 11}, $scope.newDept)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newDepartment = {};
                            newDepartment.depid = data.id;
                            newDepartment.name = $scope.newDept.name;
                            newDepartment.library = $scope.newDept.selLib.lid;
                            newDepartment.show = false;
                            $scope.Directory.departments.push(newDepartment);
                            $scope.depResponse = "Department has been added!";
                        } else {
                            $scope.depResponse = "Error: Can not add department! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.depResponse = "Error: Could not add department! " + data;
                    });

            };
            $scope.editLibrary = function(lib){
                sdFactory.postData({action : 12}, lib)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.libraries[$scope.Directory.libraries.indexOf(lib)].show = false;
                        } else {
                            $scope.libResponse = "Error: Can not update library! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.libResponse = "Error: Could not update library! " + data;
                    });
            };
            $scope.deleteLibrary = function(lib){
                if (confirm("Delete "+ lib.name + "?") == true){
                    sdFactory.postData({action : 13}, lib)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.libraries.splice($scope.Directory.libraries.indexOf(lib), 1);
                                $scope.libResponse = "Library has been deleted!";
                            } else {
                                $scope.libResponse = "Error: Can not delete library! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.libResponse = "Error: Could not delete library! " + data;
                        });
                }
            };
            $scope.addLibrary = function(){
                sdFactory.postData({action : 14}, $scope.newLoc)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newLibrary = {};
                            newLibrary.lid = data.id;
                            newLibrary.name = $scope.newLoc.name;
                            newLibrary.show = false;
                            $scope.Directory.libraries.push(newLibrary);
                            $scope.libResponse = "Library has been added!";
                        } else {
                            $scope.libResponse = "Error: Can not add library! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.libResponse = "Error: Could not add library! " + data;
                    });

            };
            $scope.editDivision = function(division){
                sdFactory.postData({action : 15}, division)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.divisions[$scope.Directory.divisions.indexOf(division)].show = false;
                        } else {
                            $scope.divResponse = "Error: Can not save division! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.divResponse = "Error: Could not save division! " + data;
                    });
            };
            $scope.deleteDivision = function(division){
                if (confirm("Delete "+ division.name + " division?") == true){
                    sdFactory.postData({action : 16}, division)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.divisions.splice($scope.Directory.divisions.indexOf(division), 1);
                                $scope.divResponse = "Division has been deleted!";
                            } else {
                                $scope.divResponse = "Error: Can not delete division! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.divResponse = "Error: Could not delete division! " + data;
                        });
                }
            };
            $scope.addDivision = function(){
                sdFactory.postData({action : 17}, $scope.newDiv)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newDivision = {};
                            newDivision.divid = data.id;
                            newDivision.name = $scope.newDiv.name;
                            newDivision.show = false;
                            $scope.Directory.divisions.push(newDivision);
                            $scope.divResponse = "Division has been added!";
                        } else {
                            $scope.divResponse = "Error: Can not add division! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.divResponse = "Error: Could not add division! " + data;
                    });

            };

        }])
    .directive('manageSdDepartments', [ function() {
        return {
            restrict: 'AC',
            controller: 'staffDirDepartmentsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'staffDirectory/staffDirectoryDepartments.tpl.html'
        };
    }])

    .controller('staffDirProfileCtrl', ['$scope', 'tokenFactory', 'sdFactory', '$window',
    function staffDirProfileCtrl($scope, tokenFactory, sdFactory, $window){
        $scope.userProfile = {};
        $scope.login = $window.login;
        $scope.tinymceOptions = {
            onChange: function(e) {
                // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins : 'link image lists spellchecker code print preview',
            skin: 'lightgray',
            theme : 'modern'
        };

        tokenFactory("CSRF-" + $scope.login);

        sdFactory.getProfile($scope.login)
            .success(function(data) {
                $scope.userProfile = data;
                console.dir(data);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.update = function(){
            $scope.userProfile.person.login = $scope.login;
            $scope.userProfile.person.formResponse = "";
            sdFactory.postData({action : 18}, $scope.userProfile.person)
                .success(function(data, status, headers, config) {
                    $scope.userProfile.person.formResponse = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.userProfile.person.formResponse = "Error: Could not update profile! " + data;
                });
        };
    }])
    .directive('editStaffDirectoryProfile', [ function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'staffDirProfileCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'staffDirectory/staffDirectoryProfile.tpl.html'
        };
    }]);



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

            $scope.toggleForms = function(form){
                $scope.data.forms[$scope.data.forms.indexOf(form)].show =
                    !$scope.data.forms[$scope.data.forms.indexOf(form)].show;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };
        }])

    .directive('submittedFormsList', ['$animate', function($animate) {
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
    }])
    .filter('startFrom', [ function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    }])

    .controller('customFormCtrl', ['$scope', 'formFactory',
    function customFormCtrl($scope, formFactory){
        $scope.mailToLib = 0;

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