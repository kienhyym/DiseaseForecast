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
						{ "value": 1, "text": "Cấp tỉnh" },
						{ "value": 2, "text": "Cấp huyện" },
						{ "value": 3, "text": "Cấp xã" },

					],
				},
			]
		},
		render: function () {
			var self = this;
			var id = this.getApp().getRouter().getParam("id");

			$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
			self.$el.find("#multiselect_required").selectpicker();

			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
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
			var rabit = self.model.get('user_shield');



			rabit.forEach(function (item, index) {
				self.$el.find('#danhsach_users').append('<tr class="record"><td class="p-0" style="line-height:40px;font-size:12px;">' + item.name + '</td>' +
					'<td class="p-1"><select class="selectpicker form-control multiselect_vaitro" multiple data-live-search="true" data-actions-box="true" data-noneSelectedText="Chọn vai trò" title="Chọn vai trò"></select></td>'
					+ '<td class="p-0" style="line-height:40px;font-size:12px;">' + item.email + '</td><td class="p-0" style="line-height:40px;font-size:12px;">' + item.phone_number + '</td><td class="p-0" style="line-height:40px;font-size:12px;">' + item.phone_zalo + '</td><td class="p-1"><input type="text" class="form-control loaithongbao" ></td><td class="p-0 pt-1"><button class="btn btn-danger del">X</button></td></tr>');

				self.$el.find('.loaithongbao').combobox({
					textField: "loaithongbao",
					valueField: "id",
					dataSource: [
						{ loaithongbao: "Nhận thông báo loại 1", id: 'loai1' },
						{ loaithongbao: "Nhận thông báo loại 2", id: 'loai2' },
						{ loaithongbao: "Nhận thông báo loại 3", id: 'loai3' },
						{ loaithongbao: "Không nhận thông báo", id: 'loai4' },
					],
				});
			})
			self.getVaiTro();






			self.$el.find('.loaithongbao').each(function (index, item) {
				index, self.$el.find(item).data('gonrin').setValue(userShield[index].phancapnhanbaocao);
			})

			self.$el.find('.loaithongbao').each(function (item, index) {
				index.onchange = function (e) {
					userShield[item].phancapnhanbaocao = index.value;
					self.model.set("user_shield", userShield);
				};
			})
			self.$el.find('.del').each(function (item, index) {
				self.$el.find(index).unbind('click').bind('click', function () {
					var userShield2 = self.model.get("user_shield");
					userShield2.splice(item, 1);
					$(self.$el.find('.record')[item]).remove();
					self.model.set("user_shield", userShield2);

				})
			})


		},
		getVaiTro: function () {
			var self = this;
			var url = self.getApp().serviceURL + "/api/v1/role";
			self.$el.find(".multiselect_vaitro").each(function (item, index) {

				$.ajax({
					url: url,
					method: "GET",
					contentType: "application/json",
					success: function (data) {

						$(index).html("");
						for (var i = 0; i < data.objects.length; i++) {
							var item1 = data.objects[i];
							var data_str = encodeURIComponent(JSON.stringify(item1));
							var option_elm = $('<option>').attr({ 'value': item1.id, 'data-ck': data_str }).html(item1.name)
							$(index).append(option_elm);
						}
						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/user",
							method: "GET",
							contentType: "application/json",
							success: function (data) {
								data.objects.forEach(function (index2, item2) {
									if (item2 == item) {
										var danhmuclinhvuc_foreign = index2.roles;
										var val_vaitro = [];
										if (val_vaitro !== null) {
											for (var i = 0; i < danhmuclinhvuc_foreign.length; i++) {
												val_vaitro.push(danhmuclinhvuc_foreign[i].id);
											}
										}
										$(index).selectpicker('val', val_vaitro);
									}
								})
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

					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/user",
						method: "GET",
						contentType: "application/json",
						success: function (data2) {
							var userRole = [];
							data2.objects.forEach(function (index2, item2) {
								if (item2 == item) {
									$.ajax({
										url: self.getApp().serviceURL + "/api/v1/role",
										method: "GET",
										contentType: "application/json",
										success: function (data3) {
											data3.objects.forEach(function (index3, item3) {
												var xxx = $(index).val();
												xxx.forEach(function (index4, item4) {
													if (index4 == index3.id) {
														userRole.push(index3)
													}
												})
											})
											var param = {
												roles: userRole
											}
											self.$el.find('.btn-success').bind("click", function () {
												$.ajax({
													url: self.getApp().serviceURL + "/api/v1/user/" + index2.id,
													method: "PUT",
													data: JSON.stringify(param),
													headers: {
														'content-type': 'application/json'
													},
													dataType: 'json',
													success: function () {
													},
													error: function (xhr, status, error) {
														self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
													},
												});
											})

										},
										error: function (xhr, status, error) {
											self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
										},
									});
								}
							})
						},
						error: function (xhr, status, error) {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
						},
					});
				})
			})






		},
	});
});