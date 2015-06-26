
jQuery(document).ready(function() {

	doAjax({
		url : "_temp/supplierTypeData.json"
	}, function(datas) {
		alert(datas);
	});

});