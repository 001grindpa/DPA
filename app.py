from flask import Flask, session, request, jsonify, render_template, redirect
from flask_session import Session
from cs50 import SQL
import json
import asyncio
from datetime import timedelta
import datetime
from organizer import get_tasks

# databse integration 
# db = SQL("sqlite:///dpa.db")

# app declaration
app = Flask(__name__)

# app session(cookie) configuration
# app.config["SESSION_PERMANENT"] = False
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=31)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.before_request
def permanent_session():
    session.permanent = True

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        session["tasks"] = request.get_json()
        return jsonify({"msg": "congrats, you've setup your tasks"})
    if not session.get("launch"):
        return redirect("/landing")
    json_tasks = session.get("tasks")
    if json_tasks:
        tasks = json_tasks
    else:
        tasks = {"msg": "No tasks available"}
    return render_template("index.html", page_id="index", tasks=tasks)

@app.route("/landing", methods=["GET", "POST"])
def landing():
    if request.method == "POST":
        session["launch"] = request.form.get("enter")
        return redirect("/")
    return render_template("landing.html", page_id="landing")

@app.route("/api/tasks", methods=["POST", "GET"])
def tasks_api():
    tasks = asyncio.run(get_tasks())
    return jsonify({"msg": tasks})

@app.route("/api/choosen_tasks")
def choosen_tasks():
    tasks = []
    for task in session["tasks"]:
        tasks.append(session["tasks"][task])
    return jsonify({"msg": tasks})

@app.route("/cancel")
def cancel():
    session["tasks"] = None
    return jsonify({"msg": "tasks session cancelled"})

@app.route("/streak")
def streak():
    if not session.get("days"):
        session["days"] = 1
        return jsonify({"msg": session.get("days")})
    session["days"] = session.get("days") + 1
    return jsonify({"msg": session.get("days")})

@app.route("/clearStreak")
def clearStreak():
    session["days"] = None
    return jsonify({"msg": "streak cleared"})


if "__name__" == "__main__":
    app.run(port=8080, use_reloader=True, debug=True, reloader_type="watchdog")