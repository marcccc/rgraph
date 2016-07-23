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
        var _sPos = n1.getCenterPos(),
            _ePos = n2.getCenterPos();

        var _isCurve = option.isCurve;
        _line.isCurve = _isCurve;

        if (!_isCurve) {
            var path = ['M', _sPos.x, _sPos.y, _ePos.x, _ePos.y];
            _line.rLine = _line.graph.rPaper.path(path.join(',')).attr(_attr).toBack();
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
            // var textBBox = _line.rText.getBBox();
            // var dist = textBBox.height / 2;
            _line.rText.attr({
                x: cPoint.x - Math.abs(Math.sin(mathAngle) * 10),
                y: cPoint.y - Math.abs(Math.cos(mathAngle) * 10),
                transform: 'r' + (cPoint.alpha % 180 > 90 ? cPoint.alpha % 180 - 180 : cPoint.alpha % 180)
            });
        }

        var _hoverText = option.hoverText;
        if (_hoverText) {
            _line.rLine.mouseover(function() {
                Tooltip.create(_hoverText);
            });
            _line.rLine.mouseout(Tooltip.remove);
            _line.rLine.mousemove(function(e) {
                Tooltip.repos(e);
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
        var _sPos = new Node(_line.graph).getCenterPos(_line.n1),
            _ePos = new Node(_line.graph).getCenterPos(_line.n2);
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
            // var textBBox = _line.rText.getBBox();
            // var dist = textBBox.height / 2;
            _line.rText.attr({
                x: cPoint.x - Math.abs(Math.sin(mathAngle) * 10),
                y: cPoint.y - Math.abs(Math.cos(mathAngle) * 10),
                transform: 'r' + (cPoint.alpha % 180 > 90 ? cPoint.alpha % 180 - 180 : cPoint.alpha % 180)
            });
        }
    };

    Line.prototype.resetEffect = function() {
        var _line = this;
        if (_line.lineEffect) {
            var _sPos = new Node(_line.graph).getCenterPos(_line.n1),
                _ePos = new Node(_line.graph).getCenterPos(_line.n2);
            _line.lineEffect.setOption({
                sp: _sPos,
                ep: _ePos
            });
        }
    };

    return Line;
});
