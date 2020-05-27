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
            console.log('yyyy')

            


            self.uiControl.orderBy = [{"field": "ngaygui", "direction": "desc"}];

            var translatedTemplate = gonrin.template(template)(LANG);
            self.$el.html(translatedTemplate);

            this.applyBindings();
            self.$el.find("#chonfile").on("change", function () {
                console.log('xxxx')
                var http = new XMLHttpRequest();
                var fd = new FormData();
                fd.append('file', this.files[0]);
                http.open('POST', '/api/v1/link_file_upload_excel');
                http.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        var percent = evt.loaded / evt.total;
                        percent = parseInt(percent * 100);
                    }
                }, false);
                http.addEventListener('error', function () {
                }, false);

                http.onreadystatechange = function () {
                    if (http.status === 200) {
                        if (http.readyState === 4) {
                            var data_file = JSON.parse(http.responseText), link, p, t;
                            self.getApp().notify("Tải lên thành công");
                            self.getApp().getRouter().refresh();
                        }
                    } else {
                        self.getApp().notify({ message: "Không thể tải tệp tin lên máy chủ, Có thể nội dung file sai" }, { type: "danger", delay: 1000 });
                        self.getApp().getRouter().refresh();
                    }
                };
                http.send(fd);
            });
            return this;
        },
        
        
    });
});