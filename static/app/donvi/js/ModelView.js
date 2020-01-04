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
		// template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "donvi",

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
				// {
				// 	field: "captren_id",
				// 	uicontrol: "combobox",
				// 	textField: "text",
				// 	valueField: "value",

				// 	dataSource: [
				// 		{ "value": 1, "text": "Cấp cục" },
				// 		{ "value": 2, "text": "Cấp tỉnh" },
				// 		{ "value": 3, "text": "Cấp huyện" },
				// 		{ "value": 4, "text": "Cấp xã" },
				// 	],
				// },

			]
		},
		render: function () {
			var self = this;
			var captrenID = [];
			var translatedTemplate = gonrin.template(template)(LANG);
			self.$el.html(translatedTemplate);

			if (self.getApp().currentUser.config.lang == "VN") {
				self.$el.find('#captren').combobox({
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": 1, "text": "Cấp cục" },
						{ "value": 2, "text": "Cấp tỉnh" },
						{ "value": 3, "text": "Cấp huyện" },
						{ "value": 4, "text": "Cấp xã" },
					]
				});
			} 
			else {
				self.$el.find('#captren').combobox({
					textField: "text",
					valueField: "value",
					dataSource: [
					{ "value": 1, "text": "Department" },
					{ "value": 2, "text": "Province/city" },
					{ "value": 3, "text": "District" },
					{ "value": 4, "text": "Commune" },
				]
			});
			
			}
			
			if (self.getApp().currentUser.config.lang == "VN") {
				self.$el.find('#captren').combobox({
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": "co", "text": "Nhận cảnh bảo" },
						{ "value": "khong", "text": "Không nhận cảnh bảo" },
					]
				});
			} 
			else {
				self.$el.find('#nhanthongbaohaykhong').combobox({
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": "co", "text": "Get notifications" },
						{ "value": "khong", "text": "No notification received" },
				]
			});
			
			}



			self.$el.find(".btn-back").unbind("click").bind("click", function () {
				Backbone.history.history.back();
			});
			self.$el.find(".btn-luu").unbind("click").bind("click", function () {
				self.model.save(null, {
					success: function (model, respose, options) {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify("Lưu thông tin thành công");
						} else {
							self.getApp().notify("Information saved successfully");
						}

						self.getApp().getRouter().navigate(self.collectionName + "/collection");
					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hết phiên làm việc, vui lòng đăng nhập lại!" }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "Your session has expired. Please log in again to continue." }, { type: "danger", delay: 1000 });
								}
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify({ message: "Lưu thông tin không thành công!" }, { type: "danger", delay: 1000 });

							} else {
								self.getApp().notify({ message: "Saving information failed" }, { type: "danger", delay: 1000 });
							}
						}
					}
				});
			});

			if (window.location.hash.length < 15) {
				self.$el.find(".user").hide();

				if (self.getApp().currentUser.captren_stt == 1) {
					self.model.set("captren_id", 2)
					// self.model.on("change:tinhthanh_id", function () {
					// 	self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
					// });
					// self.model.on("change:quanhuyen_id", function () {
					// 	self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
					// });
				}
				else if (self.getApp().currentUser.captren_stt == 2) {
					self.model.set("captren_id", 3)
					// self.model.set("tinhthanh", self.getApp().currentUser.tinhthanh)
					// self.$el.find(".tinhthanh").css({ "pointer-events": "none", "opacity": "0.755" })
					// self.model.on("change", function () {
					// 	self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.getApp().currentUser.tinhthanh_id } });
					// })
					// self.model.on("change:quanhuyen_id", function () {
					// 	self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
					// });
				}
				else if (self.getApp().currentUser.captren_stt == 3) {
					self.model.set("captren_id", 4)
					// self.model.set("tinhthanh", self.getApp().currentUser.tinhthanh)
					// self.model.set("quanhuyen", self.getApp().currentUser.quanhuyen)
					// self.$el.find(".tinhthanh").css({ "pointer-events": "none", "opacity": "0.755" })
					// self.$el.find(".quanhuyen").css({ "pointer-events": "none", "opacity": "0.755" })
					// self.model.on("change", function () {
					// 	self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.getApp().currentUser.quanhuyen_id } });
					// });
				}
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
					method: "GET",
					contentType: "application/json",
					success: function (data) {

						var arrDonViCapTren = [];
						data.objects.forEach(function (item, index) {
							if (self.getApp().currentUser.donvi_id == item.id) {
								arrDonViCapTren.push(item)
							}

						})
						self.$el.find('#donvicaptren').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: arrDonViCapTren,
							value: self.getApp().currentUser.donvi_id
						});
						self.model.set("donvicaptren", self.getApp().currentUser.donvi_id)

					},
					error: function (xhr, status, error) {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

						} else {
							self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
						}
					},
				});
			}

			var id = this.getApp().getRouter().getParam("id");
			$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
			self.$el.find("#multiselect_required").selectpicker();
			if (self.getApp().currentUser.config.lang == "EN") {
				self.model.on('change:tinhthanh_id',function(){
					var tinhthanhEN = self.$el.find('.tinhthanh .input-group .ref-form-control').text()
					var str = tinhthanhEN;
				str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
				str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
				str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
				str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
				str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
				str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
				str = str.replace(/đ/g,"d");
				str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
				str = str.replace(/ + /g," ");
				str = str.replace("Tinh",""); 
				str = str.replace("Thanh pho",""); 

				str = str.trim(); 
				self.$el.find('.tinhthanh .input-group .ref-form-control').html(str)
				})
				
				self.model.on('change:quanhuyen_id',function(){

				var quanhuyenEN = self.$el.find('.quanhuyen .input-group .ref-form-control').text()
				var str = quanhuyenEN;
				str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
				str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
				str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
				str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
				str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
				str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
				str = str.replace(/đ/g,"d");
				str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
				str = str.replace(/ + /g," ");
				str = str.replace("Quan",""); 
				str = str.replace("Huyen",""); 
				str = str.replace("Thi xa",""); 

				str = str.trim(); 
				self.$el.find('.quanhuyen .input-group .ref-form-control').html(str)
				})
				self.model.on('change:xaphuong_id',function(){

				var xaphuongEN = self.$el.find('.xaphuong .input-group .ref-form-control').text()
				var str = xaphuongEN;
				str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
				str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
				str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
				str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
				str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
				str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
				str = str.replace(/đ/g,"d");
				str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
				str = str.replace(/ + /g," ");
				str = str.replace("Xa",""); 
				str = str.replace("Phuong",""); 

				str = str.trim(); 
				self.$el.find('.xaphuong .input-group .ref-form-control').html(str)
				})
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
						// self.$el.find(".tinhthanh").css({ "pointer-events": "none", "opacity": "0.755" })
						// self.$el.find(".quanhuyen").css({ "pointer-events": "none", "opacity": "0.755" })
						// self.$el.find(".xaphuong").css({ "pointer-events": "none", "opacity": "0.755" })
						self.$el.find(".btn-xoa").unbind("click").bind('click', function () {
							self.model.destroy({
								success: function (model, response) {
									if (self.getApp().currentUser.config.lang == "VN") {
										self.getApp().notify("Xóa thông tin thành công");
									} else {
										self.getApp().notify("Information deleted successfully");
									}

									self.getApp().getRouter().navigate(self.collectionName + "/collection");
								},
								error: function (xhr, status, error) {
									try {
										if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
											if (self.getApp().currentUser.config.lang == "VN") {
												self.getApp().notify({ message: "Hết phiên làm việc, vui lòng đăng nhập lại!" }, { type: "danger", delay: 1000 });

											} else {
												self.getApp().notify({ message: "Your session has expired. Please log in again to continue." }, { type: "danger", delay: 1000 });
											} self.getApp().getRouter().navigate("login");
										} else {
											self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
										}
									}
									catch (err) {
										if (self.getApp().currentUser.config.lang == "VN") {
											self.getApp().notify({ message: "Xóa dữ liệu không thành công" }, { type: "danger", delay: 1000 });

										} else {
											self.getApp().notify({ message: "Information deletion failed" }, { type: "danger", delay: 1000 });
										}
									}
								}
							});
						})
						if (self.getApp().currentUser.config.lang == "EN") {
							var tinhthanhEN = self.$el.find('.tinhthanh .input-group .ref-form-control').text()
							var str = tinhthanhEN;
							str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
							str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
							str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
							str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
							str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
							str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
							str = str.replace(/đ/g,"d");
							str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
							str = str.replace(/ + /g," ");
							str = str.replace("Tinh",""); 
							str = str.replace("Thanh pho",""); 

							str = str.trim(); 
							self.$el.find('.tinhthanh .input-group .ref-form-control').html(str)

							var quanhuyenEN = self.$el.find('.quanhuyen .input-group .ref-form-control').text()
							var str = quanhuyenEN;
							str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
							str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
							str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
							str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
							str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
							str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
							str = str.replace(/đ/g,"d");
							str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
							str = str.replace(/ + /g," ");
							str = str.replace("Quan",""); 
							str = str.replace("Huyen",""); 
							str = str.replace("Thi xa",""); 

							str = str.trim(); 
							self.$el.find('.quanhuyen .input-group .ref-form-control').html(str)


							var xaphuongEN = self.$el.find('.xaphuong .input-group .ref-form-control').text()
							var str = xaphuongEN;
							str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
							str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
							str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
							str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
							str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
							str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
							str = str.replace(/đ/g,"d");
							str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
							str = str.replace(/ + /g," ");
							str = str.replace("Xa",""); 
							str = str.replace("Phuong",""); 

							str = str.trim(); 
							self.$el.find('.xaphuong .input-group .ref-form-control').html(str)
						} 
						

					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hết phiên làm việc, vui lòng đăng nhập lại!" }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "Your session has expired. Please log in again to continue." }, { type: "danger", delay: 1000 });
								}
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						} catch (err) {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify({ message: "Bạn chưa là thành viên của đơn vị nào" }, { type: "danger", delay: 1000 });

							} else {
								self.getApp().notify({ message: "You are not a member of any units" }, { type: "danger", delay: 1000 });
							}
						}
					}
				});
			} else {
				self.applyBindings();
				self.model.on("change:tinhthanh_id", function () {

					self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });

				});

				self.model.on("change:quanhuyen_id", function () {

					self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });

				});
			}

		},

		danhSachUser: function () {
			var self = this;
			var filters = {
				filters: {
					"$and": [
						{ "donvi_id": { "$eq": self.model.get("id") } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					if (self.getApp().currentUser.config.lang == "VN") {
						data.objects.forEach(function (item, indexrole) {
							self.$el.find('#danhsach_users').append('<tr class="record"><td class="p-0" style="line-height:40px;font-size:12px;">' + item.name + '</td>' +
								'<td class="p-1"><select class="selectpicker form-control multiselect_thongbao" multiple data-live-search="true" data-actions-box="true" data-noneSelectedText="Chọn loại thông báo" title="Chọn loại thông báo"></select></td>'
								+ '<td class="p-0" style="line-height:40px;font-size:12px;">' + item.email + '</td><td class="p-0" style="line-height:40px;font-size:12px;">' + item.phone_number + '</td><td class="p-0 phonezalo" style="line-height:40px;font-size:12px;">' + item.phone_zalo + '</td><td class="p-1"><input type="text" class="form-control loaivaitro" ></td><td class="p-0 pt-1"><button class="btn btn-danger del">X</button></td></tr>');
						})
					} else {
						data.objects.forEach(function (item, indexrole) {
							self.$el.find('#danhsach_users').append('<tr class="record"><td class="p-0" style="line-height:40px;font-size:12px;">' + item.name + '</td>' +
								'<td class="p-1"><select class="selectpicker form-control multiselect_thongbao" multiple data-live-search="true" data-actions-box="true" data-noneSelectedText="Notification type" title="Notification type"></select></td>'
								+ '<td class="p-0" style="line-height:40px;font-size:12px;">' + item.email + '</td><td class="p-0" style="line-height:40px;font-size:12px;">' + item.phone_number + '</td><td class="p-0 phonezalo" style="line-height:40px;font-size:12px;">' + item.phone_zalo + '</td><td class="p-1"><input type="text" class="form-control loaivaitro" ></td><td class="p-0 pt-1"><button class="btn btn-danger del">X</button></td></tr>');
						})
					}
					
					self.setvaitro();
					self.getThongBao();
					self.xoaNguoiDung();
				},
				error: function (xhr, status, error) {
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
					}
				},
			});



		},

		setvaitro: function () {
			var self = this;
			var filters = {
				filters: {
					"$and": [
						{ "donvi_id": { "$eq": self.model.get("id") } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					var vaitro = [];

					if (self.getApp().currentUser.config.lang == "VN") {
						vaitro = [{ loaivaitro: "Quản lý", id: 'quanly' },
						{ loaivaitro: "Nhân viên", id: 'nhanvien' }];
					} else {
						vaitro = [{ loaivaitro: "manager", id: 'quanly' },
						{ loaivaitro: "membership", id: 'nhanvien' }]
					}

					data.objects.forEach(function (item, index) {
						$(self.$el.find('.loaivaitro')[index]).combobox({
							textField: "loaivaitro",
							valueField: "id",
							dataSource: vaitro,
							value: item.phancapnhanbaocao,
							refresh: true
						});
						$(self.$el.find('.loaivaitro')[index]).on('change.gonrin', function (e) {
							var phanloainhanbaocao = {
								phancapnhanbaocao: $(self.$el.find('.loaivaitro')[index]).data('gonrin').getValue()
							}

							self.$el.find('.btn-success').bind("click", function () {
								$.ajax({
									url: self.getApp().serviceURL + "/api/v1/user/" + item.id,
									method: "PUT",
									data: JSON.stringify(phanloainhanbaocao),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (data, res) {
										self.getApp().getRouter().refresh();
									},
									error: function (xhr, status, error) {
										if (self.getApp().currentUser.config.lang == "VN") {
											self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

										} else {
											self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
										}
									},
								});
							})
						});
					})
				},
				error: function (xhr, status, error) {
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
					}
				},
			});

		},
		getThongBao: function () {
			var self = this;
			var self = this;
			var filters = {
				filters: {
					"$and": [
						{ "donvi_id": { "$eq": self.model.get("id") } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {

						//danh sach loai thong bao đã lưu
						var loaiThongBao = self.$el.find(".multiselect_thongbao")[index]
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/role",
							method: "GET",
							contentType: "application/json",
							success: function (data) {
								data.objects.forEach(function (itemrole, indexrole) {
									var data_str = encodeURIComponent(JSON.stringify(itemrole));
									var option_elm = $('<option>').attr({ 'value': itemrole.id, 'data-ck': data_str }).html(itemrole.description)
									$(loaiThongBao).append(option_elm);

								});
								$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
								var IdRole = [];
								(item.roles).forEach(function (idrole) {
									IdRole.push(idrole.id)

								})
								$(loaiThongBao).selectpicker('val', IdRole);

							},
							error: function (xhr, status, error) {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
								}
							},
						});

						// Lưu loại thông báo mới
						$(loaiThongBao).on("change", function () {
							var mangLoaiThongBao = [];

							var mangIdLoaiThongBao = $(loaiThongBao).val();
							if (mangIdLoaiThongBao.length == 0) {
								self.$el.find('.btn-success').bind("click", function () {
									$.ajax({
										url: self.getApp().serviceURL + "/api/v1/user/" + item.id,
										method: "PUT",
										data: JSON.stringify({
											roles: mangLoaiThongBao
										}),
										headers: {
											'content-type': 'application/json'
										},
										dataType: 'json',
										success: function (data, res) {
											self.getApp().getRouter().refresh();
										},
										error: function (xhr, status, error) {
											if (self.getApp().currentUser.config.lang == "VN") {
												self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

											} else {
												self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
											}
										},
									});
								})
							}
							mangIdLoaiThongBao.forEach(function (itemIdRole, indexIdRole) {
								$.ajax({
									url: self.getApp().serviceURL + "/api/v1/role",
									method: "GET",
									contentType: "application/json",
									success: function (data) {
										data.objects.forEach(function (itemrole, indexrole) {
											if (itemIdRole == itemrole.id) {
												mangLoaiThongBao.push(itemrole)
											}

										});

										self.$el.find('.btn-success').bind("click", function () {
											$.ajax({
												url: self.getApp().serviceURL + "/api/v1/user/" + item.id,
												method: "PUT",
												data: JSON.stringify({
													roles: mangLoaiThongBao
												}),
												headers: {
													'content-type': 'application/json'
												},
												dataType: 'json',
												success: function (data, res) {
													self.getApp().getRouter().refresh();
												},
												error: function (xhr, status, error) {
													if (self.getApp().currentUser.config.lang == "VN") {
														self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

													} else {
														self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
													}
												},
											});
										})
									},
									error: function (xhr, status, error) {
										if (self.getApp().currentUser.config.lang == "VN") {
											self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

										} else {
											self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
										}
									},
								});
							})


						})



					});
				},
				error: function (xhr, status, error) {
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
					}
				},
			});


		},

		xoaNguoiDung: function () {
			var self = this;
			var filters = {
				filters: {
					"$and": [
						{ "donvi_id": { "$eq": self.model.get("id") } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {


					data.objects.forEach(function (item, index) {
						var xoa = self.$el.find('.del')[index]
						$(xoa).bind("click", function () {
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/user/" + item.id,
								method: "PUT",
								data: JSON.stringify({

									donvi_id: null,
									donvicaptren_id: null,
									roles: [],
									phancapnhanbaocao: null,
									captren_stt: null,
								}),
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (data, res) {
									self.getApp().getRouter().refresh();
								},
								error: function (xhr, status, error) {
									if (self.getApp().currentUser.config.lang == "VN") {
										self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

									} else {
										self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
									}
								},
							});

						});
					})
				},
				error: function (xhr, status, error) {
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
					}
				},
			});
		},

		aiDuocChinhSua: function () {
			var self = this;
			var currentUser = self.getApp().currentUser;
			if (currentUser.phancapnhanbaocao !== "quanly") {
				self.$el.find(".toolbar").css("display", "none");

			}

		},
		donViCapTren: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					var arrdonvi = [];
					data.objects.forEach(function (item, index) {
						if (self.model.get("donvicaptren") == item.id) {
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
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
					}
				},
			});
		},

	});
});


