'use strict';

angular.module('myApp').factory('CountShipsRest', [
    'ApiService',
    '$resource',
    function (ApiService, $resource) {
        return $resource(
            '',
            {},
            {
                query: {
                    method: 'GET',
                    url: ApiService.baseUrl + 'countships',
                    headers: ApiService.securityHeaders
                }
            }
        );
    }
]);