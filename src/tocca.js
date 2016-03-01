/**
 *
 * Version: 0.2.0
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/

// helpers
var msEventType = function(type) {
        var lo = type.toLowerCase(),
            ms = 'MS' + type;
        return navigator.msPointerEnabled ? ms : lo;
    },
    debounce = function(fn, delay) {
        var t;
        return function() {
            var args = arguments;
            clearTimeout(t);
            t = setTimeout(function() {
                fn.apply(null, args)
            }, delay);
        };
    },
    getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event;
    },
    sendEvent = function(elm, eventName, originalEvent, data) {
        var customEvent = document.createEvent('Event');
        customEvent.originalEvent = originalEvent;
        data = data || {};
        data.x = currX;
        data.y = currY;
        data.distance = data.distance;

        // addEventListener
        if (customEvent.initEvent) {
            for (var key in data) {
                customEvent[key] = data[key];
            }
            customEvent.initEvent(eventName, true, true);
            elm.dispatchEvent(customEvent);
        }

        // inline
        if (elm['on' + eventName]) {
            elm['on' + eventName](customEvent);
        }
    };

var Tocca = {
    events: {
        start: msEventType('PointerDown') + ' touchstart mousedown',
        end: msEventType('PointerUp') + ' touchend mouseup',
        move: msEventType('PointerMove') + ' touchmove mousemove'
    },
    onTouchStart: function(e) {

        var pointer = getPointerEvent(e);

        // caching the current x
        cachedX = currX = pointer.pageX;
        // caching the current y
        cachedY = currY = pointer.pageY;

        tapNum++;
    },
    onTouchEnd: function(e) {

        var eventsArr = [],
            deltaY = cachedY - currY,
            deltaX = cachedX - currX;

        if (deltaX <= -swipeThreshold) {
            if (TargetInstance) {
                TargetInstance.goTo('previous');
            }
            eventsArr.push('swiperight');
        }

        if (deltaX >= swipeThreshold) {
            if (TargetInstance) {
                TargetInstance.goTo('next');
            }
            eventsArr.push('swipeleft');
        }

        if (deltaY <= -swipeThreshold) {
            eventsArr.push('swipedown');
        }

        if (deltaY >= swipeThreshold) {
            eventsArr.push('swipeup');
        }

        if (eventsArr.length) {
            for (var i = 0; i < eventsArr.length; i++) {
                var eventName = eventsArr[i];
                sendEvent(e.target, eventName, e, {
                    distance: {
                        x: Math.abs(deltaX),
                        y: Math.abs(deltaY)
                    }
                });
            }
            // reset the tap counter
            tapNum = 0;
        }

        TargetInstance = null;
    },
    onTouchMove: function(e) {

        // If no slider had been clicked, we don't procede
        if (!TargetInstance) return;

        var pointer = getPointerEvent(e);

        currX = pointer.pageX;
        currY = pointer.pageY;

        var deltaY = cachedY - currY,
            deltaX = cachedX - currX;

        if (tapNum > 0 && (Math.abs(deltaX) >= swipeThreshold || Math.abs(deltaY) >= swipeThreshold)) {
            sendEvent(e.target, 'drag', e, {
                delta: {
                    x: deltaX,
                    y: deltaY
                }
            });
        }
    }
};

var swipeThreshold = window.SWIPE_THRESHOLD || 100,
    tapNum = 0,
    currX, currY, cachedX, cachedY;

//setting the events listeners
// we need to debounce the callbacks because some devices multiple events are triggered at same time
Utils.setListener(document, Tocca.events.start, debounce(Tocca.onTouchStart, 1));
Utils.setListener(document, Tocca.events.end, debounce(Tocca.onTouchEnd, 1));
Utils.setListener(document, Tocca.events.move, debounce(Tocca.onTouchMove, 1));
