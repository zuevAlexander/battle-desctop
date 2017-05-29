/**
 * Created by ssp on 03.10.16.
 */
'use strict';

angular.module('myApp').factory('UserRest', [
    'ApiService',
    '$resource',
    function(ApiService, $resource) {
        return $resource(
            '',
            {},
            {
                login: {
                    method: 'POST',
                    url: ApiService.baseUrl + 'login',
                    headers: ApiService.basicHeaders
                },
                register: {
                    method: 'POST',
                    url: ApiService.baseUrl + 'register',
                    headers: ApiService.basicHeaders
                },
                profile: {
                    method: 'GET',
                    url: ApiService.baseUrl + 'user',
                    headers: ApiService.securityHeaders
                }
            }
        );
    }
]);