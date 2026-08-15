const imageInput = document.getElementById("imageInput");

const addButton = document.getElementById("addButton");

const emptyCard = document.getElementById("emptyCard");

const imageGrid = document.getElementById("imageGrid");

const selectAll = document.getElementById("selectAll");

const deleteButton = document.getElementById("deleteButton");

const sortButton = document.getElementById("sortButton");

const finishButton = document.getElementById("finishButton");

const gridViewButton =
    document.querySelectorAll(".view-button")[1];

const listViewButton =
    document.querySelectorAll(".view-button")[0];


let images = [];

let selectedIndexes = new Set();

let draggedIndex = null;

let currentView = "grid";


/* =====================================================
   FILE PICKER
===================================================== */

addButton.addEventListener("click", () => {

    imageInput.click();

});


emptyCard.addEventListener("click", () => {

    imageInput.click();

});


/* =====================================================
   ADD IMAGES
===================================================== */

imageInput.addEventListener("change", (event) => {

    const files = Array.from(event.target.files);

    files.forEach(file => {

        if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
            return;
        }

        images.push({

            file: file,

            url: URL.createObjectURL(file)

        });

    });

    imageInput.value = "";

    renderImages();

});


/* =====================================================
   RENDER IMAGES
===================================================== */

function renderImages() {

    imageGrid.innerHTML = "";

    imageGrid.classList.toggle(
        "list-view",
        currentView === "list"
    );


    if (images.length === 0) {

        imageGrid.appendChild(emptyCard);

        return;

    }


    images.forEach((image, index) => {

        const card = document.createElement("div");

        card.className = "image-card";

        card.draggable = true;

        card.dataset.index = index;


        /* =========================
           IMAGE
        ========================= */

        const wrapper =
            document.createElement("div");

        wrapper.className = "image-wrapper";


        const img =
            document.createElement("img");

        img.src = image.url;

        img.alt = `Page ${index + 1}`;


        wrapper.appendChild(img);


        /* =========================
           CHECKBOX
        ========================= */

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "card-checkbox";

        checkbox.checked =
            selectedIndexes.has(index);


        checkbox.addEventListener("click", event => {

            event.stopPropagation();


            if (checkbox.checked) {

                selectedIndexes.add(index);

            } else {

                selectedIndexes.delete(index);

            }

        });


        /* =========================
           FILE NAME
        ========================= */

        const filename =
            document.createElement("div");

        filename.className = "file-name";

        filename.textContent =
            `page-${String(index + 1).padStart(3, "0")}.jpg`;


        /* =========================
           GRID DELETE
        ========================= */

        const remove =
            document.createElement("button");

        remove.className = "remove-button";

        remove.textContent = "×";


        remove.addEventListener("click", event => {

            event.stopPropagation();

            removeImage(index);

        });


        /* =========================
           ADD BETWEEN
        ========================= */

        const addBetween =
            document.createElement("button");

        addBetween.className = "add-between";

        addBetween.textContent = "+";


        addBetween.addEventListener("click", event => {

            event.stopPropagation();

            imageInput.click();

        });


        /* =========================
           LIST ACTIONS
        ========================= */

        const actions =
            document.createElement("div");

        actions.className = "list-actions";


        /* Duplicate */

        const duplicate =
            document.createElement("button");

        duplicate.className = "list-action";

        duplicate.innerHTML = "▣";

        duplicate.title = "Duplicate";


        duplicate.addEventListener("click", event => {

            event.stopPropagation();

            duplicateImage(index);

        });


        /* Rotate */

        const rotate =
            document.createElement("button");

        rotate.className = "list-action";

        rotate.innerHTML = "↻";

        rotate.title = "Rotate";


        rotate.addEventListener("click", event => {

            event.stopPropagation();

            rotateImage(index);

        });


        /* Delete */

        const listDelete =
            document.createElement("button");

        listDelete.className =
            "list-action delete";

        listDelete.innerHTML = "♜";

        listDelete.title = "Delete";


        listDelete.addEventListener("click", event => {

            event.stopPropagation();

            removeImage(index);

        });


        actions.appendChild(duplicate);

        actions.appendChild(rotate);

        actions.appendChild(listDelete);


        /* =========================
           BUILD CARD
        ========================= */

        card.appendChild(wrapper);

        card.appendChild(checkbox);

        card.appendChild(filename);

        card.appendChild(remove);

        card.appendChild(addBetween);

        card.appendChild(actions);


        /* =========================
           DRAGGING
        ========================= */

        card.addEventListener("dragstart", () => {

            draggedIndex = index;

            card.classList.add("dragging");

        });


        card.addEventListener("dragend", () => {

            card.classList.remove("dragging");

            draggedIndex = null;

        });


        card.addEventListener("dragover", event => {

            event.preventDefault();

        });


        card.addEventListener("drop", event => {

            event.preventDefault();

            if (draggedIndex === null) {
                return;
            }

            if (draggedIndex === index) {
                return;
            }


            const moved =
                images.splice(draggedIndex, 1)[0];


            images.splice(index, 0, moved);


            selectedIndexes.clear();

            renderImages();

        });


        imageGrid.appendChild(card);

    });


    /* =========================
       ADD IMAGE CARD
    ========================= */

    const addCard =
        document.createElement("div");

    addCard.className = "empty-card";

    addCard.innerHTML = `
        <div class="empty-plus">+</div>

        <div>
            <strong>Add images</strong>
            <br>
            to continue
        </div>
    `;


    addCard.addEventListener("click", () => {

        imageInput.click();

    });


    imageGrid.appendChild(addCard);

}


/* =====================================================
   REMOVE
===================================================== */

function removeImage(index) {

    images.splice(index, 1);

    selectedIndexes.clear();

    selectAll.checked = false;

    renderImages();

}


/* =====================================================
   DUPLICATE
===================================================== */

function duplicateImage(index) {

    const original = images[index];

    images.splice(index + 1, 0, {

        file: original.file,

        url: original.url

    });


    renderImages();

}


/* =====================================================
   ROTATE
===================================================== */

function rotateImage(index) {

    const img =
        document.querySelectorAll(
            ".image-wrapper img"
        )[index];


    if (!img) {
        return;
    }


    const current =
        parseInt(img.dataset.rotation || "0");


    const next = current + 90;

    img.dataset.rotation = next;

    img.style.transform =
        `rotate(${next}deg)`;

}


/* =====================================================
   SELECT ALL
===================================================== */

selectAll.addEventListener("change", () => {

    selectedIndexes.clear();


    if (selectAll.checked) {

        images.forEach((_, index) => {

            selectedIndexes.add(index);

        });

    }


    renderImages();

});


/* =====================================================
   DELETE SELECTED
===================================================== */

deleteButton.addEventListener("click", () => {

    if (selectedIndexes.size === 0) {
        return;
    }


    images =
        images.filter(
            (_, index) =>
                !selectedIndexes.has(index)
        );


    selectedIndexes.clear();

    selectAll.checked = false;

    renderImages();

});


/* =====================================================
   SORT
===================================================== */

sortButton.addEventListener("click", () => {

    images.sort((a, b) => {

        return a.file.name.localeCompare(
            b.file.name,
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        );

    });


    selectedIndexes.clear();

    renderImages();

});


/* =====================================================
   GRID VIEW
===================================================== */

gridViewButton.addEventListener("click", () => {

    currentView = "grid";

    gridViewButton.classList.add("active");

    listViewButton.classList.remove("active");

    renderImages();

});


/* =====================================================
   LIST VIEW
===================================================== */

listViewButton.addEventListener("click", () => {

    currentView = "list";

    listViewButton.classList.add("active");

    gridViewButton.classList.remove("active");

    renderImages();

});


/* =====================================================
   FINISH
===================================================== */

finishButton.addEventListener("click", () => {

    if (images.length === 0) {

        alert("Please add images first.");

        return;

    }


    alert(
        "Images are ready. PDF generation is next!"
    );

});


/* =====================================================
   START
===================================================== */

renderImages();