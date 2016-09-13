define(function() {

    'use strict';

    var RMath = require('../util/rMath');
    var Node = require('./node');
    var Tooltip = require('./tooltip');
    var LineEffect = require('./lineEffect');

    function Line(graph, n1, n2, option) {

        this.graph = graph; // RGraph Object

        this._add(n1, n2, option);

    }
    Line.prototype._add = function(n1, n2, option) {
        var _line = this;
        if (typeof(n1) == 'string') {
            n1 = _line.graph._nodesMap[n1];
        }
        if (typeof(n2) == 'string') {
            n2 = _line.graph._nodesMap[n2];
        }

        if (!n1 || !n2) {
            console.log('n1 or n2 is null, n1: ' + n1 + '; n2: ' + n2);
            return;
        }

        var key = n1.id + '-' + n2.id;
        if (_line.graph._linesMap[key]) {
            return _line.graph._linesMap[key];
        }

        _line.id = key;

        var option = option || {};
        _line.data = option.data;

        var _attr = option.attr ? option.attr : {
            stroke: '#FF9900',
            'stroke-width': 2
        };
        var _isDashed = option.isDashed;
        if (_isDashed) {
            _attr['stroke-dasharray'] = ['-'];
        }

        var _sPos = n1.getCenterPos(),
            _ePos = n2.getCenterPos();

        var _isCurve = option.isCurve;
        _line.isCurve = _isCurve;

        if (!_isCurve) {
            var path = ['M', _sPos.x, _sPos.y, _ePos.x, _ePos.y];
            _line.rLine = _line.graph.rPaper.path(path.join(',')).attr(_attr).toBack();

            var _mark = option.mark;
            if (_mark) {
                if (!_mark.type || _mark.type == 'rect') {
                    var cPoint = _line.rLine.getPointAtLength(_line.rLine.getTotalLength() / 2);
                    var width = _mark.width || 30;
                    var height = _mark.height || 10;
                    var markAttr = _mark.attr || {
                        'stroke-width': 0,
                        'stroke-opacity': 0.5,
                        'fill': '#00CC00',
                        'opacity': 0.5
                    };
                    _line.rLineMark = _line.graph.rPaper.rect(cPoint.x - width / 2, cPoint.y - height / 2, width, height).attr(markAttr).attr({
                        transform: 'r' + cPoint.alpha % 180
                    });
                    _line.markWidth = width;
                    _line.markHeight = height;
                } else if (_mark.type == 'image') {
                    var cPoint = _line.rLine.getPointAtLength(_line.rLine.getTotalLength() / 2);
                    var width = _mark.width || 20;
                    var height = _mark.height || 20;
                    var src = _mark.src;

                    _line.rLineMark = _line.graph.rPaper.image(src, cPoint.x - width / 2, cPoint.y - height / 2, width, height).attr({
                        transform: 'r' + cPoint.alpha % 180
                    });
                    _line.markWidth = width;
                    _line.markHeight = height;
                }
            }


        } else {
            var sAPoint = {
                x: _sPos.x + (_ePos.x - _sPos.x) * 0.2 + 0.12 * (_ePos.y - _sPos.y),
                y: _sPos.y + (_ePos.y - _sPos.y) * 0.2 - 0.12 * (_ePos.x - _sPos.x)
            };
            var eAPoint = {
                x: _ePos.x - (_ePos.x - _sPos.x) * 0.2 + 0.12 * (_ePos.y - _sPos.y),
                y: _ePos.y - (_ePos.y - _sPos.y) * 0.2 - 0.12 * (_ePos.x - _sPos.x)
            };
            var path = ['M', _sPos.x, _sPos.y, 'C', sAPoint.x, sAPoint.y, eAPoint.x, eAPoint.y, _ePos.x, _ePos.y];
            _line.rLine = _line.graph.rPaper.path(path.join(',')).attr(_attr).toBack();
        }


        var _text = option.text;
        var _textAttr = option.textAttr ? option.textAttr : {};
        if (_text) {

            var cPoint = _line.rLine.getPointAtLength(_line.rLine.getTotalLength() / 2);
            _line.rText = _line.graph.rPaper.text(cPoint.x, cPoint.y, _text).attr(_textAttr);
            var mathAngle = RMath.transToMathAngle(cPoint.alpha % 180);
            _line.rText.attr({
                x: cPoint.x - Math.abs(Math.sin(mathAngle) * 10),
                y: cPoint.y - Math.abs(Math.cos(mathAngle) * 10),
                transform: 'r' + (cPoint.alpha % 180 > 90 ? cPoint.alpha % 180 - 180 : cPoint.alpha % 180)
            });
        }

        var _hoverText = option.hoverText;
        var _hoverHighlight = _line.graph.option.hoverHighlight;

        _line.rLine.mouseover(function() {
            if (_hoverText) {
                Tooltip.create(_hoverText);
            }
            var hoverStrokeWidth = _line.rLine.attr('stroke-width')
            _line.hoverStrokeWidth = hoverStrokeWidth;
            _line.rLine.attr('stroke-width', hoverStrokeWidth * 3);

            if (_hoverHighlight) {
                for (var i = 0, len = _line.graph.getNodes().length; i < len; i++) {
                    _line.graph.getNodes()[i].weaken();
                }
                for (var i = 0, len = _line.graph.getLines().length; i < len; i++) {
                    _line.graph.getLines()[i].weaken();
                }
                _line.restore();
                _line.n1.restore();
                _line.n2.restore();
            }
        });
        _line.rLine.mouseout(function() {
            if (_hoverText) {
                Tooltip.remove();
            }
            _line.rLine.attr('stroke-width', _line.hoverStrokeWidth);

            if (_hoverHighlight) {
                for (var i = 0, len = _line.graph.getNodes().length; i < len; i++) {
                    _line.graph.getNodes()[i].restore();
                }
                for (var i = 0, len = _line.graph.getLines().length; i < len; i++) {
                    _line.graph.getLines()[i].restore();
                }
            }
        });
        _line.rLine.mousemove(function(e) {
            if (_hoverText) {
                Tooltip.repos(e);
            }
        });
        if (_line.rLineMark) {
            _line.rLineMark.mouseover(function() {
                if (_hoverText) {
                    Tooltip.create(_hoverText);
                }
                var hoverStrokeWidth = _line.rLine.attr('stroke-width')
                _line.hoverStrokeWidth = hoverStrokeWidth;
                _line.rLine.attr('stroke-width', hoverStrokeWidth * 3);

                if (_hoverHighlight) {
                    for (var i = 0, len = _line.graph.getNodes().length; i < len; i++) {
                        _line.graph.getNodes()[i].weaken();
                    }
                    for (var i = 0, len = _line.graph.getLines().length; i < len; i++) {
                        _line.graph.getLines()[i].weaken();
                    }
                    _line.restore();
                    _line.n1.restore();
                    _line.n2.restore();
                }
            });
            _line.rLineMark.mouseout(function() {
                Tooltip.remove();

                _line.rLine.attr('stroke-width', _line.hoverStrokeWidth);

                if (_hoverHighlight) {
                    for (var i = 0, len = _line.graph.getNodes().length; i < len; i++) {
                        _line.graph.getNodes()[i].restore();
                    }
                    for (var i = 0, len = _line.graph.getLines().length; i < len; i++) {
                        _line.graph.getLines()[i].restore();
                    }
                }
            });
            _line.rLineMark.mousemove(function(e) {
                if (_hoverText) {
                    Tooltip.repos(e);
                }
            });
        }

        var _dbclick = option.dbclick;
        if ('function' == typeof _dbclick) {
            _line.rLine.attr('cursor', 'pointer');
            _line.rLine.dblclick(function() {
                _dbclick(_line.id, {
                    id: n1.id,
                    text: n1.text
                }, {
                    id: n2.id,
                    text: n2.text
                });
            });
            if (_line.rLineMark) {
                _line.rLineMark.attr('cursor', 'pointer');
                _line.rLineMark.dblclick(function() {
                    _dbclick(_line.id, {
                        id: n1.id,
                        text: n1.text
                    }, {
                        id: n2.id,
                        text: n2.text
                    });
                });
            }
        }

        _line.n1 = n1;
        _line.n2 = n2;

        if (option.effect) {
            _line.lineEffect = new LineEffect(_line.graph, {
                sp: _sPos,
                ep: _ePos
            });
        }

        n1.lines.push(_line);
        if (n1 !== n2) {
            n2.lines.push(_line);
        }

        _line.graph.lines.push(_line);
        _line.graph._linesMap[key] = _line;

        return _line;
    };
    // Line.prototype.remove = function(n1, n2) {

    // };

    Line.prototype.rePaint = function() {
        var _line = this;
        var _sPos = _line.n1.getCenterPos(),
            _ePos = _line.n2.getCenterPos();
        var path;
        if (!_line.isCurve) {
            path = ['M', _sPos.x, _sPos.y, _ePos.x, _ePos.y];
        } else {
            var sAPoint = {
                x: _sPos.x + (_ePos.x - _sPos.x) * 0.2 + 0.12 * (_ePos.y - _sPos.y),
                y: _sPos.y + (_ePos.y - _sPos.y) * 0.2 - 0.12 * (_ePos.x - _sPos.x)
            };
            var eAPoint = {
                x: _ePos.x - (_ePos.x - _sPos.x) * 0.2 + 0.12 * (_ePos.y - _sPos.y),
                y: _ePos.y - (_ePos.y - _sPos.y) * 0.2 - 0.12 * (_ePos.x - _sPos.x)
            };
            var path = ['M', _sPos.x, _sPos.y, 'C', sAPoint.x, sAPoint.y, eAPoint.x, eAPoint.y, _ePos.x, _ePos.y];
        }
        _line.rLine.attr('path', path.join(','));
        if (_line.rText) {
            var cPoint = _line.rLine.getPointAtLength(_line.rLine.getTotalLength() / 2);
            var mathAngle = RMath.transToMathAngle(cPoint.alpha % 180);
            _line.rText.attr({
                x: cPoint.x - Math.abs(Math.sin(mathAngle) * 10),
                y: cPoint.y - Math.abs(Math.cos(mathAngle) * 10),
                transform: 'r' + (cPoint.alpha % 180 > 90 ? cPoint.alpha % 180 - 180 : cPoint.alpha % 180)
            });
        }
        if (_line.rLineMark) {
            var cPoint = _line.rLine.getPointAtLength(_line.rLine.getTotalLength() / 2);
            var markWidth = _line.markWidth,
                markHeight = _line.markHeight;
            _line.rLineMark.attr({
                x: cPoint.x - markWidth / 2,
                y: cPoint.y - markHeight / 2,
                transform: 'r' + cPoint.alpha % 180
            });
        }
    };

    Line.prototype.resetEffect = function() {
        var _line = this;
        if (_line.lineEffect) {
            var _sPos = _line.n1.getCenterPos(),
                _ePos = _line.n2.getCenterPos();
            _line.lineEffect.setOption({
                sp: _sPos,
                ep: _ePos
            });
        }
    };

    Line.prototype.weaken = function() {
        var _line = this;
        var oldOpacity = _line.rLine.attr('opacity');
        _line.rLine.oldOpacity = oldOpacity;
        _line.rLine.attr('opacity', oldOpacity * 0.1);

        if (_line.rText) {
            oldOpacity = _line.rText.attr('opacity');
            _line.rText.oldOpacity = oldOpacity;
            _line.rText.attr('opacity', oldOpacity * 0.1);
        }

        if (_line.rLineMark) {
            oldOpacity = _line.rLineMark.attr('opacity');
            _line.rLineMark.oldOpacity = oldOpacity;
            _line.rLineMark.attr('opacity', oldOpacity * 0.1);
        }
    };
    Line.prototype.restore = function() {
        var _line = this;
        _line.rLine.attr('opacity', _line.rLine.oldOpacity);

        if (_line.rText) {
            _line.rText.attr('opacity', _line.rText.oldOpacity);
        }
        if (_line.rLineMark) {
            _line.rLineMark.attr('opacity', _line.rLineMark.oldOpacity);
        }
    };

    return Line;
});
