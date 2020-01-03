define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/datadmoss/tpl/model.html'),
		schema = require('json!schema/DataDMossSchema.json');
	var NoiDungItemView = require('app/datadmoss/js/NoiDungView');

	return Gonrin.ModelView.extend({
		// template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "datadmoss",

		uiControl: {
			fields: [
				{
					field: "ngaygui",
					uicontrol: "datetimepicker",
					textFormat: "DD/MM/YYYY",
					extraFormats: ["DDMMYYYY"],
					parseInputDate: function (val) {
						return moment.unix(val)
					},
					parseOutputDate: function (date) {
						return date.unix()
					}
				},
			]
		},
		render: function () {
			var self = this;
			var translatedTemplate = gonrin.template(template)(LANG);
			self.$el.html(translatedTemplate);
			var id = this.getApp().getRouter().getParam("id");
			var currentUser = self.getApp().currentUser;
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						self.noidung();
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
				var translatedTemplate = gonrin.template(template)(LANG);
				self.$el.html(translatedTemplate);
				self.applyBindings();
			}

		},
		noidung: function () {
			var self = this;
			var noidung = [];
			if (self.model.get("data") !== null) {
				self.$el.find("#loaiDichBenh").val(self.model.get("category"));
				self.$el.find("#noiXuatHien").val(self.model.get("data").local_name);
				self.$el.find("#thoigianxuathien").val(moment(self.model.get("data").time_affect * 1000).format("DD/MM/YYYY"));
				self.$el.find("#mucdobungphat").val(self.model.get("data").level);
				self.$el.find("#tailieu").val(self.model.get("data").attactments);
				self.$el.find("#ghichu").val(self.model.get("data").detail);
			}

			self.$el.find(".noidung").on("change", function () {
				// noidung = {
				// 	loaiDichBenh: self.$el.find("#loaiDichBenh").val(),
				// 	noiXuatHien: self.$el.find("#noiXuatHien").val(),
				// 	thoigianxuathien: parseInt(self.$el.find("#thoigianxuathien").val()),
				// 	mucdobungphat: self.$el.find("#mucdobungphat").val(),
				// 	tailieu: self.$el.find("#tailieu").val(),

				// };
				// self.model.set("data", noidung)
			})
			var x = self.$el.find("#ghichu")[0].scrollHeight;
			self.$el.find("#ghichu")[0].style.height = x + 'px';

			var y = self.$el.find("#noiXuatHien")[0].scrollHeight;
			self.$el.find("#noiXuatHien")[0].style.height = y + 'px';

			var z = self.$el.find("#thoigianxuathien")[0].scrollHeight;
			self.$el.find("#thoigianxuathien")[0].style.height = z + 'px';

			var j = self.$el.find("#mucdobungphat")[0].scrollHeight;
			self.$el.find("#mucdobungphat")[0].style.height = j + 'px';

			var q = self.$el.find("#tailieu")[0].scrollHeight;
			self.$el.find("#tailieu")[0].style.height = q + 'px';

			var k = self.$el.find("#loaiDichBenh")[0].scrollHeight;
			self.$el.find("#loaiDichBenh")[0].style.height = k + 'px';
			var px = (x + y + z + j + q + k)
			self.soantinnhanh(px);
		},
		soantinnhanh: function (px) {
			var self = this;

			self.$el.find(".luutin").unbind('click').bind('click', function () {
				// var parem = {
				// 	cc:self.$el.find('#tieude').val(),
				// 	message2:
				// 	"-Loại dịch bệnh :\n" + self.$el.find('#loaiDichBenh').val()+"\n"
				// 	+"-Nơi xuất hiện dịch :\n"+self.$el.find('#noiXuatHien').val()+"\n"
				// 	+"-Thời gian xuất hiện :\n"+self.$el.find('#thoigianxuathien').val()+"\n"
				// 	+"-Mức độ bùng phát :\n"+self.$el.find('#mucdobungphat').val()+"\n"
				// 	+"-Tài liệu, hình ảnh :\n"+self.$el.find('#tailieu').val()+"\n"
				// 	+"-Ghi chú :\n"+self.$el.find('#ghichu').val(),
				// 	user_id:self.getApp().currentUser.id
				// }
				sessionStorage.setItem('title', self.$el.find('#tieude').val())
				sessionStorage.setItem('rows', px)
				sessionStorage.setItem('noidung', "-Loại dịch bệnh :\n" + self.$el.find('#loaiDichBenh').val() + "\n"
					+ "-Nơi xuất hiện dịch :\n" + self.$el.find('#noiXuatHien').val() + "\n"
					+ "-Thời gian xuất hiện :\n" + self.$el.find('#thoigianxuathien').val() + "\n"
					+ "-Mức độ bùng phát :\n" + self.$el.find('#mucdobungphat').val() + "\n"
					+ "-Tài liệu, hình ảnh :\n" + self.$el.find('#tailieu').val() + "\n"
					+ "-Ghi chú :\n" + self.$el.find('#ghichu').val());

				window.location = self.getApp().serviceURL + "/?#sendwarning/model";

			})
		},


	});
});