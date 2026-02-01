import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faWandMagicSparkles, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button';
import './UploadSection.css';

const UploadSection = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => setUploadedImage({ file: file, preview: reader.result });
    reader.readAsDataURL(file);
    setGeneratedImage(null);
  };

  const openFileDialog = () => {
    document.getElementById('file-input').click();
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    try {
      const token = sessionStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('imageInput', uploadedImage.file);
      
      const response = await fetch(process.env.REACT_APP_API_URL + '/api/image/generate', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedImage(data.design.designUrl);
      } else {
        const errorData = await response.json();
        console.error('Generation failed:', errorData.message);
        alert('Failed to generate design. Please try again.');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('An error occurred while generating the design.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="section-upload">
      <div className="section-header">
        <h1>Create Design</h1>
        <p>Upload your jewelry sketch and let AI work its magic</p>
      </div>

      <div className="upload-workspace">
        <div className="images-row">
          <div className="image-box">
            <h3 className="image-box-title">Your Sketch</h3>
            <div 
              className={'upload-zone ' + (dragActive ? 'drag-active ' : '') + (uploadedImage ? 'has-image' : '')}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div className="preview-container">
                  <img src={uploadedImage.preview} alt="Uploaded" />
                  <button className="change-image" onClick={openFileDialog}>
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="upload-prompt">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
                  <p>Drag and drop your sketch here</p>
                  <span>or</span>
                  <Button variant="secondary" onClick={openFileDialog}>
                    Browse Files
                  </Button>
                  <p className="upload-hint">Supports JPEG, PNG, WEBP, AVIF</p>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                hidden
              />
            </div>
          </div>

          <div className="transform-arrow">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>

          <div className="image-box">
            <h3 className="image-box-title">Generated Design</h3>
            <div className={'result-zone ' + (generatedImage ? 'has-result' : '')}>
              {isGenerating ? (
                <div className="generating-state">
                  <div className="loader-ring"></div>
                  <p>Creating your design...</p>
                </div>
              ) : generatedImage ? (
                <div className="result-container">
                  <img src={generatedImage} alt="Generated" />
                  <a href={generatedImage} download="lustre-design.png" className="download-btn">
                    <FontAwesomeIcon icon={faDownload} />
                    Download
                  </a>
                </div>
              ) : (
                <div className="result-placeholder">
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                  <p>Your generated design will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="generate-section">
          <Button 
            onClick={handleGenerate} 
            disabled={!uploadedImage || isGenerating}
            size="lg"
            icon={<FontAwesomeIcon icon={isGenerating ? faSpinner : faWandMagicSparkles} spin={isGenerating} />}
          >
            {isGenerating ? 'Generating...' : 'Generate Design'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
