"use strict";

myApp.controller('PreparationBattlesCtrl', [
    '$scope',
    '$rootScope',
    'BattleRest',
    'UtilService',
    function($scope, $rootScope, BattleRest, UtilService) {
        $scope.battles = BattleRest.query({
            battleStatus: 2
        });

        $scope.battleStatus = 'Preparation';
      }
    ]
);