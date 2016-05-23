angular.module('manage.manageDatabases', [])
    .constant('DATABASES_GROUP', 32)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-databases', {
            controller: 'manageDBCtrl',
            templateUrl: 'manageDatabases/manageDatabases.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])
    .controller('manageDBCtrl', ['$scope', '$filter', 'mdbFactory', 'userData', 'DATABASES_GROUP', 'AuthService',
        function manageDBCtrl($scope, $filter, mdbFactory, userData, DATABASES_GROUP, AuthService){
            $scope.userInfo = AuthService.isAuthorized();

            var DBList = {};
            $scope.filters = {
                titleStart: '',
                title: '',
                description: '',
                subjects: '',
                types: '',
                publisher: '',
                vendor: '',
                disabled: '',
                sort: {}
            };
            $scope.filteredDB = null;
            $scope.disValues = [
                {name:'Show all', value:''},
                {name:'Enabled only', value:'0'},
                {name:'Disabled only', value:'1'}
            ];
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'dateCreated', reverse:false},
                {by:'lastModified', reverse:false},
                {by:'tmpDisabled', reverse:true}
            ];
            $scope.newDB = {};
            $scope.newDB.subjects = [];
            $scope.newDB.types = [];

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            //primary, secondary
            $scope.subjectValues = [ 1, 2 ];
            $scope.fullTextValues = [ "", "A", "N", "P", "S" ];
            $scope.inEDSValues = [ "", "Y", "P" ];

            $scope.hasAccess = false;
             if (angular.isDefined($scope.userInfo.group)) {
                if ((parseInt($scope.userInfo.group) & DATABASES_GROUP) === DATABASES_GROUP) {
                    $scope.hasAccess = true;
                    $scope.newDB.updatedBy = $scope.userInfo.login;
                }
             }

            mdbFactory.getData()
                .success(function(data) {
                    for (var i = 0; i < data.databases.length; i++){
                        data.databases[i].show = false;
                        data.databases[i].changed = false;
                        data.databases[i].class = "";
                        data.databases[i].selSubj = data.subjects[0];
                        data.databases[i].subjType = 1;
                        data.databases[i].selType = data.types[0];
                    }
                    $scope.newDB.selSubj = data.subjects[0];
                    $scope.newDB.subjType = 1;
                    $scope.newDB.selType = data.types[0];

                    $scope.types = angular.copy(data.types);
                    $scope.subjects = angular.copy(data.subjects);
                    DBList = angular.copy(data);
                    $scope.filteredDB = angular.copy(data.databases);
                    $scope.filters.sort = {by:'title', reverse:false};
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.$watchCollection('filters', processFilters);

            function processFilters(newVal, oldVal){
                newVal = angular.isUndefined(newVal) ? angular.copy($scope.filters) : newVal;
                var db = angular.copy(DBList.databases);

                for(var filter in newVal){
                    if (oldVal === undefined || newVal[filter] !== oldVal[filter] || filter === 'sort'){
                        switch(filter){
                            case 'sort':
                                db = $filter('orderBy')(db, newVal[filter].by, newVal[filter].reverse);
                                break;
                            case 'titleStart':
                                db = $filter('filter')(db, {title:newVal[filter]}, startTitle);
                                break;
                            default:
                                var f = {};
                                f[filter] = newVal[filter];
                                db = $filter('filter')(db, f);
                        }
                    }
                }

                $scope.filteredDB = angular.copy(db);
            }


            function startTitle(actual, expected){
                if (!expected)
                    return true;
                if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                    return true;
                return false;
            }

            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
                $scope.filters.sort = angular.copy($scope.sortModes[by]);
            };

            $scope.toggleDB = function(db){
                db.show = !db.show;
            };

            $scope.changed = function(db){
                db.changed = true;
            };

            $scope.deleteDB = function(db){
                if (confirm("Delete " + db.title  + " permanently?") == true){
                    mdbFactory.postData({action : 1}, db)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                //$scope.DBList.databases.splice($scope.DBList.databases.indexOf(db), 1);
                                $scope.filteredDB.splice($scope.filteredDB.indexOf(db), 1);
                                DBList.databases = DBList.databases.filter(function(item){
                                    return item.id !== db.id;
                                });
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
                        db.changed = false;

                        alert($scope.formResponse);
                        DBList.databases = DBList.databases.filter(function(item){
                            return item.id !== db.id;
                        });
                        DBList.databases.push(angular.copy(db));
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not update database! " + data;
                        alert($scope.formResponse);
                        console.log(data);
                    });
            };



            $scope.createDB = function(){
                mdbFactory.postData({action : 3}, $scope.newDB)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newDB = {};
                            newDB = angular.extend({publisher: '', vendor:'', disabled: 0}, $scope.newDB);
                            newDB.id = data.id;
                            newDB.subjects = angular.copy(data.subjects);
                            newDB.types = angular.copy(data.types);
                            newDB.show = false;
                            newDB.changed = false;
                            newDB.class = "";
                            newDB.selSubj = data.subjects[0];
                            newDB.subjType = 1;
                            newDB.selType = data.types[0];
                            DBList.databases.push(newDB);
                            processFilters();
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
                            if (typeof db.subjects == 'undefined')
                                db.subjects = [];
                            db.subjects.push(newSubject);
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
                            db.subjects.splice(
                                db.subjects.indexOf(subject),1
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
                            if (typeof db.types == 'undefined')
                                db.types = [];
                            db.types.push(newType);
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
                            db.types.splice(
                                db.types.indexOf(type),1
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