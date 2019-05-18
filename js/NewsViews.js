
console.log('NewsViews is Active')
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyC3YCd9P7P-tOlWnBkmEEQX5OrylTwAY1g",
    authDomain: "nvn2-f261a.firebaseapp.com",
    databaseURL: "https://nvn2-f261a.firebaseio.com",
    projectId: "nvn2-f261a",
    storageBucket: "nvn2-f261a.appspot.com",
    messagingSenderId: "819076290403",
    appId: "1:819076290403:web:c4954e15930e4caf"
  };
  // Initialize Firebase
  console.log('Initializing firebase')
  firebase.initializeApp(firebaseConfig);
  console.log(firebase)

  function initApp() {
    // Listen for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
      console.log('User state change detected from the Background script of the Chrome Extension:', user);
      console.log(firebase)
    });
  }
  
  window.onload = function() {
    initApp();
  };
//document.body.style.value= "5px solid red"
