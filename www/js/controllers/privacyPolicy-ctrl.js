'use strict';
angular.module('starter')
    .controller('GlossaryPrivacyPolicy', function ($scope, $state, MFPInit) {
                $scope.$on('$ionicView.enter', function () {
                           MFPInit.then(function () {
                                        WL.Analytics.log({
                                                         AppView: 'Privacy Policy'
                                                         }, "visit privacy policy view");
                                        console.log("privacy policy view enter")
                                        });
                           });
                
    
    });
