define(function(require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin'),
        tpl = require('text!app/login/tpl/loginEN.html');
    var template = gonrin.template(tpl)({});
    return Gonrin.View.extend({
        render: function() {
            var self = this;
           
            this.$el.html(template);
            self.getApp().currentUser = null;
            $("body").attr({
                'style': 'background-color: #e9ecf3 !important;'
            });
            this.$el.find("#login-form").unbind("submit").bind("submit", function() {
                self.processLogin();
                return false;
            });
            $("#unsubscribe-btn").unbind('click').bind('click', function(){
                self.getApp().getRouter().navigate("unsubscribeEN");
            });
            $("#register-btn").unbind('click').bind('click', function(){
                self.getApp().getRouter().navigate("registerEN");
            });
            $("#forgot-btn").unbind('click').bind('click', function(){
                self.getApp().getRouter().navigate("forgotEN");
        	});
            self.$el.find(".backgroundColor").css("width",screen.availWidth);
			self.$el.find(".backgroundColor").css("height",screen.availHeight);
            self.$el.find("#btn_vie").unbind('click').bind('click',function () {
                localStorage.setItem("language", "VN");
                self.getApp().getRouter().navigate("login");
            })
            self.$el.find("#btn_eng").unbind('click').bind('click',function () {
                localStorage.setItem("language", "EN");
                self.getApp().getRouter().navigate("loginEN");

            })
            if(localStorage.getItem("language") == "EN"){
                self.getApp().getRouter().navigate("loginEN");
            }
            else{
                self.getApp().getRouter().navigate("login");
            }
            return this;
        },
        processLogin: function() {
            console.log("submit")
            var username = this.$('[name=username]').val().toLowerCase().trim();
            var password = this.$('[name=password]').val().trim();
            var data = JSON.stringify({
                username: username,
                password: password
            });
            var self = this;
            $.ajax({
                url:self.getApp().serviceURL + "/api/v1/login",
                type: 'post',
                data: data,
                success: function(response) {
                   
                    self.getApp().postLogin(response);
                    self.getApp().getRouter().navigate("index");
                },
                error: function(xhr) {
                    self.getApp().notify({ message: "Username or password incorrect" }, { type: "danger", delay: 1000 });

                }
            });
        },
    });
});