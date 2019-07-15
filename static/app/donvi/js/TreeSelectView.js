// define(function (require) {
//     "use strict";
//     var $ = require('jquery'),
//         _ = require('underscore'),
//         Gonrin = require('gonrin');

//         var template = require('text!app/donvi/tpl/treeselect.html'),
// 		schema = require('json!schema/DonViSchema.json');

//         var TuyenDonViEnum = require('json!app/enum/TuyenDonViEnum.json');

//     return Gonrin.DialogView.extend({
//         uiControl: { selectedItems: [] },
//         template: template,
//         modelSchema: schema,
//         urlPrefix: "/api/v1/",
//         collectionName: "donvi",
//         textField: "ten",
//         //render()
//         tools: [
//             {
//                 name: "defaultgr",
//                 type: "group",
//                 groupClass: "toolbar-group",
//                 buttons: [
//                     {
//                         name: "select",
//                         type: "button",
//                         buttonClass: "btn-success btn-sm",
//                         label: "TRANSLATE:SELECT",
//                         command: function () {
//                             var self = this;
//                             self.trigger("onSelected");
//                             self.close();
//                         }
//                     },
//                 ]
//             },
//         ],
//         dialog: function () {
//             var self = this;
//             this.initToolbar(this.tools);
//             this.renderTree();
//             //this.applyBindings();
//             self.$dialog = gonrin.dialog.dialog({ message: self.$el });
//             return this;
//         },
//         renderTree: function () {
//             var self = this;
//             var url = "/api/v1/donvitree";
//             $.ajax({
//                 url: url,
//                 dataType: "json",
//                 contentType: "application/json",
//                 success: function (data) {

//                     var tree = self.$el.find("#donvi-tree");
//                     tree.treeview({
//                         data: [data],
//                         showCheckbox: true,
//                         onNodeChecked: $.proxy(self.onItemSelected, self),
//                         onNodeUnchecked: $.proxy(self.onItemUnSelected, self),
//                         nodesField: "children",
//                         enableSelect: false,
//                         textField: "ten",
//                     });
//                     if (self.uiControl.selectedItems.length > 0) {
//                         var selectId = self.uiControl.selectedItems[0].id;
//                         var selectedNodes = tree.data('gonrin').findNodes(selectId, 'g', 'id');
//                         if ((!!selectedNodes) && (selectedNodes.length > 0)) {
//                             tree.data('gonrin').checkNode(selectedNodes[0]);
//                         }
//                     };

//                 },
//             });
//         },
//         onItemSelected: function (event, node) {
//             var self = this;
//             var tree = self.$el.find("#donvi-tree");

//             var obj = { ten: node.ten, id: node.id, tuyendonvi: node.tuyendonvi, children: [] };

//             if (node.tuyendonvi == 2) {
//                 $.each(node.children, function (idx, n) {
//                     obj.children.push(n.id)
//                 })
//             }

//             //clear prev check
//             if (self.uiControl.selectedItems.length > 0) {
//                 $.each(self.uiControl.selectedItems, function (idx, prevnode) {
//                     var selectId = prevnode.id;
//                     if (prevnode.id != node.id) {
//                         var selectedNodes = tree.data('gonrin').findNodes(selectId, 'g', 'id');
//                         if ((!!selectedNodes) && (selectedNodes.length > 0)) {
//                             tree.data('gonrin').uncheckNode(selectedNodes[0]);
//                         }
//                     }
//                 });
//             }

//             //
//             self.uiControl.selectedItems = [obj];
//         },
//         onItemUnSelected: function (event, node) {
//             var self = this;
//             self.uiControl.selectedItems = [];
//         },
//     });

// });