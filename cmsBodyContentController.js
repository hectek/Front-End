// cmsbodyContentController

(function () {
    "use strict";
    angular.module(APPNAME)
    .controller('cmsBodyContentController', BodyContentController);

    BodyContentController.$inject = ['$scope', '$baseController', '$http', '$sce', '$cmsContentService', "$serverModel"]

    function BodyContentController($scope, $baseController, $http, $sce, $cmsContentService, $serverModel) {
        var vm = this;
        vm.$scope = $scope;
        $baseController.merge(vm, $baseController);
        vm.contentService = $cmsContentService;
        vm.notify = vm.contentService.getNotifier($scope);
        vm.serverModel = $serverModel;
        var pageUrl = vm.serverModel.item;
        vm.content = null;
        vm.trustSrc = _trustSrc;
        vm.trustHtml = _trustHtml;
        vm.bodyTemplateUrl = _templateUrl;

        _render();

        function _render() {

            vm.contentService.selectAllContentKeyValue(pageUrl, _onGetContentSuccess, _getOnError);

        }

        // ON GET CONTENT SUCCESS
        function _onGetContentSuccess(data) {
            if (data) {
                vm.notify(function () {
                    vm.content = data.item;
                });
            }
        }

        // ON GET ERROR
        function _getOnError(jqXHR) {
            vm.$alertService.error(jqXHR.responseText, "Get Header failed");
        }

        // SELECT TEMPLATE LEGACY (NG)
        function _templateUrl() {
            return '/Scripts/app/cms/cmsContent/templates/_cmsContentTest.html';
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