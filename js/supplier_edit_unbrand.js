
jQuery(document).ready(function() {

	var SupplierUnbrand = new (function(){

		// 供方详细信息
		this.supplierDatas = {
			contacts : [{
				area : '厦门',
				person : '吴慧慧',
				phone : '0592-1234567',
				Email : 'wuhuihui@qq.com'
			},{
				area : '福州',
				person : '吴是慧慧',
				phone : '05952-1234567',
				Email : 'wuhu订单ihui@qq.com'
			}]
		};

		// 供方详细信息
		this.labelDatas = {
			contacts : [{
				label : '地区',
				field : 'area'
			},{
				label : '联系人',
				field : 'person'
			},{
				label : '电话',
				field : 'phone'
			},{
				label : 'Email',
				field : 'Email'
			}]
		};

		// 显示数据信息
		this._panelShowDatas = function (labels, datas, panelId, callBack) {
			var self = this;
			var result = [], element;
			$.each(datas, function(m, data){
				for(var i = 0, j = labels.length; i < j; i++){
					var label = labels[i];
					element = self._createLabelElement(label.label, data[label.field]);
					result.push(element);
				}

				var panelBody = $('<div class="panel-body"></div>');
				var row = $('<div class="row form-horizontal"></div>');
				row.html(result.join('')).appendTo(panelBody);
				
				result.length = 0;
				data.element = panelBody; 			// data 引用到元素上
				panelBody.data("rowDatas", data); 	// 绑定数据到元素上:rowDatas
				$('#'+panelId).append(panelBody);
			});

			(callBack || jQuery.noop).call(this); //回调
		};

		// 创建一个名值元素
		this._createLabelElement = function(label, value){

			return '<div class = "col-sm-6"> <div class = "form-group"> <label class = "col-sm-4 control-label" >'+ label +'：</label> <div class="col-sm-8"> <input type="text" value="'+ value +'" class="form-control form-only-show" disabled /> </div> </div> </div>'
			/*=========
				<div class="col-sm-6">
				    <div class="form-group">
				        <label class="col-sm-4 control-label">
				            地区：
				        </label>
				        <div class="col-sm-8">
				            <input type="text" name="name" value="厦门" class="form-control form-only-show" disabled>
				        </div>
				    </div>
				</div>
			=========*/
		}
		


		// 联系方式处理
		this.contacts = {
			supplier : this,

			// 创建联系方式
			show : function(){
				var supplier = this.supplier;
				supplier._panelShowDatas(
					supplier.labelDatas.contacts, 
					supplier.supplierDatas.contacts, 
					"panelContact",
					function(){
						console.info(supplier);
						console.info('added contact!');
					}
				);
			}

			// 添加联系方式
			add : function(data){
				var supplier = this.supplier;
				supplier.contacts.push(data);
			}

			// 删除联系方式
			remove : function(data){
				var supplier = this.supplier;
				jQuery.each(supplier.contacts, function(i,item){
					if(item === data){
						supplier.contacts.splice(i,1);
						data.element.fadeOut();
						data.element = null;
						return;
					}
				});
			}

			update : function(data){

			}
		}

		// 初始化
		this.init = function(param){

			this.contacts.show(); // 创建联系方式
			

		}
		 
	})();


	/* ===================================== */

	SupplierUnbrand.init({
		supplierTypeDataUrl : "_temp/supplierTypeData.json"
	});

	
});


// 联系方式
;(function(){
    var $modal = $('#ajax-dialog-contact');

    $('#editConcatButton').click(function(event){
        var remoteUrl = $(this).data('modal-url');
        $modal.load(remoteUrl, '', function() {
            $modal.modal({width: 650});
        });
    });

    $('#panelContact').on('click','.panel-body',function(){
    	console.info($(this).data('rowDatas'));
    	if($(this).hasClass('checked')){
    		$(this).removeClass('checked');
    	}else{
    		$(this).addClass('checked').siblings('.panel-body').removeClass('checked');
    	}
    });
    
})();




