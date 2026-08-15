const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const createPdf = document.getElementById("createPdf");
const downloadPdf = document.getElementById("downloadPdf");

let selectedImages = [];


// ===============================
// ADD IMAGES
// ===============================

imageInput.addEventListener("change", function () {

    const newImages = Array.from(imageInput.files);

    selectedImages.push(...newImages);

    renderImages();

    imageInput.value = "";

});


// ===============================
// DISPLAY IMAGES
// ===============================

function renderImages() {

    preview.innerHTML = "";

    selectedImages.forEach((file, index) => {

        const card = document.createElement("div");

        card.className = "image-card";

        card.draggable = true;

        card.dataset.index = index;


        // Image

        const image = document.createElement("img");

        image.src = URL.createObjectURL(file);


        // Page number

        const pageNumber = document.createElement("div");

        pageNumber.className = "page-number";

        pageNumber.textContent = `Page ${index + 1}`;


        // Remove button

        const removeButton = document.createElement("button");

        removeButton.className = "remove-btn";

        removeButton.textContent = "×";

        removeButton.title = "Remove image";


        removeButton.addEventListener("click", function (event) {

            event.stopPropagation();

            selectedImages.splice(index, 1);

            renderImages();

        });


        card.appendChild(image);

        card.appendChild(pageNumber);

        card.appendChild(removeButton);

        preview.appendChild(card);


        // ===============================
        // DRAG EVENTS
        // ===============================

        card.addEventListener("dragstart", function () {

            card.classList.add("dragging");

        });


        card.addEventListener("dragend", function () {

            card.classList.remove("dragging");

        });


        card.addEventListener("dragover", function (event) {

            event.preventDefault();

            const draggingCard =
                document.querySelector(".dragging");

            if (!draggingCard || draggingCard === card) {
                return;
            }

            const cards =
                [...preview.querySelectorAll(".image-card")];

            const draggingIndex =
                cards.indexOf(draggingCard);

            const targetIndex =
                cards.indexOf(card);


            if (draggingIndex < targetIndex) {

                preview.insertBefore(
                    draggingCard,
                    card.nextSibling
                );

            } else {

                preview.insertBefore(
                    draggingCard,
                    card
                );

            }

        });


        card.addEventListener("drop", function (event) {

            event.preventDefault();

            updateImageOrder();

        });

    });


    // Enable / disable Create PDF

    createPdf.disabled = selectedImages.length === 0;

}


// ===============================
// UPDATE ARRAY AFTER DRAGGING
// ===============================

function updateImageOrder() {

    const cards =
        [...preview.querySelectorAll(".image-card")];

    const newOrder = [];

    cards.forEach(card => {

        const oldIndex =
            parseInt(card.dataset.index);

        newOrder.push(selectedImages[oldIndex]);

    });

    selectedImages = newOrder;

    renderImages();

}
