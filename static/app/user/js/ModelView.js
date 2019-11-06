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
				// {
				// 	field: "roles",
				// 	uicontrol: "ref",
				// 	textField: "description",
				// 	foreignRemoteField: "id",
				// 	foreignField: "role_id",
				// 	selectionMode: "multiple",
				// 	dataSource: RoleSelectView
				// },
				// {
				// 	field: "donvi",
				// 	uicontrol: "ref",
				// 	textField: "ten",
				// 	foreignRemoteField: "id",
				// 	foreignField: "donvi_id",
				// 	dataSource: DonViSelectView
				// },

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
			self.$el.find('.toolTaoMoi').hide();
			self.setDonVi();


			self.$el.find(".btn-back").unbind("click").bind("click", function () {
				Backbone.history.history.back();

			});
			self.$el.find(".btn-luuid").unbind("click").bind("click", function () {
				self.model.save(null, {
					success: function (model, respose, options) {
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
				// if (self.$el.find("#name").val() == null || self.$el.find("#name").val() == "") {
				// 	self.getApp().notify({ message: "Bạn chưa nhập tên" }, { type: "danger", delay: 1000 });
				// }
				// if (self.$el.find("#email").val() == null || self.$el.find("#email").val() == "") {
				// 	self.getApp().notify({ message: "Bạn chưa nhập email" }, { type: "danger", delay: 1000 });
				// }
				// if (self.$el.find("#phone_number").val() == null || self.$el.find("#phone_number").val() == "") {
				// 	self.getApp().notify({ message: "Bạn chưa nhập số điện thoại" }, { type: "danger", delay: 1000 });
				// }

				// else {
					
				// 	$.ajax({
				// 		method: "PUT",
				// 		url: self.getApp().serviceURL + "/api/v1/user/" + self.model.get("id"),
				// 		data: JSON.stringify({
				// 			email: self.$el.find("#email").val(),
				// 			name: self.$el.find("#name").val(),
				// 			phone_number: self.$el.find("#phone_number").val(),
				// 			phone_zalo: self.$el.find("#phone_zalo").val(),
				// 			id_nguoitao:self.model.get("id_nguoitao")
				// 		}),
				// 		headers: {
				// 			'content-type': 'application/json'
				// 		},
				// 		dataType: 'json',
				// 		success: function (response) {
				// 			if (response) {
				// 				self.getApp().notify("Cập nhậtthành công");
				// 				self.getApp().getRouter().navigate(self.collectionName + "/collection");
				// 			}
				// 		}, error: function (xhr, ere) {
				// 			console.log('xhr', ere);

				// 		}
				// 	})
				// }

			});
			var id = this.getApp().getRouter().getParam("id");
			
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						
						if (self.model.get("id") == self.getApp().currentUser.id) {
							self.$el.find("#donvi_selecter").css("pointer-events", "none")
							var arr = [];
							arr.push(self.model.get("donvi"));

							self.$el.find('#donvi_combobox').combobox({
								textField: "ten",
								valueField: "id",
								dataSource: arr,
								value: self.model.get("donvi_id")
							});
							self.$el.find("#input_gia").val($('#donvi_combobox').data('gonrin').getText());

						} else {
							self.setDonViID();
						}





						if (self.model.get('id')) {
							self.$el.find('.toolTaoMoi').show();
							self.$el.find('.btn-taomoi').hide();

						}
						self.$el.find('.pass').hide();

						self.$el.find(".btn-backid").unbind("click").bind("click", function () {
							Backbone.history.history.back();
						});
						self.$el.find(".btn-xoaid").unbind("click").bind("click", function () {

							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/user/" + self.model.get("id"),
								method: "DELETE",
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (data, res) {
									self.getApp().notify({ message: "xóa thành công" });
									self.getApp().getRouter().navigate(self.collectionName + "/collection");
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
		setDonVi: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				success: function (data) {
					var dsDonVi = [];
					var dsDonViTong = [];
					self.$el.find("#input_gia").on('click', function () {
						dsDonViTong = [];
						data.objects.forEach(function (item, index) {
							if (self.getApp().currentUser.donvi_id == item.donvicaptren) {
								dsDonViTong.push(item)
								if (self.$el.find("#input_gia").val() == null || self.$el.find("#input_gia").val() == '') {
									dsDonVi.push(item)
								}
								else {
									if ((item.ten).indexOf(self.$el.find("#input_gia").val()) !== -1) {
										dsDonVi.push(item)
									}
								}

							}
						});
						self.$el.find('#donvi_combobox').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: dsDonVi,
							refresh: true,
							value: self.model.get("donvi_id")
						});
						self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")


						dsDonVi = [];
					});


					self.$el.find("#input_gia").keyup(function () {
						data.objects.forEach(function (item, index) {
							if (self.getApp().currentUser.donvi_id == item.donvicaptren) {
								if ((item.ten).indexOf(self.$el.find("#input_gia").val()) !== -1) {
									dsDonVi.push(item)
								}
							}
						});
						self.$el.find('#donvi_combobox').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: dsDonVi,
							refresh: true
						});

						self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")
						dsDonVi = [];

					})

					self.$el.find('#donvi_combobox').on('change.gonrin', function (e) {
						self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")
						self.$el.find("#input_gia").val($('#donvi_combobox').data('gonrin').getText());
						var idDonViDaChon = $('#donvi_combobox').data('gonrin').getValue();
						var donViDaChon = null;

						dsDonViTong.forEach(function (item) {
							if (idDonViDaChon == item.id) {
								donViDaChon = item;
							}
						})
						self.$el.find(".btn-luu").unbind("click").bind("click", function () {
							if (self.$el.find("#name").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập tên" }, { type: "danger", delay: 1000 });
							}
							if (self.$el.find("#email").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập email" }, { type: "danger", delay: 1000 });
							}
							if (self.$el.find("#phone_number").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập số điện thoại" }, { type: "danger", delay: 1000 });
							}
							if (self.$el.find("#password").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập mật khẩu" }, { type: "danger", delay: 1000 });
							}
							else {
								$.ajax({
									method: "POST",
									url: self.getApp().serviceURL + "/api/v1/register",
									data: JSON.stringify({
										email: self.$el.find("#email").val(),
										name: self.$el.find("#name").val(),
										phone_number: self.$el.find("#phone_number").val(),
										phone_zalo: self.$el.find("#phone_zalo").val(),
										password: self.$el.find("#password").val(),
										donvi_id: idDonViDaChon,
										captren_stt: donViDaChon.captren_id,
										tinhthanh_id: donViDaChon.tinhthanh_id,
										quanhuyen_id: donViDaChon.quanhuyen_id,
										xaphuong_id: donViDaChon.xaphuong_id,
										donvicaptren_id: donViDaChon.donvicaptren,
										id_nguoitao:self.getApp().currentUser.id
									}),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (response) {
										if (response) {
											self.getApp().notify("Đăng ký thành công");
											self.getApp().getRouter().navigate(self.collectionName + "/collection");
										}
									}, error: function (xhr, ere) {
										console.log('xhr', ere);

									}
								})
							}

						});

					});

					self.$el.find(".btn-luu").unbind("click").bind("click", function () {
						if (self.$el.find("#name").val() == null || self.$el.find("#password").val() == "") {
							self.getApp().notify({ message: "Bạn chưa nhập tên" }, { type: "danger", delay: 1000 });
						}
						if (self.$el.find("#email").val() == null || self.$el.find("#password").val() == "") {
							self.getApp().notify({ message: "Bạn chưa nhập email" }, { type: "danger", delay: 1000 });
						}
						if (self.$el.find("#phone_number").val() == null || self.$el.find("#password").val() == "") {
							self.getApp().notify({ message: "Bạn chưa nhập số điện thoại" }, { type: "danger", delay: 1000 });
						}
						if (self.$el.find("#password").val() == null || self.$el.find("#password").val() == "") {
							self.getApp().notify({ message: "Bạn chưa nhập mật khẩu" }, { type: "danger", delay: 1000 });
						}
						else {
							$.ajax({
								method: "POST",
								url: self.getApp().serviceURL + "/api/v1/register",
								data: JSON.stringify({
									email: self.$el.find("#email").val(),
									name: self.$el.find("#name").val(),
									phone_number: self.$el.find("#phone_number").val(),
									phone_zalo: self.$el.find("#phone_zalo").val(),
									password: self.$el.find("#password").val(),
									donvi_id: null,
									captren_stt: null,
									tinhthanh_id: null,
									quanhuyen_id: null,
									xaphuong_id: null,
									donvicaptren_id: null,
									id_nguoitao:self.getApp().currentUser.id
								}),
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (response) {
									if (response) {
										self.getApp().notify("Đăng ký thành công");
										self.getApp().getRouter().navigate(self.collectionName + "/collection");
									}
								}, error: function (xhr, ere) {
									console.log('xhr', ere);

								}
							})
						}

					});
					self.$el.find("#input_gia").focusout(function () {
						setTimeout(function () {
							self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "none")
						}, 100);
					});
				},
				error: function (xhr, status, error) { }
			});
		},
		setDonViID: function () {
			var self = this;

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				success: function (data) {
					if (self.model.get("donvi_id") != null) {
						var dsDonVi = [];
						data.objects.forEach(function (item, index) {
							if (self.getApp().currentUser.donvi_id == item.donvicaptren) {
								dsDonVi.push(item)
							}
						});
						self.$el.find('#donvi_combobox').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: dsDonVi,
							refresh: true,
							value: self.model.get("donvi_id")
						});

						self.$el.find("#input_gia").val($('#donvi_combobox').data('gonrin').getText());

					}
					var dsDonVi = [];
					var dsDonViTong = [];
					self.$el.find("#input_gia").on('click', function () {
						dsDonViTong = [];
						data.objects.forEach(function (item, index) {
							if (self.getApp().currentUser.donvi_id == item.donvicaptren) {
								dsDonViTong.push(item)
								if (self.$el.find("#input_gia").val() == null || self.$el.find("#input_gia").val() == '') {
									dsDonVi.push(item)
								}
								else {
									if ((item.ten).indexOf(self.$el.find("#input_gia").val()) !== -1) {
										dsDonVi.push(item)
									}
								}

							}
						});
						self.$el.find('#donvi_combobox').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: dsDonVi,
							refresh: true,
							value: self.model.get("donvi_id")
						});
						self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")


						dsDonVi = [];
					});


					self.$el.find("#input_gia").keyup(function () {
						data.objects.forEach(function (item, index) {
							if (self.getApp().currentUser.donvi_id == item.donvicaptren) {
								if ((item.ten).indexOf(self.$el.find("#input_gia").val()) !== -1) {
									dsDonVi.push(item)
								}
							}
						});
						self.$el.find('#donvi_combobox').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: dsDonVi,
							refresh: true
						});

						self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")
						dsDonVi = [];

					})

					self.$el.find('#donvi_combobox').on('change.gonrin', function (e) {
						self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")
						self.$el.find("#input_gia").val($('#donvi_combobox').data('gonrin').getText());
						var idDonViDaChon = $('#donvi_combobox').data('gonrin').getValue();
						var donViDaChon = null;

						dsDonViTong.forEach(function (item) {
							if (idDonViDaChon == item.id) {
								donViDaChon = item;
							}
						})
						self.$el.find(".btn-luuid").unbind("click").bind("click", function () {
							if (self.$el.find("#name").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập tên" }, { type: "danger", delay: 1000 });
							}
							if (self.$el.find("#email").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập email" }, { type: "danger", delay: 1000 });
							}
							if (self.$el.find("#phone_number").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập số điện thoại" }, { type: "danger", delay: 1000 });
							}
							if (self.$el.find("#password").val() == null || self.$el.find("#password").val() == "") {
								self.getApp().notify({ message: "Bạn chưa nhập mật khẩu" }, { type: "danger", delay: 1000 });
							}
							else {
								$.ajax({
									method: "PUT",
									url: self.getApp().serviceURL + "/api/v1/user/" + self.model.get('id'),
									data: JSON.stringify({
										email: self.$el.find("#email").val(),
										name: self.$el.find("#name").val(),
										phone_number: self.$el.find("#phone_number").val(),
										phone_zalo: self.$el.find("#phone_zalo").val(),
										password: self.$el.find("#password").val(),
										donvi_id: idDonViDaChon,
										captren_stt: donViDaChon.captren_id,
										tinhthanh_id: donViDaChon.tinhthanh_id,
										quanhuyen_id: donViDaChon.quanhuyen_id,
										xaphuong_id: donViDaChon.xaphuong_id,
										donvicaptren_id: donViDaChon.donvicaptren,
										id_nguoitao:self.model.get("id_nguoitao")
									}),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (response) {
										if (response) {
											self.getApp().notify("Đăng ký thành công");
											self.getApp().getRouter().navigate(self.collectionName + "/collection");
										}
									}, error: function (xhr, ere) {
										console.log('xhr', ere);

									}
								})
							}

						});

					});
					
						
					
					
					self.$el.find("#input_gia").focusout(function () {
						setTimeout(function () {
							self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "none")
						}, 1000);
					});
				},
				error: function (xhr, status, error) { }
			});
		},
	});
});