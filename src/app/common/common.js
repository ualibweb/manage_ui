angular.module('manage.common', [
    'common.manage'
])

    .filter('startFrom', [ function() {
        return function(input, start) {
            if (angular.isObject(input)){
                start = +start; //parse to int
                if (typeof input == 'undefined')
                    return input;
                return input.slice(start);
            }
        };
    }]);
