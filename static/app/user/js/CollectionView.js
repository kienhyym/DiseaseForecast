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
            var self = this;
            this.applyBindings();
            this.khoitao();
            if(self.getApp().currentUser.phancapnhanbaocao != "quanly"){
                self.$el.find('.toolbar').hide();
            }
            return this;
        },
        khoitao: function () {
            var self = this;
            $.ajax({
                url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
                method: "GET",
                data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
                contentType: "application/json",
                success: function (data) {
                    var arr = [];
                    

                        data.objects.forEach(function (item, index) {
                            if (self.getApp().currentUser.donvi_id == item.id_nguoitao ) {
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
                // showSortingIndicator: true,
                orderByMode: "client",
                language: {
                    no_records_found: "Chưa có dữ liệu"
                },
                noResultsClass: "alert alert-default no-records-found",
                fields: [
                    {
                        field: "name", label: "Tên", width: 200, readonly: true,
                    },
                    {
                        field: "email", label: "Email", width: 200, readonly: true,
                    },
                    {
                        field: "phone_number", label: "Số điện thoại", width: 150, readonly: true,
                    },
                    {
					field: "donvi",
					label: "đơn vị",
					template: function (rowData) {
                        if(rowData.donvi == null){
                            return "";
                        }
						return rowData.donvi.ten;
					}
				}
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