import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import RotatePDF from './pages/RotatePDF'
import WatermarkPDF from './pages/WatermarkPDF'
import ProtectPDF from './pages/ProtectPDF'
import UnlockPDF from './pages/UnlockPDF'
import PageNumbers from './pages/PageNumbers'
import PDFtoJPG from './pages/PDFtoJPG'
import JPGtoPDF from './pages/JPGtoPDF'
import PDFtoWord from './pages/PDFtoWord'
import WordtoPDF from './pages/WordtoPDF'
import PDFtoExcel from './pages/PDFtoExcel'
import ExceltoPDF from './pages/ExceltoPDF'
import PDFtoPPT from './pages/PDFtoPPT'
import PPTtoPDF from './pages/PPTtoPDF'
import HTMLtoPDF from './pages/HTMLtoPDF'
import OrganizePDF from './pages/OrganizePDF'
import SignPDF from './pages/SignPDF'
import OCR from './pages/OCR'
import CropPDF from './pages/CropPDF'
import RepairPDF from './pages/RepairPDF'
import NotFound from './pages/NotFound'

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn' } }
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/merge-pdf"     element={<PageWrapper><MergePDF /></PageWrapper>} />
        <Route path="/split-pdf"     element={<PageWrapper><SplitPDF /></PageWrapper>} />
        <Route path="/compress-pdf"  element={<PageWrapper><CompressPDF /></PageWrapper>} />
        <Route path="/rotate-pdf"    element={<PageWrapper><RotatePDF /></PageWrapper>} />
        <Route path="/watermark-pdf" element={<PageWrapper><WatermarkPDF /></PageWrapper>} />
        <Route path="/protect-pdf"   element={<PageWrapper><ProtectPDF /></PageWrapper>} />
        <Route path="/unlock-pdf"    element={<PageWrapper><UnlockPDF /></PageWrapper>} />
        <Route path="/page-numbers"  element={<PageWrapper><PageNumbers /></PageWrapper>} />
        <Route path="/pdf-to-jpg"    element={<PageWrapper><PDFtoJPG /></PageWrapper>} />
        <Route path="/jpg-to-pdf"    element={<PageWrapper><JPGtoPDF /></PageWrapper>} />
        <Route path="/pdf-to-word"   element={<PageWrapper><PDFtoWord /></PageWrapper>} />
        <Route path="/word-to-pdf"   element={<PageWrapper><WordtoPDF /></PageWrapper>} />
        <Route path="/pdf-to-excel"  element={<PageWrapper><PDFtoExcel /></PageWrapper>} />
        <Route path="/excel-to-pdf"  element={<PageWrapper><ExceltoPDF /></PageWrapper>} />
        <Route path="/pdf-to-ppt"    element={<PageWrapper><PDFtoPPT /></PageWrapper>} />
        <Route path="/ppt-to-pdf"    element={<PageWrapper><PPTtoPDF /></PageWrapper>} />
        <Route path="/html-to-pdf"   element={<PageWrapper><HTMLtoPDF /></PageWrapper>} />
        <Route path="/organize-pdf"  element={<PageWrapper><OrganizePDF /></PageWrapper>} />
        <Route path="/sign-pdf"      element={<PageWrapper><SignPDF /></PageWrapper>} />
        <Route path="/ocr-pdf"       element={<PageWrapper><OCR /></PageWrapper>} />
        <Route path="/crop-pdf"      element={<PageWrapper><CropPDF /></PageWrapper>} />
        <Route path="/repair-pdf"    element={<PageWrapper><RepairPDF /></PageWrapper>} />
        <Route path="*"              element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '380px',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: 'white' },
            style: { border: '1px solid #c7d2fe', background: '#fafafa' }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'white' },
            style: { border: '1px solid #fecaca', background: '#fafafa' }
          }
        }}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}