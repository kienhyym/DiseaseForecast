define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var itemTemplate = require('text!../tpl/userconnectionchannel.html'),
        itemSchema = require('json!schema/UserConnectionChannelSchema.json');

    

    return Gonrin.ItemView.extend({
        bindings: "userconnection-bind",
        template: itemTemplate,
        tagName: 'tr',
        modelSchema: itemSchema,
        urlPrefix: "/api/v1/",
        collectionName: "userconnectionchannel",
        foreignRemoteField: "id",
        foreignField: "user_id",
      
        uiControl: {
            fields: [
                {
					field: "channelname",
					uicontrol: "combobox",
					dataSource: [
						{ value: "phone_number", text: "Phone" },
						{ value: "email", text: "Email" },
						{ value: "zalo_id", text: "zalo ID" },
						{ value: "somevabe_id", text: "Sổ mẹ và bé ID" },
					],
					textField: "text",
					valueField: "text"
				},
            ]
        },

        render: function () {
            var self = this;
            this.applyBindings();
            
            // self.registerEvent();
        },

        // registerEvent: function () {
            

        //     self.$el.find("#itemRemove").unbind("click").bind("click", function () {
        //         self.remove(true);
        //     });
        // },

    });

});