/* THIS IS THE NEW SCRIPT THAT WILL BE INJECTED INTO ALL PAGES. newScript.js will be injected as requested. */

/*The custom CSS strings to block certain things*/
//var hideImagesCSS = `.img:not(.sp_WqQYiaz38Hu_1_5x):not(.sx_efa8ad),[role=img] {display:none}`; //Old one
var hideImagesCSS = `[src*=scontent],[style*=scontent] {visibility:hidden}`;
var hideVideosCSS = `video,#u_ps_0_0_n {display:none}`;
var hideNewsfeedCSS = `#m_newsfeed_stream,#recent_capsule_container,[role=feed],.feed,#tlFeed {display:none}`;
var hideAdsCSS = `#pagelet_ego_pane {display:none}`;
var hideProfileCSS = `._s0,.bm,.img[class*="Prof"],.img[class*="prof"],.img[id*="prof"],.img[id*="Prof"],.img[alt=""],.img.UFIImageBlockImage,.img[alt*="Prof"],._4ld-,[alt*="Seen by"],.img.UFIActorImage`;
var profilePhotoURL = browser.extension.getURL("icons/prof.png");
var hmode = false;

console.log("Activated Inject All Pages!")

/*Add the appropriate settings CSS*/
function onError(error) {
    console.log(`Error: ${error}`);
}

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
setInterval(hideProfileImages,500); //hide the images


function hideProfileImages(){
	//We are going to hide the profile images using different URLs and a slightly different selector depending on whether or not hmode is on.
	var list;
	var profileURL;
	if (window.location.href.match("groups\/*")){
	//If we are on a group page, it's okay to show the profile pictures.
		console.log("hideProfileImages() thinks that we're on a group page!");
		list = document.querySelectorAll(hideProfileCSS);
		for (var i = 0; i <list.length;i++){
			if (list[i].getAttribute('srcOriginal')){
				list[i].setAttribute('src',list[i].getAttribute('srcOriginal'));
			}
			//list[i].setAttribute(`style`,list[i].style+`background-image: ${list[i].getAttribute('srcOriginal')}`);
			//list[i].style.backgroundImage = list[i].getAttribute('srcOriginal');
			list[i].classList.add(`njmm-override`);
			list[i].style.visibility="visible";
		}
	} else {
	//If we aren't on a group page, then we should hide all the profile pictures
		console.log("hideProfileImages() thinks that we are NOT on a group page!");
		console.log("hmode is on?: " + hmode);
		if (hmode===true){
			list = document.querySelectorAll(`.img:not(.sp_WqQYiaz38Hu_1_5x):not(.sx_efa8ad),[role=img],video,#u_ps_0_0_n`+`,`+hideProfileCSS);
			profileURL = browser.extension.getURL("icons/h.jpg");//Use the hmode profile image
		} else {
			list = document.querySelectorAll(hideProfileCSS);
			profileURL = profilePhotoURL;
		}
		for (var i = 0; i <list.length;i++){
			
			var wid = list[i].offsetWidth;
			var hei = list[i].offsetHeight;
			//We want to be able to grab the original source later
			if (!list[i].getAttribute('srcOriginal')){
				list[i].setAttribute('srcOriginal',list[i].getAttribute('src'));
			}
			list[i].setAttribute(`src`,`${profileURL}`);
			//list[i].setAttribute(`style`,list[i].style+`background-image: ${profileURL}`);
			list[i].classList.add(`njmm-override`);
			list[i].style.backgroundImage = `url("${profileURL}"})`;
			list[i].style.visibility="visible";
			list[i].width = wid;
			list[i].height = hei;	
		}
	}

}
function installCSS(code){
    console.log(`Installing CSS: ${code}`);
    var cssInject = document.createElement("style");
    cssInject.setAttribute("type","text/css");
    cssInject.innerHTML = code;
    document.head.appendChild(cssInject);
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
            console.log("I'm line 106");
            desiredBorderColor = colorToHex(desiredColor);
            console.log(desiredBorderColor);
            desiredBorderColor = shadeColor(desiredBorderColor, -0.2);
            console.log(desiredBorderColor);
            console.log("I'm going to try to spit out popOver:");
            console.log(popOver);
            if(popOver){
                popOver.style.background = desiredBorderColor;
            }
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
NAME: recieve the requestPageHTML and send a response with the getPageHTML function's output.
INPUTS: void
OUTPUTS: string that represents the page's HTML.
DESCRIPTION: "getPageHTML()" returns the page's HTML.
==========================*/
browser.runtime.onMessage.addListener(requestFromBrowserAction => {
  if (requestFromBrowserAction.request==="The browserAction would like your page's outerHTML"){
      var pageHTML = getPageHTML();
      return Promise.resolve({response: pageHTML});
  }
});


window.addEventListener("load", notifyExtension);

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


























/*==========================
NAME: long-press.js
INPUTS: void
OUTPUTS: void
DESCRIPTION: This adds the long-press event to the html DOM. Courtesy of John Doherty <www.johndoherty.info> under the MIT license. This will be used to determine whether or not an image should be hidden.
==========================*/

/*!
 * long-press.js
 * Pure JavaScript long-press event
 * https://github.com/john-doherty/long-press
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
!function(t,e){"use strict";function n(){this.dispatchEvent(new CustomEvent("long-press",{bubbles:!0,cancelable:!0})),clearTimeout(o),console&&console.log&&console.log("long-press fired on "+this.outerHTML)}var o=null,u="ontouchstart"in t||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0,s=u?"touchstart":"mousedown",i=u?"touchcancel":"mouseout",a=u?"touchend":"mouseup",c=u?"touchmove":"mousemove";"initCustomEvent"in e.createEvent("CustomEvent")&&(t.CustomEvent=function(t,n){n=n||{bubbles:!1,cancelable:!1,detail:void 0};var o=e.createEvent("CustomEvent");return o.initCustomEvent(t,n.bubbles,n.cancelable,n.detail),o},t.CustomEvent.prototype=t.Event.prototype),e.addEventListener(s,function(t){var e=t.target,u=parseInt(e.getAttribute("data-long-press-delay")||"1500",10);o=setTimeout(n.bind(e),u)}),e.addEventListener(a,function(t){clearTimeout(o)}),e.addEventListener(i,function(t){clearTimeout(o)}),e.addEventListener(c,function(t){clearTimeout(o)})}(this,document);

function isImg(ob){
    if (ob.classList.contains("img")){
        return true;
    } else {
        return false;
    }
}

function findTheEmbeddedImage(ob){
    if (isImg(ob) === true){ //ob is an image
	console.log(`Found the image!`, ob);
        return ob; //return ob
    } else {
        for (var i = 0; i < ob.children.length; i++){ //runs over each childNode
	    console.log(`Checking if child is image!`, ob.children[i]);
            if (isImg(ob.children[i])===true){ //check if is an image.
		console.log(`Found the image!`, ob.children[i]);
                return ob.children[i]; //If so, return this new object
            } else if (findTheEmbeddedImage(ob.children[i]) !== null){
                return findTheEmbeddedImage(ob.children[i]);             //If not, run this same function on this childNode
            }
	}
	console.log(`No image found in`, ob);
        return null;    //if none of the children have images, then return null.
    }
}

function hideImage(){
    
}

function showImage(){
    
}



// listen for long-press events
document.addEventListener('long-press', function(e) {
    var object = findTheEmbeddedImage(e.target);
    if (object !== null){
        object.setAttribute('njmmImgOverride', 'true');    
    }
    
});

