""" Module for managing tasks through a simple cli interface. """
# Libraries
import sys
import json
# import ujson as json
#import json as json
import string
import random
from datetime import datetime
from os.path import abspath, dirname

sys.path.insert(0, dirname(abspath(__file__)))

from sqlalchemy.inspection import inspect

from manager import Manager
from application.server import app

from application import run_app
from application.database import db
from application.extensions import auth
import os
from application.models import *
from application.controllers.helper import generator_salt
# Instance
manager = Manager()


@manager.command
def generate_schema(path = None, exclude = None, prettyprint = True):
    """ Generate javascript schema"""
    exclude_list = None
    if path is None:
        print("Path is required")
        return
    
    if exclude is not None:
        exclude_list = exclude.split(",")
        
    for cls in [cls for cls in db.Model._decl_class_registry.values() if isinstance(cls, type) and issubclass(cls, db.Model)]:
        classname = cls.__name__
        print("classname===",classname)
        if (exclude_list is not None) and (classname in exclude_list):
            continue
        schema = {}
        for col in cls.__table__.c:
            col_type = str(col.type)
            schema_type = ''
            if(classname =="KeHoachThanhTra"):
                print("col_type===",col_type)
            if 'DECIMAL' in col_type:
                schema_type = 'number'
            if col_type in ['INTEGER','SMALLINT', 'FLOAT','BIGINT' ]:
                schema_type = 'number'
            if col_type == 'DATETIME':
                schema_type = 'datetime'
            if col_type == 'DATE':
                schema_type = 'datetime'
            if 'VARCHAR' in col_type:
                schema_type = 'string'
            if col_type in ['VARCHAR', 'UUID', 'TEXT']:
                schema_type = 'string'
            if col_type in ['JSON', 'JSONB']:
                schema_type = 'json'
            if 'BOOLEAN' in col_type:
                schema_type = 'boolean'
            
            schema[col.name] = {"type": schema_type}
            
            if col.primary_key:
                schema[col.name]["primary"] = True
            #nullabel
            if (not col.nullable) and (not col.primary_key):
                schema[col.name]["required"] = True
                
            if hasattr(col.type, "length") and (col.type.length is not None):
                schema[col.name]["length"] = col.type.length
            
            #default
            if (col.default is not None) and (col.default.arg is not None) and (not callable(col.default.arg)):
                #print(col.default, col.default.arg, callable(col.default.arg))
                schema[col.name]["default"] = col.default.arg
                
            #User confirm_password
#             if (classname == "User") and ("password" in col.name):
#                 schema["confirm_password"] = {"type": schema_type}
#                 schema["confirm_password"]["length"] = col.type.length
                
                
        
        relations = inspect(cls).relationships
        for rel in relations:
            if rel.direction.name in ['MANYTOMANY', 'ONETOMANY']:
                schema[rel.key] = {"type": "list"}
            if rel.direction.name in ['MANYTOONE']:
                schema[rel.key] = {"type": "dict"}
            
        if prettyprint:
            with open(path + '/' + classname + 'Schema.json', 'w') as outfile:
                json.dump(schema,  outfile, indent=4,)
        else:
            with open(path + '/' + classname + 'Schema.json', 'w') as outfile:
                json.dump(schema,  outfile,)



@manager.command
def add_danhsach_quocgia_tinhthanh():   
    quocgias = QuocGia(ma = "VN", ten = "Việt Nam")
    db.session.add(quocgias)
    db.session.flush() 
    db.session.commit()
    try:
        SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
        #add dantoc
        json_url_dantoc = os.path.join(SITE_ROOT, "static/app/enum", "DanTocEnum.json")
        data_dantoc = json.load(open(json_url_dantoc))
        for item_dantoc in data_dantoc:
            dantoc = DanToc(ma = item_dantoc["value"], ten = item_dantoc["text"])
            db.session.add(dantoc)
        
        db.session.commit()
        json_url_dstinhthanh = os.path.join(SITE_ROOT, "static/app/enum", "ThongTinTinhThanh.json")
        data_dstinhthanh = json.load(open(json_url_dstinhthanh))
        for item_dstinhthanh in data_dstinhthanh:
            tinhthanh_filter = db.session.query(TinhThanh).filter(TinhThanh.ma == item_dstinhthanh["matinhthanh"]).first()
            if tinhthanh_filter is None:
#                 quocgia_filter = db.session.query(QuocGia).filter(QuocGia.ma == 'VN').first()
                tinhthanh_filter = TinhThanh(ten = item_dstinhthanh["tentinhthanh"], ma = item_dstinhthanh["matinhthanh"], quocgia_id = quocgias.id)
                db.session.add(tinhthanh_filter)
        db.session.commit()
    except Exception as e:
        print("TINH THANH ERROR",e)
        
@manager.command
def add_danhsach_quanhuyen():
    try:
        SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
        json_url_dsquanhuyen = os.path.join(SITE_ROOT, "static/app/enum", "ThongTinTinhThanh.json")
        data_dsquanhuyen = json.load(open(json_url_dsquanhuyen))
        for item_dsquanhuyen in data_dsquanhuyen:
            quanhuyen_filter = db.session.query(QuanHuyen).filter(QuanHuyen.ma == item_dsquanhuyen["maquanhuyen"]).first()
            if quanhuyen_filter is None:
                tinhthanh_filter = db.session.query(TinhThanh).filter(TinhThanh.ma == item_dsquanhuyen["matinhthanh"]).first()
                quanhuyen_filter = QuanHuyen(ten = item_dsquanhuyen["tenquanhuyen"], ma = item_dsquanhuyen["maquanhuyen"], tinhthanh_id = tinhthanh_filter.id)
                db.session.add(quanhuyen_filter)
        db.session.commit()
    except Exception as e:
        print("QUAN HUYEN ERROR", e)

@manager.command
def add_danhsach_xaphuong():
    try:
        SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
        json_url_dsxaphuong = os.path.join(SITE_ROOT, "static/app/enum", "ThongTinTinhThanh.json")
        data_dsxaphuong = json.load(open(json_url_dsxaphuong))
        for item_dsxaphuong in data_dsxaphuong:
            xaphuong_filter = db.session.query(XaPhuong).filter(XaPhuong.ma == item_dsxaphuong["maxaphuong"]).first()
            if xaphuong_filter is None:
                quanhuyen_filter = db.session.query(QuanHuyen).filter(QuanHuyen.ma == item_dsxaphuong["maquanhuyen"]).first()
                xaphuong_filter = XaPhuong(ten = item_dsxaphuong["tenxaphuong"], ma = item_dsxaphuong["maxaphuong"], quanhuyen_id = quanhuyen_filter.id)
                db.session.add(xaphuong_filter)
        db.session.commit()
    except Exception as e:
        print("XA PHUONG ERROR", e)



@manager.command
def create_default_models_donvi(): 
    #add user
    user1 = User(email='admin@gmail.com', name='admin',phancapnhanbaocao="quanly",captren_stt = 1,  password=auth.encrypt_password('zxc'))
    db.session.add(user1)
    db.session.flush()

    #add don vi
    donvi1 = DonVi(ten='Cục Y Tế Dự Phòng Cảnh Báo Dịch Bệnh', ma='CYTDP',  captren_id='1')
    donvi1.user_shield.append(user1)
    db.session.add(donvi1)
    db.session.flush()

    db.session.commit()


@manager.command
def run():
    quocgiaa = db.session.query(QuocGia).first()
    if quocgiaa is None:
        add_danhsach_quocgia_tinhthanh()
        add_danhsach_quanhuyen()
        add_danhsach_xaphuong()
        create_default_models_donvi()


    run_app(host="0.0.0.0", port=20202)


if __name__ == '__main__':
    manager.main()


