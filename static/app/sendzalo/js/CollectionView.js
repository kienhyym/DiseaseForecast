define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/sendzalo/tpl/collection.html'),
        schema = require('json!schema/SendZaloSchema.json');
    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "sendzalo",
        uiControl: {
            fields: [
                { field: "email", label: "Người gửi" , width: 250, readonly: true},
                { field: "message", label:"Chủ đề" , width: 550, readonly: true},
            
            ],
            onRowClick: function (event) {
                if (event.rowId) {
                    var path = this.collectionName + '/model?id=' + event.rowId;
                    this.getApp().getRouter().navigate(path);
                }
            },
        
        },
        render: function () {
        
            this.applyBindings();
            return this;
        },

    });
});