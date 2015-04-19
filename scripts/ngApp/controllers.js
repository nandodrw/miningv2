'use strict';

/* Controllers */

// home.controller('homeController',['$scope','$rootScope','FbFilterInfo',function($scope,$rootScope,FbFilterInfo){
angular.module('startMining').controller('homeController', ['$scope', '$rootScope', function ($scope, $rootScope) {

  $scope.sortShowCriteria = {
    sortCriteria : 'none',
    filterCriteria : ''
  }
  this.setSortCriteria = function(criteria){
    $scope.sortShowCriteria.sortCriteria = criteria;
  };
  this.getFilterStatus = function(tag){
    if($scope.sortShowCriteria.sortCriteria == tag){
      return "active";
    } else { return "";}
  };
  this.hideTag = function(){
    // if(FbFilterInfo.showCriteria.typeContent == 'photos'){
    //   return true
    // }
  };
}]);

// home.controller('ModalCtrl',function ($scope, $modal, $log) {

//   $scope.detectVideoProveedor = function(url) {
//     if(url.search('vimeo') != -1){
//       return 'vimeo';
//     } else if (url.search('youtu') != -1 ){
//       return 'youtube';
//     } else if (url.search('facebook') != -1) {
//       return 'facebook';
//     } else {
//       return 'otherProveedor';
//     }
//   };

//   $scope.open = function (contentUrl,typeVideo) {

//     var templateUrlContent = '';

//     if(typeVideo){

//       var videoProveedor = $scope.detectVideoProveedor(contentUrl);

//       if(videoProveedor =='youtube'){

//         templateUrlContent = 'partials/modal-youtube-video.html';
//         $scope.contentUrl = contentUrl.replace(/(?:http:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, "//www.youtube.com/embed/$1");

//       } else if (videoProveedor =='vimeo'){

//         templateUrlContent = 'partials/model-vimeo-video.html';
//         $scope.contentUrl = contentUrl.replace(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(.+)/g, "//player.vimeo.com/video/$1");

//       } else if (videoProveedor == 'facebook') {
//         templateUrlContent = 'partials/modal-template.html';
//         $scope.contentUrl = contentUrl;
//       } else {
//         templateUrlContent = 'partials/not-supported.html';
//       }
//     } else {

//       templateUrlContent = 'partials/modal-template.html';
//       $scope.contentUrl = contentUrl;

//     }

//     var modalInstance = $modal.open({
//       templateUrl: templateUrlContent,
//       controller: ModalInstanceCtrl,
//       size: 'sm',
//       scope : $scope,
//       resolve: { }
//     });

//     modalInstance.result.then(function (selectedItem) {
//       $scope.selected = selectedItem;
//     }, function () {
//       $log.info('Modal dismissed at: ' + new Date());
//     });

//     modalInstance.opened.then(function(){
//       console.log('modela opened executed!!!');
//       setTimeout(function(){window.FB.XFBML.parse()},0);
//     });
//   };
// });

// var ModalInstanceCtrl = ['$modalInstance','$scope', function($modalInstance,$scope) {
//   $scope.close = function() {
//     $modalInstance.dismiss();
//   };
// }];


