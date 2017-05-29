"use strict";

myApp.controller('OpenBattlesCtrl', [
    '$scope',
    '$rootScope',
    'BattleRest',
    'UtilService',
    '$location',
    function($scope, $rootScope, BattleRest, UtilService, $location) {
        $scope.battles = BattleRest.query({
            battleStatus: 1
        });

        $scope.participate = function (battle) {
            BattleRest.update(
                {
                    battleId: battle.id
                },
                {
                    battleStatus: 2
                },
                function () {
                    UtilService.alert('You joined the battle #'+battle.id+'.');
                    var index = $scope.battles.items.indexOf(battle);
                    $scope.battles.items.splice(index, 1);
                },
                function (error) {
                    UtilService.error(error);
                }
            )
        };

        $scope.close = function (battle) {
            BattleRest.update(
                {
                    battleId: battle.id
                },
                {
                    battleStatus: 5
                },
                function () {
                    UtilService.alert('You closed your own battle #'+battle.id+'.');
                    var index = $scope.battles.items.indexOf(battle);
                    $scope.battles.items.splice(index, 1);
                },
                function (error) {
                    UtilService.error(error);
                }
            )
        };

        $scope.battleStatus = 'Open';

        // console.log($scope.battles.items, 111)
      }
    ]
);