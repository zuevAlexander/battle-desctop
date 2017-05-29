"use strict";

myApp.controller('BattleCtrl', [
        '$scope',
        '$rootScope',
        'BattleRest',
        'ShipRest',
        'ShotRest',
        'CountShipsRest',
        'UtilService',
        '$location',
        '$routeParams',
        '$cookies',
        function ($scope, $rootScope, BattleRest, ShipRest, ShotRest, CountShipsRest, UtilService, $location, $routeParams, $cookies) {

            $scope.createBattle = function () {
                $scope.battle.mapType = 1;
                $rootScope.battle = BattleRest.create(
                    '',
                    $scope.battle,
                    function () {
                        $location.path('/open-battles');
                    },
                    function (error) {
                        UtilService.error(error);
                    }
                );
            };

            $scope.battle = BattleRest.get(
                '',
                {
                    id: $routeParams.battleId
                },
                function () {

                    var battleFields = $scope.battle.battle_fields;
                    battleFields.forEach(function (battleField) {
                        if (battleField.user.username == $scope.user.username) {
                            $scope.ownBattleField = battleField;
                        } else {
                            $scope.rivalBattleField = battleField;
                        }
                    });

                    $scope.shipsLimit = {1: 4, 2: 3, 3: 2, 4: 1};

                    var shipMap = [];
                    var ocupatedMap = [];
                    var ships = $scope.ownBattleField.ships;
                    ships.forEach(function (ship) {
                        ship.location.forEach(function (location) {
                            shipMap.push(location.map.id);
                            tagMap(location.map.id);
                        });
                        changeShipsLimit(ship.ship_type.id);
                    });

                    var test = 1;

                    var ownShotMap = {};
                    var rivalShots = $scope.ownBattleField.shots;
                    rivalShots.forEach(function (shot) {
                        ownShotMap[shot.map.id] = shot.shot_status;
                    });

                    var rivalShotMap = {};
                    var ownShots = $scope.rivalBattleField.shots;
                    ownShots.forEach(function (shot) {
                        rivalShotMap[shot.map.id] = shot.shot_status;
                    });

                    createOwnMap();
                    createRivalMap();

                    if ($scope.battle.battle_status.name == 'Preparation') {
                        $scope.ownFieldStatus = false;
                        $scope.rivalFieldStatus = true;
                    } else if ($scope.battle.battle_status.name == 'Active') {
                        $scope.ownFieldStatus = $scope.ownBattleField.battle_field_status.name == 'Accessible';
                        $scope.rivalFieldStatus = $scope.rivalBattleField.battle_field_status.name == 'Accessible';
                    } else {
                        $scope.ownFieldStatus = true;
                        $scope.rivalFieldStatus = true;
                    }

                    $scope.startPosition = {cell: 'active'};
                    $scope.finishPosition = {};

                    $scope.showDragBlock = $scope.battle.battle_status.name == 'Preparation';

                    $scope.showAddBlock = 0;
                    $scope.countDeck = 1;
                    var position = 'horizontal';

                    $scope.addShip = function (countDeck, changePosition) {
                        $scope.width = 25;
                        $scope.height = 25;
                        $scope.showAddBlock = $scope.shipsLimit[countDeck];
                        $scope.countDeck = countDeck;
                        if (changePosition) {
                            if ($scope.countDeck > 1 && position == 'horizontal') {
                                position = 'vertical';
                                $scope.height = ($scope.countDeck * 25) + $scope.countDeck - 1;
                            } else if ($scope.countDeck > 1 && position == 'vertical') {
                                position = 'horizontal';
                                $scope.width = ($scope.countDeck * 25) + $scope.countDeck - 1;
                            }
                        } else {
                            $scope.width = ($scope.countDeck * 25) + $scope.countDeck - 1;
                            position = 'horizontal';
                        }
                        $scope.startPosition = {cell: 'active'};
                    };

                    var websocket = WS.connect("ws://136.243.22.66:8081");

                    websocket.on("socket/connect", function (session) {
                        session.subscribe("battle/shot/" + $scope.battle.id, function (uri, payload) {
                            if ($scope.ownBattleField.id == payload.newShot.battle_field.id) {
                                if (payload.newShot.shot_status.name == 'Pass') {
                                    $scope.ownFieldStatus = true;
                                    $scope.rivalFieldStatus = false;
                                }
                                ownShotMap[payload.newShot.map.id] = payload.newShot.shot_status;
                                createOwnMap();
                            }
                            if (payload.newShot.battle_field.battle.battle_status.name == 'Finished') {
                                $scope.battle.battle_status.name = 'Finished';
                                $scope.finishGame = true;
                                $scope.ownFieldStatus = true;
                                $scope.rivalFieldStatus = true;
                                if ($scope.ownBattleField.id == payload.newShot.battle_field.id) {
                                    $scope.lose = true;
                                } else {
                                    $scope.won = true
                                }
                            }
                            payload.battleStatus = '';
                            $scope.$applyAsync();
                        });

                        session.subscribe("battle/ship/" + $scope.battle.id, function (uri, payload) {
                            console.log(payload);
                            if (payload.newShit.battle_field.battle.battle_status.name == 'Active') {
                                $scope.showDragBlock = false;
                                $scope.battle.battle_status.name = 'Active';
                                $scope.ownFieldStatus = $scope.ownBattleField.battle_field_status.name == 'Accessible';
                                $scope.rivalFieldStatus = $scope.rivalBattleField.battle_field_status.name == 'Accessible';
                            }
                            $scope.$applyAsync();
                        });

                        $scope.createShot = function (cell) {
                            var shot = {};
                            shot.battleField = $scope.rivalBattleField.id;
                            shot.map = cell;
                            var newShot = ShotRest.create(
                                '',
                                shot,
                                function () {
                                    if (newShot.shot_status.name == 'Pass') {
                                        $scope.ownFieldStatus = false;
                                        $scope.rivalFieldStatus = true;
                                    }
                                    session.publish("battle/shot/" + $scope.battle.id, newShot);
                                    rivalShotMap[newShot.map.id] = newShot.shot_status;
                                    createRivalMap();
                                },
                                function (error) {
                                    UtilService.error(error);
                                }
                            );
                        };

                        $scope.dropCallback = function (item) {

                            var ship = {};
                            ship.battleField = $scope.ownBattleField.id;
                            ship.shipType = $scope.countDeck;
                            ship.location = [];
                            for (var i = 0; i < $scope.countDeck; i++) {
                                var locationDeck = Number(item.target.attributes['data-id'].value);
                                if (i == 0) {
                                    ship.location[i] = {};
                                    ship.location[i].map = locationDeck;
                                } else if (position == 'horizontal') {
                                    ship.location[i] = {};
                                    ship.location[i].map = locationDeck + i;
                                } else if (position == 'vertical') {
                                    ship.location[i] = {};
                                    ship.location[i].map = locationDeck + i * 10;
                                }
                            }

                            var newShit = ShipRest.create(
                                '',
                                ship,
                                function () {
                                    changeShipsLimit(ship.shipType);
                                    for (var i = 0; i < $scope.countDeck; i++) {
                                        var locationDeck = Number(item.target.attributes['data-id'].value);
                                        if (i == 0) {
                                            shipMap.push(locationDeck);
                                            tagMap(locationDeck);
                                        } else if (position == 'horizontal') {
                                            shipMap.push(locationDeck + i);
                                            tagMap(locationDeck + i);
                                        } else if (position == 'vertical') {
                                            shipMap.push(locationDeck + i * 10);
                                            tagMap(locationDeck + i * 10);
                                        }
                                    }
                                    createOwnMap();
                                    session.publish("battle/ship/" + $scope.battle.id, newShit);
                                },
                                function (error) {
                                    // UtilService.error(error);
                                    createOwnMap();
                                }
                            );
                        };

                    });

                    function tagMap(cell) {
                        ocupatedMap.push(cell);
                        ocupatedMap.push(cell - 1);
                        ocupatedMap.push(cell + 1);
                        ocupatedMap.push(cell - 9);
                        ocupatedMap.push(cell + 9);
                        ocupatedMap.push(cell - 10);
                        ocupatedMap.push(cell + 10);
                        ocupatedMap.push(cell - 11);
                        ocupatedMap.push(cell + 11);
                    }

                    function createOwnMap() {
                        $scope.ownMap = [];
                        var row = [];
                        for (var i = 1; i <= 100; i++) {
                            var cell = {};
                            cell.id = i;
                            cell.shipDeck = shipMap.indexOf(i) >= 0;
                            cell.active = (ocupatedMap.indexOf(i) < 0 && $scope.battle.battle_status.name == 'Preparation');
                            if (i in ownShotMap) {
                                cell.shot = true;
                                cell.shotStatus = ownShotMap[i].name;
                            }
                            row.push(cell);
                            if ((i % 10) == 0) {
                                $scope.ownMap.push(row);
                                row = [];
                            }
                        }
                    }

                    function createRivalMap() {
                        $scope.rivalMap = [];
                        var row = [];
                        for (var i = 1; i <= 100; i++) {
                            var cell = {};
                            cell.id = i;
                            if (i in rivalShotMap) {
                                cell.shot = true;
                                cell.shotStatusHit = rivalShotMap[i].name == 'Hit';
                                cell.shotStatusDestroy = rivalShotMap[i].name == 'Destroy';
                                cell.shotStatusPass = rivalShotMap[i].name == 'Pass';
                            }
                            row.push(cell);
                            if ((i % 10) == 0) {
                                $scope.rivalMap.push(row);
                                row = [];
                            }
                        }
                    }

                    function changeShipsLimit(shipType) {
                        $scope.shipsLimit[shipType] -= 1;
                    }
                }
            );
        }
    ]
);