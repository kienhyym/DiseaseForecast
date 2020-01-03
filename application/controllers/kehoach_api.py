import string
import random
import uuid
import base64, re
import binascii
import aiohttp
import copy
import time
from math import floor
from gatco.response import json, text, html
from application.extensions import sqlapimanager
from application.extensions import auth
from application.database import db, redisdb
from application.models.models import *
from application.common.constants import KeHoach_ThanhTra_TrangThai


from application.server import app
from gatco_restapi.helpers import to_dict
from sqlalchemy.sql.expression import except_
import time
from datetime import datetime
from math import floor
from application.client import HTTPClient
from application.controllers.helper import *
from sqlalchemy import or_, and_, desc


@app.route('/api/v1/kehoachthanhtra/confirm', methods=['POST'])
async def kehoach_review(request):
    makehoach = request.json.get("id", None)
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"End of session, please log in again!"}, status=520)

    if (makehoach is None or makehoach == ""):
        return json({"error_code":"ERROR_PARAMS","error_message":"Invalid value, please check again"}, status=520)
    
    
    
    kehoach = db.session.query(KeHoachThanhTra).filter(KeHoachThanhTra.id == makehoach).first()
    if kehoach is not None:
        if currentUser.has_role("CucTruong"):
            kehoach.trangthai = KeHoach_ThanhTra_TrangThai["approved"]
            kehoach.userid_quyetdinh = currentUser.id
            kehoach.username_quyetdinh = currentUser.name
            kehoach.ngaypheduyet_quyetdinh = floor(time.time())
        elif currentUser.has_role("CucPho"):
            kehoach.trangthai = KeHoach_ThanhTra_TrangThai["send_approved"]
            kehoach.userid_pctduyet = currentUser.id
            kehoach.username_pctduyet = currentUser.name
            kehoach.ngaypheduyet_pct = floor(time.time())
        elif currentUser.has_role("TruongPhong"):
            kehoach.trangthai = KeHoach_ThanhTra_TrangThai["send_review_pct"]
            kehoach.userid_phongduyet = currentUser.id
            kehoach.username_phongduyet = currentUser.name
            kehoach.ngaypheduyet_phong = floor(time.time())
        elif currentUser.has_role("ChuyenVien"):
            kehoach.trangthai = KeHoach_ThanhTra_TrangThai["send_review_truongphong"]
        else:
            return json({"error_code":"PERMISSION_DENY","error_message":"There is no right to perform this action"}, status=520)

        db.session.commit()
        return json(to_dict(kehoach))
    else:
        return json({"error_code":"NOT_FOUND","error_message":"Invalid value, please check again"}, status=520)
            
@app.route('/api/v1/kehoachthanhtra/cancel', methods=['POST'])
async def cancel_kehoach(request):
    makehoach = request.json.get("id", None)
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"End of session, please log in again!"}, status=520)

    if (makehoach is None or makehoach == ""):
        return json({"error_code":"ERROR_PARAMS","error_message":"Invalid value, please check again"}, status=520)
    
    
    
    kehoach = db.session.query(KeHoachThanhTra).filter(KeHoachThanhTra.id == makehoach).first()
    if kehoach is not None:
        if currentUser.has_role("CucTruong"):
            kehoach.trangthai = KeHoach_ThanhTra_TrangThai["cancel_approved"]
        elif currentUser.has_role("CucPho"):
            kehoach.trangthai = KeHoach_ThanhTra_TrangThai["cancel_reviewed_pct"]
        elif currentUser.has_role("TruongPhong"):
            kehoach.trangthai = KeHoach_ThanhTra_TrangThai["cancel_reviewed_truongphong"]
        else:
            return json({"error_code":"PERMISSION_DENY","error_message":"There is no right to perform this action"}, status=520)

        db.session.commit()
        return json(to_dict(kehoach))
    else:
        return json({"error_code":"NOT_FOUND","error_message":"Invalid value, please check again"}, status=520)
            
 
        
async def pre_post_kehoachthanhtra(request=None, data=None, Model=None, **kw):
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"End of session, please log in again!"}, status=520)

    makehoach = get_makehoach_new()
    if makehoach is None:
        return json({"error_code":"ERROR_SYSTEM","error_message":""}, status=520)
    else:
        data['id'] = makehoach.decode('utf-8')
        data["userid_nguoisoanthao"] = currentUser.id
        data["username_nguoisoanthao"] = currentUser.name
        data["ngaysoanthao"] = floor(time.time())
        
        
        

async def response_getmany_kehoachthanhtra(request=None, Model=None, result=None, **kw):
    if result is not None and "objects" in result:
        objects = to_dict(result["objects"])
        datas = []
        i =1
        page = request.args.get("page",None)
        results_per_page = request.args.get("results_per_page",None)
        currentUser = await current_user(request)
        if currentUser is None:
            return json({"error_code":"PERMISSION_DENY","error_message":"End of session, please log in again!!"}, status=520)
            
        if page is not None and results_per_page is not None and int(page) != 1:
            i = i + int(results_per_page)*int(page)
        for obj in objects:
            if obj is not None:
                obj_tmp = to_dict(obj)
                obj_tmp["stt"] = i
                i = i +1
                datas.append(obj_tmp)
        result = datas
        
async def pregetmany_kehoachthanhtra(search_params, Model, **kw):
    request = kw.get("request", None)



# sqlapimanager.create_api(DanhMucDoanhNghiep, max_results_per_page=1000000,
#     methods=['GET', 'POST', 'DELETE', 'PUT'],
#     url_prefix='/api/v1',
#     preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[], POST=[auth_func], PUT_SINGLE=[auth_func]),
#     postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[]),
#     collection_name='danhmucdoanhnghiep')


# sqlapimanager.create_api(KeHoachThanhTra, max_results_per_page=1000000,
#     methods=['GET', 'POST', 'DELETE', 'PUT'],
#     url_prefix='/api/v1',
#     preprocess=dict(GET_SINGLE=[], GET_MANY=[pregetmany_kehoachthanhtra], POST=[pre_post_kehoachthanhtra], PUT_SINGLE=[]),
#     postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[response_getmany_kehoachthanhtra]),
#     collection_name='kehoachthanhtra')



    

