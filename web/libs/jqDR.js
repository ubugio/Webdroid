(function($) {
    $.fn.jqDrag = function(h,option) {
        var _option = {
            type:"normal",
            width:0,
            height:0,
            onDrag:null,
            onStop:null,
            topLimit:null,
            leftLimit:null,
            rightLimit:0,
            bottomLimit:0,
            defaultOpacity:0.8
        };
        option=$.extend(_option,option);
        return i(this, h, 'd',option)
    };
    $.fn.jqResize = function(h) {
        return i(this, h, 'r')
    };
    $.jqDnR = {
        dnr: {},
        e: 0,
        drag: function(v) {
            var l=0,t=0;
            if (M.k == 'd'){
                if(M.type=="grid"){
                    l=v.pageX - v.pageX%M.width+20;
                    t=v.pageY - v.pageY%M.height;
                }else{
                    l=M.X + v.pageX - M.pX;
                    t= M.Y + v.pageY - M.pY;
                    if(M.leftLimit&&l<M.leftLimit){
                        l=M.leftLimit;
                    }
                    if(M.topLimit&&t<M.topLimit){
                        t=M.topLimit;
                    }
                }
                M.onDrag && M.onDrag(E,l,t);
                E.css({left: l,top: t});
            }else 
            E.css({
                width: Math.max(v.pageX - M.pX + M.W, 0),
                height: Math.max(v.pageY - M.pY + M.H, 0)
            });
            E.css({
                opacity: M.defaultOpacity
            });
        },
        stop: function() {
            M.onStop && M.onStop();
            E.css('opacity', M.o);
            $(document).unbind('mousemove', J.drag).unbind('mouseup', J.stop)
        }
    };
    var J = $.jqDnR,
    M = J.dnr,
    E = J.e,
    i = function(e, h, k,option) {
        return e.each(function() {
            h = (h) ? h : e;
            h.bind('mousedown', {
                e: e,
                k: k
            },
            function(v) {
                var d = v.data,
                p = {};
                E = d.e;
                if (E.css('position') != 'relative') {
                    try {
                        E.position(p)
                    } catch(e) {}
                }
                M = {
                    X: p.left || f('left') || 0,
                    Y: p.top || f('top') || 0,
                    W: f('width') || E[0].scrollWidth || 0,
                    H: f('height') || E[0].scrollHeight || 0,
                    pX: v.pageX,
                    pY: v.pageY,
                    k: d.k,
                    o: E.css('opacity')
                };
                M=$.extend(M,option);
                $(document).mousemove($.jqDnR.drag).mouseup($.jqDnR.stop);
            })
        })
    },
    f = function(k) {
        return parseInt(E.css(k)) || false
    }
})(jQuery);