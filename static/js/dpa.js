document.addEventListener("DOMContentLoaded", async () => {
    if (document.body.id === "index") {
        let body = document.querySelector("body");
        let sidebarCheck = body.querySelector("#checkBugger");
        let sideBar = body.querySelector("main .sideBar");
        let streakCheck = body.querySelector("main .sideBar .streak img");
        let streakMonth = body.querySelector("main .sideBar .streak .month");
        let streakDay = body.querySelector("main .sideBar .streak .day");
        let streakCount = body.querySelector(".sideBar .streakCount .count span:nth-child(1)");
        let streakCountDay = body.querySelector(".sideBar .streakCount .count span:nth-child(2)");
        let form = document.querySelector("main form");
        let count = document.querySelector("form .setCont .count span");
        let choices_1 = document.querySelector("form .choices_1");
        let choices_2 = document.querySelector("form .choices_2");
        let loader = document.querySelector(".load");
        let infoImg = document.querySelector(".indexH img");
        let infoCont = document.querySelector(".infoCont");
        let info = infoCont.querySelector(".infoCont .info");
        let hr = document.querySelector(".countDown #hr");
        let min = document.querySelector(".countDown #min");
        let sec = document.querySelector(".countDown #sec");
        let countDownCont = document.querySelector(".timerCont");
        let setLoader = document.querySelector(".btnCont img");
        let setBtn = document.querySelector(".btnCont input");
        let checkoutCont = document.querySelector(".checkoutCont");
        let leftArrow = document.querySelector(".checkoutCont .carouselCont img:nth-child(1)");
        let rightArrow = document.querySelector(".checkoutCont .carouselCont img:nth-child(2)");
        let carousel = document.querySelector(".checkoutCont .Carousel");
        let choosen_tasks = document.querySelectorAll(".Carousel .checkout");
        let taskTitle = document.querySelector(".Carousel .checkout .taskTitle");
        let allYes = document.querySelectorAll(".Carousel .checkout .yes");
        let allNo = document.querySelectorAll(".Carousel .checkout .no");
        let checkoutTitle = document.querySelector(".checkoutCont h3");
        let outcome = document.querySelector(".checkoutCont .carouselCont .outcome");
        let percentCont = document.querySelector(".carouselCont .outcome div:nth-child(1)");
        let percent = document.querySelector(".carouselCont .outcome div:nth-child(1) span:nth-child(1)");
        let percentSign = document.querySelector(".carouselCont .outcome div:nth-child(1) span:nth-child(2)");
        let perform = document.querySelector(".carouselCont .outcome .perform");
        let precentCont = document.querySelector(".carouselCont .outcome div:nth-child(1)");
        let outcomeLoader = document.querySelector(".carouselCont .outcome #outcomeLoader");
        let confetti = document.querySelector(".carouselCont .outcome #confetti");
        let confettiPop = document.querySelector("#confettiPop");
        let cancel = document.querySelector(".carouselCont .outcome #cancel");

        // streakCount.textContent = "5";

        let month = new Date().toLocaleString('en-US', {month: 'short'});
        streakMonth.textContent = month;
        let day = new Date().getDate();
        streakDay.textContent = day;

        setBtn.disabled = true;
        
        cancel.addEventListener("click", async () => {
            try {
                r = await fetch("/cancel")
                data = await r.json();
                console.log(data.msg);
                location.reload();
            }
            catch(error) {
                console.log({error: error});
            }
        });

        let gain = 0;
        let loss = 0;

        for (let i=0; i < allYes.length; i++) {
            allYes[i].addEventListener("click", () => {
                allYes[i].disabled = true;
                allYes[i].style.opacity = "1";
                allNo[i].disabled = true;
                allNo[i].style.opacity = "0.2";

                gain = gain + 1;
                console.log(`gain: ${gain}`)
                result();
            })

            allNo[i].addEventListener("click", () => {
                allNo[i].disabled = true;
                allNo[i].style.opacity = "1";
                allYes[i].style.opacity = "0.2";
                allYes[i].disabled = true;

                loss = loss + 1;
                console.log(`losses: ${loss}`);
                result();
            })
        };

        function result() {
            if ((gain+loss) == choosen_tasks.length) {
                let comment = "";
                carousel.style.display = "none";
                checkoutTitle.style.display = "none";
                rightArrow.style.display = "none";
                leftArrow.style.display = "none";

                if (gain == choosen_tasks.length) {
                    percent.textContent = "100";
                    percent.style.color = "green";
                    comment = "Excellent performance!";
                }
                else if (gain == 0) {
                    percentSign.style.display = "none";
                    percent.style.fontSize = "70px";
                    percentCont.style.marginBottom = "100px";
                    percent.textContent = "Very poor";
                    percent.style.color = "red";
                    comment = "Not even one? impress yourself tomorrow";
                }
                else if (gain < (choosen_tasks.length)/2) {
                    percentSign.style.display = "none";
                    percent.style.fontSize = "70px";
                    percentCont.style.marginBottom = "50px";
                    percent.textContent = "Below Average";
                    percent.style.color = "tomato";
                    comment = "Below Average? let's do better next time!";
                }
                else if (gain != choosen_tasks.length && gain > (choosen_tasks.length)/2) {
                    percentSign.style.display = "none";
                    percent.style.fontSize = "70px";
                    percentCont.style.marginBottom = "50px";
                    percent.textContent = "Above Average";
                    percent.style.color = "orange";
                    comment = "Great performance! 100% next?!";
                }
                else if (gain == (choosen_tasks.length)/2) {
                    percentSign.style.display = "none";
                    percent.style.fontSize = "70px";
                    percentCont.style.marginBottom = "100px";
                    percent.textContent = "Average";
                    percent.style.color = "gray";
                    comment = "Not bad performance, tomorrow we go again!";
                }

                outcome.style.display = "block";
                setTimeout(() => {
                    perform.textContent = comment;
                    outcomeLoader.style.display="none";
                    precentCont.style.display="block";
                    if (percent.textContent == "100") {
                        confettiPop.play();
                        confetti.style.display="block";
                        setTimeout(() => confetti.style.display="none", 4000);
                    }
                }, 4000);
            }
        };

        let index = 0;
        leftArrow.style.visibility = "hidden";

        if (choosen_tasks.length < 2) {
            rightArrow.style.visibility = "hidden";
            carousel.style.justifyContent = "center";
        }

        rightArrow.addEventListener("click", () => {
            let contWidth = choosen_tasks[0].offsetWidth;
            index = index + 1;
            contWidth = contWidth * index;
            carousel.scrollTo({
                left: contWidth
            })
            if (index > 0) {
                leftArrow.style.visibility = "visible";
            }
            if (index === (choosen_tasks.length-1)) {
                rightArrow.style.visibility = "hidden";
            }
        });
        leftArrow.addEventListener("click", () => {
            let contWidth = choosen_tasks[0].offsetWidth;
            index = index - 1;
            contWidth = contWidth * index;
            carousel.scrollTo({
                left: contWidth
            })
            if (index === 0) {
                leftArrow.style.visibility = "hidden";
            }
            if (index < (choosen_tasks.length)) {
                rightArrow.style.visibility = "visible";
            }
        });
        
        infoCont.style.display = "none";
        
        choices_1.style.display = "none";
        choices_2.style.display = "none";
        tasks = "";

        // send an auto api request to '/api/choosen_tasks', if the returned array is not empty, display timer countdown
        try {
            r = await fetch("/api/choosen_tasks")
            data = await r.json();
            console.log(data.msg);
            if ((data.msg).length != 0) {
                countDownCont.style.display = "block";
            }
        }
        catch(error) {
            console.log({error: error});
        }

        // display check symbol and disable form btn on page load if user already checked in

        if (document.cookie.includes("checkIn=true")) {
                streakCheck.style.display = "block";
                setBtn.style.background = "gray";
                setBtn.disabled = true;
            }

        // submit choosen tasks

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // remove the cookie that kepps count down off
            document.cookie = "countDown=false; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

            // if already checked in, return a message that acknowledges that
            if (document.cookie.includes("checkIn=true")) {
                return alert("You've already completed today's activities. Please come back tomorrow");
            }

            setBtn.style.display="none";
            setLoader.style.display="block";

            // start check in cookie declaration when user submits tasks
            midnight = new Date();
            midnight.setHours(24, 0, 0);

            document.cookie = `checkIn=true; expires=${midnight.toUTCString()}; path=/`;
            streakCheck.style.display = "block";
            
            // api call (list of choosen tasks are stored in a filesystem session untill cleared)
            const form_data = Object.fromEntries(new FormData(form));
            try {
                r = await fetch("/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(form_data)
                })
                data = await r.json();
                console.log(data.msg);
                
                setTimeout(() => {
                    setBtn.style.display="block";
                    setLoader.style.display="none";
                    countDownCont.style.display = "block";
                    alert("You've successfully setup your daily tasks");
                }, 3000);
            }
            catch(error) {
                console.log({error: error});
            }

            // get current streak
            try {
                r2 = await fetch("/streak");
                str = await r2.json();

                streakCount.textContent = str.msg;
                document.cookie = `currentStreak=${str.msg}`;
                if (str.msg == 1) {
                    streakCountDay.textContent = "day";
                }
            }
            catch(error) {
                console.log({error: error});
            }
        });

        // find and declare the currentStreak cookie value globally
        let currentStreak = document.cookie.split("; ").find(c => c.startsWith("currentStreak="))?.split("=")[1];

        if (currentStreak) {
            streakCount.textContent = currentStreak;
        }
        else {
            streakCount.textContent = "0";
        }
        // reset streak
        function resetStreak() {
            
        }

        console.log(document.cookie);

        let currentHour = new Date().getHours();
        let startingHour = 20 - currentHour;
        let time = startingHour * 3600; // get full time in seconds

        function countDown() {
            let hour = Math.floor(time/3600);
            let minute = Math.floor(time/60);
            minute = minute % 60;
            seconds = time % 60;
            minute = minute < 10? '0'+minute : minute;
            seonds = seconds < 10? '0'+seconds : seconds;

            if (time === 0 || hour < 0) {
                document.cookie = "countDown=false; path=/";
                if (taskTitle.textContent != '"No tasks available"') {
                    checkoutCont.style.display = "block";
                }
                if (document.cookie.includes("countDown=false")) {
                    countDownCont.style.display = "none";
                }
            }

            hr.textContent = hour;
            min.textContent = minute;
            sec.textContent = seconds;

            time--;
        }
        setInterval(() => countDown(), 1000);

        infoImg.addEventListener("click", () => {
            if (infoCont.style.display === "none") {
                infoCont.style.display = "block";
            }
            else {
                infoCont.style.display = "none";
            }
        });
        infoCont.addEventListener("click", () => {
            if (infoCont.style.display === "block") {
                infoCont.style.display = "none";
            }
            else {
                infoCont.style.display = "block";
            }
        });
        info.addEventListener("click", (e) => {
            e.stopPropagation();
        });


        async function get_tasks() {
            try {
                r = await fetch("/api/tasks");
                data = await r.json();
                let tasks = data.msg;

                for (let i=0; i < 10; i++) {
                    let choice = document.createElement("div");
                    let check = document.createElement("input");
                    let label = document.createElement("label");

                    choice.classList.add("choice");
                    check.classList.add("check");
                    check.id=`check ${i+1}`;
                    check.value=tasks[i];
                    check.name=`check ${i+1}`;
                    check.type="checkbox";

                    label.setAttribute("for", check.id);
                    label.textContent = tasks[i];

                    // console.log(label.textContent);
                    choices_1.appendChild(choice);
                    choice.appendChild(check);
                    choice.appendChild(label);
                }
                for (let i=10; i < 20; i++) {
                    let choice = document.createElement("div");
                    let check = document.createElement("input");
                    let label = document.createElement("label");

                    choice.classList.add("choice");
                    check.classList.add("check");
                    check.id=`check ${i+1}`;
                    check.value=tasks[i];
                    check.name=`check ${i+1}`;
                    check.type="checkbox";

                    label.setAttribute("for", check.id);
                    label.textContent = tasks[i];

                    choices_2.appendChild(choice);
                    choice.appendChild(check);
                    choice.appendChild(label);

                    choices_1.style.display = "grid";
                    choices_2.style.display = "grid";
                    loader.style.display = "none";
                }
            }
            catch(error) {
                console.log({error: error});
                setTimeout(() => alert("request is taking longer than expected, try refreshing this page"), 10000);
            }
            
        }
        await get_tasks()

        let checks = document.querySelectorAll("form .check");

        for (let i=0; i < checks.length; i++) {
            checks[i].addEventListener("click", (e) => {
                let task = e.target;
                // alert("you just checked a box");
                count.textContent = 0;
                for (let choice of checks) {
                    if (choice.checked === true) {
                        setBtn.disabled = false;
                        count.textContent = eval(Number(count.textContent) + 1);
                    }
                }

                if (count.textContent === "6") {
                    task.checked = false;
                    alert("You can only choose 5 of 20 tasks for now.");
                    count.textContent = eval(Number(count.textContent) - 1);
                }
                if (count.textContent === "0") {
                    setBtn.disabled = true;
                }
            });
        };
    };
});