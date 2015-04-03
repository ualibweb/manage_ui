angular.module('manage.staffDirectory', [])
    .controller('staffDirCtrl', ['$scope', '$http', 'sdFactory',
        function staffDirCtrl($scope, $http, sdFactory){
            $scope.sortMode = 'lastname';
            $scope.filterBy = '';
            $scope.sortButton = 'last';
            $scope.Directory = {};
            $scope.selSubj = {};

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
                    $scope.selSubj = $scope.Directory.subjects[0];
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.deletePerson = function(person, index){
                if (confirm("Delete this record permanently?") == true){
                    sdFactory.postData({delete : person.id}, {})
                        .success(function(data, status, headers, config) {
                            $scope.formResponse = data;
                            $scope.formData = {};
                            $scope.formData.rank = "0";
                            $scope.formData.dept = "Acquisitions";
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
                        })
                        .error(function(data, status, headers, config) {
                            $scope.subjResponse = "Error: Could not delete subject! " + data;
                        });
                }
            };
            $scope.addSubject = function(person){
                if (person.newSubject > 0){
                    sdFactory.postData({addSubject : 1}, person)
                        .success(function(data, status, headers, config) {
                            $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.push($scope.selSubj);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.subjResponse = "Error: Could not add subject! " + data;
                        });
                }
            };

            $scope.formData = {};
            $scope.formData.first = "";
            $scope.formData.last = "";
            $scope.formData.email = "";
            $scope.formData.title = "";
            $scope.formData.phone = "";
            $scope.formData.fax = "";
            $scope.formData.rank = "0";
            $scope.formData.dept = "Acquisitions";
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
                                                    $scope.Directory.list.push(createdUser);

                                                    $scope.formData = {};
                                                    $scope.formData.rank = "0";
                                                    $scope.formData.dept = "Acquisitions";
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
            scope: {
                hasAccess: "@"
            },
            controller: 'staffDirCtrl',
            templateUrl: 'staffDirectory/staffDirectory.tpl.html'
        };
    })