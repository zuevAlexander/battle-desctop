"use strict";

myApp.controller('ClosedBattlesCtrl', [
    '$scope',
    '$rootScope',
    'BattleRest',
    'UtilService',
    function($scope, $rootScope, BattleRest, UtilService) {
        $scope.battles = BattleRest.query({
            battleStatus: 5
        });

        $scope.open = function (battle) {
            BattleRest.update(
                {
                    battleId: battle.id
                },
                {
                    battleStatus: 1
                },
                function () {
                    UtilService.alert('You reopened the battle #'+battle.id+'.');
                    var index = $scope.battles.items.indexOf(battle);
                    $scope.battles.items.splice(index, 1);
                },
                function (error) {
                    UtilService.error(error);
                }
            )
        };

        $scope.battleStatus = 'Closed';
      }
    ]
);