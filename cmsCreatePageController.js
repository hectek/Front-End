//  ============================== CREATE AND EDIT PAGE CONTROLLER cmsCreatePageController  ================================================//


(function () {
    "use strict";

    angular.module(APPNAME).controller('cmsCreatePageController', CmsController);
    CmsController.$inject = [
        '$scope'
        , '$rootScope'
        , '$baseController'
        , '$cmsService'
        , '$serverModel'
        , 'OwnerKind'
        , '$uibModal'
        , 'moment'
        , '$location'
        , '$anchorScroll'
        , 'cmsTemplateService'];

    function CmsController(
        $scope
        , $rootScope
        , $baseController
        , $cmsService
        , $serverModel
        , OwnerKind
        , $uibModal
        , $moment
        , $location
        , $anchorScroll
        , cmsTemplateService) {

        var vm = this;
        vm.$scope = $scope;
        vm.$rootScope = $rootScope
        vm.$uibModal = $uibModal;
        vm.moment = $moment;
        $baseController.merge(vm, $baseController);
        vm.cmsService = $cmsService;
        vm.cmsTemplateService = cmsTemplateService;
        vm.serverModel = $serverModel;
        vm.cmsPageId = vm.$routeParams.id;

        vm.notify = vm.cmsService.getNotifier($scope);

        //PARAMETERS
        vm.createMode = false;
        vm.editMode = false;
        vm.templates;
        vm.pagetypes;
        vm.cmsPages;
        vm.slugPromise;


        // MODAL 
        vm.modalSelected;
        vm.modalItems = ['item1', 'item2', 'item3'];

        //INDEXES
        vm.pageTypeId = OwnerKind.kinds.owners.cmsPage;

        //FUNCTIONS
        vm.getSlugPromise = _getSlugPromise;
        vm.getNavBarTabs = _getNavBarTabs;
        vm.getIcons = _getIcons;
        vm.ctrlPagination = _ctrlPagination
        vm.submitPage = _submitPage
        vm.openModal = _openModal;
        vm.editIcon = _editIcon;
        vm.deleteIcon = _deleteIcon;
        vm.selectNavTab = _selectNavTab;
        vm.checkDate = _checkDate;
        vm.minDate = moment().format('MM-DD-YYYY');
        vm.resolvePromise = _resolvePromise;



        // ==========================================  STARTUP FUNCTION  ==============================================//

        _render();

        function _render() {
            _setUp();
            vm.cmsService.getTypes(_getTypesSuccess, _getTypesError);

            // EDIT MODE
            if (vm.cmsPageId > 0) {
                document.getElementById('cmsPage').scrollIntoView();
                vm.cmsService.getById(vm.cmsPageId, _getCmsOnSuccess, _getCmsOnError);
            }

            vm.cmsTemplateService.getAll(_onGetTemplatesSuccess, _onGetTemplatesError);
        }


        // SETUP VARIABLES
        function _setUp() {
            vm.cmsPage = {};
            vm.pageSize = 69;
            vm.loadNav = 0;
            vm.mainTabs = [];
            vm.btnColor = 'btn-default';
            vm.selectedIcon = true;
            vm.newIcons = true;
            vm.errMessage = 'initial';

        }

        // -------------------------- ICONS ----------------------------//
        // GET ALL ICONS
        function _getIcons() {
            if (vm.newTab && vm.cmsPage.isNavigation) {
                vm.newIcons = true;
                if (vm.cmsPage.icon) {
                    vm.selectedIcon = false;
                }
                else {
                    vm.selectedIcon = true;
                }
                vm.cmsService.getIconsPagination(0, vm.pageSize, _onGetIcons, _getCmsOnError);
            }
            else {
                vm.selectedIcon = true;
                vm.cmsPage.icon = null;
                vm.newIcons = false;
            }
        }
        // ON GET ICON SUCCESS
        function _onGetIcons(data) {
            if (data) {
                vm.notify(function () {
                    vm.item = data.item;
                });
            }
        }
        // EDIT CURRENT ICON
        function _editIcon() {
            if (vm.cmsPageId > 0) {
                vm.cmsService.getIconsPagination(0, vm.pageSize, _onGetIcons, _getCmsOnError);
                vm.newIcons = true;
                vm.newTab = true;
            }
            vm.newIcons = true;
            vm.selectedIcon = true;
        }
        // DELETE ICONS
        function _deleteIcon() {
            vm.cmsPage.icon = null;
            vm.modalSelected = null;
            vm.selectedIcon = true;
            vm.newIcons = true;
        }
        // CONTROL PAGINATION OF ICONS
        function _ctrlPagination(page, pageSize) {
            var dbpageIndex = page - 1;
            vm.cmsService.getIconsPagination(dbpageIndex, pageSize, _onGetIcons, _getCmsOnError);
            _scrollToNav();
        }


        // -------------------------- NAV BAR -----------------------------//
        // GET CURRENT NAV BAR
        function _getNavBarTabs() {
            if (vm.addToTab && vm.loadNav < 1) {
                vm.cmsService.getNavigationPages(_onGetNavBarTabs, _getCmsOnError);
            }
        }
        // ON GET NAV BAR SUCCESS
        function _onGetNavBarTabs(data) {
            if (data) {
                vm.notify(function () {
                    vm.tabs = data.items;
                    for (var i = 0; i < vm.tabs.length; i++) {
                        if (vm.tabs[i].parentId == null) {
                            vm.mainTabs.push(vm.tabs[i]);
                        }
                    }
                    for (var i = 0; i < vm.mainTabs.length; i++) {
                        if (vm.mainTabs[i].id == vm.cmsPage.parentId) {
                            _selectNavTab(vm.mainTabs[i]);
                        }
                    }
                });
                vm.loadNav = 1;
            }
        }
        // SELECT NAV TAB
        function _selectNavTab(item) {
            vm.cmsPage.parentId = item.id;
            angular.forEach(vm.mainTabs, function (it) { it.checked = false; });
            item.checked = !item.checked;
        }

        // ----------------------------------------------------------------//

        // SUBMIT PAGE HANDLER
        function _submitPage(isValid) {
            //console.log(vm.cmsPage)
            if (isValid) {
                if (vm.newTab) {
                    vm.cmsPage.parentId = null;
                }
                vm.cmsPage.icon = vm.modalSelected;
                if (vm.cmsPageId > 0) {
                    vm.cmsService.update(vm.cmsPageId, vm.cmsPage, _updateCmsOnSuccess, _updateCmsOnError);
                }
                else {
                    vm.cmsService.add(vm.cmsPage, _addCmsOnSuccess, _addCmsOnError);
                }
            }
        }


        // GET PAGES SUCCESS
        function _getCmsOnSuccess(data) {
            if (data) {
                vm.notify(function () {
                    vm.cmsPage = data.item;
                    if (vm.cmsPage.icon) {
                        vm.selectedIcon = false;
                        vm.newIcons = false;
                        vm.modalSelected = vm.cmsPage.icon;
                    }
                    else if (vm.cmsPage.parentId > 0) {
                        vm.addToTab = true;
                        vm.cmsService.getNavigationPages(_onGetNavBarTabs, _getCmsOnError);
                    }
                });

            }
        }

        // GET PAGE TYPES SUCCES
        function _getTypesSuccess(data) {
            if (data && data.items) {
                vm.notify(function () {
                    vm.pagetypes = data.items;
                    vm.pagetypes.splice(0,1);
                });
            }
        }

        // GET TEMPLATES SUCCES
        function _onGetTemplatesSuccess(data) {
            if (data && data.items) {
                vm.notify(function () {
                    vm.templates = data.items;
                });
            }
        }

        // UPDATE SUCCESS
        function _updateCmsOnSuccess() {
            vm.$alertService.success("Update CMS Successful!");
            window.location.href = '/admin/cms/pages/manage/#!';
        }

        // ON CREATE PAGE SUCCESS
        function _addCmsOnSuccess(data) {
            vm.cmsPageId = data.item;
            vm.$alertService.success("Add CMS Successful!");
            window.location.href = '/admin/cms/pages/manage/#!';
        }

        // VALIDATE DATES
        function _checkDate(newValue, oldValue) {

            vm.errMessage = newValue;
            console.log(newValue);
        }

        // SCROLL TOP FUNCTION
        function _scrollTop() {
            document.getElementById('cmsPage').scrollIntoView();
        }

        // SCROLL TO TOP OF NAVIGATION
        function _scrollToNav() {
            document.getElementById('nav-scroll').scrollIntoView();
        }


        //ERROR EVENT FUNCTIONS
        function _updateCmsOnError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Update CMS failed");
        }
        function _addCmsOnError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Add CMS failed");
        }
        function _getCmsOnError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Get CMS failed");
        }
        function _onGetTemplatesError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Template Id retrieval failed");
        }
        function _onCheckError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Url slug check failed");
        }
        function _getTypesError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Types CMS failed");
        }

        // BOOTSTRAP MODAL FUNCTION
        function _openModal(icon) {

            var modalInstance = vm.$uibModal.open({
                animation: true,
                templateUrl: "/Scripts/app/cms/cmsModalView.html",
                controller: 'modalController as mc',
                size: 'sm',
                resolve: {
                    items: function () {
                        return vm.modalItems
                    },
                    icon: function () {
                        return icon;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.modalSelected = selectedItem;
                vm.newIcons = false;
                vm.selectedIcon = false;
                _scrollToNav();
            }, function () {
                icon = null;
                console.log('Modal dismissed at: ' + new Date());
                _scrollToNav();
            });
        }

        // SLUG DIRECTIVE CALLBACKS
        function _resolvePromise(slugPromise) {
            if (slugPromise) {
                //console.log(slugPromise);

                slugPromise.then(function (slug) {
                    //console.log(slug);
                    let data = {
                        url: slug
                    };
                    //this jquery ajax call can return a promise
                    return vm.cmsService.checkUrl(data, _onCheckSuccess, _onCheckError);
                }).catch(function () {
                    console.log("Slug unavailable.");
                });
            }
        }

        function _getSlugPromise(slug) {
            //vm.slugPromise = promise;
            //_resolvePromise(vm.slugPromise);

            let data = {
                url: slug
            };

            //this jquery ajax call can return a promise
            return vm.cmsService.checkUrl(data);
        }
    }


})();

