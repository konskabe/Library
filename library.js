import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const libraryEl = document.querySelector(".library");
const bookForm = document.querySelector("#bookForm");
const newBookbtn = document.querySelector("#newBookbtn");
const closeButton = document.querySelector("#closeButton");

const firebaseConfig = {
  apiKey: "AIzaSyCKaD8_LMlcUox-h_Hhp9O5UAKJbSjHOwc",
  authDomain: "library-683c7.firebaseapp.com",
  projectId: "library-683c7",
  storageBucket: "library-683c7.firebasestorage.app",
  messagingSenderId: "192890727232",
  appId: "1:192890727232:web:a2cdc9f014aa75470ce8a5",
  measurementId: "G-ML10HZYP3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let myLibrary = [];

// Sign in with Google
function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("User signed in:", result.user);
      loadUserLibrary(result.user.uid); // Load user-specific library
    })
    .catch((error) => {
      console.error("Error signing in:", error);
    });
}

// Sign out
function signOutUser() {
  signOut(auth).then(() => {
    console.log("User signed out");
  });
}

// Listen for authentication state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User signed in:", user);
    loadUserLibrary(user.uid); // Load user-specific library
    document.getElementById("signInBtn").style.display = "none";
    document.getElementById("signOutBtn").style.display = "inline-block";
  } else {
    console.log("No user signed in");
    loadUserLibrary(); // Load from localStorage for guests
    document.getElementById("signOutBtn").style.display = "none";
    document.getElementById("signInBtn").style.display = "inline-block";
  }
});

// Load library data based on user authentication
function loadUserLibrary(userId = null) {
  if (userId) {
    // Load from Firestore for logged-in users
    getDoc(doc(db, "libraries", userId))
      .then((docSnap) => {
        if (docSnap.exists()) {
          myLibrary = docSnap.data().books;
          console.log("Library loaded from Firestore");
        } else {
          console.log("No library found in Firestore, starting fresh.");
        }
        display();
      })
      .catch((error) => console.error("Error loading from Firestore:", error));
  } else {
    // Load from localStorage for guests
    const storedLibrary = localStorage.getItem("library");
    if (storedLibrary) {
      myLibrary = JSON.parse(storedLibrary);
      console.log("Library loaded from localStorage");
    }
    display();
  }
}

// Save books to localStorage or Firestore
function saveLibrary(userId = null) {
  if (userId) {
    // Save to Firestore for logged-in users
    setDoc(doc(db, "libraries", userId), { books: myLibrary })
      .then(() => console.log("Library saved to Firestore"))
      .catch((error) => console.error("Error saving to Firestore:", error));
  } else {
    // Save to localStorage for guests
    localStorage.setItem("library", JSON.stringify(myLibrary));
    console.log("Library saved to localStorage");
  }
}

// Book constructor
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

// Add a new book to the library
function addBookToLibrary() {
    let user = auth.currentUser;
    let userId = user ? user.uid : null; // Get user ID or use null for guests

    let title = document.querySelector("#title").value;
    let author = document.querySelector("#author").value;
    let pages = document.querySelector("#pages").value;
    let read = document.querySelector("#read").checked;

    let newBook = new Book(title, author, pages, read);
    
    // Transform the Book object into a plain object
    let bookData = {
        title: newBook.title,
        author: newBook.author,
        pages: newBook.pages,
        read: newBook.read
    };
    
    // Push the plain object to the library array
    myLibrary.push(bookData);
    
    saveLibrary(userId); // Save depending on login status
    display();
}

// Display library books
function display() {
    libraryEl.innerHTML = ""; // Clear the library container

    // Loop through the myLibrary array to display each book
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
                <button class="removeBtn">Remove</button>
                <button class="toggleReadBtn">Toggle Read</button>
            </div>
        `;
        
        // Append the book element to the library
        libraryEl.appendChild(bookEl);

        // Bind the remove button event
        bookEl.querySelector(".removeBtn").addEventListener("click", () => {
            remove(i); // Pass the index to the remove function
        });

        // Bind the toggleRead button event
        bookEl.querySelector(".toggleReadBtn").addEventListener("click", () => {
            toggleRead(i); // Pass the index to the toggleRead function
        });
    }
}


// Toggle read status of a book
function toggleRead(index) {
    let book = myLibrary[index];
    let user = auth.currentUser;
    let userId = user ? user.uid : null;
    if(book){
        book.read = !book.read;
        saveLibrary(userId);
        display();
}
}

// Remove a book from the library
function remove(index) {
    let user = auth.currentUser;
    let userId = user ? user.uid : null;
  myLibrary.splice(index, 1);
  saveLibrary(userId); // Save after removal
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

//Sign buttons
document.getElementById("signInBtn").addEventListener("click", signInWithGoogle);
document.getElementById("signOutBtn").addEventListener("click", signOutUser);

// Handle form submission
document.querySelector("#bookForm").addEventListener("submit", function (event) {
  event.preventDefault();
  addBookToLibrary();
  this.reset();
});

// Load books on page load
document.addEventListener("DOMContentLoaded", () => {
  loadUserLibrary(); // Load library on page load
  display();
});
