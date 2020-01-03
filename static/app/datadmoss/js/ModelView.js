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
			if (self.getApp().currentUser.config.lang == "VN") {
				self.model.get('data').content.forEach(function (item, index) {
					console.log(item)
					self.$el.find("#noidung").append("\n" + (index + 1) + ". Tỉnh thành:" + item.local_name + "\nTỷ lệ xuất hiện dịch:" + item.value + "%\nMức độ:" + item.level + "\nThời gian có nguy cơ xuất hiện dịch sốt xuất huyết:" + moment(item.start_time * 1000).format("DD/MM/YYYY") + "\nThời gian kết thúc dịch sốt xuất huyết dự kiến:" + moment(item.start_time * 1000).format("DD/MM/YYYY") + "\nThông tin:" + item.detail + "\ntài liệu đính kèm:\n")
					item.attactments_url.forEach(function (item2, index2) {
						self.$el.find("#noidung").append("\t" + item2.name + ":" + item2.url + "\n")
					});
					self.$el.find("#noidung").append("Dữ liệu tham chiếu:\n")

					item.reference_material.forEach(function (item3, index3) {
						self.$el.find("#noidung").append("\tTên chỉ số:" + item3.name +
							"\n\tKết quả đo:" + item3.value + item3.unit_of_measure +
							"\n\tNgày bắt đầu đo:" + moment(item3.start_time * 1000).format("DD/MM/YYYY") +
							"\n\tNgày kết thúc đo:" + moment(item3.end_time * 1000).format("DD/MM/YYYY") +
							"\n\tThông tin chi tiết:" + item3.description +
							"\n")
						self.$el.find("#noidung").append("\tTài liệu đính kèm chỉ số:\n")

						item3.attactments_url.forEach(function (item4, index4) {
							self.$el.find("#noidung").append("\t\t" + item4.name + ":" + item4.url + "\n")
						})
						self.$el.find("#noidung").append("\n")

					});
				})
				self.$el.find("#noidung").append("Ghi chú:" + self.model.get('data').note)

			} else {
				self.model.get('data').content.forEach(function (item, index) {
					console.log(item)
					self.$el.find("#noidung").append("\n" + (index + 1) + ". Name of provinces/City:" +
						item.local_name + "\nLikelihood ratio epidemic appears:" +
						item.value + "%\nLevel:" + item.level +
						"\nDengue outbreak time may occur:" +
						moment(item.start_time * 1000).format("DD/MM/YYYY") +
						"\nDengue end time:" +
						moment(item.start_time * 1000).format("DD/MM/YYYY") +
						"\nDetail:" + item.detail + "\nLink to attached document:\n")
					item.attactments_url.forEach(function (item2, index2) {
						self.$el.find("#noidung").append("\t" + item2.name + ":" + item2.url + "\n")
					});
					self.$el.find("#noidung").append("Describe the data base index:\n")

					item.reference_material.forEach(function (item3, index3) {
						self.$el.find("#noidung").append("\tName of indicator:" + item3.name +
							"\n\tResult:" + item3.value + item3.unit_of_measure +
							"\n\tStart time of checking the indicator:" + moment(item3.start_time * 1000).format("DD/MM/YYYY") +
							"\n\tEnd time of checking the indicator:" + moment(item3.end_time * 1000).format("DD/MM/YYYY") +
							"\n\tDescription:" + item3.description +
							"\n")
						self.$el.find("#noidung").append("\tLink to attached document:\n")

						item3.attactments_url.forEach(function (item4, index4) {
							self.$el.find("#noidung").append("\t\t" + item4.name + ":" + item4.url + "\n")
						})
						self.$el.find("#noidung").append("\n")

					});
				})
				self.$el.find("#noidung").append("Note:" + self.model.get('data').note)
			}

			self.soantinnhanh();
		},
		soantinnhanh: function () {
			var self = this;

			self.$el.find(".luutin").unbind('click').bind('click', function () {
				sessionStorage.setItem('title', self.$el.find('#tieude').val())
				sessionStorage.setItem('noidung', self.$el.find('#noidung').val());
				window.location = self.getApp().serviceURL + "/?#sendwarning/model";

			})
		},


	});
});