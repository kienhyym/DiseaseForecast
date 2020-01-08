define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/DanhMuc/TinhThanh/tpl/collection.html'),
    	schema 				= require('json!schema/TinhThanhSchema.json');
    
    return Gonrin.CollectionView.extend({
    	template : template,
    	modelSchema	: schema,
    	urlPrefix: "/api/v1/",
		collectionName: "tinhthanh",
		bindings:"data-tinhthanh-bind",
    	uiControl:{
    		fields: [
		     	 { field: "ma", label: "Mã", width:250},
		     	 { field: "ten", label: "Tên", width:250},
		     	 {
	            	 field: "quocgia_id", 
	            	 label: "Quốc gia",
	            	 foreign: "quocgia",
	            	 foreignValueField: "id",
					 foreignTextField: "ten",
					 width:250
	           	 },
	           	{
		        	 field: "quocgia", 
		        	 visible: false
		         },
		     ],
		     pagination: {
	            	page: 1,
	            	pageSize: 100
	            },
		     onRowClick: function(event){
		    		if(event.rowId){
		        		var path = this.collectionName + '/model?id='+ event.rowId;
		        		this.getApp().getRouter().navigate(path);
		        	}
		    	}
    	},
	    render:function(){
	    	var self = this;
			 self.uiControl.orderBy = [{"field": "ten", "direction": "desc"}];
			 
	    	 this.applyBindings();
	    	 return this;
    	},
    	
    });

});