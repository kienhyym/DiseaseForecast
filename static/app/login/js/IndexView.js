define(function(require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin'),
        tpl = require('text!app/login/tpl/index.html');
    var template = gonrin.template(tpl)({});
    return Gonrin.View.extend({
        render: function() {
            var self = this;
            self.$el.html(template);
            // self.getApp().currentUser = null;
            // location.reload();

            // $("body").attr({
            //     'style': 'background-color: #e9ecf3 !important;'
            // });
            return this;
        },
    
    });
});