from application.database import db,redisdb
from application.database.model import CommonModel
from sqlalchemy import (and_, or_, String,SmallInteger, Integer, BigInteger, Boolean, DECIMAL, Float, Text, ForeignKey, UniqueConstraint, Index, DateTime)
from sqlalchemy.dialects.postgresql import UUID, JSONB

from sqlalchemy.orm import relationship, backref
import uuid

def default_uuid():
    return str(uuid.uuid4())


roles_users = db.Table('roles_users',
    db.Column('user_id', UUID(as_uuid=True), db.ForeignKey('user.id', ondelete='cascade'), primary_key=True),
    db.Column('role_id', UUID(as_uuid=True), db.ForeignKey('role.id', onupdate='cascade'), primary_key=True))


class Role(CommonModel):
    __tablename__ = 'role'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    

    
class User(CommonModel):
    __tablename__ = 'user'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    phone_number =  db.Column(String(50), index=True, nullable=True)
    email =  db.Column(String(50), index=True, nullable=True)
    name = db.Column(String(50))
    password = db.Column(String, nullable=True)
    salt = db.Column(db.String())
    type = db.Column(db.String())
    donvi_id = db.Column(UUID(as_uuid=True),db.ForeignKey('donvi.id'), nullable=True)
    donvi = db.relationship('DonVi', viewonly=True)
    description = db.Column(db.String())
    active = db.Column(db.Boolean(), default=True)
    roles = db.relationship('Role', secondary=roles_users, cascade="save-update")
    userconnectionchannels = db.relationship('UserConnectionChannel', cascade="all, delete-orphan")
    def has_role(self, role):
        if isinstance(role, str):
            return role in (role.name for role in self.roles)
        else:
            return role in self.roles


class DanToc(CommonModel):
    __tablename__ = 'dantoc'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255), index=True)
    ten = db.Column(String(255))
    
class QuocGia(CommonModel):
    __tablename__ = 'quocgia'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255), index=True)
    ten = db.Column(String(255))

class TinhThanh(CommonModel):
    __tablename__ = 'tinhthanh'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255),unique=True, index=True)
    ten = db.Column(String(255))
    quocgia_id = db.Column(UUID(as_uuid=True), nullable=True)
    quocgia = db.Column(JSONB)

class QuanHuyen(CommonModel):
    __tablename__ = 'quanhuyen'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255),unique=True, index=True)
    ten = db.Column(String(255))
    tinhthanh_id = db.Column(UUID(as_uuid=True), nullable=True)
    tinhthanh = db.Column(JSONB)
    
class XaPhuong(CommonModel):
    __tablename__ = 'xaphuong'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255),unique=True, index=True)
    ten = db.Column(String(255))
    quanhuyen_id = db.Column(UUID(as_uuid=True), nullable=True)
    quanhuyen = db.Column(JSONB)

class DonVi(CommonModel):
    __tablename__ = 'donvi'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(db.String(255), nullable=True)
    ten = db.Column(db.String(255), nullable=False)
    sodienthoai = db.Column(db.String(63))
    diachi = db.Column(db.String(255))
    email = db.Column(db.String(255))
    ghichu = db.Column(db.String(255))
    vungmien = db.Column(db.SmallInteger) #

    tinhthanh_id = db.Column(String, nullable=True)
    tinhthanh = db.Column(JSONB)
    quanhuyen_id = db.Column(String, nullable=True)
    quanhuyen = db.Column(JSONB)
    xaphuong_id = db.Column(String, nullable=True)
    xaphuong = db.Column(JSONB)
    
    tuyendonvi = db.Column(db.SmallInteger, nullable=False) # la trung tam, hay truong hoc ...
    coquanchuquan = db.Column(db.String(255))
    parent_id = db.Column(db.Integer, nullable=True)
    
    giamdoc = db.Column(db.String)
    sdtgiamdoc = db.Column(db.String)
    emailgiamdoc = db.Column(db.String)
    phogiamdoc = db.Column(db.String)
    sdtphogiamdoc = db.Column(db.String)
    emailphogiamdoc = db.Column(db.String)
    
class UserConnectionChannel(CommonModel):
    __tablename__ = 'userconnectionchannel'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    user_id = db.Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=True)
    user = db.relationship('User', viewonly=True)
    channelname = db.Column(String(255))
    value = db.Column(String(255))

class SendMail(CommonModel):
    __tablename__ = 'sendmail'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    email = db.Column(String(255))
    password = db.Column(String(255))
    to = db.Column(String(255))
    message = db.Column(String(255))
    subject = db.Column(String(255))
    tailieu = db.Column(String(255))


class SendSMS(CommonModel):
    __tablename__ = 'sendsms'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    to = db.Column(String(255))
    content = db.Column(String(255))
    sender = db.Column(String(255))
    name = db.Column(String(255))
    send_time = db.Column(String(255))
    
class SendZalo(CommonModel):
    __tablename__ = 'sendzalo'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    to = db.Column(String(255))
    content = db.Column(String(255))
    sender = db.Column(String(255))
    name = db.Column(String(255))
    send_time = db.Column(String(255))