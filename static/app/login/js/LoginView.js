define(function(require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin'),
        tpl = require('text!app/login/tpl/login.html');
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
                    console.log(self.getApp().serviceURL );
                    self.getApp().postLogin(response);
                },
                error: function(xhr) {
                }
            });
        },
    });
});