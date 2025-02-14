define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	return [
		{
			"collectionName": "datadmoss",
			"route": "datadmoss/collection",
			"$ref": "app/datadmoss/js/CollectionView",
		},
		{
			"collectionName": "datadmoss",
			"route": "datadmoss/model(/:id)",
			"$ref": "app/datadmoss/js/ModelView",
		},
		{
			"collectionName": "user",
			"route": "user/collection",
			"$ref": "app/user/js/CollectionView",
		},
		{
			"collectionName": "user",
			"route": "user/model(/:id)",
			"$ref": "app/user/js/ModelView",
		},

		{
			"collectionName": "role",
			"route": "role/collection",
			"$ref": "app/role/js/CollectionView",
		},
		{
			"collectionName": "role",
			"route": "role/model(/:id)",
			"$ref": "app/role/js/ModelView",
		},
		{
			"collectionName": "role",
			"route": "role/model(/:id)",
			"$ref": "app/role/js/ModelView",
		},


		{
			"collectionName": "quocgia",
			"route": "quocgia/collection",
			"$ref": "app/DanhMuc/QuocGia/view/CollectionView",
		},
		{
			"collectionName": "quocgia",
			"route": "quocgia/model(/:id)",
			"$ref": "app/DanhMuc/QuocGia/view/ModelView",
		},

		{
			"collectionName": "tinhthanh",
			"route": "tinhthanh/collection",
			"$ref": "app/DanhMuc/TinhThanh/view/CollectionView",
		},
		{
			"collectionName": "tinhthanh",
			"route": "tinhthanh/model(/:id)",
			"$ref": "app/DanhMuc/TinhThanh/view/ModelView",
		},

		{
			"collectionName": "quanhuyen",
			"route": "quanhuyen/collection",
			"$ref": "app/DanhMuc/QuanHuyen/view/CollectionView",
		},
		{
			"collectionName": "quanhuyen",
			"route": "quanhuyen/model(/:id)",
			"$ref": "app/DanhMuc/QuanHuyen/view/ModelView",
		},

		{
			"collectionName": "xaphuong",
			"route": "xaphuong/collection",
			"$ref": "app/DanhMuc/XaPhuong/view/CollectionView",
		},
		{
			"collectionName": "xaphuong",
			"route": "xaphuong/model(/:id)",
			"$ref": "app/DanhMuc/XaPhuong/view/ModelView",
		},

		{
			"collectionName": "donvi",
			"route": "donvi/collection",
			"$ref": "app/donvi/js/CollectionView",
		},
		{
			"collectionName": "donvi",
			"route": "donvi/model(/:id)",
			"$ref": "app/donvi/js/ModelView",
		},

		{
			"collectionName": "sendwarning",
			"route": "sendwarning/collection",
			"$ref": "app/sendwarning/js/CollectionView",
		},
		{
			"collectionName": "sendwarning",
			"route": "sendwarning/model(/:id)",
			"$ref": "app/sendwarning/js/ModelView",
		},
		// {
		// 	"collectionName": "sendzalo",
		// 	"route": "sendzalo/collection",
		// 	"$ref": "app/sendzalo/js/CollectionView",
		// },
		// {
		// 	"collectionName": "sendzalo",
		// 	"route": "sendzalo/model(/:id)",
		// 	"$ref": "app/sendzalo/js/ModelView",
		// },
	];

});


