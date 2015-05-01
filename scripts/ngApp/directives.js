'use strict';


function userMenuControllerOld ($scope, $rootScope, FbFilterInfo, FbHandlerService, UXflags) {
  $scope.usabilityFlags = UXflags.flags;
  this.orderProp = 'name';

  this.getInitialInfo = function(){
    FbHandlerService.checkLoginState().
      then(function(status){
        $scope.usabilityFlags.callingLikes = true;
        $rootScope.userStatus= status;
        console.log("happening?? status:",$rootScope.userStatus);
        if($rootScope.userStatus == 'connected'){
          FbHandlerService.getUserLikePages().
            then(function(list){
              $scope.usabilityFlags.callingLikes = false;
              $scope.likedPages = list.data;
            },function(err){
              $scope.usabilityFlags.callingLikes = false;
              alert('the following error apears:' + err.result);
            });
        } else {
          $scope.likedPages = [];
          FbFilterInfo.analizeScope = {};
          alert('please log in first');
        }
      });
  };

  this.addAnalizeScope = function(page){
    console.log('sort criterias',this.orderProp);
    if(FbFilterInfo.analizeScope[page.id]){
       FbFilterInfo.analizeScope[page.id] = false;
       delete page.selected
       delete FbFilterInfo.analizeScope[page.id];
       $scope.$watch($scope.likedPages = FBhandler.likeList)
    } else {
      FbFilterInfo.analizeScope[page.id] = true;
      page.selected = true;
      $scope.$watch($scope.likedPages = FBhandler.likeList);
    }
  };

  this.selectAll = function(){
    FbFilterInfo.analizeScope = {};
    if($scope.likedPages){
      angular.forEach($scope.likedPages, function(value, key) {
        value.selected = true;
        FbFilterInfo.analizeScope[value.id] = true;
      });
    }
    console.log('FbFilterInfo',FbFilterInfo);
  };

  this.unselectAll = function(){
    FbFilterInfo.analizeScope = {};
    if($scope.likedPages){
      angular.forEach($scope.likedPages, function(value, key) {
        value.selected = false;
      });
    }
  };

  this.reverseSelection = function(){
    FbFilterInfo.analizeScope = [];
    if($scope.likedPages){
      angular.forEach($scope.likedPages, function(value, key) {
        if(value.selected){
          value.selected = false;
        }  else {
          value.selected = true;
          FbFilterInfo.analizeScope[value.id] = true;
        }
      });
    }
  };

  this.addClassFanPage = function(selection){
    if(selection){
      return 'fan-page-selected';
    }
  }

};

function userMenuController($scope, sharedData){

  $scope.menuInfo = {
    data : sharedData.data
  }

  var maxAnalyzeScopeSize = 30;
  var analyzeScopeCount = 0;

  $scope.addAnalizeScope = function(listItem){
    if($scope.menuInfo.data.analizeScope[listItem.id]){

      delete $scope.menuInfo.data.analizeScope[listItem.id];
      listItem.selected = false;
      analyzeScopeCount--;

    } else {

      $scope.menuInfo.data.analizeScope[listItem.id] = true;
      if(!(analyzeScopeCount >= maxAnalyzeScopeSize)){
        listItem.selected = true;
        analyzeScopeCount++;
      } else {
        // To do
      }

    }
  }

  $scope.addSelectedClass = function(selectedFlag){
    if(selectedFlag){
      return 'fan-page-selected';
    } else {
      return '';
    }
  }
}

angular.module('startMining').directive('userMenu',function(){
  return {
    restrict: 'E',
    transclude: false,
    templateUrl:'partials/user-menu.html',
    controller:
      ['$scope', 'sharedData', userMenuController]
  };
});

// home.directive('userTools',function(){
//   return{
//     restrict: 'E',
//     transclude: true,
//     templateUrl:'partials/user-tools.html',
//     scope : {},
//     controller:
//       ['$scope',
//       '$rootScope',
//       'FbFilterInfo',
//       'FbHandlerService',
//       'FbInfoToShow',
//       'UXflags',
//       '$q',
//       '$timeout',
//       function($scope,
//         $rootScope,
//         FbFilterInfo,
//         FbHandlerService,
//         FbInfoToShow,
//         UXflags,
//         $q,
//         $timeout)
//       {

//         $scope.usabilityFlags = UXflags.flags;
//         $scope.contentHolder = FbInfoToShow;
//         var that = this;

//         this.getData = function(){
//           var arrayPromises = [[]];
//           var aux = 0;
//           angular.forEach(FbFilterInfo.analizeScope,function(value,key){
//             if (arrayPromises[aux].length >=5) {
//               aux = aux + 1;
//               arrayPromises[aux] = [];
//             };
//             if(FbFilterInfo.typeContent == 'feed'){
//               arrayPromises[aux].push(FbHandlerService.getNodeFeed(key));
//               // arrayPromises.push(FbHandlerService.getNodeFeed(key));
//             } else {
//               // aux.push(FbHandlerService.getNodePhotos(key));
//               arrayPromises[aux].push(FbHandlerService.getNodePhotos(key));
//             };
//             setTimeout(function(){console.log('works??????and value and key',value,key);},9000);
//           });
//           // console.log('arrayPromises',arrayPromises);
//           // angular.forEach(arrayPromises,function(value_arr_pro,key){
//           //   var contentCalls = $q.all(value_arr_pro);
//           //   contentCalls
//           //   .then(function(contents){
//           //       angular.forEach(contents,function(value,key){
//           //         $scope.contentHolder.contentToShow = $scope.contentHolder.contentToShow.concat(value);
//           //         console.log('Info to show',FbInfoToShow.contentToShow);
//           //       });
//           //       $scope.usabilityFlags.loadingInfo = false;
//           //     }, function(error,node){
//           //       console.log('Error message: ', error, 'in node: ' + node);
//           //       $scope.usabilityFlags.loadingInfo = false;
//           //     },function(update){
//           //       console.log('exploring update message:',update);
//           //     });
//           //   setTimeout(function(){

//           //   }, 3000);
//           // });
//         };

//         this.saveContentType = function(type){
//           $scope.contentHolder.contentToShow = [];
//           FbFilterInfo.typeContent = type;
//           that.getData();
//           $scope.usabilityFlags.loadingInfo = true;
//         };

//         this.cleanData = function(){
//           $scope.contentHolder.contentToShow = [];
//         }
//       }],
//     controllerAs:'tools'
//   };
// });

// home.directive('infoSection',function(){
//   return {
//     restrict: 'E',
//     transclude: true,
//     scope : {
//       info: '='
//     },
//     templateUrl: 'partials/info-section.html',
//     controller:
//       ['$scope',
//       '$rootScope',
//       'FbInfoToShow',
//       'FbFilterInfo',
//       'FbHandlerService',
//       '$q',
//       'UXflags',
//       function($scope,
//         $rootScope,
//         FbInfoToShow,
//         FbFilterInfo,
//         FbHandlerService,
//         $q,
//         UXflags)
//       {
//           $scope.content = FbInfoToShow;
//           $scope.typeContent = FbFilterInfo;
//            $scope.usabilityFlags = UXflags.flags;

//           $scope.verification_counter = 0;
//           this.loadMoreContent = function() {
//             console.log('loking for content');
//             if(UXflags.flags.enableInfiniteScroll){
//               UXflags.flags.enableInfiniteScroll = false;
//               console.log('loking for content aviable');
//               var arrayPromises = [];
//               console.log('type of info to show',FbFilterInfo.typeContent);
//               if(FbFilterInfo.typeContent == 'feed'){
//                 angular.forEach(FbFilterInfo.analizeScope,function(value,key){
//                   arrayPromises.push(FbHandlerService.getFeedNextPage(key));
//                 });
//               } else if (FbFilterInfo.typeContent == 'photos'){
//                 angular.forEach(FbFilterInfo.analizeScope,function(value,key){
//                   arrayPromises.push(FbHandlerService.getPhotosNextPage(key));
//                 });
//               };
//               console.log('arrayOfpromises:',arrayPromises);
//               var contentCalls = $q.all(arrayPromises);
//               contentCalls.
//                 then(function(responses){
//                   console.log('success responses:',responses);
//                   angular.forEach(responses,function(value,key){
//                     angular.forEach(value,function(content_value,content_key){
//                       console.log('actual content:',$scope.content.contentToShow);
//                       $scope.content.contentToShow.push(content_value);
//                       FbInfoToShow.contentToShow.push(content_value);
//                     });
//                   });
//                   UXflags.flags.enableInfiniteScroll = true;
//                 },function(response){
//                   console.log('error response:',response);
//                   console.log('error while loading new content',response);
//                   UXflags.flags.enableInfiniteScroll = true;
//                 });
//             }
//           };
//       }],
//     controllerAs: 'info'
//   }
// });

// home.directive('facebookLoging',function(){
//   return {
//     restrict : 'E',
//     templateUrl : 'partials/loging-button.html',
//     controller : ['$scope','FbHandlerService',function($scope,FbHandlerService){

//       $scope.buttonMessage = 'Log in';

//       this.loginRoutine = function() {
//         FbHandlerService.checkLoginState()
//         .then(function(response){
//           if($scope.buttonMessage != "Log in"){
//             FbHandlerService.logout();
//             $scope.buttonMessage = "Log in";
//           } else {
//             $scope.buttonMessage = "Logout";
//           }
//         },function(response){
//           FbHandlerService.login().
//             then(function(){
//               $scope.buttonMessage = "Logout";
//             },function(){
//               $scope.buttonMessage = "Log in";
//             });
//         });
//       };
//     }],
//     link : function(scope, element, attrs) {
//       console.log('welcomeeeee loguerssss!')
//     },
//     controllerAs : 'log'
//   }
// })
































