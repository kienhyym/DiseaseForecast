define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/user/tpl/collection.html'),
        schema = require('json!schema/UserSchema.json');

    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "user",
        // uiControl:{
        //     fields: [
        //         {
        //             field: "name", label: "Tên", width: 250, readonly: true,
        //         },
        //         {
        //             field: "email", label: "Email", width: 250, readonly: true,
        //         },
        //         {
        //             field: "phone_number", label: "Số điện thoại", width: 250, readonly: true,
        //         },
        //     ],
        //     onRowClick: function (event) {
        //         if (event.rowId) {
        //             var path =  this.collectionName + '/model?id=' + event.rowId;
        //             this.getApp().getRouter().navigate(path);
        //         }
        //     }
        // },
        render: function () {

            this.applyBindings();
            this.khoitao();

            return this;
        },
        khoitao: function () {
            var self = this;
            $.ajax({
                url: self.getApp().serviceURL + "/api/v1/user",
                method: "GET",
                data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                contentType: "application/json",
                success: function (data) {
                    var arr = [];
                    if (self.getApp().currentUser.donvi_captren_id == 1) {

                        data.objects.forEach(function (item, index) {
                            if (item.donvi_captren_id == 2) {
                                arr.push(item);
                            }
                        });

                    }
                    if (self.getApp().currentUser.donvi_captren_id == 2) {

                        data.objects.forEach(function (item, index) {
                            if (item.donvi_captren_id == 3) {
                                if (item.tinhthanh__id == self.getApp().currentUser.tinhthanh__id) {
                                    arr.push(item);
                                }
                                
                            }
                        });

                    }
                    if (self.getApp().currentUser.donvi_captren_id == 3) {

                        data.objects.forEach(function (item, index) {
                            if (item.donvi_captren_id == 4) {
                                if (item.quanhuyen_id == self.getApp().currentUser.quanhuyen_id) {
                                    arr.push(item);
                                }
                            }
                        });

                    }
                    self.render_grid2(arr);
                },
            })
        },
        render_grid2: function (dataSource) {
            var self = this;
            var element = self.$el.find("#grid_all");

            element.grid({
                // showSortingIndicator: true,
                orderByMode: "client",
                language: {
                    no_records_found: "Chưa có dữ liệu"
                },
                noResultsClass: "alert alert-default no-records-found",
                fields: [
                    {
                        field: "name", label: "Tên", width: 250, readonly: true,
                    },
                    {
                        field: "email", label: "Email", width: 250, readonly: true,
                    },
                    {
                        field: "phone_number", label: "Số điện thoại", width: 250, readonly: true,
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
                        self.getApp().getRouter().navigate("user/model?id=" + e.rowId);
                    },
                },
            });
        },

    });

});