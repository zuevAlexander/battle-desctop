/**
 * Created by ssp on 03.10.16.
 */
'use strict';

angular.module('myApp').factory('ApiService', [
    '$cookies',
    '$rootScope',
    '$location',
    function($cookies, $rootScope, $location) {
        var API_URL;

        switch($location.host()) {
            case 'seabattle.dev.norse.digital':
                API_URL = 'http://api.seabattle.dev.norse.digital/';
                break;
            default:
                API_URL = 'http://localhost:8000/';
        }

        return {
            baseUrl : API_URL,
            securityHeaders: {
                'battle-token': function () {
                    return $cookies.get('battle_token');
                }
            }
        };
    }
]);