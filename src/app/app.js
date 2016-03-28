angular.module('manage', [
    'ngResource',
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',
    'manage.common',
    'manage.templates',
    'manage.manageHours',
    'manage.manageHoursUsers',
    'manage.manageUserGroups',
    'manage.manageOneSearch',
    'manage.staffDirectory',
    'manage.manageDatabases',
    'manage.manageSoftware',
    'manage.manageNews',
    'manage.submittedForms',
    'manage.manageAlerts',
    'manage.oneSearchErrors',
    'manage.manageERCarousel'
])

    .constant('HOURS_MANAGE_URL', 'https://wwwdev2.lib.ua.edu/libhours2/')
    .constant('USER_GROUPS_URL', 'https://wwwdev2.lib.ua.edu/userGroupsAdmin/')
    .constant('SITE_FEEDBACK_URL', 'https://wwwdev2.lib.ua.edu/siteSurvey/')
    .constant('ONE_SEARCH_URL', 'https://wwwdev2.lib.ua.edu/oneSearch/')
    .constant('STAFF_DIR_URL', 'https://wwwdev2.lib.ua.edu/staffDir/')
    .constant('DATABASES_URL', 'https://wwwdev2.lib.ua.edu/databases/')
    .constant('SOFTWARE_URL', 'https://wwwdev2.lib.ua.edu/softwareList/')
    .constant('FORMS_URL', '//wwwdev2.lib.ua.edu/form/')
    .constant('NEWS_URL', 'https://wwwdev2.lib.ua.edu/newsApp/')
    .constant('ALERTS_URL', 'https://wwwdev2.lib.ua.edu/alerts/')
    .constant('ERRORS_URL', 'https://wwwdev2.lib.ua.edu/errors/')
    .constant('ERCAROUSEL_URL', 'https://wwwdev2.lib.ua.edu/erCarousel/api/');
