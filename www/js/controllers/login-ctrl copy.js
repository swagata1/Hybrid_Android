'use strict';
angular.module('insuranceGlossary').controller('LoginCtrl', function ($scope, $log, $state, $rootScope, $ionicLoading, MFPInit, logger, push, touchId) {
    var vm = this;

    function notificationReceived(message) {
        $scope.$apply(function () {
            message.payload = JSON.parse(message.payload);
            //$scope.message = message;
            if (message.alert && message.alert.body) {
                alert(message.alert.body);
            }
            else if (message.alert) {
                alert(message.alert);
            }
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
            touchId.authenticateUser('Glossary', 'Sign in to Glossary with your fingerprint', 'TestSecretKey').then(function () {
                $state.transitionTo("listSearch");
            }, function (error) {
                if (error == 'userFallback') {
                    validateLoginByPassword();
                }
                else {
                    alert(error);
                }
            });
        }
        else {
            validateLoginByPassword();
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