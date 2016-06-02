define(function(require) {
    var Raphael = require('raphael');
    // var rConfig = require('./config');
    var rLoading = require('./component/loading');

    var _idBase = new Date() - 0;
    var _instances = {}; 
    var DOM_ATTRIBUTE_KEY = '_rgraph_instance_';

    var self = {};
    self.version = '1.0.0';
    self.dependencies = {
        raphael: '2.2.0'
    };

    self.init = function(dom, option) {
        dom = dom instanceof Array ? dom[0] : dom;
        var key = dom.getAttribute(DOM_ATTRIBUTE_KEY);
        if (!key) {
            key = _idBase++;
            dom.setAttribute(DOM_ATTRIBUTE_KEY, key);
        }

        if (_instances[key]) {
            // 同一个dom上多次init，自动释放已有实例
            _instances[key].dispose();
        }
        _instances[key] = new RGraph(dom,option);
        _instances[key].id = key;

        return _instances[key];
    };

    function RGraph(dom, option) {

        dom.innerHTML = '';

        this.dom = dom;
        this.width = this.dom.clientWidth;
        this.height = this.dom.clientHeight;

        this.option = {};
        for(var key in option){
            this.option[key] = option[key]
        }
        if (option) {
            for (var key in option) {
                this.option[key] = option[key];
            }
        }

        this._init();

        
    }

    RGraph.prototype._init = function(){
        if (this.width === 0 || this.height === 0) {
            console.error('Dom’s width & height should be ready before init.');
        }
        this.paper = Raphael(this.dom, this.width, this.height);

        var _loading = rLoading._init(this.dom);

        this.showLoading = _loading.showLoading;
        this.hideLoading = _loading.hideLoading;

    };

    return self;
});
