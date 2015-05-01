'use strict';


angular.module('startMining').factory('sharedData', [function(){

  return {
    data: {
      menuList: {},
      analizeScope: {}
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