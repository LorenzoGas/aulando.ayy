import MySQLdb

def toObj(args,tableName,cur):
    columnName=cur.execute("describe "+tableName).fetchall()
    def obj:
        
    
    

db = MySQLdb.connect(host="www.xoft.cloud",    # your host, usually localhost
                     user="superroot",         # your username
                     passwd="root",  # your password
                     db="web")        # name of the data base

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
cur.execute("show tables;")

# print all the first cell of all the rows
print cur.fetchall()
for row in cur.fetchall():
    print row

db.close()