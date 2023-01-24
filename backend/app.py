from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_marshmallow import Marshmallow
from datetime import datetime, timedelta
from flask_cors import CORS
import os
import jwt
import bcrypt
from functools import wraps

load_dotenv()  # Load environment variables

app = Flask(__name__)
CORS(app)
# JWT
app.config['SECRET_KEY'] = 'my secret key'
# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USERNAME')}:{os.getenv('MYSQL_PASSWORD')}@localhost/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'

db = SQLAlchemy(app)
ma = Marshmallow(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        print(request.headers)
        if 'auth-token' in request.cookies:
            token = request.cookies['auth-token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message': 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=["HS256"])
            print(data)
            current_user = Users.query.filter_by(userId=data['userId']).first()
        except:
            return jsonify({
                'message': 'Token is invalid !!'
            }), 401
        # returns the current logged in users contex to the routes
        return f(current_user, *args, **kwargs)

    return decorated


class Division(db.Model):
    divisionId = db.Column(db.Integer, primary_key=True)
    divisionName = db.Column(db.String(45))
    technical = db.Column(db.Boolean)
    divisionCode = db.Column(db.String(50))

    def __init__(self, divisionName, technical, code):
        self.divisionName = divisionName
        self.divisionCode = code
        self.technical = technical


class DivisionSchema(ma.Schema):
    class Meta:
        fields = ('divisionId', 'divisionName', 'technical', 'divisionCode')


division_schema = DivisionSchema()
divisions_schema = DivisionSchema(many=True)


@app.route("/divisions", methods=['GET'])
def getDivisions():
    all_divisions = Division.query.all()
    results = divisions_schema.dump(all_divisions)
    return jsonify(results)


@app.route("/divisions/<dcode>", methods=['GET'])
def getDivisionByCode(dcode):
    division = Division.query.filter(Division.divisionCode == dcode).first()
    return division_schema.jsonify(division)


@app.route("/divisions/add", methods=['POST'])
def addDivision():
    divisionName = request.json.get('divisionName')
    technical = request.json.get('technical')
    divisionCode = request.json.get('divisionCode')
    division = Division(divisionName, technical, divisionCode)
    db.session.add(division)
    db.session.commit()
    return division_schema.jsonify(division)


@app.route("/divisions/update/<dcode>", methods=['PUT'])
def updateDivision(dcode):
    division = Division.query.filter(Division.divisionCode == dcode).first()
    divisionName = request.json.get('divisionName')
    divisionCode = request.json.get('divisionCode')
    technical = request.json.get('technical')

    division.divisionName = divisionName
    division.divisionCode = divisionCode
    division.technical = technical

    db.session.commit()
    return division_schema.jsonify(division)


@app.route("/divisions/delete/<dcode>", methods=['DELETE'])
def deleteDivision(dcode):
    division = Division.query.filter(Division.divisionCode == dcode).first()
    db.session.delete(division)
    db.session.commit()
    return division_schema.jsonify(division)


class Users(db.Model):
    userId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(45))
    password = db.Column(db.String(200))
    emailId = db.Column(db.String(100))
    divisionId = db.Column(db.Integer)

    def __init__(self, username, password, emailId, divisionId):
        self.username = username
        self.password = password
        self.emailId = emailId
        self.divisionId = divisionId


class UsersSchema(ma.Schema):
    class Meta:
        fields = ('userId', 'username', 'password', 'emailId', 'divisionId')


user_schema = UsersSchema()
users_schema = UsersSchema(many=True)


@app.route("/register", methods=['POST'])
def registerUser():
    username = request.json.get('username')
    password = request.json.get('password')
    emailId = request.json.get('emailId')
    divisionId = 1
    password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(14))
    print("Hashed PASSWORD", password)
    user = Users(username, password, emailId, divisionId)
    db.session.add(user)
    db.session.commit()
    return "User registered Successfully", 200


@app.route("/users", methods=['GET'])
@token_required
def getUsers():
    users = Users.query.all()
    return users_schema.jsonify(users)


@app.route("/login", methods=['POST'])
def loginUser():
    username = request.json.get('username')
    user = Users.query.filter(Users.username == username).first()
    print(user.userId)
    if not user:
        return "Username Not Found", 403
    else:
        password = request.json.get('password')
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            token = jwt.encode({
                'userId': user.userId,
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }, app.config['SECRET_KEY'], algorithm="HS256")
            print("here")
            resp = make_response(user_schema.jsonify(user), 201)
            resp.set_cookie("auth-token", token, httponly=True)
            return resp
        else:
            return "Invalid Password", 403


@app.route("/users/update/<username>", methods=['PUT'])
def updateUser(username):
    user = Users.query.filter(Users.username == username).first()
    if not user:
        return "User Not Found", 500
    else:
        emailId = request.json.get('emailId')
        divisionId = request.json.get('divisionId')
        user.emailId = emailId
        user.divisionId = divisionId
        db.session.commit()
        return "User Details Updated", 200


@app.route("/users/delete/<username>", methods=['DELETE'])
def deleteUser(username):
    user = Users.query.filter(Users.username == username).first()
    if not user:
        return "User Not Found", 500
    else:
        db.session.delete(user)
        db.session.commit()
        return "User Deleted Successfully", 200


class Jobs(db.Model):
    jobId = db.Column(db.Integer, primary_key=True)
    jobTitle = db.Column(db.String(100))
    postedBy = db.Column(db.Integer)
    isOpen = db.Column(db.Boolean)
    jobDescription = db.Column(db.String(10000))
    requirements = db.Column(db.String(1000))
    salary = db.Column(db.Integer)
    lastDateToApply = db.Column(db.Date)
    divisionId = db.Column(db.Integer)

    def __init__(self, jobTitle, postedBy, isOpen, jobDescription, requirements, salary, lastDateToApply, divisionId):
        self.jobTitle = jobTitle
        self.postedBy = postedBy
        self.isOpen = isOpen
        self.jobDescription = jobDescription
        self.requirements = requirements
        self.salary = salary
        self.lastDateToApply = lastDateToApply
        self.divisionId = divisionId


class JobSchema(ma.Schema):
    class Meta:
        fields = ('jobId', 'jobTitle', 'postedBy', 'isOpen', 'jobDescription',
                  'requirements', 'salary', 'lastDateToApply', 'divisionId')


jobSchema = JobSchema()
jobsSchema = JobSchema(many=True)


@app.route("/jobs/add", methods=['POST'])
# @token_required
def addJobs():
    jobTitle = request.json.get('jobTitle')
    postedBy = 1
    isOpen = True
    jobDescription = request.json.get('jobDescription')
    requirements = "!233"
    salary = int(request.json.get('salary'))
    lastDateToApply = request.json.get('lastDateToApply')
    divisionId = 1

    job = Jobs(jobTitle, postedBy, isOpen, jobDescription,
               requirements, salary, lastDateToApply, divisionId)
    db.session.add(job)
    db.session.commit()

    return "Job Added Successfully", 200


@app.route("/jobs/delete/<jobId>", methods=['DELETE'])
def deleteJob(jobId):
    job = Jobs.query.filter(Jobs.jobId == jobId).first()
    if not job:
        return "Job Not Found", 500
    else:
        db.session.delete(job)
        db.session.commit()
        return "Job Deleted Successfully", 200


@app.route("/jobs", methods=['GET'])
# @token_required
def getJobs():
    jobs = Jobs.query.all()
    return jobsSchema.jsonify(jobs)


if __name__ == '__main__':
    app.run(debug=True, port=8800)
