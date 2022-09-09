const BOOKS = [];
const RENDER_EVENT = "RENDER_TODO_V";
const SAVED_EVENT = "SAVED_TODO_V";
const STORAGE_KEY = "KEY_TODO_V_APP";

// Buat ID
function generateID() {
  return +new Date();
}

// Buat Object Buku
function generateBookObject(id, judul, penulis, tahun, isCompleted) {
  return {
    id: generateID(),
    judul,
    penulis,
    tahun,
    isCompleted,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.querySelector(".btnSubmit");
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    swal({
      title: "Success!",
      text: "Task Added!",
      icon: "success",
      button: true,
    });
    addBook();
    removeValueInput();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos);
  const unCompletedBook = document.getElementById("buku");
  unCompletedBook.innerHTML = "";

  const completedBook = document.getElementById("sudahDibaca");
  completedBook.innerHTML = "";

  for (const bookItem of BOOKS) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unCompletedBook.append(bookElement);
    } else {
      completedBook.append(bookElement);
    }
  }
});

// ==================================================
// ==================== save data ===================
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser Unsupported Web Storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(BOOKS);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      BOOKS.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
// ================= save data end ==================
// ==================================================

function removeValueInput() {
  const inputJudul = document.querySelector(".inputJudul");
  const inputAuthor = document.querySelector(".inputAuthor");
  const inputTahun = document.querySelector(".inputTahun");
  const inputSearch = document.querySelector(".searchArea");
  inputJudul.value = "";
  inputAuthor.value = "";
  inputTahun.value = "";
  inputSearch.value = "";
}

// =========================================================
// ================== Search & Find Start ==================

function findBook(bookId) {
  for (const bookItem of BOOKS) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in BOOKS) {
    if (BOOKS[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// SearchButton
const searchButton = document.getElementById("btnSearch");
searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  const yangDicari = document.getElementById("cariBuku").value;
  const semuaBuku = document.querySelectorAll(".bukuItem");
  for (buku of semuaBuku) {
    const judul = buku.innerText;

    if (judul.includes(yangDicari)) {
      buku.style.display = "block";
    } else {
      buku.style.display = "none";
    }
  }
});

// hapus pencarian
const clearSearch = document.querySelector("#btnHapusSearch");
clearSearch.addEventListener("click", function () {
  const inputValue = document.querySelector("#cariBuku");
  inputValue.value = "";
  const valueSearch = document.getElementById("cariBuku").value;

  const semuaBuku = document.querySelectorAll(".bukuItem");
  for (buku of semuaBuku) {
    const judul = buku.innerText;

    if (judul.includes(valueSearch)) {
      buku.style.display = "block";
    } else {
      buku.style.display = "none";
    }
  }
});
// ================= search end ==================
// ==================================================

function makeBook(bookObject) {
  const judulBuku = document.createElement("h4");
  judulBuku.innerText = `${bookObject.judul}`;
  judulBuku.classList.add("task");
  // judulBuku.style.fontSize = "1.3em";
  // judulBuku.style.textAlign = "center";
  // judulBuku.style.fontFamily = "georgia";

  const penulisBuku = document.createElement("p");
  penulisBuku.innerText = `${bookObject.penulis}`;
  penulisBuku.classList.add("note");

  const tahunBuku = document.createElement("p");
  tahunBuku.innerText = `Deadline\n ${bookObject.tahun}`;
  tahunBuku.classList.add("deadline");

  const bukuContainer = document.createElement("div");
  bukuContainer.classList.add("buku");
  bukuContainer.append(judulBuku, penulisBuku, tahunBuku);

  const container = document.createElement("div");
  container.classList.add("bukuItem");
  container.append(bukuContainer);
  container.setAttribute(`id`, `book-${bookObject.id}`);
  // menambahkan id pada elemen

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undoButton");
    undoButton.innerText = "Uncompleted";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("editButton");
    editButton.innerText = "Edit";
    let ini = this;

    editButton.addEventListener("click", function () {
      const editContainer = document.querySelector(".editContainer");
      const mainElemen = document.querySelector(".mainElemen");
      mainElemen.classList.add("blur");
      editContainer.style.display = "flex";

      ini.editBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerText = "Delete";

    trashButton.addEventListener("click", function () {
      swal({
        title: "Remove Task?",
        text: "Task Will Remove Permanently!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("Task Removed!", {
            icon: "success",
          });
          removeBookFromCompleted(bookObject.id);
        }
      });
    });

    container.append(editButton, trashButton, undoButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("checkButton");
    checkButton.innerText = "Completed";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("editButton");
    editButton.innerText = "Edit";
    let ini = this;
    editButton.addEventListener("click", function () {
      const editContainer = document.querySelector(".editContainer");
      const mainElemen = document.querySelector(".mainElemen");
      mainElemen.classList.add("blur");
      editContainer.style.display = "flex";

      ini.editBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerText = "Delete";

    trashButton.addEventListener("click", function () {
      swal({
        title: "Remove Task?",
        text: "Task Will Remove Permanently!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("Task Removed!", {
            icon: "success",
          });
          removeBookFromCompleted(bookObject.id);
        }
      });
    });

    container.append(editButton, trashButton, checkButton);
  }

  return container;
} // END | makeBook()

function addBook() {
  const judul = document.getElementById("judulBuku").value;
  const penulis = document.getElementById("author").value;
  const tahun = document.getElementById("tahunBuku").value;
  const isCompleted = document.getElementById("isCompleted").checked;

  const generatedID = generateID();
  const bookObject = generateBookObject(generatedID, judul, penulis, tahun, isCompleted);
  BOOKS.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  //   Setelah disimpan pada array, kita panggil sebuah custom event RENDER_EVENT menggunakan method dispatchEvent(). Custom event ini akan kita terapkan untuk me-render data yang telah disimpan pada array todos.

  saveData();
} // end addBook();

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  BOOKS.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// ==================================================
// ==================== edit book ===================

// simpanEditButton
const simpanEdit = document.querySelector(".btnSimpan");
simpanEdit.addEventListener("click", function (bookId) {
  const editContainer = document.querySelector(".editContainer");
  editContainer.style.display = "none";
  const mainElemen = document.querySelector(".mainElemen");
  mainElemen.classList.remove("blur");
  swal({
    title: "Success!",
    text: "Task Edited!",
    icon: "success",
    button: true,
  });

  editBook(bookId);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
});

// exitEditButton
const exitEdit = document.querySelector("#exit");
exitEdit.addEventListener("click", function () {
  const editContainer = document.querySelector(".editContainer");
  editContainer.style.display = "none";
  const mainElemen = document.querySelector(".mainElemen");
  mainElemen.classList.remove("blur");
});

function editBook(bookId) {
  for (bookItem of BOOKS) {
    if (bookItem.id === bookId) {
      // bookId belum terdefinisi
      const judulBaru = document.querySelector("#judulBaru");
      const authorBaru = document.querySelector("#authorBaru");
      const tahunBaru = document.querySelector("#tahunBaru");

      localStorage.setItem("ID_EDIT", bookId);

      // replace value
      judulBaru.value = bookItem.judul;
      authorBaru.value = bookItem.penulis;
      tahunBaru.value = bookItem.tahun;
      // idBook.value = bookItem.id;
    }
  }
  return null;
}

// save edited book
let formEditBook = document.getElementById("formEdit");
formEditBook.addEventListener("submit", function (e) {
  e.preventDefault();
  const judulBuku = document.querySelector("#judulBaru").value;
  const penulis = document.querySelector("#authorBaru").value;
  const tahunBuku = document.querySelector("#tahunBaru").value;

  let idBook = localStorage.getItem("ID_EDIT");
  id = parseInt(idBook);

  for (bookItem of BOOKS) {
    if (bookItem.id === id) {
      // replace value
      bookItem.judul = judulBuku;
      bookItem.penulis = penulis;
      bookItem.tahun = tahunBuku;
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
});
// ================= edit book end ==================
// ==================================================
