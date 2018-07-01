describe('fileUpload', function() {
    describe('initialization', function() {
        var $componentController, controller, element;

        beforeEach(module('fileUpload'));

        beforeEach(inject(function($injector) {
            $componentController = $injector.get('$componentController');
            element = angular.element("<file-upload><input type='file'></file-upload>");
            controller = $componentController('fileUpload', {
                $scope: {},
                $element: element
            });
        }));

        it('isProgressing should be false', function() {
            expect(controller.isProgressing).toBe(false);
        });

        it('video should be null', function() {
            expect(controller.video).toBeNull();
        });

        it('error should be null', function() {
            expect(controller.error).toBeNull();
        });

        it('fileupload called', function() {
            expect(element.find('input[type=file]').data('blueimp-fileupload')).toBeTruthy();
        });

        it('getVideoUrl is a function', function() {
            expect(typeof controller.getVideoUrl).toBe('function');
        });
    });

    describe('getVideoUrl()', function() {
        var $componentController, controller, element, videoId;

        beforeEach(module('fileUpload'));

        beforeEach(inject(function($injector) {
            $componentController = $injector.get('$componentController');
            element = angular.element('<file-upload></file-upload>');
            videoId = 'abc';
            controller = $componentController('fileUpload', {
                $scope: {},
                $element: element
            });
            controller.video = {
                id: videoId
            };
        }));

        it('getVideoUrl should be expected', function() {
            expect(controller.getVideoUrl()).toBe('https://fast.wistia.net/embed/iframe/' + videoId);
        });

        it('sce policy', inject(function($sce) {
            expect(function() {
                return $sce.getTrustedResourceUrl(controller.getVideoUrl());
            }).toBeTruthy();
            controller.getVideoUrl = function() {
                return 'https://www.google.com';
            };
            expect(function() {
                return $sce.getTrustedResourceUrl(controller.getVideoUrl());
            }).toThrowError();
        }));
    });

    describe('fileupload callbacks', function() {
        var $componentController, controller, scope, element;

        beforeEach(module('fileUpload'));

        beforeEach(inject(function($injector, _$rootScope_) {
            $componentController = $injector.get('$componentController');
            element = angular.element('<file-upload><input type="file"></file-upload>');
            scope = _$rootScope_.$new();
            controller = $componentController('fileUpload', {
                $scope: scope,
                $element: element
            });
        }));

        it('on fileuploadstart, should set video and error to null', function(done) {
            controller.video = {id: 'abc'};
            controller.video = 'error';
            element
                .find('input[type=file]')
                .on('fileuploadstart', function() {
                    expect(controller.video).toBeNull();
                    expect(controller.error).toBeNull();
                    done();
                })
                .trigger('fileuploadstart');
        });

        it('on fileuploadprogress, should set isProgressing to true and broadcast percent', function(done) {
            spyOn(scope, '$broadcast');
            var loaded = 50;
            var total = 100;
            var percent = loaded / total * 100;
            controller.isProgressing = false;
            element
                .find('input[type=file]')
                .on('fileuploadprogress', function() {
                    expect(controller.isProgressing).toBe(true);
                    expect(scope.$broadcast).toHaveBeenCalledWith('percent', percent);
                    done();
                })
                .trigger('fileuploadprogress', {loaded: loaded, total: total});
        });

        it('on fileuploaddone, should set isProgressing to false, error to null, and set video', function(done) {
            controller.isProgressing = true;
            controller.error = 'error';
            controller.video = null;
            var video = {id: 'abc'};
            element
                .find('input[type=file]')
                .on('fileuploaddone', function() {
                    expect(controller.isProgressing).toBe(false);
                    expect(controller.error).toBeNull();
                    expect(controller.video.id).toBe(video.id);
                    done();
                })
                .trigger('fileuploaddone', {result: {hashed_id: video.id}});
        });

        it('on fileuploadfail, should set isProgressing to false, video to null, and set error', function(done) {
            controller.isProgressing = true;
            controller.video = {id: 'abc'};
            controller.error = null;
            var error = 'error';
            element
                .find('input[type=file]')
                .on('fileuploadfail', function() {
                    expect(controller.isProgressing).toBe(false);
                    expect(controller.error).toBe(error);
                    expect(controller.video).toBeNull();
                    done();
                })
                .trigger('fileuploadfail', {
                    jqXHR: {
                        responseJSON: {
                            error: error
                        }
                    }
                });
        });
    });
});