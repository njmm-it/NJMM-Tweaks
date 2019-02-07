/*==========================
NAME: saveOptions(e)
INPUTS: Event e is an event that is listened for by an EventListener
OUTPUTS: void
DESCRIPTION: "saveOptions(e)" saves the value of all configuration settings to the browser storage and then flashes a "Saved." message
==========================*/
function saveOptions(e) {
  //e.preventDefault();
  //Set all of the keys and their values to the browser storage. See the Mozilla Developer Network to see how the APIs work.
  browser.storage.local.set({
    color: document.querySelector("#color").value,
    allImages: document.querySelector("#allImages").checked,
    videos: document.querySelector("#videos").checked,
    newsfeed: document.querySelector("#newsfeed").checked,
    maxpresses: document.querySelector("#maxpresses").value,
    minwait: document.querySelector("#minwait").value,
    maxwait: document.querySelector("#maxwait").value
  });
  //Change the "Saved." message so that it is visible for a moment, so that it is clear that it was saved.
  document.querySelector("#savemessage").classList.toggle("savehidden");
  //Then we hide it again after a moment.
  setTimeout(function(){document.querySelector("#savemessage").classList.toggle("savehidden");}, 3000);

}
/*==========================
NAME: restoreOptions()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "restoreOptions()" checks all of the configuration settings that are saved to browser storage and loads the page to reflect them.
==========================*/
function restoreOptions() {

	/*==========================
	NAME: onError
	INPUTS: Error error that is the error that is fed by a Promise.
	OUTPUTS: void
	DESCRIPTION: "onError(error)" outputs error to the console.
	==========================*/
	function onError(error) {
    	console.log(`Error: ${error}`);
  	}
	//Load all the stuff into the corresponding UI box.
	//browser.storage.local.get returns a Promise that resolves with an object representing the value or rejects with an error.
	//Each of these functions is an arrow function (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
    browser.storage.local.get("color").then(result => {document.querySelector("#color").value = result.color || "blue";}, onError);
    browser.storage.local.get("maxpresses").then(result => {document.querySelector("#maxpresses").value = result.maxpresses || "100";}, onError);
    browser.storage.local.get("minwait").then(result => {document.querySelector("#minwait").value = result.minwait || "4000";}, onError);
    browser.storage.local.get("maxwait").then(result => {document.querySelector("#maxwait").value = result.maxwait || "8000";}, onError);
    browser.storage.local.get("newsfeed").then(result => {document.querySelector("#newsfeed").checked = result.newsfeed || false;}, onError);
    browser.storage.local.get("allImages").then(result => {document.querySelector("#allImages").checked = result.allImages || false;}, onError);
    browser.storage.local.get("videos").then(result => {document.querySelector("#videos").checked = result.videos || false;}, onError);
}

/*==========================
NAME: addAllListenersThatSaveData()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "addAllListenersThatSaveData()" adds an EventListener for every desired type (declared internally as var eventList) and 
	then saves the page when said event is triggered. This ensures that the page auto-saves on every change.
==========================*/
function addAllListenersThatSaveData(){ 
    //Is this the most hacky way of fixing the save? Yes. Yes it is. But it came after much prayer and contemplation. So we're going for it.
    //This will simply save the settings everytime an event listed in "eventList" is triggered.
    document.getElementbyId("savebutton").addEventListener("click",saveOptions);
    var eventList = ["click","paste","keyup","select","beforeunload","submit"];
    for (var eve = 0; eve <eventList.length;eve++){
        document.addEventListener(eventList[eve],saveOptions);
    }    
}


/*===============Main “Function”==================*/
/*This is the magic main function that doesn't need to be a function. But I like it like that because it lets me hold onto my vain and foolish C++ traditions.*/                    
/*==========================
NAME: (main())()
INPUTS: void
OUTPUTS: void
DESCRIPTION: The main function starts adds all the EventListeners and sets all of the elements to their configured values when the page loads.
==========================*/
(function main(){
	addAllListenersThatSaveData();
	//We want to restore the configurations from browser storage.
	document.addEventListener("DOMContentLoaded", restoreOptions);
	//document.querySelector("form").addEventListener("submit", saveOptions);
})();
