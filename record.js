let checkBox = document.getElementById("record");
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

let timerTime = 0;
let interval;

const start = () => {
  isRunning = true;
  interval = setInterval(incrementTimer, 1000);
}

const stop = () => {
  isRunning = false;
  clearInterval(interval);
}

const reset = () => {
  minutes.innerText = '00';
  seconds.innerText = '00';
}

const pad = (number) => {
  return (number < 10) ? '0' + number : number;
}

const incrementTimer = () => {
  timerTime++;
  
  const numberMinutes = Math.floor(timerTime / 60);
  const numberSeconds = timerTime % 60;
  
  minutes.innerText = pad(numberMinutes);
  seconds.innerText = pad(numberSeconds);

  var progress_fill = document.getElementById("progress_fill");
  var increment = 1/60;
  pixel = increment * timerTime * 350;
  progress_fill.style.width = pixel+'px';
}

let time_desc = document.getElementsByClassName("small_font");
let timer_status = 0;
function timer() {
    if (timer_status == 0) {
        start();
        timer_status++;
        time_desc.innerText = "CLICK TO STOP RECORDING";
    } else {
        stop();
        timer_status--;
    }
}