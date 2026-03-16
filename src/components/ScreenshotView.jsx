import React from 'react';

const ScreenshotView = ({ src, bgColor = '#F3F4F6', topCrop = 11.45, bottomCrop = 22.0 }) => {
  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: bgColor,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img 
        src={src}
        alt="Mockup"
        style={{
          width: '100%',
          height: 'auto',
          marginTop: `-${topCrop}%`,
          marginBottom: `-${bottomCrop}%`,
          display: 'block'
        }}
      />
    </div>
  );
};

export default ScreenshotView;
