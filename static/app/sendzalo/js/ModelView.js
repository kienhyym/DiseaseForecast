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
			self.renderUpload();

			self.applyBindings();
			var url = self.getApp().serviceURL + "/api/v1/user"

			$.ajax({
				url: url,
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					var rabit = [];

					data.objects.forEach(function (item, index) {
						item.userconnectionchannels.forEach(function (item2, index2) {
							if (item2.channelname == "Phone") {
								rabit.push(item2.value)
							}
						})
						self.$el.find("#to").val(rabit)
					})
					console.log(rabit)
				},
				error: function (xhr, status, error) {
					try {
						if (($.parseJSON(xhr.responseText).error_code) === "SESSION_EXPIRED") {
							self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
							self.getApp().getRouter().navigate("login");
						} else {
							self.getApp().notify({ message: $.parseJSON(xhr.responseText).error_message }, { type: "danger", delay: 1000 });
						}
					}
					catch (err) {
						self.getApp().notify({ message: "Không tìm thấy thông số" }, { type: "danger", delay: 1000 });
					}
				}
			});

			self.$el.find("#btn-send").bind("click", function () {
				var arr = self.$el.find("#to").val();
				var res = arr.split(',');
				res.forEach(function (item) {
					var URL = "https://openapi.zalo.me/v2.0/oa/getprofile?access_token=1r2tNP-US4m8LhnSdPXxI0jGlbsUWpqt2ZgeT-7n9XaFQf1VuTuZDdTaasgGq2WQOsVaV93CVMbxTkSKlTjdG2zZf3wv-cXGK63N4xYbRq1G0AWreCup8cv0dL-Qa0LER0ErNPsV3mqGCRz_YO8E8M4Job2IgLiG1c32K9_gG4T-Uk8CxBP9QIDzxG3HrLTFF7dQ3Vtf7qmLM9afqiW0H4TgbXIXxWrZRNdAC-3NS3e5G-fazlDA3pXivaBhz4XN7rpnEl3sNMOcG9eLpCuYPg3zz2IKWtTB&data={'user_id':'" + item + "'}";
					console.log(URL)

					$.ajax({
						type: "GET",
						url: URL,
						// url: "https://openapi.zalo.me/v2.0/oa/getfollowers?access_token=32BFHeZT1Zq39CH7YjiDEG0YnaQ9m4jaOaZfOhEpSazd6EvpbU5L2nfP_WVpnqiQVdo90FE07ZWY2vKzseW4HKi0d7k-lYm6K4ha2QgqLIzPJfmOeie912joaJlvnXWY5sU98lxHDrikS89AsEWxLoiNyMpnccra91Fc6-wgHHWB5SKVqUjUDXLFt1kGo6fdU6x8I9NLKN9pSvvUkujJTsiU-42-_qHcUrpcVVx7QbntMVb_aiPq1XrUndl9mNT31rZ0HElL2N0sIgDJnyvhMhpC-aw3m04w&data={'offset':0,'count':5}",
						//url: "https://openapi.zalo.me/v2.0/oa/getoa?access_token=1r2tNP-US4m8LhnSdPXxI0jGlbsUWpqt2ZgeT-7n9XaFQf1VuTuZDdTaasgGq2WQOsVaV93CVMbxTkSKlTjdG2zZf3wv-cXGK63N4xYbRq1G0AWreCup8cv0dL-Qa0LER0ErNPsV3mqGCRz_YO8E8M4Job2IgLiG1c32K9_gG4T-Uk8CxBP9QIDzxG3HrLTFF7dQ3Vtf7qmLM9afqiW0H4TgbXIXxWrZRNdAC-3NS3e5G-fazlDA3pXivaBhz4XN7rpnEl3sNMOcG9eLpCuYPg3zz2IKWtTB",
						data: "data",
						dataType: 'json',
						success: function (response) {
							console.log('aaa', response.data.user_id);
							$.ajax({
								type: "POST",
								url: "https://openapi.zalo.me/v2.0/oa/message?access_token=1r2tNP-US4m8LhnSdPXxI0jGlbsUWpqt2ZgeT-7n9XaFQf1VuTuZDdTaasgGq2WQOsVaV93CVMbxTkSKlTjdG2zZf3wv-cXGK63N4xYbRq1G0AWreCup8cv0dL-Qa0LER0ErNPsV3mqGCRz_YO8E8M4Job2IgLiG1c32K9_gG4T-Uk8CxBP9QIDzxG3HrLTFF7dQ3Vtf7qmLM9afqiW0H4TgbXIXxWrZRNdAC-3NS3e5G-fazlDA3pXivaBhz4XN7rpnEl3sNMOcG9eLpCuYPg3zz2IKWtTB",
								data: JSON.stringify({
									"recipient": {
										"user_id": response.data.user_id
									},
									"message": {
										"text": self.$el.find("#content").val(),
									}
								}),
								success: function (response) {
									self.getApp().notify({ message: "Da gui " });
								},
								error: function (response) {
									self.getApp().notify({ message: "Tài khoản hoặc mật khẩu gmail không chính xác" }, { type: "danger", delay: 1000 });
								}
							});


						}, error: function (response) {
							self.getApp().notify({ message: "lỗi rồi" }, { type: "danger", delay: 1000 });
						}

					});

					// $.ajax({
					// 	url: self.getApp().serviceURL + "/api/v1/sendzalo",
					// 	method: "POST",
					// 	data: JSON.stringify({
					// 		"id": gonrin.uuid(),
					// 		"message": self.$el.find("#cc").val(),
					// 		"to": self.$el.find("#to").val(),
					// 		"tailieu": self.getApp().serviceURL + mdel,
					// 	}),
					// 	contentType: "application/json",
					// 	success: function (data) {

					// 		self.getApp().notify({ message: "Đã gửi tin" });
					// 	},
					// 	error: function (xhr, status, error) {
					// 		try {
					// 			if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
					// 				self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
					// 			} else {
					// 				self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
					// 			}
					// 		} catch (err) {
					// 			self.getApp().notify({ message: "Có lỗi xảy ra, vui lòng thử lại sau" }, { type: "danger", delay: 1000 });
					// 		}
					// 	}
					// });
				})


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





