// define(function (require) {
//     "use strict";
//     var $ = require('jquery'),
//         _ = require('underscore'),
//         Gonrin = require('gonrin');

//     var template = require('text!app/sendsms/tpl/collection.html'),
//         schema = require('json!schema/SendSMSSchema.json');
//     return Gonrin.CollectionView.extend({
//         template: template,
//         modelSchema: schema,
//         urlPrefix: "/api/v1/",
//         collectionName: "sendsms",
//         uiControl: {
//             fields: [
//                 { field: "to", label: "tới" , width: 250, readonly: true},
//                 { field: "name", label:"tên chiến dịch" , width: 550, readonly: true},
            
//             ],
//             onRowClick: function (event) {
//                 if (event.rowId) {
//                     var path = this.collectionName + '/model?id=' + event.rowId;
//                     this.getApp().getRouter().navigate(path);
//                 }
//             },
        
//         },
//         render: function () {
        
//             this.applyBindings();
//             return this;
//         },

//     });
// });