define(function() {

    'use strict';

    var RDom = require('../util/rDom');

    function Paper(graph, option) {

        this.graph = graph;
        this.option = option || {};

        this.init();
    }
    Paper.prototype.init = function() {

        this.canvasx = RDom.getDomOffset(this.graph.dom).left;
        this.canvasy = RDom.getDomOffset(this.graph.dom).top;
        this.zoom = 1;
        this.setViewBox(0, 0, this.graph.width, this.graph.height);

        var _paper = this;
        RDom.addEventListener(this.graph.dom.querySelector('svg'), 'mousewheel', function(e) {
            _paper.wheel(e);
        });

        this.canvasdragging = false;
        RDom.addEventListener(this.graph.dom.querySelector('svg'), 'mousedown', function(e) {
            _paper.mousedownfn(e);
        });
        RDom.addEventListener(this.graph.dom.querySelector('svg'), 'mousemove', function(e) {
            _paper.mousemovefn(e);
        });
        RDom.addEventListener(this.graph.dom.querySelector('svg'), 'mouseup', function(e) {
            _paper.mouseupfn(e);
        });
    };

    Paper.prototype.setViewBox = function(x, y, w, h, fit) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.graph.rPaper.setViewBox(x, y, w, h, fit);
    };

    Paper.prototype.getViewBox = function() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    };

    Paper.prototype.wheel = function(e) {
        var evt = RDom.getEvent(e),
            viewbox = this.getViewBox(),
            delta = evt.wheelDelta ? (evt.wheelDelta / 120) : (-evt.detail / 3),
            basePoint = {
                x: viewbox.x + evt.clientX - this.canvasx,
                y: viewbox.y + evt.clientY - this.canvasy
            };
        this.setZoom(this.zoom * (1 + delta * 0.1), basePoint);
        evt.stopPropagation();
        evt.preventDefault();

        return false;
    };

    Paper.prototype.setZoom = function(zoom, basePoint) {

        var viewbox = this.getViewBox();
        if (!basePoint) {
            basePoint = {
                x: viewbox.x + viewbox.w / 2,
                y: viewbox.y + viewbox.h / 2
            };
        }
        viewbox.x += (basePoint.x - viewbox.x) * (1 / this.zoom - 1 / zoom);
        viewbox.y += (basePoint.y - viewbox.y) * (1 / this.zoom - 1 / zoom);
        viewbox.w = this.graph.rPaper.width / zoom;
        viewbox.h = this.graph.rPaper.height / zoom;

        this.zoom = zoom;

        this.setViewBox(viewbox.x, viewbox.y, viewbox.w, viewbox.h);
    };

    Paper.prototype.mousedownfn = function(e) {
        var evt = RDom.getEvent(e),
            viewbox = this.getViewBox();
        RDom.clearSelection();
        if (e.which != 1) {
            return;
        }
        if (evt.target.parentNode == this.graph.dom) {
            this.canvasdragging = {
                x: evt.clientX,
                y: evt.clientY,
                timestamp: (new Date()).getTime()
            };
            // this.graph.dom.style.cursor = 'move';
        }
    };

    Paper.prototype.mousemovefn = function(e) {
        var evt = RDom.getEvent(e),
            viewbox = this.getViewBox(),
            now = (new Date()).getTime();

        RDom.clearSelection();
        if (this.canvasdragging && now - this.canvasdragging.timestamp > 30) {
            var x = (this.canvasdragging.x - evt.clientX) / this.zoom,
                y = (this.canvasdragging.y - evt.clientY) / this.zoom;
            this.canvasdragging = {
                x: evt.clientX,
                y: evt.clientY
            };
            this.setViewBox(viewbox.x + x, viewbox.y + y, viewbox.w, viewbox.h);
            this.canvasdragging.timestamp = now;
        }
    };

    Paper.prototype.mouseupfn = function(e) {
        var evt = RDom.getEvent(e);
        RDom.clearSelection();
        if (this.canvasdragging) {
            this.canvasdragging = false;
            // this.graph.dom.style.cursor = 'auto';
        }
    };

    Paper.prototype.autoFit = function(coord) {

        var centerPos = {
            x: (coord.minx + coord.maxx) * 0.5,
            y: (coord.miny + coord.maxy) * 0.5
        };
        var xZoom = this.graph.width / (coord.maxx - coord.minx);
        var yZoom = this.graph.height / (coord.maxy - coord.miny);
        var zoom = xZoom < yZoom ? xZoom : yZoom;
        //为了留出边距
        // zoom = zoom * this.options.zoomprop;
        // if (this.options.maxzoom) {
        //     if (zoom > this.options.maxzoom) {
        //         zoom = this.options.maxzoom;
        //     }
        // }
        this.zoom = zoom;
        this.setViewBox(
            centerPos.x - this.graph.width / this.zoom / 2,
            centerPos.y - this.graph.height / this.zoom / 2,
            this.graph.width / this.zoom,
            this.graph.height / this.zoom);

    };
    Paper.prototype.center = function(centerPos) {
        var viewBox = this.getViewBox();
        viewBox.x = centerPos.x - (this.graph.width / this.zoom) / 2;
        viewBox.y = centerPos.y - (this.graph.height / this.zoom) / 2;
        this.setViewBox(viewBox.x, viewBox.y, this.graph.width / this.zoom, this.graph.height / this.zoom);
    };
    return Paper;
});
