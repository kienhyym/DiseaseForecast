define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/view/tpl/DanhMuc/TuyenDonVi/collection.html'),
		schema = require('json!schema/TuyenDonViSchema.json');

	return Gonrin.CollectionDialogView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "tuyendonvi",
		//textField: "ten",
		//valueField: "id",
		uiControl: {
			pagination: {
				pageSize: 30
			},
			fields: [{
					field: "id",
					label: "ID",
					width: "80px",
					readonly: true,
				},
				{
					field: "ma",
					label: "Mã",
					width: "150px"
				},
				{
					field: "ten",
					label: "Tên",
					width: "350px"
				}
			],
			onRowClick: function (event) {
				this.uiControl.selectedItems = event.selectedItems;
			},
		},
		render: function () {
			this.applyBindings();
			return this;
		},
	});

});