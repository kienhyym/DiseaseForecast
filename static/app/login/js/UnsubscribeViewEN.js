define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin'),
        tpl = require('text!app/login/tpl/unsubscribeEN.html');
    var template = gonrin.template(tpl)({});
    return Gonrin.View.extend({
        template: template,
        modelSchema: [],
        urlPrefix: "/api/v1/",
        collectionName: "",
        render: function () {
            var self = this;
            self.$el.find("#btn_vie").unbind('click').bind('click', function () {
                localStorage.setItem("language", "VN");

                self.getApp().getRouter().navigate("unsubscribe");
            })
            self.$el.find("#btn_eng").unbind('click').bind('click', function () {
                localStorage.setItem("language", "EN");
                self.getApp().getRouter().navigate("unsubscribeEN");
            })


            self.$el.find("#btn_unsubscribe").unbind("click").bind("click", function () {

                $.ajax({
                    type: "POST",
                    url: self.getApp().serviceURL + "/api/v1/yeucauhuy",
                    data: JSON.stringify({
                        email: self.$el.find("#txtvalue").val(),
                        phone_number: self.$el.find("#txtvalue").val()
                    }),
                    headers: {
                        'content-type': 'application/json'
                    },
                    dataType: 'json',
                    success: function (data, res) {
                            self.getApp().notify({ message: "Request successful" });
                            self.getApp().getRouter().navigate("login");
                    },
                    error: function (xhr, status, error) {
                            self.getApp().notify({ message: "Email or phone number does not exist in the system" }, { type: "danger", delay: 1000 });
                    },
                });
            });
            self.$el.find("#btn-back").unbind("click").bind("click", function () {
                self.getApp().getRouter().navigate("login");
            });
            self.$el.find(".backgroundColor").css("width", screen.availWidth);
            self.$el.find(".backgroundColor").css("height", screen.availHeight);
            return this;
        },
    });
});