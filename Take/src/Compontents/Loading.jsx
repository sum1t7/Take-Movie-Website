import React from 'react';

const PinkLoading = ({ size = 64, speed = 1.5 , hscreen = "min-h-screen"}) => {
  const loaderStyle = {
    width: size,
    height: size,
    animation: `spin ${speed}s ease-in-out infinite`,
  };

  return (
    <div className={`flex bg-gray-900 items-center justify-center  ${hscreen}`}>
      <div 
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Outer Ring */}
        <div
          className="absolute border-4 border-pink-200 rounded-full"
          style={{
            width: size,
            height: size,
            borderTopColor: 'transparent',
            animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
          }}
        ></div>
        
        {/* Middle Ring */}
        <div
          className="absolute border-4 border-pink-400 rounded-full"
          style={{
            width: size * 0.7,
            height: size * 0.7,
            left: size * 0.15,
            top: size * 0.15,
            borderRightColor: 'transparent',
            animation: `spin ${speed * 0.8}s linear infinite`,
          }}
        ></div>
        
        {/* Inner Dot */}
        <div
          className="absolute bg-pink-600 rounded-full"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            left: size * 0.4,
            top: size * 0.4,
            animation: `pulse 1s ease-in-out infinite`,
          }}
        ></div>
      </div>
    </div>
  );
};

// Add these keyframes to your CSS
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.9); opacity: 0.5; }
  }

  .border-pink-200 { border-color: #fecdd3; }
  .border-pink-400 { border-color: #fb7185; }
  .bg-pink-600 { background-color: #db2777; }
`;

// Add the styles to the document head
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PinkLoading;