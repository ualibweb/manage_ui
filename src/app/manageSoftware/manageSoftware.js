angular.module('manage.manageSoftware', ['ngFileUpload'])
    .controller('manageSWCtrl', ['$scope', '$timeout', 'Upload', 'tokenFactory', 'swFactory', 'SOFTWARE_URL',
        function manageSWCtrl($scope, $timeout, Upload, tokenFactory, swFactory, appURL){
            $scope.SWList = {};
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.locationFilter = '';
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'location', reverse:false}
            ];
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.os = [
                {name:'MS Windows', value:1},
                {name:'Apple Mac', value:2},
                {name:'Unix/Lunix', value:3}
            ];
            $scope.appURL = appURL;

            $scope.newSW = {};
            $scope.newSW.versions = [];
            $scope.newSW.links = [];
            $scope.newSW.locations = [];
            $scope.newSW.newVer = {};
            $scope.newSW.newVer.selOS = $scope.os[0];
            $scope.newSW.newLink = {};

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            tokenFactory("CSRF-libSoftware");

            swFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.software.length; i++){
                        data.software[i].show = false;
                        data.software[i].class = "";
                        data.software[i].selLoc = data.locations[0];
                        data.software[i].newVer = {};
                        data.software[i].newVer.selOS = $scope.os[0];
                        data.software[i].newLink = {};
                    }
                    $scope.newSW.selLoc = data.locations[0];
                    $scope.SWList = data;
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
                if (sw.title.length < 1){
                    alert("Form error: Please fill out Title field!");
                    return false;
                }
                swFactory.postData({action : 2}, sw)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.formResponse = "Software has been updated.";
                        } else {
                            $scope.formResponse = "Error: Can not update software! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not update software! " + data;
                        console.log(data);
                    });
            };
            $scope.createSW = function(){
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
                            newSW = angular.copy($scope.newSW);
                            newSW.sid = response.data.id;
                            newSW.versions = angular.copy(response.data.versions);
                            newSW.links = angular.copy(response.data.links);
                            newSW.locations = angular.copy(response.data.locations);
                            newSW.show = false;
                            newSW.class = "";
                            newSW.selLoc = response.data.locations[0];
                            newSW.newVer = {};
                            newSW.newVer.selOS = $scope.os[0];
                            newSW.newLink = {};
                            $scope.SWList.software.push(newSW);
                            $scope.formResponse = "Software has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add software! " + data;
                        }
                        console.dir(response);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.formResponse = response.status + ': ' + response.data;
                });
                $scope.newSW.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newSW.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };

            $scope.addVersion = function(sw){
                var newVer = {};
                newVer.vid = -1;
                newVer.sid = sw.sid;
                newVer.version = sw.newVer.version;
                newVer.os = sw.newVer.selOS.value;
                var isPresent = false;
                for (var i = 0; i < sw.versions.length; i++)
                    if (sw.versions[i].version === newVer.version &&
                        sw.versions[i].os === newVer.os){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.push(newVer);
            };
            $scope.deleteVersion = function(sw, version){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version),1
                );
            };
            $scope.addLocation = function(sw){
                var newLoc = {};
                newLoc.id = -1;
                newLoc.lid = sw.selLoc.lid;
                newLoc.name = sw.selLoc.name;
                var isPresent = false;
                for (var i = 0; i < sw.locations.length; i++)
                    if (sw.locations[i].lid == newLoc.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations.push(newLoc);
            };
            $scope.deleteLocation = function(sw, location){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations.indexOf(location),1
                );
            };
            $scope.addLink = function(sw){
                var newLink = {};
                newLink.linkid = -1;
                newLink.sid = sw.sid;
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
            };
            $scope.deleteLink = function(sw, link){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.indexOf(link),1
                );
            };

            $scope.delNewSWVer = function(version){
                $scope.newSW.versions.splice($scope.newSW.versions.indexOf(version), 1);
            };
            $scope.delNewSWLoc = function(location){
                $scope.newSW.locations.splice($scope.newSW.locations.indexOf(location), 1);
            };
            $scope.delNewSWLink = function(link){
                $scope.newSW.links.splice($scope.newSW.links.indexOf(link), 1);
            };
            $scope.addNewSWVer = function(){
                var newVersion = {};
                newVersion.version = $scope.newSW.newVer.version;
                newVersion.os = $scope.newSW.newVer.selOS.value;
                var isPresent = false;
                for (var i = 0; i < $scope.newSW.versions.length; i++)
                    if ($scope.newSW.versions[i].version == newVersion.version &&
                        $scope.newSW.versions[i].os == newVersion.os){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newSW.versions.push(newVersion);
            };
            $scope.addNewSWLoc = function(){
                var newLocation = {};
                newLocation.lid = $scope.newSW.selLoc.lid;
                newLocation.name = $scope.newSW.selLoc.name;
                var isPresent = false;
                for (var i = 0; i < $scope.newSW.locations.length; i++)
                    if ($scope.newSW.locations[i].lid == newLocation.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newSW.locations.push(newLocation);
            };
            $scope.addNewSWLink = function(){
                var newLink = {};
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

    .directive('softwareManageList', function($animate) {
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
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })
