
//Switches to tab with the given value.
function switchToTab(value){
    /*Header Stuff*/
    //make sure that none of the tabs have a "selected" class
    var listOfAllTabs = document.querySelectorAll(`.panel-section-tabs-button`);
    for (var i = 0; i < listOfAllTabs.length; i++){
        listOfAllTabs[i].classList.remove(`selected`);
    }
    
    //Adjust the classList of the desired Tab
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






document.addEventListener("click", function(e) {
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
  } else if (typ === "url"){ //Otherwise it opens the page within the value attribute
        browser.tabs.create({
            url: val
        });
  } else if (typ === "urlscript"){
        var creating =  browser.tabs.create({
            url: val
        });
        creating.then(() => browser.tabs.executeScript({
          file: "/contentScripts/newScript.js"
            })
        );
  } else if (typ === "tab"){
      console.log("It's a tab!");
      switchToTab(val);
  } else if (typ==="errorReport"){
        /*TODO: We still need to figure out how to put the HTML into the email. This would have worked. But it glitched up and the mailto link is too long.*/
        
        
        findTab().then(requestTabForHTML).then(parsePacketForHTML).then(generateEncodedErrorMessageTemplate).then(generateFullErrorEmailURL).then(makeTabWithURL);
  } else if (typ==="submit"){
      return;
  }
});


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
    resolve(encodeURIComponent(defaultTemplate + "\n\n\n\n\n" /*+ pageHTML*/));
  });
}

function generateFullErrorEmailURL(messageTemplate){
  console.log("This is what generateFullErrorEmailURL recieves",messageTemplate);  
  return new Promise(function(resolve,reject){
    resolve("mailto:njmm.it@gmail.com?subject=NJMM%20Bug%20Report&amp&body="+messageTemplate);
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



function onError(error) {
  console.log(`Error: ${error}`);
}