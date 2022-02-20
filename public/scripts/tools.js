let inputs = document.getElementsByTagName("input");

function enable() {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].disabled == true) {
            inputs[i].disabled = false;
            inputs[i].style.backgroundColor = "rgba(251, 251, 251, 1)";
        }
        //     else {
        //         inputs[i].disabled = true;
        //     }
    }
}

var modal = document.getElementById("modal");
var noBtn = document.getElementById("no");
var yesBtn = document.getElementById("yes");
var submit = document.getElementById("submitBtn");

submit.onclick = function() {
    console.log("test");
    modal.style.display = "block";
}

noBtn.onclick = function() {
    modal.style.display = "none";
}

yesBtn.onclick = function() {
    document.getElementById("loanForm").submit();
}