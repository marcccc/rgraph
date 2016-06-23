define(function() {

    'use strict';

    var RMath = require('../util/rMath');
    var Tooltip = require('./tooltip');

    var padding = 0; // 文字与图形间的间距

    function Node(graph) {

        this.graph = graph; // RGraph Object

        this.lines = [];
    }

    Node.prototype.add = function(id, option) {

        if (this.graph._nodesMap[id]) {
            return this.graph._nodesMap[id];
        }

        this.id = id ? id : new Date() - 0;

        var _node = this;

        var option = option || {};

        var _type = option.type ? option.type : 'circle';
        var _x = option.x ? option.x : 0;
        var _y = option.y ? option.y : 0;
        var _attr = option.attr ? option.attr : {};
        var _r = option.r ? option.r : 10;
        var _src = option.src;
        var _width = option.width ? option.width : 60;
        var _height = option.height ? option.height : 60;

        var _text = option.text;
        this.text = _text;
        var _textAttr = option.textAttr ? option.textAttr : {};
        var _textAlign = option.textAlign ? option.textAlign : 'bottom';

        var _hoverText = option.hoverText;

        var _showCircle = option.showCircle || false;
        var _circleAttr = option.circleAttr ? option.circleAttr : {
            stroke: '#FFFF00',
            'storke-width': 5,
            'storke-dasharray': ['.']
        };

        var _dbclick = option.dbclick;

        switch (_type) {

            case 'circle':
                _node.rNode = _node.graph.rPaper.circle(_x, _y, _r).attr(_attr);
                if (_text) {
                    _node.rText = _node.graph.rPaper.text(_x, _y, _text).attr(_textAttr);
                    var textBBox = _node.rText.getBBox();
                    if ('bottom' == _textAlign) {
                        _node.rText.attr({
                            y: _y + _r + padding + textBBox.height / 2
                        });
                    } else if ('top' == _textAlign) {
                        _node.rText.attr({
                            y: _y - _r - padding - textBBox.height / 2
                        });
                    } else if ('left' == _textAlign) {
                        _node.rText.attr({
                            x: _x - _r - padding - textBBox.width / 2
                        });
                    } else if ('right' == _textAlign) {
                        _node.rText.attr({
                            x: _x + _r + padding + textBBox.width / 2
                        });
                    } else if ('center' == _textAlign) {

                    } else if ('rotate' == _textAlign) {
                        var _angle = option.angle ? option.angle : 0;
                        var mathAngle = RMath.transToMathAngle(_angle);
                        var lr = _r + textBBox.width / 2;
                        _angle = _angle > 90 && _angle < 270 ? _angle + 180 : _angle;
                        _node.rText.attr({
                            x: _x + Math.cos(mathAngle) * lr,
                            y: _y + Math.sin(mathAngle) * lr
                        }).rotate(_angle);
                    }

                }
                break;
            case 'image':
                _node.rNode = _node.graph.rPaper.image(_src, _x - _width / 2, _y - _height / 2, _width, _height).attr(_attr);
                if (_text) {
                    _node.rText = _node.graph.rPaper.text(_x, _y, _text).attr(_textAttr);
                    var textBBox = _node.rText.getBBox();
                    if ('bottom' == _textAlign) {
                        _node.rText.attr({
                            y: _y + _height / 2 + padding + textBBox.height / 2
                        });
                    } else if ('top' == _textAlign) {
                        _node.rText.attr({
                            y: _y - _height / 2 - padding - textBBox.height / 2
                        });
                    } else if ('left' == _textAlign) {
                        _node.rText.attr({
                            x: _x - _width / 2 - padding - textBBox.width / 2
                        });
                    } else if ('right' == _textAlign) {
                        _node.rText.attr({
                            x: _x + _width / 2 + padding + textBBox.width / 2
                        });
                    } else if ('center' == _textAlign) {

                    } else if ('rotate' == _textAlign) {
                        var _angle = option.angle ? option.angle : 0;
                        var mathAngle = RMath.transToMathAngle(_angle);
                        var lr = Math.sqrt(_width * _width / 4 + _height * _height / 4) + textBBox.width / 2;
                        _angle = _angle > 90 && _angle < 270 ? _angle + 180 : _angle;
                        _node.rText.attr({
                            x: _x + Math.cos(mathAngle) * lr,
                            y: _y + Math.sin(mathAngle) * lr
                        }).rotate(_angle);
                    }
                }
                break;
        }

        if (_hoverText) {
            _node.rNode.mouseover(function() {
                Tooltip.create(_hoverText);
            });
            _node.rNode.mouseout(Tooltip.remove);
            _node.rNode.mousemove(function(e) {
                Tooltip.repos(e);
            });
            if (_node.rText) {
                _node.rText.mouseover(function() {
                    Tooltip.create(_hoverText);
                });
                _node.rText.mouseout(Tooltip.remove);
                _node.rText.mousemove(function(e) {
                    Tooltip.repos(e);
                });
            }
        }

        // TODO HOVER
        // TODO DBCLICK
        if ('function' == typeof _dbclick) {
            _node.rNode.attr('cursor', 'pointer');
            _node.rNode.dblclick(function() {
                _dbclick(_node.id, _text);
            });
        }


        // DRAG
        _node.rNode.drag(function(dx, dy, x, y, event) {
            _node.rNode.transform(['t', _node._tx + dx / _node._zoom, _node._ty + dy / _node._zoom].join(','));
            if (_node.rText) {
                _node.rText.transform(['t', _node._tx + dx / _node._zoom, _node._ty + dy / _node._zoom, 'r', _node._textDeg].join(','));
            }

            for (var i = 0, len = _node.lines.length; i < len; i++) {
                _node.lines[i].rePaint();
            }

        }, function(x, y, event) {
            _node._zoom = _node.graph._paper.zoom;
            _node._tx = _node.rNode._.dx;
            _node._ty = _node.rNode._.dy;
            _node.rNode.toFront();

            if (_node.rText) {
                _node._textDeg = _node.rText._.deg;
            }

            for (var i = 0, len = _node.lines.length; i < len; i++) {
                if (_node.lines[i].lineEffect) {
                    _node.lines[i].lineEffect.stop();
                }
            }
        }, function(event) {
            for (var i = 0, len = _node.lines.length; i < len; i++) {
                _node.lines[i].resetEffect();
                if (_node.lines[i].lineEffect) {
                    _node.lines[i].lineEffect.run();
                }
            }
        });

        _node.graph.nodes.push(_node);
        _node.graph._nodesMap[id] = _node;

        return _node;
    };

    Node.prototype.getCenterPos = function(node) {
        var bbox = node.rNode.getBBox();
        return {
            x: (bbox.x + bbox.x2) / 2,
            y: (bbox.y + bbox.y2) / 2
        };
    }
    return Node;
});
