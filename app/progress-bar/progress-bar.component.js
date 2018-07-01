angular
    .module('progressBar')
    .component('progressBar', {
        templateUrl: './app/progress-bar/progress-bar.template.html',
        controller: function($scope) {
            this.percent = 0;

            var self = this;
            $scope.$on('percent', function(e, percent) {
                self.percent = percent;
            });
        }
    })
;