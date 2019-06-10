console.log('NewsViews is Active')
  

var h3s = document.getElementsByTagName('a')
const arrayOfMetas = []
var arr = [...h3s];

// Separate this array into array of subjects and array of contexts 
// take one of each and send that to crdentials.js 
const arrayOfTerms =['Trump',
'Pelosi',
'Democrat',
'Campaign',
'Candidate',
'Citizen',
'Bill',
'Debate',
'Election',
'Elect',
'G.O.P',
'House',
'Senate',
'Majority',
'Military',
'Minority',
'Minorities',
'Partisan',
'Party',
'Precinct',
'President',
'Politicize',
'Delagate',
'Demagouge',
'Filibuster',
'Economy',
'Tarrif',
'Right',
'Pompeo',
'Trade',
'War',
'Minister',
'Vice',
'Barr',
'Mueller',
'General',
'Rep',
'Senator',
'Wage',
'Secretary',
]

// use this array check synop for terms save in user collection
// Next hook up this request emiter to send clicks to background.JS where we run fireStore.

const metas= document.getElementsByTagName('meta')
console.log(metas);
metaArray= [...metas]
console.log(metaArray)

metaArray.forEach(meta =>{
  if (meta.name.includes('og:type') && meta.content=== 'article'){
    setArrayMetas()
    console.log(meta.content)
  }else if (meta.attributes.property && meta.attributes.property.value.includes('og:type') && meta.content==='article'){
    setArrayMetas()
    console.log(meta.attributes.property.value)
  }
})

function setArrayMetas (){
  metaArray.forEach(title => {
if (title.name.includes('twitter')){
  let item= {
    content: title.content,
    name: title.name,
    baseURI: title.baseURI
  };
  arrayOfMetas.push(item)
}
 else if ( title.attributes.property && title.attributes.property.value.includes('twitter')){
   console.log('here')
  let item= {
    content: title.content,
    name: title.attributes.property.value,
    baseURI: title.baseURI
  }
  arrayOfMetas.push(item)
  ;
}else if(title.name.includes('author')){
    let item={
      content:title.content,
      name: title.name
  }
  arrayOfMetas.push(item)
}else if(title.name.includes('og')){
  let item={
    content:title.content,
    name:title.name
  }
  arrayOfMetas.push(item)
}else if (title.attributes.property && title.attributes.property.value.includes('og')){
  let item={
    content:title.content,
    name:title.attributes.property.value,
  }
  arrayOfMetas.push(item)
}
console.log(arrayOfMetas)
});
}
//getTweets(extractMetaContent('author'))

function extractMetaContent(name){
let value
arrayOfMetas.forEach(meta => {
  if (meta.name.includes(name)){
    console.log(meta.content)
    value= meta.content
    }
})
return value
}

function getRequestObject(){
const title= extractMetaContent('twitter:title') || extractMetaContent('og:title');
const synopsis= extractMetaContent('twitter:description') || extractMetaContent('og:type');
const image= extractMetaContent('twitter:image') || extractMetaContent('og:image');
const author = extractMetaContent('author')

console.log( title, synopsis, image)
return request= {
  id: 'Stories',
  value: { 
    affiliation: 'Strong Left',
    author: author || '',
    sourceTitle: title,
    synopsis: synopsis,
    image: image ,
    sourceUrl: window.location.href,
    headline: title,
  },
}
}

function checkForKeyTerms (synopsis) {
  const arraySynopsis = synopsis.split(' ')
  const keywords = []
  arrayOfTerms.forEach(term => {
    if (arraySynopsis.includes(term)) {
      keywords.push(term)
    }
  })
  return keywords
}


window.onload= async function(){
  let story = await getRequestObject()
  console.log(story)
  if(story.value.synopsis){
  chrome.runtime.sendMessage({type: 'updateValue', opts: story }, (response) => {
    if(response == 'success') {
      }
    }
  )
  const keywords =  checkForKeyTerms(story.value.synopsis)
  
  if (keywords.length > 0){
    chrome.runtime.sendMessage({type: 'keywordsDetected', opts: keywords}, response => {
      if (response == 'success') {
        console.log('keywords', keywords, 'sent')
      }else{
        console.log(response)
      }
    })
  }
    
};
if (window.location.href === 'https://9drft.codesandbox.io/login'){

  document.addEventListener('mousedown', function(){
  const button = document.getElementsByName('login');

  
  console.log(button.length)
  
  //const buttons= Array.from(nodeList)

  var email = document.getElementsByName('email')
  var password = document.getElementsByName('password')

  console.log(button, email, password)

  let username
  for(var entry of email.entries()) { 
    console.log(entry); 
    username= entry[1].value
  }
  let auth
  for(var entry of password.entries()) { 
    console.log(entry); 
    auth= entry[1].value
  }

  button.forEach(element => {
    console.log(element)
    element.addEventListener("mouseup", function(){
    chrome.runtime.sendMessage({type:'login', opts:{username,auth}}, (response) =>{
      if( response == 'success'){
        console.log(response)
      }else{
        console.log(response)
      }
    } )
  })
})
}
  )}}





