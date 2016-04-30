# code modified from Flask documentation: Armin Ronacher http://flask.pocoo.org
# all the imports
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify
from contextlib import closing
from mongokit import Connection, Document
import datetime

# configuration
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017

# create application
app = Flask(__name__)
app.config.from_object(__name__)

# setup connection for database
connection = Connection(app.config['MONGODB_HOST'],
                        app.config['MONGODB_PORT'])

def max_length(length):
    def validate(value):
        if len(value) <= length:
            return True
        raise Exception('%s must be at most %s characters long' % length)
    return validate

class User(Document):
    __collection__ = 'full_stack'
    __database__ = 'users'
    structure = {
        'username': unicode,
        'password': unicode,
        'creation_date': datetime.datetime.utcnow
    }
    validators = {
        'username': max_length(20),
        'password': max_length(15)
    }
    use_dot_notation = True
    def __repr__(self):
        return '<User %r>' % (self.username)

class Trip(Document):
    __collection__ = 'full_stack'
    __database__ = 'trips'
    structure = {
        'username': unicode,
        'trip': dict,
        'creation_date': datetime.datetime.utcnow
    }
    use_dot_notation = True

# register the User document with our current connection
connection.register([User])

# function to return entire log from database
@app.route('/log')
def get_log():
    cursor = g.db.execute('SELECT * FROM feedingLog ORDER BY id DESC LIMIT 10')
    results = cursor.fetchall()
    cursor.close()
    log = []
    if results:
        for entry in results:
            log_entry = {
                'id' : entry['id'],
                'username' : entry['username'],
                'timestamp' : entry['timestamp']
                }
            # append entry to log
            log.append(log_entry)
        # create json object to return log
        json_log = {
            'status' : 'OK',
            'log' : log
        }
        return jsonify(json_log)
    else:
        error = {
            'status' : 'error',
            'msg' : 'unable to retrieve log'
        }
        return jsonify(error)

@app.route('/login', methods=['POST'])
def validate_login():
    received = request.json
    print received
    return jsonify({'status':'OK'})

# function to initiate feeding
# turn on -> delay -> turn off -> create entry in database with username
@app.route('/feed/<name>', methods=['GET','POST'])
def initiate_feeding(name):
    # perform feeding
    print name
    #log feeding in database
    g.db.execute('INSERT INTO feedingLog (username) VALUES (?)', [name])
    g.db.commit()
    return jsonify({'status' : 'OK'})

# run server
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug='true')
