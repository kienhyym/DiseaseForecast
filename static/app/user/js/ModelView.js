define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/user/tpl/model.html'),
		schema = require('json!schema/UserSchema.json');

	var RoleSelectView = require('app/role/js/SelectView');
	var DonViSelectView = require('app/donvi/js/SelectView');

	// var ConnectionChannelItemView = require('app/user/js/ConnectionChannelItemView');

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


							var ten = self.model.get("name");
							var donvi = self.model.get("donvi");
							if (ten == null || ten == "") {
								self.getApp().notify({ message: "Tên đơn vị không được để trống!" }, { type: "danger" });
							} else if (donvi == null || donvi == undefined) {
								self.getApp().notify({ message: "Bạn chưa chọn tên đơn vị!" }, { type: "danger" });
							} else {
								self.model.save(null, {
									success: function (model, respose, options) {
										self.model.set("donvi_captren_id", respose.donvi.captren_id);
										self.model.set("tinhthanh__id", respose.donvi.tinhthanh_id);
										self.model.set("quanhuyen_id", respose.donvi.quanhuyen_id);
										self.model.set("xaphuong_id", respose.donvi.xaphuong_id);



										self.model.save(null, {
											success: function (model, respose, options) {
												self.getApp().notify("Lưu thông tin thành công");
												location.reload();
											},
											error: function (xhr, status, error) {
												self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });

											}
										});
										// self.getApp().hideloading();

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
		uiControl: {
			fields: [
				{
					field: "roles",
					uicontrol: "ref",
					textField: "description",
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

				// {
				// 	field: "userconnectionchannels",
				// 	uicontrol: false,
				// 	itemView: ConnectionChannelItemView,

				// 	tools: [{
				// 		name: "create",
				// 		type: "button",
				// 		buttonClass: "btn btn-outline-success btn-sm",
				// 		label: "<span class='fa fa-plus'></span>",
				// 		command: "create"
				// 	}],
				// 	toolEl: "#add_connection_channel"
				// },
			]
		},

		render: function () {
			var self = this;
			self.$el.find('.toolTaoMoi').css("display","none")

			var iddonvi = null;
			var captrenid = null;
			var tinhthanhid = null;
			var quanhuyenid = null;
			var xaphuongid = null;
			(self.model).on("change:donvi", function () {
				iddonvi = self.model.get("donvi").id;
				captrenid = self.model.get("donvi").captren_id;
				tinhthanhid = self.model.get("donvi").tinhthanh_id;
				quanhuyenid = self.model.get("donvi").quanhuyen_id;
				xaphuongid = self.model.get("donvi").xaphuong_id;
			})
			self.$el.find(".btn-luu").unbind("click").bind("click", function () {
				$.ajax({
					method: "POST",
					url: self.getApp().serviceURL + "/api/v1/register",
					data: JSON.stringify({
						email: self.$el.find("#email").val(),
						name: self.$el.find("#name").val(),
						phone_number: self.$el.find("#phone_number").val(),
						phone_zalo: self.$el.find("#phone_zalo").val(),
						password: self.$el.find("#password").val(),
						donvi_id: iddonvi,
						donvi_captren_id: captrenid,
						tinhthanh__id: tinhthanhid,
						quanhuyen_id: quanhuyenid,
						xaphuong_id: xaphuongid
					}),
					success: function (response) {
						if (response) {
							self.getApp().notify("Đăng ký thành công");
							self.getApp().getRouter().navigate("login");
						}
					}, error: function (xhr, ere) {
						console.log('xhr', ere);

					}
				})
			});
			self.$el.find(".btn-back").unbind("click").bind("click", function () {
				Backbone.history.history.back();

			});

			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						if (self.getApp().currentUser.id !== self.model.get('id')) {
							self.$el.find('.toolTaoMoi').hide();
						}else{
							self.$el.find('.toolTaoMoi').show();
							self.$el.find('.btn-taomoi').hide();							
						}
						self.$el.find('.pass').hide();							

						(self.model).on("change:donvi", function (params) {
							self.model.set("phancapnhanbaocao", null)
							self.model.set("roles", null)
						})
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