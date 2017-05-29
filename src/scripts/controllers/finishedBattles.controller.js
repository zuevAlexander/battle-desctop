"use strict";

myApp.controller('FinishedBattlesCtrl', [
    '$scope',
    '$rootScope',
    'BattleRest',
    'UtilService',
    function($scope, $rootScope, BattleRest, UtilService) {
        $scope.battles = BattleRest.query({
            battleStatus: 4
        });

        $scope.battleStatus = 'Finished';
      }
    ]
);