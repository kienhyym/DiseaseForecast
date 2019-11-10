define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/role/tpl/model.html'),
		schema = require('json!schema/RoleSchema.json');


	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "role",
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
						buttonClass: "btn-success btn-sm btn-luu",
						label: "TRANSLATE:SAVE",
						command: function () {
							var self = this;
							self.model.save(null, {
								success: function (model, respose, options) {
									self.getApp().notify("Lưu thông tin thành công");
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
										self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
									}
								}
							});
						}
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm btn-xoa",
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
		render: function () {
			var self = this;
			if (self.getApp().currentUser.captren_stt != 1) {
				self.$el.find(".btn-luu").hide();
				self.$el.find(".btn-xoa").hide();
			}
			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				//progresbar quay quay
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
					

						console.log(self.model);
						self.$el.find(".btn-xoa").unbind("click").bind('click', function () {
						
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
								method: "GET",
								
								contentType: "application/json",
								success: function (data) {	
									var dem = 1;
									data.objects.forEach(function (item, index) {
										dem++;
										if(item.roles.length !=0){
											var arr = [];
											item.roles.forEach(function (item2,index2) {
												if(item2.id != self.model.get("id"))
													arr.push(item2)
											})
											var roles = {
												roles: arr
											}
				
											
												$.ajax({
													url: self.getApp().serviceURL + "/api/v1/user/" + item.id,
													method: "PUT",
													data: JSON.stringify(roles),
													headers: {
														'content-type': 'application/json'
													},
													dataType: 'json',
													success: function (data, res) {
														if(dem > index){
															$.ajax({
																url: self.getApp().serviceURL + "/api/v1/role/" + self.model.get("id"),
																method: "DELETE",
																headers: {
																	'content-type': 'application/json'
																},
																dataType: 'json',
																success: function (data, res) {
																	self.getApp().notify({ message: "Xóa thành công" });
																	self.getApp().getRouter().navigate(self.collectionName + "/collection");
																},
																error: function (xhr, status, error) {
																},
															});
														}
														
													},
													error: function (xhr, status, error) {
														// self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
													},
												});
											
										}
									})
								},
								error: function (xhr, status, error) {
									self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
								},
							});
						})

						self.applyBindings();
					},
					error: function () {
						self.getApp().notify("Get data Eror");
					},
				});
			} else {
				self.applyBindings();
			}

		},

	});

});