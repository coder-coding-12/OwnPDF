const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const pdfButton = document.getElementById("pdfButton");
const clearButton = document.getElementById("clearButton");
const status = document.getElementById("status");

let images = [];

// Upload images
fileInput.addEventListener("change", function () {

    const files = Array.from(fileInput.files);

    files.forEach(file => {

        if (!file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            images.push({
                name: file.name,
                data: event.target.result
            });

            displayImages();
        };

        reader.readAsDataURL(file);
    });

    fileInput.value = "";
});


// Display uploaded images
function displayImages() {

    previewContainer.innerHTML = "";

    images.forEach((image, index) => {

        const card = document.createElement("div");
        card.className = "image-card";

        card.innerHTML = `
            <img src="${image.data}" alt="${image.name}">

            <button
                class="remove-button"
                onclick="removeImage(${index})"
            >
                ✕
            </button>

            <div class="image-name">
                ${image.name}
            </div>
        `;

        previewContainer.appendChild(card);
    });
}


// Remove image
function removeImage(index) {

    images.splice(index, 1);

    displayImages();
}


// Clear all images
clearButton.addEventListener("click", function () {

    images = [];

    displayImages();

    status.textContent = "";
});


// Create PDF
pdfButton.addEventListener("click", async function () {

    if (images.length === 0) {

        status.textContent = "⚠️ Please upload at least one photo.";

        return;
    }

    status.textContent = "⏳ Creating PDF...";

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    for (let i = 0; i < images.length; i++) {

        const image = images[i];

        if (i > 0) {
            pdf.addPage();
        }

        await addImageToPDF(pdf, image.data);
    }

    pdf.save("photos.pdf");

    status.textContent = "✅ PDF created successfully!";
});


// Add image to PDF
function addImageToPDF(pdf, imageData) {

    return new Promise((resolve) => {

        const img = new Image();

        img.onload = function () {

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const margin = 10;

            const maxWidth = pageWidth - margin * 2;
            const maxHeight = pageHeight - margin * 2;

            let width = img.width;
            let height = img.height;

            // Scale image to fit PDF page
            const scale = Math.min(
                maxWidth / width,
                maxHeight / height
            );

            width *= scale;
            height *= scale;

            const x = (pageWidth - width) / 2;
            const y = (pageHeight - height) / 2;

            pdf.addImage(
                imageData,
                "JPEG",
                x,
                y,
                width,
                height
            );

            resolve();
        };

        img.src = imageData;
    });
}
