/*=============AUTOMATIC FACEBOOK: THE INTRODUCTION================*/
/*Automatic Facebook
DESCRIPTION:     This script adds buttons that will click all the correct buttons on a page.
AUTHOR:          Elder Andrew P. Sansom
VERSION:         5.0.0
VERSION DATE:    22 October 2018
=============AUTOMATIC FACEBOOK: THE INTRODUCTION================*/


/*================GLOBAL VARIABLES AND CONSTANTS=========*/
/*All of the stuff that need to be declared in a global scope or at the top of the program for programmer ease.*/
/*TODO: Make some of these pull from the options page.*/

var totalButtonsPressed = 0; /*This theoretically stores the number of total buttons pressed*/
var recentButtonsPressed = 0; /*This theoretically stores the number of total buttons pressed in the last set of buttons pressed*/
var buttonPressInterval = 4000; /*Minimum time in milliseconds between button presses*/
var maximumButtonPressInterval = 8000; /*Maximum time in milliseconds between button presses*/
//const maximumFriendRequestsSent = 50;
var maximumFriendRequestsSent = 50; /*Maximum number of Friend Requests sent in a single set before stopping*/
var canButtonsBeCurrentlyPressed = true; /*Boolean which is checked every time a button is pressed. If this is false at the time of a proposed button press, the buttons should not be pressed.*/
const pauseTime = 7000; /*Used to determine how long the variable canButtonsBeCurrentlyPressed should be changed to false when the override is triggered*/

/*the div that stores the control panel. Each following item should be self-explanatory*/
var njmmDiv = document.createElement("div"); /*The div that contains all of the injected control panel, for organizational purposes. The individual components will be injected later on, as necessary.*/
var styleTag = document.createElement("style");
var menuToggle = document.createElement("div");
var menuUL = document.createElement("ul");
var friendButton = document.createElement("button");
var undoRequestsButton = document.createElement(`button`);
var unfollowButton = document.createElement(`button`);
var continueButton = document.createElement(`button`);
var unfriendButton = document.createElement(`button`);
var countInput = document.createElement('input');
var instructionsText = document.createElement("p");
var hamburgerMenuButton = document.createElement("div");

/*The default CSS selectors for buttons of each type. These are used inside of document.querySelector(selector) calls to find particular elements. Each of these was found through a lot of trial and error using the devtools web inspector.*/
/*These, theoretically, should describe a CSS selector that catches each of the desired buttons on a facebook page and nothing else. Experience has shown, however, that this rarely works precisely as desired.*/
/*TODO: Figure out how to make these adjust automatically (or atleast notify the developers) if a desired button is not caught in the CSS selector. This probably could be done with a "Report a problem" link.*/
/*const defaultAddFriendSelector = '[aria-label*="Add"]:not([alreadyClicked=true]):not(.hidden_elem):not([display=none]):not([data-store*=people_you_may_know]):not([data-store*=pymk])';*/
const defaultAddFriendSelector = '[aria-label*="Add"]:not(.hidden_elem):not([data-store*=people_you_may_know]):not([alreadyClicked=true])';
const defaultErrorMessageSelector = `[value="OK"],[value = "Cancel"]:not(.uiLinkButtonInput),.layerCancel,.layerConfirm`;
const defaultUndoFriendSelector = `[aria-label="Undo"]:not([alreadyClicked = true]):not([display=none])`;
const defaultUnfollowSelector = `[data-store*="is_following"]:not([alreadyClicked=true])`;
const defaultUnfriendMenuSelector = `.FriendRequestFriends:not([alreadyClicked=true])`;
const defaultUnfriendButtonSelector = `[ajaxify *= removefriendconfirm]:not([alreadyClicked=true])`; //This is currently just in here for historical purposes. Eventually, this one should be removed. But I simply haven't gone through the code to see what it would break.
const defaultInjectedUnfriendButtonSelector = `.njmmUnfriend: not([alreadyClicked = true])`; //This was added once we figured out how to inject a custom Unfriend button on each person. Custom classes, ftw!








/*================Elias Functions (those that come before)=========*/
/*All the stuff that is necessary to make things work, but aren't directly involved in the automated stuff.*/

/*==========================
NAME: getCustomVariables
INPUTS: void
OUTPUTS: void
DESCRIPTION: This function pulls the user's chosen maximum button press limit, and minimum and maximum wait time between
button presses from browser storage ("maxpresses", "minwait", and "maxwait" respectively). It changes them from strings to
floats to avoid math issues, and then stores them in their proper variables here. (maximumFriendRequestsSent,
buttonPressInterval, and maximumButtonPressInterval respectively).
==========================*/

function getCustomVariables(){
    browser.storage.local.get("maxpresses").then(
        function(maxPressesFromStorage){
          maximumFriendRequestsSent = parseFloat(maxPressesFromStorage.maxpresses) || 50;
          console.log("Maximum Friend Requests Set To: " + maximumFriendRequestsSent);
        },
        function(error){
        console.error(error);
        }
    )

    browser.storage.local.get("minwait").then(
        function(minWaitFromStorage){
          buttonPressInterval = parseFloat(minWaitFromStorage.minwait) || 4000;
          console.log("Minimum Button Wait Time Set To: " + buttonPressInterval);
        },
        function(error){
        console.error(error);
        }
    )

    browser.storage.local.get("maxwait").then(
        function(maxWaitFromStorage){
          maximumButtonPressInterval = parseFloat(maxWaitFromStorage.maxwait) || 8000;
          console.log("Maximum Button Wait Time Set To: " + maximumButtonPressInterval);
        },
        function(error){
        console.error(error);
        }
    )
}

/*==========================
NAME: makeControlPanel
INPUTS: void
OUTPUTS: void
DESCRIPTION: "makeControlPanel()" creates the control panel that contains all the tweak controls relevant to the current page, and sets up its pieces.
==========================*/

function makeControlPanel() {
    var body = document.body;
    var addFriendsBool = false;
    var removeFriendsBool = false;
    var unfollowFriendsBool = false;
    var unfriendFriendsBool = false;

    /*Prevents a duplicate control panel, as sometimes the script can get injected into a page twice.*/
    if (document.querySelector(`.njmmInject`)) {
        return;
    }

    //Change the style tag's innerHTML so that we can do some good inline Editing. We add this style tag inline, because we're running into some conflicts with external sheets otherwise. It makes this script a lot longer, but such is the price to pay. The hamburger menu is pure-html/css, so conflicts break it.
    styleTag.innerHTML = `
                /*
                 * Made by Erik Terwan
                 * 24th of November 2015
                 * MIT License
                 *
                 *
                 * If you are thinking of using this in
                 * production code, beware of the browser
                 * prefixes.
                 */



                a
                {
                  text-decoration: none;
                  color: #232323;

                  transition: color 0.3s ease;
                }

                a:hover
                {
                  color: tomato;
                }

                #menuToggle
                {
                  display: block;
                  position: relative;
                  top: 5px;
                  left: 5px;

                  z-index: 1;

                  -webkit-user-select: none;
                  user-select: none;
                }

                #menuToggle #hamburgerCheckbox
                {
                  display: block;
                  width: 40px;
                  height: 32px;
                  position: absolute;
                  top: -7px;
                  left: -5px;

                  cursor: pointer;

                  opacity: 0; /* hide this */
                  z-index: 2; /* and place it over the hamburger */

                  -webkit-touch-callout: none;
                }

                /*
                 * Just a quick hamburger
                 */
                #menuToggle span
                {
                  display: block;
                  width: 33px;
                  height: 4px;
                  margin-bottom: 5px;
                  position: relative;

                  background: #cdcdcd;
                  border-radius: 3px;

                  z-index: 1;

                  transform-origin: 4px 0px;

                  transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                              background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                              opacity 0.55s ease;
                }

                #menuToggle span:first-child
                {
                  transform-origin: 0% 0%;
                }

                #menuToggle span:nth-last-child(2)
                {
                  transform-origin: 0% 100%;
                }

                /*
                 * Transform all the slices of hamburger
                 * into a crossmark.
                 */
                #menuToggle input:checked ~ span
                {
                  opacity: 1;
                  transform: rotate(45deg) translate(-2px, -1px);
                  background: #232323;
                }

                /*
                 * But let's hide the middle one.
                 */
                #menuToggle input:checked ~ span:nth-last-child(3)
                {
                  opacity: 0;
                  transform: rotate(0deg) scale(0.2, 0.2);
                }

                /*
                 * Ohyeah and the last one should go the other direction
                 */
                #menuToggle input:checked ~ span:nth-last-child(2)
                {
                  transform: rotate(-45deg) translate(0, -1px);
                }

                /*
                 * Make this absolute positioned
                 * at the top left of the screen
                 */
                #menu
                {
                  /*position: absolute;
                  width: 300px;
                  margin: -100px 0 0 -50px;
                  padding: 50px;
                  padding-top: 125px;

                  background: #ededed;
                  list-style-type: none;
                  -webkit-font-smoothing: antialiased;*/
                  /* to stop flickering of text in safari */
                  font-family: arial;
                  background-color: rgba(255,255,255,0.7);
                  padding: 0px;
                  text-align: center;
                  /*width: 150px;*/
                  /*margin: 10px;*/
                  margin: 0px -10px;
                  position: fixed;
                  height:100%
                  transform-origin: 0% 0%; transform: translate(-100%, 0); transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
                }

                #menu li { padding: 10px 0; font-size: 22px; }
                /*
                 * And let's slide it in from the left
                 */
                #menuToggle input:checked ~ ul {transform: none;}`;
    njmmDiv.appendChild(styleTag);
    menuToggle.setAttribute("id", "menuToggle");
    njmmDiv.appendChild(menuToggle);
    menuToggle.innerHTML=`<!--A fake / hidden checkbox is used as click reciever, so you can use the :checked selector on it.--><input id="hamburgerCheckbox" type="checkbox" checked><!--Some spans to act as a hamburger. They are acting like a real hamburger, not that McDonalds stuff.--><span></span><span></span><span></span><!--Too bad the menu has to be inside of the button but hey, it's pure CSS magic.-->`;
    menuUL.setAttribute("id","menu");
    menuToggle.appendChild(menuUL);


    /*Check what type of top button we should add. This will depend on the location of the webpage. For example, there should not be any add friend buttons on an Undo Sent Request page.*/
    if (window.location.href.match(".*.\/\/.*\.facebook\.com\/friends\/center\/requests\/outgoing\/.*")) {
        /*Add an Undo Friend Requests Button*/ //BEING FIXED
        /*Test URL: https://touch.facebook.com/friends/center/requests/outgoing/?fb_ref=jwl*/
        /*If this script is injected on that web page and when cued will click every Undo button on that page, then it is considered successful.*/
        undoRequestsButton.innerHTML = "Undo Friend Requests";
        undoRequestsButton.addEventListener("click", undoSentRequests);
        undoRequestsButton.setAttribute("class", "njmmButton");
        undoRequestsButton.setAttribute("id", "addFriendButton");
        removeFriendsBool = true;
    } else if (window.location.href.match(".*.\/\/.*\.facebook\.com\/feed_preferences\/following\/.*")) {
        /*add an Unfollow People Button*/
        /*Test URL: https://touch.facebook.com/feed_preferences/following/*/
        /*If this script is injected on that web page and when cued will click every person's unfollow button on that page, then it is considered successful.*/
        unfollowButton.innerHTML = "Unfollow People";
        unfollowButton.addEventListener("click", unfollowPeople);
        unfollowButton.setAttribute("class", "njmmButton");
        unfollowButton.setAttribute("id", "addFriendButton");
        unfollowFriendsBool = true;
    } else {
        /*add an Add Friend button*/
        /*Test URL: https://www.facebook.com/search/me/non-friends/intersect/*/
        /*There are many ways to skin a cat. In particular, there are many pages to add friends from. We just let it default to the Add Friends because that makes it easier than trying to outsmart the user.*/
        /*If this script is injected on that web page and when cued will click every person's add button on that page, then it is considered successful.*/
        friendButton.innerHTML = "Start Adding";
        friendButton.addEventListener("click", addFriends);
        friendButton.setAttribute("class", "njmmButton");
        friendButton.setAttribute("id", "addFriendButton");
        addFriendsBool = true;
    }
    //This next if statement is outside the previous because there might be BOTH add and unfriend buttons on the same page. We always want the add button to show up if there are.
    if (window.location.href.indexOf("#njmmTweaksUnfriend") > -1 || (window.location.href.indexOf("me/friends")>-1 && window.location.href.indexOf("me/friends/friends")==-1)){
        /*This block is slightly different than the above. Because there is no (known) page on facebook that makes Unfriending an easy experience, we had to be clever and make our own unfriend Buttons by piggybacking off of the
            ajax built into the facebook graph search pages. We basically have to add a unique unfriendButton to each user that shows up in a graphsearch. This is done iteratively over each person, first extracting their userID from
            the "data-bt" attribute on their user element. We then add a new element that convinces the webpage that it is an unfriend button by having a specific ajaxify attribute. Why does this work? We're not quite sure, but it
            does, and came via revelation from the Lord. So we don't question it. If you can figure out why, then please do explain.*/
        /*The second half adds a button to the control panel that presses all the newly inserted unfriend buttons.*/
        /*Test URL: https://www.facebook.com/search/me/friends/intersect/#njmmTweaksUnfriend*/
        /*If this script is injected on that web page and will add an unfriend button to each person, and when cued will click every person's unfriend button on that page, then it is considered successful.*/
        /*This checks to see if the URL contains "#njmmTweaksUnfriend" or if it contains "me/friends" which signifies that the graphsearch is searching over the signed-in user's friends. It also checks to make sure that "me/friends/friends" is not contained, as that searches instead over the signed-in user's friends of friends.*/

        /*This block creates an unFriendButton to each user*/
        arrayOfElementsRepresentingPeople = document.querySelectorAll(`._3u1._gli._6pe1`);
        for (var i = 0; i < arrayOfElementsRepresentingPeople.length; i++) {
            elementRepresentingPeople = arrayOfElementsRepresentingPeople[i];
            str = elementRepresentingPeople.getAttribute("data-bt"); //The userID is embedded inside of the data-bt attribute of the elements in the above array. It is contained immediately after `"id":` and before a comma. We need the user ID to make the unfriend button unfriend the right person
            //userID = str.substring(str.indexOf(`"id": `) + 5, str.indexOf(",")); //The "+ 5" is to compensate for the length of `"id": `
            const regexToMatch = `"id"\s?:(.*?)\,`;
            userID = str.match(regexToMatch)[1];
            var htmlStringOfNewUnfriendButton = `<a class = "itemAnchor" role = "menuitem" tabindex = "-1" ajaxify = "/ajax/profile/removefriendconfirm.php?uid=${userID}&unref=button_dropdown" href = "#" rel = "async-post"> <button class = "itemLabel fsm _517h njmmUnfriend"> Unfriend </button></a> `;
            var injectedUnfriendButton = document.createElement("a");
            elementRepresentingPeople.appendChild(injectedUnfriendButton);
            injectedUnfriendButton.outerHTML = htmlStringOfNewUnfriendButton;
        }



        //This block will add the unfriendButton to controlbox
        unfriendButton.innerHTML = "Unfriend all on page";
        unfriendButton.addEventListener("click", removeFriends);
        unfriendButton.setAttribute("class", "njmmButton");
        unfriendButton.setAttribute("id", "addFriendButton");
        unfriendFriendsBool = true;
    }


    /*add a Stop override. This is will run the function stopAllButtonPressing, which changes the canButtonsBeCurrentlyPressed variable for a few seconds to interupt all button-pressing functions.*/
    continueButton.innerHTML = "Stop!";
    continueButton.addEventListener("click", stopAllButtonPressing);
    continueButton.setAttribute("class", "njmmButton");
    continueButton.setAttribute("id", "stopButton");

    instructionsText.setAttribute("class","njmmText");
    instructionsText.innerHTML="Only run the auto-adder on one page at a time.<br>If you do more than that, you will likely be blocked!";


    /*add a little counter that acts as a place to put progress.*/
    countInput.type = "text";
    countInput.setAttribute("class", "njmmCounter");
    countInput.value = "";

    /*TODO: Add a visual progress bar or something of the sort.*/


    /*Organize the component controls.*/
    njmmDiv.setAttribute("class", "njmmInject");
    body.insertBefore(njmmDiv, body.childNodes[0]);
    if (addFriendsBool === true) {
        menuUL.appendChild(friendButton);
    }
    if (removeFriendsBool === true) {
        menuUL.appendChild(undoRequestsButton);
    }
    if (unfollowFriendsBool === true) {
        menuUL.appendChild(unfollowButton);
    }
    if (unfriendFriendsBool === true) {
        menuUL.appendChild(unfriendButton);
    }
    menuUL.appendChild(continueButton);
    menuUL.appendChild(countInput);
    menuUL.appendChild(instructionsText);
}

/*==========================
NAME: toggleHamburgerMenu
INPUTS: Event e
OUTPUTS: void
DESCRIPTION: "toggleHamburgerMenu" causes the webpage to scroll to the bottom of the page.
TODO: In a distant future, this should return a Promise that resolves when more objects appear after scrolling and rejects if not. That will make running async functions after it scrolls SO SO SO much easier.
==========================*/
function toggleHamburgerMenu(){
    alert(`Toggling the Hamburger Menu!`);
    document.querySelector(`.njmmHamburger`).classList.toggle("njmmToggle");
}

/*==========================
NAME: scrollDownPage
INPUTS: void
OUTPUTS: void
DESCRIPTION: "scrollDownPage()" causes the webpage to scroll to the bottom of the page.
TODO: In a distant future, this should return a Promise that resolves when more objects appear after scrolling and rejects if not. That will make running async functions after it scrolls SO SO SO much easier.
==========================*/

function scrollDownPage() {
    window.scrollBy(0, 10000000);
    postToBox("Clear Requests \n Scrolling…");
}

/*==========================
NAME: postToBox
INPUTS: msg
OUTPUTS: void
DESCRIPTION: "postToBox(msg)" posts “msg” to the textInput inside the control panel. After 3 seconds, it clears the notification. After an additional 7 seconds it prints "" to the box.
==========================*/

function postToBox(msg) {
    countInput.value = msg;
    setTimeout(function() {
        if (countInput.value === msg) {
            countInput.value = "";
            setTimeout(function() {
                if (countInput.value === "") {
                    countInput.value = "";
                }
            }, 7000);
        }
    }, 3000);
    /* Is there a neater way of writing that? Probably */
}
/*==========================
NAME: updateCounter
INPUTS: counter
OUTPUTS: void
DESCRIPTION: "updateCounter(counter)" increases counter by one and logs counter's current value. This might not actually work properly, because I didn't realize that javascript passes by value.
==========================*/

function updateCounter(counter) {
    counter++;
    console.log(`I have pressed: `+counter);
}

/*==========================
NAME: addToCount
INPUTS: void
OUTPUTS: void
DESCRIPTION: "addToCount()" adds 1 to totalButtonsPressed and recentButtonsPressed.
==========================*/

function addToCount() {
    totalButtonsPressed++;
    recentButtonsPressed++;
}
/*==========================
NAME: mod
INPUTS: int dividend, int divisor
OUTPUTS: int remainder
DESCRIPTION: "mod(dividend, divisor)" returns dividend modulo divisor. This could be omitted, but is included for historical reasons. Orginally, this script was injected via a "javascript:" protocol
    call in the Chrome URL Bar. Percent signs were misinterpreted. So we used the mod function to overcome this.
==========================*/

function mod(dividend, divisor) {
    return dividend - divisor * Math.floor(dividend / divisor);
}

/*==========================
NAME: isVisible(element)
INPUTS: DOMelement element that will be checked if it is visible
OUTPUTS: void
DESCRIPTION: "isVisible(element)" simply checks if the offsetWidth and offsetHeight are greater than 0.
==========================*/
function isVisible(element){
	return ((element.offsetWidth > 0) && (element.offsetHeight > 0));
}

/*==========================
NAME:stopAllButtonPressing()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "stopAllButtonPressing()" just turns canButtonsBeCurrentlyPressed to false and after pauseTime milliseconds, it turns it back to true. Each time a function tries to press a button, there is an if (canButtonsBeCurrentlyPressed===true) conditional
    before it. So by changing canButtonsBeCurrentlyPressed to false for 7 seconds (which is longer than any wait time on the recursive functions), we can effectively stop any button pressing.
==========================*/

function stopAllButtonPressing() {
    canButtonsBeCurrentlyPressed = false;
    console.log(`Turned off the override for ${pauseTime} miliseconds.`);
    setTimeout(function() {
        canButtonsBeCurrentlyPressed = true;
        console.log(`Turned on the override.`);
    }, pauseTime);
}


/*================Automated Functions=========*/
/*All the actual button pressing stuff.*/



/*==========================
NAME: getNextButton(selector)
INPUTS: selector
OUTPUTS: void
DESCRIPTION: "getNextButton(selector)" returns the query Selector with the first element of the CSS selector “selector”, after deleting any "People you may know" boxes, because these are the bane of our existance.
==========================*/
function getNextButton(selector) {
    var peopleYouMayKnowPanels = document.querySelectorAll(`.friendBrowserCheckboxResults`);
    for (var i = 0; i < peopleYouMayKnowPanels.length; i++) {
        peopleYouMayKnowPanels[i].parentNode.removeChild(peopleYouMayKnowPanels[i]);
    }
    return document.querySelector(selector);
}
/*==========================
NAME: clickNextButton
INPUTS: string buttonType describes the button type. This is lazily implemented as a string that says "Add", "Undo", or "Cancel". It should be the javascript equivalent of an enum. After a brief (30sec) google search, I don't know how to do it.
        string selector is the CSS selector to click
        string scrollable = true determines weather the page that the type of button is on is scrollable. This allows new buttons that haven't been rendered yet by the page to be discovered. This should be eventually deprecated, because it is ugly.
OUTPUTS: void
DESCRIPTION: "clickNextButton(buttonType,selector)" scrolls the next element of type selector into view, then clicks it. After a psuedo-random amount of time, it will then call itself again and the process repeats.
==========================*/
/*TODO: change the buttonType parameter so that it is not a string, but an enum*/
/*TODO: Deprecate scrollable*/
function clickNextButton(buttonType, selector, scrollable = true) {

    /*==========================
    NAME: generateDelayTime() [[Within clickNextButton()]]
    INPUTS: void
    OUTPUTS: int, whose value depends on the buttonType. For "Undo" or "Unfollow", it returns between 300 and 500, representing the number of miliseconds to wait. For other types, it is between 3000 and 7000, favoring smaller values.
    DESCRIPTION: "generateDelayTime()" generates a random delay time that follows certain guidelines, explained within the function code. For some button types, it is really simple, and for others, it tries to simulate how a human would press the buttons on a page. This is necessary because Facebook
    (understandably) hates bots that add people. But we can do better than that. "It doesn't matter what Facebook thinks, because we're on the Lord's Errand." --Elder Sansom (2018)
    ==========================*/
    function generateDelayTime(){
        //console.log(maximumButtonPressInterval + " is the max, and " + buttonPressInterval + " is the min.");
        var max = (maximumButtonPressInterval - buttonPressInterval)/1000; /*This is the difference between the minumum and maximum time to press a button. Neessary to make equation simpler.*/
        //console.log("The max variable is: " + max);
        var stretch = 2; /*Arbitrary constant that allows one to stretch the distribution. This effects how drasticly the distribution will favor shorter times.*/
        //console.log(`With all the variables, the equation should be the natural log of the natural exponent of ${stretch} - 1, plus 1 / ${max} , then subtract ${stretch} and then add 1`)
        var horizontalShiftConstant = Math.log(Math.exp(stretch - 1) + (1 / max)) - stretch + 1; /*This is necessary to line up the vertical asymptote.*/


        if (buttonPressInterval <= 0 || buttonType === "Undo" || buttonType === "Unfollow") {
            /*Will press Undo or Unfollow buttons every 300 to 500 milliseconds, distributed roughly randomly. We don't need a fancy human-esque delay generator. Facebook doesn't even care if buttons are pressed
            more quickly than this for Undo and Unfollow buttons, but I didn't feel comfortable making it instant.*/
            return 300 + 200 * Math.random();
        } else {
                /*This chunk of code determines the pseudo-random time between button presses. Ideally, this follows a Poisson Distribution, as that would pretty accurately describe the assumptions on this probability problem.
                This will allow some button presses to be exceptionally long and others short because buttonPressInterval is the minimum. The mean has to be much higher. In practice, however, I cannot figure out how to calculate
                the wait time between button presses following that distribution. So instead I invented my own. Call it what it may. It gets the job done. It was invented with some trial and error with a graphing calculator and a
                spreadsheet. It spits out a value between 3000 and 7000, given a random decimal between 0 and 1. We needed something that has a vertical asymptote just after 1, a y-value of 3000 at x=0, a function that is
                everywhere-increasing on the interval of [0,1], that grows really rapidly at the edge, but not rapidly at all near the beginning. I wish I could explain at a mathematical level why it does what we want, but all I
                can say is that it does. I am so sorry to black-box it!*/

            //var waitTime = buttonPressInterval + 1000 / (Math.exp(stretch - Math.random() + horizontalShiftConstant) - Math.exp(stretch - 1));
            //console.log(waitTime);
            //console.log(horizontalShiftConstant + " is the horizontal Shift Constant in this equation");
            //console.log(buttonPressInterval + " is the minimum button press wait time in this equation");
            //console.log(stretch + " is the stretch variable in this equation");
            var underBar = (Math.exp(stretch - Math.random() + horizontalShiftConstant) - Math.exp(stretch - 1));
            //console.log(underBar + " is what 1000 is divided by in this equation");

            return buttonPressInterval + 1000 / (Math.exp(stretch - Math.random() + horizontalShiftConstant) - Math.exp(stretch - 1));
        }
    }

    var delay = generateDelayTime();
    if (buttonType !== "Cancel") {
        /*Send a message saying how long we are waiting to press the next button*/
        console.log(`Waiting ${delay} milliseconds to press next ${buttonType} button.`);
        postToBox(`Pressing next button in ${(delay/1000).toFixed(2)} seconds`); //Tell the User that we are waiting that long.

    }
    var nextButtonToPress = getNextButton(selector); /*We need to find the next button!*/
    if (buttonType !== "Cancel"){
        console.log('I am considering pressing the button of type: ',buttonType, nextButtonToPress);
    }
    if (nextButtonToPress !== null) { /*If the button exists, we should check if we should press it. If it doesn't exist, we scroll the page to see if we can generate more.*/
        if (canButtonsBeCurrentlyPressed === true && recentButtonsPressed < maximumFriendRequestsSent) { /*Checks to see if we've already reached the limit on how many buttons to press and stops pressing if so.*/
            nextButtonToPress.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest"
            });
        nextButtonToPress.setAttribute("alreadyClicked", "true"); /*Our selectors should (theoretically) filter this object out on the next pass.*/
        /*checks the button type and deals with it as necessary.*/
        if (buttonType === "Add") {
			console.log("Checking if the button is visible!");
			if (isVisible(nextButtonToPress)){
			  //If the button isn't visible, we shouldn't click it. This will avoid clicking already-clicked buttons.! Woo!
        console.log("The Button is visible!")
				nextButtonToPress.click();
			}
            addToCount();
            console.log('You just added ' + recentButtonsPressed + ' friends!');
            postToBox("Buttons pressed: " + recentButtonsPressed);
            //We will now check if there facebook has notified the user of a block. If so, we automatically stop the button pressing just before the next press.
            setTimeout(manuallyDetectBlock, buttonPressInterval-10);
        } else if (buttonType === "Undo") {
			console.log("Checking if the button is visible!");
			if (isVisible(nextButtonToPress)){
		    	//If the button isn't visible, we shouldn't click it. This will avoid clicking already-clicked buttons.! Woo!
            	console.log("The Button is visible!")
				nextButtonToPress.click();
			}
            postToBox("Cleared 1 Friend");
            /*TODO: Make this more useful.*/
        } else if (buttonType === "Cancel") {
			console.log("Checking if the button is visible!");
			if (isVisible(nextButtonToPress)){
				//If the button isn't visible, we shouldn't click it. This will avoid clicking already-clicked buttons.! Woo!
        	    console.log("The Button is visible!")
				if (nextButtonToPress.parentNode.querySelector(".layerConfirm") == null){
					nextButtonToPress.click();
				} else {
					nextButtonToPress.parentNode.querySelector(".layerConfirm").click();
				}
			}
            /*TODO: Make this do something.*/
      } else if (buttonType === "Unfollow") {
			console.log("Checking if the button is visible!");
			if (isVisible(nextButtonToPress)){
			    //If the button isn't visible, we shouldn't click it. This will avoid clicking already-clicked buttons.! Woo!
        	    console.log("The Button is visible!")
				nextButtonToPress.click();
			}
            /*TODO: Make this do something.*/
        }  else if (buttonType === "injectedUnfriend") {
			console.log("Checking if the button is visible!");
			if (isVisible(nextButtonToPress)){
			    //If the button isn't visible, we shouldn't click it. This will avoid clicking already-clicked buttons.! Woo!
        	    console.log("The Button is visible!")
				nextButtonToPress.click();
			}
            /*TODO: Make this do something useful*/
        }/*else if (buttonType === "Unfriend") {
            //This then proceeds to click the actual unfriend button after a moment.
            setTimeout(clickNextButton, 400, "UnfriendStep2", defaultUnfriendButtonSelector, scrollable)
        }*/
        /*This last little bit of code uses the old "Unfriend" feature, which requires pressing a button to activate a menu on a facebook user, then pressing a button on that menu. It was slow and clunky.
        We discovered, by revelation, the injected Unfriend button instead. I don't think removing it will break anything, but I'm too nervous to delete it yet. Please deprecate ASAP.*/
        /*TODO: Deprecate the old unfriend method.*/

        setTimeout(clickNextButton, delay, buttonType, selector, scrollable); /*Click the next button of the same type and selector after delay!*/
	}
    } else {
        /*This whole section determines what to do if no more buttons of the acceptable type have been found. Currently, if the page is scrollable and we haven't sent more than maximumFriendRequestsSent requests,
        then it will scroll. If it isn't scrollable, then it will refresh the page.*/
        /*TODO: Figure out how to deprecate scrollable without breaking things.*/
        //if (canButtonsBeCurrentlyPressed === true && scrollable && recentButtonsPressed < maximumFriendRequestsSent) {
	if (canButtonsBeCurrentlyPressed === true && scrollable) {
            console.log(`I ran out of buttons!`, `I will scroll instead!`);
            setTimeout(clickNextButton, delay, buttonType, selector, scrollable); //The timeout used to be 4000+delay.
            setTimeout(function() { //We need to wait 4 seconds to check if new buttons have appeared before we refresh the page.
                if (getNextButton(selector) === null) { //Check to see if there is still no new buttons after 4000 milliseconds
                    console.log(`I 'm still out of buttons. Attempting to refresh`);
                            location=location; //This will refresh the page after finishing all the buttons
                        }
                },4000);
            } else {
             //console.log(`I ran out of buttons!`);
                return;
            }

        }
    }

/*==========================
NAME: closeAllErrors
INPUTS: void
OUTPUTS: void
DESCRIPTION: "closeAllErrors()" closes all the error/confirm friends/whatever boxes that pop up after clicking a friend request.
==========================*/
    function closeAllErrors() {
        clickNextButton("Cancel",defaultErrorMessageSelector,false);
    }
/*==========================
NAME: addFriends
INPUTS: void
OUTPUTS: void
DESCRIPTION: "addFriends()" clicks every "send friend request" button on the given page.
==========================*/
    function addFriends() {
        clickNextButton("Add",defaultAddFriendSelector);
    }
/*==========================
NAME: undoSentRequests()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "undoSentRequests()" clicks every "Undo" button on the page.
==========================*/
    function undoSentRequests() {
        clickNextButton("Undo",defaultUndoFriendSelector);
    }
/*==========================
NAME: unfollowPeople()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "unfollowPeople()" clicks every "Unfollow" button on the page.
==========================*/
    function unfollowPeople(){
        clickNextButton("Unfollow",defaultUnfollowSelector);
    }
/*==========================
NAME: removeFriends()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "removeFriends()" clicks every injected "Unfriend" button on the page.
==========================*/
    function removeFriends(){
        clickNextButton("injectedUnfriend",defaultInjectedUnfriendButtonSelector);
    }
/*==========================
NAME: continuallyCloseAllErrors()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "continuallyCloseAllErrors()" closes every error message every 2000 milliseconds.
==========================*/
function continuallyCloseAllErrors(){
    setInterval(closeAllErrors, 2000);
}
/*==========================
NAME: removeLightningRedirectionBug()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "removeFriends()" clicks every injected "Unfriend" button on the page.
==========================*/
function removeLightningRedirectionBug(){
    /*This next chunk will get rid of all of the redirector buttons.TAKE THAT LIGHTNING REDIRECTION BUG!AFTER A LONG BATTLE OF MANY MOONS, THE PROGRAMMERS COME OFF VICTORIOUS!*/
    /*For historical note: The Lightning Redirection bug is a bug where on the touch version of facebook on Firefox, there is an unrendered button that gets caught by defaultErrorMessageSelector, that
    causes the webpage to redirect itself to the main page on facebook.*/

    var cancelButtonsThatAreAlreadyInThePageThatBreakTheCode = document.querySelectorAll(defaultErrorMessageSelector);
    for (var i = 0; i < cancelButtonsThatAreAlreadyInThePageThatBreakTheCode.length; i++) {
        var theCurrentButtonToKILL = cancelButtonsThatAreAlreadyInThePageThatBreakTheCode[i];
        theCurrentButtonToKILL.parentNode.removeChild(theCurrentButtonToKILL); /*This removes the desired buttons from the page.*/
    }
}

/*==========================
NAME: autodetectBlock()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "autodetectBlock()" checks the page every few seconds for any signs that a user has been blocked.
==========================*/
function autodetectBlock(){
  var timeToWaitBetweenChecks = buttonPressInterval/2; //Dividing the minimum time between button presses by 2 guarentees that if something pops up between presses we'll catch it.
  //xpath technology is witchcraft. But it's also probably the fastest way to check for what we want to check.
  //This currently checks for any instance of 'unwelcome', 'block', or 'misuse' that appears in any element that is not a script or a stylesheet
  var  xpath = "//*[not(self::script or self::style) and contains(text(),'block') or contains(text(), 'unwelcome') or contains(text(), 'misuse')]";
  setInterval( function(){
    //This next conditional checks if the xpath query yields any elements in the document. If so, then we stop all button pressing and throw an alert to the user, just in case.
    if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue != null){
      alert('Possible block detected!');
      stopAllButtonPressing();
    }
  }, timeToWaitBetweenChecks);
}

/*==========================
NAME: manuallyDetectBlock()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "manuallyDetectBlock()" checks the page once for any signs that a user has been blocked.
==========================*/
function manuallyDetectBlock(){
  var timeToWaitBetweenChecks = buttonPressInterval/2; //Dividing the minimum time between button presses by 2 guarentees that if something pops up between presses we'll catch it.
  //xpath technology is witchcraft. But it's also probably the fastest way to check for what we want to check.
  //This currently checks for any instance of 'unwelcome', 'block', or 'misuse' that appears in any element that is not a script or a stylesheet
  var  xpath = "//*[not(self::script or self::style) and contains(text(),'block') or contains(text(), 'unwelcome') or contains(text(), 'misuse')]";
  //This next conditional checks if the xpath query yields any elements in the document. If so, then we stop all button pressing and throw an alert to the user, just in case.
  if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue != null){
    alert('Possible account block detected!');
    stopAllButtonPressing();
  }
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
(function main() {

    if (window.location.href.indexOf("messenger.com") == -1 || window.location.href.indexOf("/messages/") == -1) { /*Makes sure that it doesn't load the addButtons on the messenger windows, because indexOf returns -1 if it doesn't show up.*/
        if (document.readyState === "loading") { /*Occasionally, it'll try to load before the page has loaded the Document Object Model (DOM). This is an issue. This checks if it's loaded or not.*/
            document.addEventListener("DOMContentLoaded", removeLightningRedirectionBug);
            document.addEventListener("DOMContentLoaded", makeControlPanel); //Once the DOM is loaded, it will then fire the main function.
            document.addEventListener("DOMContentLoaded", continuallyCloseAllErrors);
            document.addEventListener("DOMContentLoaded", getCustomVariables);
            //document.addEventListener("DOMContentLoaded", autodetectBlock);
        } else { // `DOMContentLoaded` already fired, so the DOM has been loaded.
            removeLightningRedirectionBug();
            makeControlPanel(); //Run that puppy.
            continuallyCloseAllErrors();
            getCustomVariables();
            //autodetectBlock();
        }
    }
})();
