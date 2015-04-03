angular.module('manage', [
    'ngAnimate',
    'ui.bootstrap',
    'manage.common',
    'manage.templates',
    'manage.manageHours',
    'manage.manageHoursUsers'
])

.constant('HOURS_MANAGE_URL', '//wwwdev2.lib.ua.edu/libhours2/')
