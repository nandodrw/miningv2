'use strict';


(function () {

  //creating module variables
  var likeList = [];
  var likedFeed = {};
  var likedPhotos = {};



  function initialize(obj, callback) {
      if(obj.appId  && obj.version){
        window.fbAsyncInit = callback;
        $.getScript('//connect.facebook.net/en_US/sdk/debug.js', function(){
          FB.init(obj);
      });
    }
  }

  function checkLoginState(callback){
    FB.getLoginStatus(function(response) {
      if(callback){
        callback(response);
      }
    }, true);
  }

  function logout(callback){
    FB.logout(function(response){
      if(callback){
        callback(response);
      }
    });
  }

  function login(callback, param){
    FB.login(function(response){
      if(callback){
        callback(response);
      }
    }, param);
  }

  function getLikedContent(callback){
    var route = '/me?fields=likes{id,name,category,likes}';
    FB.api(route, 'get', function(response) {
      callback(response);
    });
  }

  function feedAllLikedContent(callback){

    var pointer = {
      data: []
    };

    getLikedContent(function(response){
      if(pointer &&
        response.likes &&
        response.likes.paging &&
        response.likes.paging.next){

        recursivePageCall(response.likes.paging.next, callback, pointer);

      } else {
        if(pointer && response.likes.data){
          for(var i = 0; i < response.likes.data.length; i++){
            pointer.data.push(response.likes.data[i]);
          }
        }
        callback(pointer)
      }
    });
  }

  function recursivePageCall(url, callback, pointer){
    var requestCall = new XMLHttpRequest();
    requestCall.open('GET',url);
    requestCall.onload = function(response){
      if(response.target.response) {
        var newData = JSON.parse(response.target.response);
        if(newData.data){
          for (var i = newData.data.length - 1; i >= 0; i--) {
            pointer.data.push(newData.data[i]);
          };
        }
        if(newData.paging && newData.paging.next) {
          recursivePageCall(newData.paging.next, callback, pointer);
        } else {
          if(pointer){
            pointer.filled = true;
            callback(pointer);
          }
        }
      } else {
        callback(pointer);
      }
    }
    requestCall.send();
  }

  function getNodePostedContent(node, callback) {

    var routeP1 = '/' + node + '?fields=feed.fields';
    var routeP2 = '(id,message, link,name, description, picture,';
    var routeP3 = 'type, shares, likes.fields(id).limit(1).summary(true),';
    var routeP4 = 'comments.fields(id).limit(1).summary(true))';
    var route = routeP1 + routeP2 + routeP3 + routeP4;

    FB.api(route, 'get', function(response){
      callback(response);
    });
  }

  function storeFeed (node,feed){
    if (FBhandler.likedFeed[node]){
      FBhandler.likedFeed[node].data = FBhandler.likedFeed[node].data.concat(feed.data);
      FBhandler.likedFeed[node].paging = feed.paging;
    } else {FBhandler.likedFeed[node] = feed;}
  };

  function storePhotos (node,photos){
    if (FBhandler.likedPhotos[node]){
      FBhandler.likedPhotos[node].data = FBhandler.likedPhotos[node].data.concat(photos.data);
      FBhandler.likedPhotos[node].paging = photos.paging;
    } else {FBhandler.likedPhotos[node] = photos;}
  };

  function addMetaData (data,type){
    if(type == 'feed'){
      for(i in data){
        if(data[i].likes){
          data[i].likes_count = data[i].likes.summary.total_count;
        } else {
          data[i].likes_count = 0;
        };
        if(data[i].comments){
          data[i].comments_count = data[i].comments.summary.total_count;
        } else {
          data[i].comments_count = 0;
        };
        if(data[i].shares){
          data[i].shares_count = data[i].shares.count;
        } else {
          data[i].shares_count = 0;
        };
      };
    } else if (type == 'photos'){
        for(i in data){
          if(data[i].likes){
            data[i].likes_count = data[i].likes.summary.total_count;
          } else {
            data[i].likes_count = 0;
          };
          if(data[i].comments){
            data[i].comments_count = data[i].comments.summary.total_count;
          } else {
            data[i].comments_count = 0;
          };
        };
      }
    };

  function statusChangeCallback (response){
    if (response.status === 'connected') {
      $('#general-message').text('Welcome!!');
      FBhandler.status = 'connected';
      return 'connected'
    } else if (response.status === 'not_authorized') {
      $('#general-message').text('Please log  into this app.');
      FBhandler.status = 'not_authorized'
      return 'not_authorized'
    } else {
      $('#general-message').text('Please log into Facebook.');
      FBhandler.status = 'not-logged'
      return 'not-logged'
    }
  };

  function callMe () {
    return FBauxiliar.callFbGraph("/me");
  };

  function callLikes (callback){
    var likeObj = {};
    var callRemote = callback;
    FBauxiliar.callFbGraph('me?fields=likes.fields(id,name,category,likes)', function(likeObj){
      if(likeObj.likes){
        FBhandler.likeList = FBhandler.likeList.concat(likeObj.likes.data);
        if(likeObj.likes.paging){
          FBauxiliar.pagingLikes(likeObj.likes.paging.next,callRemote);
        }
      } else {
        callback({error : 'No liked pages were grabbed'});
      }

    });
  };

  function getFeedNextPage (node,callback){
    if(FBhandler.likedFeed[node].paging.next){
      $.get(FBhandler.likedFeed[node].paging.next,function(response){
        if(response.error){

          if(callback){callback(response);}
        }else{
          FBauxiliar.addMetaData(response.data,'feed');
          FBauxiliar.storeFeed(node,response);
          if (callback) {callback(response.data);};
        }

      });
    } else {return false};
  };

  // defining global object
  window.FBhandler = {};
  window.FBhandler.initialize = initialize;
  window.FBhandler.checkLoginState = checkLoginState;
  window.FBhandler.logout = logout;
  window.FBhandler.login = login;
  window.FBhandler.getLikedContent = getLikedContent;
  window.FBhandler.feedAllLikedContent = feedAllLikedContent;
  window.FBhandler.getNodePostedContent = getNodePostedContent;

})();

