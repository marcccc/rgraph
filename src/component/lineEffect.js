define(function() {

    'use strict';

    function lineEffect(graph, option) {

        this.graph = graph;
        option = option || {};
        this.sp = option.sp;
        this.ep = option.ep;

        this._init();
    }
    lineEffect.prototype._init = function() {

        this.effectObj = this.graph.rPaper.circle(this.sp.x, this.sp.y,4).attr({
            fill: 'r(0.5, 0.5)#003399-#CCFFFF',
            // 'fill-opacity': 0.8,
            stroke: 'none'
        });

        this.run();

    };
    lineEffect.prototype.run = function() {

        var _lineEffect = this;

        var time = 30 * Math.sqrt((_lineEffect.ep.y - _lineEffect.sp.y) * (_lineEffect.ep.y - _lineEffect.sp.y) + (_lineEffect.ep.x - _lineEffect.sp.x) * (_lineEffect.ep.x - _lineEffect.sp.x));
        _lineEffect.effectObj.attr({
            cx: _lineEffect.sp.x,
            cy: _lineEffect.sp.y
        }).show();

        _lineEffect.effectObj.animate({
            cx: _lineEffect.ep.x,
            cy: _lineEffect.ep.y
        }, time, function() {
            _lineEffect.run();
        });
    };
    lineEffect.prototype.stop = function(){
        var _lineEffect = this;
        _lineEffect.effectObj.stop().hide();
    };
    lineEffect.prototype.setOption = function(option){
        this.sp = option.sp;
        this.ep = option.ep;
    };

    return lineEffect;
});
