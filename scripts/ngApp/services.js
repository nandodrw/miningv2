'use strict';

/* Services */

// var facebookInfoService =angular.module('facebookInfoService',[]);

// facebookInfoService.factory('FbFilterInfo',function(){
//     return {
//       analizeScope : {},
//       showCriteria : {},
//       typeContent : ''
//     };
//   }
// );

// var facebookInfoToShow =angular.module('facebookInfoToShow',[]);

// facebookInfoToShow.factory('FbInfoToShow',function(){
//     return {
//       contentToShow: []
//     };
// });

// function FbHandlerService () {

//   getUserLikePages : function() {
//       var deferred = $q.defer();
//       var that = this;
//       // deferred.reject('dump');
//       FBhandler.likeList = [];
//       deferred.notify('Grabing user liked pages');
//       FBhandler.callLikes(function(response){
//         console.log('recived response',response);
//         if(response.success){
//           deferred.resolve(
//             {
//               result : 'success',
//               data : FBhandler.likeList
//             }
//           );
//         } else {
//           deferred.reject(
//             {
//               result : response.error,
//               data :  FBhandler.likeList
//             }
//           );
//         }
//       });
//       return deferred.promise;
//    },

//    getNodeFeed : function(node){
//       var deferred = $q.defer();
//       deferred.notify('About get the information of node ' + node);
//       FBhandler.getNodeFeed(node,function(response){
//         console.log('WTF with the response',response);
//         if (!response.error){
//           deferred.resolve(response);
//         } else {
//           deferred.reject(response);
//         }
//       });
//       return deferred.promise;
//    },

//    getNodePhotos : function(node){
//       var deferred = $q.defer();
//       FBhandler.getNodePhotos(node,function(response){
//         if (response.error){
//           deferred.reject(response.error);
//         } else {
//           deferred.resolve(response);
//         }
//       });
//       return deferred.promise;
//    },

//    getFeedNextPage : function(node){
//       var deferred = $q.defer();
//       FBhandler.getFeedNextPage(node,function(response){
//         if (response.error){
//           deferred.reject(response.error);
//         } else {
//           deferred.resolve(response);
//         }
//       });
//       return deferred.promise;
//    },

//    getPhotosNextPage : function(node){
//       var deferred = $q.defer();
//       FBhandler.getPhotosNextPage(node,function(response){
//         if (response.error){
//           deferred.reject(response.error);
//         } else {
//           deferred.resolve(response);
//         }
//       });
//       return deferred.promise;
//    },

//    cleanData : function(){
//       FBhandler.cleanData();
//    },

//    checkLoginState : function(){
//       var deferred = $q.defer();
//       FBhandler.checkLoginState(function(response){
//         if(response.status == "connected"){
//           // connected.log('message resolve',)
//           deferred.resolve(response.status);
//         } else {
//           deferred.reject(response.status);
//         }
//       });
//       return deferred.promise;
//    },

//    logout : function(){
//       FBhandler.logout();
//    },

//    login : function(){
//       var deferred = $q.defer();
//       FBhandler.login('public_profile,user_likes',function(response){
//         if (response.error){
//           deferred.reject(response.error);
//         } else {
//           deferred.resolve(response);
//         }
//       });
//       return deferred.promise;
//     }
// };

angular.module('startMining').factory('sharedData', [function(){

  return {
    data: {
      menuList: {}
    }
  }

}]);

angular.module('startMining').factory('FbService', ['$q', function($q){

  var sharedInfo = {
    userStatus: 'out'
  }

  function initialize(params){
    var deferred = $q.defer();
    FBhandler.initialize(params, function(){
      deferred.resolve();
    });
    return deferred.promise;
  }

  function login(){
    var deferred = $q.defer();
    FBhandler.login(function(response, err){
      if (err){
        deferred.reject(response, err);
      } else {
        deferred.resolve(response);
      }
    }, {scope: 'public_profile,user_likes'});
    return deferred.promise;
  }

  function getLoginStatus(){
      var deferred = $q.defer();
      FBhandler.checkLoginState(function(response){
        deferred.resolve(response);
      });
      return deferred.promise;
  }

  function logout(){
    var deferred = $q.defer();
    FBhandler.logout(function(response){
      deferred.resolve(response);
    });
    return deferred.promise;
  }

  function getLikedContent(){
    var deferred = $q.defer();
    FBhandler.feedAllLikedContent(function(response){
      deferred.resolve(response);
    });
    return deferred.promise;
  }

  return {
    sharedInfo: sharedInfo,
    initialize: initialize,
    login: login,
    logout: logout,
    getLoginStatus: getLoginStatus,
    getLikedContent: getLikedContent
  };

}]);

// var userExperienceFlags =angular.module('userExperienceFlags',[]);

// userExperienceFlags.factory('UXflags',function(){
//     return {
//       flags : {
//         enableInfiniteScroll : true,
//         loadingInfo : false,
//         callingLikes : false
//       }
//     };
//   }
// );