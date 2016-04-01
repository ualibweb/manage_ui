angular.module('manage.oneSearchErrors', ['oc.lazyLoad'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/onesearch-errors', {
            controller: 'oneSearchErrorsCtrl',
            templateUrl: 'oneSearchErrors/oneSearchErrors.tpl.html',
            resolve: {
                lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('https://d3js.org/d3.v3.min.js');
                }]
            }
        });
    }])

    .controller('oneSearchErrorsCtrl', ['$scope', 'errorsFactory', 'lazyLoad',
    function oneSearchErrorsCtrl($scope, errorsFactory, lazyLoad){
        $scope.dataProcessed = false;
        $scope.errors = {};
        $scope.errors.tree = {};
        $scope.errors.list = [];
        $scope.errors.mapped = [];
        $scope.errors.mapped.today = [];
        $scope.errors.mapped.today[0] = []; //scout
        $scope.errors.mapped.today[1] = []; //catalog
        $scope.errors.mapped.today[2] = []; //ejournals
        $scope.errors.mapped.month = [];
        $scope.errors.mapped.month[0] = []; //scout
        $scope.errors.mapped.month[1] = []; //catalog
        $scope.errors.mapped.month[2] = []; //ejournals
        $scope.errors.mapped.year = [];
        $scope.errors.mapped.year[0] = []; //scout
        $scope.errors.mapped.year[1] = []; //catalog
        $scope.errors.mapped.year[2] = []; //ejournals
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 24; i++) {
                $scope.errors.mapped.today[j].push({"x": i, "y": 0});
            }
            for (i = 0; i < 31; i++) {
                $scope.errors.mapped.month[j].push({"x": i, "y": 0});
            }
            for (i = 0; i < 12; i++) {
                $scope.errors.mapped.year[j].push({"x": i, "y": 0});
            }
        }

        errorsFactory.getData()
            .success(function(data) {
                var today = new Date();
                var tree = {};
                for (i = 0; i < data.scout.length; i++){
                    var dt = new Date(data.scout[i]);
                    if (!angular.isDefined(tree[dt.getFullYear()])){
                        tree[dt.getFullYear()] = {};
                    }
                    if (!angular.isDefined(tree[dt.getFullYear()][dt.getMonth()])){
                        tree[dt.getFullYear()][dt.getMonth()] = {};
                    }
                    if (!angular.isDefined(tree[dt.getFullYear()][dt.getMonth()][dt.getDate()])){
                        tree[dt.getFullYear()][dt.getMonth()][dt.getDate()] = {counter: 0, errors: []};
                    }
                    tree[dt.getFullYear()][dt.getMonth()][dt.getDate()]['counter']++;
                    tree[dt.getFullYear()][dt.getMonth()][dt.getDate()]['errors'].push(dt);

                    if (dt.getFullYear() === today.getFullYear()) {
                        $scope.errors.mapped.year[0][dt.getMonth()].y++;

                        if (dt.getMonth() === today.getMonth()) {
                            $scope.errors.mapped.month[0][dt.getDate() - 1].y++;

                            if (dt.getDate() === today.getDate()) {
                                $scope.errors.mapped.today[0][dt.getHours()].y++;
                            }
                        }
                    }
                }
                $scope.errors.list = data.scout;
                $scope.errors.tree = tree;
                $scope.dataProcessed = true;
                console.dir($scope.errors);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.tabs = [
            { name: 'Today',
                number: 0,
                active: true
            },
            { name: 'This Month',
                number: 1,
                active: false
            },
            { name: 'This Year',
                number: 2,
                active: false
            },
            { name: 'All Time',
                number: 3,
                active: false
            }
        ];
    }])

    .controller('errorGraphCtrl', ['$scope', function errorGraphCtrl($scope){

    }])

    .directive('errorGraph', ['$window', function($window) {
        return {
            restrict: 'A',
            scope: {
                errors: '=',
                range: '@'
            },
            controller: 'errorGraphCtrl',
            link: function(scope, elm, attrs){
                var n = 3; // number of layers
                var m = 0; // number of samples per layer
                var today = new Date();
                var stack = d3.layout.stack();
                var layers;
                switch (scope.range) {
                    case 'today':
                        m = 24;
                        layers = stack(scope.errors.mapped.today);
                        break;
                    case 'month':
                        m = 31;
                        layers = stack(scope.errors.mapped.month);
                        break;
                    case 'year':
                        m = 12;
                        layers = stack(scope.errors.mapped.year);
                        break;
                    default:
                        m = 24;
                        layers = stack(scope.errors.mapped.today);
                        break;
                }
                console.log(scope.range + " : " + m);
                var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
                    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

                var margin = {top: 40, right: 10, bottom: 20, left: 10},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                console.log("yGroupMax = " + yGroupMax);
                console.log("yStackMax = " + yStackMax);
                console.log("Height = " + height);

                var x = d3.scale.ordinal()
                    .domain(d3.range(m))
                    .rangeRoundBands([0, width], .08);

                var y = d3.scale.linear()
                    .domain([0, yStackMax])
                    .range([height, 0]);

                var color = d3.scale.linear()
                    .domain([0, n - 1])
                    .range(["#aad", "#556"]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .tickSize(0)
                    .tickPadding(6)
                    .orient("bottom");

                var svg = d3.select(elm[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var layer = svg.selectAll(".layer")
                    .data(layers)
                    .enter().append("g")
                    .attr("class", "layer")
                    .style("fill", function(d, i) { return color(i); });

                var rect = layer.selectAll("rect")
                    .data(function(d) { return d; })
                    .enter().append("rect")
                    .attr("x", function(d) { return x(d.x); })
                    .attr("y", height)
                    .attr("width", x.rangeBand())
                    .attr("height", 0);

                rect.transition()
                    .delay(function(d, i) { return i * 10; })
                    .attr("y", function(d) { return y(d.y0 + d.y); })
                    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                function transitionGrouped() {
                    console.log("drawing grouped");
                    y.domain([0, yGroupMax]);

                    rect.transition()
                        .duration(500)
                        .delay(function(d, i) { return i * 10; })
                        .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
                        .attr("width", x.rangeBand() / n)
                        .transition()
                        .attr("y", function(d) { return y(d.y); })
                        .attr("height", function(d) { return height - y(d.y); });
                }

                function transitionStacked() {
                    console.log("drawing stacked");
                    y.domain([0, yStackMax]);

                    rect.transition()
                        .duration(500)
                        .delay(function(d, i) { return i * 10; })
                        .attr("y", function(d) { return y(d.y0 + d.y); })
                        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
                        .transition()
                        .attr("x", function(d) { return x(d.x); })
                        .attr("width", x.rangeBand());
                }

                transitionGrouped();
            },
            template: '<div></div>'
        };
    }]);


