angular.module('manage.staffDirectory', ['ui.tinymce', 'oc.lazyLoad'])
    .constant('STAFF_DIR_RANKS', [
        "",
        "Prof.",
        "Assoc. Prof.",
        "Asst. Prof."
    ])
    .constant('STAFFDIR_GROUP', 8)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/manage-staff-directory', {
                controller: 'staffDirCtrl',
                templateUrl: 'staffDirectory/staffDirectory.tpl.html',
                resolve: {
                    userData: function(tokenReceiver){
                        return tokenReceiver.getPromise();
                    }
                }
            })
            .when('/manage-my-profile', {
                controller: 'staffDirProfileCtrl',
                templateUrl: 'staffDirectory/staffDirectoryProfile.tpl.html',
                resolve: {
                    userData: function(tokenReceiver){
                        return tokenReceiver.getPromise();
                    }
                }
            });
    }])

    .controller('staffDirCtrl', ['$scope', 'sdFactory', 'STAFF_DIR_URL', 'userData', 'STAFFDIR_GROUP',
        function staffDirCtrl($scope, sdFactory, appUrl, userData, STAFFDIR_GROUP){
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

            $scope.hasAccess = false;
            if (angular.isDefined($scope.userInfo.group)) {
                if ($scope.userInfo.group & STAFFDIR_GROUP === STAFFDIR_GROUP) {
                    $scope.hasAccess = true;
                }
            }

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

    .controller('staffDirProfileCtrl', ['$scope', 'sdFactory', 'userData', '$ocLazyLoad',
    function staffDirProfileCtrl($scope, sdFactory, userData, $ocLazyLoad){
        $ocLazyLoad.load('https://cdn.tinymce.com/4/tinymce.min.js');
        $scope.userProfile = {};
        $scope.tinymceOptions = {
            onChange: function(e) {
                // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins : 'link image lists spellchecker code print preview',
            skin: 'lightgray',
            theme : 'modern'
        };

        sdFactory.getProfile($scope.userInfo.login)
            .success(function(data) {
                $scope.userProfile = data;
                console.dir(data);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.update = function(){
            $scope.userProfile.person.login = $scope.userInfo.login;
            $scope.userProfile.person.formResponse = "";
            sdFactory.postData({action : 18}, $scope.userProfile.person)
                .success(function(data, status, headers, config) {
                    $scope.userProfile.person.formResponse = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.userProfile.person.formResponse = "Error: Could not update profile! " + data;
                });
        };
    }]);
