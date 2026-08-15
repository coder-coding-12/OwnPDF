const imageInput = document.getElementById("imageInput");

const addButton = document.getElementById("addButton");

const emptyCard = document.getElementById("emptyCard");

const imageGrid = document.getElementById("imageGrid");

const selectAll = document.getElementById("selectAll");

const deleteButton = document.getElementById("deleteButton");

const sortButton = document.getElementById("sortButton");

const finishButton = document.getElementById("finishButton");

let images = [];

let selectedIndexes = new Set();

let draggedIndex = null;


/* =========================
   OPEN FILE PICKER
========================= */

addButton.addEventListener("click", () => {
    imageInput.click();
});


emptyCard.addEventListener("click", () => {
    imageInput.click();
});


/* =========================
   ADD IMAGES
========================= */

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


/* =========================
   RENDER
========================= */

function renderImages() {

    imageGrid.innerHTML = "";

    if (images.length === 0) {

        imageGrid.appendChild(emptyCard);

        return;
    }


    images.forEach((image, index) => {

        const card = document.createElement("div");

        card.className = "image-card";

        card.draggable = true;

        card.dataset.index = index;


        /* Image wrapper */

        const wrapper = document.createElement("div");

        wrapper.className = "image-wrapper";


        const img = document.createElement("img");

        img.src = image.url;

        img.alt = `Page ${index + 1}`;

        wrapper.appendChild(img);


        /* Checkbox */

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "card-checkbox";

        checkbox.checked = selectedIndexes.has(index);


        checkbox.addEventListener("click", event => {

            event.stopPropagation();

            if (checkbox.checked) {
                selectedIndexes.add(index);
            } else {
                selectedIndexes.delete(index);
            }

        });


        /* Remove */

        const remove = document.createElement("button");

        remove.className = "remove-button";

        remove.textContent = "×";

        remove.title = "Remove image";


        remove.addEventListener("click", event => {

            event.stopPropagation();

            images.splice(index, 1);

            selectedIndexes.clear();

            renderImages();

        });


        /* Filename */

        const filename = document.createElement("div");

        filename.className = "file-name";

        filename.textContent =
            `page-${String(index + 1).padStart(3, "0")}.jpg`;


        /* Plus button */

        const addBetween = document.createElement("button");

        addBetween.className = "add-between";

        addBetween.textContent = "+";

        addBetween.title = "Add image here";


        addBetween.addEventListener("click", event => {

            event.stopPropagation();

            imageInput.dataset.insertIndex = index + 1;

            imageInput.click();

        });


        card.appendChild(wrapper);

        card.appendChild(checkbox);

        card.appendChild(remove);

        card.appendChild(filename);

        card.appendChild(addBetween);


        /* =========================
           DRAG & DROP
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

            const targetIndex = index;

            if (draggedIndex === null ||
                draggedIndex === targetIndex) {

                return;
            }


            const movedImage =
                images.splice(draggedIndex, 1)[0];


            images.splice(targetIndex, 0, movedImage);


            selectedIndexes.clear();

            renderImages();

        });


        imageGrid.appendChild(card);

    });


    /* Add images card */

    const addCard = document.createElement("div");

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


/* =========================
   SELECT ALL
========================= */

selectAll.addEventListener("change", () => {

    selectedIndexes.clear();

    if (selectAll.checked) {

        images.forEach((_, index) => {
            selectedIndexes.add(index);
        });

    }

    renderImages();

});


/* =========================
   DELETE SELECTED
========================= */

deleteButton.addEventListener("click", () => {

    if (selectedIndexes.size === 0) {
        return;
    }


    images =
        images.filter((_, index) =>
            !selectedIndexes.has(index)
        );


    selectedIndexes.clear();

    selectAll.checked = false;

    renderImages();

});


/* =========================
   SORT BUTTON
========================= */

sortButton.addEventListener("click", () => {

    images.sort((a, b) =>
        a.file.name.localeCompare(
            b.file.name,
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        )
    );


    selectedIndexes.clear();

    renderImages();

});


/* =========================
   FINISH BUTTON
========================= */

finishButton.addEventListener("click", () => {

    if (images.length === 0) {

        alert("Please add some images first.");

        return;
    }


    alert(
        "Great! Your images are ready. PDF generation is our next step."
    );

});


/* =========================
   INITIAL RENDER
========================= */

renderImages();
