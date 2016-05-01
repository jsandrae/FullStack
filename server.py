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
SECRET_KEY = 'this is the Test Development Key for the project!'

#FULLSTACK_SETTINGS = '/settings.py'

# create application
app = Flask(__name__)
app.config.from_object(__name__)
#app.config.from_envvar('FULLSTACK_SETTINGS', silent=True)

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
    }
    use_dot_notation = True

# register the User & trip document with our current connection
connection.register([User])
connection.register([Trip])

# function to display index page
@app.route('/')
def index():
    return render_template('index.html')

# function to save new login information to database
@app.route('/createAccount', methods=['POST'])
def create_account():
    received = request.json
    username = received['username']
    password = received['password']
    newUser = connection.User()
    query = connection.User.find_one({'username':username})
    print query
    if (query == None):
        newUser['username'] = username
        newUser['password'] = password
        newUser.save()
        return jsonify({'status':'OK'})
    else:
        return jsonify({'status':'Error: duplicate username'})

# function to check database for valid login information
@app.route('/login', methods=['POST'])
def validate_login():
    received = request.json
    username = received['username']
    password = received['password']
    query = connection.User.find_one({'username':username})
    if (query == None):
        return jsonify({'status':'Error: No such username exists', 'isValid': 'false'})
    uPass = query['password']
    isValid = (uPass == password)

    return jsonify({'status':'OK', 'isValid':isValid})

# run server
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug='true')
