
jQuery(document).ready(function() {

	var SupplierTypeSelect = new function(){

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
			$('#supplierTypeLabelTitle').html(datas.text); // 标题

			var supplierTypeLabelWrapper = $('#supplierTypeLabelWrapper');
			supplierTypeLabelWrapper.empty().hide(); // 先清空内容

			if(datas.children){ // 存在子节点
				var childNodes = datas.children;
				if(childNodes[0].leaf){
					createItem(childNodes);
				}else{
					for(var m = 0, n = childNodes.length; m < n; m++){
						var item = childNodes[m];
						if(!item.leaf){
							createItem(item.children, item.text);
						}else{
							createItem([item]);
						}
					}
				}
			}else{
				createItem([datas]);
			}

			supplierTypeLabelWrapper.fadeIn(400); //先清空内容

			// 创建类型元素
			function createItem(itemData, subtitle){
				if(subtitle){
					subtitle = $('<h5 class="subtitle strong">'+ subtitle +'</h5>');
				}
				var labels = $('<p></p>');
				var ele;
				for(var m = 0, n = itemData.length; m < n; m++){
					$('<span class="label">'+ itemData[m].text +'</span>')
						.data('typeDatas', itemData[m]).appendTo(labels);
				}
				var result = $('<div class="mb20"></div>').append(subtitle).append(labels);
				supplierTypeLabelWrapper.append(result);
			}

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
		};

		// 添加选中类别
		this.addType = function(item){
			this.selectedTypes.push(item);
		};

		// 删除已选类别
		this.deleteType = function(item){
			var selectedTypes = this.selectedTypes;
			for(var i = 0, j = selectedTypes.length; i < j; i++){
				if(item.id === selectedTypes[i].id){
					selectedTypes.splice(i,1);
					return;
				}
			}
		};
		 
	}();


	/* ===================================== */


	// 加载供方类型数据
	SupplierTypeSelect.loadTypeData({
		url : "_temp/supplierTypeData.json"
	}, function(){
		this.setAccordionType(); // 设置类别大类选择栏
	});
	

	;(function() {
		$('#supplierTypeLabelWrapper').on('click', 'span.label', function(event){
			SupplierTypeSelect.deleteType(this.supplierType);
		});
	})();



});




