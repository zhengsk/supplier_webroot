
jQuery(window).load(function() {

   "use strict";

   // Page Preloader
   jQuery('#preloader').delay(350).fadeOut(function(){
      jQuery('body').delay(350).css({'overflow':'visible'});
   });
});