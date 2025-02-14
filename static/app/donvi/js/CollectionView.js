define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/donvi/tpl/collection.html'),
        schema = require('json!schema/DonViSchema.json');
    var TemplateHelper = require('app/base/view/TemplateHelper');
    return Gonrin.CollectionView.extend({
        // template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "donvi",
        
        render: function () {
            var self = this;
            var translatedTemplate = gonrin.template(template)(LANG);
            self.$el.html(translatedTemplate);
            self.$el.find('.btn-taomoi').unbind("click").bind("click",function () {
                self.getApp().getRouter().navigate(self.collectionName + "/model");
            })
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
            var no_records = "No data yet";

            if (self.getApp().currentUser.config.lang == "VN") {
                no_records = "Chưa có dữ liệu";
            }
            var element = self.$el.find("#grid_all");

            element.grid({
                orderByMode: "client",
                language: {
                    no_records_found: no_records
                },
                noResultsClass: "alert alert-default no-records-found",
                fields: [
                    {
                        field: "ten", label: "{{TEN_DON_VI}}", width: 250, readonly: true,
                    },
                    {
                        field: "email", label: "Email", width: 250, readonly: true,
                    },
                    {
                        field: "sodienthoai", label: "{{SO_DIEN_THOAI}}", width: 250, readonly: true,
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
                onRendered: function (e) {
                    // this.$el.find("#total_people").html(this.collection.numRows + ' ' + LANG.RECORDS + ' / ' + this.collection.totalPages + ' ' + LANG.PAGES);
                    var tableHeader = self.$el.find(".grid-header");
                    var translatedHtml = gonrin.template(tableHeader.html() ? tableHeader.html() : '')(LANG);
                    tableHeader.html(translatedHtml);
                    
                },
                
            });
        },

    });

});
