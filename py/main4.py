import cv2 
import numpy as np

def flip_horizontal(img):
    img2 = cv2.flip(img,1)

    result = cv2.hconcat([img,img2])
    return result

def flip_vertical(img):
    img2 = cv2.flip(img,0)
    result = cv2.vconcat([img, img2])
    return result

def slice_and_rotate(img, num_slices = 30):
    h,w,c = img.shape

    slice_width = w // num_slices

    rotated_slices = []

    for i in range(num_slices):
        x_start = i * slice_width
        x_end = (i+1) * slice_width if i != num_slices -1 else w

        slice_img = img[:,x_start:x_end]

        rotated_slice = cv2.rotate(slice_img, cv2.ROTATE_90_COUNTERCLOCKWISE)  # Rotate 90 derajat
        rotated_slices.append(rotated_slice)

    rotated_slice_v2 = []

    for i in range(num_slices // 2):
        rotated_slice_v2.append(rotated_slices[i])
        rotated_slice_v2.append(rotated_slices[-(i+1)])

    final_image = cv2.vconcat(rotated_slice_v2)  # Gabungkan hasilnya secara vertikal
    return final_image

def get_square_slices(img, num_slices):
    h, w, c = img.shape
    
    if h > w : 
        slice_size = w // num_slices
        num_slice_h = int(h / slice_size)

        return num_slices, num_slice_h
    else:
        slice_size = h // num_slices
        num_slice_w = int(w / slice_size)

        return num_slice_w, num_slices


def rollage_art(img_path, num_slices = 22):
    img = cv2.imread(img_path)
    h,w,c = img.shape

    slice_width, slice_height = get_square_slices(img, num_slices)

    print("slice w: ",slice_width)
    print("slice h: ",slice_height)

    hasil_flip = flip_vertical(flip_horizontal(img))
    hasil_w = slice_and_rotate(hasil_flip, num_slices=slice_width)
    hasil_h = slice_and_rotate(hasil_w, num_slices=slice_height)

    cv2.imwrite("hasil_v1.2.jpg",hasil_h)

    print("hello world")

    pass

# img_path = "WIN_20250101_00_37_06_Pro.jpg"
# img = cv2.imread(img_path)
# hasil = flip_vertical(flip_horizontal(img))
# hasil2 = slice_and_rotate(hasil)
# hasil3 = slice_and_rotate(hasil2)


# cv2.imwrite("hasil_v7.jpg", hasil3)

if __name__ == "__main__":
    rollage_art("WIN_20250101_00_37_06_Pro.jpg")