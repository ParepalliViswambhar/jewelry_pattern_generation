import os
import io
from collections import Counter
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import tensorflow as tf
from PIL import Image
import numpy as np
import cv2

load_dotenv()

app = Flask(__name__)

# Configure CORS
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',')
CORS(app, resources={r"/process-image": {"origins": allowed_origins}})

# Load model
MODEL_PATH = os.getenv('MODEL_PATH', 'generator.keras')
try:
    generator_model = tf.keras.models.load_model(MODEL_PATH)
    input_size = generator_model.input_shape[1:3]
    print(f"Successfully loaded model: {MODEL_PATH}")
    print(f"Model input size: {input_size}")
except Exception as e:
    raise RuntimeError(f"Failed to load the GAN model from '{MODEL_PATH}': {e}")

# Function to detect the dominant background color
def detect_dominant_color(image):
    pixels = list(image.getdata())
    most_common_color = Counter(pixels).most_common(1)[0][0]
    return most_common_color

# Function to refine the background color
def refine_background(image, bg_color, threshold=120):
    datas = image.getdata()
    new_data = []
    
    for item in datas:
        diff = sum(abs(item[i] - bg_color[i]) for i in range(3))
        if diff <= threshold:
            new_data.append((255, 255, 255, 255))
        else:
            new_data.append(item)
    
    image.putdata(new_data)
    return image

# Function to convert an image to a pencil sketch
def image_to_sketch(image):
    gr = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    invert = cv2.bitwise_not(gr)
    blur = cv2.GaussianBlur(invert, (21, 21), 0)
    inverted_blur = cv2.bitwise_not(blur)
    sketch = cv2.divide(gr, inverted_blur, scale=256.0)
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sketch = cv2.filter2D(sketch, -1, kernel)
    _, sketch = cv2.threshold(sketch, 240, 255, cv2.THRESH_BINARY)
    return sketch

# Image preprocessing function
def preprocess_image(image, target_size=(1024, 1024)):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize(target_size, Image.LANCZOS)
    image_array = np.array(image) / 127.5 - 1
    return np.expand_dims(image_array, axis=0)

# Image postprocessing function with white background application
def postprocess_image(image_array, output_format='JPEG'):
    image_array = ((image_array + 1) * 127.5).astype(np.uint8)
    image = Image.fromarray(np.squeeze(image_array))

    if output_format.upper() in ['PNG', 'WEBP']:
        image = image.convert("RGBA")
        white_bg = Image.new("RGBA", image.size, (255, 255, 255, 255))
        image = Image.alpha_composite(white_bg, image)
    else:
        image = image.convert("RGB")
    
    return image

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'ML Service is running'}), 200

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'imageInput' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_file = request.files['imageInput']
        output_format = request.form.get('output_format', 'JPEG').upper()

        if output_format not in ['JPEG', 'PNG', 'WEBP', 'AVIF']:
            return jsonify({'error': 'Unsupported output format. Use JPEG, PNG, WEBP, or AVIF.'}), 400
        
        # Load image into OpenCV format
        file_bytes = np.asarray(bytearray(image_file.read()), dtype=np.uint8)
        cv_image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if cv_image is None:
            return jsonify({'error': 'Invalid image file.'}), 400

        # Convert the OpenCV image to PIL format
        img = Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGBA))

        # Change background to white before sketching
        bg_color = detect_dominant_color(img)
        img = refine_background(img, bg_color, threshold=190)
        img = refine_background(img, (255, 255, 255), threshold=190)

        # Convert the image to a sketch
        sketch_image = image_to_sketch(np.array(img))

        # Convert the sketch to PIL for further processing
        sketch_pil = Image.fromarray(sketch_image)

        # Preprocess the sketch for the GAN model
        input_tensor = preprocess_image(sketch_pil, target_size=tuple(input_size))

        # Generate output using GAN model
        output_tensor = generator_model.predict(input_tensor)
        output_image = postprocess_image(output_tensor[0], output_format)

        # Send image directly in response (no local storage)
        image_io = io.BytesIO()
        output_image.save(image_io, format=output_format)
        image_io.seek(0)

        return send_file(image_io, mimetype=f'image/{output_format.lower()}')
    except Exception as e:
        return jsonify({'error': f'An internal error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(port=port, debug=os.getenv('FLASK_ENV') == 'development')
