define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/sendwarning/tpl/model.html'),
		schema = require('json!schema/SendWarningSchema.json');

	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "sendwarning",
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

			]
		},
		render: function () {
			var self = this;
			var id = this.getApp().getRouter().getParam("id");
			var currentUser = self.getApp().currentUser;
			if (id == null) {
				self.setDonVi();
			}
			// self.bindEventSelect();
			self.applyBindings();
			// self.renderUpload();
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {

						// self.bindEventSelect();

						// self.renderUpload();
						if (self.model.get("ngayguigmail") !== null) {
							self.$el.find("#btn-send-gmail").removeClass("btn-primary");
							self.$el.find("#btn-send-gmail").addClass("btn-success");
							self.$el.find("#btn-send-gmail").html('Đã gửi qua gmail');
						}
						self.setDonVi();
						self.applyBindings();

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
		// renderUpload() {
		// 	var self = this;
		// 	if(self.model.get("tailieu") == null){
		// 		self.$el.find(".linkDownload").hide();
		// 	}
		// 	else{
		// 		self.$el.find(".linkDownload").show();

		// 	}
		// 	self.$el.find(".linkDownload").attr("href", self.model.get("tailieu"));
		// 	self.$el.find(".textDownload").html(self.$el.find(".textDownload").html().slice(41))

		// },
		// saveModel: function () {
		// 	var self = this;


		// 	self.model.save(null, {
		// 		success: function (model, response, options) {
		// 			self.getApp().notify("Lưu thông tin thành công");
		// 			self.getApp().router.refresh();
		// 		},
		// 		error: function (xhr, status, error) {
		// 			try {
		// 				if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
		// 					self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
		// 					self.getApp().getRouter().navigate("login");
		// 				} else {
		// 					self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
		// 				}
		// 			}
		// 			catch (err) {
		// 				self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
		// 			}
		// 		}
		// 	});

		// },
		// bindEventSelect: function () {
		// 	var self = this;
		// 	self.$el.find(".upload_files").on("change", function () {
		// 		var http = new XMLHttpRequest();
		// 		var fd = new FormData();

		// 		var data_attr = $(this).attr("data-attr");

		// 		fd.append('file', this.files[0]);

		// 		http.open('POST', '/api/v1/upload/file');

		// 		http.upload.addEventListener('progress', function (evt) {
		// 			if (evt.lengthComputable) {
		// 				var percent = evt.loaded / evt.total;
		// 				percent = parseInt(percent * 100);
		// 			}
		// 		}, false);
		// 		http.addEventListener('error', function () {
		// 		}, false);

		// 		http.onreadystatechange = function () {
		// 			if (http.status === 200) {
		// 				if (http.readyState === 4) {
		// 					var data_file = JSON.parse(http.responseText), link, p, t;

		// 					self.getApp().notify("Tải file thành công");
		// 					self.model.set(data_attr, data_file.link.replace(" ", "_"));
		// 					var mdel = self.model.get("tailieu");
		// 					self.$el.find(".textDownload").html(self.$el.find(".textDownload").html().slice(16))



		// 					self.$el.find("#btn-send").bind("click", function () {
		// 						$.ajax({
		// 							url: self.getApp().serviceURL + "/api/v1/sendmail",
		// 							method: "POST",
		// 							data: JSON.stringify({
		// 								"id": gonrin.uuid(),
		// 								"email": self.$el.find("#from").val(),
		// 								"subject": self.$el.find("#content").val(),
		// 								"message": self.$el.find("#cc").val(),
		// 								"to": self.$el.find("#to").val(),
		// 								"tailieu": self.getApp().serviceURL + mdel,
		// 							}),
		// 							contentType: "application/json",
		// 							success: function (data) {

		// 								self.getApp().notify({ message: "Đã gửi tin" });
		// 							},
		// 							error: function (xhr, status, error) {
		// 								try {
		// 									if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
		// 										self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
		// 										self.getApp().getRouter().navigate("login");
		// 									} else {
		// 										self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
		// 									}
		// 								} catch (err) {
		// 									self.getApp().notify({ message: "Có lỗi xảy ra, vui lòng thử lại sau" }, { type: "danger", delay: 1000 });
		// 								}
		// 							}
		// 						});


		// 					})
		// 				}
		// 			} else {
		// 				self.getApp().notify("Không thể tải tệp tin lên máy chủ");
		// 			}
		// 		};
		// 		http.send(fd);
		// 	});
		// },

		setDonVi: function () {
			var self = this;
			if (self.model.get("toemail") == null) {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						var danhsachdonvi = [];
						self.$el.find(".multiselect_donvi").html("");
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							if (item.nhanthongbaohaykhong !== "khong") {
								danhsachdonvi.push(item.id);
								var data_str = encodeURIComponent(JSON.stringify(item));
								var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.ten)
								self.$el.find(".multiselect_donvi").append(option_elm);
							}

						}
						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						self.$el.find(".multiselect_donvi").selectpicker('val', danhsachdonvi);
						self.getDonVi();


					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			}
			else {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						self.$el.find(".multiselect_donvi").html("");
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							if (item.nhanthongbaohaykhong !== "khong") {
								var data_str = encodeURIComponent(JSON.stringify(item));
								var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.ten)
								self.$el.find(".multiselect_donvi").append(option_elm);
							}

						}
						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						self.$el.find(".multiselect_donvi").selectpicker('val', self.model.get('toemail'));

						self.getDonVi();
					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			}

		},
		getDonVi: function () {
			var self = this;
			var arrGmail = [];

			var danhsachdonviguithongbao = self.$el.find('.multiselect_donvi select').val();
			self.model.set('toemail', danhsachdonviguithongbao)
			danhsachdonviguithongbao.forEach(function (ite, ind) {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						data.objects.forEach(function (ite2, ind2) {
							if (ite == ite2.id) {
								ite2.user_shield.forEach(function (ite3, ind) {
									arrGmail.push(ite3.email)
								})
							}
						})
					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			})
			self.sendMail(arrGmail);

			self.$el.find('.multiselect_donvi select').on("change", function () {
				arrGmail = [];
				var danhsachdonviguithongbao = self.$el.find('.multiselect_donvi select').val();
				self.model.set('toemail', danhsachdonviguithongbao)

				danhsachdonviguithongbao.forEach(function (item, index) {
					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/donvi",
						method: "GET",
						contentType: "application/json",
						success: function (data) {
							data.objects.forEach(function (item2, index2) {
								if (item == item2.id) {
									item2.user_shield.forEach(function (item3, index3) {
										arrGmail.push(item3.email)
									})
								}
							})
						},
						error: function (xhr, status, error) {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
						},
					});
				})
				self.sendMail(arrGmail);
			})
		},
		sendMail: function (arrGmail) {
			var self = this;

			self.$el.find("#btn-send-gmail").unbind('click').bind("click", function () {
				arrGmail.forEach(function (item, index) {
					$.ajax({
						type: "POST",
						url: "https://upstart.vn/services/api/email/send",
						data: JSON.stringify({
							from: {
								"id": "kien97ym@gmail.com",
								"password": "kocopass_1",
							},
							"to": item,
							"message": self.$el.find("#content").val(),
							// .html() +'Tài liệu đính kèm:'+ self.getApp().serviceURL +self.model.get("tailieu"),
							"subject": self.$el.find("#cc").val(),
						}),
						success: function (response) {
							self.getApp().notify({ message: "Đã gưi thành công" });

						},
						error: function (response) {
							self.getApp().notify({ message: "Tài khoản hoặc mật khẩu gmail không chính xác" }, { type: "danger", delay: 1000 });
						}
					});
				})
				var d = new Date();

				d.getDate();
				console.log(d.getDate())
				self.model.set("ngayguigmail", moment().unix())
				self.model.save(null, {
					success: function (model, respose, options) {
						self.getApp().notify("Lưu thông tin thành công");
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

			})




		},
	});
});