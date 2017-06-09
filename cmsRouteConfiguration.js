
// =================================  ROUTE CONFIGURATION WITH ANGULAR ========================================== //

(function () {
    "use strict";

    angular.module(APPNAME)
        .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

            $locationProvider.hashPrefix('!');

            $routeProvider.when('/', {
                templateUrl: '/FILEPATH/View1.html',
                controller: 'Controller1',
                controllerAs: 'ctrl1'
            }).when('/navbar', {
                templateUrl: '/FILEPATH/View2.html',
               controller: 'Controller2',
                controllerAs: 'ctrl2'
            }).when('/metatags/:id/:ownerTypeId', {
                templateUrl: "/FILEPATH/View3.html",
               controller: 'Controller3',
                controllerAs: 'ctrl3'
            }).when('/templates', {
                templateUrl: "/FILEPATH/View4.html",
                controller: 'Controller4',
                controllerAs: 'ctrl4'
            }).when('/templates/create', {
                templateUrl: "/FILEPATH/View5.html",
                controller: 'Controller5',
                controllerAs: 'ctrl5'
            }).when('/templates/edit/:id', {
                templateUrl: "/FILEPATH/View6.html",
                controller: 'Controller6',
                controllerAs: 'ctrl6'
            }).when('/create', {
                templateUrl: "/FILEPATH/View7.html",
               controller: 'Controller7',
                controllerAs: 'ctrl7'
            }).when('/edit/:id', {
                templateUrl: "/FILEPATH/View8.html",
                controller: 'Controller8',
                controllerAs: 'ctrl8'
            }).when('/navbar/:id', {
                templateUrl: '/FILEPATH/View9.html',
               controller: 'Controller9',
                controllerAs: 'ctrl9'
            }).when('/content/:id/:templateId/:url', {
                templateUrl: '/FILEPATH/View9.html',
               controller: 'Controller10',
                controllerAs: 'ctrl10'
            });


            $locationProvider.html5Mode({
                enabled: false,
                requiredBase: false
            });

        }]);
})();
