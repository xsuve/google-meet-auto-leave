// Check Meet Leave
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.message === 'meetLeft') {
    localStorage.setItem('gmal_background', 'not_running');
    localStorage.setItem('gmal_background_value', '');
  }
});


// Set Status
function setStatus(status) {
  if(status == 'running') {
    document.querySelector('.status').style.backgroundColor = '#8bd490';
    document.querySelector('.status').innerHTML = 'Action running.';
    document.querySelector('#input').disabled = true;
  } else if(status == 'not_running') {
    document.querySelector('.status').style.backgroundColor = '#888';
    document.querySelector('.status').innerHTML = 'No action running.';
    document.querySelector('#input').value = '';
  } else if(status == 'error') {
    document.querySelector('.status').style.backgroundColor = '#cb533d';
    document.querySelector('.status').innerHTML = 'Input value required.';
  }
}

// Toggle Tab
function toggleTab(tab) {
  if(tab == 'time') {
    document.querySelector('#timeBtn').classList.add('active');
    document.querySelector('#membersBtn').classList.remove('active');
    document.querySelector('#minutesBtn').classList.remove('active');
  } else if(tab == 'members') {
    document.querySelector('#timeBtn').classList.remove('active');
    document.querySelector('#membersBtn').classList.add('active');
    document.querySelector('#minutesBtn').classList.remove('active');
  } else if(tab == 'minutes') {
    document.querySelector('#timeBtn').classList.remove('active');
    document.querySelector('#membersBtn').classList.remove('active');
    document.querySelector('#minutesBtn').classList.add('active');
  }
}

// Check Running Action in Background
function checkRunningAction() {
  let gmal_background = localStorage.getItem('gmal_background');

  if(gmal_background == 'running') {
    document.querySelector('#input').disabled = true;
    document.querySelector('#startBtn').disabled = true;
    document.querySelector('#stopBtn').disabled = false;

    setStatus('running');
  } else if(gmal_background == 'not_running') {
    document.querySelector('#input').disabled = false;
    document.querySelector('#input').value = '';
    document.querySelector('#stopBtn').disabled = true;
    document.querySelector('#startBtn').disabled = false;

    setStatus('not_running');
  }
}
checkRunningAction();


// Tab Buttons
document.querySelector('#timeBtn').addEventListener('click', () => {
  checkRunningAction();
  document.querySelector('#input').setAttribute('type', 'time');
  document.querySelector('#input').setAttribute('data-action', 'time');
  document.querySelector('#input').setAttribute('placeholder', 'Leave when time is x');
  toggleTab('time');
});
document.querySelector('#membersBtn').addEventListener('click', () => {
  checkRunningAction();
  document.querySelector('#input').setAttribute('type', 'number');
  document.querySelector('#input').setAttribute('data-action', 'members');
  document.querySelector('#input').setAttribute('placeholder', 'Leave when x members');
  toggleTab('members');
})
document.querySelector('#minutesBtn').addEventListener('click', () => {
  checkRunningAction();
  document.querySelector('#input').setAttribute('type', 'number');
  document.querySelector('#input').setAttribute('data-action', 'minutes');
  document.querySelector('#input').setAttribute('placeholder', 'Leave in x minutes');
  toggleTab('minutes');
})


// Start / Stop Buttons
document.querySelector('#startBtn').addEventListener('click', () => {
  let obj = {
    type: document.querySelector('#input').getAttribute('type'),
    value: document.querySelector('#input').value,
    action: document.querySelector('#input').getAttribute('data-action')
  };

  if(obj.value != '') {
    if(obj.value.length < 0) {
      setStatus('error');
      setTimeout(() => {
        setStatus('not_running');
      }, 2000);
    } else {
      localStorage.setItem('gmal_background', 'running');
      localStorage.setItem('gmal_background_value', obj.value);

      document.querySelector('#input').disabled = true;
      document.querySelector('#startBtn').disabled = true;
      document.querySelector('#stopBtn').disabled = false;

      setStatus('running');

      chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { 'message': 'startBtnClicked', 'object': obj });
      });
    }
  } else {
    setStatus('error');
    setTimeout(() => {
      setStatus('not_running');
    }, 2000);
  }
});

document.querySelector('#stopBtn').addEventListener('click', () => {
  localStorage.setItem('gmal_background', 'not_running');

  document.querySelector('#input').disabled = false;
  document.querySelector('#input').value = '';
  document.querySelector('#stopBtn').disabled = true;
  document.querySelector('#startBtn').disabled = false;

  setStatus('not_running');

  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { 'message': 'stopBtnClicked' });
  });
});
