// ===================== 

(function () {
    "use strict";
    angular.module(APPNAME)
    .controller('cmsCreateEditContentController', CmsCreateEditContentController);

    CmsCreateEditContentController.$inject = ['$scope', '$baseController', '$http', '$sce', '$cmsContentService', '$imageService', '$uibModal']

    function CmsCreateEditContentController($scope, $baseController, $http, $sce, $cmsContentService, $imageService, $uibModal) {
        var vm = this;
        vm.$scope = $scope;
        $baseController.merge(vm, $baseController);
        vm.contentService = $cmsContentService;
        vm.$imageService = $imageService;
        vm.notifycontent = vm.contentService.getNotifier($scope);
        vm.notifyimage = vm.$imageService.getNotifier($scope);
        vm.$uibModal = $uibModal;

        var pageUrl = vm.$routeParams.url;
        var pageId = vm.$routeParams.id;
        var templateId = vm.$routeParams.templateId;
        vm.pageName = pageUrl[0].toUpperCase() + pageUrl.slice(1);
        vm.content = {
            templateKeyId: null
            , value: null
            , CMSPageId: pageId
        }

        vm.sectionNames = [];
        vm.sections = [];
        vm.sectionContent = [];
        vm.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };

        vm.keys = [];
        vm.modalSelected = null;
        vm.modalItems = [];
        vm.textEditorSelected = null;

        vm.currentKey = _currentKey;
        vm.updateContent = _updateContent;
        vm.trustSrc = _trustSrc;
        vm.openModal = _openModal;
        vm.openTextEditor = _textEditor;
        vm.isImage = _isImage;
        vm.isUrl = _isUrl;
        vm.isDefault = _isDefault;
        vm.isRichText = _isRichText;

        _render();

        function _render() {

            _scrollTop();
            vm.contentService.getSections(_onGetSections, _onSectionsError);
            vm.contentService.getTemplateKeys(templateId, _onGetKeysSuccess, _onKeysError);

        }

        // ON GET SECTIONS
        function _onGetSections(data) {
            if (data && data.items) {
                vm.notifycontent(function () {
                    vm.sectionNames = data.items;
                    for (var i = 0; i < vm.sectionNames.length; i++) {
                        vm.sections[i] = [];
                        var sectionPair = {
                            name: vm.sectionNames[i].name
                            , id: vm.sectionNames[i].id
                            , values: vm.sections[i]
                        }
                        vm.sectionContent.push(sectionPair);
                    }
                });
            }
        }

        // CURRENT KEY SELECTOR
        function _currentKey(key) {
            vm.content.templateKeyId = key.id;
            if (key.contentId) {
                vm.content.id = key.contentId;
            }
            else {
                vm.content.id = null;
            }
        }

        // UPDATE CONTENT
        function _updateContent(data) {
            vm.content.value = data;
            if (vm.content.id) {
                vm.contentService.updateContent(vm.content, vm.content.id, _onUpdateContent, _onUpdateError);
            }
            else {
                vm.contentService.createContent(vm.content, _onCreateContent, _onCreateError);
            }
        }


        // ON GET KEYS SUCCESS
        function _onGetKeysSuccess(data) {
            if (data) {
                vm.notifycontent(function () {
                    vm.keys = data.items;
                    vm.keys.value = null;
                });
                vm.contentService.selectContentKeyValueType(pageUrl, _onGetContentSuccess, _getOnError);
            }
        }

        // ON CREATE CONTENT
        function _onCreateContent(data) {
            console.log("success");
        }

        // ON UPDATE SUCCESS
        function _onUpdateContent(data) {
            console.log("succces");
        }

        // ON GET CONTENT SUCCESS
        function _onGetContentSuccess(data) {
            if (data) {
                vm.notifycontent(function () {
                    vm.keypairs = data.items;
                    for (var j = 0; j < vm.keys.length; j++) {
                        if (vm.keypairs) {
                            for (var i = 0; i < vm.keypairs.length; i++) {
                                if (vm.keypairs[i].templateKeyId == vm.keys[j].id && vm.keypairs[i].value) {
                                    vm.keys[j].value = vm.keypairs[i].value;
                                    vm.keys[j].contentId = vm.keypairs[i].contentId;
                                }
                            }
                        }
                    }
                    _editKeyNames(vm.keys);
                });
            }
        }

        // EDIT KEY NAMES FOR DISPLAY
        function _editKeyNames(keynames) {
            if (keynames) {
                for (var i = 0; i < keynames.length; i++) {
                    var name = keynames[i];
                    name.keyName = name.keyName.substring(name.keyName.indexOf('_') + 1);
                    name.keyName = name.keyName.replace(/_/g, " ");
                    _orderSections(name);
                }
            }
        }

        // ORDER KEYS BY SECTIONS
        function _orderSections(name) {
            switch (name.section) {
                case (name.section = 2):
                    vm.sections[1].push(name);
                    break;
                case (name.section = 3):
                    vm.sections[2].push(name);
                    break;
                case (name.section = 4):
                    vm.sections[3].push(name);
                    break;
                case (name.section = 5):
                    vm.sections[4].push(name);
                    break;
                default: vm.sections[0].push(name);
            }
        }

        // CHECK IF CONTENT IS DEFAULT TYPE
        function _isDefault(item) {
            if (item.type != 5 && item.type != 7 && item.type !=6) {
                return true;
            }
            else {
                return false;
            }
        }

        // CHECK IF CONTENT IS URL
        function _isUrl(item) {
            if (item.type == 7) {
                return true;
            }
            else {
                return false;
            }
        }

        // CHECK IF CONTENT IS IMAGE
        function _isImage(item) {
            if (item.type == 5) {
                return true;
            }
            else {
                return false;
            }
        }

        // CHECK IF CONTENT IS HTML 
        function _isRichText(item) {
            if (item.type == 6) {
                return true;
            }
            else {
                return false;
            }
        }


        // ON ERROR FUNCTIONS
        function _onSectionsError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Get sections failed");
        }
        function _onKeysError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Get keys failed");
        }
        function _getOnError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Get keys failed");
        }
        function _onCreateError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Create failed");
        }
        function _onUpdateError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Update failed");
        }
        function _onErrorId(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Select failed");
        }

        // SANITIZE FILES
        function _trustSrc(src) {
            return $sce.trustAsResourceUrl(src);
        }

        // SCROLL TOP FUNCTION
        function _scrollTop() {
            document.getElementById('top-content').scrollIntoView();
        }

        // MODAL IMAGES FUNCTION
        function _openModal(contentItem) {

            var modalInstance = vm.$uibModal.open({
                animation: true,
                templateUrl: '/Scripts/app/cms/cmsContent/templates/_cmsImagesModal.html',
                controller: 'contentImageModalController as imgctrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return vm.modalItems;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.modalSelected = selectedItem;
                contentItem.value = selectedItem;
                vm.updateContent(selectedItem);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        // MODAL TEXT EDITOR FUNCTION
        function _textEditor(contentItem) {
            var modalInstance = vm.$uibModal.open({
                animation: true,
                templateUrl: '/Scripts/app/cms/cmsContent/templates/_cmsTextEditorModal.html',
                controller: 'cmstextEditorModalController as txtEditCtrl',
                size: 'lg',
                resolve: {
                    contentItem: function () {
                        return contentItem;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.textEditorSelected = selectedItem;
                contentItem.value = selectedItem;
                vm.updateContent(selectedItem);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }
})();
