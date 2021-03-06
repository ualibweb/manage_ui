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
        $scope.errors.mapped = {};
        $scope.errors.mapped.today = [];
        $scope.errors.mapped.month = [];
        $scope.errors.mapped.year = [];
        $scope.eEngine = {};
        $scope.eEngine.engine = 0;

        errorsFactory.getData()
            .success(function(data) {
                var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var today = new Date();
                var tree = [];
                for (var j = 0; j < 3; j++) {
                    tree[j] = {};
                    tree[j].years = [];
                    $scope.errors.mapped.today[j] = [];
                    $scope.errors.mapped.month[j] = [];
                    $scope.errors.mapped.year[j] = [];
                    for (var i = 0; i < 24; i++) {
                        $scope.errors.mapped.today[j].push({"x": i, "y": 0});
                    }
                    for (i = 0; i < 31; i++) {
                        $scope.errors.mapped.month[j].push({"x": i + 1, "y": 0});
                    }
                    for (i = 0; i < 12; i++) {
                        $scope.errors.mapped.year[j].push({"x": i, "y": 0});
                    }
                    var curData = [];
                    switch (j) {
                        case 0:
                            curData = data.scout;
                            break;
                        case 1:
                            curData = data.catalog;
                            break;
                        case 2:
                            curData = data.ejournals;
                            break;
                    }
                    for (i = 0; i < curData.length; i++) {
                        curData[i].recorded = curData[i].recorded.replace(/-/g,'/');
                        var dt = new Date(curData[i].recorded);
                        var isPresent = false;
                        var y = 0, m = 0, d = 0;
                        for (y = 0; y < tree[j].years.length; y++) {
                            if (tree[j].years[y].name === dt.getFullYear()) {
                                isPresent = true;
                                break;
                            }
                        }
                        if (!isPresent) {
                            var year = {};
                            year.open = false;
                            year.counter = 0;
                            year.name = dt.getFullYear();
                            year.months = [];
                            tree[j].years.push(year);
                            y = tree[j].years.length - 1;
                        }
                        isPresent = false;
                        for (m = 0; m < tree[j].years[y].months.length; m++) {
                            if (tree[j].years[y].months[m].mm === dt.getMonth()) {
                                isPresent = true;
                                break;
                            }
                        }
                        if (!isPresent) {
                            var month = {};
                            month.open = false;
                            month.counter = 0;
                            month.mm = dt.getMonth();
                            month.name = months[month.mm];
                            month.days = [];
                            tree[j].years[y].months.push(month);
                            m = tree[j].years[y].months.length - 1;
                        }
                        isPresent = false;
                        for (d = 0; d < tree[j].years[y].months[m].days.length; d++) {
                            if (tree[j].years[y].months[m].days[d].day === dt.getDate()) {
                                isPresent = true;
                                break;
                            }
                        }
                        if (!isPresent) {
                            var day = {};
                            day.open = false;
                            day.day = dt.getDate();
                            day.counter = 0;
                            day.errors = [];
                            tree[j].years[y].months[m].days.push(day);
                            d = tree[j].years[y].months[m].days.length - 1;
                        }
                        tree[j].years[y].counter++;
                        tree[j].years[y].months[m].counter++;
                        tree[j].years[y].months[m].days[d].counter++;
                        tree[j].years[y].months[m].days[d].errors.push({recorded: dt, description: curData[i].description});

                        if (dt.getFullYear() === today.getFullYear()) {
                            $scope.errors.mapped.year[j][dt.getMonth()].y++;

                            if (dt.getMonth() === today.getMonth()) {
                                $scope.errors.mapped.month[j][dt.getDate() - 1].y++;

                                if (dt.getDate() === today.getDate()) {
                                    $scope.errors.mapped.today[j][dt.getHours()].y++;
                                }
                            }
                        }
                    }
                    $scope.errors.list[j] = curData;
                }
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
                var margin = {top: 40, right: 10, bottom: 20, left: 10},
                    width = 960 - margin.left - margin.right,
                    height = 540 - margin.top - margin.bottom;
                var stack = d3.layout.stack();
                var layers;
                var x;
                var xAxis;
                var axisX = 0, axisY = height;
                switch (scope.range) {
                    case 'today':
                        m = 24;
                        layers = stack(scope.errors.mapped.today);
                        x = d3.scale.ordinal()
                            .domain(d3.range(m))
                            .rangeRoundBands([0, width], .08);
                        xAxis = d3.svg.axis()
                            .scale(x)
                            .tickSize(0)
                            .tickPadding(6)
                            .orient("bottom");
                        break;
                    case 'month':
                        m = 31;
                        layers = stack(scope.errors.mapped.month);
                        x = d3.scale.ordinal()
                            .domain(d3.range(1, m + 1))
                            .rangeRoundBands([0, width], .08);
                        xAxis = d3.svg.axis()
                            .scale(x)
                            .tickSize(0)
                            .tickPadding(6)
                            .orient("bottom");
                        break;
                    case 'year':
                    default:
                        m = 12;
                        axisX = 44;
                        axisY = height - 16;
                        layers = stack(scope.errors.mapped.year);
                        x = d3.scale.ordinal()
                            .domain(d3.range(m))
                            .rangeRoundBands([0, width], .08);
                        var xD = d3.time.scale()
                            .domain([new Date(2015, 0, 1), new Date(2015, 11, 31)])
                            .range([0, width]);
                        xAxis = d3.svg.axis()
                            .scale(xD)
                            .orient("bottom")
                            .ticks(d3.time.months)
                            .tickSize(16, 0)
                            .tickFormat(d3.time.format("%B"));
                        break;
                }
                console.log(scope.range + " : " + m);
                var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
                    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

                var y = d3.scale.linear()
                    .domain([0, yStackMax])
                    .range([height, 0]);

                var yTicks = 20;
                if (yTicks > yGroupMax) {
                    yTicks = yGroupMax;
                }

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(yTicks)
                    .orient("right");

                var color = d3.scale.linear()
                    .domain([0, n - 1])
                    .range(["#aad", "#556"]);

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
                    .attr("x", function(d) {
                        return x(d.x);
                    })
                    .attr("y", height)
                    .attr("width", x.rangeBand())
                    .attr("height", 0);

                rect.transition()
                    .delay(function(d, i) { return i * 10; })
                    .attr("y", function(d) { return y(d.y0 + d.y); })
                    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+ axisX +"," + axisY + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(0, 0)")
                    .call(yAxis);

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

                transitionStacked();
            },
            template: '<div></div>'
        };
    }]);


