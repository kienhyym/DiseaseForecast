define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/role/tpl/model.html'),
		schema = require('json!schema/RoleSchema.json');


	return Gonrin.ModelView.extend({
		// template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "role",
		
		render: function () {
			var self = this;
			var translatedTemplate = gonrin.template(template)(LANG);
			self.$el.html(translatedTemplate);
			if (self.getApp().currentUser.captren_stt != 1) {
				self.$el.find(".btn-luu").hide();
				self.$el.find(".btn-xoa").hide();
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
								self.getApp().notify({ message: "Lưu thông tin không thành công mã thông báo đã tồn tại!" }, { type: "danger", delay: 1000 });

							} else {
								self.getApp().notify({ message: "Saving information failed - Code already exists" }, { type: "danger", delay: 1000 });
							}
						}
					}
				});
			});




			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
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

						self.applyBindings();
					},
					error: function () {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu!" }, { type: "danger", delay: 1000 });
	
						} else {
							self.getApp().notify({ message: "Error!! Could not retrieve data" }, { type: "danger", delay: 1000 });
						}					},
				});
			} else {
				self.applyBindings();
			}

		},

	});

});