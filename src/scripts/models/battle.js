'use strict';

angular.module('myApp').factory('BattleRest', [
    'ApiService',
    '$resource',
    function(ApiService, $resource) {
        return $resource(
            '',
            {
                id:'@id'
            },
            {
                get: {
                    method: 'GET',
                    url: ApiService.baseUrl + 'battles/:id',
                    headers: ApiService.securityHeaders
                },
                create: {
                    method: 'POST',
                    url: ApiService.baseUrl + 'battles',
                    headers: ApiService.securityHeaders
                },
                query: {
                    method: 'GET',
                    url: ApiService.baseUrl + 'battles',
                    headers: ApiService.securityHeaders
                },
                update: {
                    method: 'PATCH',
                    url: ApiService.baseUrl + 'battles/:battleId',
                    headers: ApiService.securityHeaders
                }
            }
        );
    }
]);