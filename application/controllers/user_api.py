import string
import random
import uuid
import base64, re
import binascii
import aiohttp
import copy
import json as json_load
import requests
from gatco.response import json, text, html
from application.extensions import sqlapimanager
from application.extensions import auth
from application.database import db, redisdb
from application.models.models import *

from datetime import time
from application.server import app
from gatco_restapi.helpers import to_dict
from sqlalchemy.sql.expression import except_
import time
from math import floor, ceil
from application.client import HTTPClient
from application.controllers.helper import *
from sqlalchemy import or_, and_, desc

from application.controllers.helper import current_user

def user_to_dict(user):
    obj = to_dict(user)
    if "password" in obj:
        del(obj["password"])
    if "salt" in obj:
        del(obj["salt"])
    return obj
@app.route('api/v1/current_user')
async def get_current_user(request):
    error_msg = None
    currentUser = await current_user(request)
    print("===============", currentUser)
    if currentUser is not None:
        user_info = to_dict(currentUser)
        return json(user_info)
    else:
        error_msg = "Account not in the system"
    return json({
        "error_code": "USER_NOT_FOUND",
        "error_message":error_msg
    }, status = 520)
    
@app.route('api/v1/logout')
async def logout(request):
    try:
        auth.logout_user(request)
    except:
        pass
    return json({})


@app.route('/api/v1/login', methods=['POST'])
async def login(request):
    data = request.json
    print("==================data", data)
    username = data['username']
    password = data['password']
    print("==================USER NAME", username)
    print("==================PASSWORD", password)
    user = db.session.query(User).filter(or_(User.email == username, User.phone_number == username)).first()


    print("==================", user)
    if (user is not None) and auth.verify_password(password, user.password):
        
        auth.login_user(request, user)
        result = user_to_dict(user)
        return json(result)
        
    return json({"error_code":"LOGIN_FAILED","error_message":"Username or password incorrect"}, status=520)

@app.route('/api/v1/changepassword', methods=['POST'])
async def changepassword(request):
    data = request.json
    print("==================data", data)
    password_old = data['password_old']
    password_new = data['password_new']
    current_uid = data['user_id']

    print("==================PASSWORD_OLD", password_old)
    print("==================PASSWORD_NEW", password_new)
    print("===================current_uid============", current_uid)
    user = db.session.query(User).filter(or_(User.id == current_uid)).first()

    if current_uid and password_new is not None and auth.verify_password(password_old, user.password):
        print("==============USER INFO", auth.verify_password(password_old, user.password))

        user_info = db.session.query(User).filter(User.id == current_uid).first()
        print("==============USER INFO", user_info)
        if user_info is not None:
            user_info.password = auth.encrypt_password(password_new)

            db.session.commit()
            return json({})

@app.route('/api/v1/yeucauhuy', methods=['POST'])
def yeucauhuy(request):
    data = request.json
    print("===================yeu cau huye ++++++++++++", data)
    user = db.session.query(User).filter(or_(User.email==data["email"], User.phone_number==data["phone_number"])).first()
    if user is not None:
        print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",to_dict(user)["id"])
        user_info = db.session.query(User).filter(User.id == to_dict(user)["id"]).first()
        user_info.kiemduyet = 'yeucauhuy'
        db.session.commit()
        if to_dict(user)["config"] is not None:
            if to_dict(user)["config"]["lang"] == 'VN':
                email_info = {
                "from": {
                    "id": "canhbaosotxuathuyet@gmail.com",
                    "password": "kocopass"
                },
                "to": user_info.email,
                "message": "Yêu cầu đang chờ xét duyệt",
                "subject": "Yêu cầu hủy đăng ký nhận thông báo"
            } 
            if to_dict(user_info)["config"]["lang"] == 'EN':
                email_info = {
                "from": {
                    "id": "canhbaosotxuathuyet@gmail.com",
                    "password": "kocopass"
                },
                "to": user_info.email,
                "message": "Your request is pending review",
                "subject": "Request to unsubscribe from notifications"
                }     
        else:
            email_info = {
            "from": {
                "id": "canhbaosotxuathuyet@gmail.com",
                "password": "kocopass"
            },
            "to": user_info.email,
            "message": "Your request is pending review",
            "subject": "Request to unsubscribe from notifications"
            }
        url = "https://upstart.vn/services/api/email/send"
        re = requests.post(url=url, data=json_load.dumps(email_info))

        return json({"error_code":"0","error_message":"successful"})
    else :
        return json({"error_message": "Email or phone number does not exist in the system"}, status = 520)


@app.route('/api/v1/register', methods=["POST"])
def register(request):
    data = request.json
    print("===================", data)
    user = db.session.query(User).filter(or_(User.email==data["email"], User.phone_number==data["phone_number"])).first()
    if user is not None:
        return json({
            "error_code": "USER_EXISTED",
            "error_message": "Email or phone is already used in another account"
            }, status = 520)
    else:
        new_user = User()
        new_user.name = data["name"]
        new_user.email = data["email"]
        new_user.phone_number = data["phone_number"]
        new_user.phone_zalo = data["phone_zalo"]
        new_user.donvi_id = data["donvi_id"]
        new_user.captren_stt = data["captren_stt"]
        new_user.tinhthanh_id = data["tinhthanh_id"]
        new_user.quanhuyen_id = data["quanhuyen_id"]
        new_user.xaphuong_id = data["xaphuong_id"]
        new_user.donvicaptren_id = data["donvicaptren_id"]
        new_user.id_nguoitao = data["id_nguoitao"]
        new_user.thongbaoemail = data["thongbaoemail"]
        new_user.thongbaozalo = data["thongbaozalo"]
        new_user.thongbaosms = data["thongbaosms"]


        # new_user.user_image = data["user_image"]
        new_user.password = auth.encrypt_password(data["password"])
        # new_user.password = data["password"]
        db.session.add(new_user)
        db.session.commit()
        result = user_to_dict(new_user)
        return json(result)


@app.route('api/v1/gettoken', methods=["POST"])
def gettoken(request):
    data = request.json
    if data["appkey"] == "dmoss" and data["secret"] == "123456abc":
        return json({"error_code":"0","error_message":"successful","token":"FDSDFDV26DBFsdfgsdg634vfsdfsdfdgt35gw"})
    return json({})

@app.route('api/v1/dmoss/pushdata', methods=["POST"])
def gettoken(request):
    dataheader = request.headers
    if dataheader["x-auth-token"] == "FDSDFDV26DBFsdfgsdg634vfsdfsdfdgt35gw":
        data = request.json
        new_datadmoss = DataDMoss()
        new_datadmoss.ngaygui = time.time()
        new_datadmoss.nguoigui = data["sender_name"]
        new_datadmoss.tieude = data["title"]
        new_datadmoss.category = data["notification_name"]
        new_datadmoss.data = data
        db.session.add(new_datadmoss)
        db.session.commit()
    
        return json({"error_code":"0","error_message":"successful"})
    return json({})




@app.route('api/v1/tokenuser', methods=["POST"])
def tokenuser(request):
    token = random.randint(10000, 99999)
    data = request.json
    email = data['email']
    user_info = db.session.query(User).filter(User.email == email).first()
    if user_info is not None:
        if to_dict(user_info)["config"] is not None:
            if to_dict(user_info)["config"]["lang"] == 'VN':
                email_info = {
                "from": {
                    "id": "canhbaosotxuathuyet@gmail.com",
                    "password": "kocopass"
                },
                "to": email,
                "message": "Mã token của bạn là" + str(token),
                "subject": "Yêu cầu đổi mật khẩu"
            } 
            if to_dict(user_info)["config"]["lang"] == 'EN':
                email_info = {
                "from": {
                    "id": "canhbaosotxuathuyet@gmail.com",
                    "password": "kocopass"
                },
                "to": email,
                "message": "Your token is:" + str(token),
                "subject": "Password change request"
                }     
        else:
            email_info = {
            "from": {
                "id": "canhbaosotxuathuyet@gmail.com",
                "password": "kocopass"
            },
            "to": email,
            "message": "Your token is:" + str(token),
            "subject": "Password change request"
            }
        url = "https://upstart.vn/services/api/email/send"
        re = requests.post(url=url, data=json_load.dumps(email_info))


    return json({
        "ok": token,
        'id':to_dict(user_info)['id']
    })

@app.route('/api/v1/newpassword', methods=['POST'])
async def changepassword(request):
    data = request.json
    id = data['id']
    password_new = data['password']
    user_info = db.session.query(User).filter(User.id == id).first()
    user_info.password = auth.encrypt_password(password_new)
    db.session.commit()
    return json({})



async def prepost_user(request=None, data=None, Model=None, **kw):
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"End of session, please log in again!"}, status=520)

    if "name" not in data or data['name'] is None or "password" not in data or data['password'] is None:
        return json({"error_code":"PARAMS_ERROR","error_message":"Invalid value, please check again"}, status=520)
    if ('phone_number' in data) and ('email' in data) :
        user = db.session.query(User).filter((User.phone_number == data['phone_number']) | (User.email == data['email'])).first()
        if user is not None:
            if user.phone_number == data['phone_number']:
                return json({"error_code":"USER_EXISTED","error_message":'Phone number already in use, please select again'},status=520)
            else:
                return json({"error_code":"USER_EXISTED","error_message":'Email is already used in another account'},status=520)

    
    salt = generator_salt()
    data['salt'] = salt
    password = data['password']
    data['password'] = auth.encrypt_password(password, salt)
    data['active']= True
    
async def preput_user(request=None, data=None, Model=None, **kw):
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"End of session, please log in again!"}, status=520)
    
    if "name" not in data or data['name'] is None or "id" not in data or data['id'] is None:
        return json({"error_code":"PARAMS_ERROR","error_message":"Invalid value, please check again"}, status=520)
    if ('phone_number' in data) and ('email' in data) :
        check_user = db.session.query(User).filter((User.phone_number == data['phone_number']) | (User.email == data['email'])).filter(User.id != data['id']).first()
        if check_user is not None:
            if check_user.phone_number == data['phone_number']:
                return json({"error_code":"USER_EXISTED","error_message":'Phone number already in use, please select again'},status=520)
            else:
                return json({"error_code":"USER_EXISTED","error_message":'Email is already used in another account'},status=520)
    
    user = db.session.query(User).filter(User.id == data['id']).first()
    if user is None:
        return json({"error_code":"NOT_FOUND","error_message":"User account not found"}, status=520)

    if currentUser.has_role("Giám Đốc") or str(currentUser.id) == data['id']:
        password = data['password']
        data['password'] = auth.encrypt_password(password, user.salt)
    else:
        return json({"error_code":"PERMISSION_DENY","error_message":"There is no right to perform this action"}, status=520)

async def predelete_user(request=None, data=None, Model=None, **kw):
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"End of session, please log in again!"}, status=520)
    if currentUser.has_role("Giám Đốc") == False:
        return json({"error_code":"PERMISSION_DENY","error_message":"There is no right to perform this action"}, status=520)
        
@app.route("/api/v1/user/set-config", methods=["POST", "PUT", "OPTIONS"])
async def set_user(request):
    config_data = request.json
    id = request.args.get("id")
    user = await motordb.db['user'].find_one({"id": str(id)})

    if user is None:
        return json(None)

    user['config'] = config_data

    res = await motordb.db['user'].update_one({'_id': ObjectId(user['_id'])}, {'$set': user})

    return json(res)

sqlapimanager.create_api(User, max_results_per_page=1000000,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    # preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func], DELETE=[]),
    # postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[]),
    # exclude_columns= ["password","salt","active"],
    collection_name='user')

sqlapimanager.create_api(Role, max_results_per_page=1000000,
    methods=['GET'],
    url_prefix='/api/v1',
    # preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    collection_name='role')

sqlapimanager.create_api(DonVi, max_results_per_page=1000000,
    methods=['GET'],
    url_prefix='/api/v1',
    # preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    collection_name='donvi')

sqlapimanager.create_api(SendWarning, max_results_per_page=1000000,
    methods=['GET'],
    url_prefix='/api/v1',
    # preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    collection_name='sendwarning')

sqlapimanager.create_api(DataDMoss, max_results_per_page=1000000,
    methods=['GET'],
    url_prefix='/api/v1',
    # preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    collection_name='datadmoss')
    

sqlapimanager.create_api(Token, max_results_per_page=1000000,
    methods=['GET'],
    url_prefix='/api/v1',
    # preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    collection_name='token')

