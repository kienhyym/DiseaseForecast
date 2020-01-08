define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var filterschema = {
		"text": {
			"type": "string"
		},
	};

	return Gonrin.FilterView.extend({
		modelSchema: filterschema,
		urlPrefix: "/api/v1/",
		collectionName: "filter",
		sessionKey: "filter",
		bindings: 'filter-bind',
		uiControl: [
			{
				field: "text",
			}
		],

		render: function () {
			var self = this;
			if (self.getApp().currentUser.config.lang == "VN") {
				var translatedTemplate = gonrin.template(`<input type="text" filter-bind="value:text" placeholder="Tìm Kiếm..."/>`,)
				self.$el.html(translatedTemplate);
			} else {
				var translatedTemplate = gonrin.template(`<input type="text" filter-bind="value:text" placeholder="Search..."/>`,)
				self.$el.html(translatedTemplate);
			}
			
			//session here
			this.getDataFromSession();
			this.applyBindings();

			self.model.on("change", function () {
				self.triggerFilter();
			});

			var $textEl = self.getFieldElement("text");
			var timer = null;
			$textEl.unbind("keyup").bind("keyup", function ($event) {
				timer = setTimeout(function () {
					var val = $textEl.val();
					self.model.set("text", val);
				}, 700);
			});

			$textEl.unbind("keypress").bind("keypress", function ($event) {
				if (timer) {
					clearTimeout(timer);
				}
			});
		}
	});
});