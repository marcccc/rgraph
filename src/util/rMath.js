define(function() {

    'use strict';

    function transToNormalAngle(angle) {
        return 180 * angle / Math.PI;
    }
    function transToMathAngle(angle){
        return angle * Math.PI / 180;
    }
    return {
        transToNormalAngle: transToNormalAngle,
        transToMathAngle: transToMathAngle
    };
});
