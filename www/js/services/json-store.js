'use strict';
angular.module('starter').factory('jsonstore', function ($q) {
    
    var createStore = function (storeName, searchField) {
		var deferred = $q.defer();
		var msg='';
		// JSON-store
		var collections = {
		  myGlossary: {
			searchFields: searchField
		  }
		};
		WL.JSONStore.init(collections).then(function () {
			deferred.resolve('done');
		}).fail(function (error) {
		  deferred.reject(error);
		});
		return deferred.promise;
	}
	
	var addToStore = function (storeName, searchField, data) {
		var deferred = $q.defer();
		var msg='';
		createStore(storeName, searchField).then(function (succResp) {
			WL.JSONStore.get(storeName).add(data).then(function () {
				msg='data added to json-store';
				deferred.resolve(msg);
			}).fail(function (error) {
				deferred.reject(error);				
			});
		}, function (error) {
			deferred.reject(error);	
		});
		return deferred.promise;
    };
	
	var getAllRecords = function (storeName, searchField) {		
		var deferred = $q.defer();
		var msg='';
		createStore(storeName, searchField).then(function (succResp) {			
			WL.JSONStore.get(storeName).findAll().then(function (results) {
				deferred.resolve(results);
			}).fail(function (error) {
				deferred.reject(error);			
			});				
		}, function (error) {
			deferred.reject(error);	
		});
		return deferred.promise;		
	}
	
	var removeStore = function () {
		var deferred = $q.defer();
		var msg='';
		WL.JSONStore.destroy().then(function () {
			msg='deleted all items';
			deferred.resolve(msg);
		}).fail(function (error) {
			deferred.reject(error);
		});	
		return deferred.promise;
	};
	
	var deleteItemById = function(storeName, itemid){
		var deferred = $q.defer();		
		var query = {_id: itemid};
		
		WL.JSONStore.get(storeName).remove(query).then(function (numberOfDocsRemoved) {
			console.log('removed id: '+itemid+", numberOfDocsRemoved: "+numberOfDocsRemoved);
			deferred.resolve(numberOfDocsRemoved);			
		}).fail(function (error) {
			console.log('Failed to remove: '+itemid+", error: "+error);
			//alert('Failed to remove: '+itemid+", error: "+error);
			deferred.reject(error);
		});
		return deferred.promise;		
	};
	
    return {
        addToStore: addToStore,
		getAllRecords: getAllRecords,
		removeStore: removeStore,
		deleteItemById: deleteItemById		
    }
})