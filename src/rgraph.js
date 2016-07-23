define(function(require) {

    'use strict';

    var Raphael = require('raphael');
    var Loading = require('./component/loading');
    var Paper = require('./component/paper');
    var Node = require('./component/node');
    var Line = require('./component/line');
    var Tooltip = require('./component/tooltip');

    var _idBase = new Date() - 0;
    var _instances = {};
    var DOM_ATTRIBUTE_KEY = '_rgraph_instance_';

    var self = {};
    self.version = '1.0.0';
    self.dependencies = {
        raphael: '2.2.0'
    };

    self.init = function(dom, option) {

        dom = dom instanceof Array ? dom[0] : dom;
        var key = dom.getAttribute(DOM_ATTRIBUTE_KEY);
        if (!key) {
            key = _idBase++;
            dom.setAttribute(DOM_ATTRIBUTE_KEY, key);
        }

        if (_instances[key]) {
            // 同一个dom上多次init，自动释放已有实例
            _instances[key].dispose();
        }
        _instances[key] = new RGraph(dom, option);
        _instances[key].id = key;

        return _instances[key];
    };

    function RGraph(dom, option) {

        dom.innerHTML = '';

        this.dom = dom;
        this.width = this.dom.clientWidth;
        this.height = this.dom.clientHeight;

        this.option = {};
        for (var key in option) {
            this.option[key] = option[key]
        }
        if (option) {
            for (var key in option) {
                this.option[key] = option[key];
            }
        }

        this.nodes = [];
        this.lines = [];

        this._nodesMap = {};
        this._linesMap = {};

        this._animateNodes = [];

        this._init();


    }

    RGraph.prototype._init = function() {
        if (this.width === 0 || this.height === 0) {
            console.error('Dom’s width & height should be ready before init.');
        }
        this.rPaper = Raphael(this.dom, this.width, this.height);

        var loading = new Loading(this.dom);
        this.showLoading = loading.showLoading;
        this.hideLoading = loading.hideLoading;

        this._paper = new Paper(this, {});
    };

    RGraph.prototype.setSize = function(width, height) {
        this.width = width;
        this.height = height;
        this.rPaper.setSize(width, height);
        this.autoFit();
    };

    RGraph.prototype.resize = function() {
        var width = this.dom.clientWidth;
        var height = this.dom.clientHeight;
        this.setSize(width, height);
    };
    RGraph.prototype.autoFit = function() {
        var coord = {
            minx: Number.MAX_VALUE,
            miny: Number.MAX_VALUE,
            maxx: Number.MIN_VALUE,
            maxy: Number.MIN_VALUE
        };
        for (var i = 0, len = this.nodes.length; i < len; i++) {
            var bBox = this.nodes[i].rNode.getBBox();
            coord.minx = coord.minx < bBox.x ? coord.minx : bBox.x;
            coord.miny = coord.miny < bBox.y ? coord.miny : bBox.y;
            coord.maxx = coord.maxx > bBox.x2 ? coord.maxx : bBox.x2;
            coord.maxy = coord.maxy > bBox.y2 ? coord.maxy : bBox.y2;
        }

        if (0 != this.nodes.length) {
            this._paper.autoFit(coord);
        }
    };
    RGraph.prototype.clear = function() {
        // TODO
    };
    RGraph.prototype.dispose = function() {
        this.dom.innerHTML = '';
        this.nodes = [];
        this.lines = [];

        this._nodesMap = {};
        this._linesMap = {};

        this._animateNodes = [];

        // 清理浮动
        Tooltip.remove();
    }

    RGraph.prototype.addNode = function(id, option) {
        return new Node(this).add(id, option);
    };
    RGraph.prototype.getNodeById = function(id) {
        return this._nodesMap[id];
    };
    // RGraph.prototype.removeNode = function(node) {
    //     new Node(this).remove(node);
    // };
    RGraph.prototype.getNodes = function(){
        return this.nodes;
    };
    RGraph.prototype.centerNode = function(node) {
        if (typeof(node) == 'string') {
            node = this._nodesMap[node];
        }
        if (!node) {
            return;
        }
        this._paper.center(new Node(this).getCenterPos(node));
    };
    RGraph.prototype.centerPos = function(pos) {
        this._paper.center(pos);
    }
    RGraph.prototype.addLine = function(n1, n2, option) {
        return new Line(this).add(n1, n2, option);
    };


    return self;
});
