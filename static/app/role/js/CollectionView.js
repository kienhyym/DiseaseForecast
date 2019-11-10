define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/role/tpl/collection.html'),
		schema = require('json!schema/RoleSchema.json');

    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "role",
        uiControl:{
            fields: [

                {
                    field: "name", label: "Mã", width: 100, readonly: true,
                },
                {
                    field: "description", label: "Tên", width: 250, readonly: true,
                },
                

            ],
            onRowClick: function (event) {
                if (event.rowId) {
                    var path =  this.collectionName + '/model?id=' + event.rowId;
                    this.getApp().getRouter().navigate(path);
                }
            }
        },
        render: function () {
            var self =this;
            if(self.getApp().currentUser.captren_stt != 1){
                self.$el.find(".btn-success").hide();
            }
            this.applyBindings();   
            console.log(this);
            return this;
        },
        
    });

});