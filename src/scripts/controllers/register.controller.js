'use strict';

  
angular.module('myApp')
    .controller('registerCtrl', [
        '$scope',
        '$rootScope',
        'UserRest',
        'UtilService',
        '$location',
        '$cookies',
        function($scope, $rootScope, UserRest, UtilService, $location, $cookies) {
            $scope.user = {};

            $scope.register = function () {
                $rootScope.user = UserRest.register(
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