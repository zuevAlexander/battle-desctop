/**
 * Created by ssp on 13.10.16.
 */
'use strict';

angular.module('myApp').factory('UtilService', [
    '$mdDialog',
    function($mdDialog) {
        return {
            alert: function (title, content) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(title)
                        .textContent(content)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                );
            },
            error: function (error) {
                var errorString = '';

                for (var key in error.data.errorInfo) {
                    errorString += key + ': ' + error.data.errorInfo[key] + "\n";
                }

                this.alert(error.statusText, errorString ? errorString : error.data.errorMessage);
            }
        };
    }
]);