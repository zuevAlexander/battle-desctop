'use strict';

angular.module('myApp').factory('ShipRest', [
    'ApiService',
    '$resource',
    function(ApiService, $resource) {
        return $resource(
            '',
            {
                id:'@id'
            },
            {
                create: {
                    method: 'POST',
                    url: ApiService.baseUrl + 'ships',
                    headers: ApiService.securityHeaders
                }
            }
        );
    }
]);