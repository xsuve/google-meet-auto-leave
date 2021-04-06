console.log('Google Meet Auto Leave');

let membersCountClass = 'wnPUne', // N0PJ8e
    leaveMeetBtnClass = 'FbBiwc'; // FbBiwc

let obj = {};
var t = null;
var minute;
var sec;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.message === 'startBtnClicked') {
    obj = request.object;
    if(t != null) {
      clearTimeout(t);
      t = null;
    }

    if(obj.type == 'time') {
      timeAction();
      console.log('Time action started.');
    } else if(obj.type == 'number') {
      if(obj.action == 'members') {
        try {
          membersAction();
          console.log('Members action started.');
        } catch {
          console.log('Could not start members action.');
        }
      } else if(obj.action == 'minutes') {
        minute = obj.value;
        sec = 01;
        minutesAction();
        console.log('Minutes action started.');
      }
    }
  }

  if(request.message == 'stopBtnClicked') {
    clearTimeout(t);
    t = null;
  }
});


// Leave Meet
function leaveMeet() {
  console.log('Leave Google Meet');
  try {
    window.document.querySelector('.' + leaveMeetBtnClass).click();

    chrome.runtime.sendMessage({ 'message': 'meetLeft' });
  } catch(error) {
    console.log('Could not leave Meet.', error);
  }
}


// Time Action
function timeAction() {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  let time = hours + ':' + minutes;

  if(time == obj.value) {
    leaveMeet();
  } else {
    t = setTimeout(timeAction, 60000);
  }
}

// Members Action
function membersAction() {
  if(document.querySelector('.' + membersCountClass).innerText <= obj.value) {
    leaveMeet();
  } else {
    t = setTimeout(membersAction, 5000);
  }
}

// Minutes Action
function minutesAction() {
  sec--;
  if(sec == 00) {
    minute--;
    sec = 60;
  }

  if(minute >= 0) {
    t = setTimeout(minutesAction, 1000);
  } else {
    leaveMeet();
  }
}
