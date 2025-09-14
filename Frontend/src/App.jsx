import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WelcomePage from "./pages/WelcomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete"
import AdminUpdate from "./components/AdminUpdate";
import LogoPopup from "./components/LogoPopup";


function App(){

  // user login / signup page pr ja rha hai to apn backend me phle se hi req bhej denge(browser token bhejega eske sath) ki ye valid user
  // hai ya nhi agar ha to apn esko direct home page pr leke chale jayenge

  // code likhna isAuthentciated
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const [hasShownLogo, setHasShownLogo] = useState(false);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);//[dispatch] esko apn empty bhi rkh skte the, bcoz dispatch is constant

  // Show logo popup for unauthenticated users (only on initial load)
  useEffect(() => {
    if (!loading && !isAuthenticated && !hasShownLogo) {
      setShowLogoPopup(true);
    }
  }, [loading, isAuthenticated, hasShownLogo]);

  // Reset popup state when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowLogoPopup(false);
      setHasShownLogo(false);
    }
  }, [isAuthenticated]);

  const handleLogoComplete = () => {
    setShowLogoPopup(false);
    setHasShownLogo(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  // Show logo popup before signup/login
  if (showLogoPopup) {
    return <LogoPopup onComplete={handleLogoComplete} />;
  }
    // agar ye uper wala kaam:
  // i.e:ye
  // if (loading) {
  //   return <div className="min-h-screen flex items-center justify-center">
  //     <span className="loading loading-spinner loading-lg"></span>
  //   </div>;
  // }
  // nhi krenge to jb apn home page pr honge to page refresh krne pr signup page dikhega then onthespot home page pr
  // leke aa jayega. vo signup page na dikhe esliye upper wala kaam kiya hai

  return(
  <>
    <Routes>
        {/* phle react-router-dom ka code alag hota tha(esi me Navigete hota tha) ab ye react-router me merge ho chuka hai  */}
      <Route path="/" element={isAuthenticated ?<WelcomePage></WelcomePage>:<Navigate to="/signup" />}></Route>
      <Route path="/problems" element={isAuthenticated ?<ProblemsPage></ProblemsPage>:<Navigate to="/signup" />}></Route>
      <Route path="/profile" element={isAuthenticated ?<ProfilePage></ProfilePage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated ?<Navigate to="/" /> : <Signup></Signup>}></Route>

        {/* <Route path="/admin" element={<AdminPanel />}></Route> */}
        {/* agar koi simple user /admin wali link pr gya to usko admin pannel wala page to mil jayega(bcoz hmne
            frontend me esko handle nhi kiya) but vo prblem create nhi kr
            payega bcoz backend me check hoga ki ye admin hai ya nhi */}

        {/* <OR> */}
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
         {/* but agar es line ko likhe(just above wali) to ab simple user admin wale page pr nhi ja skta , *Q)but ab admin wala user
         bhi nhi ja pa rha why??*/}
        {/* hint: agar apn manually kisi route pr ja rhe hai (i.e search bar me likhke) to page refresh ho rha/jata hai */}
        {/* but agar button pr click krke jate hai to page refresh nhi hota  */}

        {/* **user?.role yha pr ?mark lgana bhut jruri hai vrna error aa skti hai(go to console then check), bcoz initially
        urer ke role ki value null hogi */}

        {/* jb problema create kr rhe hai admin pannel se to reference solution me \n dene ki koi jarurat nhi hai , jaisi
        hi apn code me next line me jayenge to vo khud se hi \n lga dega
        i.e we don't have to write code like this : #include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n

        just write as usal, mean jaise apn online gdb me likhte hai like:
         #include <iostream>
         using namespace std;

         int main()
         {
           int a, b;
           cin>>a+b;
           cout<<a+b;

           return 0;
         } */}
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>

    </Routes>
  </>
  )
}

export default App;