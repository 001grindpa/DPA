document.addEventListener("DOMContentLoaded", async () => {
    if (document.body.id === "index") {
        const pageContent = document.querySelector(".content");
        const pageLoader = document.querySelector(".loadPage");
        let body = document.querySelector("body");
        const addressCont = document.querySelector("header .addressCont");
        const address = document.querySelector("header .addressCont .address");
        let sidebarCheck = body.querySelector("#checkBugger");
        let sideBar = body.querySelector("main .sideBar");
        const connectWallet = document.querySelector("header #connectWallet");
        let streakCheck = body.querySelector("main .sideBar .streak .checkImg");
        let closeSideBar = body.querySelector(".sideBar .streak img:nth-child(1)");
        let streakMonth = body.querySelector("main .sideBar .streak .month");
        let streakDay = body.querySelector("main .sideBar .streak .day");
        let streakCount = body.querySelector(".sideBar .streakCount .count span:nth-child(1)");
        let streakCountDay = body.querySelector(".sideBar .streakCount .count span:nth-child(2)");
        let form = document.querySelector("main form");
        let noTasksCont = document.querySelector("main .noTasks");
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
        let apiTime = document.querySelector(".countDown .apiTime");
        let countDownCont = document.querySelector(".timerCont");
        const cancelTasks = document.querySelector(".outerLtCont #LtCont button");
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
        const viewSelected = document.querySelector("main .timerCont .viewTasks");
        const viewSlide = document.querySelector("main .timerCont .viewTasks + div ul");

        //load page logic
        window.addEventListener("load", () => {
            pageLoader.style.display = "none";
            pageContent.style.display = "block";
        })

        // reset daily countdown session
        function resetDailyCountDown() {
            let currentHour = new Date().getHours();
            let startingHour = 20 - currentHour;
            let countDownEnd = Date.now() + (startingHour * (3600 * 1000));
            localStorage.setItem("countDownEnd", countDownEnd);
        }

        // reset UI after midnight
        function setMidnight() {
            if (!localStorage.getItem("midnight")) {
                const hr = new Date().getHours();
                const tillMidnight = 24 - hr;
                const midnight = Date.now() + (tillMidnight * 3600) * 1000;
                localStorage.setItem("midnight", midnight);
            } 
        }
        if (localStorage.getItem("midnight") <= Date.now()) {
            localStorage.removeItem("midnight");
            localStorage.removeItem('noTasks');
            localStorage.setItem("countDownEnd", "0");
            setTimeout(setMidnight, 3000);
        }

        console.log("midnight:", localStorage.getItem("midnight"), "now:", Date.now());

        // connect wallet
        let signer;
        let contract;

        const CONTRACT_ADDRESS = "0x1Fe3b83aCB54F15B5d6A0227D9Dd131F505f813E";
        const CONTRACT_ABI = [ 
        {
            "inputs":[{"internalType":"uint256","name":"day","type":"uint256"}],
            "name":"checkIn",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[{"internalType":"uint256","name":"day","type":"uint256"}],
            "name":"checkOut",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        }
        ];

        connectWallet.addEventListener("click", async () => {
            if (!window.ethereum) {
                return alert("Please install an EVM Wallet(MetaMask, OKX)!");
            }

            try {
                // 1. Request wallet connection
                await window.ethereum.request({ method: "eth_requestAccounts" });

                // 2. Switch to / ensure Base Sepolia network
                const chainId = "0x14a34"; // Base Sepolia chain ID (84532 in hex)
                try {
                    await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId }],
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        // Chain not added — add it
                        await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                            chainId: "0x14a34",
                            chainName: "Base Sepolia Testnet",
                            nativeCurrency: {
                                name: "ETH",
                                symbol: "ETH",
                                decimals: 18,
                            },
                            rpcUrls: ["https://sepolia.base.org"],
                            blockExplorerUrls: ["https://sepolia.basescan.org"],
                            },
                        ],
                        });
                    }
                }

                // 3. Get provider and signer
                const provider = new ethers.BrowserProvider(window.ethereum);
                signer = await provider.getSigner();
                const myAddress = await signer.getAddress();

                // 4. Create a clear sign-in message (this triggers MetaMask signature prompt)
                const message = `Sign in to DPA (daily Positive Action)\n\nWallet: ${myAddress}\nDate: ${new Date().toLocaleDateString()}\nNetwork: Base Sepolia`;

                // This line will pop up the MetaMask signature request
                await signer.signMessage(message);

                // 5. If we reach here → user successfully signed in
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                // store wallet signIn
                localStorage.setItem("walletSignedIn", "true");
                localStorage.setItem("userAddress", myAddress);  // optional, for UI

                // Update UI to show signed-in state
                connectWallet.style.display = "none";
                addressCont.style.display = "block";
                address.textContent = myAddress.substring(0, 6) + "..." + myAddress.substring(38);

                console.log("Signed in with:", myAddress);

                // Now your check-in button will work
                // (Make sure it uses the same `contract` instance with signer)

            }  catch (error) {
                console.error(error);

                if (error.code === 4001) {
                    // User explicitly rejected (either accounts or signature)
                    alert("You rejected the request. Please connect and sign to continue.");
                } else if (error.code === -32603) {
                    // Common during network switch issues
                    alert("Network switch failed. Please switch to Base Sepolia manually in MetaMask.");
                } else {
                    alert("Connection or sign-in failed. Check console for details.");
                }
            }
        });

        // auto signIn
        if (localStorage.getItem("walletSignedIn") === "true") {
            // Auto-reconnect provider and contract
            const provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            const myAddress = await signer.getAddress();

            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Update UI
            connectWallet.style.display = "none";
            addressCont.style.display = "block";
            address.textContent = myAddress.substring(0, 6) + "..." + myAddress.substring(38);

            console.log("Auto signed in:", myAddress);
        }

        // submit choosen tasks and on-chain checkIn(if wallet is connected)
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            setBtn.style.display="none";
            setLoader.style.display="block";

            // on-chain checkIn listener
            if (signer && contract) {
                try {
                    const day = new Date().getDate();
                    const tx = await contract.checkIn(day);
                    await tx.wait();
                    alert("Checked in! Tx: " + tx.hash);
                }
                catch (error) {
                    return console.log({checkIn_error: error});
                }
            }

            // remove the previous countdown deadlines when a new form is subitted
            localStorage.removeItem("Countdown");
            localStorage.removeItem("countDownEnd");
            if (localStorage.getItem("streakDeadline")) {
                localStorage.removeItem("streakDeadline");
            }
            streakCheck.style.display = "block";

            // implement a streak deadline
            const streakDeadline = Date.now() + (48 * 3600) * 1000;
            localStorage.setItem("streakDeadline", streakDeadline);
            resetDailyCountDown();
            console.log({streakExpires: localStorage.getItem("streakDeadline")})

            // stop tasks from reloading
            localStorage.setItem("noTasks", "true");

            // server side tasks storage
            const form_data = Object.fromEntries(new FormData(form));
            try {
                let r = await fetch("/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(form_data)
                })
                let data = await r.json();
                console.log(data.msg);
                
                setTimeout(() => {
                    setBtn.style.display="block";
                    setLoader.style.display="none";
                    alert("You've successfully setup your daily tasks");
                    countDownCont.style.display = "block";
                }, 2000);
            }
            catch(error) {
                console.log({error: error});
            }

            // get current streak
            if (localStorage.getItem("collectStreak") != "true") {
                try {
                    r2 = await fetch("/streak");
                    str = await r2.json();

                    streakCount.textContent = str.msg;
                    localStorage.setItem("currentStreak", str.msg);
                    localStorage.setItem("collectStreak", "true");
                    if (str.msg == 1) {
                        streakCountDay.textContent = "day";
                    }
                }
                catch(error) {
                    console.log({error: error});
                }
            }

            // get stored selected tasks
            try {
                let r3 = await fetch("/api/choosen_tasks")
                let data3 = await r3.json();
                console.log(data.msg);
                localStorage.setItem("selectedTasks", JSON.stringify(data3.msg));
                if ((data.msg).length != 0) {
                    countDownCont.style.display = "block";
                }
            }
            catch(error) {
                console.log({error: error});
            }

            const choosenTasks = JSON.parse(localStorage.getItem("selectedTasks"));
            for (let i=0; i<choosenTasks.length; i++) {
                let task = document.createElement("li");
                task.textContent = choosenTasks[i];
                viewSlide.appendChild(task);
            }
        });

        // cancel result container and on-chain checkout(if wallet is connected)
        cancel.addEventListener("click", async () => {
            if (signer && contract) {
                const day = new Date().getDate();
                const tx = await contract.checkOut(day);
                await tx.wait();
                alert("Checked out! Tx: " + tx.hash);
                localStorage.removeItem("collectStreak");
            }

            try {
                r = await fetch("/cancel")
                data = await r.json();
                console.log(data.msg);
                localStorage.removeItem("selectedTasks");
                location.reload();
            }
            catch(error) {
                console.log({error: error});
            }
        });

        //cancel tasks
        cancelTasks.addEventListener("click", async () => {
            try {
                r = await fetch("/cancel")
                data = await r.json();
                console.log(data.msg);
                localStorage.removeItem("selectedTasks");
                localStorage.setItem("Countdown", "false");
                localStorage.removeItem("noTasks");
                location.reload();
            }
            catch(error) {
                console.log({error: error});
            }
        })

        // close sideBar
        closeSideBar.addEventListener("click", () => {
            if (sidebarCheck.checked == true) {
                sidebarCheck.checked = false;
            }
        }) 

        // view selected tasks logic
        viewSelected.addEventListener("click", () => {
            if (viewSlide.classList.contains("slideOut")) {
                viewSlide.classList.remove("slideOut");
                viewSelected.textContent = "View selected tasks";
            }
            else {
                viewSlide.classList.add("slideOut");
                viewSelected.textContent = "Hide from view";
            }
        })
       
        const choosenTasks = JSON.parse(localStorage.getItem("selectedTasks")) //JSON.parse() converts str(primitive datatype) to obj
        if (choosenTasks) {
            // console.log(choosenTasks);
            
            for (let i=0; i<choosenTasks.length; i++) {
                let task = document.createElement("li");
                task.textContent = choosenTasks[i];
                viewSlide.appendChild(task);
            }
        }

        // streak date and check logic
        let month = new Date().toLocaleString('en-US', {month: 'short'});
        streakMonth.textContent = month;
        let day = new Date().getDate();
        streakDay.textContent = day;

        setBtn.disabled = true;

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
        // if document.cookie includes "countDown=false" remove timer
        if (localStorage.getItem("Countdown") != "false") {
            try {
                let r = await fetch("/api/choosen_tasks")
                let data = await r.json();
                console.log(data.msg);
                if ((data.msg).length != 0) {
                    countDownCont.style.display = "block";
                    body.style.overflow = "hidden";
                }
            }
            catch(error) {
                console.log({error: error});
            }
        } 
        else {
            body.style.overflow = "auto";
        }

        // display check symbol and disable form btn on page load if user already checked in

        if (localStorage.getItem("noTasks") == "true" || new Date().getHours() >= 20) {
                streakCheck.style.display = "block";
                setBtn.style.background = "gray";
                setBtn.disabled = true;
                form.style.display = "none";
                noTasksCont.style.display = "block";
            }

        // find and declare the currentStreak cookie value globally
        // let currentStreak = document.cookie.split("; ").find(c => c.startsWith("currentStreak="))?.split("=")[1];
        let currentStreak = localStorage.getItem("currentStreak");

        if (currentStreak) {
            streakCount.textContent = currentStreak;
            if (currentStreak == 1) {
                streakCountDay.textContent = "day";
            }
        }
        else {
            streakCount.textContent = "0";
        }
        // reset streak
        console.log({"streak expires in": localStorage.getItem("streakDeadline")})
        if (localStorage.getItem("streakDeadline")) {
            if (localStorage.getItem("streakDeadline") <= Date.now()) {
                try {
                    let r = await fetch("/clearStreak");
                    let data = await r.json();
                    console.log(data.msg)
                    alert("You've lost your active streak");
                    localStorage.removeItem("streakDeadline");
                    localStorage.removeItem("currentStreak");
                    streakCount.textContent = "0";
                }
                catch(error) {
                    console.log({error: error})
                }
            }
        }

        // countdown API call
        // const es = new EventSource("/countDown")

        // es.onmessage = (event) => {
        //     let data = JSON.parse(event.data);
        //     // console.log("Recived", data)
        //     apiTime.textContent = data;
        // };
        // es.onerror = () => {
        //     console.error("Connection lost");
        //     es.close();
        // }
        
        // countdown API call
        function updateCountdown() {
        const now = new Date();
        
        // Target: 8 PM today
        let target = new Date(now);
        target.setHours(20, 0, 0, 0);  // 20:00:00.000
        
        // If already past 8 PM, target tomorrow
        if (now > target) {
            target.setDate(target.getDate() + 1);
        }
        
        const diff = target - now;  // milliseconds until next 8 PM
        
        if (diff <= 0) {
            apiTime.innerText = '0hr 00min 00sec';
            return;
        }
        
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        const display = `${hrs}hr ${mins.toString().padStart(2, '0')}min ${secs.toString().padStart(2, '0')}sec`;
        apiTime.innerText = display;
        }

        // Update every second (very low overhead)
        setInterval(updateCountdown, 1000);

        // Initial update
        updateCountdown();

        // when countdown elapses
        console.log({futureTimeUnix: localStorage.getItem("countDownEnd")});
        console.log({currentTimeUnix: Date.now()});

        if (Number(localStorage.getItem("countDownEnd")) <= Date.now()) {
            localStorage.setItem("Countdown", "false");
            if (localStorage.getItem("Countdown") == "false") {
                countDownCont.style.display = "none";
            }
            if (taskTitle.textContent != '"No tasks available"') {
                checkoutCont.style.display = "block";
            }
        }

        //
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
                if (data.msg == "invalid server response") {
                    return alert(`${data.msg}, please refresh page`)
                }

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
        if (!localStorage.getItem("noTasks")) {
            await get_tasks();
        }

        let checks = document.querySelectorAll("form .check");

        for (let i=0; i < checks.length; i++) {
            checks[i].addEventListener("click", (e) => {
                let task = e.target;
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