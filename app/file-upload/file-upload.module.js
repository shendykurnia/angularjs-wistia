angular
    .module('fileUpload', ['progressBar'])
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://fast.wistia.net/embed/iframe/**'
        ]);
    });