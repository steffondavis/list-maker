// Welcome to the Curalytics javascript curation tool.
// This is a javascript list-making utility. Use it to quickly built the front-end to your wishlist, list-making, collection etc. tools
// It's written in pure-javascript with no dependencies.
// Curalytics is total curation system and provides a RESTful back-end interface to this list-making tool as well so you can easily add a unified list-making tool to all of your apps
// Learn more at http://curalytics.com

// A collected piece of content typically contains information from three sources:
// 1. The logged-in user information
// 2. The information of the content being collected
// 3. The collection itself
// Since this demo has no logged-in user, a sample one is defined in the variable userData:
userData = {
    "userID": 203,
    "userName": "Bobby",
    "userThumbnailUrl": "https://s-media-cache-ak0.pinimg.com/236x/5d/ff/9b/5dff9b231abc664c147f413acacdd4e0.jpg"
}

const uid = userData["userID"]; // Assigns userID as the constant "uid" for easy access later.

// Default Collection Titles
// It's nice to provide users with a few default collection names:
defaultCollectionTitles = ["Favorites", "My Top Picks", "Gift Ideas"]


//////////////////////////////////////////////////////////////////////
// BUTTON
// Make the button
//////////////////////////////////////////////////////////////////////

// Button
// Append to the div "curabutton"
var savebtn = document.createElement('button');
savebtn.id = 'curaLoveBtn';
savebtn.className = 'cura-bt';
savebtn.addEventListener('click', openModal); //Add "onclick" listener to each button. It will trigger the function openModal.
savebtn.addEventListener('click', readUsersCollections);

// The button should be associated with a specific piece of content so it can store that content's information as HTML too. This will allow the button to pass the content information along when pressed.
// In this example, it grabs values from the content DIV with which it's associated. But in your app, read the correct values into the button attributes.
savebtn.setAttribute('data-contentName', document.getElementById("sample-item").getAttribute("data-contentname"));  // CUSTOMIZE ME
savebtn.setAttribute('data-contentID', document.getElementById("sample-item").getAttribute("data-contentid"));  // CUSTOMIZE ME
savebtn.setAttribute('data-contentthumbnailurl', document.getElementById("sample-item").getAttribute("data-contentthumbnailurl"));  // CUSTOMIZE ME

document.getElementById("curabutton").appendChild(savebtn);

// Button image
// Includes an image inside the button
var btnimg = document.createElement('img');
btnimg.id = 'curaBtnImg';
btnimg.className = 'curaBtnImg';
btnimg.src = 'bt-heart.png';
document.getElementById("curaLoveBtn").appendChild(btnimg);

// Button text.
// Append it after the image.
var btnText = document.createTextNode("Save");
document.getElementById("curaLoveBtn").appendChild(btnText);


//////////////////////////////////////////////////////////////////////
// MODAL
// Make the collection selection modal box
//////////////////////////////////////////////////////////////////////

// Semi-transparent black background
var curaSaveModal = document.createElement('div');
curaSaveModal.id = "curaSaveModal";
curaSaveModal.className = "cura-modal";
document.getElementsByTagName('body')[0].appendChild(curaSaveModal);

// Modal content
var curaModalContent = document.createElement('div');
curaModalContent.id = "cura-modal-content";
curaModalContent.className = "cura-modal-content";
document.getElementById("curaSaveModal").appendChild(curaModalContent);

// Populate the modal with the user's collections
// In this example, only the default collections will load.
readUsersCollections(uid); //Pass the User ID

function readUsersCollections(uid){
    // Read: User's Collections. Accepts a userID

    // Clear any HTML in the modal so it can be rebuilt with any changes included.
    document.getElementById("cura-modal-content").innerHTML = "";

    // "X" Close Button
    var curaCloseModalSpan = document.createElement('curaCloseModalSpan');
    curaCloseModalSpan.innerHTML = "x";
    curaCloseModalSpan.className = "curaModalClose";
    curaCloseModalSpan.addEventListener('click', closeModalWithFade);
    document.getElementsByClassName("cura-modal-content")[0].appendChild(curaCloseModalSpan);
    
    // Title
    var curaCloseModalContentTitle = document.createElement('div');
    curaCloseModalContentTitle.innerHTML = "Pick a list";
    curaCloseModalContentTitle.className = "curaCloseModalContentTitle";
    document.getElementsByClassName("cura-modal-content")[0].appendChild(curaCloseModalContentTitle);

    // Collection Name Container
    var curaCollectionListContainer = document.createElement('div');
    curaCollectionListContainer.id = "curaCollectionListContainer";
    curaCollectionListContainer.className = "curaCollectionListContainer";
    document.getElementsByClassName("cura-modal-content")[0].appendChild(curaCollectionListContainer);
    
    // Populate Default Collection Names
    defaultCollectionTitles.forEach(function(value, i){ //forEach passes a value and index position
        // Turn Each Collection Into a Row & Link
        var colRow = document.createElement("a");
        colRow.id = "curaColRow" + 99999999999 + i;
        colRow.className = "curaColRow";
        colRow.innerHTML = value;
        colRow.style.display = "block";
        colRow.href = "#";
        colRow.setAttribute('data-collectionname', value);
        colRow.setAttribute('data-collectionid', i); // The Curalytics API assigns collection IDs on the back-end. It's important to consider how you're generating your collectionID. A default entry is put here.
        colRow.addEventListener('click', curaPostContentDefaultCollection); // Triggers a function that will post this content to a database.
        colRow.addEventListener('click', curaConfirmSave); //Triggers a function that will confirm the content is "saved".
        document.getElementsByClassName("curaCollectionListContainer")[0].appendChild(colRow);
    });
    
    // "+ New List" Link
    var curaCreateCollection = document.createElement("a");
    curaCreateCollection.id = "curaCreateCollection";        
    curaCreateCollection.className = "curaCreateCollection";
    curaCreateCollection.innerHTML = "+ New List";
    curaCreateCollection.style.display = "block";
    curaCreateCollection.href = "#";
    //curaCreateCollection.setAttribute('data-collectionid', "1");
    document.getElementsByClassName("cura-modal-content")[0].appendChild(curaCreateCollection);

    // Div that contains the input form.
    var curaMakeBox = document.createElement('div');
    curaMakeBox.id = "curaMakeBox";
    curaMakeBox.className = "curaMakeBox";
    curaMakeBox.style.display = "none";
    document.getElementsByClassName("cura-modal-content")[0].appendChild(curaMakeBox);

    // Attach function that hides the "+ New List" Div and shows the form to name the new list
    // It comes after curaMakeBox is made so it can attach to it.
    curaCreateCollection.addEventListener('click', showMakeBox);
    
    // Input Form
    var curaMakeInputForm = document.createElement('form');
    curaMakeInputForm.id = "curaInputForm";
    curaMakeInputForm.addEventListener('submit', curaPostContentNewCollection, false); // The form takes the event listener
    document.getElementById("curaMakeBox").appendChild(curaMakeInputForm);
   
    // Input box
    var curaMakeInputBox = document.createElement('input');
    curaMakeInputBox.id = "makeInputBox";
    curaMakeInputBox.name = "collectionName";
    curaMakeInputBox.placeholder = "What is this list called?";
    document.getElementById("curaInputForm").appendChild(curaMakeInputBox);

    // Submit Button
    var savebtn = document.createElement('button');
    savebtn.id = 'curaSaveBtn';
    savebtn.className = 'cura-bt-disabled';
    savebtn.innerHTML = 'Save';
    savebtn.title = 'Please enter a title.';
    savebtn.disabled = true;
    savebtn.addEventListener('click', curaConfirmSave2);
    document.getElementById("curaInputForm").appendChild(savebtn);
}


//////////////////////////////////////////////////////////////////////
// UI ACTIONS
// Modify UI based on actions
//////////////////////////////////////////////////////////////////////

// Open modal
// Make the modal div visible
function openModal() {
    var curaModalElement = document.getElementById('curaSaveModal');
    curaModalElement.style.display = "block";
    curaFadeIn(curaModalElement); // Trigger fade-in effect
    
    // contentData stores information about the item being collected.
    // It's able to grab the item data because "this" has access to the button HTML where we stored the item data.
    // contentData will be used when saving the item.
    contentData = {};
    contentData["contentID"] = this.getAttribute("data-contentid"); // button element passed as "this". Its properties can be accessed.
    contentData["contentName"] = this.getAttribute("data-contentname");
    contentData["contentThumbnailUrl"] = this.getAttribute("data-contentthumbnailurl");
}

// Close modal
function closeModalWithFade() {
    var curaModalElement = document.getElementById('curaSaveModal');
    curaFadeOut(curaModalElement); // Trigger fade-out effect
    document.getElementById("curaCreateCollection").style.display = "block"; // Makes the "+ New List" option reappear in case it was closed
    closeMakeBox(); // Hides the "make" box
}

// Close modal
// Triggers with click outside of the modal div
window.onclick = function(event) {
    var curaModalElement = document.getElementById('curaSaveModal');
    if (event.target == curaModalElement) {
        //curaModalElement.style.display = "none";
        curaFadeOut(curaModalElement); // Trigger fade-out effect
        document.getElementById("curaCreateCollection").style.display = "block"; // Makes the "+ New List" option reappear in case it was closed
        closeMakeBox(); // Hides the "make" box
    }
}

//  Disable "save" button unless there is at least one character for the list title
function disableSaveButtonUnlessTextPresent(){
    
    var inputBox = document.getElementById("makeInputBox");
    var saveButton = document.getElementById("curaSaveBtn");

    inputBox.oninput = function(){
        if(this.value != ''){
            saveButton.disabled = false;
            inputBox.style.background = '#c9ffc6';
            saveButton.className = 'cura-bt2';
            saveButton.title = 'Ready to save!';

        }else{
            saveButton.disabled = true;
            inputBox.style.background = 'white';
            saveButton.className = 'cura-bt-disabled';
            saveButton.title = 'Please enter a title.';
        }
    };
};

// Save notification
// Turns the list name into a save notification if it's selected
function curaConfirmSave() {

    // Utility Function: Inserts a div after another div
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    //Make "Saved!" Div. Insert it after the collection name that was saved.
    var curaSaveConfirm = document.createElement('div');
    curaSaveConfirm.id = "curaSaveConfirm";
    curaSaveConfirm.className = "curaSaveConfirm";
    curaSaveConfirm.innerHTML = "Saved!";
    curaSaveConfirm.style.display = "block";

    insertAfter(this, curaSaveConfirm);
    this.style.display = "none"; //Make the collection name div before it hidden
    var hiddenCollectionElement = this //Store the collection element that we just hid.
    
    // Fade Out the Modal
    setTimeout(function() {
        curaSaveModalSaved = document.getElementById("curaSaveModal");
        curaFadeOut(curaSaveModalSaved);
    }, 800); // Sets the display time before fade out (in milliseconds)

    // Reset the collection element visibility
    setTimeout(function() {
        hiddenCollectionElement.style.display = "block";
        document.getElementById("curaSaveConfirm").remove();
        
        document.getElementById("curaCreateCollection").style.display = "block"; // Also makes the "New List" option reappear
        closeMakeBox(); // Closes the "make" box
        
    }, 1000); // Delays reseting the collection title until after the modal closes.
    
}

// Save notification 2
// Turns the "+ New List" into a save notification if a new list is created
function curaConfirmSave2() {

    // Utility Function: Inserts a div after another div
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    
    makeBox = document.getElementById("curaMakeBox");
    
    //Make "Saved!" Div. Insert it after the collection name that was saved.
    var curaSaveConfirm = document.createElement('div');
    curaSaveConfirm.id = "curaSaveConfirm2";
    curaSaveConfirm.className = "curaSaveConfirm2";
    curaSaveConfirm.innerHTML = "Saved!";
    curaSaveConfirm.style.display = "block";

    insertAfter(makeBox, curaSaveConfirm);
    makeBox.style.display = "none"; //Make the collection name div before it hidden

    // Fade Out the Modal
    setTimeout(function() {
        curaSaveModalSaved = document.getElementById("curaSaveModal");
        curaFadeOut(curaSaveModalSaved);
    }, 800); // Sets the display time before fade out (in milliseconds)

    // Reset the collection element visibility
    setTimeout(function() {
        makeBox.style.display = "block";
        document.getElementById("curaSaveConfirm2").remove();
        
        document.getElementById("curaCreateCollection").style.display = "block"; // Also makes the "New List" option reappear
        closeMakeBox(); // Closes the "make" box
        document.getElementById("curaInputForm").reset(); //clears text form form
    }, 1000); // Delays reseting the collection title until after the modal closes.
    
}

// Show "name list" form / Hide the "+ New List" Box.
function showMakeBox(e) {
    e.preventDefault(); //This e attribute exists only so I can attach "preventDefault" to it to stop the page from refreshing on form submit. Weird that this is necessary.

    document.getElementById("curaMakeBox").style.display = "block";
    document.getElementById("curaCreateCollection").style.display = "none";
    
    var collectionNameBox = document.getElementById("makeInputBox");
    collectionNameBox.focus();
    collectionNameBox.select();
    
    disableSaveButtonUnlessTextPresent();
}

// Close "Make" Box
function closeMakeBox() {
    var box = document.getElementById("curaMakeBox");
    box.style.display = "none";
}


//////////////////////////////////////////////////////////////////////
// UI EFFECTS
//////////////////////////////////////////////////////////////////////

// Fade Out
function curaFadeOut(element){
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.05){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 7); //Adjust Fade-Out Time
}

// Fade In
function curaFadeIn(el){
  el.style.opacity = 0;

  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / 75; //Adjust Fade-In Time
    last = +new Date();

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };

  tick();
}


// API
// Assemble the list in a form that's ready to save.
// The Curalytics API stores collections for you and has RESTful calls to create and read collections.

function curaPostContentDefaultCollection(e) {
    e.preventDefault(); //This e attribute exists only so I can attach "preventDefault" to it to stop the page from refreshing on form submit.
    curaFinalContent = {};
    curaFinalContent["contentID"] = parseInt(contentData["contentID"]);
    curaFinalContent["contentName"] = contentData["contentName"];
    curaFinalContent["contentThumbnailUrl"] = contentData["contentThumbnailUrl"];
    // You need a way to generate new collectionIDs. The Curalytics API assigns one for you.
    curaFinalContent["collectionName"] =  this.getAttribute("data-collectionname");
    curaFinalContent["userID"] = uid;
    curaFinalContent["userName"] = userData["userName"];
    curaFinalContent["userThumbnailUrl"] = userData["userThumbnailUrl"];
    console.log(curaFinalContent);
}

function curaPostContentNewCollection(e) {
    e.preventDefault(); //This e attribute exists only so I can attach "preventDefault" to it to stop the page from refreshing on form submit.
    curaFinalContent = {};
    curaFinalContent["contentID"] = parseInt(contentData["contentID"]);
    curaFinalContent["contentName"] = contentData["contentName"];
    curaFinalContent["contentThumbnailUrl"] = contentData["contentThumbnailUrl"];
    // You need a way to generate new collectionIDs. The Curalytics API assigns one for you.
    curaFinalContent["collectionName"] = this.collectionName.value; // Accesses the collectionName in the text box.
    curaFinalContent["userID"] = uid;
    curaFinalContent["userName"] = userData["userName"];
    curaFinalContent["userThumbnailUrl"] = userData["userThumbnailUrl"];
    console.log(curaFinalContent);
    
    defaultCollectionTitles.push(this.collectionName.value); //Adds new collection name to the list of collection names (for the sake of the demo)
}