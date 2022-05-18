from db import Db

class UserModel():
    def login(self, username, password):
        if username and password:
            db = Db.get_instance()
            sql = "SELECT count(*) as total FROM users WHERE username='%s' and password='%s'" % (username, password)
            res = db.fetchone(sql)
            return res['total']==1
        else:
            return False        