import './App.css'
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import Home from '@/page/home';
import Navbar from '@/comp/navbar';
import Footer from '@/comp/footer';
import { useEffect, useState } from 'react';
import Signup from '@/page/signup';
import Login from '@/page/login';
import { Toaster } from "sonner";



function AppLayout ({children}: { children: React.ReactNode }) {
  const location = useLocation();
  const [showNavbarFooter, setShowNavbarFooter] = useState(true);

  useEffect(() => {
    const hiddenRoutes = ["/signup", "/login"];
    setShowNavbarFooter(!hiddenRoutes.includes(location.pathname));
  }, [location]);

  return (
    <>
      {showNavbarFooter && <Navbar/>}
      {children}
      {showNavbarFooter && <Footer/>}
    </>
  )
}


function App() {
    const router = createBrowserRouter([
    {path: "/" , element: <AppLayout><Home/></AppLayout>},
    { path: "/signup", element: <div><Signup/></div> },
    {path: "/login", element: <div><Login/></div>},
  ])

  return (
    <> 
    <Toaster 
     position="top-right"
     expand={true}
     richColors 
     />
    <RouterProvider router={router} />
    </>
  )
}

export default App