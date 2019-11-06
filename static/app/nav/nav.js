define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	return [
		{
			"text": "Tin mới từ D-MOSS",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "datadmoss",
			"route": "datadmoss/collection",
			"$ref": "app/datadmoss/js/CollectionView",
			"visible": function () {
				return this.checkTuyendonvi([1]);

			}
		},
		{

			"type": "view",
			"collectionName": "datadmoss",
			"route": "datadmoss/model",
			"$ref": "app/datadmoss/js/ModelView",
			"visible": function () {
				return false;
			}
		},
		{
			"text": "Danh mục thông báo",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "role",
			"route": "role/collection",
			"$ref": "app/role/js/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			
			"type": "view",
			"collectionName": "role",
			"route": "role/model",
			"$ref": "app/role/js/ModelView",
			"visible": function () {
				return false;
			}
		},
		{
			"text": "Quản lý người dùng",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "user",
			"route": "user/collection",
			"$ref": "app/user/js/CollectionView",
			"visible": function () {
				return this.checkTuyendonvi([1,2,3]);
			}
		},
		{
			"text": "Danh sách người dùng",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "user",
			"route": "user/model",
			"$ref": "app/user/js/ModelView",
			"visible": function () {
				return false;
			}
		},
		

		// {
		// 	"text": "Danh mục",
		// 	"icon": "fa fa-home",
		// 	"type": "category",

		// 	// "visible": function(){
		// 	// 	//console.log(this.checkHasRole("Admin"));
		// 	// 	return this.checkHasRole("Admin") ;
		// 	// },
		// 	"entries": [
		// 		{
		// 			"text": "Quốc gia",
		// 			"type": "view",
		// 			"collectionName": "quocgia",
		// 			"route": "quocgia/collection",
		// 			"$ref": "app/DanhMuc/QuocGia/view/CollectionView",
		// 			// "visible": function(){
		// 			// 	//console.log(this.checkHasRole("Admin"));
		// 			// 	return this.checkHasRole("Admin") ;
		// 			// }
		// 		},
		// 		{
		// 			"type": "view",
		// 			"collectionName": "quocgia",
		// 			"route": "quocgia/model(/:id)",
		// 			"$ref": "app/DanhMuc/QuocGia/view/ModelView",
		// 			"visible": false
		// 		},
		// 		{
		// 			"text": "Tỉnh thành",
		// 			"type": "view",
		// 			"collectionName": "tinhthanh",
		// 			"route": "tinhthanh/collection",
		// 			"$ref": "app/DanhMuc/TinhThanh/view/CollectionView",
		// 			// "visible": function(){
		// 			// 	return this.checkHasRole("Admin") ;
		// 			// }
		// 		},
		// 		{
		// 			"type": "view",
		// 			"collectionName": "tinhthanh",
		// 			"route": "tinhthanh/model(/:id)",
		// 			"$ref": "app/DanhMuc/TinhThanh/view/ModelView",
		// 			"visible": false
		// 		},
		// 		{
		// 			"text": "Quận huyện",
		// 			"type": "view",
		// 			"collectionName": "quanhuyen",
		// 			"route": "quanhuyen/collection",
		// 			"$ref": "app/DanhMuc/QuanHuyen/view/CollectionView",
		// 			// "visible": function(){
		// 			// 	return this.checkHasRole("Admin") ;
		// 			// }
		// 		},
		// 		{
		// 			"type": "view",
		// 			"collectionName": "quanhuyen",
		// 			"route": "quanhuyen/model(/:id)",
		// 			"$ref": "app/DanhMuc/QuanHuyen/view/ModelView",
		// 			"visible": false
		// 		},
		// 		{
		// 			"text": "Xã phường",
		// 			"type": "view",
		// 			"collectionName": "xaphuong",
		// 			"route": "xaphuong/collection",
		// 			"$ref": "app/DanhMuc/XaPhuong/view/CollectionView",
		// 			// "visible": function(){
		// 			// 	return this.checkHasRole("Admin") ;
		// 			// }
		// 		},
		// 		{
		// 			"type": "view",
		// 			"collectionName": "xaphuong",
		// 			"route": "xaphuong/model(/:id)",
		// 			"$ref": "app/DanhMuc/XaPhuong/view/ModelView",
		// 			"visible": false
		// 		},
		// 	]
		// },
		{
			"text": "Quản lý đơn vị cấp dưới",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "donvi",
			"route": "donvi/collection",
			"$ref": "app/donvi/js/CollectionView",
			"visible": function () {
				return this.checkTuyendonvi([1,2,3]);

			}
		},
		{
			"type": "view",
			"collectionName": "donvi",
			"route": "donvi/model",
			"$ref": "app/donvi/js/ModelView",
			"visible": function () {
				return false;
			}
		},
	

		{
			"text": "Quản lý tin cảnh báo",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "sendwarning",
			"route": "sendwarning/collection",
			"$ref": "app/sendwarning/js/CollectionView",
			"visible": function () {
				return true;
			}
		},
		
		{
			"type": "view",
			"collectionName": "sendwarning",
			"route": "sendwarning/model",
			"$ref": "app/sendwarning/js/ModelView",
			"visible": function () {
				return false;
			}
		},
		// {
		// 	"text": "Soạn tin nhắn zalo",
		// 	"icon": "fa fa-home",
		// 	"type": "view",
		// 	"collectionName": "sendzalo",
		// 	"route": "sendzalo/collection",
		// 	"$ref": "app/sendzalo/js/CollectionView",
		// 	"visible": function () {
		// 		return true;
		// 	}
		// },
		
		// {
		// 	"type": "view",
		// 	"collectionName": "sendzalo",
		// 	"route": "sendzalo/model",
		// 	"$ref": "app/sendzalo/js/ModelView",
		// 	"visible": function () {
		// 		return false;
		// 	}
		// },

	];
});


