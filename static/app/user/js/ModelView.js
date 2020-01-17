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
		// template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "user",
		bindings: "data-bind",
		state: null,
		// tools: [
		// 	{
		// 		name: "defaultgr",
		// 		type: "group",
		// 		groupClass: "toolbar-group",
		// 		buttons: [
		// 			{
		// 				name: "back",
		// 				type: "button",
		// 				buttonClass: "btn-default btn-sm",
		// 				label: "TRANSLATE:BACK",
		// 				command: function () {
		// 					var self = this;
		// 					Backbone.history.history.back();
		// 				}
		// 			},
		// 			{
		// 				name: "save",
		// 				type: "button",
		// 				buttonClass: "btn-success btn-sm",
		// 				label: "TRANSLATE:SAVE",
		// 				command: function () {

		// 				}
		// 			},
		// 			{
		// 				name: "delete",
		// 				type: "button",
		// 				buttonClass: "btn-danger btn-sm",
		// 				label: "TRANSLATE:DELETE",
		// 				visible: function () {
		// 					return this.getApp().getRouter().getParam("id") !== null;
		// 				},
		// 				command: function () {
		// 					var self = this;
		// 					self.model.destroy({
		// 						success: function (model, response) {
		// 							if (self.getApp().currentUser.config.lang == "VN") {
		// 								self.getApp().notify("Xóa thông tin thành công");
		// 							} else {
		// 								self.getApp().notify("Information deleted successfully");
		// 							} self.getApp().getRouter().navigate(self.collectionName + "/collection");
		// 						},
		// 						error: function (xhr, status, error) {
		// 							try {
		// 								if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
		// 									if (self.getApp().currentUser.config.lang == "VN") {
		// 										self.getApp().notify({ message: "Hết phiên làm việc, vui lòng đăng nhập lại!" }, { type: "danger", delay: 1000 });

		// 									} else {
		// 										self.getApp().notify({ message: "Your session has expired. Please log in again to continue." }, { type: "danger", delay: 1000 });
		// 									} self.getApp().getRouter().navigate("login");
		// 								} else {
		// 									self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
		// 								}
		// 							}
		// 							catch (err) {
		// 								if (self.getApp().currentUser.config.lang == "VN") {
		// 									self.getApp().notify({ message: "Xóa dữ liệu không thành công" }, { type: "danger", delay: 1000 });

		// 								} else {
		// 									self.getApp().notify({ message: "Information deletion failed" }, { type: "danger", delay: 1000 });
		// 								}
		// 							}
		// 						}
		// 					});
		// 				}
		// 			},
		// 		],
		// 	}],
		uiControl: {
			fields: [
				{
					field:"donvi",
					uicontrol:"ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "donvi_id",
					dataSource: DonViSelectView
				},
				{
					field: "kiemduyet",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": "daduyet", "text": "Đã duyệt" },
						{ "value": "chuaduyet", "text": "Chưa duyệt" },
						{ "value": "khongduyet", "text": "Không duyệt" },
						{ "value": "yeucauhuy", "text": "Yêu cầu hủy" },
						{ "value": "dongyhuy", "text": "Duyệt yêu cầu hủy" },
					],
				},
				{
					field: "thongbaoemail",
					uicontrol: "checkbox",
					checkedField: "key",
					valueField: "value",
					dataSource: [{
						"value": "yes",
						"key": true
					},
					{
						"value": "no",
						"key": false
					},
					],
				},
				{
					field: "thongbaosms",
					uicontrol: "checkbox",
					checkedField: "key",
					valueField: "value",
					dataSource: [{
						"value": "yes",
						"key": true
					},
					{
						"value": "no",
						"key": false
					},
					],
				},
				{
					field: "thongbaozalo",
					uicontrol: "checkbox",
					checkedField: "key",
					valueField: "value",
					dataSource: [{
						"value": "yes",
						"key": true
					},
					{
						"value": "no",
						"key": false
					},
					],
				},
			]
		},

		render: function () {
			var self = this;
			var translatedTemplate = gonrin.template(template)(LANG);
			self.$el.html(translatedTemplate);
			// console.log(self.getApp().translate("TIEU_DE"));
			
			self.$el.find(".btn-backid").unbind("click").bind("click", function () {
				Backbone.history.history.back();
			});
			if (window.location.hash.length < 15) {
			
				self.$el.find(".btn-luuid").unbind("click").bind("click", function () {
				self.model.save(null, {
					success: function (model, respose, options) {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify("Lưu thông tin thành công");
							
								$.ajax({
									type: "POST",
									url: "https://upstart.vn/services/api/email/send",
									data: JSON.stringify({
										from: {
											"id": "canhbaosotxuathuyet@gmail.com",
											"password": "kocopass",
										},
										"to": self.model.get('email'),
										"message": 'Thông tin của bạn đã được phê duyệt, Bây giờ bạn có thể nhận được thông báo sốt xuất huyết',
										"subject": 'Thông báo từ hệ thống cảnh báo dịch sốt xuất huyết',
									}),
									success: function (response) {
										if (self.getApp().currentUser.config.lang == "VN") {
											self.getApp().notify("Đã gưi thành công");
										} else {
											self.getApp().notify("sent successfully");
										}
	
									},
									error: function (response) {
										if (self.getApp().currentUser.config.lang == "VN") {
											self.getApp().notify({ message: "Tài khoản hoặc mật khẩu gmail không chính xác" }, { type: "danger", delay: 1000 });
	
										} else {
											self.getApp().notify({ message: "incorrect email account or password" }, { type: "danger", delay: 1000 });
										}
									}
								});
							
						} else {
							self.getApp().notify("Information saved successfully");
								$.ajax({
									type: "POST",
									url: "https://upstart.vn/services/api/email/send",
									data: JSON.stringify({
										from: {
											"id": "canhbaosotxuathuyet@gmail.com",
											"password": "kocopass",
										},
										"to": self.model.get('email'),
										"message": 'Your information has been approved, You can now receive dengue alerts',
										"subject": 'Notice from the system',
									}),
									success: function (response) {
										// if (self.getApp().currentUser.config.lang == "VN") {
										// 	self.getApp().notify("Đã gưi thành công");
										// } else {
										// 	self.getApp().notify("sent successfully");
										// }
	
									},
									error: function (response) {
										// if (self.getApp().currentUser.config.lang == "VN") {
										// 	self.getApp().notify({ message: "Tài khoản hoặc mật khẩu gmail không chính xác" }, { type: "danger", delay: 1000 });
	
										// } else {
										// 	self.getApp().notify({ message: "incorrect email account or password" }, { type: "danger", delay: 1000 });
										// }
									}
								});
							
						} self.getApp().getRouter().navigate(self.collectionName + "/collection");
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
								self.getApp().notify({ message: "Lưu thông tin không thành công!" }, { type: "danger", delay: 1000 });

							} else {
								self.getApp().notify({ message: "Saving information failed" }, { type: "danger", delay: 1000 });
							}
						}
					}
				});
			});
		}
			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						var truoc = self.model.get('kiemduyet')
						self.$el.find(".btn-luuid").unbind("click").bind("click", function () {
							var sau = self.model.get('kiemduyet')			
							self.model.save(null, {
								success: function (model, respose, options) {
									if (self.getApp().currentUser.config.lang == "VN") {
										self.getApp().notify("Lưu thông tin thành công");
										console.log(truoc,sau)
										if(truoc == "chuaduyet" && sau == 'daduyet'){
											$.ajax({
												type: "POST",
												url: "https://upstart.vn/services/api/email/send",
												data: JSON.stringify({
													from: {
														"id": "canhbaosotxuathuyet@gmail.com",
														"password": "kocopass",
													},
													"to": self.model.get('email'),
													"message": 'Thông tin của bạn đã được phê duyệt, Bây giờ bạn có thể nhận được thông báo sốt xuất huyết',
													"subject": 'Thông báo từ hệ thống cảnh báo dịch sốt xuất huyết',
												}),
												success: function (response) {
													if (self.getApp().currentUser.config.lang == "VN") {
														self.getApp().notify("Đã gưi thành công");
													} else {
														self.getApp().notify("sent successfully");
													}
				
												},
												error: function (response) {
													if (self.getApp().currentUser.config.lang == "VN") {
														self.getApp().notify({ message: "Tài khoản hoặc mật khẩu gmail không chính xác" }, { type: "danger", delay: 1000 });
				
													} else {
														self.getApp().notify({ message: "incorrect email account or password" }, { type: "danger", delay: 1000 });
													}
												}
											});
										}
									} else {
										self.getApp().notify("Information saved successfully");
										if(truoc == "chuaduyet" && sau == 'daduyet'){
											$.ajax({
												type: "POST",
												url: "https://upstart.vn/services/api/email/send",
												data: JSON.stringify({
													from: {
														"id": "canhbaosotxuathuyet@gmail.com",
														"password": "kocopass",
													},
													"to": self.model.get('email'),
													"message": 'Your information has been approved, You can now receive dengue alerts',
													"subject": 'Notice from the system',
												}),
												success: function (response) {
													// if (self.getApp().currentUser.config.lang == "VN") {
													// 	self.getApp().notify("Đã gưi thành công");
													// } else {
													// 	self.getApp().notify("sent successfully");
													// }
				
												},
												error: function (response) {
													// if (self.getApp().currentUser.config.lang == "VN") {
													// 	self.getApp().notify({ message: "Tài khoản hoặc mật khẩu gmail không chính xác" }, { type: "danger", delay: 1000 });
				
													// } else {
													// 	self.getApp().notify({ message: "incorrect email account or password" }, { type: "danger", delay: 1000 });
													// }
												}
											});
										}
									} self.getApp().getRouter().navigate(self.collectionName + "/collection");
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
											self.getApp().notify({ message: "Lưu thông tin không thành công!" }, { type: "danger", delay: 1000 });
			
										} else {
											self.getApp().notify({ message: "Saving information failed" }, { type: "danger", delay: 1000 });
										}
									}
								}
							});
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
									if (self.getApp().currentUser.config.lang == "VN") {
										self.getApp().notify("Xóa thông tin thành công");
									} else {
										self.getApp().notify("Information deleted successfully");
									} self.getApp().getRouter().navigate(self.collectionName + "/collection");
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

						self.applyBindings();

					},
					error: function () {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

						} else {
							self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
						}
					},
				});
			} else {
				self.applyBindings();
			}
		},
		setDonVi: function () {
			var self = this;
			self.$el.find('#trangthai').on('change.gonrin', function (e) {
				var idDonViDaChon = $('#trangthai').data('gonrin').getValue();
				console.log(idDonViDaChon)
			})
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
							
							if (self.$el.find("#name").val() == null || self.$el.find("#name").val() == "") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hãy điền tên của bạn." }, { type: "danger", delay: 1000 });
								} else {
									self.getApp().notify({ message: "please ! Please enter your name." }, { type: "danger", delay: 1000 });
								}
							}
							if (self.$el.find("#email").val() == null || self.$el.find("#email").val() == "") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hãy điền địa chỉ email của bạn." }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "please ! Please enter your email address." }, { type: "danger", delay: 1000 });
								}


							}
							if (self.$el.find("#phone_number").val() == null || self.$el.find("#phone_number").val() == "") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hãy điền số điện thoại của bạn." }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "please ! Please enter your phone number." }, { type: "danger", delay: 1000 });
								}
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
										password: 'asdasdc',
										donvi_id: idDonViDaChon,
										captren_stt: donViDaChon.captren_id,
										tinhthanh_id: donViDaChon.tinhthanh_id,
										quanhuyen_id: donViDaChon.quanhuyen_id,
										xaphuong_id: donViDaChon.xaphuong_id,
										donvicaptren_id: donViDaChon.donvicaptren,
										id_nguoitao: self.getApp().currentUser.donvi_id
									}),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (response) {
										if (response) {


											if (self.getApp().currentUser.config.lang == "VN") {
												self.getApp().notify("Đăng ký thành công");
											} else {
												self.getApp().notify("You have signed up successfully.");
											} self.getApp().getRouter().navigate(self.collectionName + "/collection");
										}
									}, error: function (xhr, ere) {
										console.log('xhr', ere);

									}
								})
							}

						});

					});

					self.$el.find(".btn-luu").unbind("click").bind("click", function () {
						if (self.$el.find("#name").val() == null || self.$el.find("#name").val() == "") {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify({ message: "Hãy điền tên của bạn." }, { type: "danger", delay: 1000 });
							} else {
								self.getApp().notify({ message: "please ! Please enter your name." }, { type: "danger", delay: 1000 });
							}
						}
						if (self.$el.find("#email").val() == null || self.$el.find("#email").val() == "") {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify({ message: "Hãy điền địa chỉ email của bạn." }, { type: "danger", delay: 1000 });

							} else {
								self.getApp().notify({ message: "please ! Please enter your email address." }, { type: "danger", delay: 1000 });
							}


						}
						if (self.$el.find("#phone_number").val() == null || self.$el.find("#phone_number").val() == "") {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify({ message: "Hãy điền số điện thoại của bạn." }, { type: "danger", delay: 1000 });

							} else {
								self.getApp().notify({ message: "please ! Please enter your phone number." }, { type: "danger", delay: 1000 });
							}
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
									password: 'asdsavdfad',
									donvi_id: null,
									captren_stt: null,
									tinhthanh_id: null,
									quanhuyen_id: null,
									xaphuong_id: null,
									donvicaptren_id: null,
									id_nguoitao: self.getApp().currentUser.donvi_id
								}),
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (response) {
									if (response) {
										if (self.getApp().currentUser.config.lang == "VN") {
											self.getApp().notify("Đăng ký thành công");
										} else {
											self.getApp().notify("You have signed up successfully.");
										} self.getApp().getRouter().navigate(self.collectionName + "/collection");
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
						}, 300);
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
							if (self.$el.find("#name").val() == null || self.$el.find("#name").val() == "") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hãy điền tên của bạn." }, { type: "danger", delay: 1000 });
								} else {
									self.getApp().notify({ message: "please ! Please enter your name." }, { type: "danger", delay: 1000 });
								}
							}
							if (self.$el.find("#email").val() == null || self.$el.find("#email").val() == "") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hãy điền địa chỉ email của bạn." }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "please ! Please enter your email address." }, { type: "danger", delay: 1000 });
								}


							}
							if (self.$el.find("#phone_number").val() == null || self.$el.find("#phone_number").val() == "") {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Hãy điền số điện thoại của bạn." }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "please ! Please enter your phone number." }, { type: "danger", delay: 1000 });
								}
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
										password: 'asvervac',
										donvi_id: idDonViDaChon,
										captren_stt: donViDaChon.captren_id,
										tinhthanh_id: donViDaChon.tinhthanh_id,
										quanhuyen_id: donViDaChon.quanhuyen_id,
										xaphuong_id: donViDaChon.xaphuong_id,
										donvicaptren_id: donViDaChon.donvicaptren,
										id_nguoitao: self.model.get("id_nguoitao")
									}),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (response) {
										if (response) {
											if (self.getApp().currentUser.config.lang == "VN") {
												self.getApp().notify("Đăng ký thành công");
											} else {
												self.getApp().notify("You have signed up successfully.");
											} self.getApp().getRouter().navigate(self.collectionName + "/collection");
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
						}, 300);				console.log(idDonViDaChon)

					});
				},
				error: function (xhr, status, error) { }
			});
		},
	});
});