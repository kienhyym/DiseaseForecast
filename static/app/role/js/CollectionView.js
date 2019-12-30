define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/role/tpl/collection.html'),
		schema = require('json!schema/RoleSchema.json');

    return Gonrin.CollectionView.extend({
        // template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "role",
        uiControl:{
            fields: [

                {
                    field: "name", label: "{{MA_THONG_BAO}}", width: 100, readonly: true,
                },
                {
                    field: "description", label: "{{TEN_THONG_BAO}}", width: 250, readonly: true,
                },
                

            ],
            onRowClick: function (event) {
                if (event.rowId) {
                    var path =  this.collectionName + '/model?id=' + event.rowId;
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
            var self =this;
            var translatedTemplate = gonrin.template(template)(LANG);
            self.$el.html(translatedTemplate);
            if(self.getApp().currentUser.captren_stt != 1){
                self.$el.find(".btn-success").hide();
            }

            this.applyBindings();   
            console.log(this);
            return this;
        },
        
    });

});