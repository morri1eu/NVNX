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
  firebase.initializeApp(config);
   
  var news= {apiKey: '5573b7a235654d248bf3d502bd3417e6'}
  /**
   * initApp handles setting up the Firebase context and registering
   * callbacks for the auth status.
   *
   * The core initialization is in firebase.App - this is the glue class
   * which stores configuration. We provide an app name here to allow
   * distinguishing multiple app instances.
   *
   * This method also registers a listener with firebase.auth().onAuthStateChanged.
   * This listener is called when the user is signed in or out, and that
   * is where we update the UI.
   *
   * When signed in, we also authenticate to the Firebase Realtime Database.
   */
  let leftDeck
  let rightDeck
  function initApp() {

    console.log('inside credentials initApp')
    let keywords= []
    chrome.storage.local.get(['keywords'], (result) => {
      console.log(result.keywords)
      keywords= result.keywords
    })
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('here')
        if(keywords && keywords.length > 0){
          const newsQueryParam = keywords.toString().replace(',', ' ')
          getLeftKeywordArticles(newsQueryParam)
          getRightKeywordArticles(newsQueryParam)
        }else{
        getStandardRightArticles()
        getStandardLeftArticles()
        }
        // User is signed in.
        console.log(user)
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // [START_EXCLUDE]
        //document.getElementsByClassName('login').textContent = 'Sign out'
        document.getElementById('hello-user').textContent = 'hello '+ email;
        document.getElementById('hello-user').addEventListener('mouseover',()=>{
          //shuffleDeck(leftDeck, rightDeck)
        })
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        // [END_EXCLUDE]
      } else {
        window.open('https://9drft.codesandbox.io/login')
        document.getElementById('quickstart-button').textContent = 'Sign-in';
        document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-account-details').textContent = 'null';
      
      }
    });
    };
  
  
  /**
   * Start the auth flow and authorizes to Firebase.
   * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
   */
  function startAuth(interactive) {
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
      if (chrome.runtime.lastError && !interactive) {
        console.log('It was not possible to get a token programmatically.');
      } else if(chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else if (token) {
        // Authorize Firebase with the OAuth Access Token.
        var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
        firebase.auth().signInWithCredential(credential).catch(function(error) {
          // The OAuth token might have been invalidated. Lets' remove it from cache.
          if (error.code === 'auth/invalid-credential') {
            chrome.identity.removeCachedAuthToken({token: token}, function() {
              startAuth(interactive);
            });
          }
        });
      } else {
        console.error('The OAuth Token was null');
      }
    });
  }
  

  chrome.runtime.onMessage.addListener(async(msg, sender, response) => {
      switch (msg.type){
        case 'keywordsDetected':
          alert('in credentials.js', msg.opts)
          response('in credentials.js')
          break;
        default:
          response('default case')
        break;
  }})
  /**
   * Starts the sign-in process.
   */
  function startSignIn() {
    document.getElementById('quickstart-button').disabled = true;
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    } else {
      startAuth(true);
    }
  }

  function emailPassLogin(email, password){
    if (firebase.auth().currentUser) {
      return firebase.auth().signOut();
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(response => {
      alert('Sign-In Successful')
      chrome.runtime.sendMessage({type: 'updateValue', opts: request.opts}, (response) => {
        if(response == 'success') {
          // implement success action here
          alert('sent to app state')
        }
      });
    })
    .catch(function(error) {
      alert(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });;
  })
    
  }

  function getStandardLeftArticles(index){
  let xmlHttp = new XMLHttpRequest();
  let theUrl ='https://newsapi.org/v2/top-headlines?sources=abc-news&apiKey='+news.apiKey
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp)
        var leftArr = JSON.parse(this.responseText);
        console.log(leftArr)
        createAndHandleArticleCards(leftArr, index,'left');
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
function createAndHandleArticleCards(arr, index= 0, side) {
  console.log(arr)
  
  var i;
  const arrayOfArticleCards= []
  for(i = 0; i < arr.articles.length; i++) {
    let cardContainer= document.createElement('div')
    cardContainer.setAttribute('id', 'left')
    let cardLink = document.createElement('a')
    cardLink.setAttribute('href', arr.articles[i].url)
    let cardImage = document.createElement("img")
    cardImage.setAttribute('src', arr.articles[i].urlToImage)
    let cardHeadline = document.createElement('h6')
    cardHeadline.innerText = arr.articles[i].title
    let cardAuthor = document.createElement('h7')
    cardAuthor.innerText = arr.articles[i].author
    let cardSource = document.createElement('h7')
    cardSource.innerHTML = arr.articles[i].source.name
    cardLink.append(cardContainer)
    cardContainer.append(cardImage)
    cardContainer.append(cardHeadline)
    cardContainer.append(cardAuthor)
    cardContainer.append(cardSource)
    cardLink.addEventListener('click', ()=> window.open(cardLink.getAttribute('href')))
    arrayOfArticleCards.push(cardLink)
    console.log(cardContainer)
  }
  console.log(side)
  var item = document.getElementById(side).childNodes[0]
  document.getElementById(side).replaceChild(arrayOfArticleCards[index], item);
  switch (side) {
    case 'right':
      rightDeck = arrayOfArticleCards
      break;
    case 'left':
      leftDeck = arrayOfArticleCards 
      break;
    default:
    break;
  }
}
function getStandardRightArticles(index){
  let xmlHttp = new XMLHttpRequest();
  let theUrl ='https://newsapi.org/v2/top-headlines?sources=fox-news&apiKey='+news.apiKey
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp)
        var rightArr = JSON.parse(this.responseText);
        console.log(rightArr)
        createAndHandleArticleCards(rightArr, index,'right');
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
window.onload = function() {
  initApp();
  console.log('credentials on load')
}

function shuffleDeck(leftDeck, rightDeck){
  console.log(leftDeck)
  console.log(rightDeck)
  const index= Math.floor(Math.random()*10) + 1
  var leftNode = document.getElementById('left').childNodes[0]
  document.getElementById('left').replaceChild(leftDeck[index], leftNode);
  var rightNode = document.getElementById('right').childNodes[0]
  document.getElementById('right').replaceChild(rightDeck[index], rightNode);
}

function getLeftKeywordArticles(query, index){
  let xmlHttp = new XMLHttpRequest();
  let theUrl ='https://newsapi.org/v2/top-headlines?sources=cnn&q='+ query+ '&apiKey='+news.apiKey
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp)
        var leftKeywordArticles = JSON.parse(this.responseText);
        console.log(leftKeywordArticles)
        createAndHandleArticleCards(leftKeywordArticles, index,'left');
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}

function getRightKeywordArticles(query, index){
  let xmlHttp = new XMLHttpRequest();
  let theUrl ='https://newsapi.org/v2/top-headlines?sources=fox-news&q='+ query+ '&apiKey='+news.apiKey
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp)
        var rightKeywordArticles = JSON.parse(this.responseText);
        console.log(rightKeywordArticles)
        createAndHandleArticleCards(rightKeywordArticles, index,'right');
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}