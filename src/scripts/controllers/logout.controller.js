'use strict';

angular.module('myApp')
    .controller('logoutCtrl', [
        '$scope',
        '$rootScope',
        '$routeParams',
        'UserRest',
        '$location',
        '$cookies',
        'UtilService',
        function($scope, $rootScope, $routeParams, UserRest, $location, $cookies, UtilService) {

            $scope.logout = function () {
                $rootScope.user = {};
                $cookies.remove('battle_token');
                $location.path('/');
            }
        }
    ]);