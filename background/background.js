/*=============BACKGROUND.JS================*/
/*
DESCRIPTION:    This script listens for messages from the browser.runtime APIs from contentScripts saying that there are automatablly pressable buttons on a page.
                If such a message is recieved, it injects "newScript.js" into the tab that sent the message.
                More information about the browser.runtime.onMessage can be found at https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts
AUTHOR:          Elder Andrew P. Sansom 
VERSION:         ???
VERSION DATE:    ???
=============BACKGROUND.JS================*/

//Add a listener that just waits for incoming messages. If one is recieved, it will run notify().
browser.runtime.onMessage.addListener(notify);


/*==========================
NAME: notify
INPUTS: Object message is the Object that is sent from the contentScript using the browser.runtime API. It has keys that are checked.
        Tab sender is the Tab that sent the message.
        Object sendResponse is the Object that we will send back, if necessary
OUTPUTS: void
DESCRIPTION: "notify()" creates the control panel that contains all the tweak controls relevant to the current page, and sets up its pieces. 
==========================*/
function notify(message,sender,sendResponse) {
    console.log('Incoming message from a content Script, sir!');
    if (message.pageLoaded){
        //This does nothing right now.
    }
    if (message.addButtons === true || message.undoButtons === true){ //If the incoming message has AddButtons or undoButtons, then we will inject the script.
        var senderTabID = sender.id;  //A little redundant, but easier to read. This is the ID of the tab that sent the message, so that we inject the script into the correct tab.
        console.log(`The page on page ${senderTabID} has buttons!`);
        browser.tabs.executeScript({
            file: "/contentScripts/newScript.js"
        });                                     //This injects the script into the activeTab.
    } else {    //Hopefully this never happens... That means that a page sent a message that it shouldn't have.
        console.log('There were no page buttons.');
    }
}
