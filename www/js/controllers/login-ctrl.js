'use strict';
angular.module('starter').controller('LoginCtrl', function ($scope, $log, $state, $rootScope, $ionicLoading, MFPInit, logger, push, touchId) {
    var vm = this;
    var isChallenged = false;
    var securityCheckName = 'UserLogin';
    var userLoginChallengeHandler = null;
    var deviceId = null;
    
	
	/*	This method is used to application login. UserLogin challange handler has been implemented here	*/
    var validatByPwd = function(){
		
		$state.transitionTo("app.listSearch");
        /*$ionicLoading.show({
            template: 'Loading...'
        });
		userLoginChallengeHandler = userLoginChallengeHandler || WL.Client.createSecurityCheckChallengeHandler(securityCheckName);
		vm.user.loginInProgress = false;
        
        if (vm.user.username === "" || vm.user.password === ""){
            alert("Username and password are required");
			$ionicLoading.hide();
            return;
        }
        if (isChallenged){
            userLoginChallengeHandler.submitChallengeAnswer({'username':vm.user.username, 'password':vm.user.password});
        } else {
            WLAuthorizationManager.login("UserLogin",{'username':vm.user.username, 'password':vm.user.password}).then(
                function () {
                    //WL.Logger.debug("login onSuccess");
                    console.log('login onsuccess');
					$scope.isChallenged = true;
					console.log('initialize pushinit');
					pushinit();
					$state.transitionTo("app.listSearch");
					
                },
                function (response) {
                    $ionicLoading.hide();
                    //WL.Logger.debug("login onFailur: " + JSON.stringify(response));
					console.log('Login error: '+JSON.stringify(response));
                    alert('Login error');
                });
        }
        
        userLoginChallengeHandler.handleChallenge = function(challenge) {
        $ionicLoading.hide();
        WL.Logger.debug("handleChallenge");
        $state.transitionTo("login");
        isChallenged = true;
        var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
        if (challenge.errorMsg !== null){
            statusMsg = statusMsg + "<br/>" + challenge.errorMsg;
        }
        alert(statusMsg);
    };

    userLoginChallengeHandler.handleSuccess = function(data) {
        WL.Logger.debug("handleSuccess");
        isChallenged = false;
        //reset username & password
        $ionicLoading.hide();
        $state.transitionTo("listSearch");
    };

    userLoginChallengeHandler.handleFailure = function(error) {
        $ionicLoading.hide();
        WL.Logger.debug("handleFailure: " + error.failure);
        isChallenged = false;
        if (error.failure !== null){
            alert(error.failure);
        } else {
            alert("Failed to login.");
        }
    }; */
    }
	
	/*	This method inititializes push notification	*/
    
    var pushinit = function(){
        if (typeof MFPPush !== 'undefined') {
            MFPPush.initialize(function (successResponse) {
                WL.Logger.log('Push', 'Push Successfully initialized');
                MFPPush.registerNotificationsCallback(notificationReceived);
                MFPPush.isPushSupported(function (successResponse) {
                    WL.Logger.log("Push Supported: " + successResponse);
                
                        MFPPush.registerDevice(null, function (successResponse) {
                            console.log("push registered resp");
                            console.log(successResponse);
                            var temp = successResponse.toString();
                            var index1 = temp.indexOf("{");
                            var index2 = temp.indexOf("}");
                            var subStr = temp.substring(index1, index2+1);
                            temp = JSON.parse(subStr);
                            deviceId = temp.deviceId;
                            alert(deviceId);
                            receiveMessage(deviceId);
                            //alert('push registered '+deviceId);
                        }, function (failureResponse) {
                            console.log("Failed to register: ", JSON.stringify(failureResponse));
                            WL.Logger.error("Failed to register: ", JSON.stringify(failureResponse));
                           alert('push registered fail');
                        });
                }, function (failureResponse) {
                    WL.Logger.error('Failed to get push support status', JSON.stringify(failureResponse));
                    alert('push not supported');
                });
            }, function (failureResponse) {
                WL.Logger.error('Failed to initialize', JSON.stringify(failureResponse));
                alert('MPF initialize fail');
            });
        }
        else {
           alert("MFPush undefined");
        }
    }
     
    
    function notificationReceived(message) {
        $scope.$apply(function () {
            //message.payload = JSON.parse(message.payload);
            //$scope.message = message;
            if (message.alert && message.alert.body) {
                alert(message.alert.body);
            }
            else if (message.alert) {
                alert(message.alert);
            }
        });
    }
    
    function receiveMessage(deviceID) {
        var request = new WLResourceRequest('adapters/InsuranceGlossary/services/aigPush', WLResourceRequest.POST);
            var form_params = {deviceId: deviceID, packageBundleName:'com.mindtree.aigglossary'};
            request.sendFormParameters(form_params).then(function (response) {
                console.log(response);
             }, function (error) {
                console.log('error');
            });
    }
    
    $scope.$on('$ionicView.enter', function () {
        MFPInit.then(function () {
            WL.Analytics.log({
                AppView: 'Login'
            }, "visit login view");
            console.log("login view enter")
        });
    });
    vm.user = {
        username: ''
        , password: ''
        , saveusername: ''
        , isTouchEnabled: false
        , loginInProgress: false
    };
	
    vm.loginApp = function () {
		
		vm.user.loginInProgress = true;
        //
        //check touchid enabled
        if (vm.user.isTouchEnabled) {
            touchId.authenticateUser('Glossary', 'Sign in to Glossary with your fingerprint', 'TestSecretKey').then(
				function () {
					//$state.transitionTo("listSearch");
					$state.transitionTo("app.listSearch");
				}, 
				function (error) {
					if (error == 'userFallback') {
						validateLoginByPassword();
					}
					else {
						alert(error);
					}
				});
        }
        else {
            //validateLoginByPassword();
            validatByPwd();
        }
		
		
    }
    var validateLoginByPassword = function () {
        //        if (vm.user.username != '' && vm.user.password != '' && vm.user.username == vm.user.password) {
        //            $state.transitionTo("listSearch");
        //        }
        //        else alert('Invalid user credentials.');
        
//        $ionicLoading.show({
//            template: 'Loading...'
//        });
        
//          push.initPush(notificationReceived, {}).then(function (succResp) {
//                    $ionicLoading.hide();
//                    console.log(succResp);
//                    alert('Push Registered'+ succResp.Text.deviceId);
//                    
//                }, function (errResp) {
//                    console.log(errResp);
//                    alert('Push registration error');
//                });
                
				
        $scope.userAuth.login(vm.user.username, vm.user.password).then(function (response) {
           
            vm.user.loginInProgress = false;
            if (response.response_code == 100) {
               // $state.transitionTo("listSearch");
                  push.initPush(notificationReceived, {}).then(function (succResp) {
                    $ionicLoading.hide();
                    console.log(succResp);
                    alert('Push Registered'+ succResp.Text.deviceId);
                    
                }, function (errResp) {
                    console.log(errResp);
                    alert('Push registration error');
                });
              
            }
        }, function (error) {
            $ionicLoading.hide();
            vm.user.loginInProgress = false;
            if (error.response_code == 101) {
                alert(error.responseData.errorMsg + ". Remaining Attempts: " + error.responseData.remainingAttempts);
            }
            else if (error.response_code == 102) {
                var ErrMsg = error.responseData.errorMsg || error.responseData.failure;
                alert(ErrMsg);
            }
        });
    }
});