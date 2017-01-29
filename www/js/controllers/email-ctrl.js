'use strict';
angular.module('starter').controller('EmailGlossaryTerm', function ($scope, $log, $state, $rootScope, $ionicHistory, MFPInit) {
    $scope.$on('$ionicView.enter', function () {
        MFPInit.then(function () {
            WL.Analytics.log({
                AppView: 'Email Glossary Term'
            }, "visit email view");
            console.log("email view enter")
        });
    });
    
    var term = $state.params.term;
    
    $scope.emailAttr = {
        'to': ''
        , 'cc_bcc': ''
        , 'from': ''
        , 'subject': 'AIG Glossarry Term: '+ term.name
        , 'body': 'Hello, I found this on AIG Glossary and thought you might find it useful' + term.name + '<br/>' +term.description
    };
    
    $scope.sendEmail = function(){
        //validation if required
       var request = new WLResourceRequest('adapters/MailCL/services/feedbackTo', WLResourceRequest.POST);
            var form_params = {feedTo:'com.mindtree.aigglossary', comments:'Test email'};
            request.sendFormParameters(form_params).then(function (response) {
                console.log(response);
                if(response!=null){
                    alert('LOG Enabled, Level='+ response.responseJSON);
                }
            }, function (error) {
                console.log('error');
            });
    }
    
    $scope.cancelEmail = function(){
        $state.go('listItem',{'obj': term});
    }
    
    
});