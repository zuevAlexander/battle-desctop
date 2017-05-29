'use strict';

angular.module('myApp').factory('ShotRest', [
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
                    url: ApiService.baseUrl + 'shots',
                    headers: ApiService.securityHeaders
                }
            }
        );
    }
]);