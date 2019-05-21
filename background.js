// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBx9o8T9Sh_ckfoV_mZmzB7j5l-5G_J_hU",
  authDomain: "nvn2-f261a.firebaseapp.com",
  databaseURL: "https://nvn2-f261a.firebaseio.com",
  projectId: "nvn2-f261a",
  storageBucket: "nvn2-f261a.appspot.com",
  messagingSenderId: "819076290403",
  appId: "1:819076290403:web:c4954e15930e4caf"
  };
  const app = firebase.initializeApp(config);  
  const appDb = app.database().ref();

  function initApp() {
    // Listen for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
      console.log('User state change detected from the Background script of the Chrome Extension:', user);
      console.log(firebase.auth().currentUser)
    });
  }
  
  window.onload = function() {
    initApp();
  };

  const applicationState = { values: [] };

appDb.on('child_added', snapshot => {
  applicationState.values.push({
    id: snapshot.key,
    value: snapshot.val()
  });
  updateState(applicationState);
});

appDb.on('child_removed', snapshot => {
  const childPosition = getChildIndex(applicationState, snapshot.key)
  if (childPosition === -1) return
  applicationState.values.splice(childPosition, 1);
  updateState(applicationState);
});

appDb.on('child_changed', snapshot => {
  const childPosition = getChildIndex(applicationState, snapshot.key)
  if (childPosition === -1) return
  applicationState.values[childPosition] = snapshot.val();
  updateState(applicationState);
});

// updateState is a function that writes the changes to Chrome Storage
function updateState(applicationState) {
  chrome.storage.local.set({ state: JSON.stringify(applicationState) });
}

// getChildIndex will return the matching element in the object
function getChildIndex(appState, id) {
  return appState.values.findIndex(element => element.id == id)
}

// if your Chrome Extension requires any content scripts that will manipulate data,
// add a message listener here to access appDb:

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'updateValue':
      appDb.child(msg.opts.id).set({ value: msg.opts.value });
      response('success');
      break;
    default:
      response('unknown request');
      break;
  }
});