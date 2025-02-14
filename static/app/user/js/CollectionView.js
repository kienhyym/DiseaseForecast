define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/user/tpl/collection.html'),
        schema = require('json!schema/UserSchema.json');

    return Gonrin.CollectionView.extend({
        // template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "user",
        render: function () {
            var self = this;
            var translatedTemplate = gonrin.template(template)(LANG);
            self.$el.html(translatedTemplate);
            self.$el.find('.btn-taomoi').unbind("click").bind("click",function () {
                self.getApp().getRouter().navigate(self.collectionName + "/model");
            })
            this.applyBindings();
            this.khoitao();
            if(self.getApp().currentUser.phancapnhanbaocao != "quanly"){
                self.$el.find('.toolbar').hide();
            }
            return this;
        },
        khoitao: function () {
            var self = this;
            var filters = {
                filters: {
                    "$or": [
                        { "kiemduyet": { "$eq": "daduyet" } },
                        { "kiemduyet": { "$eq": "yeucauhuy" } }

                    ]
                },
                order_by: [{ "field": "created_at", "direction": "asc" }]
            }
            $.ajax({
                url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
                method: "GET",
                data: "q=" + JSON.stringify(filters),
                contentType: "application/json",
                success: function (data) {

                    self.render_grid2(data.objects);
                },
            })
            self.$el.find("#btn_chuaduyet").on('click', function () {
                var filters = {
                    filters: {
                        "$and": [
                            { "kiemduyet": { "$eq": "chuaduyet" } }
                        ]
                    },
                    order_by: [{ "field": "created_at", "direction": "asc" }]
                }
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: "q=" + JSON.stringify(filters),
                    contentType: "application/json",
                    success: function (data) {
                        self.render_grid2(data.objects);
                    },
                })

            })
            self.$el.find("#btn_daduyet").on('click', function () {
                var filters = {
                    filters: {
                        "$or": [
                            { "kiemduyet": { "$eq": "daduyet" } },
                            { "kiemduyet": { "$eq": "yeucauhuy" } }

                        ]
                    },
                    order_by: [{ "field": "created_at", "direction": "asc" }]
                }
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: "q=" + JSON.stringify(filters),
                    contentType: "application/json",
                    success: function (data) {
                        self.render_grid2(data.objects);
                    },
                })

            })
            self.$el.find("#btn_khongduyet").on('click', function () {
                var filters = {
                    filters: {
                        "$and": [
                            { "kiemduyet": { "$eq": "khongduyet" } }
                        ]
                    },
                    order_by: [{ "field": "created_at", "direction": "asc" }]
                }
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: "q=" + JSON.stringify(filters),
                    contentType: "application/json",
                    success: function (data) {
                        self.render_grid2(data.objects);
                    },
                })

            })
            self.$el.find("#btn_yeucauhuy").on('click', function () {
                var filters = {
                    filters: {
                        "$and": [
                            { "kiemduyet": { "$eq": "yeucauhuy" } }
                        ]
                    },
                    order_by: [{ "field": "created_at", "direction": "asc" }]
                }
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: "q=" + JSON.stringify(filters),
                    contentType: "application/json",
                    success: function (data) {
                        self.render_grid2(data.objects);
                    },
                })

            })
            self.$el.find("#btn_duyethuy").on('click', function () {
                var filters = {
                    filters: {
                        "$and": [
                            { "kiemduyet": { "$eq": "dongyhuy" } }
                        ]
                    },
                    order_by: [{ "field": "created_at", "direction": "asc" }]
                }
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: "q=" + JSON.stringify(filters),
                    contentType: "application/json",
                    success: function (data) {
                        self.render_grid2(data.objects);
                    },
                })

            })
        },
        render_grid2: function (dataSource) {
            var self = this;
            var no_records = "No data yet";

            if (self.getApp().currentUser.config.lang == "VN") {
                no_records = "Chưa có dữ liệu";
            }
            // var element;
            // if (status == 0) {
            //     element = self.$el.find("#all");
            // }
            // else if (status == 1) {
            //     element = self.$el.find("#all");
            // }
            // else if (status == 2) {
            //     element = self.$el.find("#all");
            // }
            var element = self.$el.find("#all");
            element.grid({
                // showSortingIndicator: true,
                orderByMode: "client",
                language: {
                    no_records_found: no_records,
                },
                noResultsClass: "alert alert-default no-records-found",
                fields: [
                    {
                        field: "name", label: "{{TEN}}", width: 200, readonly: true,
                    },
                    {
                        field: "email", label: "Email", width: 200, readonly: true,
                    },
                    {
                        field: "phone_number", label: "{{SO_DIEN_THOAI}}", width: 150, readonly: true,
                    },
                    {
					field: "donvi",
					label: "{{DON_VI}}",
					template: function (rowData) {
                        if(rowData.donvi == null){
                            return "";
                        }
						return rowData.donvi.ten;
                    },
                    
				}
                ],
                dataSource: dataSource,
                primaryField: "id",
                selectionMode: false,
                refresh: true,
                pagination: {
                    page: 1,
                    pageSize: 100
                },
                events: {
                    "rowclick": function (e) {
                        self.getApp().getRouter().navigate("user/model?id=" + e.rowId);
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