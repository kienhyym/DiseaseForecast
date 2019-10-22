define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/sendzalo/tpl/model.html'),
		schema = require('json!schema/SendZaloSchema.json');

	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "sendzalo",
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





			//UPLOAD FILE
			self.bindEventSelect();
			// self.applyBindings();

			// self.renderUpload();



			self.$el.find("#btn-send").bind("click", function () {
				$.ajax({
					type: "GET",
					url: "https://openapi.zalo.me/v2.0/oa/getprofile?access_token=7oR0H1lc9IKG8Cj56U0k8HCcoKGQ-rKz5rBXF1l-U5fHIy9-0VHc7seoydeNyXTK6JVtIHtmSNXfBif-8ufLStOQr5KXWMvMJHpjR2ktQ5v5A8n-8R0CJ4qelNqGX2HRV1o1VWMCELfRDgv23B1AEmS8o3LAmoa44m6eE6IgIWq80yKVUfua37KXi20BWn8RLG3q3IUaLXri3T5yQR9iRGCDqW5li4atVX3m577GJ7KWGDDoJT9sN0b7wK5wrcPyC7M9S4_g5sygIuTsH4GyyzPK4FiY8W&data={'user_id':'0924025889'}",
					data: "data",
					dataType: "dataType",
					success: function (response) {
						Console.log("xxx",response)
					}
				});
				

				// $.ajax({
				// 	type: "POST",
				// 	url: "https://openapi.zalo.me/v2.0/oa/message?access_token=7oR0H1lc9IKG8Cj56U0k8HCcoKGQ-rKz5rBXF1l-U5fHIy9-0VHc7seoydeNyXTK6JVtIHtmSNXfBif-8ufLStOQr5KXWMvMJHpjR2ktQ5v5A8n-8R0CJ4qelNqGX2HRV1o1VWMCELfRDgv23B1AEmS8o3LAmoa44m6eE6IgIWq80yKVUfua37KXi20BWn8RLG3q3IUaLXri3T5yQR9iRGCDqW5li4atVX3m577GJ7KWGDDoJT9sN0b7wK5wrcPyC7M9S4_g5sygIuTsH4GyyzPK4FiY8W",

				// 	data: JSON.stringify({
				// 		"recipient": {
				// 			"user_id": "phuonglan1102"
				// 		},
				// 		"message": {
				// 			"text": "hello, world!"
				// 		}
				// 	}),
				// 	success: function (response) {
				// 		self.getApp().notify({ message: "Da gui " });

				// 	},
				// 	error: function (response) {
				// 		self.getApp().notify({ message: "Tài khoản hoặc mật khẩu gmail không chính xác" }, { type: "danger", delay: 1000 });
				// 	}


				// });

			})


			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						self.bindEventSelect();
						self.applyBindings();

						self.renderUpload();

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
				// self.registerEvent();


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
		renderUpload() {
			var self = this;




			// var textDownload = self.$el.find(".textDownload");
			// if (!!attr_value) {
			// 	textDownload[i].href = attr_value;
			// 	self.$el.find("#upload-" + key).hide();
			// 	self.$el.find("#download-" + key).show();

			// } else {
			// 	self.$el.find("#upload-" + key).show();
			// 	self.$el.find("#download-" + key).hide();

			// }

			if (self.model.get("tailieu") == null) {
				self.$el.find(".linkDownload").hide();
			}
			else {
				self.$el.find(".linkDownload").show();

			}
			self.$el.find(".linkDownload").attr("href", self.model.get("tailieu"));
			self.$el.find(".textDownload").html(self.$el.find(".textDownload").html().slice(41))

		},
		saveModel: function () {
			var self = this;


			self.model.save(null, {
				success: function (model, response, options) {
					self.getApp().notify("Lưu thông tin thành công");
					self.getApp().router.refresh();
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

		},
		bindEventSelect: function () {
			var self = this;
			self.$el.find(".upload_files").on("change", function () {
				var http = new XMLHttpRequest();
				var fd = new FormData();

				var data_attr = $(this).attr("data-attr");

				fd.append('file', this.files[0]);

				http.open('POST', '/api/v1/upload/file');

				http.upload.addEventListener('progress', function (evt) {
					if (evt.lengthComputable) {
						var percent = evt.loaded / evt.total;
						percent = parseInt(percent * 100);


					}
				}, false);
				http.addEventListener('error', function () {
				}, false);

				http.onreadystatechange = function () {
					if (http.status === 200) {
						if (http.readyState === 4) {
							var data_file = JSON.parse(http.responseText), link, p, t;

							self.getApp().notify("Tải file thành công");
							self.model.set(data_attr, data_file.link.replace(" ", "_"));
							var mdel = self.model.get("tailieu");
							self.$el.find(".textDownload").html(self.$el.find(".textDownload").html().slice(16))





							self.$el.find("#btn-send").bind("click", function () {
								$.ajax({
									url: self.getApp().serviceURL + "/api/v1/sendmail",
									method: "POST",
									data: JSON.stringify({
										"id": gonrin.uuid(),
										"email": self.$el.find("#from").val(),
										"subject": self.$el.find("#content").val(),
										"message": self.$el.find("#cc").val(),
										"to": self.$el.find("#to").val(),
										"tailieu": self.getApp().serviceURL + mdel,
									}),
									contentType: "application/json",
									success: function (data) {

										self.getApp().notify({ message: "Đã gửi tin" });
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
											self.getApp().notify({ message: "Có lỗi xảy ra, vui lòng thử lại sau" }, { type: "danger", delay: 1000 });
										}
									}
								});


							})
						}
					} else {
						self.getApp().notify("Không thể tải tệp tin lên máy chủ");
					}
				};
				http.send(fd);
			});
		},
	});
});