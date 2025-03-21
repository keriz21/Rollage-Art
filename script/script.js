let imgElement = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

document.getElementById('upload').addEventListener('change', (event) => {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
        // applyEffects()
    }
});

document.getElementById('slicesSlider').addEventListener('input', (event) => {
    let value = event.target.value
    console.log("halo dunia")
    console.log(value)
    // console.log(document.getElementById("slicesSlider"))
    document.getElementById("sliderValue").innerHTML = value
    rollage_art(imgElement, value)
})

imgElement.onload = function() {
    rollage_art(imgElement)
};

function flip_horizontal(img) {
    let w = img.width;
    let h = img.height;
    let maxW = w > 500 ? 500 : w;
    let scaleFactor = maxW / w;
    let newH = h * scaleFactor;

    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = maxW * 2;
    tempCanvas.height = newH;

    // **1️⃣ Gambar asli di kiri**
    tempCtx.drawImage(img, 0, 0, maxW, newH);

    // **2️⃣ Flip horizontal di kanan**
    tempCtx.save();
    tempCtx.translate(maxW * 2, 0);
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(img, 0, 0, maxW, newH);
    tempCtx.restore();

    return tempCanvas; // Mengembalikan hasil dalam bentuk canvas
}

function flipVertical(img) {
    let w = img.width
    let h = img.height

    let tempCanvas = document.createElement("canvas")
    let tempCtx = tempCanvas.getContext("2d")
    
    tempCanvas.width = w
    tempCanvas.height = h * 2;

    tempCtx.drawImage(img, 0,0)

    tempCtx.save()
    tempCtx.translate(0,h*2);
    tempCtx.scale(1,-1);
    tempCtx.drawImage(img,0,0);
    tempCtx.restore()

    return tempCanvas
}

function render_to_main_canvas(img, maxWidth = 500) {
    // Hitung skala jika gambar lebih besar dari maxWidth
    let scaleFactor = img.width > maxWidth ? maxWidth / img.width : 1;

    let newWidth = img.width * scaleFactor;
    let newHeight = img.height * scaleFactor; // Gunakan height, bukan width

    // Atur ukuran canvas
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Hapus canvas sebelum menggambar gambar baru
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar ke canvas dengan ukuran baru
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
}

function slice_and_rotate(img, num_slices = 30) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let h = imageData.height;
    let w = imageData.width;
    let slice_width = Math.floor(w / num_slices);

    let rotated_slices = [];

    for (let i = 0; i < num_slices; i++) {
        let x_start = i * slice_width;
        let x_end = (i + 1) * slice_width;
        if (i === num_slices - 1) {
            x_end = w;
        }

        let slice_canvas = document.createElement("canvas");
        let slice_ctx = slice_canvas.getContext("2d");
        slice_canvas.width = x_end - x_start;
        slice_canvas.height = h;
        slice_ctx.putImageData(imageData, -x_start, 0);

        // Rotate 90 degrees counterclockwise
        let rotated_canvas = document.createElement("canvas");
        let rotated_ctx = rotated_canvas.getContext("2d");
        rotated_canvas.width = slice_canvas.height;
        rotated_canvas.height = slice_canvas.width;
        rotated_ctx.translate(rotated_canvas.width / 2, rotated_canvas.height / 2);
        rotated_ctx.rotate(-Math.PI / 2);
        rotated_ctx.drawImage(slice_canvas, -slice_canvas.width / 2, -slice_canvas.height / 2);

        rotated_slices.push(rotated_canvas);
    }

    let rotated_slice_v2 = [];

    for (let i = 0; i < num_slices / 2; i++) {
        rotated_slice_v2.push(rotated_slices[i]);
        rotated_slice_v2.push(rotated_slices[num_slices - (i + 1)]);
    }

    // Combine the slices vertically
    let final_canvas = document.createElement("canvas");
    let final_ctx = final_canvas.getContext("2d");
    final_canvas.width = rotated_slice_v2[0].width;
    final_canvas.height = rotated_slice_v2.reduce((acc, slice) => acc + slice.height, 0);

    let y_offset = 0;
    for (let slice of rotated_slice_v2) {
        final_ctx.drawImage(slice, 0, y_offset);
        y_offset += slice.height;
    }

    return final_canvas; // Return the result as a canvas
}

function get_square_slices(img, num_slices){
    let h = img.height
    let w = img.width

    if (h > w){
        let slice_size = Math.floor(w / num_slices)
        let num_slice_h = Math.floor( h / slice_size)

        return [num_slices, num_slice_h]
    } else {
        let slice_size = Math.floor( h / num_slices)
        let num_slice_w = Math.floor(w / slice_size)

        return [num_slice_w, num_slices]
    }
}

function rollage_art(img, num_slices = 22){
    let flip_image = flip_horizontal(img)
    let flip_image2 = flipVertical(flip_image)

    let square_slices = get_square_slices(img, num_slices)

    let new_image = slice_and_rotate(flip_image2, square_slices[0])
    let new_image_2 = slice_and_rotate(new_image,square_slices[1])

    render_to_main_canvas(new_image_2)
}