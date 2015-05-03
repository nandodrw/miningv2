'use strict';


angular.module('startMining').factory('sharedData', [function(){

  return {
    data: {
      menuList: {},
      analizeScope: {},
      content: {}
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

  function setContentMetadata(content){
    for (var i = content.length - 1; i >= 0; i--) {
      // comments metadata
      if(content[i].comments &&
        content[i].comments.summary &&
        content[i].comments.summary.total_count){

        content[i].commentsCount = content[i].comments.summary.total_count;

      } else {
        content[i].commentsCount = 0;
      }
      // likes metadata
      if(content[i].likes &&
        content[i].likes.summary &&
        content[i].likes.summary.total_count){

        content[i].likesCount = content[i].likes.summary.total_count;

      } else {
        content[i].likesCount = 0;
      }
      // shares metadata
      if(content[i].shares &&
        content[i].shares.count){

        content[i].sharesCount = content[i].shares.count;

      } else {
        content[i].sharesCount = 0;
      }
    };
    return content;
  }

  function getContent(analizeScope){
    var nodes = [];
    for(var i in analizeScope){
      nodes.push(i)
    }
    var deferred = $q.defer();
    FBhandler.callNodesContent(nodes, function(response){
      if(response.error){
        deferred.reject(response);
      } else {
        var content = {};
        for (var i = response.length - 1; i >= 0; i--) {
          if(response[i].code === 200){
            content[response[i].body.id] = {
              feed: setContentMetadata(response[i].body.feed.data)
            }
            if(response[i].body.feed.paging &&
              response[i].body.feed.paging.next){

              content[response[i].body.id].nextPage = response[i].body.feed.paging.next;

            } else {
              content[response[i].body.id].nextPage = undefined;
            }
          }
        };
        deferred.resolve(content);
      }
    });
    return deferred.promise;
  }

  return {
    sharedInfo: sharedInfo,
    initialize: initialize,
    login: login,
    logout: logout,
    getLoginStatus: getLoginStatus,
    getLikedContent: getLikedContent,
    getContent: getContent
  };

}]);