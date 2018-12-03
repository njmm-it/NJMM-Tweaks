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
	e.preventDefault();
	executeSearch();
    	return false;
    }
});

//Add the addEventListener that will save the form data to Browser Storage everytime the form is modified.

addAllListenersThatSaveData();

//Autofill the form as soon as the page is fully loaded.
getJsonDataFromBrowserStorage().then(autofillFromJSON);


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
OUTPUTS: object that represents the JSON data
DESCRIPTION: "convertCriteriaToJSON()" creates an object that will be passed to executeScript to save the criteria to the browser storage.
==========================*/
function convertCriteriaToJSON(){
	var arrayOfInputs = []; //Basically, we'll put the datas
	var arrayOfSelects = [];
	var allInputs = document.getElementsByTagName("input");
	for (var input of allInputs){
		arrayOfInputs.push([input.id,input.type,input.checked,input.value]);
	}
	var allSelects = document.getElementsByTagName("select");
	for (var input of allSelects){
		arrayOfSelects.push([input.id,input.selectedIndex]);
	}
	var finalObject = {allObjects:{inputs:arrayOfInputs,selects:arrayOfSelects}}
	return finalObject;
}
/*==========================
NAME: saveJsonToBrowserStorage(jsonObject)
INPUTS: object jsonObject is the json object to be saved to the Browser Storage.
OUTPUTS: void
DESCRIPTION: "saveJsonToBrowserStorage()" saves the jsonString to the Browser Storage
==========================*/
function saveJsonToBrowserStorage(jsonObject){
	return browser.storage.local.set(jsonObject);
}
/*==========================
NAME: saveDataToBrowserStorage()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "saveDataToBrowserStorage()" saves the data on the page to the Browser Storage. Equivalent to saveJsonToBrowserStorage(convertCriteriaToJSON()).
==========================*/
function saveDataToBrowserStorage(){
	saveJsonToBrowserStorage(convertCriteriaToJSON());
}
/*==========================
NAME: autofillFromJSON(inputFromBrowserStorage)
INPUTS: Object object that contains the input and outputArrays
OUTPUTS: void
DESCRIPTION: "autofillFromJSON()" takes inputFromBrowserStorage and fills in the form using the data saved there.
==========================*/
function autofillFromJSON(object){
	var inputs = object.allObjects.inputs;
	//Iterate over the inputs first
	for (var input of inputs){
		console.log("Checking the saved input ", input);
		if (input[1]==="checkbox"){
			//This is the type of the input that is saved
			document.getElementById(input[0]).checked = input[2];//The original checked property is there.
		} else {
			document.getElementById(input[0]).value = input[3];//The original value property is there.
		}
	}

	var selects = object.allObjects.selects;
	//Then interate over the selects
	for (var select of selects){
		console.log("Checking the saved select ", select);
		if (select[0]==="people-pronoun" && window.location.href.includes("#friendsOnly")){
			document.getElementById("people-pronoun").selectedIndex = 2;//This will set it to friends, because that is the Selected Index of the Friends option.
		} else {
			document.getElementById(select[0]).selectedIndex = select[1];//The original selectedIndex is hidden away there.
		}
	}
}
/*==========================
NAME: getJsonDataFromBrowserStorage()
INPUTS: void
OUTPUTS: Promise which when fulfilled represents what is stored in the browser Storage.
DESCRIPTION: "getJsonDataFromBrowserStorage()" takes the JSON in browser.storage and passes it.
==========================*/
function getJsonDataFromBrowserStorage(){
	return browser.storage.local.get("allObjects")
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
						
						
						//if (field.parentNode.querySelector('input').value.length > 0 && isVisible(field.parentNode.querySelector('input'))){
						if (getVisibleChild(field.parentNode,'input').value.length > 0){
							//The issue is that thie needs to get the visible children, but it only gets the children and checks if it's visible.
							if (getVisibleChild(field.parentNode,`select`).value.length > 0){
								encodedSearchQuery += "%f1/%f2/date-2/users-born/".replace("%f1",getVisibleChild(field.parentNode,'input').value).replace("%f2",field.parentNode.querySelector('select').value);
							} else {
								encodedSearchQuery += "%f1/date/users-born/".replace("%f1",getVisibleChild(field.parentNode,'input').value);
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
NAME: getVisibleChild(element,selector)
INPUTS: DOMelement element that will be checked if it is visible
		string selector that represents the CSS selector to find.
OUTPUTS:  DOMelement that is the first visible child of element
DESCRIPTION: "getVisibleChild(element,selector)" finds all elements that match the CSS selector that are also visible. Emulates the :visible psuedo-selector in jquery.
==========================*/
function getVisibleChild(element,selector){
	var children = element.querySelectorAll(selector);
	for (var child of children){
		if (isVisible(child)){
			return child;
		}
	}
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

/*==========================
NAME: addAllListenersThatSaveData()
INPUTS: void
OUTPUTS: void
DESCRIPTION: "addAllListenersThatSaveData()" generates all the page event listeners necessary to save all the data to browser storage everytime the page is modified. This uses the same hack as options.js.
==========================*/
function addAllListenersThatSaveData(){
    /*if (document.querySelector("form") !== null){
        document.querySelector("form").addEventListener("submit", saveOptions);
        var elements = document.querySelectorAll("*");
        for (var j = 0;j<elements.length;j++){
            elements[j].addEventListener("change",saveOptions);
        }
    }*/
    
    //Is this the most hacky way of fixing the save? Yes. Yes it is. But it came after much prayer and contemplation. So we're going for it.
    //This will simply save the settings everytime an event listed in "eventList" is triggered.
    
    var eventList = ["click","paste","keyup","select","beforeunload"];
    for (var eve = 0; eve <eventList.length;eve++){
        document.addEventListener(eventList[eve],saveDataToBrowserStorage);
    }
    
    
}
