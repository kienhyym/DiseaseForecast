define(function (require) {
	"use strict";
	var $                   = require('jquery'),
		_                   = require('underscore'),
		Gonrin				= require('gonrin');
	
	var template 			= require('text!app/donvi/tpl/select.html'),
		schema 				= require('json!schema/DonViSchema.json');
	var CustomFilterView      = require('app/base/view/CustomFilterView');
	return Gonrin.CollectionDialogView.extend({
		template : template,
		modelSchema	: schema,
		urlPrefix: "/api/v1/",
		collectionName: "donvi",
		size: "large",
		tools : [
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
						command: function(){
							var self = this;
							self.trigger("onSelected");
							self.close();
						}
					},
				]
			},
		],
		uiControl:{
			fields: [
				{ field: "code", label: "Mã"},
				  { field: "name", label: "Tên"},
				   {
					 field: "tinhthanh_id", 
					 label: "Tỉnh thành",
					 foreign: "tinhthanh",
					 foreignValueField: "id",
					 foreignTextField: "ten",
					},
				   {
					 field: "quanhuyen_id", 
					 label: "Quận/Huyện",
					 foreign: "quanhuyen",
					 foreignValueField: "id",
					 foreignTextField: "ten",
					},
				   {
					 field: "xaphuong_id", 
					 label: "Xã/Phường/Thị trấn",
					 foreign: "xaphuong",
					 foreignValueField: "id",
					 foreignTextField: "ten",
					},
			],
			onRowClick: function(event){
				this.uiControl.selectedItems = event.selectedItems;
			},
		},
		render:function(){
			
			var self= this;
			var filter = new CustomFilterView({
				el: self.$el.find("#grid_search"),
				sessionKey: self.collectionName +"_filter"
			});
			filter.render();
			
			if(!filter.isEmptyFilter()) {
				var text = !!filter.model.get("text") ? filter.model.get("text").trim() : "";
				var filters = { "$or": [
					{"code": {"$likel": text }},
					{"name": {"$likel": text }}
				] };
				self.uiControl.filters = filters;
			}
			self.uiControl.orderBy = [{"field": "name", "direction": "desc"}];
			self.applyBindings();
			
			filter.on('filterChanged', function(evt) {
				var $col = self.getCollectionElement();
				var text = !!evt.data.text ? evt.data.text.trim() : "";
				if ($col) {
					if (text !== null){
						var filters = { "$or": [
							{"code": {"$likel": text }},
							{"name": {"$likel": text }}
						] };
						$col.data('gonrin').filter(filters);
						self.uiControl.filters = filters;
					} else {
					}
				}
				self.uiControl.orderBy = [{"field": "ten_coso", "direction": "desc"}];
				self.applyBindings();
			});
			return this;
		},
		
	});
});