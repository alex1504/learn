;
(function() {
    function extend() {
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }
        var merge = function(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    };

    $.fn.pgBar = function(options) {
        options = extend({
            activeClass: 'z-active'
        }, options)

        return $(this).each(function(index, el) {
            var $container = $(el)
            var $progressReal = $container.find('.progress-real')
            var $progressWrap = $container.find('.progress-wrap')
            var $progressStepWrap = $container.find('.progress-step-wrap')
            var $stepBox = $container.find('.step-box')
            var totalStep = $container.find(".step-box").length;
            var activeStep = $container.data('active')
            activeStep = activeStep > totalStep ? totalStep : (activeStep < 0) ? 0 : activeStep

            var progressWrapWidth = $progressWrap.width();
            var progressStepWrapWidth = $progressStepWrap.width();
            var deltaWidth = progressStepWrapWidth - progressWrapWidth

            var percent = activeStep / totalStep
            var activeProgressWidth = (progressStepWrapWidth * percent) - (deltaWidth / 2)
            if (percent == 1) {
                activeProgressWidth = activeProgressWidth - deltaWidth / 2
            }
            $progressReal.animate({
                'width': activeProgressWidth + 'px'
            })
            $stepBox.each(function(index, el) {
                if (index < activeStep) {
                    $stepBox.eq(index).addClass(options.activeClass)
                }
            })
        })
    }
})()