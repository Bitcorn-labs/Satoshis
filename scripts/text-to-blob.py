def text_to_blob_format(text):
    # Convert the input text into hexadecimal blob format
    hex_blob = ''.join([f'\\{hex(ord(char))[2:]}' for char in text])
    
    # Format the blob string into your desired output format
    formatted_blob = f'memo = ?Blob.toArray("{hex_blob}" : Blob); // {text}'
    
    return formatted_blob

# Ask the user for input
user_input = input("Enter the text: ")

# Print the formatted result
print(text_to_blob_format(user_input))
