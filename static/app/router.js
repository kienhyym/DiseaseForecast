define(function (require) {
    "use strict";
    var $ = require('jquery'),
        Gonrin = require('gonrin');
    var Login = require('app/login/js/LoginView');
    var LoginEN = require('app/login/js/LoginENView');
    var ChangePasswordView = require('app/login/js/ChangePasswordView');
    var ForgotPasswordView = require('app/login/js/ForgotPasswordView');
    var ForgotPasswordENView = require('app/login/js/ForgotPasswordENView');
    var RegisterView = require('app/login/js/RegisterView');
    var IndexView = require('app/login/js/IndexView');
    var navdata = require('app/nav/route');
    return Gonrin.Router.extend({
        routes: {
            "index": "index",
            "login": "login",
            "loginEN": "loginEN",
            "logout": "logout",
            "forgot": "forgotPassword",
            "forgotEN": "forgotPasswordEN",
            "changepassword": "changepassword",
            "register": "register",
            "error": "error_page",
            "*path": "defaultRoute"
        },
        defaultRoute: function () {
            //this.navigate("index",true);
            //        	this.navigate('dangkykham/collection');
        },
        index: function () {
            var indexView = new IndexView({ el: $('.main-content-container') });
            indexView.render();
        },
        logout: function () {
            var self = this;
            $.ajax({
                url: self.getApp().serviceURL + '/api/v1/logout',
                dataType: "json",
                success: function (data) {
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //       		    	self.getApp().notify(self.getApp().translate("LOGOUT_ERROR"));
                },
                complete: function () {
                    self.navigate("login");
                }
            });
        },
        error_page: function () {
            var app = this.getApp();
            if (app.$content) {
                app.$content.html("Error Page");
            }
            return;
        },
        login: function () {
            var loginview = new Login({ el: $('.content-contain') });
            loginview.render();
        },
        loginEN: function () {
            var loginEnview = new LoginEN({ el: $('.content-contain') });
            loginEnview.render();
        },
        forgotPassword: function () {
            var forgotPassView = new ForgotPasswordView({ el: $('.content-contain') });
            forgotPassView.render();
        },
        forgotPasswordEN: function () {
            var forgotPassENView = new ForgotPasswordENView({ el: $('.content-contain') });
            forgotPassENView.render();
        },
        changepassword: function () {
            var self = this;
            var changePasswordView = new ChangePasswordView(
                {
                    el: $('.content-contain'),
                    id: self.getApp().currentUser.id
                });
            changePasswordView.render();
        },
        register: function () {
            var registerView = new RegisterView({ el: $('.content-contain') });
            registerView.render();
        },
        registerAppRoute: function () {
            var self = this;
            $.each(navdata, function (idx, entry) {
                var entry_path = _.result(entry, 'route');
                self.route(entry_path, entry.collectionName, function () {
                    require([entry['$ref']], function (View) {
                        var view = new View({ el: self.getApp().$content, viewData: entry.viewData });
                        view.render();
                    });
                });
            });
        },
    });
});