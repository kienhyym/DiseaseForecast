define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/kenhketnoinguoidung/tpl/model.html'),
		schema = require('json!schema/UserConnectionChannelSchema.json');

		var UserConnectionChannelSelectView = require('app/user/js/SelectView');
	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "kenhketnoinguoidung",
		uiControl: {
			fields: [
				{
					field: "channelname",
					uicontrol: "combobox",
					dataSource: [
						{ value: null, text: "Phone" },
						{ value: 1, text: "Email" },
						{ value: 2, text: "zalo ID" },
						{ value: 3, text: "Sổ mẹ và bé ID" },
					],
					textField: "text",
					valueField: "text"
				},
				{
					field: "user",
					uicontrol: "ref",
					textField: "name",
					foreignRemoteField: "id",
					foreignField: "user_id",
					dataSource: UserConnectionChannelSelectView
				},
			]
		},

		render: function () {
			var self = this;
			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				//progresbar quay quay
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {

						self.applyBindings();
					},
					error: function () {
						self.getApp().notify("Get data Eror");
					},
				});
			} else {
				self.applyBindings();
			}

		},

	});

});