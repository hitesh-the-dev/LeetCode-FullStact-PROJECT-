import { useState, useEffect } from 'react';

const LogoPopup = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0); // 0: initial, 1: logo, 2: complete
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Start the animation sequence
    const timer1 = setTimeout(() => {
      setIsVisible(true);
      setAnimationPhase(1);
      setShowLogo(true);
    }, 300);

    // Complete the animation and show signup
    const timer2 = setTimeout(() => {
      setAnimationPhase(2);
    }, 2500);

    // Hide popup and show signup
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Simple Star Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Static star field */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Logo Container */}
      <div className="relative z-20 flex flex-col items-center justify-center">
          {/* Enhanced AlgoArena Logo */}
          <div
            className={`transition-all duration-2000 ease-out transform ${
              showLogo ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            } ${
              animationPhase === 2 ? 'scale-110' : ''
            }`}
            style={{
              transitionDelay: '500ms',
              filter: 'drop-shadow(0 0 30px rgba(30, 58, 138, 1)) drop-shadow(0 0 60px rgba(147, 51, 234, 0.5))',
            }}
          >
          {/* Main A Shape */}
          <div className="relative">
            {/* Enhanced A Shape with Gradient */}
            <div
              className="w-40 h-40 md:w-48 md:h-48 relative"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, #f59e0b 100%)',
                clipPath: 'polygon(50% 10%, 20% 80%, 30% 80%, 50% 30%, 70% 80%, 80% 80%)',
                boxShadow: '0 0 40px rgba(30, 58, 138, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2), 0 0 80px rgba(147, 51, 234, 0.3)',
                animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              {/* Highlight on top edge */}
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                }}
              />
            </div>

            {/* Enhanced Z Shape inside A */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1500 ${
                showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{
                transitionDelay: '800ms',
              }}
            >
              <div className="relative">
                {/* Enhanced Z Shape - Glowing White */}
                <div className="w-20 h-10 relative">
                  {/* Top horizontal line */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full shadow-lg"></div>
                  {/* Diagonal line */}
                  <div
                    className="absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full transform -translate-y-1/2 rotate-12 origin-left shadow-lg"
                    style={{ width: '120%' }}
                  ></div>
                  {/* Bottom horizontal line */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Logo Text */}
          <div
            className={`mt-8 text-center transition-all duration-2000 ${
              showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionDelay: '1000ms',
            }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AlgoArena
              </span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full shadow-lg"></div>
            <p className="text-lg text-gray-300 mt-4 font-light">
              Master the Art of Coding
            </p>
          </div>
        </div>

        {/* Enhanced Loading indicator */}
        <div
          className={`mt-8 transition-all duration-1000 ${
            showLogo ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transitionDelay: '1500ms',
          }}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Fade out overlay */}
      {animationPhase === 2 && (
        <div className="absolute inset-0 bg-black transition-opacity duration-1000 opacity-100"></div>
      )}
    </div>
  );
};

export default LogoPopup;
