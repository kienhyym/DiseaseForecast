define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/DanhMuc/QuanHuyen/tpl/collection.html'),
		schema = require('json!schema/QuanHuyenSchema.json');
	var CustomFilterView = require('app/base/view/CustomFilterView');

	return Gonrin.CollectionDialogView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "quanhuyen",
		bindings: "data-quanhuyen-bind",
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
				{ field: "ten", label: "Tên", width: 250 },
				//    		     	{
				//        	        	 field: "tinhthanh_id", 
				//        	        	 label: "Tỉnh thành",
				//        	        	 foreign: "tinhthanh",
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
			//            if (this.getApp().data("tinhthanh_id") !== null) {
			//                this.uiControl.filters = { "tinhthanh_id": { "$eq": this.getApp().data("tinhthanh_id") } };
			//			}

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
								{ "ma": { "$likeI": text } },
							]
						};
						// console.log("tinhthanh===", this.getApp().data("tinhthanh_id"));
						// if (this.uiControl.filters && this.uiControl.filters !== null){
						var filters = query;
						if (self.uiControl.filters !== null) {
							filters = {
								"$and": [
									self.uiControl.filters,
									query
								]
							};
						}
						// }
						$col.data('gonrin').filter(filters);
						self.uiControl.filters = filters;
					} else {
						//						self.uiControl.filters = null;
					}
				}
				self.applyBindings();
			});
			return this;
		},
	});

});