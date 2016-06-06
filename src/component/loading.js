define(function() {

    'use strict';

    function _getLoading(width, height) {

        var loadingHtml = new Array();
        loadingHtml.push("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 232 64\" width=\"232\" height=\"64\" fill=\"#fff\">");
        loadingHtml.push("<circle transform=\"translate(90 0)\" cx=\"0\" cy=\"32\" r=\"0\"> ");
        loadingHtml.push("<animate attributeName=\"r\" values=\"0; 8; 0; 0\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0\"");
        loadingHtml.push("keytimes=\"0;0.2;0.7;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\" />");
        loadingHtml.push("</circle>");
        loadingHtml.push("<circle transform=\"translate(116 0)\" cx=\"0\" cy=\"32\" r=\"0\"> ");
        loadingHtml.push("<animate attributeName=\"r\" values=\"0; 8; 0; 0\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.3\"");
        loadingHtml.push("keytimes=\"0;0.2;0.7;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\" />");
        loadingHtml.push("</circle>");
        loadingHtml.push("<circle transform=\"translate(142 0)\" cx=\"0\" cy=\"32\" r=\"0\"> ");
        loadingHtml.push("<animate attributeName=\"r\" values=\"0; 8; 0; 0\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.6\"");
        loadingHtml.push("keytimes=\"0;0.2;0.7;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8\" calcMode=\"spline\" />");
        loadingHtml.push("</circle>");
        loadingHtml.push("</svg>");

        var fragment = document.createDocumentFragment();
        var loadingElement = document.createElement("div");
        loadingElement.className = "rgraph-loading";
        loadingElement.innerHTML = loadingHtml.join("");

        var styles = ["position:absolute",
            "width:" + width + "px",
            "height:" + height + "px",
            "padding:0",
            "top:0",
            "left:0",
            "zIndex:9999",
            "background:rgba(0,0,0,0.6)",
            "text-align:center",
            "line-height:" + height + "px"
        ];

        loadingElement.setAttribute("style", styles.join(";"));

        fragment.appendChild(loadingElement);
        return fragment;
    };

    function Loading(dom) {

        this.showLoading = function() {
            var _loading = dom.querySelector(".rgraph-loading");
            if (_loading) {
                dom.removeChild(loading);
            }
            var width = dom.clientWidth;
            var height = dom.clientHeight;
            dom.appendChild(_getLoading(width, height));
        };
        this.hideLoading = function() {
            var _loading = dom.querySelector(".rgraph-loading");
            if (_loading) {
                dom.removeChild(_loading);
            }
        };
    }
    return Loading;
});
