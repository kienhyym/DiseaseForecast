define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/DanhMuc/XaPhuong/tpl/collection.html'),
    	schema 				= require('json!schema/XaPhuongSchema.json');
    
    return Gonrin.CollectionView.extend({
    	template : template,
    	modelSchema	: schema,
    	urlPrefix: "/api/v1/",
		collectionName: "xaphuong",
		bindings:"data-xaphuong-bind",
    	uiControl:{
	    	fields: [
		     	 { field: "ma", label: "Mã", width:250},
		     	 { field: "ten", label: "Tên", width:250 },
		     	 {
	            	 field: "quanhuyen_id", 
	            	 label: "Quận Huyện",
	            	 foreign: "quanhuyen",
	            	 foreignValueField: "id",
					 foreignTextField: "ten",
					 width:250
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

//	    	 var currentUser = this.getApp().currentUser;
//	    	 if (currentUser!==null && currentUser!== undefined && this.getApp().data("quanhuyen_id") !== null &&  currentUser.donvi.tuyendonvi_id >=3 && currentUser.donvi.tuyendonvi_id!==10) {
//                this.uiControl.filters = { "quanhuyen_id": { "$eq": this.getApp().data("quanhuyen_id") } };
//             }
			 self.uiControl.orderBy = [{"field": "ten", "direction": "desc"}];
	    	 this.applyBindings();
	    	 return this;
    	}
    	
    });

});