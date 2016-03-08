function Elba(selector, options) {

    var _defaults = {
        selector: '.elba',
        separator: '|',
        breakpoints: false,
        successClass: 'elba-loaded',
        errorClass: 'elba-error',
        src: 'data-src',
        error: false,
        success: false,
        duration: 700,
        easing: 'easeInOutSine',
        navigation: true,
        dots: true,
        slideshow: 8000,
        preload: 1,
        swipeThreshold: 60,
        //Hint for the direction to load
        directionHint: 'right',
        align: 'center'
    };

    var _createInstance = function(el, GUID, options) {
        return Object.create(Slider, {
            el: {
                writable: false,
                value: el
            },
            GUID: {
                writable: false,
                value: GUID
            },
            settings: {
                writable: true,
                value: options
            },
            slider: {
                writable: true,
                configurable: true,
                value: null
            },
            proxy: {
                writable: true,
                value: true,
                value: {
                    pointer: 0,
                    oldPointer: 0,
                    isSettled: true,
                    isWrappable: false,
                    isFirstElTranslated: false,
                    isLastElTranslated: false,
                    viewportWidth: 0,
                    xCssTranslation: 0,
                    xNormalizedTranslation: 0,
                    totalSlidesWidth: 0,
                    targetOffset: 0,
                    updateTranslation: function(offset){
                        this.xCssTranslation = offset;
                        this.xNormalizedTranslation = offset / this.viewportWidth;
                    }
                }
            },
            slidesMap: {
                writable: true,
                enumerable: true,
                value: []
            },
            source: {
                writable: true,
                value: {}
            }
        });
    };

    // Extend default options
    var settings = Utils.extend(_defaults, options);

    this.instances = [];

    if (selector.indexOf('#') > -1) {
        var target = selector.slice(1);
        var GUID = Utils.generateGUID();
        Instances[GUID] = _createInstance(document.getElementById(target), GUID, settings);
        Instances[GUID].init();
        this.instances.push(GUID);
    }
}