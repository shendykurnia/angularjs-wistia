angular
    .module('fileUpload')
    .component('fileUpload', {
        templateUrl: './app/file-upload/file-upload.template.html',
        controller: function($scope, $element) {
            var apiPassword = $element.attr('api-password');
            var fileInputs = $element.find('input[type=file]');

            this.isProgressing = false;
            this.video = null;
            this.error = null;

            var self = this;

            fileInputs
                .fileupload({
                    url: 'https://upload.wistia.com',
                    formData: {
                        api_password: apiPassword
                    }
                })
                .on('fileuploadstart', function(e, data) {
                    $scope.$apply(function() {
                        self.video = null;
                        self.error = null;
                    });
                })
                .on('fileuploadprogress', function(e, data) {
                    $scope.$apply(function() {
                        var percent = parseInt(data.loaded / data.total * 100, 10);
                        self.isProgressing = true;
                        $scope.$broadcast('percent', percent);
                    });
                })
                .on('fileuploaddone', function(e, data) {
                    $scope.$apply(function() {
                        self.isProgressing = false;
                        self.error = null;
                        self.video = {id: data.result.hashed_id};
                    });
                })
                .on('fileuploadfail', function(e, data) {
                    $scope.$apply(function() {
                        self.isProgressing = false;
                        self.video = null;
                        try {
                            self.error = data.jqXHR.responseJSON.error;
                        } catch (e) {
                            self.error = 'Failed to upload';
                        }
                    });
                });

            this.getVideoUrl = function() {
                if (self.video) {
                    return 'https://fast.wistia.net/embed/iframe/' + self.video.id;
                }

                return null;
            }
        }
    })
;