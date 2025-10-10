import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import WishListPage from "./pages/WishListPage.jsx";
import CreateListingPage from "./pages/CreateListingPage.jsx";
import ViewPage from "./pages/ViewPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";

function App() {
  return (
     <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/wishlist' element={<WishListPage/>} />
          <Route path='/create-listing' element={<CreateListingPage/>} />
          <Route path='/listing/:id' element={<ViewPage/>} />
          <Route path='/booking/:id' element={<BookingPage/>} />
        </Routes>
      </Router>
  )
}

export default App
