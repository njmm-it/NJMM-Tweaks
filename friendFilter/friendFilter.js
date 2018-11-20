/*==========Stuff that needs to run immediately===========*/
/*==========================================================
Basically, this script does three things. 
1.It autofills the form with data representing the previous search, which is saved to the Browser Storage.
2.It sets an event listener that will save the form data to the Browser Storage everytime the form is modified.
2.It sets an event listener that will save to the Browser Storage one last time and then direct the tab to the search results URL.
==========================================================*/

//Add the addEventListener that will execute the Search when the submit is pressed.
document.addEventListener("click",function (e){
    console.log("Page was clicked on ");
    console.log(e.target);
    if (e.target.classList.contains("submit")){
    	//dosearch();
	executeSearch();
    	return false;
    }
});

//Add the addEventListener that will save the form data to Browser Storage everytime the form is modified.
//TODO: Do the thing.

//Autofill the form as soon as the page is fully loaded.
autofillFromJSON(getJsonDataFromBrowserStorage());


/*==========FUNCTION DECLARATIONS=============*/

/*==========================
NAME: executeSearch()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "executeSearch()" generates a URL based on the criteria in the html form, saves the criteria to a json file in the browser storage, then creates a new tab with said url. 
==========================*/
function executeSearch(){
	/*Save the form data to a JSON file, so that it can be autopopulated the next time the form page is opened.*/
	saveJsonToBrowserStorage(convertCriteriaToJSON());
	/*Redirect to the search page*/
	createNewTabWithURL(generateSearchURL());
	/*Close the Current Tab, as it has no need to be open, and avoid Tab Spam.*/
	closeCurrentTab();
}

/*FORM AUTOFILL FUNCTIONS*/
/*These functions are neded to make the page save and load its last search from JSON*/
/*==========================
NAME: convertCriteriaToJSON()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "convertCriteriaToJSON()" creates a json-string that will be passed to executeScript to save the criteria to the browser storage.
==========================*/
function convertCriteriaToJSON(){
}
/*==========================
NAME: saveJsonToBrowserStorage(jsonString)
INPUTS: string jsonString is the json object to be saved to the Browser Storage, encoded in a string.
OUTPUTS: void
DESCRIPTION: "saveJsonToBrowserStorage()" saves the jsonString to the Browser Storage
==========================*/
function saveJsonToBrowserStorage(){
}
/*==========================
NAME: autofillFromJSON(inputFromBrowserStorage)
INPUTS: Promise inputFromBrowserStorage which represents what is stored in the browser Storage.
OUTPUTS: void
DESCRIPTION: "autofillFromJSON()" takes inputFromBrowserStorage and fills in the form using the data saved there.
==========================*/
function autofillFromJSON(inputFromBrowserStorage){
}
/*==========================
NAME: getJsonDataFromBrowserStorage()
INPUTS: void
OUTPUTS: Promise which represents what is stored in the browser Storage.
DESCRIPTION: "getJsonDataFromBrowserStorage()" takes the JSON in browser.storage and passes it.
==========================*/
function getJsonDataFromBrowserStorage(){
}

/*REDIRECTION FUNCTIONS*/
/*These functions are needed to redirect the page to the desired URL.*/
/*==========================
NAME: generateSearchURL()
INPUTS: void
OUTPUTS: string representing the search URL to redirect the browser to.
DESCRIPTION: "generateSearchURL()" reads the user-inputted data in the html form to generate the search URL.
==========================*/
function generateSearchURL(){
	var encodedSearchQuery = "";
	var finalSearchURL = "";
	//The facebook graphsearch URL search query will go here. Each element in filterFriend.html has the necesary options encoded in it. This just turns them into an actual search URL.
	var fieldsToCheckOver = document.querySelectorAll(`label select, label input`); //All of the fields that we care about are caught by one of these two selectors
	for (var field of fieldsToCheckOver){
		//Let's do some magic, field by field.
		console.log("We are about to iterate over ", field);
		if (isVisible(field)){
			//Make sure that the field is actually rendered on the page
			if (field.tagName === "SELECT"){
				//This is a <select> element.
				if (!field.disabled){
					//Verify to make sure that it's not disabled.
					if (field.selectedOptions[0].getAttribute('format') != null ){
						//if the "format" attribute is present, we use this manner.
						console.log("It had a format attribute");
						encodedSearchQuery += field.selectedOptions[0].getAttribute(`format`).replace("%f1",field.value);
					} else if (field.selectedOptions[0].getAttribute('formatnext') != null){
						//if the "formatnext" attribute is present, we'll use this manner instead.
						console.log("It had a formatnext attribute", "It's corresponding value is", field.parentNode.querySelector('input').value);
						if (field.parentNode.querySelector('input').value.length > 0){
							//Basically, this checks to see if the field has any value in it. It doesn't matter what the type of field is (for a multiple-type field) if it is blank.
							console.log("It has a nonempty value.");
							if (field.parentNode.querySelector('input').getAttribute('fid') != null){
								//if there is a fid attribute that we should replace something in the field with
								console.log("It had an fid");
								encodedSearchQuery += field.selectedOptions[0].getAttribute('formatnext').replace("%f1", field.parentNode.querySelector('input').getAttribute('fid'));
							} else {
								console.log("It had no fid");
								encodedSearchQuery += field.selectedOptions[0].getAttribute('formatnext').replace("%f1","str/" + field.parentNode.querySelector(`input`).value + "/pages-named");
							}

						} else {
							console.log("It had an empty value.");
							//If the field is empty, there is no need to do anything, so there is no corresponding else statement.
						}
						
					} else if (field.selectedOptions[0].getAttribute(`bornsearch`) != null){
						//If there is a date selected, clearly we have to handle it differently!
						//First we check if the month is selected, then stick in the date.
						//TODO: Emulate the ":visible" jquery pseudoselector
						console.log("It had a bornsearch attribute");
						
						if (field.parentNode.querySelector('input').value.length > 0 && isVisible(field.parentNode.querySelector('input'))){
							if (field.parent.querySelector(`select`).value.length > 0 && isVisible(field.parent.querySelector(`select`))){
								encodedSearchQuery += "%f1/%f2/date-2/users-born/".replace("%f1",field.parentNode.querySelector('input').value).replace("%f2",field.parentNode.querySelector('select').value);
							} else {
								encodedSearchQuery += "%f1/date/users-born/".replace("%f1",field.parentNode.querySelector('input').value);
							}
						}
					
					}
					
					
					}
					
				}
			} else {
				//This is not a <select> element, therefore it must be an <input> element
				//First check if it has a specified format and that the value is nonempty
				if ( (field.getAttribute('format') != null) && (field.value.length > 0) ){

					if (field.getAttribute('nostr') != null) {
						//If the field has a "nostr" attribute, then we don't add /str/ at the end.
						encodedSearchQuery += field.getAttribute('format').replace("%f1",field.value);
					} else if (field.getAttribute('fid') != null){
						//If the field has an FID, if it does not, then it should be used as a string.
						encodedSearchQuery += field.getAttribute('format').replace("%f1", field.getAttribute('fid'));
					} else {
						encodedSearchQuery += field.getAttribute('format').replace("%f1", "str/" + field.value + "/pages-named").replace("%af1",field.value);
					}
				}

				console.log(encodedSearchQuery); //Just so we can see what the encodedSearchQuery is.
				//Now we can make the the search URL! Yay!

			}
		}
		
	}
	
	if (encodedSearchQuery.length>0){
		//Make sure the encodedSearchQuery isn't empty, otherwise the next part will return an error.
		if (isTheDeviceMobile()){
			//The device truly is mobile, so we should feed it the mobile site.
			finalSearchURL = "https://m.facebook.com/graphsearch"+encodedSearchQuery+"intersect/";
		} else {
			//The device is not mobile, so we should feed it the desktop site.
			finalSearchURL = "https://www.facebook.com/search/"+encodedSearchQuery+"intersect/";	
		}
	} else {
		//If the encodedSearchQuery is empty, then searching will break facebook. I fear that this could set off some error reporting thing, so I felt to leave this blank.
		finalSearchURL = "";
	}
	return finalSearchURL;
	
}

/*==========================
NAME: isTheDeviceMobile()
INPUTS: void
OUTPUTS: boolean that is true if run on a mobile device, and false if not.
DESCRIPTION: "isTheDeviceMobile()" determines whether the device is mobile or not.
==========================*/
function isTheDeviceMobile() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
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
NAME: createNewTabWithURL(desiredURL)
INPUTS: string desiredURL is the URL that we need to redirect the browser to.
OUTPUTS: void
DESCRIPTION: "createNewTabWithURL(desiredURL)" takes desiredURL and creates a new browser tab directed to the desiredURL. 
	If desiredURL is blank, then it alerts the user to not make a blank selection. 
	Theoretically, it should never be blank. But you can never be sure nowadays.
==========================*/
function createNewTabWithURL(desiredURL){
	if (desiredURL.length > 0){
		var newTab = browser.tabs.create({
            url: desiredURL
        });
	} else {
		alert('Please, input some valid search criteria.');
	}
	
}
/*==========================
NAME: closeCurrentTab()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "closeCurrentTab()" closes the tab that called it.
==========================*/
function closeCurrentTab(){
	//window.close();
}
