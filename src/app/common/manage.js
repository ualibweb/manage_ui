angular.module('common.manage', [])

    .factory('hmFactory', ['$http', 'HOURS_MANAGE_URL', function hmFactory($http, url){
        return {
            getData: function(params){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'GET', url: url + "getJSON.php", params: params})
            },
            postData: function(file, params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + file, params: params, data: data})
            }
        }
    }])
    .factory('ugFactory', ['$http', 'USER_GROUPS_URL', function ugFactory($http, url){
        return {
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url, params: params, data: data})
            }
        }
    }])
    .factory('sfFactory', ['$http', 'SITE_FEEDBACK_URL', function sfFactory($http, url){
        return {
            getData: function(params){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'GET', url: url, params: params})
            }
        }
    }])
    .factory('osFactory', ['$http', 'ONE_SEARCH_URL', function osFactory($http, url){
        return {
            getData: function(params){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'GET', url: url + "getJSON.php", params: params})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('sdFactory', ['$http', 'STAFF_DIR_URL', function sdFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/people", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }]);
