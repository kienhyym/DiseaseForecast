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
    db.Column('role_id', UUID(as_uuid=True), db.ForeignKey('role.id', ondelete='cascade'), primary_key=True))


class Role(CommonModel):
    __tablename__ = 'role'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


    

    
class User(CommonModel):
    __tablename__ = 'user'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    phone_number =  db.Column(String(11), index=True, nullable=True)
    phone_zalo = db.Column(String(11))
    email = db.Column(String(50), index=True, nullable=True)
    name = db.Column(String(50))
    password = db.Column(String, nullable=True)
    salt = db.Column(db.String())
    donvi_id = db.Column(UUID(as_uuid=True),db.ForeignKey('donvi.id'), nullable=True)
    captren_stt = db.Column(Integer())
    donvicaptren_id = db.Column(db.String(255))
    tinhthanh_id = db.Column(String, nullable=True)
    quanhuyen_id = db.Column(String, nullable=True)
    xaphuong_id = db.Column(String, nullable=True)
    donvi = db.relationship('DonVi', viewonly=True)
    roles = db.relationship('Role', secondary=roles_users, cascade="save-update")
    phancapnhanbaocao = db.Column(db.String(50))
    id_nguoitao = db.Column(db.String(50))
    config = db.Column(JSONB,default={"lang":"VN"})
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
    donvicaptren = db.Column(db.String(255))
    email = db.Column(db.String(255))
    nhanthongbaohaykhong = db.Column(db.String(7))
    captren_id = db.Column(Integer())
    tinhthanh_id = db.Column(String, nullable=True)
    tinhthanh = db.Column(JSONB)
    quanhuyen_id = db.Column(String, nullable=True)
    quanhuyen = db.Column(JSONB)
    xaphuong_id = db.Column(String, nullable=True)
    xaphuong = db.Column(JSONB)


class SendWarning(CommonModel):
    __tablename__ = 'sendwarning'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    todonvi = db.Column(JSONB)
    toemail = db.Column(JSONB)
    tozalo = db.Column(JSONB)
    tophone = db.Column(JSONB)
    canhbao = db.Column(JSONB)
    cc = db.Column(String(255))
    message = db.Column(Text())
    message2 = db.Column(Text())
    tailieu = db.Column(String(255))
    ngayguizalo = db.Column(BigInteger())
    ngayguigmail = db.Column(BigInteger())
    ngayguiphone = db.Column(BigInteger())
    user_id = db.Column(String(255))

class DataDMoss(CommonModel):
    __tablename__ = 'datadmoss'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    data = db.Column(JSONB)
    category = db.Column(JSONB)
    tieude = db.Column(String(255))
    nguoigui = db.Column(String(255))
    ngaygui = db.Column(BigInteger())
