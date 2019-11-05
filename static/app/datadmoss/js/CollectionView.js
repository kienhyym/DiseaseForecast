define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/datadmoss/tpl/collection.html'),
        schema = require('json!schema/DataDMossSchema.json');
    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "datadmoss",
        uiControl: {
            fields: [
                { field: "tieude", label: "Tiêu đề" , width: 550, readonly: true},
                {
                    field: "ngaygui", label: "Ngày gửi",
                    template: function (rowData) {
                        if (!!rowData && rowData.ngaygui) {
                    
                            var utcTolocal = function (times, format) {
                                return moment(times * 1000).local().format(format);
                            }
                            // return template_helper.datetimeFormat(rowData.ngaythanhtra, "DD/MM/YYYY");
                            return utcTolocal(rowData.ngaygui, "DD/MM/YYYY");
                        }
                        return "";
                    },
                },
            
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