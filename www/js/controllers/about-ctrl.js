'use strict';
angular.module('starter').controller('AboutGlossayAppCtrl', function ($scope, $state, $ionicPopup, $ionicModal, MFPInit) {
    var url = "https://www.aig.com/globalprivacy";
    $scope.$on('$ionicView.enter', function () {
        MFPInit.then(function () {
            WL.Analytics.log({
                AppView: 'About'
            }, "visit about view");
            console.log("about view enter")
        });
    });
    $scope.feedback = {
        user: ''
        , comments: ''
    };
    /*	This method is used to launch a given url within the application	*/
	var launchURL = function (url) {
        var ref = cordova.InAppBrowser.open(url);
    }
	
	/*	This method is used to open the privacy policy	*/
    $scope.goToPrivacyPolicy = function () {
        launchURL(url);
    }
	
	/*	This method is used to transition to Terms of Use page	*/
    $scope.goToTermsOfUse = function () {
        $state.go('termsOfUse');
    }
	
    $ionicModal.fromTemplateUrl('templates/feedbackModalTemplate.html', {
        scope: $scope
        , animation: 'fadeIn'
    , }).then(function (modal) {
        $scope.modal = modal;
    });
    
	/*	This method is to open the feedback modal*/
	$scope.openFeedbackModal = function () {
        $scope.modal.show();
    };
    
	/*	This method hides the feedback modal, as  user clickes on the cancel button on screen	*/
	$scope.cancelFeedback = function () {
        $scope.modal.hide();
    };
	
	/*	Cleanup the modal when we're done with it!	*/
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
	
	/*	This method is to submit feebback. It posts the user feedback to the MFP feedbackTo adapter. Appropriate alert message it displayed on success or failure */
    $scope.submitFeedback = function () {
        var user = "smita.hunshal@mindtree.com";
        var feedbackComments = $scope.feedback.comments;
        var request = new WLResourceRequest('adapters/MailCL/services/feedbackTo', WLResourceRequest.POST);
        var form_params = {
            feedTo: user
            , comments: feedbackComments
        };
        request.sendFormParameters(form_params).then(function (response) {
            console.log(response);
            if (response.responseJSON.Status == "Success") {
                $scope.modal.hide();
                $ionicPopup.alert({
                    title: 'Alert'
                    , template: 'Thankyou for your feedback.'
                });
            }
        }, function (error) {
            console.log('error');
            $scope.modal.hide();
            $ionicPopup.alert({
                title: 'Error'
                , template: 'Could not send feeback. Please try again.'
            });
        });
    };
});