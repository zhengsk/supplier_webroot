
jQuery(document).ready(function() {

	var SupplierTypeSelect = new (function(){

		// 已经选中的供方类别
		this.selectedTypes = [];

		// 加载供方类型数据
		this.loadTypeData = function (param, callBack) {
			var self = this;
			doAjax({
				url : param.url
			}, function(datas) {
				self.typeData = datas;
				(callBack || jQuery.noop()).call(self, param); // 回调
			});
		};

		// 设置类别大类选择栏（左侧）
		this.setAccordionType = function () {
			var self = this;
			var panel, panelHeading, listUl;
			var item;
			for(var i = 0, j = this.typeData.length; i < j; i++){
				item = this.typeData[i];
				panel = $('<div class="panel panel-default"></div>');
				panelHeading = $('<div class="panel-heading"></div>');
				panelHeadingContent = $('<a data-toggle="collapse" data-parent="#accordionSupplierType" href="#supplierTypeList_'+ i +'" class="collapsed select-supplier-accordion-title"><span class="glyphicon glyphicon-stats"></span> '+ item.text +'</a>');
			
				listUl = $('<ul id="supplierTypeList_'+ i +'" class="panel-collapse collapse list-group" style="height: 0px;"></ul>');
				for (var m = 0, n = item.children.length; m < n; m++) {
					$('<li class="list-group-item">&emsp;'+ item.children[m].text +'</li>').data('typeDatas', item.children[m]).appendTo(listUl);
				};

				panelHeading.append(panelHeadingContent);
				panel.append(panelHeading);
				panel.append(listUl);

				$('#accordionSupplierType').append(panel);
			};

			// 绑定点击事件
			$('#accordionSupplierType').on('click', 'li', function(event){
				self.setDetailType($(this).data('typeDatas'));

				// 选中当前分类
				if(self.currentSelectType){ 
					$(self.currentSelectType).removeClass('current-select-type');
				}
				self.currentSelectType = this;
				$(self.currentSelectType).addClass('current-select-type')
			});
		};

		// 设置类别子项（右侧）
		this.setDetailType = function (datas) {
			var self = this;
			$('#supplierTypeLabelTitle').html(datas.text); // 标题

			var wrapper = $('#supplierTypeLabelWrapper');
			wrapper.empty().hide(); // 先清空内容

			if(datas.children){ // 存在子节点
				var childNodes = datas.children;
				if(childNodes[0].leaf){
					wrapper.append(this._createItem(childNodes));
				}else{
					for(var m = 0, n = childNodes.length; m < n; m++){
						var item = childNodes[m];
						if(!item.leaf){
							wrapper.append(this._createItem(item.children, item.text));
						}else{
							wrapper.append(this._createItem([item]));
						}
					}
				}
			}else{
				wrapper.append(this._createItem([datas]));
			}

			wrapper.fadeIn(400); //先清空内容
		};

		// 创建类型元素
		this._createItem = function(itemData, subtitle){
			var self = this;
			if(subtitle){
				subtitle = $('<h5 class="subtitle strong">'+ subtitle +'</h5>');
			}
			var labels = $('<p></p>');
			var ele;
			for(var m = 0, n = itemData.length; m < n; m++){
				var label = $('<span class="label">'+ itemData[m].text +'</span>')
					.data('typeDatas', itemData[m]);
				itemData[m].node = label[0]; // typeDatas引用会标签 ， TODO: 是否会造成内存泄露
				if(self.indexOfSelected(itemData[m]) !== -1){
					label.addClass('label-checked');
				}
				label.appendTo(labels);
			}
			var result = $('<div class="mb20"></div>').append(subtitle).append(labels);
			return result;

			/*====
			<div class="mb20">
			    <h5 class="subtitle strong">土建工程施工总承包</h5>
			    <p>
			        <span class="label">住宅</span>
			        <span class="label">公建</span>
			        <span class="label">装配式住宅</span>
			    </p>
			</div>
		====*/
		}

		// 添加选中类别
		this.addType = function(item){
			this.selectedTypes.push(item);
			this.showSelected(); // 显示已选中
		};

		// 删除已选类别
		this.deleteType = function(item){
			var index = this.indexOfSelected(item);
			if(index !== -1){
				this.selectedTypes.splice(index,1);
			}
			this.showSelected(); // 显示已选中
		};

		// 选中或删除类别
		this.toggleSelect = function(item){
			var index = this.indexOfSelected(item);
			if(index === -1){
				this.addType(item);
				$(item.node).addClass('label-checked');
			}else{
				this.deleteType(item);
				$(item.node).removeClass('label-checked');
			}
		}

		// 返回是否选中，并返回索引值，否则返回-1
		this.indexOfSelected = function(item){
			var selectedTypes = this.selectedTypes;
			for(var i = 0, j = selectedTypes.length; i < j; i++){
				if(item === selectedTypes[i]){
					return i;
				}
			}
			return -1;
		}

		// 显示已选中的供方类别
		this.showSelected = function(){
			var tagsinput = $('#tags_tagsinput').empty();
			var items = this.selectedTypes, tag;
			if(items.length){
				for(var i = 0, j = items.length; i < j; i++){
					tag = $('<span class="tag"><span>'+ items[i].text +'</span> </span>');
					$('<a href="javascript:;" title="删除">x</a>').data('typeDatas', items[i]).appendTo(tag);
					tagsinput.append(tag);
				}
			}else{
				tagsinput.html('没有选中的类别！');
			}

			/*=======
				<span class="tag">
				    <span>外墙装饰</span>
				    <a href="#" title="删除">x</a>
				</span>
			=======*/
		}

		// 初始化
		this.init = function(param){
			var self = this;

			// 加载供方类型数据
			this.loadTypeData({
				url : param.supplierTypeDataUrl
			}, function(){
				this.setAccordionType(); // 设置类别大类选择栏

				//初始化，打开选中第一个
				$('#accordionSupplierType').find('.collapsed').first().click();
				$('#accordionSupplierType').find('.list-group-item').first().click();
			});

			// 绑定已选中类别删除事件
			$('#tags_tagsinput').on('click', 'a', function(event){
				self.toggleSelect($(this).data('typeDatas'));
			});

			// 绑定子类别选中和取消选中事件
			$('#supplierTypeLabelWrapper').on('click', 'span.label', function(event){
				self.toggleSelect($(this).data('typeDatas'));
			});
		}
		 
	})();


	/* ===================================== */

	SupplierTypeSelect.init({
		supplierTypeDataUrl : "_temp/supplierTypeData.json"
	});


});




