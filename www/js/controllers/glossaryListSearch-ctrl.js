'use strict';
angular.module('starter').controller('GlossaryListSearchCtrl', function ($scope, $log, $state, $rootScope, $ionicHistory, $http, $ionicScrollDelegate, util, $timeout, $ionicLoading, $ionicPopup, MFPInit, jsonstore) {
    var securityCheckName = 'UserLogin';
    $scope.$on('$ionicView.enter', function () {
        MFPInit.then(function () {      
            WL.Logger.log('LOG', 'Glossary hybrid app: list-ctrl');
            WL.Analytics.log({
                AppView: 'Glossary Term List'
            }, "visit term glossary list view");
            console.log("glossary list view enter")
        });
    });
   
    // An alert dialog
    $scope.showNotification = function (msgTitle, alertMessage) {
        var alertPopup = $ionicPopup.alert({
            title: msgTitle
            , template: alertMessage
        });
        alertPopup.then(function (res) {
            console.log('User responded to alert!');
        });
    };
    
    var lists = {};
    var charPrev = '';
    var charNxt = '';
    var initializeItems = function () {
        setAlphaScrollBarCss();
        $scope.searchResult = [];
        $scope.alphaIndexes = []; // holds first alphabet of list items
        lists.gList = []; //holds server glossary-list
        lists.indexedList = []; //holds sorted data - with indexes & items falling under respective index
        fetchGlossary();
    }
    $scope.showServerError = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Server Unreachable!'
            , template: 'Do you want try again?'
        });
        confirmPopup.then(function (res) {
            if (res) { //OK
                console.log('You are sure');
                initializeItems();
            }
            else { //Cancel
                console.log('You are not sure');
            }
        });
    };
	/*	This method is used to clear off the text entered in the search bar	*/
    $scope.clearSearch = function () {
        $ionicScrollDelegate.scrollTo(0, 0);
        $scope.searchItem = "";
        $scope.searchResult = lists.indexedList;		
    }
	
	/*	This method is used to clear off the text entered in the search bar	*/
	$scope.saveToLocal = function (item) {
		var storeName = 'myGlossary';
		var searchFields = {name: 'string', desc: 'string'};
		var data = {name: item.name, desc: item.description};
		
		jsonstore.addToStore(storeName,searchFields, data).then(function (succResp) {
			alert(succResp);
		}, function (error) {
			alert('error: '+error);
		});		
		
		//alert('data.name: '+data.name+', data.desc:'+data.name);	
		
		// JSON-store
		/*var collections = {
		  myGlossary: {
			searchFields: {name: 'string', desc: 'string'}
		  }
		};*/

		/*WL.JSONStore.init(collections).then(function () {
			// handle success
			//alert('successfully created myGlossary...');
			/*WL.JSONStore.get('myGlossary').find(data).then(function (results) {
				// handle success - results (array of documents found)
				alert(item.name+' already present; results: '+results);
			}).fail(function (error) {
				// handle failure
				alert(item.name+' is a new item; error: '+error);
			}); ....*.../...
			*/
			
			/*WL.JSONStore.get('myGlossary').add(data).then(function () {
				// handle success
				alert('added to json store: '+data.name);				
				/*var glossary = WL.JSONStore.get('myGlossary').findAll().then(function (results) {
					// handle success - results (array of documents found)
					console.log('glossary: '+JSON.stringify(results));
				}).fail(function (error) {
					// handle failure
					alert('error: '+error);
				});...*../...
			}).fail(function (error) {
				// handle failure
				alert('error: '+error);
			});
		}).fail(function (error) {
		  // handle failure
		  alert('failed to create myGlossary...');
		});
		*/
		
	}
	
	/*	This method is used to open item details screen, when any term name is clicked. Also information is sent to analytics console	*/
    $scope.openDetails = function (item) {
        WL.Logger.info('INFO', 'clicked item:'+ item);
        console.log("clicked item:", item);
       
		$state.go('app.listItem', {
			'obj': item
        });
    }
	
	
	/*	This method is used to open item details screen, when any term name is clicked. Also information is sent to analytics console	*/
    $scope.onHold = function (item) {
        //WL.Logger.info('INFO', 'clicked item:'+ item);
        console.log("clicked item: ", item);
       
		
    }
	
    $scope.search = function () {
        $ionicScrollDelegate.scrollTo(0, 0);
        if ($scope.searchItem.length == 0) {
            $scope.searchResult = lists.indexedList;
        }
        else {
            util.searchGlossary($scope.searchItem, lists.gList).then(function (matches) {
                console.log(matches)
                $scope.searchResult = matches;
            })
        }
    }
	
	/*	This metod is used to transition to Abount page	*/
    $scope.goToAboutPage = function () {
        $state.transitionTo("aboutPage");
    }
	
	/*	*/
    $scope.goToIndex = function (char) {
        scrollToIndex(char);
    }
    $scope.touchStart = function (e) {
        charNxt = e.target.innerText;
        if (charPrev != charNxt) {
            scrollToIndex(charNxt);
        }
        else return;
    }
	
    /*	*/
	$scope.touchMove = function (e) {
            charNxt = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY).innerText;
            if (charPrev != charNxt) {
                scrollToIndex(charNxt);
            }
            else return;
        }
         $scope.touchEnd = function () {
             console.log('touch END');
         }
    
	/*	This method is used to logout from UserLogin SecurityCheck	*/
    $scope.logout = function(){
        WLAuthorizationManager.logout(securityCheckName).then(
        function () {
            WL.Logger.debug("logout onSuccess");
            location.reload();
        },
        function (response) {
            WL.Logger.debug("logout onFailure: " + JSON.stringify(response));
        });
    }
    
	/*	This method implements indexed scroller */
    var scrollToIndex = function (char) {
        if (char.length != 1) return;
        charPrev = char;
        var index = 0;
        console.log('char: ', char);
        var len = lists.indexedList.length;
        for (var i = 0; i < len; i++) {
            if (lists.indexedList[i].letter == char) {
                index = i;
                console.log('index at:', i);
                break;
            }
        }
        index = index * 39;
        console.log('scroll To: ', index);
        $ionicScrollDelegate.scrollTo(0, index);
    }
	
	/*	*/
    var setAlphaScrollBarCss = function () {
        console.log('setAlphaScrollBarCss');
        var contentElHeight = document.getElementById('homeContent').offsetHeight;
        // console.log('Got id:', contentEl);
        //console.log('clientHeight:', contentEl.clientHeight);
        //console.log('offsetHeight:', contentEl.offsetHeight);
        //console.log('scrollHeight:', contentEl.scrollHeight);
        var scrollHt = contentElHeight * 0.7;
        $scope.scrollbarHeight = scrollHt;
        $scope.scrollBarItem = {};
        $scope.scrollBarItem.height = scrollHt / 27.0;
        $scope.scrollBarItem.fontSize = (scrollHt / 27.0) - 3;
    }
	
	/*	This method is used to fetch glossary data from MobileFirst server	*/
    var fetchGlossary = function () {
        $ionicLoading.show({
             template: 'Loading...'
         });
         MFPInit.then(function () {
             var request = new WLResourceRequest('/adapters/InsuranceGlossary/services/list', WLResourceRequest.GET);
             request.send().then(function (response) {
                 // success flow, the result can be found in response.responseJSON
                 console.log(response.responseJSON.insuranceglossary.length);
                 WL.Logger.debug('Received response from list api');
                 $ionicLoading.hide();
                 lists.gList = response.responseJSON.insuranceglossary; //original list from server
                 // var sortedList = sortGlossary(data); // sort if required
                 var tempIndexing = getIndexedList(response.responseJSON.insuranceglossary); //complete indexed list 
                 $scope.searchResult = lists.indexedList = tempIndexing.indexedList;
                 $scope.alphaIndexes = tempIndexing.alphaList;
                 console.log('alpha-list', tempIndexing.alphaList);
                 $scope.$apply();
             }, function (error) {
                 $ionicLoading.hide().then(function () {
                     $scope.showServerError();
                 });
                 //lists.gList = [];
                 //$scope.searchResult = [];
                 // the error code and description can be found in error.errorCode and error.errorMsg fields respectively 
             });
         }, function () {
             console.log('MFP not initialized');
              WL.Logger.debug('MFP not initialized');
         });
        
		/*$http.get('js/glossary.json').success(function (data) {
            console.log(data.length + "success");
            lists.gList = data; //original list from server
            // var sortedList = sortGlossary(data); // sort if required
            var tempIndexing = getIndexedList(data); //complete indexed list
            $scope.searchResult = lists.indexedList = tempIndexing.indexedList;
            $scope.alphaIndexes = tempIndexing.alphaList;
            console.log('alpha-list', tempIndexing.alphaList);
        }).error(function (e) {
            alert('Error getting json file', e);
            lists.gList = [];
            $scope.searchResult = [];
        });*/
    }
	
	
    var sortGlossary = function (list) {
        return list.sort(function (a, b) {
            var item1 = a.name.toLowerCase();
            var item2 = b.name.toLowerCase();
            if (item1 > item2) return 1;
            if (item1 < item2) return -1;
            return 0;
        });
    }
	
    var getIndexedList = function (list) {
        var prevLetter = "";
        var indexedList = [];
        var alphabetsList = [];
        for (var i = 0; i < list.length; i++) {
            var indexObj = {
                'isLetter': true
                , 'letter': ''
            };
            var currLetter = list[i].group;
            if (prevLetter != currLetter) {
                indexObj.letter = currLetter;
                indexedList.push(indexObj);
                alphabetsList.push(currLetter);
            }
            prevLetter = currLetter;
            indexedList.push(list[i]);
        }
        return {
            'indexedList': indexedList
            , 'alphaList': alphabetsList
        };
    }
    initializeItems();
})
