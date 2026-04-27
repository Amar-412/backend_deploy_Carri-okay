import React from 'react';
import './VideoBackground.css';

function VideoBackground({ src, poster }) {
  return (
    <div className="video-background">
      <video
        className="video-background__video"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="video-background__overlay" />
    </div>
  );
}

export default VideoBackground;

