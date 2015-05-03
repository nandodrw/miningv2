'use strict';

/*
 *  User menu
 */

function userMenuController($scope, sharedData, FbService){

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

  $scope.getContent = function(){
    FbService.getContent($scope.menuInfo.data.analizeScope).
    then(function(content){
      sharedData.data.content = content;
    });
  }

}

angular.module('startMining').directive('userMenu',function(){
  return {
    restrict: 'E',
    transclude: false,
    templateUrl:'partials/user-menu.html',
    controller:
      ['$scope', 'sharedData', 'FbService', userMenuController]
  };
});

/*
 *  Content section
 */

function contentSectionController($scope, sharedData){
  $scope.contentInfo = sharedData.data;

}

angular.module('startMining').directive('contentSection',function(){
  return {
    restrict: 'E',
    transclude: false,
    templateUrl:'partials/content-section.html',
    controller:
      ['$scope', 'sharedData', contentSectionController]
  };
});

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
































