define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/sendwarning/tpl/collection.html'),
        schema = require('json!schema/SendWarningSchema.json');
    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "sendwarning",
        uiControl: {
            fields: [
                { field: "cc", label: "Chủ đề", width: 350, readonly: true },
                {
                    field: "ngayguizalo", label: "Ngày gửi qua zalo", width: 150, readonly: true,
                    template: function (rowData) {
                        if (!!rowData && rowData.ngayguizalo) {
                            var utcTolocal = function (times, format) {
                                return moment(times * 1000).local().format(format);
                            }
                            return utcTolocal(rowData.ngayguizalo, "DD/MM/YYYY");
                        }
                        return "Chưa gửi";
                    },
                },
                {
                    field: "ngayguigmail", label: "Ngày gửi qua gmail", width: 150, readonly: true,
                    template: function (rowData) {
                        if (!!rowData && rowData.ngayguigmail) {
                            var utcTolocal = function (times, format) {
                                return moment(times * 1000).local().format(format);
                            }
                            return utcTolocal(rowData.ngayguigmail, "DD/MM/YYYY");
                        }
                        return "Chưa gửi";
                    },
                },
                {
                    field: "ngayguiphone", label: "Ngày gửi qua sms", width: 150, readonly: true,
                    template: function (rowData) {
                        if (!!rowData && rowData.ngayguiphone) {
                            var utcTolocal = function (times, format) {
                                return moment(times * 1000).local().format(format);
                            }
                            return utcTolocal(rowData.ngayguiphone, "DD/MM/YYYY");
                        }
                        return "Chưa gửi";
                    },
                },


            ],
            onRowClick: function (event) {
                if (event.rowId) {
                    var path = this.collectionName + '/model?id=' + event.rowId;
                    this.getApp().getRouter().navigate(path);
                }
            },                        // console.log(rowData)


        },
        render: function () {
            this.applyBindings();
            return this;
        },

    });
});