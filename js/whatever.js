
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
  //console.log(firebase)

var h3s = document.getElementsByTagName('a')
const arrayOfTitles = []
var arr = [...h3s];
arr.forEach(title => {
    title.addEventListener('mousedown', () => {
        arrayOfTitles.push(title.innerHTML)
        console.log(arrayOfTitles)
    })
});
