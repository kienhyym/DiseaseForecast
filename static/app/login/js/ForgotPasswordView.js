define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin'),
        tpl = require('text!app/login/tpl/forgotpassword.html');
    var template = gonrin.template(tpl)({});
    return Gonrin.View.extend({
        template: template,
        modelSchema: [],
        urlPrefix: "/api/v1/",
        collectionName: "",
        render: function () {
            var self = this;
            self.$el.find("#btn_forgot").unbind("click").bind("click", function () {
               
               self.processForgotPass();
            });
            self.$el.find("#btn-back").unbind("click").bind("click", function () {
                self.getApp().getRouter().navigate("login");
            });
            return this;
        },
        validateEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        processForgotPass: function () {
            var self = this;
            var email = self.$el.find("#txtgmail").val();
            
            if (email === null || email === "" || self.validateEmail(email) === false) {
                self.getApp().notify("Email không hợp lệ, vui lòng kiểm tra lại");
                return;
            }
            var data = JSON.stringify({
                email: self.$el.find("#txtgmail").val()
            });
            var self = this;
            $.ajax({
                url: (self.getApp().serviceURL || "") + '/api/resetpw',
                type: 'post',
                data: data,
                headers: {
                    'content-type': 'application/json'
                },
                dataType: 'json',
                success: function (data) {
                    console.log('suscess')
                    $('#login-form').html('<label class="control-label">' + data.error_message + '</label>');
                },
                error: function (xhr, status, error) {
                    try {
                        self.getApp().notify($.parseJSON(xhr.responseText).error_message);
                    }
                    catch (err) {
                        self.getApp().notify("có lỗi xảy ra, vui lòng thử lại sau ");
                    }

                }
            });
        },
    });
});