app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/login', {
            templateUrl: 'login.html',
            controller: 'DoctorLogInController'
        }).
        when('/home', {
            templateUrl: 'index.html',
            controller: 'mainController'
        }).
        when('/register', {
            templateUrl: 'register.html',
            controller: 'doctorCtrl'
        }).
        when('/patientdetails', {
            templateUrl: 'patientdetails.html',
            controller: 'patientDetailsCtrl'
        }).
        when('/patientlist', {
            templateUrl: 'patientlist.html',
            controller: 'patientListCtrl'
        }).
        when('/patientsearch', {
            templateUrl: 'patientsearch.html',
            controller: 'patientSearchCtrl'
        }).
        otherwise({
            redirectTo: '/patientsearch'
        });
    }]);