const myLibrary = [];

function Book(title,author,pages,read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function(){
        return(this.title+" by "+this.author+", "+this.pages+", "+this.read);
    };
}

function addBookToLibrary(){
    let title = document.querySelector("#title").value;
    let author = document.querySelector("#author").value;
    let pages = document.querySelector("#pages").value;
    let read = document.querySelector("#read").checked;
    let newBook = new Book(title,author,pages,read);
    myLibrary.push(newBook);
    console.log(myLibrary);
}
let libraryEl = document.querySelector(".library");
function display(){
    libraryEl.innerHTML = "";
    for(let i=0; i < myLibrary.length; i++){
        let book = myLibrary[i];
        let bookEl = document.createElement("div");
        bookEl.setAttribute("class","card");
        bookEl.innerHTML = `
        <h3 class="cardTitle">${book.title}</h3>
        <h5 class="cardAuthor">by ${book.author}</h5>
        <p class="cardPages"> ${book.pages} Pages</p>
        <p class="cardRead">${book.read ? "Read" : "Not read yet"}</p>
        <div class="cardButtons">
            <button class="removeBtn" onclick="remove(${i})">Remove</button>
            <button class="toggleReadBtn" onclick="toggleRead(${i})">Toggle Read</button>
        </div>`
        libraryEl.appendChild(bookEl);
    }
}
Book.prototype.toggleRead = function(){
    this.read = !this.read;
}
function toggleRead(index){
    myLibrary[index].toggleRead();
    display();
}


function remove(index){
    myLibrary.splice(index,1);
    display();
}

let bookForm = document.querySelector("#bookForm");

let newBookbtn = document.querySelector("#newBookbtn");
newBookbtn.addEventListener("click",()=> {
    bookForm.style.display = "flex";
    libraryEl.style.gridColumn = "2/3";
    
});

let closeButton = document.querySelector("#closeButton");
closeButton.addEventListener("click",()=>{
    bookForm.style.display = "none";
    libraryEl.style.gridColumn = "1/3";
});



 document.querySelector("#bookForm").addEventListener("submit", function(event) {
     event.preventDefault(); // Prevents form submission
     addBookToLibrary();
    this.reset();
    display();
});