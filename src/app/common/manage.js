angular.module('common.manage', [])
    .constant('API', 'https://wwwdev2.lib.ua.edu/wp-json/wp/v2/')

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])

    .factory('AuthInterceptor', ['AuthService', 'API', function (AuthService, API) {
        return {
            // automatically attach Authorization header
            request: function(config) {
                config.headers = config.headers || {};

                //interceptor for UALib JWT tokens
                var token = AuthService.getToken();
                if(config.url.indexOf(API) === 0 && token) {
                    config.headers.Authorization = "Bearer " + token;
                }

                //interceptor for WordPress nonce headers
                if (typeof myLocalized !== 'undefined') {
                    config.headers['X-WP-Nonce'] = myLocalized.nonce;
                } else {
                    console.log("myLocalized is not defined.");
                }
                return config;
            },

            // If a token was sent back, save it
            response: function(res) {
                if(res.config.url.indexOf(API) === 0 && res.data.token) {
                    AuthService.saveToken(res.data.token);
                }
                return res;
            }
        };
    }])

    .service('AuthService', ['$window', function($window){
        var self = this;

        self.parseJWT = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };
        self.saveToken = function(token) {
            $window.localStorage['ualibweb.Token'] = token;
            console.log('Token saved');
        };
        self.getToken = function() {
            return $window.localStorage['ualibweb.Token'];
        };
        self.isAuthorized = function() {
            var token = self.getToken();
            if (token) {
                var params = self.parseJWT(token);
                if (Math.round(new Date().getTime() / 1000) <= params.exp) {
                    console.log('Authenticated.');
                    console.dir(params.user);
                    return params.user;
                }
            }
            console.log('Authentication failed.');
            return false;
        };
        self.logout = function() {
            $window.localStorage.removeItem('ualibweb.Token');
            console.log('Token deleted');
        };
    }])

    .factory('hmFactory', ['$http', 'HOURS_MANAGE_URL', function hmFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "manageHours.php", params: params, data: data})
            }
        };
    }])
    .factory('ugFactory', ['$http', 'USER_GROUPS_URL', function ugFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/users", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url, params: params, data: data})
            }
        };
    }])
    .factory('osFactory', ['$http', 'ONE_SEARCH_URL', function osFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('sdFactory', ['$http', 'STAFF_DIR_URL', function sdFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/people", params: {}})
            },
            getProfile: function(login){
                return $http({method: 'GET', url: url + "api/profile/" + login, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('mdbFactory', ['$http', 'DATABASES_URL', function mdbFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('swFactory', ['$http', 'SOFTWARE_URL', function swFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('newsFactory', ['$http', 'NEWS_URL', function newsFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('formFactory', ['$http', 'FORMS_URL', function formFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            },
            submitForm: function(data){
                return $http({method: 'POST', url: url + "api/process", params: {}, data: data})
            }
        };
    }])
    .factory('alertFactory', ['$http', 'ALERTS_URL', function alertFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('wpUsersFactory', ['$http', 'API', function wpUsersFactory($http, API){
        return {
            getAllUsersWP : function(){
                return $http.get(API + 'users');
            }
        };
    }])

    .service('tokenReceiver', ['$http', 'API', function($http, API){
        this.promise = null;
        function makeRequest() {
            return $http.get(API + 'users/me')
                .then(function(r1){
                    if (angular.isDefined(r1.data.id)) {
                        $http.get(API + 'users/' + r1.data.id, {context: 'edit'})
                            .then(function (r2) {
                                return r2.data;
                            });
                    }
                });
        }
        this.getPromise = function(update){
            if (update || !this.promise) {
                this.promise = makeRequest();
            }
            return this.promise;
        };
    }])

    .run(['$rootScope', 'tokenReceiver', '$location', 'AuthService',
    function($rootScope, tokenReceiver, $location, AuthService) {
        $rootScope.userInfo = {};
        $rootScope.userInfo = AuthService.isAuthorized();
    }]);
