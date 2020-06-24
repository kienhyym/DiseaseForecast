import os, sys
# from boto.s3.connection import S3Connection
from application.extensions import sqlapimanager
from application.server import app
from application.database import db, redisdb
from gatco.response import json, text, html
# from werkzeug.utils import secure_filename
import io
from PIL import Image
import time
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


# @app.route('/api/v1/upload/file', methods=['POST'])
# async def upload_file(request):
#     ret = None
#     url = app.config['FILE_SERVICE_URL']
#     fsroot = app.config['FS_ROOT']
#     if request.method == 'POST':
#         try:
#             file = request.files.get('file', None)
#             if file :
#                 rand = ''.join(random.choice(string.digits) for _ in range(15))
#                 file_name = os.path.splitext(file.name)[0]
#                 extname = os.path.splitext(file.name)[1]
#     #             newfilename = file_name + "-" + rand + extname
#                 newfilename = file_name + rand + extname
                
#                 async with aiofiles.open(fsroot + newfilename, 'wb+') as f:
#                     await f.write(file.body)
                
#                 return json({
#                         "error_code": "OK",
#                         "error_message": "successful",
#                         "id":rand,
#                         "link":url  + "/" + newfilename,
#                         "filename":newfilename,
#                         "filename_organization":file_name,
#                         "extname":extname
#                     }, status=200)
#         except Exception as e:
#             raise e
#     return json({
#         "error_code": "Upload Error",
#         "error_message": "Could not upload file to store"
#     }, status=520)



@app.route('/api/v1/upload/file', methods=['POST'])
async def upload_file(request):
    url = app.config['FILE_SERVICE_URL']
    fsroot = app.config['FS_ROOT']
    if request.method == 'POST':
        file = request.files.get('file', None)

        image = request.files.get('image')

        if file :
            rand = ''.join(random.choice(string.digits) for _ in range(15))
            file_name = os.path.splitext(file.name)[0]
            # print("-----------------Hello World------------------------",file_name)
            extname = os.path.splitext(file.name)[1]
#             newfilename = file_name + "-" + rand + extname
            newfilename = file_name + extname 
            new_filename = newfilename.replace(" ", "_")
            async with aiofiles.open(fsroot + new_filename, 'wb+') as f:
                await f.write(file.body)
            print("-----------------Hello World------------------------",new_filename)

            return json({
                    "error_code": "OK",
                    "error_message": "successful",
                    "id":rand,
                    "link":url  + "/" + new_filename,
                    "filename":newfilename,
                    "filename_organization":file_name,
                    "extname":extname
                }, status=200)
    
    return json({
        "error_code": "Upload Error",
        "error_message": "Could not upload file to store"
    }, status=520)



@app.route('/api/v1/link_file_upload_excel', methods=['POST'])
async def link_file_upload_excel(request):
    url = app.config['FILE_SERVICE_URL']
    fsroot = app.config['FS_ROOT']
    if request.method == 'POST':
        file = request.files.get('file', None)
        if file :
            rand = ''.join(random.choice(string.digits) for _ in range(15))
            file_name = os.path.splitext(file.name)[0]
            extname = os.path.splitext(file.name)[1]
            newfilename = file_name + "-" + rand + extname
            new_filename = newfilename.replace(" ", "_")
            async with aiofiles.open(fsroot + new_filename, 'wb+') as f:
                await f.write(file.body)
            df = pandas.read_excel("static/uploads/"+new_filename)

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
                obj['Title'] = df.Title[0]
                obj['Date'] = df.Date[0]

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








