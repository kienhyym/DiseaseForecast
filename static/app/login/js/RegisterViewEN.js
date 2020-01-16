define(function (require) {

    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin'),
        storejs = require('vendor/store'),
        tpl = require('text!app/login/tpl/registerEN.html');


    var template = gonrin.template(tpl)({});


    return Gonrin.View.extend({
        template: template,
        modelSchema: [],
        urlPrefix: "/api/v1/",
        collectionName: "",
        //tools:null,

        render: function () {
            var self = this;
            self.$el.find("#btn_vie").unbind('click').bind('click',function () {
                localStorage.setItem("language", "VN");
                self.getApp().getRouter().navigate("register");
            })
            self.$el.find("#btn-back").unbind("click").bind("click", function () {
                self.getApp().getRouter().navigate("login");
            });
            self.applyBindings();
            $.ajax({
                url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
                method: "GET",
                success: function (data) {
                    self.$el.find("#input_gia").on('click', function () {
                        self.$el.find('#txtDonVi').combobox({
                            textField: "ten",
                            valueField: "id",
                            dataSource: data.objects,
                            refresh: true,
                        });
                        self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")
                        self.$el.find("#donvi_selecter div div input").css("border-radius", "30px")
                    });

                    var dsDonVi = [];
                    self.$el.find("#input_gia").keyup(function () {
                        data.objects.forEach(function (item, index) {
                            if ((item.ten).indexOf(self.$el.find("#input_gia").val()) !== -1) {
                                dsDonVi.push(item)
                            }
                        });
                        self.$el.find('#txtDonVi').combobox({
                            textField: "ten",
                            valueField: "id",
                            dataSource: dsDonVi,
                            refresh: true
                        });

                        self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")
                        dsDonVi = [];
                    })
                    self.$el.find('#customCheck2').click(function () {
                        self.$el.find('.zalo-note').toggle();
                    });
                    self.$el.find('#txtDonVi').on('change.gonrin', function (e) {
                        self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "block")
                        self.$el.find("#input_gia").val($('#txtDonVi').data('gonrin').getText());
                        var idDonViDaChon = $('#txtDonVi').data('gonrin').getValue();
                        var thongbaoEmail = "no";
                        var thongbaoZalo = "no";
                        var thongbaoSms = "no";
                        self.$el.find("#btn_register").unbind("click").bind("click", function () {
                            if(self.$el.find('#customCheck1').prop('checked') === true){
                                thongbaoEmail = "yes";
                            }
                            if(self.$el.find('#customCheck2').prop('checked') === true){
                                thongbaoZalo = "yes";
                            }
                            if(self.$el.find('#customCheck3').prop('checked') === true){
                                thongbaoSms = "yes"
                            }
                            console.log(thongbaoEmail,thongbaoZalo,thongbaoSms)

                            $.ajax({
                                method: "POST",
                                url: self.getApp().serviceURL + "/api/v1/register",
                                data: JSON.stringify({
                                    email: self.$el.find("#txtEmail").val(),
                                    name: self.$el.find("#txtName").val(),
                                    phone_number: self.$el.find("#txtPhone").val(),
                                    phone_zalo: self.$el.find("#txtPhoneZalo").val(),
                                    password: 'fgashgfd',
                                    donvi_id: idDonViDaChon,
                                    captren_stt: 2,
                                    tinhthanh_id: null,
                                    quanhuyen_id: null,
                                    xaphuong_id: null,
                                    donvicaptren_id: null,
                                    id_nguoitao: null,
                                    thongbaoemail:thongbaoEmail,
                                    thongbaozalo:thongbaoZalo,
                                    thongbaosms:thongbaoSms,
                                }),
                                headers: {
                                    'content-type': 'application/json'
                                },
                                dataType: 'json',
                                success: function (response) {
                                    if (response) {
                                            self.getApp().notify("You have signed up successfully.");
                                    }
                                }, error: function (xhr, ere) {
                                    console.log('xhr', ere);

                                }
                            })
                        });
                    })
                    self.$el.find("#input_gia").focusout(function () {
                        setTimeout(function () {
                            self.$el.find("#donvi_selecter div div .dropdown-menu").css("display", "none")
                        }, 300);
                    });
                },
                error: function (xhr, status, error) { }
            });
        },

        // registerEvent: function () {
        //     var self = this;
        //     self.$el.find("#btn-back").unbind("click").bind("click", function () {
        //         self.getApp().getRouter().navigate("login");
        //     });
        //     self.$el.find("#btn-register").unbind("click").bind("click", function () {
        //         if (self.$el.find("#txtDonVi").val() === undefined || self.$el.find("#txtDonVi").val() === "") {
        //             self.getApp().notify("Đơn vị không được bỏ trống");
        //             return false;
        //         }
        //         if (self.$el.find("#txtName").val() === undefined || self.$el.find("#txtName").val() === "") {
        //             self.getApp().notify("Tên không được bỏ trống");
        //             return false;
        //         }
        //         if (self.$el.find("#txtPhone").val() === undefined || self.$el.find("#txtPhone").val() === "") {
        //             self.getApp().notify("số điện thoại không được bỏ trống");
        //             return false;
        //         }
        //         if (self.$el.find("#txtPhoneZalo").val() === undefined || self.$el.find("#txtPhoneZalo").val() === "") {
        //             self.getApp().notify("số điện thoại zalo không được bỏ trống");
        //             return false;
        //         }
        //         if (self.$el.find("#txtEmail").val() === undefined || self.$el.find("#txtEmail").val() === "") {
        //             self.getApp().notify("Email không được bỏ trống");
        //             return false;
        //         }

        //         var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //         var email = self.$el.find("#txtEmail").val();
        //         if (!re.test(email)) {
        //             self.getApp().notify("Email sai định dạng");
        //             return false;
        //         }
        //         var templatephonenumber = /^\(?([0-9]{10})$/;
        //         var phonenumber = self.$el.find("#txtPhone").val();
        //         if (!templatephonenumber.test(phonenumber)) {
        //             self.getApp().notify("Số diện thoại sai định dạng");
        //             return false;
        //         }



        //         $.ajax({
        //             method: "POST",
        //             url: self.getApp().serviceURL + "/api/v1/user",
        //             data: JSON.stringify({
        //                 email: self.$el.find("#txtemail").val(),
        //                 name: self.$el.find("#txtname").val(),
        //                 phone_number: self.$el.find("#txtphone").val(),
        //                 phone_zalo: null,
        //                 password: self.$el.find("#txtpass").val(),
        //                 donvi_id: null,
        //                 captren_stt: null,
        //                 tinhthanh_id: null,
        //                 quanhuyen_id: null,
        //                 xaphuong_id: null,
        //                 donvicaptren_id: null,
        //             }),
        //             success: function (response) {
        //                 if (response) {
        //                     self.getApp().notify("Đăng ký thành công");
        //                     self.getApp().getRouter().navigate("login");
        //                 }
        //             }, error: function (xhr) {
        //                 console.log('xhr', xhr);

        //             }
        //         })
        //     });
        // }
    });

});