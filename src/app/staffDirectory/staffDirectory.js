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

            $scope.setClass = function(index){
                for (var i = 0; i < $scope.Directory.list.length; i++)
                    $scope.Directory.list[i].class = "";
                $scope.Directory.list[index].class = "active";
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
            templateUrl: 'staffDirectory/staffDirectory.tpl.html'
        };
    })