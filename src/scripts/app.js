'use strict';

var myApp = angular.module('myApp', [
    'ngMaterial',
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngMessages',
    'lfNgMdFileInput',
    'uiGmapgoogle-maps',
    'ngDragDrop'
])

.factory('mySocket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () { apply(socket, args); });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {  if (callback) { callback.apply(socket, args); }  });
            })
        }
    };
}).run([
        '$rootScope',
        '$location',
        '$cookies',
        'UserRest',
        function ($rootScope, $location, $cookies, UserRest) {
            authorize($location, $cookies, UserRest, $rootScope);
        }
    ]
);

myApp.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

// Declare app level module which depends on filters, and services
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'pages/homepage.tpl.html',
            controller: 'homeCtrl'
        })

        .when('/login', {
            templateUrl: 'pages/login.tpl.html',
            controller: 'loginCtrl'
        })

        .when('/register', {
            templateUrl: 'pages/register.tpl.html',
            controller: 'registerCtrl'
        })

        .when('/battle/:battleId', {
            templateUrl: 'pages/battle.tpl.html',
            controller: 'BattleCtrl',
            resolve: {
                factory: checkIfAuthorized
            }
        })

        .when('/create-battle', {
            templateUrl: 'pages/create-battle.tpl.html',
            controller: 'BattleCtrl',
            resolve: {
                factory: checkIfAuthorized
            }
        })

        .when('/open-battles', {
            templateUrl: 'pages/battles.tpl.html',
            controller: 'OpenBattlesCtrl',
            resolve: {
                factory: checkIfAuthorized
            }
        })

        .when('/preparation-battles', {
            templateUrl: 'pages/battles.tpl.html',
            controller: 'PreparationBattlesCtrl',
            resolve: {
                factory: checkIfAuthorized
            }
        })

        .when('/active-battles', {
            templateUrl: 'pages/battles.tpl.html',
            controller: 'ActiveBattlesCtrl',
            resolve: {
                factory: checkIfAuthorized
            }
        })

        .when('/finished-battles', {
            templateUrl: 'pages/battles.tpl.html',
            controller: 'FinishedBattlesCtrl',
            resolve: {
                factory: checkIfAuthorized
            }
        })

        .when('/closed-battles', {
            templateUrl: 'pages/battles.tpl.html',
            controller: 'ClosedBattlesCtrl',
            resolve: {
                factory: checkIfAuthorized
            }
        })

        .otherwise({
            redirectTo: '/'
        });
}]);

var authorize = function ($location, $cookies, UserRest, $rootScope) {
    $rootScope.user = UserRest.profile(
        function (user) {},
        function () {
            console.log('checkIfAuthorized error');
            if ($location.$$path !== '/login' ||
                $location.$$path !== '/register' ) {
                $rootScope.user = {};
                $location.path('/');
            }
        }
    );
};

var checkIfAuthorized = function ($location, $cookies, UserRest, $rootScope) {
    UserRest.profile(
        function (user) {},
        function () {
            console.log('checkIfAuthorized error');
            if ($location.$$path !== '/login' ||
                $location.$$path !== '/register' ) {
                $rootScope.user = {};
                $location.path('/');
            }
        }
    );
};

//Material Icons
myApp.config(function ($mdIconProvider) {
    $mdIconProvider
        .defaultIconSet('/images/mdi.svg');

});

