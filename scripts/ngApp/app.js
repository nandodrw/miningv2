'use strict';

angular.module('startMining', [
  'ngRoute',
  // 'facebookInfoService',
  // 'facebookHandleService',
  // 'facebookInfoToShow',
  'ui.bootstrap',
  // 'infinite-scroll',
  // 'userExperienceFlags',
  // 'angular-intro'
]).

// config(['$routeProvider','$sceDelegateProvider','$sceProvider', function($routeProvider,$sceDelegateProvider,$sceProvider) {
//   $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeController'});
//   $routeProvider.when('/privacy', {templateUrl: 'partials/privacy.html', controller: 'homeController'});
//   $routeProvider.otherwise({redirectTo: '/home'});
//      $sceProvider.enabled(false);
// }]);

config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'homeController'});
  $routeProvider.when('/privacy', {templateUrl: 'partials/privacy.html', controller: 'homeController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);

// function DropdownCtrl($scope) {
//   $scope.items = [
//     'The first choice!',
//     'And another choice for you.',
//     'but wait! A third!'
//   ];

//   $scope.status = {
//     isopen: false
//   };

//   $scope.toggled = function(open) {
//     console.log('Dropdown is now: ', open);
//   };

//   $scope.toggleDropdown = function($event) {
//     $event.preventDefault();
//     $event.stopPropagation();
//     $scope.status.isopen = !$scope.status.isopen;
//   };
// }