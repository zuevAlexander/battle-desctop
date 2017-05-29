'use strict';

angular.module('myApp')
    .controller('loginCtrl', [
        '$scope',
        '$rootScope',
        '$routeParams',
        'UserRest',
        '$location',
        '$cookies',
        'UtilService',
        function($scope, $rootScope, $routeParams, UserRest, $location, $cookies, UtilService) {

            $scope.user = {};

            $scope.login = function () {
                $rootScope.user = UserRest.login(
                    '',
                    $scope.user,
                    function () {
                        $cookies.put('battle_token', $rootScope.user.api_key);
                        $location.path('/battles');
                    },
                    function (error) {
                        UtilService.error(error);
                    }
                );
            }
        }
    ]);