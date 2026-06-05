import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Listing from './pages/Listing'
import CardDetail from './pages/CardDetail'
import Apply from './pages/Apply'
import Promotions from './pages/Promotions'
import Compare from './pages/Compare'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // The phone screen scrolls inside <main> (overflow-y-auto on desktop), so a
    // plain window.scrollTo leaves it mid-page on navigation. Reset both.
    window.scrollTo(0, 0)
    document.querySelector('main')?.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Listing />} />
          <Route path="/cards/:slug" element={<CardDetail />} />
          <Route path="/apply/:slug" element={<Apply />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/compare" element={<Compare />} />
        </Route>
      </Routes>
    </>
  )
}
