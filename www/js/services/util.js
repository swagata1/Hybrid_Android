'use strict';
angular.module('starter').factory('util', function ($q, $timeout) {
    var searchGlossary = function (searchFilter, searchList) {
        var deferred = $q.defer();
        var matches = searchList.filter(function (item) {
            if (item.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) return true;
            else if (item.description.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) return true;
        })
        $timeout(function () {
            deferred.resolve(matches);
        }, 100);
        return deferred.promise;
    };
    
    var showAlert = function(title, template) {
        var alertPopup = $ionicPopup.alert({
            title: title
            , template: template
        });
        
        alertPopup.then(function (res) {
            console.log('Alert pop up displayed');
        });
    }
    
    return {
        searchGlossary: searchGlossary,
        showAlert: showAlert
        
    }
})