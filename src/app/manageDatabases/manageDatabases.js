angular.module('manage.manageDatabases', [])
    .controller('manageDBCtrl', ['$scope', '$http', '$window', 'dbFactory',
        function manageDBCtrl($scope, $http, $window, dbFactory){
            $scope.DBList = {};
            $scope.sortMode = 'Title';
            $scope.titleFilter = '';
            $scope.subjectFilter = '';
            $scope.typeFilter = '';
            $scope.sortButton = 'title';
            $scope.mOver = 0;
            $scope.newDB = {};
            $scope.newDB.subjects = [];
            $scope.newDB.types = [];
            $scope.updatedBy = $window.userName;
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

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
            $http.defaults.headers.post = { 'X-CSRF-libDatabases' : $scope.GetCookie("CSRF-libDatabases") };

            dbFactory.getData()
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

            $scope.toggleDB = function(db){
                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].show =
                    !$scope.DBList.databases[$scope.DBList.databases.indexOf(db)].show;
            };
            $scope.setOver = function(db){
                $scope.mOver = db.id;
            };

            $scope.deleteDB = function(db){
                if (confirm("Delete " + db.title  + " permanently?") == true){
                    dbFactory.postData({action : 1}, db)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.DBList.databases.splice($scope.DBList.databases.indexOf(db), 1);
                                $scope.formResponse = "Database has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete database! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete database! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateDB = function(db){
                db.updatedBy = $scope.updatedBy;
                dbFactory.postData({action : 2}, db)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.formResponse = "Database has been updated.";
                        } else {
                            $scope.formResponse = "Error: Can not update database! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not update database! " + data;
                        console.log(data);
                    });
            };
            $scope.createDB = function(){
                $scope.newDB.updatedBy = $scope.updatedBy;
                console.dir($scope.newDB);
                dbFactory.postData({action : 3}, $scope.newDB)
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
                newSubject.updatedBy = $scope.updatedBy;
                dbFactory.postData({action : 4}, newSubject)
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
                dbFactory.postData({action : 5}, subject)
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
                newType.updatedBy = $scope.updatedBy;
                dbFactory.postData({action : 6}, newType)
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
                dbFactory.postData({action : 7}, type)
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
            return input.slice(start);
        }
    })
