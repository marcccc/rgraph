define(function(require) {

    'use strict';

    function getDomOffset(dom) {
        if (!dom) {
            retunr;
        }
        if (!dom.getClientRects().length) {
            return {
                top: 0,
                left: 0
            };
        }
        var rect = dom.getBoundingClientRect();
        if (rect.width || rect.height) {
            var doc = dom.ownerDocument;
            var docElem = doc.documentElement;

            return {
                top: rect.top + window.pageYOffset - docElem.clientTop,
                left: rect.left + window.pageXOffset - docElem.clientLeft
            };
        }
        return rect;
    }

    function addEventListener(ele, eventname, fn) {
        if(ele.addEventListener){
            ele.addEventListener(eventname, fn, false);
        }else{
            ele.attachEvent("on" + eventname, fn);
        }
    }

    function deleteEventListener(ele,eventname){
        if(ele.removeEventListener){
            ele.removeEventListener(eventname);
        }else{
            ele.detachEvent("on" + eventname);
        }
    }
    function getEvent(e) {
        var evt = window.event ? window.event : e;
        if (!evt.stopPropagation) {
            evt.stopPropagation = function() {
                evt.cancelBubble = false;
            }
        }
        if (!evt.preventDefault) {
            evt.preventDefault = function() {
                evt.returnValue = false;
            }
        }
        if (!evt.target) {
            evt.target = evt.srcElement;
        }
        // if (!evt.which) {
        //     e.which = e.button;
        // }
        return evt;
    }
    function clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            // IE?
            document.selection.empty();
        }
    }
    return {
        getDomOffset: getDomOffset,
        addEventListener: addEventListener,
        deleteEventListener: deleteEventListener,
        getEvent: getEvent,
        clearSelection: clearSelection
    };
});
