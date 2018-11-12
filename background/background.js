browser.runtime.onMessage.addListener(notify);


while (true){
    var getting = browser.tabs.getAllInWindow();
    for (var tab in getting){
        browser.pageAction.show(tab.windowID);
    }
}
browser.pageAction.show(0)


function notify(message,sender,sendResponse) {
    console.log('Incoming message from a content Script, sir!');
    if (message.pageLoaded){
        //This does nothing right now.
    }
    if (message.addButtons === true || message.undoButtons === true){ //If the incoming message has AddButtons or undoButtons, then we will inject the script.
        var senderTabID = sender.id;  //A little redundant, but easier to read. This is the ID of the tab that sent the message, so that we inject the script into the correct tab.
        console.log(`The page on page ${senderTabID} has buttons!`);
        browser.tabs.executeScript(senderTabID,{
            file: "/contentScripts/newScript.js"
        });                                     //This injects the script.
    } else {    //Hopefully this never happens...
        console.log('There were no page buttons.');
    }
}