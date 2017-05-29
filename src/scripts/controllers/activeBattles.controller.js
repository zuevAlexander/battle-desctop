"use strict";

myApp.controller('ActiveBattlesCtrl', [
    '$scope',
    '$rootScope',
    'BattleRest',
    'UtilService',
    function($scope, $rootScope, BattleRest, UtilService) {
        $scope.battles = BattleRest.query({
            battleStatus: 3
        });

        $scope.battleStatus = 'Active';
      }
    ]
);