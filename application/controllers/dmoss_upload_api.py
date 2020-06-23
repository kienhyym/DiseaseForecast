import os, sys
from application.extensions import sqlapimanager
from application.server import app
from application.database import db, redisdb
from gatco.response import json, text, html
import json as json_load
import base64, re
import requests

import datetime
from datetime import date
import random, string
import aiofiles
import pandas
import xlrd


from application.models.models import DataDMoss,Token
# @app.route('api/v1/connect_dengue_notification_module', methods=["POST"])
# def connect_dengue_notification_module(request):
#     data = request.headers
#     if data["appkey"] == "dmoss" and data["secret"] == "123456":
#         token = random.randint(10000, 99999)
#         email_info = {
#         "from": {
#             "id": "canhbaosotxuathuyet@gmail.com",
#             "password": "kocopass"
#         },
#         "to": "hydinhkien@gmail.com",
#         "message": "Your code is dmoss_" + str(token),
#         "subject": "Request a code"
#         }     
#         url = "https://upstart.vn/services/api/email/send"
#         re = requests.post(url=url, data=json_load.dumps(email_info))
#         new_token = Token()
#         new_token.appkey = "dmoss"
#         new_token.secret = "123456"
#         new_token.token = "dmoss_"+ str(token)
#         db.session.add(new_token)
#         db.session.commit()
#         return json({"error_code":"0","error_message":"successful"})
#     return json({})

# @app.route('/api/v1/dmoss_upload', methods=['POST'])
# async def dmoss_upload(request):
#     data = request.headers
#     if data['X-Auth-Token'] == "FDSDFDV26DBFsdfgsdg634vfsdfsdfdgt35gw":
#         url = app.config['FILE_SERVICE_URL']
#         fsroot = app.config['FS_ROOT']
#         if request.method == 'POST':
#             file = request.files.get('file', None)
#             if file :
#                 rand = ''.join(random.choice(string.digits) for _ in range(15))
#                 file_name = os.path.splitext(file.name)[0]
#                 extname = os.path.splitext(file.name)[1]
#                 newfilename = file_name + "-" + rand + extname
#                 new_filename = newfilename.replace(" ", "_")
#                 async with aiofiles.open(fsroot + new_filename, 'wb+') as f:
#                     await f.write(file.body)
#                 title = pandas.read_excel("static/uploads/"+new_filename,header=0)
#                 df = pandas.read_excel("static/uploads/"+new_filename,header=1)
#                 count = df.Province.count()
#                 i = 0
#                 arr = []
#                 while i < count:
#                     obj = {}
#                     obj['Province'] = df.Province[i]
#                     obj['Month'] = df.Month[i]
#                     obj['ThresholdDescription'] = df.ThresholdDescription[i]
#                     obj['ThresholdValue'] = df.ThresholdValue[i]
#                     obj['ExceedanceProbability'] = df.ExceedanceProbability[i]
#                     obj['Title'] = title.columns.ravel()[0]
#                     obj['Date'] = date.today()
#                     arr.append(obj)
#                     i += 1
                    
#                 j = 0
#                 date_string =  str(arr[j]['Date'])[5:7]+'/'+str(arr[j]['Date'])[8:10]+'/'+str(arr[j]['Date'])[0:4]
#                 datesend = datetime.datetime.strptime(date_string, "%m/%d/%Y")
#                 ngaygui = int(datetime.datetime.timestamp(datesend))
#                 arr2 = []
#                 while j < count:
#                     obj = {}
#                     obj['Province'] = str(arr[j]['Province'])
#                     obj['Month'] = str(arr[j]['Month'])
#                     obj['ThresholdValue'] = str(arr[j]['ThresholdValue'])
#                     obj['ExceedanceProbability'] = str(arr[j]['ExceedanceProbability'])
#                     obj['ThresholdDescription'] = str(arr[j]['ThresholdDescription'])
#                     arr2.append(obj)
#                     if j % 6 == 0:
#                         dataDMoss = DataDMoss()
#                         dataDMoss.tieude = str(arr[j]['Title']) +' '+str(arr[j]['Province'])
#                         dataDMoss.ngaygui = ngaygui
#                         dataDMoss.type = "excel"
#                         dataDMoss.nguoigui = "Dmoss system"
#                         dataDMoss.data = arr2
#                         arr2 = []
#                         db.session.add(dataDMoss)
#                         db.session.commit()
#                     j += 1
#                 return json({'data':"success"})
#         return json({
#             "error_code": "Upload Error",
#             "error_message": "Could not upload file to store"
#         }, status=520)
#     else:
#         return json({
#             "error_code": "Upload Error",
#             "error_message": "Incorrect token"
#         }, status=520)


@app.route('/api/v1/dmoss_upload', methods=['POST'])
async def dmoss_upload(request):
    data = request.headers
    if data['X-Auth-Token'] == "FDSDFDV26DBFsdfgsdg634vfsdfsdfdgt35gw":
        title = pandas.read_excel("static/uploads/D-MOSS_Vietnam_Dengue_Forecast.xlsx",header=0)
        df = pandas.read_excel("static/uploads/D-MOSS_Vietnam_Dengue_Forecast.xlsx",header=1)
        count = df.Province.count()
        i = 0
        arr = []
        while i < count:
            obj = {}
            obj['Province'] = df.Province[i]
            obj['Month'] = df.Month[i]
            obj['ThresholdDescription'] = df.ThresholdDescription[i]
            obj['ThresholdValue'] = df.ThresholdValue[i]
            obj['ExceedanceProbability'] = df.ExceedanceProbability[i]
            obj['Title'] = title.columns.ravel()[0]
            obj['Date'] = date.today()
            arr.append(obj)
            i += 1
        j = 0
        date_string =  str(arr[j]['Date'])[5:7]+'/'+str(arr[j]['Date'])[8:10]+'/'+str(arr[j]['Date'])[0:4]
        datesend = datetime.datetime.strptime(date_string, "%m/%d/%Y")
        ngaygui = int(datetime.datetime.timestamp(datesend))
        arr2 = []
        while j < count:
            obj = {}
            obj['Province'] = str(arr[j]['Province'])
            obj['Month'] = str(arr[j]['Month'])
            obj['ThresholdValue'] = str(arr[j]['ThresholdValue'])
            obj['ExceedanceProbability'] = str(arr[j]['ExceedanceProbability'])
            obj['ThresholdDescription'] = str(arr[j]['ThresholdDescription'])
            arr2.append(obj)
            if j % 6 == 0:
                dataDMoss = DataDMoss()
                dataDMoss.tieude = str(arr[j]['Title']) +' '+str(arr[j]['Province'])
                dataDMoss.ngaygui = ngaygui
                dataDMoss.type = "excel"
                dataDMoss.nguoigui = "Dmoss system"
                dataDMoss.data = arr2
                arr2 = []
                db.session.add(dataDMoss)
                db.session.commit()
            j += 1
        return json({'data':"success"})
    return json({
        "error_code": "Upload Error",
        "error_message": "Could not upload file to store"
    }, status=520)
    # else:
    #     return json({
    #         "error_code": "Upload Error",
    #         "error_message": "Incorrect token"
    #     }, status=520)