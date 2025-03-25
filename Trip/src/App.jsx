import { useState } from 'react'
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './Components/Customs/Hero'
import Header from "./Components/Customs/Header";
import Index from './Components/Create_trip/Index'
import { Toaster } from './Components/ui/toaster'
import Trip from './Components/View_trip/Trip'
import { CartProvider } from "./Components/Context/CartContext"
// Corrected import path for HotelsCart
import HotelsCart from './Components/Customs/HotelsCart'



function App() {
  const [count, setCount] = useState(0)


  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Toaster />
        <Routes >
          <Route path='/' element={<Hero />} />
          <Route path='/Create_trip' element={<Index />} />
          <Route path='view-trip/:tripId' element={<Trip />} />
          <Route path='/hotels-cart' element={<HotelsCart />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>

  )
}

export default App
