define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/sendwarning/tpl/collection.html'),
        schema = require('json!schema/SendWarningSchema.json');
    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "sendwarning",
        // uiControl: {
        //     fields: [
        //         { field: "cc", label: "Chủ đề", width: 350, readonly: true },
        //         {
        //             field: "ngayguizalo", label: "Ngày gửi qua zalo", width: 150, readonly: true,
        //             template: function (rowData) {
        //                 if (!!rowData && rowData.ngayguizalo) {
        //                     var utcTolocal = function (times, format) {
        //                         return moment(times * 1000).local().format(format);
        //                     }
        //                     return utcTolocal(rowData.ngayguizalo, "DD/MM/YYYY");
        //                 }
        //                 return "Chưa gửi";
        //             },
        //         },
        //         {
        //             field: "ngayguigmail", label: "Ngày gửi qua gmail", width: 150, readonly: true,
        //             template: function (rowData) {
        //                 if (!!rowData && rowData.ngayguigmail) {
        //                     var utcTolocal = function (times, format) {
        //                         return moment(times * 1000).local().format(format);
        //                     }
        //                     return utcTolocal(rowData.ngayguigmail, "DD/MM/YYYY");
        //                 }
        //                 return "Chưa gửi";
        //             },
        //         },
        //         {
        //             field: "ngayguiphone", label: "Ngày gửi qua sms", width: 150, readonly: true,
        //             template: function (rowData) {
        //                 if (!!rowData && rowData.ngayguiphone) {
        //                     var utcTolocal = function (times, format) {
        //                         return moment(times * 1000).local().format(format);
        //                     }
        //                     return utcTolocal(rowData.ngayguiphone, "DD/MM/YYYY");
        //                 }
        //                 return "Chưa gửi";
        //             },
        //         },


        //     ],
        //     onRowClick: function (event) {
        //         if (event.rowId) {
        //             var path = this.collectionName + '/model?id=' + event.rowId;
        //             this.getApp().getRouter().navigate(path);
        //         }


        // },
        render: function () {
            var self = this;
            this.khoitao();

            $.ajax({
                url: self.getApp().serviceURL + "/api/v1/sendwarning",
                method: "GET",
                data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                contentType: "application/json",
                success: function (data) {
                    var arr = [];
                    data.objects.forEach(function (item, index) {
                        var dem = 0;
                        if (item.tozalo !== null) {
                            (item.tozalo).forEach(function (item2, index2) {

                                if (item2 == self.getApp().currentUser.phone_zalo) {
                                    dem++;
                                }
                            })
                            if (dem > 0) {
                                arr.push(item)
                            }
                        }

                    })
                    self.render_grid2(0, arr);
                },
            })
            this.applyBindings();



            return this;
        },
        khoitao: function () {
            var self = this;



            self.$el.find("#xxx").on('click', function () {
                // self.getApp().getRouter().refresh();
                self.$el.find("#all").css("display","none");
                self.$el.find("#thudagui").css("display","none");
                self.$el.find("#hopthuden").css("display","block");
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/sendwarning",
                    method: "GET",
                    data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                    contentType: "application/json",
                    success: function (data) {
                        var arr = [];
                        data.objects.forEach(function (item, index) {
                            var dem = 0;
                            if (item.tozalo !== null) {
                                (item.tozalo).forEach(function (item2, index2) {

                                    if (item2 == self.getApp().currentUser.phone_zalo) {
                                        dem++;
                                    }
                                })
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

                self.$el.find("#all").css("display","none");
                self.$el.find("#hopthuden").css("display","none");
                self.$el.find("#thudagui").css("display","block");

                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/sendwarning",
                    method: "GET",
                    data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                    contentType: "application/json",
                    success: function (data) {
                        var arr = [];
                        data.objects.forEach(function (item, index) {
                            if (item.user_id == self.getApp().currentUser.id) {
                                arr.push(item);
                            }
                        })

                        self.render_grid2(2, arr);

                    },
                })
               
            })
        },
        render_grid2: function (stauts, dataSource) {

            var self = this;
            var element;
            if (stauts == 0) {
                element = self.$el.find("#all");
            }
            else if (stauts == 1) {
                element = self.$el.find("#hopthuden");
            }
            else {
                element = self.$el.find("#thudagui");
            }

            element.grid({
                // showSortingIndicator: true,
                orderByMode: "client",
                language: {
                    no_records_found: "Chưa có dữ liệu"
                },
                noResultsClass: "alert alert-default no-records-found",
                fields: [
                    { field: "cc", label: "Chủ đề", width: 350, readonly: true },
                    {
                        field: "ngayguizalo", label: "Ngày gửi qua zalo", width: 150, readonly: true,
                        template: function (rowData) {
                            if (!!rowData && rowData.ngayguizalo) {
                                var utcTolocal = function (times, format) {
                                    return moment(times * 1000).local().format(format);
                                }
                                return utcTolocal(rowData.ngayguizalo, "DD/MM/YYYY");
                            }
                            return "Chưa gửi";
                        },
                    },
                    {
                        field: "ngayguigmail", label: "Ngày gửi qua gmail", width: 150, readonly: true,
                        template: function (rowData) {
                            if (!!rowData && rowData.ngayguigmail) {
                                var utcTolocal = function (times, format) {
                                    return moment(times * 1000).local().format(format);
                                }
                                return utcTolocal(rowData.ngayguigmail, "DD/MM/YYYY");
                            }
                            return "Chưa gửi";
                        },
                    },
                    {
                        field: "ngayguiphone", label: "Ngày gửi qua sms", width: 150, readonly: true,
                        template: function (rowData) {
                            if (!!rowData && rowData.ngayguiphone) {
                                var utcTolocal = function (times, format) {
                                    return moment(times * 1000).local().format(format);
                                }
                                return utcTolocal(rowData.ngayguiphone, "DD/MM/YYYY");
                            }
                            return "Chưa gửi";
                        },
                    },
                ],
                dataSource: dataSource,
                primaryField: "id",
                selectionMode: false,
                pagination: {
                    page: 1,
                    pageSize: 100
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