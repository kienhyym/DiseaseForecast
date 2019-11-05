define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/datadmoss/tpl/model.html'),
		schema = require('json!schema/DataDMossSchema.json');
	var NoiDungItemView = require('app/datadmoss/js/NoiDungView');

	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "datadmoss",
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
									self.getApp().getRouter().refresh();
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
			// self.gridView();
			var id = this.getApp().getRouter().getParam("id");
			var currentUser = self.getApp().currentUser;
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						// self.gridView();
						self.noidung();
						
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
		noidung: function () {
			var self = this;
			var noidung = [];
			if (self.model.get("data") !== null) {
				self.$el.find("#loaiDichBenh").val(self.model.get("data").loaiDichBenh);
				self.$el.find("#noiXuatHien").val(self.model.get("data").noiXuatHien);
				self.$el.find("#thoigianxuathien").val(moment(self.model.get("data").thoigianxuathien).calendar());
				self.$el.find("#mucdobungphat").val(self.model.get("data").mucdobungphat);
				self.$el.find("#tailieu").val(self.model.get("data").tailieu);
				self.$el.find("#ghichu").val(self.model.get("data").ghichu);
			}



			self.$el.find(".noidung").on("change", function () {
				noidung = {
					loaiDichBenh: self.$el.find("#loaiDichBenh").val(),
					noiXuatHien: self.$el.find("#noiXuatHien").val(),
					thoigianxuathien: parseInt(self.$el.find("#thoigianxuathien").val()),
					mucdobungphat: self.$el.find("#mucdobungphat").val(),
					tailieu: self.$el.find("#tailieu").val(),
					ghichu: self.$el.find("#ghichu").val()
				};
				self.model.set("data", noidung)
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
			var px = (x+y+z+j+q+k)
			self.soantinnhanh(px);
		},
		soantinnhanh: function (px) {
			var self = this;
		
			self.$el.find(".luutin").unbind('click').bind('click', function () {
				var parem = {
					cc:self.$el.find('#tieude').val(),
					message2:
					"-Loại dịch bệnh :\n" + self.$el.find('#loaiDichBenh').val()+"\n"
					+"-Nơi xuất hiện dịch :\n"+self.$el.find('#noiXuatHien').val()+"\n"
					+"-Thời gian xuất hiện :\n"+self.$el.find('#thoigianxuathien').val()+"\n"
					+"-Mức độ bùng phát :\n"+self.$el.find('#mucdobungphat').val()+"\n"
					+"-Tài liệu, hình ảnh :\n"+self.$el.find('#tailieu').val()+"\n"
					+"-Ghi chú :\n"+self.$el.find('#ghichu').val(),
					user_id:self.getApp().currentUser.id
				}
				sessionStorage.setItem('title', self.$el.find('#tieude').val())
				sessionStorage.setItem('rows', px )
				sessionStorage.setItem('noidung',"-Loại dịch bệnh :\n" + self.$el.find('#loaiDichBenh').val()+"\n"
				+"-Nơi xuất hiện dịch :\n"+self.$el.find('#noiXuatHien').val()+"\n"
				+"-Thời gian xuất hiện :\n"+self.$el.find('#thoigianxuathien').val()+"\n"
				+"-Mức độ bùng phát :\n"+self.$el.find('#mucdobungphat').val()+"\n"
				+"-Tài liệu, hình ảnh :\n"+self.$el.find('#tailieu').val()+"\n"
				+"-Ghi chú :\n"+self.$el.find('#ghichu').val());
				
				window.location="http://0.0.0.0:20202/?#sendwarning/model";
				// $.ajax({
				// 	url: self.getApp().serviceURL + "/api/v1/sendwarning",
				// 	method: "POST",
				// 	data: JSON.stringify(parem),
				// 	headers: {
				// 		'content-type': 'application/json'
				// 	},
				// 	dataType: 'json',
				// 	success: function (data, res) {
				// 		self.getApp().getRouter().refresh();
				// 		self.getApp().notify({ message: "Đã sao chép nội dung vào tin nhắn" });

				// 	},
				// 	error: function (xhr, status, error) {
				// 		self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				// 	},
				// });
			})
		},




















		gridView: function () {
			var self = this;
			// var data_default = {
			//     "id": gonrin.uuid(),
			//     "loaidichbenh": null,
			//     "noicodichbenh": null,
			//     "thoigiancodich": null,
			//     "mucdobungphat": null,
			//     "tailieu": null
			// };
			// var noidung = self.model.get("noidung");
			// if (noidung === null || noidung.length === 0) {
			//     noidung = [];
			// }

			// var noiDungModel = self.model.get("noidung");
			var noiDungView = new NoiDungItemView({
				viewData: {
					noidung: noiDungModel
				}
			});
			// if (!!data) {
			//     CongViecView.model.set(JSON.parse(JSON.stringify(data_default)));
			// }

			noiDungView.render();
			self.$el.find("#noidung_grid").append(noiDungView.$el);

			var noidungdichbenh = self.model.get("noidung");
			if (noidungdichbenh === null) {
				noidungdichbenh = [];
				noidungdichbenh.push(event.data)
			}
			if (noidungdichbenh.id === event.oldData.id) {
				noidungdichbenh = event.data;

			}

			self.model.set("noidung", noidungdichbenh);
			self.applyBinding("noidung");
		}


	});
});