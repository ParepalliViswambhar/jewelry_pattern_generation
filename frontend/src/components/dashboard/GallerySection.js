import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faExpand, faTimes, faSpinner, faImages, faDownload } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../ui/ConfirmModal';
import './GallerySection.css';

const ComparisonSlider = ({ sketchUrl, designUrl, onDragStateChange }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    if (onDragStateChange) onDragStateChange(true);
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (onDragStateChange) onDragStateChange(false);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    if (onDragStateChange) onDragStateChange(true);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (onDragStateChange) onDragStateChange(false);
  };

  const handleTouchMove = (e) => {
    if (isDragging.current) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      className="comparison-slider" 
      ref={containerRef}
      onTouchMove={handleTouchMove}
    >
      <div className="comparison-image design-side">
        <img src={designUrl} alt="Generated Design" />
        <span className="comparison-label right">Design</span>
      </div>
      <div 
        className="comparison-image sketch-side" 
        style={{ clipPath: 'inset(0 ' + (100 - sliderPosition) + '% 0 0)' }}
      >
        <img src={sketchUrl} alt="Sketch" />
        <span className="comparison-label left">Sketch</span>
      </div>
      <div 
        className="slider-handle"
        style={{ left: sliderPosition + '%' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="slider-line"></div>
        <div className="slider-button">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

const GallerySection = () => {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(process.env.REACT_APP_API_URL + '/api/image/gallery?page=' + page + '&limit=12', {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (response.ok) {
        const data = await response.json();
        setDesigns(data.designs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (designId, e) => {
    e.stopPropagation();
    setDeleteTarget(designId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(process.env.REACT_APP_API_URL + '/api/image/design/' + deleteTarget, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      if (response.ok) {
        setDesigns(designs.filter(d => d._id !== deleteTarget));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error('Error deleting design:', error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDownload = async (imageUrl, filename, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="section-gallery">
        <div className="section-header">
          <h1>Your Gallery</h1>
          <p>View all your generated designs</p>
        </div>
        <div className="gallery-loading">
          <FontAwesomeIcon icon={faSpinner} spin />
          <p>Loading your designs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-gallery">
      <div className="section-header">
        <h1>Your Gallery</h1>
        <p>{pagination.total} design{pagination.total !== 1 ? 's' : ''} created</p>
      </div>

      {designs.length === 0 ? (
        <div className="gallery-empty">
          <FontAwesomeIcon icon={faImages} />
          <h3>No designs yet</h3>
          <p>Start creating by uploading a sketch in the Create section</p>
        </div>
      ) : (
        <>
          <div className="gallery-grid">
            {designs.map((design) => (
              <div key={design._id} className="gallery-item">
                <ComparisonSlider sketchUrl={design.sketchUrl} designUrl={design.designUrl} />
                <div className="gallery-info">
                  <span className="gallery-date">{formatDate(design.createdAt)}</span>
                  <div className="gallery-actions">
                    <button className="action-btn download" onClick={(e) => handleDownload(design.designUrl, 'design-' + design._id + '.png', e)} title="Download">
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button className="action-btn view" onClick={() => setSelectedDesign(design)} title="View full size">
                      <FontAwesomeIcon icon={faExpand} />
                    </button>
                    <button className="action-btn delete" onClick={(e) => handleDeleteClick(design._id, e)} title="Delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="gallery-pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button key={page} className={'page-btn ' + (pagination.current === page ? 'active' : '')} onClick={() => fetchGallery(page)}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedDesign && (
        <div className="lightbox" onClick={() => !isSliderDragging && setSelectedDesign(null)}>
          <button className="lightbox-close" onClick={() => setSelectedDesign(null)}><FontAwesomeIcon icon={faTimes} /></button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-slider">
              <ComparisonSlider 
                sketchUrl={selectedDesign.sketchUrl} 
                designUrl={selectedDesign.designUrl}
                onDragStateChange={setIsSliderDragging}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Design"
        message="Are you sure you want to delete this design? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </section>
  );
};

export default GallerySection;
