let checkBox = document.getElementById("record");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
let time_desc = document.getElementsByClassName("small_font")[0];
let error = document.getElementsByClassName("error_msg")[0];
let label = document.getElementById("label");

let timerTime = 0;
let timer_status = 0;
let interval;

let audioBlob = undefined;

const recordAudio = () =>
    new Promise(async(resolve) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
        });

        let start = () => {
            mediaRecorder.start();
            interval = setInterval(incrementTimer, 1000);
            error.style.display = "none";
            timer();
        };

        const stop = () =>
            new Promise((resolve) => {
                mediaRecorder.addEventListener("stop", () => {
                    audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioBlob, audioUrl, play });
                    console.log(audioUrl);
                });
                mediaRecorder.stop();
                timer();
                timer_status = 0;
                clearInterval(interval);
                time_desc.innerText = "CLICK TO RE-RECORD OR YOU CAN SUBMIT BELOW";
            });

        resolve({ start, stop });
    });

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let isRunning = false;
let recorder;
let audio;

const handleAction = async() => {
    if (!isRunning) {
        recorder = await recordAudio();
        label.disabled = true;
        recorder.start();
        isRunning = true;
    } else {
        audio = await recorder.stop();
        label.disabled = false;
        isRunning = false;
        timerTime = 0;
        reset();
    }
};

label.addEventListener("click", handleAction);

forceStop = () => {
    handleAction();
    reset();
    error.style.display = "block";
    time_desc.innerText = "CLICK TO RE-RECORD";
};

const reset = () => {
    minutes.innerText = "00";
    seconds.innerText = "00";
    var progress_fill = document.getElementById("progress_fill");
    progress_fill.style.width = "0px";
};

const pad = (number) => {
    return number < 10 ? "0" + number : number;
};

const incrementTimer = () => {
    timerTime++;

    if (timerTime > 60) {
        forceStop();
        timerTime = 0;
        timer_status = 0;
    }

    const numberMinutes = Math.floor(timerTime / 60);
    const numberSeconds = timerTime % 60;

    minutes.innerText = pad(numberMinutes);
    seconds.innerText = pad(numberSeconds);

    var progress_fill = document.getElementById("progress_fill");
    var increment = 1 / 60;
    pixel = increment * timerTime * 350;
    progress_fill.style.width = pixel + "px";
};

function timer() {
    if (timer_status == 0) {
        time_desc.innerText = "CLICK TO STOP THE RECORDING";
        timer_status++;
    } else {
        timer_status--;
    }
}

async function sendBlob() {

    const formData = new FormData();
    const filename = "sound-file-" + new Date().getTime() + ".wav";
    console.log(filename);
    formData.append("audio_data", audioBlob, filename);
    console.log(formData);
    // let request = new XMLHttpRequest();
    // request.open("POST", "http://localhost:3000/uploadVoiceClip");
    // request.send(audioBlob);
    // data.append('test', 'brian');
    // await fetch(`http://localhost:3000/uploadVoiceClip`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: "hi" });
    document.getElementsByTagName("main")[0].innerHTML = `<h2>Hang tight</h2> 
    <p>Your contract is being generated</p>
    <div class="loader"><span></span></div>`;

    fetch('/uploadVoiceClip', { method: 'post', body: formData })
        .then(r => r.json())
        .then(r => {
            window.location = r.redirect;
        });

    // window.location.href = `/contract?${res.};
    // axios.post('http://localhost:3000/uploadVoiceClip', data);
}