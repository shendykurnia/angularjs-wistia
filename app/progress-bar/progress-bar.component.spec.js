describe('progressBar', function() {
    describe('initialization', function() {
        var $componentController, controller, scope, element;

        beforeEach(module('progressBar'));

        beforeEach(inject(function($injector, _$rootScope_) {
            $componentController = $injector.get('$componentController');
            element = angular.element("<progress-bar></progress-bar>");
            scope = _$rootScope_.$new();
            controller = $componentController('progressBar', {
                $scope: scope,
                $element: element
            });
        }));

        it('percent to be 0', function() {
            expect(controller.percent).toBe(0);
        });
    });

    describe('callbacks', function() {
        var $componentController, controller, scope, element;

        beforeEach(module('progressBar'));

        beforeEach(inject(function($injector, _$rootScope_) {
            $componentController = $injector.get('$componentController');
            element = angular.element("<progress-bar></progress-bar>");
            scope = _$rootScope_.$new();
            controller = $componentController('progressBar', {
                $scope: scope,
                $element: element
            });
        }));

        it('percent should be updated on callback', function(done) {
            controller.percent = 10;
            var percent = 20;
            scope.$on('percent', function() {
                    expect(percent).toBe(percent);
                    done();
                });
            scope.$broadcast('percent', percent);
        });
    });
});