angular.module('manage.manageSoftware', ['ngFileUpload'])
    .constant('OS', [
        {name:'MS Windows', value:1},
        {name:'Apple Mac', value:2}
    ])

    .controller('manageSWCtrl', ['$scope', 'tokenFactory', 'swFactory', 'OS',
        function manageSWCtrl($scope, tokenFactory, swFactory, OS){
            $scope.SWList = {};
            $scope.newSW = {};
            $scope.newComp = {};

            tokenFactory("CSRF-libSoftware");

            swFactory.getData("all/backend")
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.software.length; i++){
                        data.software[i].show = false;
                        data.software[i].class = "";
                        data.software[i].selCat = data.categories[0];
                        data.software[i].newVer = {};
                        data.software[i].newVer.version = "";
                        data.software[i].newVer.selOS = OS[0];
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

    .controller('manageSWListCtrl', ['$scope', '$timeout', 'Upload', 'swFactory', 'SOFTWARE_URL', 'OS',
        function manageSWListCtrl($scope, $timeout, Upload, swFactory, appURL, OS){
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
            $scope.newSW.newVer.selOS = OS[0];
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
            $scope.newSW.owner = {};
            $scope.newSW.owner.department = "";
            $scope.newSW.owner.name = "";
            $scope.newSW.owner.email = "";
            $scope.newSW.owner.phone = "";
            $scope.newSW.partners = [];
            $scope.newSW.partners[0] = {};
            $scope.newSW.partners[0].department = "";
            $scope.newSW.partners[0].name = "";
            $scope.newSW.partners[0].email = "";
            $scope.newSW.partners[0].phone = "";
            $scope.newSW.requester = {};
            $scope.newSW.requester.department = "";
            $scope.newSW.requester.name = "";
            $scope.newSW.requester.email = "";
            $scope.newSW.requester.phone = "";

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.export = function() {
                swFactory.getData("export")
                    .success(function(data) {
                        var blob = new Blob([ JSON.stringify(data) ], { type : 'application/json' });
                        $scope.exportUrl = (window.URL || window.webkitURL).createObjectURL( blob );

                        var downloadLink = angular.element('<a></a>');
//                        downloadLink.attr('href', 'data:attachment/json;base64,' + data);
                        downloadLink.attr('href', $scope.exportUrl);
                        downloadLink.attr('target', '_self');
                        downloadLink.attr('download', 'softwareData.json');
                        downloadLink[0].click();
                        console.dir(downloadLink);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                    });
            };

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
                            newSW.newVer.selOS = OS[0];
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
                $scope.newSW.selCat = $scope.SWList.categories[0];
                $scope.newSW.newVer = {};
                $scope.newSW.newVer.version = "";
                $scope.newSW.newVer.selOS = OS[0];
                for (var j = 0; j < $scope.newSW.versions.length; j++){
                    $scope.newSW.versions[j].newLoc = {};
                    $scope.newSW.versions[j].newLoc.selLoc = $scope.SWList.locations[0];
                    $scope.newSW.versions[j].newLoc.devices = [];
                    for (var k = 0; k < $scope.SWList.devices.length; k++)
                        $scope.newSW.versions[j].newLoc.devices[k] = false;
                }
                for (var j = 0; j < $scope.SWList.licenseModes.length; j++)
                    if ($scope.SWList.licenseModes[j].lmid === $scope.newSW.lmid){
                        $scope.newSW.selMode = $scope.SWList.licenseModes[j];
                    }
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

    .controller('SWItemFieldsCtrl', ['$scope', '$timeout', 'Upload', 'OS',
    function SWItemFieldsCtrl($scope, $timeout, Upload, OS){
        $scope.os = OS;
        $scope.generateThumb = function(sw, files) {
            if (files.length > 0 && files !== null) {
                if (files[0].type.indexOf('image') > -1) {
                    if (sw.sid > 0) {
                        $scope.data.software[$scope.data.software.indexOf(sw)].picFile = [];
                        $scope.data.software[$scope.data.software.indexOf(sw)].picFile.push(files[0]);
                    } else {
                        $scope.sw.picFile = [];
                        $scope.sw.picFile.push(files[0]);
                    }
                    console.dir(sw);
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(files[0]);
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                files[0].dataUrl = e.target.result;
                            });
                        }
                    });
                }
            }
        };

        $scope.checkDevices = function(device, number){
            device = parseInt(device);
            number = parseInt(number);
            if ((device & number) === number)
                return true;
            return false;
        };

        $scope.addVersionBoth = function(sw){
            if (sw.newVer.version.length > 0){
                var isPresent = false;
                for (var i = 0; i < sw.versions.length; i++)
                    if (sw.versions[i].version === sw.newVer.version && sw.versions[i].os === sw.newVer.os){
                        isPresent = true;
                        break;
                    }
                if (!isPresent) {
                    var newVer = {};
                    newVer.version = sw.newVer.version;
                    newVer.os = sw.newVer.selOS.value;
                    newVer.locations = [];
                    newVer.newLoc = {};
                    newVer.newLoc.selLoc = $scope.data.locations[0];
                    newVer.newLoc.devices = [];
                    for (var j = 0; j < $scope.data.devices.length; j++)
                        newVer.newLoc.devices[j] = false;

                    if (sw.sid > 0) {
                        newVer.vid = -1;
                        newVer.sid = sw.sid;
                        $scope.data.software[$scope.data.software.indexOf(sw)].versions.push(newVer);
                    } else {
                        $scope.sw.versions.push(newVer);
                    }
                }
            }
        };
        $scope.deleteVersionBoth = function(sw, version){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].versions.splice(
                    $scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version), 1
                );
            } else {
                $scope.sw.versions.splice($scope.sw.versions.indexOf(version), 1);
            }
        };
        $scope.addLocationBoth = function(sw,version){
            var isPresent = false;
            for (var i = 0; i < version.locations.length; i++)
                if (version.locations[i].lid === version.newLoc.selLoc.lid){
                    isPresent = true;
                    break;
                }
            if (!isPresent){
                var newLoc = {};
                newLoc.lid = version.newLoc.selLoc.lid;
                newLoc.name = version.newLoc.selLoc.name;
                newLoc.parent = version.newLoc.selLoc.parent;
                newLoc.devices = 0;
                for (var i = 0; i < $scope.data.devices.length; i++)
                    if (version.newLoc.devices[i])
                        newLoc.devices += parseInt($scope.data.devices[i].did);
                if (newLoc.devices > 0) {
                    if (sw.sid > 0) {
                        newLoc.id = -1;
                        newLoc.sid = sw.sid;
                        newLoc.vid = version.vid;
                        $scope.data.software[$scope.data.software.indexOf(sw)].versions[$scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version)].locations.push(newLoc);
                    } else {
                        $scope.sw.versions[$scope.sw.versions.indexOf(version)].locations.push(newLoc);
                    }
                } else {
                    alert("Please select at least one device type!");
                }
            }
        };
        $scope.deleteLocationBoth = function(sw, version, location){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].versions[$scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version)].locations
                    .splice(
                        $scope.data.software[$scope.data.software.indexOf(sw)].versions[$scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version)].locations.indexOf(location),
                        1
                    );
            } else {
                $scope.sw.versions[$scope.sw.versions.indexOf(version)].locations
                    .splice(
                        $scope.sw.versions[$scope.sw.versions.indexOf(version)].locations.indexOf(location),
                        1
                    );
            }
        };
        $scope.addCategoryBoth = function(sw){
            var isPresent = false;
            for (var i = 0; i < sw.categories.length; i++)
                if (sw.categories[i].cid === sw.selCat.cid){
                    isPresent = true;
                    break;
                }
            if (!isPresent) {
                var newCat = {};
                newCat.cid = sw.selCat.cid;
                newCat.name = sw.selCat.name;

                if (sw.sid > 0) {
                    newCat.id = -1;
                    $scope.data.software[$scope.data.software.indexOf(sw)].categories.push(newCat);
                } else {
                    $scope.sw.categories.push(newCat);
                }
            }
        };
        $scope.deleteCategoryBoth = function(sw, category){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].categories.splice(
                    $scope.data.software[$scope.data.software.indexOf(sw)].categories.indexOf(category), 1
                );
            } else {
                $scope.sw.categories.splice($scope.sw.categories.indexOf(category), 1);
            }
        };
        $scope.addLinkBoth = function(sw){
            if (sw.newLink.title.length > 0 && sw.newLink.url.length > 1){
                var isPresent = false;
                for (var i = 0; i < sw.links.length; i++)
                    if (sw.links[i].title === sw.newLink.title && sw.links[i].url === sw.newLink.url){
                        isPresent = true;
                        break;
                    }
                if (!isPresent) {
                    var newLink = {};
                    newLink.description = sw.newLink.description;
                    newLink.title = sw.newLink.title;
                    newLink.url = sw.newLink.url;

                    if (sw.sid > 0) {
                        newLink.linkid = -1;
                        newLink.sid = sw.sid;
                        $scope.data.software[$scope.data.software.indexOf(sw)].links.push(newLink);
                    } else {
                        $scope.sw.links.push(newLink);
                    }
                }
            }
        };
        $scope.deleteLinkBoth = function(sw, link){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].links
                    .splice($scope.data.software[$scope.data.software.indexOf(sw)].links.indexOf(link), 1);
            } else {
                $scope.sw.links.splice($scope.sw.links.indexOf(link), 1);
            }
        };
        $scope.addPartnerBoth = function(sw){
            var partner = {};
            partner.department = "";
            partner.name = "";
            partner.email = "";
            partner.phone = "";

            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].partners.push(partner);
            } else {
                $scope.sw.partners.push(partner);
            }
        };
        $scope.deletePartnerBoth = function(sw, partner){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].partners
                    .splice($scope.data.software[$scope.data.software.indexOf(sw)].partners.indexOf(partner), 1);
            } else {
                $scope.sw.partners.splice($scope.sw.partners.indexOf(partner), 1);
            }
        };
    }])

    .directive('softwareItemFieldsList', ['$timeout', 'Upload', function($timeout, Upload) {
        return {
            restrict: 'AC',
            scope: {
                sw: '=swdata',
                data: '=list'
            },
            controller: 'SWItemFieldsCtrl',
            link: function(scope, elm, attrs){
                scope.addVersion = function(sw){
                    $timeout(function() {
                        scope.addVersionBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteVersion = function(sw, version){
                    $timeout(function() {
                        scope.deleteVersionBoth(sw, version);
                        scope.$apply();
                    }, 0);
                };
                scope.addLocation = function(sw, version){
                    $timeout(function() {
                        scope.addLocationBoth(sw, version);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteLocation = function(sw, version, location){
                    $timeout(function() {
                        scope.deleteLocationBoth(sw, version, location);
                        scope.$apply();
                    }, 0);
                };
                scope.addCategory = function(sw){
                    $timeout(function() {
                        scope.addCategoryBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteCategory = function(sw, category){
                    $timeout(function() {
                        scope.deleteCategoryBoth(sw, category);
                        scope.$apply();
                    }, 0);
                };
                scope.addLink = function(sw){
                    $timeout(function() {
                        scope.addLinkBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteLink = function(sw, link){
                    $timeout(function() {
                        scope.deleteLinkBoth(sw, link);
                        scope.$apply();
                    }, 0);
                };
                scope.addPartner = function(sw){
                    $timeout(function() {
                        scope.addPartnerBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deletePartner = function(sw, partner){
                    $timeout(function() {
                        scope.deletePartnerBoth(sw, partner);
                        scope.$apply();
                    }, 0);
                };
            },
            templateUrl: 'manageSoftware/manageSoftwareItemFields.tpl.html'
        };
    }])

    .controller('manageSWLocCatCtrl', ['$scope', '$timeout', 'swFactory', 'OS',
        function manageSWLocCatCtrl($scope, $timeout, swFactory, OS){
            $scope.selLocation = -1;
            $scope.selCategory = -1;
            $scope.newLocation = {};
            $scope.newLocation.name = '';
            $scope.newLocation.parent = 0;
            $scope.newCategory = '';
            $scope.locResponse = '';
            $scope.catResponse = '';
            $scope.os = OS;


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

    .controller('manageSWCompMapsCtrl', ['$scope', '$window', 'swFactory', 'OS',
    function manageSWCompMapsCtrl($scope, $window, swFactory, OS){
        $scope.selComp = -1;
        $scope.selCompX = 0;
        $scope.selCompY = 0;
        $scope.selCompOS = {};
        $scope.selCompLoc = {};
        $scope.high = -1;
        $scope.newComp.name = "";
        $scope.newComp.selType = OS[0];
        $scope.showCreate = false;
        $scope.compStatus = [
            {name: 'Off', value: 0},
            {name: 'On', value: 1}
        ];
        $scope.selCompStatus = $scope.compStatus[0];
        $scope.os = OS;

        $scope.highlight = function(comp){
            $scope.high = comp.compid;
        };
        $scope.expand = function(index){
            if ($scope.selComp !== index){
                $scope.selComp = index;
                var comp = $scope.selMap.computers[index];
                $scope.selCompX = parseInt(comp.mapX) + 15;
                $scope.selCompY = parseInt(comp.mapY) + 15;
                if (comp.type == OS[0].value)
                    $scope.selCompOS = OS[0];
                else
                    $scope.selCompOS = OS[1];
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
    }]);
