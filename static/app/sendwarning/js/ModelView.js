define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/sendwarning/tpl/model.html'),
		schema = require('json!schema/SendWarningSchema.json');

	return Gonrin.ModelView.extend({
		// template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "sendwarning",

		render: function () {
			var self = this;
			var translatedTemplate = gonrin.template(template)(LANG);
			self.$el.html(translatedTemplate);
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
			var id = this.getApp().getRouter().getParam("id");
			var currentUser = self.getApp().currentUser;
			if (id == null) {
				self.setCanhBao();
				self.setDonVi();

			}
			self.model.set('cc', sessionStorage.getItem('title'))
			self.model.set('message2', sessionStorage.getItem('noidung'))

			// self.$el.find("#content")[0].style.height = sessionStorage.getItem('rows') + 'px';
			sessionStorage.clear();

			self.$el.find(".send-all-chuyentiep").hide()
			if (self.getApp().currentUser.config.lang == "VN") {
				self.$el.find('.upload_files').attr('lang','vi')
			} else {
				self.$el.find('.upload_files').attr('lang','en')


			}
			self.bindEventSelect();
			self.applyBindings();
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {


						if (self.model.get("user_id") != self.getApp().currentUser.id) {
							self.$el.find(".toolbar").hide()

							self.$el.find(".send-all-chuyentiep").show();
							self.soantinnhanh();
						}

						var x = self.$el.find("#content")[0].scrollHeight;
						self.$el.find("#content")[0].style.height = x + 'px';

						if (self.model.get("user_id") !== self.getApp().currentUser.id) {
							self.$el.find('.send-all').css('display', 'none');
							self.$el.find('.title').html('Tin nhắn đã nhận')
						}
						if (self.model.get("user_id") == self.getApp().currentUser.id) {
							self.$el.find('.title').html('Tin nhắn đã gửi')
						}

						// self.bindEventSelect();

						self.renderUpload();
						if (self.model.get("ngayguigmail") !== null) {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.$el.find("#btn-send-gmail").removeClass("btn-primary");
								self.$el.find("#btn-send-gmail").addClass("btn-success");
								self.$el.find("#btn-send-gmail").html('Đã gửi qua gmail');

							} else {
								self.$el.find("#btn-send-gmail").removeClass("btn-primary");
								self.$el.find("#btn-send-gmail").addClass("btn-success");
								self.$el.find("#btn-send-gmail").html('Message was sent via Gmail');

							}

						}
						if (self.model.get("ngayguizalo") !== null) {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.$el.find("#btn-send-zalo").removeClass("btn-primary");
								self.$el.find("#btn-send-zalo").addClass("btn-success");
								self.$el.find("#btn-send-zalo").html('Đã gửi qua zalo');

							} else {
								self.$el.find("#btn-send-zalo").removeClass("btn-primary");
								self.$el.find("#btn-send-zalo").addClass("btn-success");
								self.$el.find("#btn-send-zalo").html('Message was sent via Zalo');

							}

						}
						if (self.model.get("ngayguiphone") !== null) {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.$el.find("#btn-send-phone").removeClass("btn-primary");
								self.$el.find("#btn-send-phone").addClass("btn-success");
								self.$el.find("#btn-send-phone").html('Đã gửi qua sms');

							} else {
								self.$el.find("#btn-send-phone").removeClass("btn-primary");
								self.$el.find("#btn-send-phone").addClass("btn-success");
								self.$el.find("#btn-send-phone").html('Message was sent via SMS');

							}

						}
						if (self.model.get("user_id") == self.getApp().currentUser.id) {
							self.$el.find(".send-all-chuyentiep").hide()
						}



						self.setCanhBao();
						self.setDonVi();

						self.$el.find(".btn-xoa").unbind("click").bind('click', function () {
							self.model.destroy({
								success: function (model, response) {
									if (self.getApp().currentUser.config.lang == "VN") {
										self.getApp().notify("Xóa thông tin thành công");
									} else {
										self.getApp().notify("Information deleted successfully");
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
											self.getApp().notify({ message: "Xóa dữ liệu không thành công" }, { type: "danger", delay: 1000 });

										} else {
											self.getApp().notify({ message: "Information deletion failed" }, { type: "danger", delay: 1000 });
										}
									}
								}
							});
						})
						self.applyBindings();

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
						} catch (err) {
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

							} else {
								self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
							}
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
			if (self.model.get("tailieu") == null) {
				self.$el.find(".linkDownload").hide();
			}
			else {
				self.$el.find(".linkDownload").show();
			}
			self.$el.find(".linkDownload").attr("href", self.model.get("tailieu"));
			self.$el.find(".textDownload").html('aaaaa');
			// (self.$el.find(".linkDownload").html()).slice(51))

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
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify("Tải file lên thành công");
							} else {
								self.getApp().notify("File upload successful");
							}

							self.model.set(data_attr, data_file.link);
							// self.$el.find("#content").val(self.$el.find("#content").val()
						}
					} else {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Không thể tải tệp tin lên máy chủ" }, { type: "danger", delay: 1000 });

						} else {
							self.getApp().notify({ message: "Could not upload file to server" }, { type: "danger", delay: 1000 });
						}
					}
				};
				http.send(fd);
			});
		},
		//TẠO DANH SÁCH LOẠI THÔNG BÁO TRONG MUTISELECT_CANHBAO

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
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

						} else {
							self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
						}
					},
				});
			}
			else {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/role?results_per_page=100000&max_results_per_page=1000000",
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
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

						} else {
							self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
						}
					},
				});
			}
		},
		//TẠO DANH SÁCH ĐƠN VỊ TRONG MUTISELECT_DONVI
		setDonVi: function () {
			var self = this;
			if (self.model.get("todonvi") == null) {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						var danhsachdonvi = [];
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							if (item.nhanthongbaohaykhong !== "khong") {
								if (self.getApp().currentUser.donvi_id == item.donvicaptren) {
									danhsachdonvi.push(item.id)
									var data_str = encodeURIComponent(JSON.stringify(item));
									var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.ten)
									self.$el.find(".multiselect_donvi").append(option_elm);
								}
							}
						}
						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						self.$el.find(".multiselect_donvi").selectpicker('val', danhsachdonvi);
						self.getDonViVaLoaiCanhBao();


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
			else {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						for (var i = 0; i < data.objects.length; i++) {
							var item = data.objects[i];
							if (item.nhanthongbaohaykhong !== "khong") {
								if (self.getApp().currentUser.donvi_id == item.donvicaptren) {
									var data_str = encodeURIComponent(JSON.stringify(item));
									var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.ten)
									self.$el.find(".multiselect_donvi").append(option_elm);
								}
							}
						}
						$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
						self.$el.find(".multiselect_donvi").selectpicker('val', self.model.get('todonvi'));
						self.getDonViVaLoaiCanhBao();
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

		},
		//LẤY DANH SÁCH ĐƠN VỊ VÀ DANH SÁCH LOẠI THÔNG BÁO TỪ GIAO DIỆN
		getDonViVaLoaiCanhBao: function () {
			var self = this;
			var danhsachdonviguithongbao = [];
			var dscanhbao = [];

			danhsachdonviguithongbao = self.$el.find('.multiselect_donvi select').val();
			self.model.set("todonvi", danhsachdonviguithongbao)
			dscanhbao = self.$el.find('.multiselect_canhbao select').val();
			self.sendMail(danhsachdonviguithongbao, dscanhbao);
			self.sendzalo(danhsachdonviguithongbao, dscanhbao);
			self.luu(danhsachdonviguithongbao, dscanhbao);

			self.$el.find('.multiselect_donvi select').on("change", function () {
				danhsachdonviguithongbao = self.$el.find('.multiselect_donvi select').val();
				dscanhbao = self.$el.find('.multiselect_canhbao select').val();
				self.model.set("todonvi", danhsachdonviguithongbao)
				self.sendMail(danhsachdonviguithongbao, dscanhbao);
				self.sendzalo(danhsachdonviguithongbao, dscanhbao);
				self.luu(danhsachdonviguithongbao, dscanhbao);
			})
			self.$el.find('.multiselect_canhbao select').on("change", function () {
				dscanhbao = self.$el.find('.multiselect_canhbao select').val();
				danhsachdonviguithongbao = self.$el.find('.multiselect_donvi select').val();
				self.sendMail(danhsachdonviguithongbao, dscanhbao);
				self.sendzalo(danhsachdonviguithongbao, dscanhbao);
				self.luu(danhsachdonviguithongbao, dscanhbao);

			})
		},
		// GỬI TIN QUÁ EMAIL
		sendMail: function (arrdonvi, arrcanhbao) {
			var self = this;
			var filters = {
				filters: {
					"$and": [
						{ "thongbaoemail": { "$eq": 'yes' } },
						{ "kiemduyet": { "$eq": 'daduyet' } }

					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
				data: "q=" + JSON.stringify(filters),
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					var arrUser = [];
					arrdonvi.forEach(function (id_user) {
						data.objects.forEach(function (dataUser) {
							if (id_user == dataUser.donvi_id) {
								arrUser.push(dataUser)
							}
						})
					})
					var arrGmailkiemDuyet = [];
					(arrUser).forEach(function (dataUserRole, indexxx) {
						var dem = 0;
						(dataUserRole.roles).forEach(function (dsdataUserRole) {
							arrcanhbao.forEach(function (dataRole) {
								if (dsdataUserRole.id == dataRole) {
									dem++;
								}
							})
						})

						if (dem > 0) {
							arrGmailkiemDuyet.push(dataUserRole.email);
						}
					})
					self.$el.find("#btn-send-gmail").unbind('click').bind("click", function () {
						arrGmailkiemDuyet.forEach(function (item, index) {

							var content = null;
							if (self.model.get("tailieu") == null) {
								content = self.$el.find("#content").val();
							}
							else {
								if (self.getApp().currentUser.config.lang == "VN") {
									content = self.$el.find("#content").val() + "\n\n" + "Tài liệu đính kèm:" + self.getApp().serviceURL + self.model.get("tailieu");
								} else {
									content = self.$el.find("#content").val() + "\n\n" + "Attachments:" + self.getApp().serviceURL + self.model.get("tailieu");
								}
							}

							$.ajax({
								type: "POST",
								url: "https://upstart.vn/services/api/email/send",
								data: JSON.stringify({
									from: {
										"id": "canhbaosotxuathuyet@gmail.com",
										"password": "kocopass",
									},
									"to": item,
									"message": content,
									"subject": self.$el.find("#cc").val(),
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
						})
						var d = new Date();
						d.getDate();
						self.model.set("ngayguigmail", moment().unix())
						self.model.set("canhbao", arrcanhbao)
						self.model.set("toemail", arrGmailkiemDuyet)
						self.model.set("user_id", self.getApp().currentUser.id)
						self.model.save(null, {
							success: function (model, respose, options) {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify("Lưu thông tin thành công");
								} else {
									self.getApp().notify("Information saved successfully");
								}
							},
							error: function (xhr, status, error) {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Lưu thông tin không thành công!" }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "Saving information failed" }, { type: "danger", delay: 1000 });
								}
							}
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
		// GỬI TIN QUÁ ZALO
		sendzalo: function (arrdonvi, arrcanhbao) {
			var self = this;
			var filters = {
				filters: {
					"$and": [
						{ "thongbaozalo": { "$eq": 'yes' } },
						{ "kiemduyet": { "$eq": 'daduyet' } }

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
					var arrUser = [];
					arrdonvi.forEach(function (id_user) {
						data.objects.forEach(function (dataUser) {
							if (id_user == dataUser.donvi_id) {
								arrUser.push(dataUser)
							}
						})
					})
					var arrZalokiemDuyet = [];
					(arrUser).forEach(function (dataUserRole, indexxx) {
						var dem = 0;
						(dataUserRole.roles).forEach(function (dsdataUserRole) {
							arrcanhbao.forEach(function (dataRole) {
								if (dsdataUserRole.id == dataRole) {
									dem++;
								}
							})
						})

						if (dem > 0) {
							arrZalokiemDuyet.push(dataUserRole.phone_zalo);
						}
					})
					self.$el.find("#btn-send-zalo").unbind('click').bind("click", function () {
						arrZalokiemDuyet.forEach(function (item, index) {
							if (item != null) {
								var URL = "https://openapi.zalo.me/v2.0/oa/getprofile?access_token=1r2tNP-US4m8LhnSdPXxI0jGlbsUWpqt2ZgeT-7n9XaFQf1VuTuZDdTaasgGq2WQOsVaV93CVMbxTkSKlTjdG2zZf3wv-cXGK63N4xYbRq1G0AWreCup8cv0dL-Qa0LER0ErNPsV3mqGCRz_YO8E8M4Job2IgLiG1c32K9_gG4T-Uk8CxBP9QIDzxG3HrLTFF7dQ3Vtf7qmLM9afqiW0H4TgbXIXxWrZRNdAC-3NS3e5G-fazlDA3pXivaBhz4XN7rpnEl3sNMOcG9eLpCuYPg3zz2IKWtTB&data={'user_id':'" + item + "'}";
								$.ajax({
									type: "GET",
									url: URL,
									data: "data",
									dataType: 'json',
									success: function (response) {

										if (response.data !== undefined) {
											var content = null;
											if (self.model.get("tailieu") == null) {
												content = self.$el.find("#content").val();
											}
											else {
												if (self.getApp().currentUser.config.lang == "VN") {
													content = self.$el.find("#content").val() + "\n\n" + "Tài liệu đính kèm:" + self.getApp().serviceURL + self.model.get("tailieu");
												} else {
													content = self.$el.find("#content").val() + "\n\n" + "Attachments:" + self.getApp().serviceURL + self.model.get("tailieu");
												}											}
											$.ajax({
												type: "POST",
												url: "https://openapi.zalo.me/v2.0/oa/message?access_token=1r2tNP-US4m8LhnSdPXxI0jGlbsUWpqt2ZgeT-7n9XaFQf1VuTuZDdTaasgGq2WQOsVaV93CVMbxTkSKlTjdG2zZf3wv-cXGK63N4xYbRq1G0AWreCup8cv0dL-Qa0LER0ErNPsV3mqGCRz_YO8E8M4Job2IgLiG1c32K9_gG4T-Uk8CxBP9QIDzxG3HrLTFF7dQ3Vtf7qmLM9afqiW0H4TgbXIXxWrZRNdAC-3NS3e5G-fazlDA3pXivaBhz4XN7rpnEl3sNMOcG9eLpCuYPg3zz2IKWtTB",
												data: JSON.stringify({
													"recipient": {
														"user_id": response.data.user_id
													},
													"message": {
														"text": content
													},
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
														self.getApp().notify({ message: "Gửi tin không thành công" }, { type: "danger", delay: 1000 });

													} else {
														self.getApp().notify({ message: "Message sending failed" }, { type: "danger", delay: 1000 });
													}
												}
											});
										}
									}, error: function (response) {
										if (self.getApp().currentUser.config.lang == "VN") {
											self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });

										} else {
											self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
										}
									}

								});
							}
						})
						var d = new Date();
						d.getDate();
						self.model.set("ngayguizalo", moment().unix())
						self.model.set("canhbao", arrcanhbao)
						self.model.set("tozalo", arrZalokiemDuyet)
						self.model.set("user_id", self.getApp().currentUser.id)
						self.model.save(null, {
							success: function (model, respose, options) {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify("Lưu thông tin thành công");
								} else {
									self.getApp().notify("Information saved successfully");
								}
							},
							error: function (xhr, status, error) {
								if (self.getApp().currentUser.config.lang == "VN") {
									self.getApp().notify({ message: "Lưu thông tin không thành công!" }, { type: "danger", delay: 1000 });

								} else {
									self.getApp().notify({ message: "Saving information failed" }, { type: "danger", delay: 1000 });
								}
							}
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
		luu: function (danhsachdonviguithongbao, dscanhbao) {
			var self = this;
			self.$el.find(".btn-luu").unbind('click').bind("click", function () {
				self.model.set("canhbao", dscanhbao)
				self.model.set("user_id", self.getApp().currentUser.id)
				self.model.save(null, {
					success: function (model, respose, options) {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify("Lưu thông tin thành công");
						} else {
							self.getApp().notify("Information saved successfully");
						}
					},
					error: function (xhr, status, error) {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Lưu thông tin không thành công!" }, { type: "danger", delay: 1000 });

						} else {
							self.getApp().notify({ message: "Saving information failed" }, { type: "danger", delay: 1000 });
						}
					}
				});
			})
		},
		soantinnhanh: function () {
			var self = this;

			var x = self.$el.find("#content")[0].scrollHeight;
			self.$el.find("#content")[0].style.height = x + 'px';
			self.$el.find("#btn-send-gmail-chuyentiep").unbind('click').bind('click', function () {

				sessionStorage.setItem('title', self.$el.find('#cc').val())
				sessionStorage.setItem('rows', x)
				sessionStorage.setItem('noidung', self.$el.find('#content').val());

				window.location = self.getApp().serviceURL + "/?#sendwarning/model";

			})
		},


	});
});