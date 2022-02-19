let checkBox = document.getElementById("record");
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
let time_desc = document.getElementsByClassName("small_font");

let timerTime = 58;
// change timerTime later
let interval;

const start = () => {
    isRunning = true;
    interval = setInterval(incrementTimer, 1000);
    let error = document.getElementsByClassName("error_msg");
    error[0].style.display = "none";
}

const stop = () => {
    isRunning = false;
    clearInterval(interval);
    time_desc[0].innerText = "CLICK TO CONTINUE YOUR RECORDING OR YOU CAN SUBMIT BELOW"
}

const forceStop = () => {
    stop();
    reset();
    let error = document.getElementsByClassName("error_msg");
    error[0].style.display = "block";
    let label = document.getElementById("label");
    label.click();
    time_desc[0].innerText = "CLICK TO RE-RECORD";
}

const reset = () => {
    minutes.innerText = '00';
    seconds.innerText = '00';
    var progress_fill = document.getElementById("progress_fill");
    progress_fill.style.width = '0px';
}

const pad = (number) => {
    return (number < 10) ? '0' + number : number;
}

let timer_status = 0;
const incrementTimer = () => {
    timerTime++;

    if (timerTime > 60) {
        forceStop();
        timerTime = 58;
        // change timerTime later
        timer_status = 0;
    }

    const numberMinutes = Math.floor(timerTime / 60);
    const numberSeconds = timerTime % 60;
  
    minutes.innerText = pad(numberMinutes);
    seconds.innerText = pad(numberSeconds);

    var progress_fill = document.getElementById("progress_fill");
    var increment = 1/60;
    pixel = increment * timerTime * 350;
    progress_fill.style.width = pixel+'px';
}

function timer() {
    if (timer_status == 0) {
        start();
        time_desc[0].innerText = "CLICK TO STOP THE RECORDING";
        timer_status++;
        console.log("start");
    } else {
        stop();
        timer_status--;
        console.log("stop");
    }
}