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
        var form = $('#'+formId);
        _load(data);
        
        function _load(data){
            for(var name in data){
                var val = data[name];
                if (!_checkField(name, val)){
                    if (!_loadBox(name, val)){
                        form.find('input[name="'+name+'"]').val(val);
                        form.find('textarea[name="'+name+'"]').val(val);
                        form.find('select[name="'+name+'"]').val(val);
                    }
                }
            }
        }
        
        /**
         * check the checkbox and radio fields
         */
        function _checkField(name, val){
            var cc = $(target).find('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]');
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
        var form = $('#'+formId);
        var fields = fields || form.find('input','textarea','select');
        var result = {};
        jQuery.each(fields, function(i, ele){
            result[$(ele).attr('name')] = ele.value;
        });
        return result; 
    }
}