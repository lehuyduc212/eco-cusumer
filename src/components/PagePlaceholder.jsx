import React from 'react';

const PagePlaceholder = ({ title }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '32px',
      textAlign: 'center',
      color: '#6B7280'
    }}>
      <h1 style={{ color: '#0056D2', marginBottom: '16px' }}>{title}</h1>
      <p>Tính năng đang được phát triển.</p>
    </div>
  );
};

export default PagePlaceholder;
