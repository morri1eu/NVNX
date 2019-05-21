
console.log('NewsViews is Active')

  console.log(firebase)
  
var h3s = document.getElementsByTagName('a')
const arrayOfTitles = []
var arr = [...h3s];

//const user= firebase.auth().currentUser
//console.log(user)
arr.forEach(title => {
    title.addEventListener('mousedown', () => {
        arrayOfTitles.push(title.innerHTML)
        console.log(arrayOfTitles)
        console.log(arr)
    })
});
