# RGraph
RGraph 是基于 raphael 的拓扑插件，提供拓扑基本功能：加载中提示、放大、缩小、拖动画布、浮动信息、增加、删除节点、节点扩展事件（双击、右键）、节点附属文字、增加、删除连线、连线扩展事件（双击、右键）、连线流动效果。

# 获取RGraph
```
git clone https://git.coding.net/marcooo/rgraph.git

npm install // 需要预先安装 nodejs npm
webpack // 需要预先安装 webpack 
```

# 依赖
[raphael](https://github.com/DmitryBaranovskiy/raphael)

# 例子
[例子](http://amaml.qiniudn.com/rgraph/test/index.html)

# 使用说明

引入RGraph
```
<script type="text/javascript" src="../build/rgraph.js"></script>
```

初始化画布
```
var graph = RGraph.init(document.querySelector('#canvas'), {});
```

显示/隐藏加载提示
```
graph.showLoading(); // 显示
graph.hideLoading(); // 隐藏
```

增加节点
```
graph.addNode(new Date().getTime() + parseInt(Math.random() * 1000), { // 第一个参数为节点ID
    type: 'image', // 类型：目前支持 circle/image
    x: 600, // 中心坐标
    y: 100,
    width: 60, // 宽度
    height: 60, // 高度
    src: 'image/marc.png', // 图片路径
    attr: { // 图片属性：Raphael 的 Element 支持的 attr
        // opacity: 0.7
    },
    text: '这是图片', // 描述文字
    textAlign: 'bottom', // 描述文字相对节点位置
    textAttr: { // 描述文字属性 
        'font-size': 14,
        fill: '#999'
    },
    hoverText: '这是图片的浮动信息', // 鼠标hover节点显示信息
    dbclick: function(id, text) { // 双击事件
        console.log(id, text);
    }
});
```

增加连线
```
graph.addLine(n3, n4, { //  n3 n4 参数为节点对象/节点ID
    effect: true, // 是否显示小球走动效果
    hoverText: '线的浮动信息', // 浮动信息
    dbclick: function(id, n1, n2) { // 双击事件
        console.log(id, n1, n2);
    },
    isCurve: true, // 是否为曲线
    text: '线上文字信息', // 线上文字信息
    textAttr: { // 线上文字属性
        'font-size': 14
    }
});
```

自适应画布大小
```
graph.autoFit();
```

以某节点居中
```
graph.centerNode(n4); // 参数为节点对象/节点ID
```

画布大小重置
```
graph.resize();
```
