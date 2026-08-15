const imageInput = document.getElementById("imageInput");
const addButton = document.getElementById("addButton");
const emptyCard = document.getElementById("emptyCard");
const imageGrid = document.getElementById("imageGrid");
const selectAll = document.getElementById("selectAll");
const deleteButton = document.getElementById("deleteButton");
const sortButton = document.getElementById("sortButton");
const finishButton = document.getElementById("finishButton");

const pageSize = document.getElementById("pageSize");
const orientation = document.getElementById("orientation");
const margins = document.getElementById("margins");
const separatePdfs = document.getElementById("separatePdfs");

const viewButtons = document.querySelectorAll(".view-button");

const gridViewButton = viewButtons[1];
const listViewButton = viewButtons[0];

let images = [];
let selectedIndexes = new Set();

let draggedIndex = null;
let currentView = "grid";

let isGenerating = false;


/* =====================================================
   OPEN FILE PICKER
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

        if (!file.type.match(/^image\/(jpeg|png|jpg)$/i)) {
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


        /* IMAGE */

        const wrapper = document.createElement("div");

        wrapper.className = "image-wrapper";


        const img = document.createElement("img");

        img.src = image.url;

        img.alt = `Page ${index + 1}`;


        wrapper.appendChild(img);


        /* CHECKBOX */

        const checkbox = document.createElement("input");

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


        /* FILENAME */

        const filename = document.createElement("div");

        filename.className = "file-name";

        filename.textContent =
            `page-${String(index + 1).padStart(3, "0")}.jpg`;


        /* DELETE */

        const remove = document.createElement("button");

        remove.className = "remove-button";

        remove.textContent = "×";

        remove.title = "Delete";


        remove.addEventListener("click", event => {

            event.stopPropagation();

            removeImage(index);

        });


        /* ADD BETWEEN */

        const addBetween = document.createElement("button");

        addBetween.className = "add-between";

        addBetween.textContent = "+";

        addBetween.title = "Add image";


        addBetween.addEventListener("click", event => {

            event.stopPropagation();

            imageInput.click();

        });


        /* LIST ACTIONS */

        const actions = document.createElement("div");

        actions.className = "list-actions";


        const duplicate = document.createElement("button");

        duplicate.className = "list-action";

        duplicate.innerHTML = "▣";

        duplicate.title = "Duplicate";


        duplicate.addEventListener("click", event => {

            event.stopPropagation();

            duplicateImage(index);

        });


        const rotate = document.createElement("button");

        rotate.className = "list-action";

        rotate.innerHTML = "↻";

        rotate.title = "Rotate preview";


        rotate.addEventListener("click", event => {

            event.stopPropagation();

            rotateImage(index);

        });


        const listDelete = document.createElement("button");

        listDelete.className = "list-action delete";

        listDelete.innerHTML = "🗑";

        listDelete.title = "Delete";


        listDelete.addEventListener("click", event => {

            event.stopPropagation();

            removeImage(index);

        });


        actions.appendChild(duplicate);

        actions.appendChild(rotate);

        actions.appendChild(listDelete);


        /* BUILD CARD */

        card.appendChild(wrapper);

        card.appendChild(checkbox);

        card.appendChild(filename);

        card.appendChild(remove);

        card.appendChild(addBetween);

        card.appendChild(actions);


        /* DRAG */

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


            const movedImage =
                images.splice(draggedIndex, 1)[0];


            images.splice(index, 0, movedImage);


            selectedIndexes.clear();

            renderImages();

        });


        imageGrid.appendChild(card);

    });


    /* ADD IMAGE CARD */

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


/* =====================================================
   REMOVE IMAGE
===================================================== */

function removeImage(index) {

    if (images[index]) {

        URL.revokeObjectURL(images[index].url);

    }

    images.splice(index, 1);

    selectedIndexes.clear();

    selectAll.checked = false;

    renderImages();
}


/* =====================================================
   DUPLICATE IMAGE
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
   ROTATE PREVIEW
===================================================== */

function rotateImage(index) {

    const card =
        imageGrid.querySelectorAll(".image-card")[index];

    if (!card) {
        return;
    }


    const img =
        card.querySelector(".image-wrapper img");

    if (!img) {
        return;
    }


    const currentRotation =
        parseInt(img.dataset.rotation || "0");


    const newRotation =
        currentRotation + 90;


    img.dataset.rotation = newRotation;

    img.style.transform =
        `rotate(${newRotation}deg)`;
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
   GET PAGE SIZE
===================================================== */

function getPageSize() {

    const size = pageSize.value;

    if (size === "letter") {

        return [215.9, 279.4];

    }

    if (size === "a3") {

        return [297, 420];

    }

    // A4

    return [210, 297];
}


/* =====================================================
   GET MARGIN
===================================================== */

function getMargin() {

    if (margins.value === "none") {

        return 0;

    }

    if (margins.value === "large") {

        return 20;

    }

    // Small

    return 8;
}


/* =====================================================
   LOAD IMAGE
===================================================== */

function loadImage(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();


        reader.onload = () => {

            const img = new Image();


            img.onload = () => {

                resolve({
                    element: img,
                    data: reader.result
                });

            };


            img.onerror = () => {

                reject(
                    new Error("Could not load image.")
                );

            };


            img.src = reader.result;

        };


        reader.onerror = () => {

            reject(
                new Error("Could not read image.")
            );

        };


        reader.readAsDataURL(file);

    });
}


/* =====================================================
   GENERATE ONE PDF
===================================================== */

async function createPdf(imagesToUse, filename) {

    const jsPDF = window.jspdf?.jsPDF;


    if (!jsPDF) {

        throw new Error(
            "PDF library could not be loaded."
        );

    }


    const baseSize = getPageSize();

    const margin = getMargin();

    const selectedOrientation =
        orientation.value;


    let pdf;


    if (selectedOrientation === "portrait") {

        pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: baseSize
        });

    } else if (selectedOrientation === "landscape") {

        pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: baseSize
        });

    } else {

        // Auto starts with portrait.
        // Each image will still be fitted correctly.

        pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: baseSize
        });

    }


    for (let i = 0; i < imagesToUse.length; i++) {

        const image = await loadImage(
            imagesToUse[i].file
        );


        if (i > 0) {

            pdf.addPage();

        }


        let pageWidth =
            pdf.internal.pageSize.getWidth();

        let pageHeight =
            pdf.internal.pageSize.getHeight();


        const availableWidth =
            pageWidth - margin * 2;

        const availableHeight =
            pageHeight - margin * 2;


        const imageWidth =
            image.element.naturalWidth;

        const imageHeight =
            image.element.naturalHeight;


        const imageRatio =
            imageWidth / imageHeight;


        let drawWidth =
            availableWidth;

        let drawHeight =
            drawWidth / imageRatio;


        if (drawHeight > availableHeight) {

            drawHeight =
                availableHeight;

            drawWidth =
                drawHeight * imageRatio;

        }


        const x =
            (pageWidth - drawWidth) / 2;


        const y =
            (pageHeight - drawHeight) / 2;


        let imageFormat = "JPEG";


        if (
            imagesToUse[i].file.type ===
            "image/png"
        ) {

            imageFormat = "PNG";

        }


        pdf.addImage(
            image.data,
            imageFormat,
            x,
            y,
            drawWidth,
            drawHeight
        );

    }


    pdf.save(filename);
}


/* =====================================================
   FINISH / GENERATE PDF
===================================================== */

finishButton.addEventListener("click", async () => {

    if (images.length === 0) {

        alert("Please add at least one image first.");

        return;
    }


    if (isGenerating) {

        return;

    }


    isGenerating = true;


    const originalText =
        finishButton.innerHTML;


    finishButton.disabled = true;

    finishButton.innerHTML =
        "Creating PDF...";


    try {

        /*
         * IMPORTANT:
         * `images` is already in the exact order
         * shown on the screen.
         */

        if (separatePdfs.checked) {

            for (let i = 0; i < images.length; i++) {

                const filename =
                    `page-${String(i + 1).padStart(3, "0")}.pdf`;


                await createPdf(
                    [images[i]],
                    filename
                );

            }

        } else {

            await createPdf(
                images,
                "images-to-pdf.pdf"
            );

        }


        finishButton.innerHTML =
            "PDF Ready ✓";


        setTimeout(() => {

            finishButton.innerHTML =
                originalText;

        }, 2000);


    } catch (error) {

        console.error(
            "PDF generation error:",
            error
        );


        alert(
            "PDF could not be generated.\n\n" +
            error.message
        );


        finishButton.innerHTML =
            originalText;

    }


    finishButton.disabled = false;

    isGenerating = false;

});


/* =====================================================
   START
===================================================== */

renderImages();