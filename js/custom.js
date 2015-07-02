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