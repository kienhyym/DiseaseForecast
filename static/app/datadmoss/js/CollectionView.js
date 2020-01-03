define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/datadmoss/tpl/collection.html'),
        schema = require('json!schema/DataDMossSchema.json');
    return Gonrin.CollectionView.extend({
        // template: null,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "datadmoss",
        uiControl: {
            fields: [
                { field: "tieude", label: "{{TIEU_DE}}" , width: 550, readonly: true},
                {
                    field: "ngaygui", 
                    label: "{{NGAY_GUI}}",
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
            onRendered: function (e) {
				this.$el.find("#total_people").html(this.collection.numRows + ' ' + LANG.RECORDS + ' / ' + this.collection.totalPages + ' ' + LANG.PAGES);
				var tableHeader = this.$el.find("table .grid-header");
				var translatedHtml = gonrin.template(tableHeader.html() ? tableHeader.html() : '')(LANG);
				tableHeader.html(translatedHtml);
				
			},
        
        },
        render: function () {
            var self = this;
            var translatedTemplate = gonrin.template(template)(LANG);
            self.$el.html(translatedTemplate);
            self.uiControl.orderBy = [{"field": "ngaygui", "direction": "desc"}];

            this.applyBindings();
            return this;
        },
        
    });
});