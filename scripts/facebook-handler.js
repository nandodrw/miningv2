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

  function pagingLikes (url_get,callback) {

  var me = this;

    if(url_get){
      $.ajax(

          {
            url : url_get,
            success : function(response){
              FBhandler.likeList = FBhandler.likeList.concat(response.data);
              me.pagingLikes(response.paging.next,callback);
            },
            error : function(message){
              if(me.callback){me.callback({error : message});}
            }
          }
        );
    }else{
      if(callback){callback({success : 'success'});}
    }
  };

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

})();

