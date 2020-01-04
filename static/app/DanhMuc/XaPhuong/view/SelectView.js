define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/DanhMuc/XaPhuong/tpl/collection.html'),
		schema = require('json!schema/XaPhuongSchema.json');
	var CustomFilterView = require('app/base/view/CustomFilterView');

	return Gonrin.CollectionDialogView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "xaphuong",
		bindings: "data-xaphuong-bind",
		textField: "ten",
		valueField: "id",
		tools: [
			{
				name: "defaultgr",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "select",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:SELECT",
						command: function () {
							var self = this;
							self.trigger("onSelected");
							self.close();
						}
					},
				]
			},
		],
		uiControl: {
			fields: [
				{ field: "ma", label: "Mã", width: 150 },
				{
					field: "ten",
					label: "Name",
					template: function (rowData) {
						if (localStorage.getItem("language") == "EN"){
							if (!!rowData && rowData.ten) {
								var x = rowData.ten
								var str = x;
								// str = str.toLowerCase();
	
								str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
								str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
								str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
								str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
								str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
								str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
								str = str.replace(/đ/g,"d");
								str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
								str = str.replace(/ + /g," ");
								str = str.replace("Xa",""); 
								str = str.replace("Phuong",""); 
	
								str = str.trim(); 
								return str;
							}
						}
						else{
							return rowData.ten;

						}
						
					
						return "";
					},
				}
				// { field: "ten", label: "Tên", width: 250 },
				//    		     	{
				//        	        	 field: "quanhuyen_id", 
				//        	        	 label: "Quận huyện",
				//        	        	 foreign: "quanhuyen",
				//        	        	 foreignValueField: "id",
				//        	        	 foreignTextField: "ten",
				//        	        	 width:250
				//        	         },
			],
			onRowClick: function (event) {
				this.uiControl.selectedItems = event.selectedItems;
			},
		},
		render: function () {
			var self = this;
			self.$el.find(".close").unbind('click').bind('click', function () {
				console.log("xxxxxxxxx")
				self.$el.find("#grid_search input").val("")
			})
			//    		var currentUser = this.getApp().currentUser;
			//	    	 if (this.getApp().data("quanhuyen_id") !== null) {
			//               this.uiControl.filters = { "quanhuyen_id": { "$eq": this.getApp().data("quanhuyen_id") } };
			//            }
			self.uiControl.orderBy = [{ "field": "ten", "direction": "desc" }];
			var filter = new CustomFilterView({
				el: self.$el.find("#grid_search"),
				sessionKey: self.collectionName + "_filter"
			});
			filter.render();

			if (!filter.isEmptyFilter()) {
				var text = !!filter.model.get("text") ? filter.model.get("text").trim() : "";
				var query = {
					"$or": [
						{ "ten": { "$likeI": text } },
					]
				};
				//				var filters = {"$and": [
				//					{"quanhuyen_id": {"$eq": this.getApp().data("quanhuyen_id")}},
				//					query
				//				]};
				var filters = query;
				if (self.uiControl.filters !== null) {
					filters = {
						"$and": [
							self.uiControl.filters,
							query
						]
					};
				}
				self.uiControl.filters = filters;
			}
			self.applyBindings();

			filter.on('filterChanged', function (evt) {
				var $col = self.getCollectionElement();
				var text = !!evt.data.text ? evt.data.text.trim() : "";
				if ($col) {
					if (text !== null) {
						var query = {
							"$or": [
								{ "ten": { "$likeI": text } },
							]
						};
						var filters = query;
						if (self.uiControl.filters !== null) {
							filters = {
								"$and": [
									self.uiControl.filters,
									query
								]
							};
						}
						$col.data('gonrin').filter(filters);
						//self.uiControl.filters = filters;
					} else {
						self.uiControl.filters = null;
					}
				}
				self.applyBindings();
			});
			return this;
		},

		
	});

});