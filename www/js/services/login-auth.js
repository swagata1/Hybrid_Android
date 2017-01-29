'use strict';
angular.module('starter').factory('userAuth', function ($q, $timeout) {
    var isChallenged = false;
    var securityCheckName = 'UserLogin';
    var userLoginChallengeHandler = null;
    var user = null;
    
    var LOGIN_SUCCESS = 100;
    var LOGIN_FAILURE = 101;
    var LOGIN_ERROR = 102;
    var EMPTY_CREDENTIALS = 103;
    
    /*	This method is used to application login. UserLogin challange handler has been implemented here	*/
    var login = function (username, password) {
        userLoginChallengeHandler = userLoginChallengeHandler || WL.Client.createSecurityCheckChallengeHandler(securityCheckName);
        userLoginChallengeHandler.securityCheckName = securityCheckName;
        
         var respObj = {
            response_code: ''
            , responseData: ''
        };
        var deferred = $q.defer();
        
        userLoginChallengeHandler.handleChallenge = function (challenge) {
            WL.Logger.debug("handleChallenge");
            //challenge = Object {remainingAttempts: 1, errorMsg: "Wrong Credentials"}
            var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
            //if (challenge.errorMsg !== null) {
               respObj.response_code = LOGIN_FAILURE;
                respObj.responseData = challenge;
                deferred.reject(respObj);
           // }
            isChallenged = true;
            //Todo : show login with number of attempts
        };
        userLoginChallengeHandler.handleSuccess = function (data) {
            //Response --> user = {authenticatedAt:1480575531843, authenticatedBy:"UserLogin", displayName:"Test"id:"Test"} 
            WL.Logger.debug("handleSuccess");
            user = data;
            if(isChallenged){
               respObj.response_code = LOGIN_SUCCESS;
                respObj.responseData = user;
                deferred.resolve(respObj);
            }
            isChallenged = false;
            // showProtectedDiv();
            //Todo: 
            
        };
        userLoginChallengeHandler.handleFailure = function (error) {
            isChallenged = false;
            if (error.failure !== null) {
                WL.Logger.debug("handleFailure: " + error.failure);
               // deferred.reject(error);
            }
            //if(!isChallenged){
                //deferred.reject("Failed to login.");
                respObj.response_code = LOGIN_ERROR;
                respObj.responseData = error;
                deferred.reject(respObj);
           // }
        };
        
        if (username === "" || password === "") {
            respObj.response_code = EMPTY_CREDENTIALS;
            respObj.responseData = null;
            deferred.reject(respObj);
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
            }).then(function (successResponse) {
                WL.Logger.debug("login onSuccess");
                respObj.response_code = LOGIN_SUCCESS;
                respObj.responseData = user;
                deferred.resolve(respObj);
                
            }, function (failureResponse) {
                //failureResponse = Object {status: -1, responseText: "", errorMsg: "Missing challenge handler for security check", errorCode: "MISSING_CHALLENGE_HANDLER"}
                //failureResponse = Object {status: 403, statusText: "Forbidden", responseText: "{"failures":{"UserLogin":{"failure":"Account block…chronization":{"serverTimeStamp":1480578204650}}}", errorMsg: "Forbidden", errorCode: "403"}
                 WL.Logger.debug("login onFailure: " + JSON.stringify(failureResponse));
                 respObj.response_code = LOGIN_ERROR;
                 respObj.responseData = failureResponse;
                 deferred.reject(respObj);
            });
        }  
        return deferred.promise;
    }
    
    var logout = function () {
        isChallenged = false;
        var deferred = $q.defer();
        WLAuthorizationManager.logout(securityCheckName).then(function (successResponse) {
            WL.Logger.debug("logout onSuccess");
            deferred.resolve(successResponse);
            //location.reload();
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