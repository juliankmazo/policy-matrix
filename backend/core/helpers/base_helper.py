# -*- coding: utf-8 -*-
import hmac
import re
import datetime
thing = "ZaoZvf4ml3Sgn5VRsEa5gsYf4oblrku49KGwRDzn"


class BaseHelper(object):

    @classmethod
    def make_secure_val(cls, val):
        return '%s|%s' % (val, hmac.new(thing, val).hexdigest())

    @classmethod
    def check_secure_val(cls, secure_val):
        val = secure_val.split('|')[0]
        if secure_val == cls.make_secure_val(val):
            return val

    @classmethod
    def valid_string(cls, s, a, b):
        S_RE = re.compile(r"^.{3,30}$")
        return s and S_RE.match(s)

    @classmethod
    def valid_number(cls, n, a, b):
        N_RE = re.compile(r"^[0-9]{3,15}$")
        return n and N_RE.match(n)

    @classmethod
    def valid_mail(cls, mail):
        MAIL_RE = re.compile(r"^[\S]+@[\S]+\.[\S]+$")
        return not mail or MAIL_RE.match(mail)

    @classmethod
    def datetime_mex(cls, hora):
        return hora + datetime.timedelta(hours=-6)
