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
    .directive('softwareManageLocCat', function() {
        return {
            restrict: 'A',
            controller: 'manageSWLocCatCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareLocCat.tpl.html'
        };
    })

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
    .directive('softwareManageComputerMaps', function() {
        return {
            restrict: 'A',
            controller: 'manageSWCompMapsCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareComputerMaps.tpl.html'
        };
    })
