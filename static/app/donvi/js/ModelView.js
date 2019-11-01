define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/donvi/tpl/model.html'),
		schema = require('json!schema/DonViSchema.json');
	var XaPhuongSelectView = require('app/DanhMuc/XaPhuong/view/SelectView');
	var QuanHuyenSelectView = require('app/DanhMuc/QuanHuyen/view/SelectView');
	var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');

	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "donvi",
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


							self.model.save(null, {
								success: function (model, respose, options) {
									self.getApp().notify("Lưu thông tin thành công");
									self.getApp().getRouter().refresh();

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
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm",
						label: "TRANSLATE:DELETE",
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
					field: "xaphuong",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "xaphuong_id",
					dataSource: XaPhuongSelectView
				},
				{
					field: "quanhuyen",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "quanhuyen_id",
					dataSource: QuanHuyenSelectView
				},
				{
					field: "tinhthanh",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "tinhthanh_id",
					dataSource: TinhThanhSelectView
				},
				{
					field: "nhanthongbaohaykhong",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": "co", "text": "Nhận cảnh bảo" },
						{ "value": "khong", "text": "Không nhận cảnh bảo" },
					],
				},
				{
					field: "captren_id",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",

					dataSource: [
						{ "value": 1, "text": "Cấp cục" },
						{ "value": 2, "text": "Cấp tỉnh" },
						{ "value": 3, "text": "Cấp huyện" },
						{ "value": 4, "text": "Cấp xã" },
					],
				},

			]
		},
		render: function () {
			var self = this;
			self.donViCapTren();

			var id = this.getApp().getRouter().getParam("id");
			$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
			self.$el.find("#multiselect_required").selectpicker();
			if (self.getApp().currentUser.donvi_captren_id == 1) {
				self.model.set("captren_id", 2)

			}
			else if (self.getApp().currentUser.donvi_captren_id == 2) {
				self.model.set("captren_id", 3)
			}
			else {
				self.model.set("captren_id", 4)
			}

			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						self.aiDuocChinhSua();
						self.donViCapTren();

						self.applyBindings();
						self.danhSachUser();
						self.model.on("change:tinhthanh_id", function () {
							self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
						});
						self.model.on("change:quanhuyen_id", function () {
							self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
						});

					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						} catch (err) {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
						}
					}
				});
			} else {
				self.applyBindings();
				self.danhSachUser();
				self.model.on("change:tinhthanh_id", function () {
					self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
				});
				self.model.on("change:quanhuyen_id", function () {
					self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
				});
			}

		},



		validateEmail: function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		},
		validatePhone: function (inputPhone) {
			if (inputPhone == null || inputPhone == undefined) {
				return false;
			}
			var phoneno = /(09|08|07|05|03)+[0-9]{8}/g;
			const result = inputPhone.match(phoneno);
			if (result && result == inputPhone) {
				return true;
			} else {
				return false;
			}
		},
		danhSachUser: function () {
			var self = this;
			var userShield = self.model.get('user_shield');
			userShield.forEach(function (item, index) {
				self.$el.find('#danhsach_users').append('<tr class="record"><td class="p-0" style="line-height:40px;font-size:12px;">' + item.name + '</td>' +
					'<td class="p-1"><select class="selectpicker form-control multiselect_thongbao" multiple data-live-search="true" data-actions-box="true" data-noneSelectedText="Chọn vai trò" title="Chọn vai trò"></select></td>'
					+ '<td class="p-0" style="line-height:40px;font-size:12px;">' + item.email + '</td><td class="p-0" style="line-height:40px;font-size:12px;">' + item.phone_number + '</td><td class="p-0" style="line-height:40px;font-size:12px;">' + item.phone_zalo + '</td><td class="p-1"><input type="text" class="form-control loaivaitro" ></td><td class="p-0 pt-1"><button class="btn btn-danger del">X</button></td></tr>');
			})


			self.$el.find('.loaivaitro').each(function (item, index) {
				$(index).combobox({
					textField: "loaivaitro",
					valueField: "id",
					dataSource: [
						{ loaivaitro: "Quản lý", id: 'quanly' },
						{ loaivaitro: "Nhân viên", id: 'nhanvien' },
					],
					value: self.model.get("user_shield")[item].phancapnhanbaocao,
					refresh: true
				});

				$(index).on('change.gonrin', function (e) {
					var phanloainhanbaocao = {
						phancapnhanbaocao: $(index).data('gonrin').getValue()
					}
					var idloaivaitro = userShield[item].id;
					self.$el.find('.btn-success').bind("click", function () {
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/user/" + idloaivaitro,
							method: "PUT",
							data: JSON.stringify(phanloainhanbaocao),
							headers: {
								'content-type': 'application/json'
							},
							dataType: 'json',
							success: function (data, res) {
							},
							error: function (xhr, status, error) {
								self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
							},
						});
					})
				});
			})
			self.getThongBao();
			self.xoaNguoiDung();
		},
		xoaNguoiDung: function () {
			var self = this;
			self.$el.find('.del').each(function (item, index) {
				self.$el.find(index).unbind('click').bind('click', function () {
					var userShield2 = self.model.get("user_shield");
					userShield2.splice(item, 1);
					$(self.$el.find('.record')[item]).remove();
					self.model.set("user_shield", userShield2);
				})
			})
		},

		getThongBao: function () {
			var self = this;
			self.$el.find(".multiselect_thongbao").each(function (item, index) {
				var arrIdRole = [];
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/role",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						data.objects.forEach(function (itemrole, indexrole) {
							var data_str = encodeURIComponent(JSON.stringify(itemrole));
							var option_elm = $('<option>').attr({ 'value': itemrole.id, 'data-ck': data_str }).html(itemrole.description)
							$(index).append(option_elm);
						})

						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						var dsuser = self.model.get("user_shield")[item].id;
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/user",
							method: "GET",
							contentType: "application/json",
							success: function (datauser) {
								datauser.objects.forEach(function (itemuser,indexuser) {
									if (dsuser == itemuser.id) {
										(itemuser.roles).forEach(function (itemroles, indexroles) {
											arrIdRole.push(itemroles.id)
										})
									}

								})
								$(index).selectpicker('val', arrIdRole);
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



				$(index).on("change", function () {
					for (var i = 0; i < self.model.get("user_shield").length; i++) {
						if (i == item) {
							var id = self.model.get("user_shield")[i].id

							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/user",
								method: "GET",
								contentType: "application/json",
								success: function (data) {
									data.objects.forEach(function (item2, index2) {
										if (id == item2.id) {
											var arrRole = [];

											($(index).val()).forEach(function (idrole, indexidrole) {
												$.ajax({
													url: self.getApp().serviceURL + "/api/v1/role",
													method: "GET",
													contentType: "application/json",
													success: function (data) {
														data.objects.forEach(function (itemrole, indexrole) {
															if (idrole == itemrole.id) {
																arrRole.push(itemrole)
															}
														})
													},
													error: function (xhr, status, error) {
														self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
													},
												});
											})
											var param = {
												roles: arrRole
											}
											self.$el.find('.btn-success').bind("click", function () {

												$.ajax({
													url: self.getApp().serviceURL + "/api/v1/user/" + id,
													method: "PUT",
													data: JSON.stringify(param),
													headers: {
														'content-type': 'application/json'
													},
													dataType: 'json',
													success: function (data, res) {
													},
													error: function (xhr, status, error) {
														self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
													},
												});
											})
										}
									})
								},
								error: function (xhr, status, error) {
									self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
								},
							});
						}

					}
				})
			})
		},
		aiDuocChinhSua: function () {
			var self = this;
			var currentUser = self.getApp().currentUser;
			// if (currentUser.phancapnhanbaocao !== "quanly") {
			// 	self.$el.find(".toolbar").css("display", "none");

			// }

		},
		donViCapTren: function () {
			var self = this;
			var arrdonvi = [];
			if (self.model.get("captren_id") == 2) {
				// arrdonvi = [];
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi",
					method: "GET",
					contentType: "application/json",
					success: function (data) {


						data.objects.forEach(function (item, index) {

							if (1 == item.captren_id) {
								arrdonvi.push(item)
							}
						})
						self.$el.find('#donvicaptren').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: arrdonvi,
							value: self.model.get("donvicaptren")
						});
						self.$el.find('#donvicaptren').on('change.gonrin', function (e) {
							self.model.set("donvicaptren", self.$el.find('#donvicaptren').data('gonrin').getValue())
						});
					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});

			}
			else if (self.model.get("captren_id") == 3) {
				arrdonvi = [];
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						data.objects.forEach(function (item, index) {

							if (2 == item.captren_id && item.tinhthanh_id == self.model.get("tinhthanh_id")) {
								arrdonvi.push(item)
							}
						})
						self.$el.find('#donvicaptren').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: arrdonvi,
							value: self.model.get("donvicaptren")
						});
						self.$el.find('#donvicaptren').on('change.gonrin', function (e) {
							self.model.set("donvicaptren", self.$el.find('#donvicaptren').data('gonrin').getValue())
						});

					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			}
			else if (self.model.get("captren_id") == 4) {
				arrdonvi = [];
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						data.objects.forEach(function (item, index) {

							if (3 == item.captren_id && item.quanhuyen_id == self.model.get("quanhuyen_id")) {
								console.log(item)
								arrdonvi.push(item)
							}
						})
						self.$el.find('#donvicaptren').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: arrdonvi,
							value: self.model.get("donvicaptren")
						});
						self.$el.find('#donvicaptren').on('change.gonrin', function (e) {
							self.model.set("donvicaptren", self.$el.find('#donvicaptren').data('gonrin').getValue())
						});
					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			}




		}
	});
});


