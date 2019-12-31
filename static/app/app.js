define('jquery', [], function () {
	return jQuery;
});
require.config({
	baseUrl: static_url + '/js/lib',
	paths: {
		app: '../../app',
		tpl: '../tpl',
		vendor: '../../vendor',
		schema: '../../schema'
	},
	//	paths: {
	//		app: '../app',
	//		schema: '../schema',
	//		tpl: '../tpl',
	//		vendor: '../../vendor'
	//	},
	shim: {
		'gonrin': {
			deps: ['underscore', 'jquery', 'backbone'],
			exports: 'Gonrin'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		}
	},
	config: {
		text: {
			useXhr: function (url, protocol, hostname, port) {
				return true;
			}
		}
	}
});
window.clone = function (obj) {
	return JSON.parse(JSON.stringify(obj));
}
require(['jquery',
	'gonrin',
	'app/router',
	'app/nav/NavbarView',
	'text!app/base/tpl/mobilelayout.html',
	'i18n!app/nls/app',
	'json!app/nls/en.json',
	'json!app/nls/vn.json',

	'vendor/store'],
	function ($, Gonrin, Router, Nav, layout, lang, EN,VN, storejs) {
		$.ajaxSetup({
			headers: {
				'content-type': 'application/json'
			}
		});
		window.LANG = VN;

		var app = new Gonrin.Application({
			serviceURL: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''),
			// serviceURL: "http://0.0.0.0:9081",
			// serviceURL: "http://103.74.120.54:9081",
			router: new Router(),
			lang: lang,
			
			layout: layout,
			staticURL: static_url,
			initialize: function () {
				this.getRouter().registerAppRoute();
				this.getCurrentUser();
			},
			getCurrentUser: function () {
				var self = this;
				$.ajax({
					url: self.serviceURL + "/api/v1/current_user",
					dataType: "json",
					success: function (data) {
						self.postLogin(data);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						self.router.navigate("login");
					}
				});
			},
			postLogin: function (data) {
				var self = this;
				if (data.config && data.config.lang == "EN") {
					window.LANG = EN;
					self.lang = EN;
				}

				if (data.config && data.config.lang == "VN") {
					window.LANG = VN;
					self.lang = VN;
				}

				// console.log(self.translate("TIEU_DE"));

				// var translatedTemplate = gonrin.template(layout)(LANG);
				// $(self).html(translatedTemplate);

				self.currentUser = new Gonrin.User(data);
				var tpl = gonrin.template(layout)({});
				$('.content-contain').html(tpl);
				this.$header = $('body').find(".main-sidebar");
				this.$content = $('body').find(".content-area");
				this.$navbar = $('body').find(".main-sidebar .nav-wrapper");
				this.nav = new Nav({ el: this.$navbar });
				self.nav.render();
				$("span#display_name").html(self.get_displayName(data));
				self.bind_event();
				//			self.router.navigate('lichthanhtra/model');
				$("#myacount").unbind('click').bind('click', function () {

					self.getRouter().navigate("user/model?id=" + self.currentUser.id);
				});
				$("#mycompany").unbind('click').bind('click', function () {
					self.getRouter().navigate("donvi/model?id=" + self.currentUser.donvi_id);
				});
				// console.log("hien tại")
				$("#changepassword").bind('click', function () {
					self.router.navigate("changepassword");
				});
				$(".mainlogo").unbind('click').bind('click', function () {
					self.router.navigate('index');
				});
				$(".dropdown-menu-right a").each(function (index,item) {
					console.log($(item).html(self.translate($(item).text().trim())))
				})
				console.log($(".tit").text())
				$(".tit").html(self.translate($(".tit").text().trim()))

				$("#btn_en").unbind("click").bind("click", function () {
					console.log('xxx')
					var user = clone(self.currentUser);
					var config = user.config ? user.config : {};
					config.lang = "EN";
					$.ajax({
						url: self.serviceURL + "/api/v1/user/" + user.id,
						data: JSON.stringify({
							"config": { 'lang': 'EN' }
						}),
						type: "PUT",
						success: function (response) {
							location.reload();
						},
						error: function () {
							console.log("ERROR");
						}
					});
				});

				$("#btn_vn").unbind("click").bind("click", function () {
					var user = clone(self.currentUser);
					var config = user.config ? user.config : {};
					config.lang = "VN";
					$.ajax({
						url: self.serviceURL + "/api/v1/user/" + user.id,
						data: JSON.stringify({
							"config": { 'lang': 'VN' }
						}),
						type: "PUT",
						success: function (response) {
							location.reload();
						},
						error: function () {
							console.log("ERROR");
						}
					});
				});
			},
			bind_event: function () {
				var self = this;
				$("#logo").bind('click', function () {
					self.router.navigate('lichthanhtra/model');
				});
				$("#logout").unbind('click').bind('click', function () {
					self.router.navigate("logout");
				});
				//for show/hide notify
				$.extend($.easing, {
					easeOutSine: function easeOutSine(x, t, b, c, d) {
						return c * Math.sin(t / d * (Math.PI / 2)) + b;
					}
				});
				var slideConfig = {
					duration: 270,
					easing: 'easeOutSine'
				};
				// Add dropdown animations when toggled.
				$(':not(.main-sidebar--icons-only) .dropdown').on('show.bs.dropdown', function () {
					$(this).find('.dropdown-menu').first().stop(true, true).slideDown(slideConfig);
				});
				$(':not(.main-sidebar--icons-only) .dropdown').on('hide.bs.dropdown', function () {
					$(this).find('.dropdown-menu').first().stop(true, true).slideUp(slideConfig);
				});
				/**
				 * Sidebar toggles
				 */
				$('.toggle-sidebar').unbind("click").bind('click', function (e) {
					$('.main-sidebar').toggleClass('open');
				});
			},
			get_displayName: function (data) {
				var displayName = "";
				if (!!data.name) {
					displayName = data.name;
				}
				if (displayName === null || displayName === "") {
					if (!!data.phone_number) {
						displayName = data.phone_number;
					} else if (!!data.email) {
						displayName = data.email;
					}
				}
				return displayName;
			}
		});
		Backbone.history.start();
	});