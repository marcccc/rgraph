var graph = RGraph.init(document.querySelector('#canvas'), {});
console.log(graph);

graph.showLoading();
window.setTimeout(function() {
    graph.hideLoading();
},3000);
