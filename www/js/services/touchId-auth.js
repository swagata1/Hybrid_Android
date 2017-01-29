'use strict';
angular.module('starter').factory('touchId', function ($q) {
    //touchid.authenticate() - error codes
    //authenticationFailed, userCancel, userFallback, systemCancel, passcodeNotSet, touchIDNotAvailable, touchIDNotEnrolled, unknown
    
    var authenticateUser = function (appName, dialogMessage, secretKeyForAndroid) {
        var deferred = $q.defer();
        //iOS - cordova-plugin-touchid
        if (device.platform == 'iOS') {
            touchid.checkSupport(function () {
                touchid.authenticate(function (successResponse) {
                   deferred.resolve(successResponse);
                }, function (failureResponse) {
                   deferred.reject(failureResponse);
                }, dialogMessage);
            }, function (failureResponse) { //No fingers are enrolled with Touch ID. //Biometry is not available on this device.
                error = failureResponse;
                deferred.reject(failureResponse);
            });
        }
        //ANDROID - cordova-plugin-fingerprint-auth
        else if (device.platform == 'Android') {
            FingerprintAuth.isAvailable(function (result) {
                //alert('Fingerprint available');
                if (result.isAvailable) {
                    FingerprintAuth.show({
                        clientId: appName
                        , clientSecret: secretKeyForAndroid
                    }, function (successResponse) {
                        deferred.resolve(successResponse);
                    }, function (failureResponse) {
                        deferred.reject(failureResponse);
                    });
                }
            }, function (failureResponse) {
                deferred.reject(failureResponse);
            });
        }
        return deferred.promise;
    };
    return {
        authenticateUser: authenticateUser
    }
})