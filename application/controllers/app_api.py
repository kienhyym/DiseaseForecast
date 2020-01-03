import string
import random
import uuid
import base64, re
import binascii
import aiohttp
import copy
from gatco.response import json, text, html
from application.extensions import sqlapimanager
from application.database import db, redisdb
from application.models.models import *


from application.server import app
from gatco_restapi.helpers import to_dict
from sqlalchemy.sql.expression import except_
import time
from math import floor
from application.client import HTTPClient
from application.controllers.helper import *
from sqlalchemy import or_, and_, desc
from application.extensions import auth, jwt
import ujson



def check_token_app(token):
    uid = redisdb.get("sessions:" + user_token)
    if uid is not None:
        return uid.decode('utf8')
    return None
            

async def pre_process_post_put_appinfo(request=None, data=None, Model=None, **kw):
    if request.method == "POST" or request.method == "PUT":
        if "secret" not in data or data["secret"] is None or data["secret"] == "":
            return json({"error_code":"PARAMS_ERROR","error_message":"Please enter the password of the application!"}, status=520)
 

# sqlapimanager.create_api(AppInfo,
#     methods=['GET', 'POST', 'DELETE', 'PUT'],
#     url_prefix='/api/v1',
#     preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func,pre_process_post_put_appinfo], PUT_SINGLE=[auth_func,pre_process_post_put_appinfo]),
#     exclude_columns= ["secret"],
#     collection_name='appinfo')


@app.route('/app_api/v1/token', methods=['POST'])
async def get_token(request):
    if not check_content_json(request):
        return json({'error_code':"ERROR_PARAMS", 'error_message':'The request header is invalid'}, status=200)
    
    appkey = request.json.get("appkey", None)
    secret = request.json.get("secret", None)
    if appkey is None or secret is None:
        return json({'error_code':"ERROR_PARAMS", 'error_message':u'Username or password incorrect, please check again'}, status=520)
    appInfo = db.session.query(AppInfo).filter(AppInfo.appkey == appkey).first()
    if (appInfo is not None) and (auth.verify_password(secret, appInfo.secret)):
        expired_time = app.config.get('APP_API_EXPIRATION_DELTA', 86400)
        token = generate_user_token(appkey, expired_time)
        return json({'error_code':"OK", 'token':'token'}, status=520)
#         token = jwt.encode(payload)
#         return json({'token': token})
    else:
        return json({'error_code':"NOT_FOUND", 'error_message':u'Username or password incorrect, please check again'}, status=520)
        
