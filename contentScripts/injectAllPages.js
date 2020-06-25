/*=============INJECTALLPAGES.JS================
DESCRIPTION:    injectAllPages.js has multiple responsibilities.
			1. Hide all profile images (i.e. changes them to another image).
			2. Optionally hides the Newsfeed, Videos, and all other images, based on what the configurations saved in the browser storage.
			3. Check if there are add-buttons on the page. If so, ask background.js to inject newScript.js into the page.
AUTHOR:         Elder Andrew P. Sansom, Elder Kai C.K. Reyes, Elder Robert O. Oldroyd
VERSION:        3.7.1
VERSION DATE:   6/13/2020
=============INJECTALLPAGES.JS================*/

/*The custom CSS strings to block certain things*/
const hideImagesCSS = `[src*=scontent],[style*=scontent] {visibility:hidden}`; //If 'Hide All Images' is selected, this will be injected.
const hideVideosCSS = `video,#u_ps_0_0_n {display:none}`;//If 'Hide Videos' is selected, this will be injected.
const hideNewsfeedCSS = `#m_newsfeed_stream,#recent_capsule_container,[role=feed],.feed,#tlFeed {display:none}`; //If 'Hide Newsfeed' is selected, this will be injected.
const hideAdsCSS = `#pagelet_ego_pane {display:none}`; //If 'Hide Ads' is selected, this will be injected.


//This is a CSS selector that helps us find all of the profile pictures on the page
const hideProfileSelector = `img:not(.njmm-override):not(._1ift):not([alt^="Image"]):not(.scaledImageFitWidth):not([src*="rsrc"]), image:not(.njmm-override):not([src*="rsrc"]),.uiScaledImageContainer._26w6`;
//It got a little trickier with the new facebook update becuase the profile pictures are both img and image elements.
//This is not super optimized, but it does work. It probably messes up the optional settings (e.g.hide all videos)
//njmm-override is what we use to not block images twice
//_1ift is the class that emojis have
//alts that start with "Image" are regular images, along with the scaledImageFitWidth class
//if the src is rsrc, it's an icon we don't need to block
//.uiScaledImageContainer._26w6 takes care of the profile pictures in people's stories.


/*==========================
NAME: onError
INPUTS: Error error that is the error that is fed by a Promise.
OUTPUTS: void
DESCRIPTION: "onError(error)" outputs error to the console. Aka we are logging any errors we come across
==========================*/
function onError(error) {
    console.log(`Error: ${error}`);
}

/*==========================
NAME: startHidingAllProfilePicturesAndOtherThings()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "startHidingAllProfilePicturesAndOtherThings()" starts hiding all profile images on the page.
 It also checks if we should block	other things and blocks those, too.
==========================*/
function startHidingAllProfilePicturesAndOtherThings(){

  //This is the default image that we will replace all the profile pictures with.
  var profileURL = browser.extension.getURL("icons/prof.png"); //We get this here and pass it into hideProfileImages so that we don't have to re-get them every half second

  //Get user options and add hiding CSS
	browser.storage.local.get("allImages").then(result => {if(result.allImages){installCSS(hideImagesCSS);}}, onError);
	browser.storage.local.get("videos").then(result => {if(result.videos){installCSS(hideVideosCSS);}}, onError);//broken
	browser.storage.local.get("newsfeed").then(result => {if(result.newsfeed){installCSS(hideNewsfeedCSS);}}, onError);

  //THIS MAKES THE PROFILE IMAGES HIDE EVERY HALF SECOND!!
  //IF THEY ARE NOT HIDING PROPERLY, CHECK function hideProfileImages()!!
  setInterval(hideProfileImages,500,profileURL);
}

/*==========================
NAME: hideProfileImages()
INPUTS: profileURL, the URL for the picture we want to replace each profile picture with
        profileSelector, the CSS selector for all the images we want to change
OUTPUTS: void
DESCRIPTION: "hideProfileImages()" hides the profile images on the page.
It will only hide them if we are not on a group page. This is intentional.
==========================*/
function hideProfileImages(profileURL){

  var list = document.querySelectorAll(hideProfileSelector);

	//This will loop over all the pictures our list
	for (var i = 0; i <list.length;i++){
		var wid = list[i].width; //We need the width because the browser will adjust the element's width and height when we change the source. Retaining this will allow us to fix them.
		var hei = list[i].height; //Ditto

   	list[i].classList.add(`njmm-override`); //Adding this class will tell the selectors to not hide it, because it is already hidden
		list[i].setAttribute(`src`,`${profileURL}`); //Change the source, if it uses the source attribute
		list[i].style.backgroundImage = `url("${profileURL}")`;//Change the source, if it uses the backgroundImage attribute
		list[i].setAttribute(`xlink:href`,`${profileURL}`);//Change the source, if it uses the xlink attribute (new facebook does)
		list[i].style.visibility="visible"; //Force it to be visible anyway, just in case.

		list[i].width = wid; //Set the width to the original width.
		list[i].height = hei; //Set the height to the original height
	}
}

/*==========================
NAME: installCSS(code)
INPUTS: string code is the CSS code that we will inject into the page
OUTPUTS: void
DESCRIPTION: "installCSS(code)" injects CSS code code into the page by creating a new css style element to the header.
==========================*/
function installCSS(code){
    console.log(`Installing CSS: ${code}`);
    var cssInject = document.createElement("style"); //We will put the code into this element
    cssInject.setAttribute("type","text/css");
    cssInject.innerHTML = code;
    document.head.appendChild(cssInject); //Injecting the element into the head of the html DOM will allow everything in the body to use it.
}

/*==========================
NAME: getPageHTML
INPUTS: void
OUTPUTS: string that represents the page's HTML.
DESCRIPTION: "getPageHTML()" returns the page's HTML.
==========================*/
function getPageHTML(){
    var headerHTML = document.head.outerHTML;
    var bodyHTML = document.body.outerHTML;
    var pageHTML = "<html>" + headerHTML + bodyHTML + "</html>";
    return pageHTML;
}

/*==========================
NAME: addEventListenerToRecieveRequest()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "addEventListenerToRecieveRequest()" recieves the requestPageHTML and sends a response with the getPageHTML function's output.
==========================*/
function addEventListenerToRecieveRequest(){
	//We add an event listener to trigger when we recieve a message
	browser.runtime.onMessage.addListener(requestFromBrowserAction => {
		//Check if the extension want's the page's outerHTML.
		if (requestFromBrowserAction.request==="The browserAction would like your page's outerHTML"){
			//If it does want the outerHTML, then send a respond.
			var pageHTML = getPageHTML();
			//The send response is as simple as returning a new Promise that resolves with the new message.
			return Promise.resolve({response: pageHTML});
		}
	});
}


/*==========================
NAME: notifyExtension()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "notifyExtension()" tells the extension that there are buttons on the page.
==========================*/
function notifyExtension(e) {
  //browser.runtime.sendMessage({pageLoaded: true});
  if (document.querySelector('[aria-label*="Add"]')) { //There are Add Buttons on the page
    browser.runtime.sendMessage({addButtons: true});    //send message
  } else if(document.querySelector(`[aria-label = "Undo"]`) || window.location.href.match(".*.\/\/.*\.facebook\.com\/friends\/center\/requests\/outgoing\/.*")){ //There are Undo Buttons on the page
    browser.runtime.sendMessage({undoButtons: true});   //send message
  } else if(window.location.href.includes("search")){//Even if there are not Add Buttons, if we search, we will want to put the buttons on search pages.
	  browser.runtime.sendMessage({addButtons: true});    //send message
  }else{
      return;   //do nothing
  }
}

//Run all our nice functions to actually do stuff
startHidingAllProfilePicturesAndOtherThings();
window.addEventListener("load", notifyExtension);
addEventListenerToRecieveRequest();
