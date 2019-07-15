define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	return [
		{
			"text": "Danh sách người dùng",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "user",
			"route": "user/collection",
			"$ref": "app/user/js/CollectionView",
			"visible": function () {
				return true;
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
		{
			"text": "Vai trò",
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
			"text": "Vai trò",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "role",
			"route": "role/model",
			"$ref": "app/role/js/ModelView",
			"visible": function () {
				return false;
			}
		},

		{
			"text": "Danh mục",
			"icon": "fa fa-home",
			"type": "category",

			// "visible": function(){
			// 	//console.log(this.checkHasRole("Admin"));
			// 	return this.checkHasRole("Admin") ;
			// },
			"entries": [
				{
					"text": "Quốc gia",
					"type": "view",
					"collectionName": "quocgia",
					"route": "quocgia/collection",
					"$ref": "app/DanhMuc/QuocGia/view/CollectionView",
					// "visible": function(){
					// 	//console.log(this.checkHasRole("Admin"));
					// 	return this.checkHasRole("Admin") ;
					// }
				},
				{
					"type": "view",
					"collectionName": "quocgia",
					"route": "quocgia/model(/:id)",
					"$ref": "app/DanhMuc/QuocGia/view/ModelView",
					"visible": false
				},
				{
					"text": "Tỉnh thành",
					"type": "view",
					"collectionName": "tinhthanh",
					"route": "tinhthanh/collection",
					"$ref": "app/DanhMuc/TinhThanh/view/CollectionView",
					// "visible": function(){
					// 	return this.checkHasRole("Admin") ;
					// }
				},
				{
					"type": "view",
					"collectionName": "tinhthanh",
					"route": "tinhthanh/model(/:id)",
					"$ref": "app/DanhMuc/TinhThanh/view/ModelView",
					"visible": false
				},
				{
					"text": "Quận huyện",
					"type": "view",
					"collectionName": "quanhuyen",
					"route": "quanhuyen/collection",
					"$ref": "app/DanhMuc/QuanHuyen/view/CollectionView",
					// "visible": function(){
					// 	return this.checkHasRole("Admin") ;
					// }
				},
				{
					"type": "view",
					"collectionName": "quanhuyen",
					"route": "quanhuyen/model(/:id)",
					"$ref": "app/DanhMuc/QuanHuyen/view/ModelView",
					"visible": false
				},
				{
					"text": "Xã phường",
					"type": "view",
					"collectionName": "xaphuong",
					"route": "xaphuong/collection",
					"$ref": "app/DanhMuc/XaPhuong/view/CollectionView",
					// "visible": function(){
					// 	return this.checkHasRole("Admin") ;
					// }
				},
				{
					"type": "view",
					"collectionName": "xaphuong",
					"route": "xaphuong/model(/:id)",
					"$ref": "app/DanhMuc/XaPhuong/view/ModelView",
					"visible": false
				},
			]
		},
		{
			"text": "Đơn vị",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "donvi",
			"route": "donvi/collection",
			"$ref": "app/donvi/js/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			"text": "Đơn vị",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "donvi",
			"route": "donvi/model",
			"$ref": "app/donvi/js/ModelView",
			"visible": function () {
				return false;
			}
		},
		{
			"text": "Kênh kết nối người dùng",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "kenhketnoinguoidung",
			"route": "kenhketnoinguoidung/collection",
			"$ref": "app/kenhketnoinguoidung/js/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "kenhketnoinguoidung",
			"route": "kenhketnoinguoidung/model",
			"$ref": "app/kenhketnoinguoidung/js/ModelView",
			"visible": function () {
				return false;
			}
		},
	];

});


