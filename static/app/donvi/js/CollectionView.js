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
        uiControl: {
            fields: [
                { field: "ma", label: "Mã" },
                { field: "ten", label: "Tên" },
                {
                    field: "tinhthanh_id",
                    label: "Tỉnh thành",
                    foreign: "tinhthanh",
                    foreignValueField: "id",
                    foreignTextField: "ten",
                },
                {
                    field: "quanhuyen_id",
                    label: "Quận/Huyện",
                    foreign: "quanhuyen",
                    foreignValueField: "id",
                    foreignTextField: "ten",
                },
                {
                    field: "xaphuong_id",
                    label: "Xã/Phường/Thị trấn",
                    foreign: "xaphuong",
                    foreignValueField: "id",
                    foreignTextField: "ten",
                },
            ],
            //  pagination: {
            //         page: 1,
            //         pageSize: 100
            //     },
            //  noResultsClass:"alert alert-default no-records-found",
            onRowClick: function (event) {
                if (event.rowId) {
                    var path = this.collectionName + '/model?id=' + event.rowId;
                    this.getApp().getRouter().navigate(path);
                }
            },
            // onRendered: function (e) {
            //     var self = this;
            //     if (this.uiControl.dataSource == null || this.uiControl.dataSource.length<=0){
            //         self.$el.find("#grid").hide();
            //         self.getApp().getRouter().navigate(this.collectionName + '/model');
            //     }
            // }
        },
        render: function () {
            // var self = this;
            // if(self.getApp().currentUser.hasRole("CoSoKCB") === true){
            //     self.getApp().getRouter().navigate(this.collectionName + '/model');
            //     return;
            // }
            //  self.uiControl.orderBy = [{"field": "name", "direction": "asc"}];
            this.applyBindings();
            return this;
        },

    });
});