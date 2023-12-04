const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item)=> addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e){
    e.preventDefault();

    //receive input, trim whitespace
    const newItem = itemInput.value.trim();

    // validate input 
    if(newItem === ""){
        alert('Please add an item');
        return;
    }

    // check for editMode;
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert(`The item ${newItem} already exists!`)
            return;
        }
    }

    //create item DOM element
    addItemToDOM(newItem);

    //add item to local storage

    addItemToStorage(newItem);
    // create list item
    checkUI();

    //reset input form
    itemInput.value = '';
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const deleteButton = createButton('remove-item btn-link text-red');
    li.appendChild(deleteButton);
    itemList.appendChild(li);
    itemInput.value = '';
}
function createButton(classes){
    const button = document.createElement("button");
    button.className = classes;
    const iconDelete = createIcon('fa-solid fa-xmark');
    const iconEdit = createIcon('fa-solid fa-pen');
    button.appendChild(iconDelete);
    button.appendChild(iconEdit);

    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage =[];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;

}
function onClickItem(e){
    console.log(e.target);
    if(e.target.parentElement.classList.contains('remove-item')){
        console.log(e.target.parentElement.parentElement);
        removeItem(e.target.parentElement.parentElement);
    }else if (e.target.parentElement.classList.contains('edit-item')){
        setItemToEdit(e.target);
    }
}
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = "<i class ='fa-solid fa-pen'></i> Update Item ";
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;

}

function removeItem(item) {
    let itemToRemove = item.target.parentElement.parentElement;
    if(itemToRemove.className !== "container"){

        if(confirm(`Are you sure you want to remove the item "${itemToRemove.innerText}"?` )){
        // Remove item from DOM
        itemToRemove.remove();

        //remove item from storage
        removeItemFromStorage(itemToRemove.innerText);
        checkUI();

        }
    }
    
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //filter out item to be removed;
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //re-set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
    // clear from LocalStorage
    localStorage.removeItem('items');
    checkUI();
}


function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    items.forEach( item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none'
        }
})
}

function checkUI(){
    const items = itemList.querySelectorAll('li');

    if(items.length === 0){
        clearBtn.style.display='none';
        itemFilter.style.display='none';
    }else{
        clearBtn.style.display = 'block';
        itemFilter.style.display='block';
    }
    console.log(items);

    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = "#333";

    isEditMode= false;
}


//event listeners
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', removeItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();







