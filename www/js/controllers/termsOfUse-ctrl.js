'use strict';
angular.module('starter')
    .controller('GlossaryTermsOfUse', function ($scope, $log, $state, $rootScope, $ionicHistory, MFPInit) {
                
                $scope.$on('$ionicView.enter', function () {
                           MFPInit.then(function () {
                                        WL.Analytics.log({
                                                         AppView: 'Terms of Use'
                                                         }, "terms of use view");
                                        console.log("terms of use view enter")
                                        });
                           });

      /*	This method is used to transition to home screen	*/
	  $scope.goHome = function(){
            $state.go('listSearch');
      }
    });
