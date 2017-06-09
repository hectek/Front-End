// cmsHeaderContentController

(function () {
    "use strict";
    angular.module(APPNAME)
    .controller('cmsHeaderContentController', HeaderContentController);

    HeaderContentController.$inject = ['$scope', '$baseController', '$http', '$sce', '$cmsContentService', "$serverModel"]

    function HeaderContentController($scope, $baseController, $http, $sce, $cmsContentService, $serverModel) {
        var vm = this;
        vm.$scope = $scope;
        $baseController.merge(vm, $baseController);
        vm.contentService = $cmsContentService;
        vm.notify = vm.contentService.getNotifier($scope);
        vm.serverModel = $serverModel;
        var pageUrl = vm.serverModel.item;
        vm.header = null;
        vm.trustSrc = _trustSrc;
        vm.trustHtml = _trustHtml;
        vm.headerTemplateUrl = _templateUrl;


        _render();

        function _render() {

            vm.contentService.selectAllContentKeyValue(pageUrl, _onGetContentSuccess, _getOnError);

        }

        // ON GET HEADER CONTENT
        function _onGetContentSuccess(data) {
            if (data) {
                vm.notify(function () {
                    vm.header = data.item;
                });
            }
        }

        // ERROR FUNCTION
        function _getOnError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Get Header failed");
        }

        // SANITIZE FILES
        function _trustSrc(src) {
            return $sce.trustAsResourceUrl(src);
        }

        // SANITIZE HTML
        function _trustHtml(src) {
            return $sce.trustAsHtml(src);
        }

    }
})();
