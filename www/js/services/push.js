'use strict';
angular.module('starter').factory('push', function ($q) {
    var PUSH_REG_FAILED = 100;
    var PUSH_NOT_SUPPORT = 101;
    var PUSH_INIT_FAILED = 102;
    var PUSH_UNDEFINED = 103;
    
    var initPush = function (notificationReceived, options) {
        alert('Push-Init');
        var deferred = $q.defer();
        var errObj = {};
        if (typeof MFPPush !== 'undefined') {
            MFPPush.initialize(function (successResponse) {
                WL.Logger.log('Push', 'Push Successfully initialized');
                MFPPush.registerNotificationsCallback(notificationReceived);
                MFPPush.isPushSupported(function (successResponse) {
                    WL.Logger.log("Push Supported: " + successResponse);
                    
                    WLAuthorizationManager.obtainAccessToken("push.mobileclient").then(function(){
                        MFPPush.registerDevice(options, function (successResponse) {
                            deferred.resolve(successResponse);
                        }, function (failureResponse) {
                            errObj.code = PUSH_REG_FAILED;
                            errObj.message = failureResponse;
                            WL.Logger.error("Failed to register: ", JSON.stringify(failureResponse));
                            deferred.reject(errObj);
                        });
                    });

                }, function (failureResponse) {
                    errObj.code = PUSH_NOT_SUPPORT;
                    errObj.message = failureResponse;
                    WL.Logger.error('Failed to get push support status', JSON.stringify(failureResponse));
                    deferred.reject(errObj);
                });
            }, function (failureResponse) {
                errObj.code = PUSH_INIT_FAILED;
                errObj.message = failureResponse;
                WL.Logger.error('Failed to initialize', JSON.stringify(failureResponse));
                deferred.reject(errObj);
            });
        }
        else {
            errObj.code = PUSH_UNDEFINED;
            errObj.message = "MFPush undefined";
            deferred.reject(errObj);
        }
        return deferred.promise;
    }
    var unregisterDevice = function () {
        var deferred = $q.defer();
        MFPPush.unregisterDevice(function (successResponse) {
            deferred.resolve(successResponse);
        }, function (failureResponse) {
            deferred.reject(failureResponse);
        });
        return deferred.promise;
    }
    var getTags = function () {
        var deferred = $q.defer();
        MFPPush.getTags(function (newTags) {
            deferred.resolve(newTags);
        }, function (failureResponse) {
            deferred.reject(failureResponse);
        });
        return deferred.promise;
    }
    var getSubscriptions = function () {
        var deferred = $q.defer();
        MFPPush.getSubscriptions(function (subscriptions) {
            deferred.resolve(subscriptions);
        }, function (failureResponse) {
            deferred.reject(failureResponse);
        });
        return deferred.promise;
    }
    var subscribe = function (tags) {
        var deferred = $q.defer();
        //tags = ['sample-tag1','sample-tag2'];
        MFPPush.subscribe(tags, function (tags) {
            deferred.resolve(tags);
        }, function (failureResponse) {
            deferred.reject(failureResponse);
        });
        return deferred.promise;
    }
    var unsubscribe = function () {
        var deferred = $q.defer();
        //tags = ['sample-tag1','sample-tag2'];
        MFPPush.unsubscribe(tags, function (tags) {
            deferred.resolve(tags);
        }, function (failureResponse) {
            deferred.reject(failureResponse);
        });
        return deferred.promise;
    }
    return {
        initPush: initPush,
        unregisterDevice: unregisterDevice,
        getTags: getTags,
        getSubscriptions: getSubscriptions,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    }
})


