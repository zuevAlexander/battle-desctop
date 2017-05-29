"use strict";

myApp.controller('ShipsCtrl', [
    '$scope',
    '$rootScope',
    'ShipRest',
    'UtilService',
    '$location',
    function($scope, $rootScope, ShipRest, UtilService, $location) {
        $scope.ships = ShipRest.query({});
      }
    ]
);