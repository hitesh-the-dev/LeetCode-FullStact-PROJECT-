import { useState, useEffect } from 'react';

const CelebrationPopup = ({ isVisible, onClose, message }) => {
  const [show, setShow] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setAnimationClass('animate-bounce');
      
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setAnimationClass('animate-fadeOut');
    setTimeout(() => {
      setShow(false);
      onClose();
    }, 300);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-2xl shadow-2xl text-white text-center max-w-md mx-4 ${animationClass}`}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
        <p className="text-xl mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleClose}
            className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationPopup;
