define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin'),
        tpl = require('text!app/login/tpl/login.html');

    var template = gonrin.template(tpl)({});

    return Gonrin.View.extend({
        render: function () {
            var self = this;

            this.$el.html(template);

            self.getApp().currentUser = null;
            $("body").attr({
                'style': 'background-color: #e9ecf3 !important;'
            });
            this.$el.find("#login-form").unbind("submit").bind("submit", function () {
                self.processLogin();
                return false;
            });
            $("#register-btn").unbind('click').bind('click', function () {
                self.getApp().getRouter().navigate("register");
            });
            $("#unsubscribe-btn").unbind('click').bind('click', function () {
                self.getApp().getRouter().navigate("unsubscribe");
            });
            $("#forgot-btn").unbind('click').bind('click', function () {
                self.getApp().getRouter().navigate("forgot");
            });
            self.$el.find(".backgroundColor").css("width", screen.availWidth);
            self.$el.find(".backgroundColor").css("height", screen.availHeight);
            self.$el.find("#btn_eng").unbind('click').bind('click', function () {
                localStorage.setItem("language", "EN");
                self.getApp().getRouter().navigate("loginEN");

            })
            self.$el.find("#btn_vie").unbind('click').bind('click', function () {
                localStorage.setItem("language", "VN");
                self.getApp().getRouter().navigate("login");
            })

            if (localStorage.getItem("language") == "EN") {
                self.getApp().getRouter().navigate("loginEN");
            }
            else {
                self.getApp().getRouter().navigate("login");
            }
            // uplaod file
            // self.$el.find('#gettoken').bind('click', function () {
            //     $.ajax({
            //         type: "POST",
            //         url: self.getApp().serviceURL + "/api/v1/connect_dengue_notification_module",
            //         headers: { 'appkey': 'dmoss', 'secret': '123456' },
            //         success: function (response) {
            //             console.log(response)
            //         }
            //     })
            // })


            // self.$el.find("#upload-dmoss").on("change", function () {
            //     var http = new XMLHttpRequest();
            //     var fd = new FormData();
            //     fd.append('file', this.files[0]);
            //     http.open('POST', '/api/v1/dmoss_upload');
            //     http.setRequestHeader('X-Auth-Token','FDSDFDV26DBFsdfgsdg634vfsdfsdfdgt35gw')
            //     http.upload.addEventListener('progress', function (evt) {
            //         if (evt.lengthComputable) {
            //             var percent = evt.loaded / evt.total;
            //             percent = parseInt(percent * 100);
            //         }
            //     }, false);
            //     http.addEventListener('error', function () {
            //     }, false);

            //     http.onreadystatechange = function () {
            //         if (http.status === 200) {
            //             if (http.readyState === 4) {
            //                 var data_file = JSON.parse(http.responseText), link, p, t;
            //                 self.getApp().notify("Tải lên thành công");
            //                 self.getApp().getRouter().refresh();
            //             }
            //         } else {
            //             self.getApp().notify({ message: "Incorrect token" }, { type: "danger", delay: 1000 });
            //             self.getApp().getRouter().refresh();
            //         }
            //     };

            //     http.send(fd);

            // });

            // het upload file


            return this;
        },
        processLogin: function () {
            console.log("submit")
            var username = this.$('[name=username]').val().toLowerCase().trim();
            var password = this.$('[name=password]').val().trim();
            var data = JSON.stringify({
                username: username,
                password: password
            });
            var self = this;
            $.ajax({
                url: self.getApp().serviceURL + "/api/v1/login",
                type: 'post',
                data: data,
                success: function (response) {

                    self.getApp().postLogin(response);
                    localStorage.setItem("language", response.config.lang)
                    self.getApp().getRouter().navigate("index");
                },
                error: function (xhr) {
                    self.getApp().notify({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" }, { type: "danger", delay: 1000 });

                }
            });
        },
    });
});