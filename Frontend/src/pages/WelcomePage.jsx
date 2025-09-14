import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import Particles from '../Animations/Particles';
import AlgoArenaLogo from '../components/AlgoArenaLogo';
import '../global.css';

function WelcomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-base-200 ">
      {/* Background Animation */}
      <div style={{ width: '100%', height: '600px', position: 'fixed' }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={400}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Navigation Bar */}
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
          <AlgoArenaLogo className="btn btn-ghost text-xl" />
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost p-2">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* Head */}
                <div className="w-3 h-3 bg-white rounded-full absolute top-2.5"></div>
                {/* Body */}
                <div className="w-6 h-4 bg-white rounded-t-full absolute bottom-0"></div>
              </div>
            </div>
            <div className="mt-3 shadow dropdown-content bg-[#2a2a2a] rounded-lg w-64 p-0 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-[#3a4a6b] p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center relative overflow-hidden">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-3"></div>
                  <div className="w-8 h-5 bg-white rounded-t-full absolute bottom-0"></div>
                </div>
                <div>
                  <div className="text-white font-semibold">Hitesh Rathore</div>
                  <div className="text-blue-300 text-sm">My Profile</div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="card1 rotate-0">
                <NavLink to="/profile" className="flex items-center space-x-3 p-3 text-white hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Profile</span>
                </NavLink>

                <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-white hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span>Logout</span>
                </button>

                {user?.role === 'admin' && (
                  <NavLink to="/admin" className="flex items-center space-x-3 p-3 text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span>Admin</span>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 relative z-10">
        {/* Welcome Section */}
      <div className="hero min-h-screen">
  <div className="hero-content text-center -mt-14">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold shine-text text-white mb-6">
        Welcome to <span className="text-primary">AlgoArena</span>
      </h1>
      <p className="text-xl text-gray-300 mb-6">
        Master coding challenges and improve your problem-solving skills
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <div className="button2">
          <div className="gradient-container">
            <div className="gradient"></div>
          </div>
          <div className="label1 flex justify-center items-center">
            <NavLink
              to="/problems"
              className="text-white font-semibold text-lg text-center"
            >
              Lets Code
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}

export default WelcomePage;
