import os
from PIL import Image

def convert_to_webp(input_path, output_path, max_size_kb=100):
    # Open the image file
    with Image.open(input_path) as img:
        quality = 100  # Start with highest quality
        
        while True:
            # Convert image to WebP format and save it
            img.save(output_path, 'webp', quality=quality)

            # Check the file size in KB
            file_size_kb = os.path.getsize(output_path) / 1024

            # If the file size is less than the max size or quality is too low, stop
            if file_size_kb <= max_size_kb or quality <= 10:
                break
            
            # Reduce quality and try again
            quality -= 5

        print(f"Converted {input_path} to {output_path} with size {file_size_kb:.2f} KB")

def batch_convert_to_webp(folder_path, max_size_kb=100):
    # Create the 'webp' folder inside the given folder if it doesn't exist
    output_folder = os.path.join(folder_path, 'webp')
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(folder_path):
        input_path = os.path.join(folder_path, filename)

        # Skip non-image files
        if not input_path.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp')):
            continue
        
        # Output path in the 'webp' folder
        output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.webp')
        convert_to_webp(input_path, output_path, max_size_kb)

# Example usage
folder_path = ''  # Provide the full path to the folder
batch_convert_to_webp(folder_path, max_size_kb=100)
