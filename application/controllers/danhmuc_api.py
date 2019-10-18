
from application.extensions import sqlapimanager
from gatco_restapi.helpers import to_dict
from application.server import app
from sqlalchemy import or_, and_
from gatco.response import json
from datetime import datetime
from application.controllers.helper import *
from application.client import HTTPClient




from application.models.models import *
# 
async def prepost_danhmuc(request=None, data=None, Model=None, **kw):
    if "ma" in data and data['ma'] is not None and data['ma'] != "":
        check_existed = db.session.query(Model).filter(Model.ma == data['ma']).count()
        if check_existed >0:
            return json({"error_code":"PARAMS_ERROR", "error_message":"Mã danh mục đã bị trùng, vui lòng chọn mã khác"}, status=520)

async def preput_danhmuc(request=None, data=None, Model=None, **kw):
    check_danhmuc = db.session.query(Model).filter(Model.ma == data["ma"]).filter(Model.id != data['id']).first()
    if (check_danhmuc is not None):
        return json({"error_code":"PARAMS_ERROR", "error_message":"Mã danh mục đã bị trùng, vui lòng chọn mã khác"}, status=520)
            

async def prepost_put_danhmuc(request=None, data=None, Model=None, **kw):
    if "stt" in data:
        del data['stt']
    objects_danhmuc = [ 'xaphuong', 'quocgia', 'tinhthanh', 'quanhuyen', 'nganh']
    for obj in objects_danhmuc:
        if obj in data and "stt" in data[obj]:
            del data[obj]['stt']


async def postprocess_add_stt(request=None, Model=None, result=None, **kw):
    if result is not None and "objects" in result:
        objects = to_dict(result["objects"])
        datas = []
        i =1
        page = request.args.get("page",None)
        results_per_page = request.args.get("results_per_page",None)
        if page is not None and results_per_page is not None and int(page) != 1:
            i = i + int(results_per_page)*int(page)
        for obj in objects:
            if obj is not None:
                obj_tmp = to_dict(obj)
                obj_tmp["stt"] = i
                i = i +1
                datas.append(obj_tmp)
        result = datas
     
 
 
 
sqlapimanager.create_api(QuocGia, max_results_per_page=1000000,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[], POST=[auth_func, prepost_danhmuc], PUT_SINGLE=[auth_func, preput_danhmuc]),
    postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[postprocess_add_stt]),
    collection_name='quocgia')
 
 
 
sqlapimanager.create_api(TinhThanh, max_results_per_page=1000000,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[], POST=[auth_func, prepost_danhmuc, prepost_put_danhmuc], PUT_SINGLE=[auth_func, prepost_danhmuc, prepost_put_danhmuc]),
    postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[postprocess_add_stt]),
    collection_name='tinhthanh')
 
 
 
sqlapimanager.create_api(QuanHuyen, max_results_per_page=1000000,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[], POST=[auth_func, prepost_danhmuc, prepost_put_danhmuc], PUT_SINGLE=[auth_func, prepost_danhmuc, prepost_put_danhmuc]),
    postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[postprocess_add_stt]),
    collection_name='quanhuyen')
 
 
sqlapimanager.create_api(XaPhuong, max_results_per_page=1000000,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[], POST=[auth_func, prepost_danhmuc, prepost_put_danhmuc], PUT_SINGLE=[auth_func, prepost_danhmuc, prepost_put_danhmuc]),
    postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[postprocess_add_stt]),
    collection_name='xaphuong')
 


