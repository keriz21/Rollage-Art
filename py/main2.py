import cv2
import numpy as np

def process_image_opencv(image_path, num_slices=22):
    # Baca gambar
    img = cv2.imread(image_path)  
    h, w, c = img.shape  # Dapatkan tinggi, lebar, dan channel gambar

    # Flip gambar secara horizontal
    flipped_img = cv2.flip(img, 1)

    # Gabungkan gambar asli dan flipped secara horizontal
    new_width = w * 2
    new_image = np.zeros((h, new_width, c), dtype=np.uint8)
    new_image[:, :w] = img
    new_image[:, w:] = flipped_img

    # Flip gambar secara vertikal
    flipped_vertical = cv2.rotate(new_image, cv2.ROTATE_180)

    # Gabungkan gambar asli dan flipped secara vertikal
    new_height = h * 2
    new_image_v2 = np.zeros((new_height, new_width, c), dtype=np.uint8)
    new_image_v2[:h, :] = new_image
    new_image_v2[h:, :] = flipped_vertical

    # **Membagi gambar menjadi 22 bagian vertikal**
    slice_width = new_width // num_slices
    slices = [new_image_v2[:, i * slice_width:(i + 1) * slice_width] for i in range(num_slices)]

    # **Gabungkan kembali dari kiri ke kanan**
    final_image = np.zeros((new_height, new_width, c), dtype=np.uint8)
    x_offset = 0
    for i in range(num_slices):
        final_image[:, x_offset:x_offset + slice_width] = slices[i]
        x_offset += slice_width

    # Simpan hasil
    cv2.imwrite("hasil_opencv.jpg", new_image)
    cv2.imwrite("hasil_v2_opencv.jpg", new_image_v2)
    cv2.imwrite("hasil_final.jpg", final_image)

    # Tampilkan hasil
    cv2.imshow("Final Image", final_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# Jalankan fungsi
process_image_opencv("gusdur_square.jpg")
