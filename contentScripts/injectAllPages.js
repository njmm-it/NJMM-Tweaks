/*=============INJECTALLPAGES.JS================
DESCRIPTION:    injectAllPages.js has multiple responsibilities.
			1. Hide all profile images (i.e. changes them to another image).
			2. Optionally hides the Newsfeed, Videos, and all other images, based on what the configurations saved in the browser storage.
			3. Changes the Header Color of the facebook page to match the configuration in browser storage.
			4. Check if there are add-buttons on the page. If so, ask background.js to inject newScript.js into the page.
AUTHOR:         Elder Andrew P. Sansom, Elder Kai C.K. Reyes 
VERSION:        ???
VERSION DATE:   ???
=============INJECTALLPAGES.JS================*/

/*The custom CSS strings to block certain things*/
//var hideImagesCSS = `.img:not(.sp_WqQYiaz38Hu_1_5x):not(.sx_efa8ad),[role=img] {display:none}`; //Old one
const hideImagesCSS = `[src*=scontent],[style*=scontent] {visibility:hidden}`; //If 'Hide All Images' is selected, this will be injected.
const hideVideosCSS = `video,#u_ps_0_0_n {display:none}`;//If 'Hide Videos' is selected, this will be injected.
const hideNewsfeedCSS = `#m_newsfeed_stream,#recent_capsule_container,[role=feed],.feed,#tlFeed {display:none}`; //If 'Hide Newsfeed' is selected, this will be injected.
const hideAdsCSS = `#pagelet_ego_pane {display:none}`; //If 'Hide Ads' is selected, this will be injected.

/*===IMPORTANT===
This helps us find all the profile images. 
This was found after what likely adds up to hours and hours of manually finding attributes that will find profile images without finding others. 
If that breaks, sorry. There's probably a better way to find them, but this is the best we have for now.
===IMPORTANT===*/
const hideProfileSelector = `._s0,.bm,.img[class*="Prof"],.img[class*="prof"],.img[id*="prof"],.img[id*="Prof"],.img[alt=""],.img.UFIImageBlockImage,.img[alt*="Prof"],._4ld-,[alt*="Seen by"],.img.UFIActorImage`;

const profilePhotoURL = browser.extension.getURL("icons/prof.png"); //This is the default image that we will replace all the profile pictures with.
var hmode = false; //This activates the easter egg mode.


//console.log("Activated Inject All Pages!")




/*==========FUNCTIONS=============*/
/*Add the appropriate settings CSS*/
/*==========================
NAME: onError
INPUTS: Error error that is the error that is fed by a Promise.
OUTPUTS: void
DESCRIPTION: "onError(error)" outputs error to the console.
==========================*/
function onError(error) {
    console.log(`Error: ${error}`);
}

/*==========================
NAME: startHidingAllProfilePicturesAndOtherThings
INPUTS: void
OUTPUTS: void
DESCRIPTION: "startHidingAllProfilePicturesAndOtherThings()" starts hiding all profile images on the page. 
	It also checked if hmode is enabled, and sets the variable as such. It also checks if we should block 
	other things and block those, too.
==========================*/
function startHidingAllProfilePicturesAndOtherThings(){
	//Hide Profile Images and Hessifymode
	browser.storage.local.get("color").then((result)=>{
		//This changes the header bar to the color put into the options UI.
		var color = result.color.toLowerCase();
		changeColorOfHeader(color);
		if (result.color.toLowerCase().includes("hess")){
			hmode = true;
		} 

		//Load all the stuff, as long as we're not on a group page.
		if (!window.location.href.match("groups\/*")){
			browser.storage.local.get("allImages").then(result => {if(result.allImages){installCSS(hideImagesCSS);}}, onError);
			browser.storage.local.get("videos").then(result => {if(result.videos){installCSS(hideVideosCSS);}}, onError);
			browser.storage.local.get("newsfeed").then(result => {if(result.newsfeed){installCSS(hideNewsfeedCSS);}}, onError); //This is easier to just delete the newsfeed altogether.
		} else {
			//If the page is open to a group page, then we can 
		}

	},onError);
	
	//THIS MAKES THE PROFILE IMAGES HIDE EVERY HALF SECOND!!
	//IF THEY ARE NOT HIDING PROPERLY, CHECK function hideProfileImages()!!
	setInterval(hideProfileImages,500); //hide the images
}

/*==========================
NAME: hideProfileImages()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "hideProfileImages()" hides the profile images on the page. It will only hide them if we are not on a group page. This is intentional.
==========================*/
function hideProfileImages(){
	//We are going to hide the profile images using different URLs and a slightly different selector depending on whether or not hmode is on.
	var list;
	var profileURL;
	if (window.location.href.match("groups\/*")){
		//If we are on a group page, it's okay to show the profile pictures.
		console.log("hideProfileImages() thinks that we're on a group page!");
		list = document.querySelectorAll(hideProfileSelector);
		for (var i = 0; i <list.length;i++){
			if (list[i].getAttribute('srcOriginal')){
				//If the is a srcOriginal attribute, that means that the image was originally blocked but shouldn't be any more. 
				//I'm not sure why we would ever actually need this, but it seemed like a good idea at the time. And it doesn't actually break anything.
				//If some future programmer believes this is vestigial, por favor remove it.
				list[i].setAttribute('src',list[i].getAttribute('srcOriginal'));
			}
			list[i].classList.add(`njmm-override`); //Adding this class tells the filter to not block it. Also, probably vestigial.
			list[i].style.visibility="visible"; //Force it to be visible, just in case.
		}
	} else {
		//If we aren't on a group page, then we should hide all the profile pictures
		console.log("hideProfileImages() thinks that we are NOT on a group page!");
		console.log("hmode is on?: " + hmode);
		//This next conditional exists so that we can simply use the same "replacement" code, regardless of what it's being replaced to.
		//If hmode is true, then we should use the easter egg selector and url, instead of the default.
		if (hmode===true){
			//If easter egg mode is on, then we should replace all the images with the easter egg image instead.
			list = document.querySelectorAll(`.img:not(.sp_WqQYiaz38Hu_1_5x):not(.sx_efa8ad),[role=img],video,#u_ps_0_0_n`+`,`+hideProfileCelector);
			profileURL = browser.extension.getURL("icons/h.jpg");//Use the hmode profile image
		} else {
			list = document.querySelectorAll(hideProfileSelector);
			profileURL = profilePhotoURL;
		}
		//This will loop over 
		for (var i = 0; i <list.length;i++){
			var wid = list[i].width; //We need the width because the browser will adjust the element's width and height when we change the source. Retaining this will allow us to fix them.
			var hei = list[i].height; //Ditto
			//We want to be able to grab the original source later
			//This is probably vestigial. If some future programmer wants to remove it, feel free.
			//I can't be bothered to test the code without it.
			if (!list[i].getAttribute('srcOriginal')){
				list[i].setAttribute('srcOriginal',list[i].getAttribute('src'));
			}
			list[i].setAttribute(`src`,`${profileURL}`); //Change the source, if it uses the source attribute
			list[i].classList.add(`njmm-override`); //Adding this class will tell the selectors to not hide it.
			list[i].style.backgroundImage = `url("${profileURL}")`;//Change the source, if it uses the backgroundImage attribute
			list[i].style.visibility="visible"; //Force it to be visible anyway, just in case.
			list[i].width = wid; //Set the width to the original width.
			list[i].height = hei; //Set the height to the original height
		}
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
NAME: changeColorOfHeader
INPUTS: string desiredColor is the color that we want to change the Header
OUTPUTS: void
DESCRIPTION: "changeColorOfHeader(desiredColor)" changes the color of the Facebook header bar to the color designated in words by the string desiredColor, and the outlines of the header and search bar to a darker version of that color for style. This is done
by finding and selecting the header element and search bar element, changing their respective background color, and then darkening the background color and changing the respective border and bottom border colors to the darkened color.
==========================*/
function changeColorOfHeader(desiredColor) {
    console.log(`Attempting to Change Color...`)
    var colorTag = document.createElement("style");
    function colorToRGBA(color) {
        // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
        // color must be a valid canvas fillStyle. This will cover most anything
        // you'd want to use.
        // Examples:
        // colorToRGBA('red')  # [255, 0, 0, 255]
        // colorToRGBA('#f00') # [255, 0, 0, 255]
        var cvs, ctx;
        cvs = document.createElement('canvas');
        cvs.height = 1;
        cvs.width = 1;
        ctx = cvs.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return ctx.getImageData(0, 0, 1, 1).data;
    }

    function byteToHex(num) {
         // Turns a number (0-255) into a 2-character hex number (00-ff)
        return ('0'+num.toString(16)).slice(-2);
    }

    function colorToHex(color) {
        // Convert any CSS color to a hex representation
        // Examples:
        // colorToHex('red')            # '#ff0000'
        // colorToHex('rgb(255, 0, 0)') # '#ff0000'
        var rgba, hex;
        rgba = colorToRGBA(color);
        hex = [0,1,2].map(
            function(idx) { return byteToHex(rgba[idx]); }
            ).join('');
        return "#"+hex;
    }

    function shadeColor(color, percent) {
        //I found this online. I have no idea how it works, but you just need to put the color in as a Hex code (by using the conversion functions above), and the percent as a decimal between -1 and 1 (-.2 is darkening 20%, .5 is lightening 50%, etc.)
        //It outputs a Hex string. If you input a nonsense Hex color or a percentage out of the range, it will still run, but it will output a nonsense Hex color.
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }
    function changeColor(){
        //Finds the header element and actually executes the color change by changing the header element's background color. desiredColor pulls from the parent function; the color change will work with all valid HTML color names or with Hex codes.
        //There are some manually translated colors in here (like an "if" statement for "red") because the default HTML color looks stupid. You can also add custom extra colors to be recognized like gradients, however the outlines will be black for gradients.
        console.log(`Changing header`); //For debug purposes. If this prints in console, it means the function was run.
        //var headerElementID = document.getElementsByClassName("_2t-a _26aw _5rmj _50ti _2s1y")[0].id;
        //var headerElement = document.getElementById(headerElementID);
        var headerElement = document.querySelector(`[role = "banner"],[data-sigil = "MTopBlueBarHeader"]`);
        //This finds Facebook's header element based on it's role and data-sigil characteristics. Facebook sometimes changes characteristics of its web elements
        //so if that happens, you may need to update this with better, or more accurate characteristics so the add-on can find it.
        if (desiredColor === "red") { //default HTML red looks dumb. This makes it a darker, more professional red. Courtesy of Elder Berrett.
            desiredColor = "#dd3b3b";
        }
        else if (desiredColor === "blue") {//same thing for blue. This makes it look like "Facebook Blue" which is the default color
            desiredColor = "#4267b2";
        }
        else if (desiredColor === "green") {
            desiredColor = "#28a13f";
        }
        else if (desiredColor === "yellow") {
            desiredColor = "#ead600";
        } else if (desiredColor === "rainbow"){ //This is adding a custom color (or colors). We are manually setting the input "rainbow" to be accepted, and then to return a custom gradient.
            desiredColor = "linear-gradient(to left, #dd3b3b,orange,#ead600,#28a13f,#4267b2,indigo,violet)";
        }
        headerElement.style.background = desiredColor; //This actually sets the headerElement as the color we want based on the HTML color word or the hex value based on the if/then statements right before this.
    }
    function changeBorderColor(){ //When we change the header color, the border looks really dumb because it stays dark blue by default. This changes the border (of the header bar and the search bar inside the header bar) to a
                                  //darkened version of the color that we're changing the header too.  
        console.log(`Changing border`); //This is printed out in the console so we know that the function ran. Used for debugging.
        var outlineElement = document.querySelector(`[role = "banner"],[data-sigil = "MTopBlueBarHeader"]`); //This selects the header bar and designates it as "outlineElement"
        var searchElement = document.querySelector(`[role = "search"], [data-testid = "facebar_root"]`); //This selects the search bar and designates it as "searchElement"
        var popOver = document.querySelector(`.popoverOpen`);
        var desiredBorderColor = "#29487d"; //This makes the default 
        if (desiredColor === "blue") {
            desiredBorderColor = "#29487d"
        }
        else {
            //console.log("I'm line 106");
            desiredBorderColor = colorToHex(desiredColor);
            //console.log(desiredBorderColor);
            desiredBorderColor = shadeColor(desiredBorderColor, -0.2);
            //console.log(desiredBorderColor);
            //console.log("I'm going to try to spit out popOver:");
            //console.log(popOver);
            //if(popOver){
            //    popOver.style.background = desiredBorderColor;
            }
	    colorTag.innerHTML = `.popOver > a {background : ${desiredBorderColor}}`;
	    head.appendChild(colorTag);
            outlineElement.style.borderBottom = `1px solid ${desiredBorderColor}`;
            searchElement.style.border = `1px solid ${desiredBorderColor}`;
            searchElement.style.borderBottom = `1px solid ${desiredBorderColor}`; 
        }
    }
    if (document.readyState === "loading") {            //Occasionally, it'll try to load before the page has loaded the Document Object Model (DOM). This is an issue. This checks if it's loaded or not.
        document.addEventListener("DOMContentLoaded", changeColor);    //Once the DOM is loaded, it will then fire the main function.
        document.addEventListener("DOMContentLoaded", changeBorderColor);    //Once the DOM is loaded, it will then fire the main function.
        document.addEventListener("DOMContentLoaded", function(){setTimeout(changeBorderColor, 3000)});
    } else {  // `DOMContentLoaded` already fired, so the DOM has been loaded.
        console.log(desiredColor); //debug
        changeColor(); //Run that puppy.
        console.log(desiredColor);
        changeBorderColor(); //debug
        console.log(desiredColor); //debug
    }
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
  } else{
      return;   //do nothing
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

(function main(){
	startHidingAllProfilePicturesAndOtherThings();
	window.addEventListener("load", notifyExtension);
	addEventListenerToRecieveRequest();

	/*
	//We check if the page is still loading. If it is, then we wait until it has finished loading to run the script/
	//We commented this out, because we realized that we shouldn't actually wait to load this. Once the script is loaded, it's fine.
	if (document.readyState === "loading") { //Occasionally, it'll try to load before the page has loaded the Document Object Model (DOM). This is an issue. This checks if it's loaded or not.
            document.addEventListener("DOMContentLoaded", startHidingAllProfilePicturesAndOtherThings);
        } else { // `DOMContentLoaded` already fired, so the DOM has been loaded.
            startHidingAllProfilePicturesAndOtherThings();
        }
	*/		
})();
