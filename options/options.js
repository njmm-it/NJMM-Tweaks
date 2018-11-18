function saveOptions(e) {
  //e.preventDefault();
  browser.storage.local.set({
    color: document.querySelector("#color").value,
    allImages: document.querySelector("#allImages").checked,
    videos: document.querySelector("#videos").checked,
    newsfeed: document.querySelector("#newsfeed").checked
  });
  document.querySelector("#savemessage").classList.toggle("savehidden");
  setTimeout(function(){document.querySelector("#savemessage").classList.toggle("savehidden");}, 3000);
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#color").value = result.color || "blue";

  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

//Load all the stuff.
    browser.storage.local.get("color").then(setCurrentChoice, onError);
    browser.storage.local.get("allImages").then(result => {document.querySelector("#allImages").checked = result.allImages || false;}, onError);
    browser.storage.local.get("videos").then(result => {document.querySelector("#videos").checked = result.videos || false;}, onError);
    browser.storage.local.get("newsfeed").then(result => {document.querySelector("#newsfeed").checked = result.newsfeed || false;}, onError);

/*
  var getting = browser.storage.local.get("color");
  getting.then(setCurrentChoice, onError);
  
*/
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

function addAllListenersThatSaveData(){
    /*if (document.querySelector("form") !== null){
        document.querySelector("form").addEventListener("submit", saveOptions);
        var elements = document.querySelectorAll("*");
        for (var j = 0;j<elements.length;j++){
            elements[j].addEventListener("change",saveOptions);
        }
    }*/
    
    //Is this the most hacky way of fixing the save? Yes. Yes it is. But it came after much prayer and contemplation. So we're going for it.
    //This will simply save the settings everytime an event listed in "eventList" is triggered.
    
    var eventList = ["click","paste","keyup","select","beforeunload"];
    for (var eve = 0; eve <eventList.length;eve++){
        document.addEventListener(eventList[eve],saveOptions);
    }
    
    
}
addAllListenersThatSaveData();
