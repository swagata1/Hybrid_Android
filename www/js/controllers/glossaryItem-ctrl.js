'use strict';
angular.module('starter').controller('GlossaryListItemCtrl', function ($scope, $state, MFPInit) {
    $scope.$on('$ionicView.enter', function () {
        MFPInit.then(function () {
            WL.Analytics.log({
                AppView: 'Glossary Term Details'
            }, "visit glossary term details view");
            console.log("glossary term details view enter")
        });
    });
    $scope.detailObj = $state.params.obj;
	
	/* This method is to transition to home screen	*/
    $scope.goHome = function () {
        $state.go('listSearch');
    }
	
	/* This method is to transition to email screen	*/
    $scope.composeEmail = function () {
        $state.go('emailGlossaryTerm', {
            term: $scope.detailObj
        });
    }
});