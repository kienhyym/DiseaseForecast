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
					// {
					// 	name: "save",
					// 	type: "button",
					// 	buttonClass: "btn-success btn-sm",
					// 	label: "TRANSLATE:SAVE",
					// 	command: function () {
					// 		var self = this;
					// 		self.model.save(null, {
					// 			success: function (model, respose, options) {
					// 				self.getApp().notify("Lưu thông tin thành công");
					// 			},
					// 			error: function (xhr, status, error) {
					// 				try {
					// 					if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
					// 						self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
					// 						self.getApp().getRouter().navigate("login");
					// 					} else {
					// 						self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
					// 					}
					// 				}
					// 				catch (err) {
					// 					self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
					// 				}
					// 			}
					// 		});
					// 	}
					// },
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
				self.setCanhBao();

			}

			self.bindEventSelect();
			self.applyBindings();
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {

						// self.bindEventSelect();

						self.renderUpload();
						if (self.model.get("ngayguigmail") !== null) {
							self.$el.find("#btn-send-gmail").removeClass("btn-primary");
							self.$el.find("#btn-send-gmail").addClass("btn-success");
							self.$el.find("#btn-send-gmail").html('Đã gửi qua gmail');
						}
						if (self.model.get("ngayguizalo") !== null) {
							self.$el.find("#btn-send-zalo").removeClass("btn-primary");
							self.$el.find("#btn-send-zalo").addClass("btn-success");
							self.$el.find("#btn-send-zalo").html('Đã gửi qua gmail');
						}
						if (self.model.get("ngayguiphone") !== null) {
							self.$el.find("#btn-send-phone").removeClass("btn-primary");
							self.$el.find("#btn-send-phone").addClass("btn-success");
							self.$el.find("#btn-send-phone").html('Đã gửi qua gmail');
						}
						self.setDonVi();
						self.setCanhBao();
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
		renderUpload() {
			var self = this;
			if(self.model.get("tailieu") == null){
				self.$el.find(".linkDownload").hide();
			}
			else{
				self.$el.find(".linkDownload").show();

			}
			self.$el.find(".linkDownload").attr("href", self.model.get("tailieu"));
			self.$el.find(".textDownload").html('aaaaa');
				// (self.$el.find(".linkDownload").html()).slice(51))

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
							self.model.set(data_attr, data_file.link);
						}
					} else {
						self.getApp().notify("Không thể tải tệp tin lên máy chủ");
					}
				};
				http.send(fd);
			});
		},

		setDonVi: function () {
			var self = this;
			let capduoiid = null;
			if(self.getApp().currentUser.donvi_captren_id ==1){
				capduoiid = 2;
			}
			else if(self.getApp().currentUser.donvi_captren_id ==2){
				capduoiid = 3;
			}
			else{
				capduoiid = 4;
			}

			if (self.model.get("toemail") == null) {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						var danhsachdonvi = [];
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							if (item.nhanthongbaohaykhong !== "khong" && item.captren_id == capduoiid) {
								if(self.getApp().currentUser.donvi_captren_id == 1){
									danhsachdonvi.push(item.id);
									var data_str = encodeURIComponent(JSON.stringify(item));
									var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.ten)
									self.$el.find(".multiselect_donvi").append(option_elm);
								}	
								
								if(self.getApp().currentUser.donvi_captren_id == 2){
									if(self.getApp().currentUser.tinhthanh__id == item.tinhthanh_id){
										danhsachdonvi.push(item.id);
									var data_str = encodeURIComponent(JSON.stringify(item));
									var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.ten)
									self.$el.find(".multiselect_donvi").append(option_elm);
									}
								}
								if(self.getApp().currentUser.donvi_captren_id == 3){
									if(self.getApp().currentUser.quanhuyen_id == item.quanhuyen_id){
										danhsachdonvi.push(item.id);
									var data_str = encodeURIComponent(JSON.stringify(item));
									var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.ten)
									self.$el.find(".multiselect_donvi").append(option_elm);
									}
								}
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
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							if (item.nhanthongbaohaykhong !== "khong" && item.captren_id == capduoiid) {
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
			var arrZalo = [];
			var danhsachdonviguithongbao = self.$el.find('.multiselect_donvi select').val();
			self.model.set("toemail", danhsachdonviguithongbao)

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
									arrZalo.push(ite3.phone_zalo)
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
			self.sendzalo(arrZalo);

			self.$el.find('.multiselect_donvi select').on("change", function () {
				arrGmail = [];
				arrZalo = [];
				var danhsachdonviguithongbao = self.$el.find('.multiselect_donvi select').val();
				self.model.set("toemail", danhsachdonviguithongbao)

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
										arrZalo.push(item3.phone_zalo)

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
				self.sendzalo(arrZalo);
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
				self.model.set("ngayguigmail", moment().unix())
				var danhsachcanhbao = self.$el.find('.multiselect_canhbao select').val();
				self.model.set("canhbao",danhsachcanhbao)
				self.model.save(null, {
					success: function (model, respose, options) {
						self.getApp().notify("Lưu thông tin thành công");
					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });

					}
				});
				

			})




		},
		setCanhBao: function () {
			var self = this;
			if (self.model.get("canhbao") == null || self.model.get("canhbao") == []) {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/role",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						var danhsachdonvi = [];
						self.$el.find(".multiselect_canhbao").html("");
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							danhsachdonvi.push(item.id);
							var data_str = encodeURIComponent(JSON.stringify(item));
							var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.description)
							self.$el.find(".multiselect_canhbao").append(option_elm);
						}
						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						self.$el.find(".multiselect_canhbao").selectpicker('val', danhsachdonvi);

					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			}
			else {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/role",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						self.$el.find(".multiselect_canhbao").html("");
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							var data_str = encodeURIComponent(JSON.stringify(item));
							var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.description)
							self.$el.find(".multiselect_canhbao").append(option_elm);


						}
						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						self.$el.find(".multiselect_canhbao").selectpicker('val', self.model.get('canhbao'));
						

					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			}
		},
		sendzalo: function (arrzalo) {
			var self = this;

			self.$el.find("#btn-send-zalo").unbind('click').bind("click", function () {

				arrzalo.forEach(function (item, index) {
					if(item != null){
						var URL = "https://openapi.zalo.me/v2.0/oa/getprofile?access_token=1r2tNP-US4m8LhnSdPXxI0jGlbsUWpqt2ZgeT-7n9XaFQf1VuTuZDdTaasgGq2WQOsVaV93CVMbxTkSKlTjdG2zZf3wv-cXGK63N4xYbRq1G0AWreCup8cv0dL-Qa0LER0ErNPsV3mqGCRz_YO8E8M4Job2IgLiG1c32K9_gG4T-Uk8CxBP9QIDzxG3HrLTFF7dQ3Vtf7qmLM9afqiW0H4TgbXIXxWrZRNdAC-3NS3e5G-fazlDA3pXivaBhz4XN7rpnEl3sNMOcG9eLpCuYPg3zz2IKWtTB&data={'user_id':'" + item + "'}";
						$.ajax({
							type: "GET",
							url: URL,
							// url: "https://openapi.zalo.me/v2.0/oa/getfollowers?access_token=32BFHeZT1Zq39CH7YjiDEG0YnaQ9m4jaOaZfOhEpSazd6EvpbU5L2nfP_WVpnqiQVdo90FE07ZWY2vKzseW4HKi0d7k-lYm6K4ha2QgqLIzPJfmOeie912joaJlvnXWY5sU98lxHDrikS89AsEWxLoiNyMpnccra91Fc6-wgHHWB5SKVqUjUDXLFt1kGo6fdU6x8I9NLKN9pSvvUkujJTsiU-42-_qHcUrpcVVx7QbntMVb_aiPq1XrUndl9mNT31rZ0HElL2N0sIgDJnyvhMhpC-aw3m04w&data={'offset':0,'count':5}",
							//url: "https://openapi.zalo.me/v2.0/oa/getoa?access_token=1r2tNP-US4m8LhnSdPXxI0jGlbsUWpqt2ZgeT-7n9XaFQf1VuTuZDdTaasgGq2WQOsVaV93CVMbxTkSKlTjdG2zZf3wv-cXGK63N4xYbRq1G0AWreCup8cv0dL-Qa0LER0ErNPsV3mqGCRz_YO8E8M4Job2IgLiG1c32K9_gG4T-Uk8CxBP9QIDzxG3HrLTFF7dQ3Vtf7qmLM9afqiW0H4TgbXIXxWrZRNdAC-3NS3e5G-fazlDA3pXivaBhz4XN7rpnEl3sNMOcG9eLpCuYPg3zz2IKWtTB",
							data: "data",
							dataType: 'json',
							success: function (response) {
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
					}

					
				})
				var d = new Date();
				d.getDate();
				self.model.set("ngayguizalo", moment().unix())
				var danhsachcanhbao = self.$el.find('.multiselect_canhbao select').val();
				self.model.set("canhbao",danhsachcanhbao)
				self.model.save(null, {
					success: function (model, respose, options) {
						self.getApp().notify("Lưu thông tin thành công");
					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });

					}
				});
				

			})




		},
		

	});
});