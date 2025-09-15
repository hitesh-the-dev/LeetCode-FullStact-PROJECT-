import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import Galaxy from '../Animations/Galaxy';
import AlgoArenaLogo from '../components/AlgoArenaLogo';

// we will use zod library for validation bur we can't use zod alone , for using zod we have to install hookform resover
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  // i.e firstName string type ka hona chahiye and min length 3 , agar min 3 char nhi hai then throw this error:"Minimum character should be 3"

  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});


// react hook form npm ====> for documentation of react-form
function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });


    // yha pr jo errors hai uski help se apn ye kr skte hai: form fill krte time agar kich
    // mistake hai to uske niche red line aa jati hia(showing error) vo and ... eski help se
  // apn kr skte hai

//   errors ke pass ye es trah se obj ke form me aa jayega agar error aayi to vrna errors me present hr field ki value undefined rhegi:
//   const errors={
//         firstName: {
//             type: 'minLength',           // Type of validation that failed
//             message: 'Minimum character should be 3' // Custom error message
//         },
//         emailId: {
//            type: 'invalid_string',
//            message: 'Invalid Email'
//         }
  //    }
  // agar error nhi aayi toh
//   const errors={
//         firstName: undefined,
//         emailId: undefined
//    }


    // const submittedData = (data)=>{
    //     console.log(data);
    // }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');

    }
  }, [isAuthenticated, navigate]);// es navigate ke likhne ya na likhne se koi frk nhi pdta, but hm generally
                                 // ek constant likh dete hai

  const onSubmit = (data) => {
    console.log('Signup attempt with data:', data);
    dispatch(registerUser(data));

      // jaise hi form submit (register/signup)krenge to form ka data esme(uper wale data variable me) aa jayega
    // es data ko apn backend me bhej denge

    // Backend data ko send kar dena chaiye?
    // Backend se two things will come token(cookie) and msg "User registered succesfully", es token ko browser
    // handle krega i.e es token ko browser apne cookie me rkhega

    // ** es token ko browser ki cookie se apn apne code se acces nhi kr skte (kisis bhi script ka use krke apn
    // token ko nhi le skte from browser so that ye secure rhe)

    // **Q)esa kyu kiya browser ne ??
    //   Ans: let apnne kisi website ko visit kiya tb us website ke backend me HTML, CSS, JS chalegi agar kisi ne
    //        us code me apne cookie se token ko chori krne ka code likha hai to apni lnka lg jayegi esliye
    //        browser ne safety ke liye esko close kr diya i.e koi bhi code ke through es token ko access nhi kr skta
    //        from cookie

    // ab jb next time apn req krenge backend ko to browser es token ko khud se hi add kr dega req ke sath

    // ** and register krte hi backend se front page i.e apna name, photo, ... ye chije aayegi jisko apn ko frontend
    // pr show krna hoga, i.e es chiko ko global bnana pdega i.e REDUX ka use krna pdega

    // let apnne website pr register/login kr liya ab apnne us page(tab) ko chrome se close kr diya ya chrome hi close
    // kr diya and apn next time es page ko again open kr rhe hai(jaise likdin open krne ke liye apn kevel linkdin
    //   search krte hai to apn login hote hai phle se, apn ko login nhi krna hota)

    // es feature ko kese laye, kyoki jo bhi data backend se aaya tha first time register/login krne pr vo to
    //  redux ke pass tha and redux in - mamory store krta hai (RAM me) i.e jaise apnne us tab ko close kiya
    //  to data gayab ho jayega
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-base-200 overflow-y-hidden relative"> {/* Added a light bg for contrast */}

      <div style={{ width: '100%', height: '600px', position: 'fixed' }}>
         <Galaxy />
      </div>

      {/* Logo at top */}
      <div className="mb-8 relative z-10">
        <AlgoArenaLogo size="large" />
      </div>

      <div className="card w-96 rounded-[50px]  bg-[#fcfcfc] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] overflow-y-hidden">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-6 text-black">Sign Up</h2> {/* Added mb-6 for spacing */}
          <form onSubmit={handleSubmit(onSubmit)}> {/* i.e handleSubmit(CallBack) */}
            {/* First Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered rounded-xl w-full ${errors.firstName ? 'input-error' : ''}`}
                {...register('firstName')}

                    /* <input name="firstName" value="HR", here in above this firstName(...register('firstName'))
                is name(key) ka ki value of input element.
                ye user ka first name le lega as input,
                ab koi onChange() vgera likhne ki koi jrurat nhi hai ,ye khud handle kr lega,
                spread opetator lgaya hai bocz ye register() ek object return krke lega like this:
                    name: "firstName"
                    onChange:{}
                    onBlur:{}
                **form submit krne pr page bhi refresh nhi hoga eska bhi ye dhyan rkhta hai
                  */

              />
              {errors.firstName && (
                <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-black">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered rounded-xl w-full ${errors.emailId ? 'input-error' : ''}`} // Ensure w-full for consistency
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  // Added pr-10 (padding-right) to make space for the button
                  className={`input input-bordered rounded-xl w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}

              //  console.log(2 && 30)  output =30
              // esliye upper wale me agar errors.password ki value kuch hue  mean true hue to eske aage wali value
              // i.e span element print ho jayega i.e {errors.password.message} eski value but agar errors.password
              // ki value undefined(false) hue to ye first value i.e undefined (i.e nothing) print kra dega

              // esliye apn ternery opetaror ka bhi use kr skte hai
              // i.e {errors.password ? (<span className="text-error">{errors.password.message}</span>) : null}



                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" // Added transform for better centering, styling
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>



            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              {/* <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button> */}
            <button
  type="submit"
  disabled={loading}
  className={`button1 h-9 w-20`}
>
  {loading ? 'Signing Up...' : 'Sign Up'}
</button>


            </div>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6"> {/* Increased mt for spacing */}
            <span className="text-sm text-black">
              Already have an account?{' '}
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;