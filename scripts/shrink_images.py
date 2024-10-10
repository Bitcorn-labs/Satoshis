import os
from PIL import Image

def resize_image(input_path, output_path, max_width):
    with Image.open(input_path) as img:
        width_percent = max_width / float(img.size[0])
        new_height = int(float(img.size[1]) * width_percent)
        resized_img = img.resize((max_width, new_height), Image.ANTIALIAS)
        resized_img.save(output_path, optimize=True, quality=85)  # Adjust quality as needed

def resize_images_in_folder(input_folder, output_folder, max_width=1024):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for root, dirs, files in os.walk(input_folder):
        for file in files:
            if file.endswith(('.jpg', '.jpeg', '.png', '.gif')):
                input_file = os.path.join(root, file)
                relative_path = os.path.relpath(root, input_folder)
                output_dir = os.path.join(output_folder, relative_path)

                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)

                output_file = os.path.join(output_dir, file)
                resize_image(input_file, output_file, max_width)
                print(f"Resized: {input_file} -> {output_file}")

# Set the input folder, output folder, and desired width for resizing
input_folder = ''
output_folder = ''
max_width = 512  # Adjust this to your desired web size width

resize_images_in_folder(input_folder, output_folder, max_width)
