define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/donvi/tpl/collectiontree.html'),
        schema = require('json!schema/DonViSchema.json');

    // var LienHeModelView = require("app/view/HeThong/DonVi/LienHeModelView");

    var templatemodel = require('text!app/donvi/tpl/model.html');

    // var TuyenDonViEnum = require('json!app/enum/TuyenDonViEnum.json');
    var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');
    var QuanHuyenSelectView = require('app/DanhMuc/QuanHuyen/view/SelectView');
    var XaPhuongSelectView = require('app/DanhMuc/XaPhuong/view/SelectView');
    var DonViSelectView = require('app/donvi/js/TreeSelectView');


    var DonViModelView = Gonrin.ModelView.extend({
        template: templatemodel,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "donvi",
        tools: [
            {
                name: "defaultgr",
                type: "group",
                groupClass: "toolbar-group",
                buttons: [
                    {
                        name: "save",
                        type: "button",
                        buttonClass: "btn-success btn-sm",
                        label: "Lưu đơn vị",
                        command: function () {
                            var self = this;

                            self.model.save(null, {
                                success: function (model, respose, options) {

                                    self.getApp().notify("Save successfully");
                                },
                                error: function (model, xhr, options) {
                                    //self.alertMessage("Something went wrong while processing the model", false);
                                    self.getApp().notify($.parseJSON(xhr.responseText).message);

                                }
                            });
                        }
                    },
                    {
                        name: "delete",
                        type: "button",
                        buttonClass: "btn-danger btn-sm",
                        label: "Xoá đơn vị",
                        command: function () {
                            var self = this;

                            //alert box


                            self.model.destroy({
                                success: function (model, response) {

                                    var tree = _.result(self.viewData, 'treeView');
                                    if (tree) {
                                        tree.refresh();
                                    }

                                    self.getApp().getRouter().refresh();
                                },
                                error: function (model, xhr, options) {
                                    self.getApp().notify($.parseJSON(xhr.responseText).message);

                                }
                            });
                        }
                    },
                ]
            },
        ],
        uiControl: [
            {
                field: "id", label: "ID", width: 250, readonly: true,
            },
            { field: "ten", label: "Ten", width: 250 },
            { field: "ma", label: "ma", width: 250 },
            // {
            //     field: "tuyendonvi",
            //     uicontrol: "combobox",
            //     textField: "text",
            //     valueField: "value",
            //     dataSource: TuyenDonViEnum,
            // },
            {
                field: "parent",
                uicontrol: "ref",
                textField: "ten",
                //valueField: "value",
                foreignRemoteField: "id",
                foreignField: "parent_id",
                dataSource: DonViSelectView,
            },
            {
                field: "tinhthanh",
                uicontrol: "ref",
                textField: "ten",
                //valueField: "value",
                foreignRemoteField: "id",
                foreignField: "tinhthanh_id",
                dataSource: TinhThanhSelectView,
            },
            {
                field: "loaidonvi",
                uicontrol: "combobox",
                textField: "text",
                valueField: "value",
                dataSource: [
                    {
                        value: 10, text: "TT KDYT Quốc tế"
                    },
                    {
                        value: 20, text: "TT YTDP tỉnh, thành"
                    }
                ],
            },

        ],
        render: function () {
            var self = this;
            var id = _.result(this.viewData, 'id');
            if (id) {
                this.model.set('id', id);
                this.model.fetch({
                    success: function (data) {
                        self.applyBindings();
                        var $tuyen = self.getFieldElement("tuyendonvi");

                        //if(self.model.get("tuyendonvi") < 3){
                        //	  self.$el.find(".loaidonvi").hide();
                        //}
                        var tuyen = $tuyen.data('gonrin').getValue();
                        if (tuyen < 3) {
                            self.$el.find(".loaidonvi").hide();
                        } else {
                            self.$el.find(".loaidonvi").show();
                        }
                        if ($tuyen) {
                            $tuyen.on('change.gonrin', function (e) {
                                var tuyen = $tuyen.data('gonrin').getValue();
                                if (tuyen < 3) {
                                    self.$el.find(".loaidonvi").hide();
                                } else {
                                    self.$el.find(".loaidonvi").show();
                                }
                            });
                        }
                    },
                    error: function () {
                        self.getApp().notify("Lấy chi tiết đơn vị bị lỗi");
                    },
                });
            }

        },
    })

    return Gonrin.CollectionView.extend({
        template: template,
        //modelSchema	: schema,
        tools: [
            {
                name: "defaultgr",
                type: "group",
                groupClass: "toolbar-group",
                buttons: [
                    {
                        name: "create",
                        type: "button",
                        buttonClass: "btn-success btn-sm",
                        label: "TRANSLATE:CREATE",
                        command: function () {
                            var self = this;
                            var path = self.collectionName + '/model';
                            self.getApp().getRouter().navigate(path);
                        },
                    },

                ]
            }
        ],
        urlPrefix: "/api/v1/",
        collectionName: "donvi",

        render: function () {
            var self = this;
            var url = "/api/v1/donvitree";
            $.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                success: function (data) {
                    data.state = { selected: true };
                    var tree = self.$el.find("#donvi-tree");
                    tree.treeview({
                        data: [data],
                        onNodeSelected: $.proxy(self.onItemClick, self),
                        nodesField: "children",
                        textField: "ten",
                    });

                    //var selectedNodes = tree.treeview('getSelected');
                    var selectedNodes = tree.data('gonrin').getSelected();
                    //console.log(selectedNodes);
                    if (selectedNodes && (selectedNodes.length > 0)) {
                        var node = selectedNodes[0];
                        var view = new DonViModelView({
                            el: self.$el.find("#donvi-chitiet"),
                            viewData: { id: node.id, treeView: self }
                        }).render();
                    };
                },
            });
            return this;
        },
        refresh: function () {
            this.$el.find("#donvi-chitiet").empty();
            this.$el.find("#donvi-tree").empty();
            this.render();
        },
        onItemClick: function (event, node) {
            var self = this;
            var view = new DonViModelView({
                el: self.$el.find("#donvi-chitiet"),
                viewData: { id: node.id }
            }).render();
        },
    });

});