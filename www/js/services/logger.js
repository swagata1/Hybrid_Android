'use strict';
angular.module('starter').factory('logger', function () {
    var updateLogConfig = function () {
        console.log("device", JSON.stringify(device));
        // make service call
        if (device.platform == 'iOS') { //get log server config file
            WL.Logger.updateConfigFromServer().then(function (result) {
                console.log('log conf: ', result);
            }, function (err) {
                console.log('Error getting log conf file', err);
            });
        }
        else if (device.platform == 'android') { //request adapter to get log configurations
            var request = new WLResourceRequest('adapters/LoggerAdapter/services/getServerConfig', WLResourceRequest.POST);
            var form_params = {
                packageName: 'com.mindtree.aigglossary'
            };
            request.sendFormParameters(form_params).then(function (response) {
                console.log(response);
                if (response != null && response.responseJSON.isLogEnabled == true) {
                    WL.Logger.config({
                        level: response.responseJSON.log_level
                    });
                }
            }, function (error) {
                console.log('Error calling getServerConfig: ', error);
            });
        }     
    };
    
    return {
        updateLogConfig: updateLogConfig
    }
})