# code modified from Flask documentation: Armin Ronacher http://flask.pocoo.org
# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify
from contextlib import closing
import time

# configuration
DATABASE = 'feedingLog.db'
DEBUG = True

# create application
app = Flask(__name__)

# setup connection for database
def connect_db():
    db = getattr(g, '_database', None)
    if db is None:
		db = g._database = sqlite3.connect(DATABASE)
		db.row_factory = sqlite3.Row
    return db

# function called before each request
# g is object imported from flask
@app.before_request
def before_request():
    g.db = connect_db()

# function to be called after a response has been constructed to handle exceptions
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        print "Teardown {0!r}".format(exception)
        db.close()

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

# function to initiate feeding
# turn on -> delay -> turn off -> create entry in database with username
@app.route('/feed/<name>', methods=['GET','POST'])
def initiate_feeding(name):
    # perform feeding
    print name
    on.turn_on()
    time.sleep(2) #delay for 0.1 seconds
    off.turn_off()
    #log feeding in database
    g.db.execute('INSERT INTO feedingLog (username) VALUES (?)', [name])
    g.db.commit()
    return jsonify({'status' : 'OK'})

# run server
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug='true')

# One time setup for creating database
# initalize database by opening local folder and creating db from saved schema file
def init_db():
    with app.app_context():
        db = connect_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()
