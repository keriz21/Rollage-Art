from PIL import Image

image = Image.open("gusdur_square.jpg")

flipped_image = image.transpose(Image.FLIP_LEFT_RIGHT)

new_width = image.width * 2
new_image = Image.new("RGB",(new_width, image.height))

new_image.paste(image, (0,0))
new_image.paste(flipped_image, (image.width, 0))

flipped_vertical = new_image.transpose(Image.ROTATE_180)

new_height = image.height * 2

new_image_v2 = Image.new("RGB",(new_image.width,new_height))

new_image_v2.paste(new_image,(0,0))
new_image_v2.paste(flipped_vertical, (0, new_image.height))

slices_1 = []

num_slices = 22
slice_width = new_image_v2.width // num_slices
slice_height = new_image_v2

new_image.save("hasil.jpg")
new_image_v2.save("hasil_v2.jpg")

new_image.show()