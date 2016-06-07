define(function() {

    'use strict';

    var Node = require('./node');
    var Tooltip = require('./tooltip');

    function Line(graph) {

        this.graph = graph; // RGraph Object


    }
    Line.prototype.add = function(n1, n2, option) {
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

        var option = option || {};

        var _attr = option.attr ? option.attr : {
            stroke: '#FF9900',
            'stroke-width': 2
        };

        var _hoverText = option.hoverText;

        var _sPos = new Node(_line.graph).getCenterPos(n1),
            _ePos = new Node(_line.graph).getCenterPos(n2);
        var path = ['M', _sPos.x, _sPos.y, _ePos.x, _ePos.y];
        _line.rLine = _line.graph.rPaper.path(path.join(',')).attr(_attr).toBack();

        if (_hoverText) {
            _line.rLine.mouseover(function() {
                Tooltip.create(_hoverText);
            });
            _line.rLine.mouseout(Tooltip.remove);
            _line.rLine.mousemove(function(e) {
                Tooltip.repos(e);
            });
        }

        _line.n1 = n1;
        _line.n2 = n2;

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

    Line.prototype.rePaint = function(){
        var _line = this;
        var _sPos = new Node(_line.graph).getCenterPos(_line.n1),
            _ePos = new Node(_line.graph).getCenterPos(_line.n2);
        var path = ['M', _sPos.x, _sPos.y, _ePos.x, _ePos.y];
        _line.rLine = _line.rLine.attr('path',path.join(','));
    };

    // TODO HOVER
    // TODO DBCLICK
    // TODO EFFECT

    return Line;
});
