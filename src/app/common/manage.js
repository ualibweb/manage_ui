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
    }]);
