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