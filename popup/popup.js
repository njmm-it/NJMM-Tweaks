/*=============POPUP.JS================
DESCRIPTION:    popup.js makes the popup page work. It loads the appropriate scripts and/or urls requested by each item in the panel list.
AUTHOR:         Elder Andrew P. Sansom
VERSION:        ???
VERSION DATE:   ???
=============POPUP.JS================*/

/*==========================
NAME: switchToTab(value)
INPUTS: string value is the value attribute of the panel tab we desire to open.
OUTPUTS: void
DESCRIPTION: "switchToTab(value)" switches the panel to the tab that has the value attribute "value".
==========================*/
//Switches to tab with the given value.
function switchToTab(value){
    /*Header Stuff*/
    //make sure that none of the tabs have a "selected" class
    //This will hide all the panel tabs.
    var listOfAllTabs = document.querySelectorAll(`.panel-section-tabs-button`);
    for (var i = 0; i < listOfAllTabs.length; i++){
        listOfAllTabs[i].classList.remove(`selected`);
    }
    
    //Adjust the classList of the desired Tab
    //By adding a "selected" class, we adjust the CSS so that only that tab is highlighted.
    var desiredTab = document.querySelector(`.panel-section-tabs-button[value="${value}"]`);
    desiredTab.classList.add(`selected`);
    
    /*Content Stuff*/
    //hide everything that has a class of tabContent
    var listOfAllTabContents = document.querySelectorAll(`.tabContent`);
    for (var j = 0; j < listOfAllTabs.length; j++){
        listOfAllTabContents[j].classList.add(`hidden`);
    }
    
    //show the right tabContent with the ID of value
    var desiredTabContent = document.querySelector(`.tabContent#${value}`);    
    desiredTabContent.classList.remove(`hidden`);
}



/*==========================
NAME: processClick(e)
INPUTS: Event e is the click
OUTPUTS: void
DESCRIPTION: "processClick(e)" loads the appropriate scripts and/or urls requested by each item in the panel list.
==========================*/
function processClick(e){
	  var object = e.target;
	  if (e.target.classList.contains("panel-list-item")) {
		  object = e.target;
	  } else if (e.target.parentNode.classList.contains("panel-list-item")){
		  object = e.target.parentNode;
	  } else if (e.target.classList.contains("panel-section-tabs-button")){
		   object = e.target;     
	  }
	  console.log("Checking for"+object);
	  var typ = object.getAttribute("type");
	  var val = object.getAttribute("value");
	  if (typ === "script"){ //If the typ is "script", then it will inject the script instead.
		  browser.tabs.executeScript({
			  file: "/contentScripts/newScript.js"
		  });
	  } else if (typ === "url"){ //Otherwise it opens a new tab with the URL contained in the "value" attribute.
			browser.tabs.create({
				url: val
			});
	  } else if (typ === "urlscript"){ //if typ is "urlscript" then we make a new tab, and then inject the newScript.js (which is the tweak controls)
			var creating =  browser.tabs.create({
				url: val
			});
			creating.then(() => browser.tabs.executeScript({
			  file: "/contentScripts/newScript.js"
				})
			);
	  } else if (typ === "tab"){ //If we clicked on a panel tab, then we switch over to that tab.
		  console.log("It's a tab!");
		  switchToTab(val);
	  } else if (typ==="errorReport"){
			/*TODO: We still need to figure out how to put the HTML into the email. This would have worked. But it glitched up and the mailto link is too long.*/


			findTab().then(requestTabForHTML).then(parsePacketForHTML).then(generateEncodedErrorMessageTemplate).then(generateFullErrorEmailURL).then(makeTabWithURL);
	  } else if (typ==="submit"){
		  return;
	  }
}



/*==========================
NAME: makeTabWithURL(desiredURL)
INPUTS: string desiredURL
OUTPUTS: Promise that tells whether or not a tab was succesfully created.
DESCRIPTION: "makeTabWithURL(desiredURL)" creates a new tab with the URL desiredURL.
==========================*/
function makeTabWithURL(desiredURL){
    console.log("This is what makeTabWithURL recieves",desiredURL);
  return browser.tabs.create({
              url: desiredURL
        });
}


/*==========================
NAME: generateEncodedErrorMessageTemplate
INPUTS: void
OUTPUTS: string representing the generated Error Message Template, encoded as a URL.
DESCRIPTION: "generateEncodedErrorMessageTemplate()" uses the encodeURI function to encode a predetermined error message template as an email link. This should include the pageHTML.
==========================*/

function generateEncodedErrorMessageTemplate(pageHTML){
    const defaultTemplate =  
    "[Feature Name] Title:\n\
Missionary Name:\n\
Device:\n\
Steps to reproduce:\n\
Expected Result:\n\
Actual Result:\n\
Visual Proof (screenshots, videos, text)"
    console.log("This is what generateEncodedErrorMessageTemplate recieves",pageHTML);

  return new Promise(function(resolve,reject){
    resolve(encodeURIComponent(defaultTemplate + "\n\n\n\n\n" /*+ pageHTML*/)); //we commented out the +pageHTML, because it made things way too long.
  });
}


/*==========================
NAME: generateFullErrorEmailURL(messageTemplate)
INPUTS: string messageTemplate that is the Error Report Template
OUTPUTS: Promise that resolves with the needed mailto: URL.
DESCRIPTION: "generateFullErrorEmailURL(messageTemplate)" generates the mailto: link necessary to send a bug report to the developers. 
==========================*/
function generateFullErrorEmailURL(messageTemplate){
    console.log("This is what generateFullErrorEmailURL recieves",messageTemplate);  
    return new Promise(function(resolve,reject){
        //resolve("mailto:njmm.it@gmail.com?subject=NJMM%20Bug%20Report&amp&body="+messageTemplate);
        //This new email will let people email bug reports, and they will show up on github immediately. This will be so helpful for us!
        resolve("mailto:njmmtweaks@fire.fundersclub.com?subject=NJMM%20Bug%20Report&amp&body="+messageTemplate);
    });
}
/*==========================
NAME: sendMessageToTabs
INPUTS: tabs some list of tabs
OUTPUTS: string representing the body outerHTML of the active tab.
DESCRIPTION: "requestPageHTML()" uses the browser.tabs.sendMessage to ask the current active tab for its page's body's outerhtml. This will ask the contentScript to request it for us. This data will help us recreate any issues. 
==========================*/
function requestTabForHTML(tabs){
    //var tab = browser.tabs.getCurrent();
    console.log("This is what requestTabForHTML recieves",tabs);
    for (let tab of tabs) {
        return browser.tabs.sendMessage(
          tab.id,
          {request: "The browserAction would like your page's outerHTML"}
        )
    }
}

/*==========================
NAME: parsePacketForHTML(packet)
INPUTS: Object packet
OUTPUTS: Promise that resolves with the response key's value from Object packet.
DESCRIPTION: "parsePacketForHTML(packet)" returns with a new Promise that resolves with the response key's value from Object packet.
==========================*/
function parsePacketForHTML(packet){
    console.log("This is what requestTabForHTML recieves",packet);
    return Promise.resolve(packet.response);
}



/*==========================
NAME: requestPageHTML
INPUTS: tabs some list of tabs
OUTPUTS: string representing the body outerHTML of the active tab.
DESCRIPTION: "requestPageHTML()" uses the browser.tabs.sendMessage to ask the current active tab for its page's body's outerhtml. This will ask the contentScript to request it for us. This data will help us recreate any issues. 
==========================*/
function findTab() {
    var tabs = browser.tabs.query({
        currentWindow: true,
        active: true
    })
    return tabs;
}


/*==========================
NAME: onError
INPUTS: Error error that is the error that is fed by a Promise.
OUTPUTS: void
DESCRIPTION: "onError(error)" outputs error to the console.
==========================*/
function onError(error) {
  console.log(`Error: ${error}`);
}

/*===============Main “Function”==================*/
/*This is the magic main function that doesn't need to be a function. But I like it like that because it lets me hold onto my vain and foolish C++ traditions.*/                    
/*==========================
NAME: (main())()
INPUTS: void
OUTPUTS: void
DESCRIPTION: The main function starts the process of continually closing all the error messages, then checks if the DOMContent of a facebook.com page has been loaded. 
    If it has, it makes the Control Panel. If it hasn't, then it sets an event listener to do so when it is finished loading.
==========================*/
(function main(){
	document.addEventListener("click", processClick);
})();
