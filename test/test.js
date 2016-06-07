var graph = RGraph.init(document.querySelector('#canvas'), {});
// console.log(graph);
// graph.autoFit();
/*
// test loading
graph.showLoading();
window.setTimeout(function() {
    graph.hideLoading();
},3000);
*/

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
    textAlign: 'bottom',
    textAttr: {
        'font-size': 14,
        fill: '#999'
    },
    hoverText: '这是图片的浮动信息'
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
    }
});

graph.addLine(n1, n2);
graph.addLine(n1, n3);
graph.addLine(n1, n4);
graph.addLine(n2, n3);
graph.addLine(n2, n4);
graph.addLine(n3, n4, {
    effect: true,
    hoverText: '线的浮动信息',
    dbclick: function(id, n1, n2) {
        console.log(id, n1, n2);
    }
});

// graph.autoFit();

// graph.centerNode(n4);

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
