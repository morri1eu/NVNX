console.log('NewsViews is Active')
  

var h3s = document.getElementsByTagName('a')
const arrayOfMetas = []
var arr = [...h3s];
  
// Next hook up this request emiter to send clicks to background.JS where we run fireStore.

const metas= document.getElementsByTagName('meta')
console.log(metas);
metaArray= [...metas]
console.log(metaArray)

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
}
console.log(arrayOfMetas)
});

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
const title= extractMetaContent('twitter:title');
const synopsis= extractMetaContent('twitter:description');
const image= extractMetaContent('twitter:image');
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


window.onload= async function(){
  let story = await getRequestObject()
  console.log(story)
  chrome.runtime.sendMessage({type: 'updateValue', opts: story }, (response) => {
    if(response == 'success') {
      }
    }
  )
  
};




