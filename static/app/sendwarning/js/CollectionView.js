define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/sendwarning/tpl/collection.html'),
        schema = require('json!schema/SendWarningSchema.json');
    return Gonrin.CollectionView.extend({
        // template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "sendwarning",
        
        render: function () {
            var self = this;
            var translatedTemplate = gonrin.template(template)(LANG);
            self.$el.html(translatedTemplate);
            self.$el.find('.btn-taomoi').unbind("click").bind("click",function () {
                self.getApp().getRouter().navigate(self.collectionName + "/model");
            })
            this.khoitao();
            if (self.getApp().currentUser.captren_stt == 1) {
                $('#xxx').removeClass('active');
                $('#yyy').addClass('active');

                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/sendwarning?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                    contentType: "application/json",
                    success: function (data) {
                        var arr = [];
                        data.objects.forEach(function (item, index) {
                            if (item.user_id == self.getApp().currentUser.id && (item.ngayguizalo !== null || item.ngayguigmail !== null || item.ngayguiphone !== null)) {
                                arr.push(item);
                            }
                        })

                        self.render_grid2(2, arr);

                    },
                })
            } else {
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/sendwarning?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                    contentType: "application/json",
                    success: function (data) {
                        var arr = [];
                        data.objects.forEach(function (item, index) {
                            var dem = 0;

                            if (item.user_id !== self.getApp().currentUser.id) {
                                if (self.getApp().currentUser.phone_zalo !== "") {
                                    if (item.tozalo !== null && item.tozalo.length !== 0) {
                                        (item.tozalo).forEach(function (item2, index2) {
                                            if (item2 == self.getApp().currentUser.phone_zalo) {
                                                dem++;
                                            }
                                        })
                                    }
                                }

                                if ((item.toemail !== null && item.toemail.length !== 0)) {
                                    
                                    (item.toemail).forEach(function (item2, index2) {
                                        
                                        if (item2 == self.getApp().currentUser.email) {
                                            dem++;
                                        }
                                    });
                                }
                                if ((item.tophone !== null && item.tophone.length !== 0)) {
                                    (item.tophone).forEach(function (item2, index2) {
                                        if (item2 == self.getApp().currentUser.phone_number) {
                                            dem++;
                                        }
                                    });
                                }
                                if (dem > 0) {
                                    arr.push(item)
                                }

                            }



                        })

                        self.render_grid2(1, arr);
                    },
                })
            }


            this.applyBindings();



            return this;
        },
        khoitao: function () {
            var self = this;



            self.$el.find("#xxx").on('click', function () {

                self.$el.find("#all").css("display", "none");
                self.$el.find("#thudagui").css("display", "none");
                self.$el.find("#hopthuden").css("display", "block");
                self.$el.find("#thunhap").css("display", "none");

                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/sendwarning?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                    contentType: "application/json",
                    success: function (data) {
                        var arr = [];
                        data.objects.forEach(function (item, index) {
                            var dem = 0;

                            if (item.user_id !== self.getApp().currentUser.id) {
                                if (self.getApp().currentUser.phone_zalo !== "") {
                                    if (item.tozalo !== null && item.tozalo.length !== 0) {
                                        (item.tozalo).forEach(function (item2, index2) {
                                            if (item2 == self.getApp().currentUser.phone_zalo) {
                                                dem++;
                                            }
                                        })
                                    }
                                }

                                if ((item.toemail !== null && item.toemail.length !== 0)) {
                                    
                                    (item.toemail).forEach(function (item2, index2) {
                                        
                                        if (item2 == self.getApp().currentUser.email) {
                                            dem++;
                                        }
                                    });
                                }
                                if ((item.tophone !== null && item.tophone.length !== 0)) {
                                    (item.tophone).forEach(function (item2, index2) {
                                        if (item2 == self.getApp().currentUser.phone_number) {
                                            dem++;
                                        }
                                    });
                                }
                                if (dem > 0) {
                                    arr.push(item)
                                }

                            }



                        })

                        self.render_grid2(1, arr);
                    },
                })

            })
            self.$el.find("#yyy").on('click', function () {

                self.$el.find("#all").css("display", "none");
                self.$el.find("#hopthuden").css("display", "none");
                self.$el.find("#thudagui").css("display", "block");
                self.$el.find("#thunhap").css("display", "none");

                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/sendwarning?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                    contentType: "application/json",
                    success: function (data) {
                        var arr = [];
                        data.objects.forEach(function (item, index) {
                            if (item.user_id == self.getApp().currentUser.id && (item.ngayguizalo !== null || item.ngayguigmail !== null || item.ngayguiphone !== null)) {
                                arr.push(item);
                            }
                        })

                        self.render_grid2(2, arr);

                    },
                })

            })
            self.$el.find("#zzz").on('click', function () {

                self.$el.find("#all").css("display", "none");
                self.$el.find("#hopthuden").css("display", "none");
                self.$el.find("#thudagui").css("display", "none");
                self.$el.find("#thunhap").css("display", "block");
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/sendwarning?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                    contentType: "application/json",
                    success: function (data) {
                        var arr = [];
                        data.objects.forEach(function (item, index) {
                            if (item.user_id == self.getApp().currentUser.id && item.ngayguizalo == null && item.ngayguigmail == null && item.ngayguiphone == null) {
                                arr.push(item);
                            }
                        })

                        self.render_grid2(3, arr);

                    },
                })

            })
        },
        render_grid2: function (stauts, dataSource) {

            var self = this;
            var no_records = "No data yet";

            if (self.getApp().currentUser.config.lang == "VN") {
                no_records = "Chưa có dữ liệu";
            }

            var element;
            if (stauts == 0) {
                element = self.$el.find("#all");
            }
            else if (stauts == 1) {
                element = self.$el.find("#hopthuden");
            }
            else if (stauts == 2) {
                element = self.$el.find("#thudagui");
            }
            else {
                element = self.$el.find("#thunhap");
            }


            element.grid({
                // showSortingIndicator: true,
                orderByMode: "client",
                language: {
                    no_records_found: no_records
                },
                noResultsClass: "alert alert-default no-records-found",
                fields: [
                    { field: "cc", label: "{{CHU_DE}}", width: 350, readonly: true },
                    {
                        field: "ngayguizalo", label: "{{NGAY_GUI_QUA_ZALO}}", width: 150, readonly: true,
                        template: function (rowData) {
                            if (!!rowData && rowData.ngayguizalo) {
                                var utcTolocal = function (times, format) {
                                    return moment(times * 1000).local().format(format);
                                }
                                return utcTolocal(rowData.ngayguizalo, "DD/MM/YYYY");
                            }
                            if (self.getApp().currentUser.config.lang == "VN") {
                                return "Chưa gửi";

							} else {
                                return "Unsent";
							}                        },
                    },
                    {
                        field: "ngayguigmail", label: "{{NGAY_GUI_QUA_GMAIL}}", width: 150, readonly: true,
                        template: function (rowData) {
                            if (!!rowData && rowData.ngayguigmail) {
                                var utcTolocal = function (times, format) {
                                    return moment(times * 1000).local().format(format);
                                }
                                return utcTolocal(rowData.ngayguigmail, "DD/MM/YYYY");
                            }
                            if (self.getApp().currentUser.config.lang == "VN") {
                                return "Chưa gửi";

							} else {
                                return "Unsent";
							}
                           
                        },
                    },
                    {
                        field: "ngayguiphone", label: "{{NGAY_GUI_QUA_SMS}}", width: 150, readonly: true,
                        template: function (rowData) {
                            if (!!rowData && rowData.ngayguiphone) {
                                var utcTolocal = function (times, format) {
                                    return moment(times * 1000).local().format(format);
                                }
                                return utcTolocal(rowData.ngayguiphone, "DD/MM/YYYY");
                            }
                            if (self.getApp().currentUser.config.lang == "VN") {
                                return "Chưa gửi";

							} else {
                                return "Unsent";
							}                        },
                    },
                ],
                dataSource: dataSource,
                primaryField: "id",
                selectionMode: false,
                pagination: {
                    page: 1,
                    pageSize: 100
                },
                onRendered: function (e) {
                    var tableHeader = self.$el.find("table .grid-header");
                    var translatedHtml = gonrin.template(tableHeader.html() ? tableHeader.html() : '')(LANG);
                    tableHeader.html(translatedHtml);
                    
                },
                events: {
                    "rowclick": function (e) {
                        self.getApp().getRouter().navigate("sendwarning/model?id=" + e.rowId);
                    },
                },
            });

        },



    });
});