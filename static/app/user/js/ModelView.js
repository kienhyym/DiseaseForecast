define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/user/tpl/model.html'),
		schema = require('json!schema/UserSchema.json');
	var RoleSelectView = require('app/role/js/SelectView');
	var DonViSelectView = require('app/donvi/js/SelectView');
	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "user",
		bindings: "data-bind",
		state: null,
		tools: [
			{
				name: "defaultgr",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "back",
						type: "button",
						buttonClass: "btn-default btn-sm",
						label: "TRANSLATE:BACK",
						command: function () {
							var self = this;
							Backbone.history.history.back();
						}
					},
					{
						name: "save",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:SAVE",
						command: function () {
							var self = this;
							// self.getApp().showloading();
							var ten = self.model.get("name");
							
							var donvi = self.model.get("donvi");
							console.log('self',self)
							console.log('ten',name)
							console.log('donvi',donvi)
							if (ten == null || ten == "") {
								self.getApp().notify({ message: "Tên đơn vị không được để trống!" }, { type: "danger" });
							} else if (donvi == null || donvi == undefined) {
								self.getApp().notify({ message: "Bạn chưa chọn tên đơn vị!" }, { type: "danger" });
							} else {
								self.model.save(null, {
									success: function (model, respose, options) {
										// self.getApp().hideloading();
										self.getApp().notify("Lưu thông tin thành công");
										self.getApp().getRouter().navigate(self.collectionName + "/collection");
									},
									error: function (xhr, status, error) {
										try {
											if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
												self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
												self.getApp().getRouter().navigate("login");
											} else {
												self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
											}
										}
										catch (err) {
											self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
										}
									}
								});
							}
						}
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm",
						label: "TRANSLATE:DELETE",
						visible: function () {
							return this.getApp().getRouter().getParam("id") !== null;
						},
						command: function () {
							var self = this;
							self.model.destroy({
								success: function (model, response) {
									self.getApp().notify('Xoá dữ liệu thành công');
									self.getApp().getRouter().navigate(self.collectionName + "/collection");
								},
								error: function (xhr, status, error) {
									try {
										if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
											self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
											self.getApp().getRouter().navigate("login");
										} else {
											self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
										}
									}
									catch (err) {
										self.getApp().notify({ message: "Xóa dữ liệu không thành công" }, { type: "danger", delay: 1000 });
									}
								}
							});
						}
					},
				],
			}],
		uiControl:{
			fields:[
				{
					field: "roles",
					uicontrol: "ref",
					textField: "name",
					foreignRemoteField: "id",
					foreignField: "role_id",
					selectionMode: "multiple",
					dataSource: RoleSelectView
				},
				{
					field: "donvi",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "donvi_id",
					dataSource: DonViSelectView
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
						self.changepasswordEvent(id);
					},
					error: function () {
						self.getApp().notify("Get data Eror");
					},
				});
			} else {
				self.applyBindings();
				self.changepasswordEvent(id);
			}
			
		},
		changepasswordEvent: function (id) {
			var self = this;
			var id = id;
			self.$el.find("input[name*='save']").unbind("click").bind("click", function () {
				$.ajax({
					type: 'POST',
					url: self.getApp().serviceURL + "/api/v1/changepassword",
					dataType: 'json',
					data: JSON.stringify({
						user_id: id,
						password: self.$el.find("#txtpass2").val()
					}),
					success: function (response) {
						console.log('xxx',txtpass2)
					}, error: function (xhr) {
						console.log('xhr', xhr);
					}
				})
			});
		}
	});
});