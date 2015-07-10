
var SupplierUnbrand = undefined; // 整个供方编辑对象

jQuery(document).ready(function() {

	SupplierUnbrand = new (function(){

		// 供方详细信息
		this.supplierDatas = {
			contacts : [
				{
					area : '厦门',
					person : '吴慧慧',
					phone : '0592-1234567',
					Email : 'wuhuihui@qq.com'
				},{
					area : '福州',
					person : '吴是慧慧',
					phone : '05952-1234567',
					Email : 'wuhu订单ihui@qq.com'
				}
			]
			,agentBrand : [
				{
					name : '上海三菱',
					grade : '一级',
					area : '福建'
				},{
					name : '三洋电器',
					grade : '二级',
					area : '上海'
				}
			]
		};

		// 模板名值对模板
		this.templateString = {
			tpl_4_5_7 : '<div class = "col-sm-4"> <div class = "form-group"> <label class = "col-sm-5 control-label" >{{label}}：</label> <div class="col-sm-7"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
			,tpl_4_6_6 : '<div class = "col-sm-4"> <div class = "form-group"> <label class = "col-sm-6 control-label" >{{label}}：</label> <div class="col-sm-6"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
			,tpl_6_4_8 : '<div class = "col-sm-6"> <div class = "form-group"> <label class = "col-sm-4 control-label" >{{label}}：</label> <div class="col-sm-8"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
			,tpl_12_2_10 : '<div class = "col-sm-12"> <div class = "form-group"> <label class = "col-sm-2 control-label" >{{label}}：</label> <div class="col-sm-10"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
		};

		// 供方详细信息
		this.labelDatas = {
			agentBrand : [
				{
					label : '品牌名称',
					field : 'name',
					tpl : 'tpl_4_5_7'
				},{
					label : '代理等级',
					field : 'grade',
					tpl : 'tpl_4_5_7'
				},{
					label : '经营区域',
					field : 'area',
					tpl : 'tpl_4_5_7'
				}
			]
			,contacts : [
				{
					label : '地区',
					field : 'area',
					tpl	: 'tpl_6_4_8'
				},{
					label : '联系人',
					field : 'person',
					tpl	: 'tpl_6_4_8'
				},{
					label : '电话',
					field : 'phone',
					tpl	: 'tpl_6_4_8'
				},{
					label : 'Email',
					field : 'Email',
					tpl	: 'tpl_6_4_8'
				}
			]
		};


		// 创建一个名值元素
		this._createLabelElement = function(labelItem, value){
			return TemplateEngine(this.templateString[labelItem.tpl], {label: labelItem.label, value: value});
		}

		// 创建一行记录
		this._createRowElement = function(labels, data){
			var self = this;
			var element, result = [];
			for(var i = 0, j = labels.length; i < j; i++){
				var labelItem = labels[i];
				element = self._createLabelElement(labelItem, data[labelItem.field]);
				result.push(element);
			}

			var panelBody = $('<div class="panel-body"></div>');
			var row = $('<div class="row form-horizontal"></div>');
			row.html(result.join('')).appendTo(panelBody);
			
			result.length = 0;
			data.element = panelBody[0]; 		// data 引用到元素上
			panelBody.data("rowDatas", data); 	// 绑定数据到元素上:rowDatas
			return panelBody;
		}

		// 显示一行记录
		this._appendRowElement = function(panelId, rowElement){
			rowElement.hide();
			$(panelId).prepend(rowElement);
			rowElement.slideDown(800);
		}

		// 显示数据信息
		this._panelShowDatas = function (labels, datas, panelId, callBack) {
			var self = this;
			$.each(datas, function(m, data){
				var panelBody = self._createRowElement(labels, data);
				self._appendRowElement(panelId, panelBody);
			});

			(callBack || jQuery.noop).call(this); //回调
		};
		
		// 代理品牌处理
		this.agentBrand = {

			supplier : this,

			panelId : '#panelAgentBrand', // 代理品牌panelId

			// 创建联系方式数据
			show : function(){
				var supplier = this.supplier;
				supplier._panelShowDatas(
					supplier.labelDatas.agentBrand, 
					supplier.supplierDatas.agentBrand, 
					this.panelId,
					function(){
						console.info('Added and show agentBrand!');
					}
				);
				return this;
			},

			// 添加数据
			add : function(data, isAppend){
				var supplier = this.supplier;
				supplier.supplierDatas.agentBrand.push(data);
				isAppend && this._addElement(data); // 添加元素
				return data;
			},

				// 添加元素
				_addElement : function(data){
					var supplier = this.supplier;
					var panelBody = supplier._createRowElement(
						supplier.labelDatas.agentBrand, 
						data
					);
					supplier._appendRowElement("#panelContact", panelBody);
					return data;
				},


			// 删除数据
			remove : function(data, isRemove){
				var self = this;
				var agentBrandDatas = this.supplier.supplierDatas;
				jQuery.each(agentBrandDatas.agentBrand, function(i,item){
					if(item === data){
						agentBrandDatas.agentBrand.splice(i,1);
						isRemove && self._removeElement(data);
						data.element = null;
						return data;
					}
				});
				return false;
			},

				// 删除元素
				_removeElement : function(data){
					$(data.element).fadeTo(400,0).slideUp(400,function(){
						$(this).remove();
					});
				},


			// 更新数据
			update : function(oldData, newData, isUpdate){
				jQuery.extend(oldData, newData);
				isUpdate && this._updateElement(oldData);
				return oldData;
			},

				// 更新元素
				_updateElement : function(newData){
					var oldElement = newData.element;
					var supplier = this.supplier;
					var newElement = supplier._createRowElement(
						supplier.labelDatas.agentBrand, 
						newData
					);
					$(oldElement).replaceWith(newElement);
					return newElement;
				}
		}

		// 联系方式处理
		this.contacts = {

			supplier : this,

			panelId : '#panelContact', // 联系方式panelId

			// 创建联系方式数据
			show : function(){
				var supplier = this.supplier;
				supplier._panelShowDatas(
					supplier.labelDatas.contacts, 
					supplier.supplierDatas.contacts, 
					this.panelId,
					function(){
						console.info('Added and show contact!');
					}
				);
				return this;
			},

			// 添加联系方式数据
			add : function(data, isAppend){
				var supplier = this.supplier;
				supplier.supplierDatas.contacts.push(data);
				isAppend && this._addElement(data); // 添加元素
				return data;
			},

				// 添加元素
				_addElement : function(data){
					var supplier = this.supplier;
					var panelBody = supplier._createRowElement(
						supplier.labelDatas.contacts, 
						data
					);
					supplier._appendRowElement("#panelContact", panelBody);
					return data;
				},


			// 删除联系方式数据
			remove : function(data, isRemove){
				var self = this;
				var contactsDatas = this.supplier.supplierDatas;
				jQuery.each(contactsDatas.contacts, function(i,item){
					if(item === data){
						contactsDatas.contacts.splice(i,1);
						isRemove && self._removeElement(data);
						data.element = null;
						return data;
					}
				});
				return false;
			},

				// 删除元素
				_removeElement : function(data){
					$(data.element).fadeTo(400,0).slideUp(400,function(){
						$(this).remove();
					});
				},


			// 更新联系方式数据
			update : function(oldData, newData, isUpdate){
				jQuery.extend(oldData, newData);
				isUpdate && this._updateElement(oldData);
				return oldData;
			},

				// 更新元素
				_updateElement : function(newData){
					var oldElement = newData.element;
					var supplier = this.supplier;
					var newElement = supplier._createRowElement(
						supplier.labelDatas.contacts, 
						newData
					);
					$(oldElement).replaceWith(newElement);
					return newElement;
				}
		}

		// 初始化
		this.init = function(param){

			this.agentBrand.show(); // 创建代理品牌

			this.contacts.show(); // 创建联系方式

		}
		 
	})();


	/* ===================================== */

	SupplierUnbrand.init({
		supplierTypeDataUrl : "_temp/supplierTypeData.json"
	});

	



	// 联系方式
	;(function(){

	    var $modal = $('#ajax-modal-dialog');
	    var contactObj = SupplierUnbrand.contacts;
	    var currentContact = undefined; // 当前选中的联系方式

	    // 点击新增按钮
	    $('#addConcatButton').click(function(event){
	        var remoteUrl = $(this).data('modal-url');
	        $modal.load(remoteUrl, '', function() {
	            $modal.modal({width: 650});
	            bindSubmit('add'); // 绑定提交为新增方法
	        });
	    });

	    // 点击修改按钮
	    $('#editConcatButton').click(function(){
	    	if(currentContact){
	    		var remoteUrl = $(this).data('modal-url');
		        $modal.load(remoteUrl, '', function() {
		            $modal.modal({width: 650});
		            FormData.load('#modalForm', currentContact);
		            bindSubmit('update', currentContact); // 绑定提交为修改方法
		        });
	    	}else{
    		    notifyInfo({text:'请选择要修改的联系方式！'})
	    	}
	    });

	    // 点击删除按钮
	    $('#removeConcatButton').click(function(){
	    	if(currentContact){
	    		contactObj.remove(currentContact, true);
	    		currentContact = undefined;
	    	}else{
    		    notifyInfo({text:'请选择要删除的联系方式！'})
	    	}
	    });


	    // 选择代理平牌
	    $('#panelAgentBrand').on('click','.panel-body',function(){
	    	if($(this).hasClass('checked')){
	    		$(this).removeClass('checked');
	    		currentAgentBrand = undefined;
	    	}else{
	    		$(this).addClass('checked').siblings('.panel-body').removeClass('checked');
	    		currentAgentBrand = $(this).data('rowDatas');
	    	}
	    });

	    // 选择联系方式
	    $('#panelContact').on('click','.panel-body',function(){
	    	if($(this).hasClass('checked')){
	    		$(this).removeClass('checked');
	    		currentContact = undefined;
	    	}else{
	    		$(this).addClass('checked').siblings('.panel-body').removeClass('checked');
	    		currentContact = $(this).data('rowDatas');
	    	}
	    });



	    // 移除rowBling类，保证下次动画显示
	    $('select-able-row').on('webkitAnimationEnd msAnimationEnd animationend','.panel-body',function(){
	    	$(this).removeClass('rowBling');
	    });
	    
	})();


});



