// define(function (require) {
//     "use strict";
//     var $ = require('jquery'),
//         _ = require('underscore'),
//         Gonrin = require('gonrin');
//     var template = require('text!app/datadmoss/tpl/noidung.html'),
//         schema = require('json!app/datadmoss/schema/schema.json');

//     return Gonrin.ItemView.extend({
//         template: template,
//         modelSchema: schema,
//         urlPrefix: "/api/v1/",
//         bindings: "data-task-bind",

//         uiControl: {
//             fields: [

//             ]
//         },
//         render: function () {
//             var self = this;

//             if (self.uiControl.fields.field == "nguoiduocphancong") {
//                 self.uiControl.fields.dataSource = self.viewData.danhsachthanhvien;
//             }


//             if (self.model.get("id") == null) {
//                 self.model.set("id", gonrin.uuid());
//             }
//             self.applyBindings();

//             self.trigger("change", {
//                 "oldData": self.model.previousAttributes(),
//                 "data": self.model.toJSON()
//             });

//         },


//     });
// });