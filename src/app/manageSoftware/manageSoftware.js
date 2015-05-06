angular.module('manage.manageSoftware', [])
    .controller('manageSWCtrl', ['$scope', 'tokenFactory', 'swFactory',
        function manageSWCtrl($scope, tokenFactory, swFactory){
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
            $scope.newSW = {};
            $scope.newSW.locations = [];
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
                            alert($scope.formResponse);
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete software! " + data;
                            alert($scope.formResponse);
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
                        alert($scope.formResponse);
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not update software! " + data;
                        alert($scope.formResponse);
                        console.log(data);
                    });
            };
            $scope.createSW = function(){
                console.dir($scope.newSW);
                swFactory.postData({action : 3}, $scope.newSW)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newSW = {};
                            newSW = angular.copy($scope.newSW);
                            newSW.sid = data.id;
                            newSW.locations = angular.copy(data.locations);
                            newSW.show = false;
                            newSW.class = "";
                            newSW.selLoc = data.locations[0];
                            $scope.SWList.software.push(newSW);
                            $scope.formResponse = "Software has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add software! " + data;
                        }
                        alert($scope.formResponse);
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add software! " + data;
                        alert($scope.formResponse);
                        console.dir(data);
                    });
            };

            $scope.addLocation = function(sw){
                var newLoc = {};
                newLoc.sid = sw.sid;
                newLoc.lid = sw.selLoc.lid;
                newLoc.name = sw.selLoc.name;
                swFactory.postData({action : 4}, newLoc)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            newLoc.id = data.id;
                            if (typeof $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations == 'undefined')
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations = [];
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations.push(newLoc);
                            $scope.formResponse = "Location has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add location! " + data;
                        }
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add location! " + data;
                        console.dir(data);
                    });
            };
            $scope.deleteLocation = function(sw, location){
                swFactory.postData({action : 5}, location)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations.splice(
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].locations.indexOf(location),1
                            );
                            $scope.formResponse = "Location has been deleted.";
                        } else {
                            $scope.formResponse = "Error: Can not delete location! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete location! " + data;
                    });
            };

            $scope.delLocNewSW = function(index){
                $scope.newSW.locations.splice(index, 1);
            };
            $scope.addLocNewSW = function(){
                var newLocation = {};
                newLocation.lid = $scope.newSW.selLoc.lid;
                newLocation.name = $scope.newSW.selLoc.name;
                if (typeof $scope.newSW.locations == 'undefined')
                    $scope.newSW.locations = [];
                var isPresent = false;
                for (var i = 0; i < $scope.newSW.locations.length; i++)
                    if ($scope.newSW.locations[i].lid == newLocation.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newSW.locations.push(newLocation);
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
