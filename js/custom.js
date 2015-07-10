jQuery(window).load(function() {

    "use strict";

    // Page Preloader
    jQuery('#preloader').delay(350).fadeOut(function() {
        jQuery('body').delay(350).css({
            'overflow': 'visible'
        });
    });

    // Tooltip
    jQuery('.tooltips').tooltip({
        container: 'body'
    });

});
/*
 * 通用的Ajax调用方法
 */
function doAjax (options, callBack) {

    var defaultOptions = {
        type: "GET"
        ,dataType: "json"
        //,data: {}
    }

    callBack = callBack || options.callBack || jQuery.noop();

    options = $.extend(true, defaultOptions, options);

    $.ajax(options)
        .done(function(rep) {
            if (rep.status && rep.status === 500) {
                alert(rep.msg);
                return;
            } else {
                callBack.call(options, rep);
                return;
            }
        })
        .fail(function() {
            alert('加载出错！');
        });
}


/*
 * 表单加载数据和获取数据
 */
FormData = {
    load : function load(formId, data){ // 参考easyui form部分
        var form = $(formId);
        _load(data);
        
        function _load(data){
            for(var name in data){
                var val = data[name];
                if (!_checkField(name, val)){
                    form.find('input[name="'+name+'"]').val(val);
                    form.find('textarea[name="'+name+'"]').val(val);
                    form.find('select[name="'+name+'"]').val(val);
                }
            }
        }
        
        /**
         * check the checkbox and radio fields
         */
        function _checkField(name, val){
            var cc = form.find('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]');
            if (cc.length){
                cc.each(function(){
                    _isChecked($(this).val(), val)
                });
                return true;
            }
            return false;
        }
        function _isChecked(v, val){
            if (v == String(val) || $.inArray(v, $.isArray(val)?val:[val]) >= 0){
                return true;
            } else {
                return false;
            }
        }
    },
    get : function(formId, fields){
        var form = $(formId);
        var fields = fields || form.find('input','textarea','select');
        var result = {};
        jQuery.each(fields, function(i, ele){
            result[$(ele).attr('name')] = ele.value;
        });
        return result; 
    }
}

// 操作提示
var notifyInfo = (function notifyInfo(){
    var defOpts = {
        title       : "提示",
        text        : "没有选择记录！",
        addclass    : "stack-bar-top",
        type        : "warn",
        width       : "300px",
        cornerclass : "",
        buttons: {sticker: false },
        delay       : 2000
    };

    var notifyObj = false;
    
    return function(opts){
        console.info(notifyObj);
        if(notifyObj){
            notifyObj.remove();
            notifyObj = false;
        }
        opts = jQuery.extend({}, defOpts, opts);
        notifyObj = new PNotify(opts);
        notifyObj.remove();
    }
    
}());


// 模板引擎
var TemplateEngine = function(html, options) {
    var re = /{{([^}}]+)?}}/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(this.' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
