define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/login/tpl/changepassword.html')

	return Gonrin.View.extend({
		// template: template,
		modelSchema: {},

		render: function () {
			var self = this;
			var translatedTemplate = gonrin.template(template)(LANG);
			self.$el.html(translatedTemplate);
			self.$el.find(".backgroundColor").css("width", screen.availWidth);
			self.$el.find(".backgroundColor").css("height", screen.availHeight);
			// var id = self.id;
			// console.log("self.currentUser",self.getApp().currentUser.id)
			var id = self.getApp().currentUser.id
			var pass = self.getApp().currentUser.password;
			self.applyBindings();
			self.changepasswordEvent(id);
			console.log(id);
			console.log(pass);
		},
		changepasswordEvent: function (id) {
			var self = this;
			self.$el.find("#btn-back").unbind("click").bind("click", function () {
				window.location = self.getApp().serviceURL;
			});
			self.$el.find("#btn-changepassword").unbind("click").bind("click", function () {
				if (self.$el.find("#txtpass").val() === undefined || self.$el.find("#txtpass").val() === "") {
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Mật khẩu cũ không được bỏ trống" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "Old password must not be blank" }, { type: "danger", delay: 1000 });
					} return false;
				}
				if (self.$el.find("#txtpass2").val() === undefined || self.$el.find("#txtpass2").val() === "") {
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Mật khẩu mới không được bỏ trống" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "New password must not be blank" }, { type: "danger", delay: 1000 });
					} return false;
				}
				if (self.$el.find("#txtpass3").val() !== self.$el.find("#txtpass2").val()) {
					if (self.getApp().currentUser.config.lang == "VN") {
						self.getApp().notify({ message: "Mật khẩu mới viết không giống ở trên" }, { type: "danger", delay: 1000 });

					} else {
						self.getApp().notify({ message: "The newly written password is not the same as above" }, { type: "danger", delay: 1000 });
					}
					return false;
				}
				$.ajax({
					type: 'POST',
					url: self.getApp().serviceURL + "/api/v1/changepassword",
					dataType: 'json',
					data: JSON.stringify({
						user_id: id,
						password_old: self.$el.find("#txtpass").val(),
						password_new: self.$el.find("#txtpass2").val(),
					}),
					success: function (response) {
						if (response) {
							console.log('response', response);
							if (self.getApp().currentUser.config.lang == "VN") {
								self.getApp().notify({ message: "Đổi mật khẩu đã thành công!" });

							} else {
								self.getApp().notify({ message: "Password change was successful" });
							}
							window.location = self.getApp().serviceURL;
						}


					}, error: function (xhr) {
						if (self.getApp().currentUser.config.lang == "VN") {
							self.getApp().notify({ message: "Mật khẩu cũ không chính xác!" }, { type: "danger", delay: 1000 });

						} else {
							self.getApp().notify({ message: "The old password is incorrect" }, { type: "danger", delay: 1000 });
						}
						// window.location=self.getApp().serviceURL+"#changepassword";
						// self.getApp().getRouter().navigate("changepassword");

					}
				})
			});
		}
	});
});