/// <reference path="cmsContent/templates/_cmsContentCreateEdit.html" />
/// <reference path="cmsContent/templates/_cmsContentCreateEdit.html" />
/// <reference path="cmsContent/templates/_cmsContentCreateEdit.html" />
/// <reference path="cmsContent/templates/_cmsContentCreateEdit.html" />
// =================================  ROUTE CONFIGURATION   ========================================== //

(function () {
    "use ctrict";

    angular.module(APPNAME)
        .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

            $locationProvider.hashPrefix('!');

            $routeProvider.when('/', {
                templateUrl: '/Scripts/app/cms/cmsPagesView.html',
                controller: 'cmsPagesController',
                controllerAs: 'pagesVm'
            }).when('/navbar', {
                templateUrl: '/Scripts/app/cms/cmsNavigationView.html',
                controller: 'orderNavigationBarController',
                controllerAs: 'navCont'
            }).when('/metatags/:id/:ownerTypeId', {
                templateUrl: "/Scripts/app/cms/cmsMetatagsView.html",
                controller: 'cmsMetaController',
                controllerAs: 'metaVm'
            }).when('/templates', {
                templateUrl: "/Scripts/app/cms/cmsTemplatesView.html",
                controller: 'cmsTemplatesController',
                controllerAs: 'tmpCtrl'
            }).when('/templates/create', {
                templateUrl: "/Scripts/app/cms/cmsTemplateForm.html",
                controller: 'cmsCreateTemplatesController',
                controllerAs: 'mngTemp'
            }).when('/templates/edit/:id', {
                templateUrl: "/Scripts/app/cms/cmsTemplateForm.html",
                controller: 'cmsCreateTemplatesController',
                controllerAs: 'mngTemp'
            }).when('/create', {
                templateUrl: "/Scripts/app/cms/cmsPagesCreateEditView.html",
                controller: 'cmsCreatePageController',
                controllerAs: 'cms'
            }).when('/edit/:id', {
                templateUrl: "/Scripts/app/cms/cmsPagesCreateEditView.html",
                controller: 'cmsCreatePageController',
                controllerAs: 'cms'
            }).when('/navbar/:id', {
                templateUrl: '/Scripts/app/cms/cmsNavigationView.html',
                controller: 'orderNavigationBarController',
                controllerAs: 'navCont'
            }).when('/content/:id/:templateId/:url', {
                templateUrl: '/Scripts/app/cms/cmsContentCreateEditView.html',
                controller: 'cmsCreateEditContentController',
                controllerAs: 'editContentCtrl'
            });


            $locationProvider.html5Mode({
                enabled: false,
                requiredBase: false
            });

        }]);
})();