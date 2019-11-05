define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/donvi/tpl/collection.html'),
        schema = require('json!schema/DonViSchema.json');
    var TemplateHelper = require('app/base/view/TemplateHelper');
    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "donvi",
        // uiControl: {
        //     fields: [
        //         { field: "ma", label: "Mã" },
        //         { field: "ten", label: "Tên" },
        //         {
        //             field: "tinhthanh_id",
        //             label: "Tỉnh thành",
        //             foreign: "tinhthanh",
        //             foreignValueField: "id",
        //             foreignTextField: "ten",
        //         },
        //         {
        //             field: "quanhuyen_id",
        //             label: "Quận/Huyện",
        //             foreign: "quanhuyen",
        //             foreignValueField: "id",
        //             foreignTextField: "ten",
        //         },
        //         {
        //             field: "xaphuong_id",
        //             label: "Xã/Phường/Thị trấn",
        //             foreign: "xaphuong",
        //             foreignValueField: "id",
        //             foreignTextField: "ten",
        //         },
        //     ],

        //     onRowClick: function (event) {
        //         if (event.rowId) {
        //             var path = this.collectionName + '/model?id=' + event.rowId;
        //             this.getApp().getRouter().navigate(path);
        //         }
        //     },

        // },
        // render: function () {

        //     this.applyBindings();
        //     return this;
        // },
        render: function () {

            this.applyBindings();
            this.khoitao();

            return this;
        },
        khoitao: function () {
            var self = this;
            $.ajax({
                url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
                method: "GET",
                data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                contentType: "application/json",
                success: function (data) {
                    var arr = [];
                    data.objects.forEach(function (item, index) {
                        if (item.donvicaptren == self.getApp().currentUser.donvi_id) {
                            arr.push(item);
                        }
                    });             
                    self.render_grid2(arr);
                },
            })
        },
        render_grid2: function (dataSource) {
            var self = this;
            var element = self.$el.find("#grid_all");

            element.grid({
                orderByMode: "client",
                language: {
                    no_records_found: "Chưa có dữ liệu"
                },
                noResultsClass: "alert alert-default no-records-found",
                fields: [
                    {
                        field: "ten", label: "Tên đơn vị", width: 250, readonly: true,
                    },
                    {
                        field: "email", label: "Email", width: 250, readonly: true,
                    },
                    {
                        field: "sodienthoai", label: "Số điện thoại", width: 250, readonly: true,
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
                        self.getApp().getRouter().navigate("donvi/model?id=" + e.rowId);
                    },
                },
            });
        },

    });

});
