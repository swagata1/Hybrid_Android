'use strict';
angular.module('insuranceGlossary').factory('userAuth', function ($q, $timeout) {
    var isChallenged = false;
    var securityCheckName = 'UserLogin';
    var userLoginChallengeHandler = null;
    var user = null;
    
    var LOGIN_SUCCESS = 100;
    var LOGIN_FAILURE = 101;
    var LOGIN_ERROR = 102;
    
    
    var login = function (username, password) {
        userLoginChallengeHandler = userLoginChallengeHandler || WL.Client.createSecurityCheckChallengeHandler(securityCheckName);
        userLoginChallengeHandler.securityCheckName = securityCheckName;
        var respObj = {
            response_code: ''
            , responseData: ''
        };
        var deferred = $q.defer();
        if (username === "" || password === "") {
            return;
        }
        if (isChallenged) {
            userLoginChallengeHandler.submitChallengeAnswer({
                'username': username
                , 'password': password
            });
        }
        else {
            WLAuthorizationManager.login(securityCheckName, {
                'username': username
                , 'password': password
            }).then(function () {
                WL.Logger.debug("login onSuccess");
                respObj.response_code = LOGIN_SUCCESS;
                respObj.responseData = user;
                deferred.resolve(respObj);
            }, function (failureResponse) {
                WL.Logger.debug("login onFailure: " + JSON.stringify(failureResponse));
                respObj.response_code = LOGIN_ERROR;
                respObj.responseData = failureResponse;
                //failureResponse = Object {status: -1, responseText: "", errorMsg: "Missing challenge handler for security check", errorCode: "MISSING_CHALLENGE_HANDLER"}
                //failureResponse = Object {status: 403, statusText: "Forbidden", responseText: "{"failures":{"UserLogin":{"failure":"Account block…chronization":{"serverTimeStamp":1480578204650}}}", errorMsg: "Forbidden", errorCode: "403"}
                deferred.reject(respObj);
            });
        }
        userLoginChallengeHandler.handleChallenge = function (challenge) {
            WL.Logger.debug("handleChallenge"); //challenge = Object {remainingAttempts: 1, errorMsg: "Wrong Credentials"}
            if (!isChallenged) {
                respObj.response_code = LOGIN_FAILURE;
                respObj.responseData = challenge;
                deferred.reject(respObj);
            }
            else {
                //TODO: broadcast to app and show login with number of attempts
            }
            isChallenged = true;
        };
        userLoginChallengeHandler.handleSuccess = function (data) {
            //Response --> user = {authenticatedAt:1480575531843, authenticatedBy:"UserLogin", displayName:"Test"id:"Test"} 
            user = data;
            WL.Logger.debug("handleSuccess");
            if (isChallenged) {
                //TODO: broadcast to change page to home page from login page
            }
            isChallenged = false;
            // showProtectedDiv();
        };
        userLoginChallengeHandler.handleFailure = function (error) {
            if (isChallenged) {
                //TODO: broadcast to display login error alert 
            }
            if (error.failure !== null) {
                WL.Logger.debug("handleFailure: " + error.failure);
                // deferred.reject(error);
            }
            isChallenged = false;
        };
        return deferred.promise;
    }
    var logout = function () {
        var deferred = $q.defer();
        WLAuthorizationManager.logout(securityCheckName).then(function (successResponse) {
            WL.Logger.debug("logout onSuccess");
            deferred.resolve(successResponse);
        }, function (failureResponse) {
            WL.Logger.debug("logout onFailure: " + JSON.stringify(failureResponse));
            deferred.reject(failureResponse);
        });
        return deferred.promise;
    }
    return {
        login: login
        , logout: logout
    }
})