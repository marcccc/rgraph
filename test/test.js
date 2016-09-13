var graph = RGraph.init(document.querySelector('#canvas'), {
    hoverHighlight: true
});
// console.log(graph);
// graph.autoFit();

// test loading
// graph.showLoading();
// window.setTimeout(function() {
//     graph.hideLoading();
// },3000);


// graph.addNode(new Date() + Math.random()*1000);
var n1 = graph.addNode(new Date().getTime() + parseInt(Math.random() * 1000), {
    x: 200,
    y: 100,
    r: 30,
    attr: {
        fill: '#369',
        // opacity: .6,
        stroke: 'none'
    },
    text: '这是一个圆',
    textAlign: 'right',
    textAttr: {
        'font-size': 14,
        fill: '#369'
            /*,
                    'font-weight': 'bold'*/
    },
    hoverText: '这是圆的浮动信息'

});

var n2 = graph.addNode(new Date().getTime() + parseInt(Math.random() * 1000), {
    x: 200,
    y: 300,
    r: 30,
    attr: {
        fill: '#369',
        // opacity: .6,
        stroke: 'none'
    },
    text: '这是一个圆',
    textAlign: 'rotate',
    angle: 199,
    textAttr: {
        'font-size': 14,
        fill: '#369'
            /*,
                    'font-weight': 'bold'*/
    },
    hoverText: '这是圆的浮动信息'

});

/*graph.addNode(new Date() + + Math.random()*1000, {
    type: 'image',
    text: '这里有个隐形的图片',
    textAlign: 'right'
});*/

var n3 = graph.addNode(new Date().getTime() + parseInt(Math.random() * 1000), {
    type: 'image',
    x: 600,
    y: 100,
    width: 60,
    height: 60,
    src: 'image/marc.png',
    attr: {
        // opacity: 0.7
    },
    text: '这是图片',
    textAlign: 'center',
    textAttr: {
        'font-size': 14,
        fill: '#999'
    },
    hoverText: '这是图片的浮动信息',
    rightMenu: [{
        name: '右键一',
        func: function(id, text) {
            console.log('右键一', id, text);
        }
    }, {
        name: '右键二',
        func: function(id, text) {
            console.log('右键二', id, text);
        }
    }]
});
var n4 = graph.addNode(new Date().getTime() + parseInt(Math.random() * 1000), {
    type: 'image',
    x: 600,
    y: 300,
    width: 60,
    height: 60,
    src: 'image/marc.png',
    attr: {
        // opacity: 0.7
    },
    text: '这是图片',
    textAlign: 'rotate',
    angle: 315,
    textAttr: {
        'font-size': 14,
        fill: '#999'
    },
    hoverText: '这是图片的浮动信息',
    dbclick: function(id, text) {
        console.log(id, text);
    },
    data: {
        test: 111
    },
    extends: {
        type: 'image',
        width: 30,
        height: 30,
        x: 600,
        y: 300 - 30,
        src: 'image/extend.png'
    }
});

console.log(n3);
n4.addExtend({
    type: 'image',
    width: 30,
    height: 30,
    x: 600 - 30,
    y: 300,
    src: 'image/extend.png'
});
n3.addExtend([{
    type: 'image',
    width: 30,
    height: 30,
    x: 600,
    y: 100 - 30,
    src: 'image/extend.png'
}, {
    type: 'image',
    width: 30,
    height: 30,
    x: 600 - 30,
    y: 100,
    src: 'image/extend.png'
}]);
n3.clearExtend();
graph.addLine(n1, n2, {
    text: 'n1-n2连线',
    // isCurve: true,
    mark: {
        type: 'image',
        width: 20,
        height: 20,
        src: 'image/quest.svg'
    }
});
graph.addLine(n1, n3, {
    text: 'n1-n3连线',
    isCurve: true
});
graph.addLine(n1, n4, {
    // text: 'n1-n4连线',
    // isCurve: true,
    mark: {
        type: 'image',
        width: 30,
        height: 15,
        src: 'image/drect.svg'
    }
});
graph.addLine(n2, n3, {
    text: 'n2-n3连线',
    textAttr: {
        'font-size': 24,
        fill: 'red'
    },
    isCurve: true
});
graph.addLine(n2, n4, {
    // isCurve: true,
    isDashed: true,
    mark: {
        type: 'image',
        width: 20,
        height: 20,
        src: 'image/quest.svg'
    }
});
graph.addLine(n3, n4, {
    effect: true,
    hoverText: '线的浮动信息',
    mark: {
        width: 30,
        height: 10,
        attr: {
            'stroke-width': 0,
            'stroke-opacity': 0.5,
            'fill': '#00CC00',
            'opacity': 0.5
        }
    },
    dbclick: function(id, n1, n2) {
        console.log(id, n1, n2);
    },
    isDashed: true
});

// graph.autoFit();

graph.centerNode(n1);


var resizeTimeout = 0;
var timeStamp = new Date() - 0;
window.onresize = function() {
    var now = new Date() - 0;
    if (now - timeStamp > 500) {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(function() {
            graph.resize();
        }, 500);
        timeStamp = now;
    }
};
