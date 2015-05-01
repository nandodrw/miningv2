'use strict';


(function () {

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

  function buildNodeRequest(node){
    var routeP1 = '/' + node + '?fields=feed.fields';
    var routeP2 = '(id,message, link,name, description, picture,';
    var routeP3 = 'type, shares, likes.fields(id).limit(1).summary(true),';
    var routeP4 = 'comments.fields(id).limit(1).summary(true))';
    return routeP1 + routeP2 + routeP3 + routeP4;
  }

  function getNodePostedContent(node, callback) {
    var route = buildNodeRequest(node)
    FB.api(route, 'get', function(response){
      callback(response);
    });
  }


  function batchCall(params, callback){
    FB.api('/', 'post', params, function(response){
      for(var i in response){
        if(response[i].body){
          response[i].body = JSON.parse(response[i].body);
        }
      }
      callback(response);
    });
  }

  function  callNodesContent(nodes, callback){
    var callArray = [];
    for (var i = nodes.length - 1; i >= 0; i--) {
      callArray.push({
        method: 'get',
        relative_url: buildNodeRequest(nodes[i])
      });
    };
    var params = {
      batch: JSON.stringify(callArray),
      include_headers: false
    }
    batchCall(params, callback);
  }

  function callNodesPagingLinks(urls, callback){
    var callArray = [];
    for (var i = urls.length - 1; i >= 0; i--) {
      callArray.push({
        method: 'get',
        relative_url: urls[i].replace(/((https:\/\/graph.facebook.com)+(\/v[0-9].[0-9]\/))/g, '')
      });
    };
    var params = {
      batch: JSON.stringify(callArray),
      include_headers: false
    }
    batchCall(params, callback);
  }

  // defining global object
  window.FBhandler = {};
  window.FBhandler.initialize = initialize;
  window.FBhandler.checkLoginState = checkLoginState;
  window.FBhandler.logout = logout;
  window.FBhandler.login = login;
  window.FBhandler.getLikedContent = getLikedContent;
  window.FBhandler.feedAllLikedContent = feedAllLikedContent;
  window.FBhandler.getNodePostedContent = getNodePostedContent;
  window.FBhandler.callNodesContent = callNodesContent;
  window.FBhandler.callNodesPagingLinks = callNodesPagingLinks;

})();

