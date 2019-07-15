define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/kenhketnoinguoidung/tpl/collection.html'),
        schema = require('json!schema/UserConnectionChannelSchema.json');

    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "kenhketnoinguoidung",
        uiControl: {
            fields: [
                {
                    field: "user_id",
                    label: "Người dùng",
                    foreign: "user",
                    foreignValueField: "id",
                    foreignTextField: "name",
                    width: 250, 
                    readonly: true,
                },
                {
                    field: "channelname", label: "tên kênh", width: 250, readonly: true,
                },
                {
                    field: "value", label: "Giá trị", width: 250, readonly: true,
                },


            ],
            onRowClick: function (event) {
                if (event.rowId) {
                    var path = this.collectionName + '/model?id=' + event.rowId;
                    this.getApp().getRouter().navigate(path);
                }
            }
        },
        render: function () {

            this.applyBindings();
            console.log(this);
            return this;
        },

    });

});