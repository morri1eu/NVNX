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
  const appDb = app.database();

  let userID
  function initApp() {
    // Listen for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        userID= user.uid
      }
      else if (firebase.auth().currentUser){
        userID= firebase.auth().currentUser.uid
      }
      else {
        userID= 'Unregistered User'
      }
      console.log('User state change detected from the Background script of the Chrome Extension:', user);
      console.log(firebase.auth().currentUser)
    });
  }
  
  window.onload = function() {
    initApp();
  };

  const applicationState = { values: [] };

appDb.ref().on('child_added', snapshot => {
  applicationState.values.push({
    id: snapshot.key,
    value: snapshot.val()
  });
  updateState(applicationState);
});

appDb.ref().on('child_removed', snapshot => {
  const childPosition = getChildIndex(applicationState, snapshot.key)
  if (childPosition === -1) return
  applicationState.values.splice(childPosition, 1);
  updateState(applicationState);
});

appDb.ref().on('child_changed', snapshot => {
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


async function checking(ref, userID){
  return appDb.ref(ref).once('value')
  .then(snapshot=> {
    if(snapshot.val()){
      if(snapshot.val().userIDs){
        const arrayOfUsers= Object.values(snapshot.val().userIDs) || [snapshot.val().userIDs]
        console.log(arrayOfUsers)
        if (arrayOfUsers.some((userIDFromArray)=> userIDFromArray=== userID)){
          return null
        }
  }
    return true
  }
    return false
    })
}

// if your Chrome Extension requires any content scripts that will manipulate data,
// add a message listener here to access appDb:

chrome.runtime.onMessage.addListener(async(msg, sender, response) => {
      
    
    if (firebase.auth().currentUser){
      switch (msg.type) {
        case 'updateValue':
        msg.opts.value= {
      ...msg.opts.value,
      }
      let image= btoa(msg.opts.value.sourceUrl)
    let ref= msg.opts.id+'/'+image
    let checkForDuplicate

          console.log(checkForDuplicate)
          console.log(await this.checking(ref,userID))
          if ((await checking(ref, userID))){
            console.log('here4')
            appDb.ref(ref+'/userIDs').push(userID)
          }
          else if( await checking(ref,userID)=== null){
          }
          else{
            console.log('here3')
          appDb.ref(ref).set( msg.opts.value );
          appDb.ref(ref+'/userIDs').push(userID)
          response('success');
          }
          break;
        default:
          response('unknown request');
          break;
      }
  }
  else {
    switch (msg.type) {
      case 'updateValue':
      msg.opts.value= {
        ...msg.opts.value,
        }
        let image= btoa(msg.opts.value.sourceUrl)
      let ref= msg.opts.id+'/'+image
      let checkForDuplicate
  
      console.log(await checking(ref,userID))
        if ((await checking(ref,userID))){
          console.log('here2')
          appDb.ref(ref+'/userIDs').push(userID)
        }
        else if( await checking(ref,userID)=== null){
        }
        else{
        appDb.ref(ref).set( msg.opts.value );
        appDb.ref(ref+'/userIDs').push(userID)
        console.log('here')
        }
        response('success');
        break;
      case 'unauthorizedUser':
        window.open('https://2z9kl.codesandbox.io/')
      default:
        response('unknown request Background');
        break;
    }
  }
  
});
const auth = {
  API_KEY:'9PrhJ4dfKcUxNDdG8WVMn7egV',
  API_SECRET:'1KPE2kcQrSy4ThSWsHJwiXICNYaJwxSfZDFdkYEd3NzIk8juQD',
  ACCESS_TOKEN:'774784401775493124-Mao2KdFpHCq6BPCQ9jPflH8uhFwHvcS',
  ACCESS_SECRET:'RpUCr1cvvLG4Sj9UToZUQA0EIV3Zza47JNkq5g1djlIPH'}

let encodedAPI= encodeURIComponent(auth.API_KEY)
let encodedSecret= encodeURIComponent(auth.API_SECRET)

let baseEncoded= btoa(encodedAPI+':'+encodedSecret)


/* getBearerToken() */

function getBearerToken(){
  let xmlHttp = new XMLHttpRequest();
  let theUrl ='https://api.twitter.com/oauth2/token'
  console.log(baseEncoded)
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var myArr = JSON.parse(this.responseText);
        console.log(myArr)
        //myFunction(myArr);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Authorization','Basic '+baseEncoded)
    xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8')
    xmlHttp.setRequestHeader('grant_type','client_credentials')
    xmlHttp.send(null);
}
function myFunction(arr) {
  var out = "";
  var i;
  for(i = 0; i < arr.length; i++) {
      out += '<a href="' + arr[i].url + '">' + 
      arr[i].display + '</a><br>';
  }
  document.getElementById("id01").innerHTML = out;
}

function getTweets(authorName){
  //console.log(Config.API_KEY)
  let xmlHttp = new XMLHttpRequest();
  let theUrl ='https://api.twitter.com/1.1/users/lookup.json?q='+ authorName.replace(' ','_')
  console.log(theUrl)
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var myArr = JSON.parse(this.responseText);
        console.log(myArr)
        myFunction(myArr);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
