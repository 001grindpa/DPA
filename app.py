from flask import Flask, session, request, jsonify, render_template, redirect, Response, stream_with_context
from flask_session import Session
from flask_apscheduler import APScheduler
from cs50 import SQL
import json
import asyncio
from datetime import datetime, timedelta
import time
import os
from tools import countDown
import subprocess
from organizer import get_tasks

# databse integration 
db = SQL("sqlite:///dpa.db")

# app declaration
app = Flask(__name__)

# app session(cookie) configuration
# app.config["SESSION_PERMANENT"] = False
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=31)
app.config["SCHEDULER_TIMEZONE"] = "Africa/Lagos"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

scheduler = APScheduler()
scheduler.api_enabled = True
scheduler.scheduler.timezone = "Africa/Lagos"
scheduler.init_app(app)
scheduler.start()

@app.before_request
def permanent_session():
    session.permanent = True

# deploy smart contract before midnight and store it in a database
# current_dir = os.getcwd()
# habits_path = os.path.join(current_dir, "base-habits")

def deploy_contract():
    try:
        result = subprocess.check_output (
            ["npx", "hardhat", "run", "scripts/deploy.js", "--network", "base_mainnet"], 
            cwd="base-habits", 
            timeout=200,
            # stderr=subprocess.STDOUT
        )
        data = result.decode().strip()
        db.execute("INSERT INTO contracts(contract) VALUES(?)", data)
    except subprocess.CalledProcessError as e:
        print(f"Hardhat error: {e.output.decode()}")

@scheduler.task("cron", id="do_deploy", hour=22, minute=0, day="*")
def schedule_deploy():
    with app.app_context():
        deploy_contract()


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

@app.route("/get_contract")
def get_contract():
    contracts = db.execute("SELECT * FROM contracts ORDER BY id DESC LIMIT 1")
    for data in contracts:
        new_contract = data.get("contract")
    return jsonify({"msg": new_contract})

@app.route('/.well-known/farcaster.json')
def farcaster_manifest():
    # Allow only GET requests
    if request.method != 'GET':
        return '', 404

    manifest = {
        "accountAssociation": {
            "header": "eyJmaWQiOjQ1NDYxMSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDNmRmQyMWQ5MDYwZEJDYTVGNDFBODNCOERlYzg5Q2VFQTJENGQ1YTMifQ",
            "payload": "eyJkb21haW4iOiJkcGEucjItdzMuZnVuIn0",
            "signature": "03WbDeuRYETbC9pdlvT3VYR8kB44yw+Mmt0cDovjaYhdMGvpHAG7SejVoQ1+/UPoK27yPljbIzfRwaVPLSekVRs="
        },
        "miniapp": {
            "version": "1",
            "name": "Daily Positive Actions",
            "subtitle": "Become Better each day.",
            "description": """DPA helps you build consistency through small, meaningful habits. 
            Each day, choose up to 20 positive tasks, commit, and check them off at night (8 pm).""",
            "iconUrl": "https://dpa.r2-w3.fun/static/images/dpa_logo.jpeg",  # absolute URL, must load
            "homeUrl": "https://dpa.r2-w3.fun/",
            # add other fields like screenshotUrls, etc. if you want
            # optional: webhookUrl if using notifications
        }
    }
    return jsonify(manifest)

# @app.route("/countDown")
# def countDownAPI():
#     now = datetime.now()
    
#     # Set target to 8 PM today
#     target = now.replace(hour=20, minute=0, second=0, microsecond=0)
    
#     # If current time is past 8 PM, target tomorrow's 8 PM
#     if now >= target:
#         target += timedelta(days=1)

#     fullTime = int((target - now).total_seconds())
  
#     def countDown():
#         nonlocal fullTime
        
#         while fullTime > 0:
#             hr = int(fullTime/3600)
#             min = int((fullTime % 3600)/60)

#             sec = fullTime % 60
#             if min < 10:
#                 min = f"0{min}"
#             if sec < 10:
#                 sec = f"0{sec}"

#             yield f"data: {json.dumps(f"{hr}hr {min}min {sec}sec")}\n\n"

#             time.sleep(1)
#             fullTime -= 1
    
#     return Response(stream_with_context(countDown()), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(port=8080, use_reloader=True, debug=True, reloader_type="watchdog")