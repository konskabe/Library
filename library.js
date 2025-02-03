const libraryEl = document.querySelector(".library");
const bookForm = document.querySelector("#bookForm");
const newBookbtn = document.querySelector("#newBookbtn");
const closeButton = document.querySelector("#closeButton");

let myLibrary = [];

// Load books from localStorage
function loadLibrary() {
    const storedBooks = localStorage.getItem("library");
    if (storedBooks) {
        myLibrary = JSON.parse(storedBooks);
    }
}

// Save books to localStorage
function saveLibrary() {
    localStorage.setItem("library", JSON.stringify(myLibrary));
}

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "Read" : "Not read yet"}`;
};

Book.prototype.toggleRead = function () {
    this.read = !this.read;
};

function addBookToLibrary() {
    let title = document.querySelector("#title").value;
    let author = document.querySelector("#author").value;
    let pages = document.querySelector("#pages").value;
    let read = document.querySelector("#read").checked;

    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    
    saveLibrary(); // Save after adding
    display();
}

function display() {
    libraryEl.innerHTML = "";
    for (let i = 0; i < myLibrary.length; i++) {
        let book = myLibrary[i];
        let bookEl = document.createElement("div");
        bookEl.setAttribute("class", "card");
        bookEl.innerHTML = `
            <h3 class="cardTitle">${book.title}</h3>
            <h5 class="cardAuthor">by ${book.author}</h5>
            <p class="cardPages">${book.pages} Pages</p>
            <p class="cardRead">${book.read ? "Read" : "Not read yet"}</p>
            <div class="cardButtons">
                <button class="removeBtn" onclick="remove(${i})">Remove</button>
                <button class="toggleReadBtn" onclick="toggleRead(${i})">Toggle Read</button>
            </div>`;
        libraryEl.appendChild(bookEl);
    }
}

function toggleRead(index) {
    myLibrary[index].toggleRead();
    saveLibrary(); // Save after toggling read status
    display();
}

function remove(index) {
    myLibrary.splice(index, 1);
    saveLibrary(); // Save after removal
    display();
}

// Show form for adding books
newBookbtn.addEventListener("click", () => {
    bookForm.style.display = "flex";
    libraryEl.style.gridColumn = "2/3";
});

// Close form
closeButton.addEventListener("click", () => {
    bookForm.style.display = "none";
    libraryEl.style.gridColumn = "1/3";
});

// Handle form submission
document.querySelector("#bookForm").addEventListener("submit", function (event) {
    event.preventDefault();
    addBookToLibrary();
    this.reset();
});

// Load books on page load
document.addEventListener("DOMContentLoaded", () => {
    loadLibrary();
    display();
});
