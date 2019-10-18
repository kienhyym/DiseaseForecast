define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/view/tpl/DanhMuc/ThonXom/collection.html'),
    	schema 				= require('json!schema/ThonXomSchema.json');
    
    return Gonrin.CollectionView.extend({
    	template : template,
    	modelSchema	: schema,
    	urlPrefix: "/api/v1/",
		collectionName: "thonxom",
		bindings:"data-thonxom-bind",
    	uiControl:{
	    	fields: [
		     	 { field: "ma", label: "Mã", width:250},
		     	 { field: "ten", label: "Tên", width:250},
		     	 {
	            	 field: "xaphuong_id", 
	            	 label: "Xã Phường",
	            	 foreign: "xaphuong",
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
//	        var currentUser = this.getApp().currentUser;
//            if (currentUser!==null && currentUser!== undefined && this.getApp().data("xaphuong_id") !== null &&  currentUser.donvi.tuyendonvi_id>=3 && currentUser.donvi.tuyendonvi_id!==10) {
//                this.uiControl.filters = { "xaphuong_id": { "$eq": currentUser.donvi.xaphuong_id } };
//            }
	    	 this.uiControl.orderBy = [{"field": "ten", "direction": "desc"}];
	    	 this.applyBindings();
	    	 return this;
    	},
    	
    });

});