'use client'

import React, { useState } from 'react'

interface PhotoItem {
  url: string
  alt: string
  caption?: string | null
}

interface VideoItem {
  videoId: string
  orientation: 'landscape' | 'portrait'
}

interface MediaTabsProps {
  photos: PhotoItem[]
  videos: VideoItem[]
}

export default function MediaTabs({ photos, videos }: MediaTabsProps) {
  const hasPhotos = photos.length > 0
  const hasVideos = videos.length > 0
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>(hasPhotos ? 'photos' : 'videos')

  const [photoIndex, setPhotoIndex] = useState(0)
  const [videoIndex, setVideoIndex] = useState(0)

  const prevPhoto = () => setPhotoIndex((c) => (c === 0 ? photos.length - 1 : c - 1))
  const nextPhoto = () => setPhotoIndex((c) => (c === photos.length - 1 ? 0 : c + 1))

  const prevVideo = () => setVideoIndex((c) => (c === 0 ? videos.length - 1 : c - 1))
  const nextVideo = () => setVideoIndex((c) => (c === videos.length - 1 ? 0 : c + 1))

  return (
    <div className="media-tabs">
      {/* Tab buttons — only show if both types exist */}
      {hasPhotos && hasVideos && (
        <div className="media-tab-bar">
          <button
            className={`media-tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            📷 Photos ({photos.length})
          </button>
          <button
            className={`media-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            ▶ Videos ({videos.length})
          </button>
        </div>
      )}

      {/* Photos tab */}
      {activeTab === 'photos' && hasPhotos && (
        <div className="photo-carousel">
          <div className="carousel-viewport">
            <img
              src={photos[photoIndex].url}
              alt={photos[photoIndex].alt}
              className="carousel-image"
            />
            {photos.length > 1 && (
              <>
                <button className="carousel-btn carousel-prev" onClick={prevPhoto} aria-label="Previous photo">‹</button>
                <button className="carousel-btn carousel-next" onClick={nextPhoto} aria-label="Next photo">›</button>
              </>
            )}
          </div>
          {photos[photoIndex].caption && (
            <p className="carousel-caption">{photos[photoIndex].caption}</p>
          )}
          {photos.length > 1 && (
            <div className="carousel-dots">
              {photos.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === photoIndex ? 'active' : ''}`}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
          {photos.length > 1 && (
            <p className="carousel-counter">{photoIndex + 1} / {photos.length}</p>
          )}
        </div>
      )}

      {/* Videos tab */}
      {activeTab === 'videos' && hasVideos && (
        <div className="video-carousel">
          <div className="carousel-viewport" style={{ background: 'transparent', boxShadow: 'none', overflow: 'visible' }}>
            <div className={`video-wrapper ${videos[videoIndex].orientation}`} style={{ margin: '0 auto' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videos[videoIndex].videoId}`}
                title={`Video ${videoIndex + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {videos.length > 1 && (
              <>
                <button
                  className="carousel-btn carousel-prev"
                  onClick={prevVideo}
                  aria-label="Previous video"
                  style={{ left: '-1rem' }}
                >‹</button>
                <button
                  className="carousel-btn carousel-next"
                  onClick={nextVideo}
                  aria-label="Next video"
                  style={{ right: '-1rem' }}
                >›</button>
              </>
            )}
          </div>

          {videos.length > 1 && (
            <>
              <div className="carousel-dots" style={{ marginTop: '1.5rem' }}>
                {videos.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot ${i === videoIndex ? 'active' : ''}`}
                    onClick={() => setVideoIndex(i)}
                    aria-label={`Video ${i + 1}`}
                  />
                ))}
              </div>
              <p className="carousel-counter">{videoIndex + 1} / {videos.length}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
