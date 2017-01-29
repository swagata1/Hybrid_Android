'use strict';
angular.module('starter').controller('MyListCtrl', function ($scope, $state, $ionicPopup, $ionicModal,$ionicLoading, MFPInit, jsonstore) {

	var initializeItems = function () {
		$scope.searchResult = [];
		$scope.myList=[];
		fetchMyList();
	}
	
	var fetchMyList= function () {
		$ionicLoading.show({
             template: 'Loading...'
         });		 
		var storeName = 'myGlossary';
		var searchFields = {name: 'string', desc: 'string'};
		
		jsonstore.getAllRecords(storeName,searchFields).then(function (results) {
			console.log('print glossary: '+JSON.stringify(results));
			$scope.myList = results;
			for (var key in results) {
				if (results.hasOwnProperty(key)) {
					var data = {'id':results[key]._id, 'name':results[key].json.name, 'desc':results[key].json.desc};					
					$scope.searchResult.push(data);
					console.log('data: '+data);
				}
			}	
			console.log('searchResult: '+$scope.searchResult[0]);
			$ionicLoading.hide();
		}, function (errResp) {
			$ionicLoading.hide();
			alert('errResp: '+errResp);			
		});		
	}
	
	$scope.removeStore= function () {
		jsonstore.removeStore().then(function (succResp) {
			alert(succResp);
			$scope.searchResult = [];
			initializeItems();			
		}, function (errResp) {
			alert('errResp: '+errResp);
		});
	}
	
	$scope.deleteItem= function (item) {
		jsonstore.deleteItemById('myGlossary', item.id).then(function (succResp) {
			alert('number Of Records Removed: '+succResp);
			initializeItems();			
		}, function (errResp) {
			alert('errResp: '+errResp);
		});		
	}
	
	$scope.reload= function () {
		initializeItems();
	}
	
	initializeItems();	
})