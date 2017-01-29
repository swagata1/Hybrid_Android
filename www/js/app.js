// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html'
		  , controller: 'LoginCtrl as login'
        }
      }
    }).state('app.listSearch', {
            url: '/listSearch',
			views: {
				'menuContent': {
					templateUrl: 'templates/glossaryListSearch.html'
					, controller: 'GlossaryListSearchCtrl'
				}
			}
        })
		.state('app.listItem', {
			url: '/listItem',
			views: {
				'menuContent': {
					templateUrl: 'templates/glossaryListItem.html'
					, controller: 'GlossaryListItemCtrl'
					, params: {
						obj: null
					}
				}
			}
		})
		.state('app.aboutPage', {
			url: '/aboutPage',
			views: {
				'menuContent': {
					templateUrl: 'templates/about.html'
					, controller: 'AboutGlossayAppCtrl'
				}
			}
		})
		.state('app.privacyPolicy', {
			url: '/privacyPolicy',
			views: {
				'menuContent': {
					templateUrl: 'templates/privacyPolicy.html'
					, controller: 'GlossaryPrivacyPolicy'
				}
			}
		})
		.state('app.termsOfUse', {
			url: '/termsOfUse',
			views: {
				'menuContent': {
					templateUrl: 'templates/termsOfUse.html'
					, controller: 'GlossaryTermsOfUse'
				}
			}
		})
		.state('app.mylist', {
			url: '/mylist',
			views: {
				'menuContent': {
					templateUrl: 'templates/myListView.html'
					, controller: 'MyListCtrl'					
				}
			}
		})
		.state('app.emailGlossaryTerm', {
			url: '/emailGlossaryTerm',
			views: {
				'menuContent': {
					templateUrl: 'templates/email.html'
					, controller: 'EmailGlossaryTerm'
					, params: {
						term: null
					}
				}
			}
		});

  /*.state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  }).state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
	.state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
	.state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });*/
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
}).factory('MFPInit', function ($q) {
    /* Setup a Promise to allow code to run in other places anytime after MFP CLient SDK is ready
     Example: MFPClientPromise.then(function(){alert('mfp is ready, go ahead and use WL.* APIs')});
     */
    console.log('MFP Init factory');
    return window.MFPClientDefer.promise;
});


// MobileFirst configuration stuff.
var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};
window.MFPClientDefer = angular.injector(['ng']).get('$q').defer();
window.wlCommonInit = window.MFPClientDefer.resolve;
window.MFPClientDefer.promise.then(function wlCommonInit() {
    // Common initialization code goes here or use the angular service MFPClientPromise
    console.log('MobileFirst Client SDK Initilized');
	var serverUrl = WL.App.getServerUrl(function(success){
        console.log(">>success:: "+success);
    }, function(fail){
        console.log(">>fail:: "+fail);
    });
	console.log(">> serverUrl: "+serverUrl);
    //mfpMagicPreviewSetup();
});
var pushNotificationReceived = function () {
    console.log("pushNotificationReceived", {});
}
var wlInitOptions = {
    // Options to initialize with the WL.CliewlCommonInitnt object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

// JSON-store
var collections = {
  myGlossary: {
	searchFields: {name: 'string', desc: 'string'}
  }
};
//var options = {username: 'aig'};
//var options = {password: 'aig'};

WL.JSONStore.init(collections).then(function () {
  // handle success
  console.log('successfully created myGlossary...');  
}).fail(function (error) {
  // handle failure
  console.log('failed to create myGlossary...');
});

