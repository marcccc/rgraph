define(function() {

    'use strict';

    function create(id, name, menus) {

        remove();

        var rightMenu = document.createElement('ul');
        rightMenu.className = 'rgraph-rightmenu';
        var styles = ['position:absolute', 'left: 0', 'top: 0', 'margin:0', 'padding:0', 'border-radius: 3px', 'zIndex: 99', 'background:#e0e0e0', 'border:1px solid #ddd', 'list-style:none'];
        rightMenu.setAttribute('style', styles.join(';'));

        var liStyles = ['border-left:1px solid #fff', 'font-size:12px', 'color:#333', 'margin:3px 3px 3px 15px', 'padding:6px 20px 6px 6px', 'font-weight:bold', 'cursor:pointer'];
        for (var i = 0, len = menus.length; i < len; i++) {
            var li = document.createElement('li');
            li.setAttribute('style', liStyles.join(';'));
            li.setAttribute('onmouseover', 'this.style.background="#146AFF";this.style.color="#fff"');
            li.setAttribute('onmouseout', 'this.style.background="none";this.style.color="#333"');
            li.innerHTML = menus[i].name;
            if ('function' == typeof menus[i].func) {
                (function(callback){
                    li.onclick = function(){
                        callback(id, name);   
                    };
                })(menus[i].func);
            }
            rightMenu.appendChild(li);
        }

        document.body.appendChild(rightMenu);
    }

    function repos(e) {

        var rightMenu = document.querySelector('.rgraph-rightmenu');
        var fx = e.x;
        var fy = e.y;
        if (e.pageX && e.pageY) {
            fx = e.pageX;
            fy = e.pageY;
        } else {
            fx = e.clientX + document.body.scrollLeft - document.body.clientLeft;
            fy = e.clientY + document.body.scrollTop - document.body.clientTop;
        }

        rightMenu.style.display = 'block';
        rightMenu.style.left = fx + 2 + 'px';
        rightMenu.style.top = fy + 'px';

    }

    function remove() {
        var rightMenu = document.querySelector('.rgraph-rightmenu');
        if (rightMenu) {
            document.body.removeChild(rightMenu);
        }
    }

    return {
        create: create,
        repos: repos,
        remove: remove
    };
});
