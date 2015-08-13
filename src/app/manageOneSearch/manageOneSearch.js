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