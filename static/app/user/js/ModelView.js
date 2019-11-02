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
			self.$el.find('.toolTaoMoi').css("display", "none")

			var iddonvi = null;
			var captrenid = null;
			var tinhthanhid = null;
			var quanhuyenid = null;
			var xaphuongid = null;
			var donvicaptren_id = null;
			(self.model).on("change:donvi", function () {
				iddonvi = self.model.get("donvi").id;
				captrenid = self.model.get("donvi").captren_id;
				tinhthanhid = self.model.get("donvi").tinhthanh_id;
				quanhuyenid = self.model.get("donvi").quanhuyen_id;
				xaphuongid = self.model.get("donvi").xaphuong_id;
				donvicaptren_id = self.model.get("donvi").donvicaptren;
			})
			self.$el.find(".btn-luu").unbind("click").bind("click", function () {
				if(self.$el.find("#name").val()== null || self.$el.find("#password").val()== ""){
					self.getApp().notify({ message: "Bạn chưa nhập tên" }, { type: "danger", delay: 1000 });
				}
				if(self.$el.find("#email").val()== null || self.$el.find("#password").val()== ""){
					self.getApp().notify({ message: "Bạn chưa nhập email" }, { type: "danger", delay: 1000 });
				}
				if(self.$el.find("#phone_number").val()== null || self.$el.find("#password").val()== ""){
					self.getApp().notify({ message: "Bạn chưa nhập số điện thoại" }, { type: "danger", delay: 1000 });
				}
				// if(self.$el.find("#phone_zalo").val()== null || self.$el.find("#password").val()== ""){
				// 	self.getApp().notify({ message: "Bạn chưa nhập số đăng ký zalo" }, { type: "danger", delay: 1000 });
				// }
				// if(self.$el.find("#donvi").val()== null || self.$el.find("#password").val()== ""){
				// 	self.getApp().notify({ message: "Bạn chưa nhập đơn vị" }, { type: "danger", delay: 1000 });
				// }
				if(self.$el.find("#password").val()== null || self.$el.find("#password").val()== ""){
					self.getApp().notify({ message: "Bạn chưa nhập mật khẩu" }, { type: "danger", delay: 1000 });
				}
				else{
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
							captren_stt: captrenid,
							tinhthanh_id: tinhthanhid,
							quanhuyen_id: quanhuyenid,
							xaphuong_id: xaphuongid,
							donvicaptren_id:donvicaptren_id
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
				}
				
			});
			self.$el.find(".btn-back").unbind("click").bind("click", function () {
				Backbone.history.history.back();

			});

			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						console.log(self.getApp().currentUser.id,self.model.get('id'))
						if (self.getApp().currentUser.id !== self.model.get('id')) {
							self.$el.find('.toolTaoMoi').hide();
						} else {
							self.$el.find('.toolTaoMoi').show();
							self.$el.find('.btn-taomoi').hide();
						}
						self.$el.find('.pass').hide();

						self.$el.find(".btn-backid").unbind("click").bind("click", function () {
							Backbone.history.history.back();
						});
						self.$el.find(".btn-xoaid").unbind("click").bind("click", function () {
							
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/user/" +self.model.get("id"),
								method: "DELETE",
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (data, res) {
									self.getApp().notify({ message: "xóa thành công" });

								},
								error: function (xhr, status, error) {
									self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
								},
							});
						});

						self.$el.find(".btn-luuid").unbind("click").bind("click", function () {
							var param = {
								email:self.model.get("email"),
								name: self.model.get("name"),
								phone_number: self.model.get("phone_number"),
								phone_zalo: self.model.get("phone_zalo"),
								donvi_id: self.model.get("donvi_id"),

							}
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/user/" +self.model.get("id"),
								method: "PUT",
								data: JSON.stringify(param),
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (data, res) {
									
									var param2 = {
										captren_stt: data.donvi.captren_id,
										tinhthanh_id: data.donvi.tinhthanh_id,
										quanhuyen_id: data.donvi.quanhuyen_id,
										xaphuong_id: data.donvi.xaphuong_id,
										tinhthanh: data.donvi.tinhthanh,
										quanhuyen: data.donvi.quanhuyen,
										xaphuong: data.donvi.xaphuong,
										donvicaptren_id:data.donvi.donvicaptren
									}
									$.ajax({
										url: self.getApp().serviceURL + "/api/v1/user/" +self.model.get("id"),
										method: "PUT",
										data: JSON.stringify(param2),
										headers: {
											'content-type': 'application/json'
										},
										dataType: 'json',
										success: function (data, res) {
											self.getApp().notify({ message: "Cập nhật thành công" });
											location.reload();
										},
										error: function (xhr, status, error) {
											self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
										},
									});
								},
								error: function (xhr, status, error) {
									self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
								},
							});
						});
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