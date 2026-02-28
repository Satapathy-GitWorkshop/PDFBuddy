import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
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

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/split-pdf" element={<SplitPDF />} />
          <Route path="/compress-pdf" element={<CompressPDF />} />
          <Route path="/rotate-pdf" element={<RotatePDF />} />
          <Route path="/watermark-pdf" element={<WatermarkPDF />} />
          <Route path="/protect-pdf" element={<ProtectPDF />} />
          <Route path="/unlock-pdf" element={<UnlockPDF />} />
          <Route path="/page-numbers" element={<PageNumbers />} />
          <Route path="/pdf-to-jpg" element={<PDFtoJPG />} />
          <Route path="/jpg-to-pdf" element={<JPGtoPDF />} />
          <Route path="/pdf-to-word" element={<PDFtoWord />} />
          <Route path="/word-to-pdf" element={<WordtoPDF />} />
          <Route path="/pdf-to-excel" element={<PDFtoExcel />} />
          <Route path="/excel-to-pdf" element={<ExceltoPDF />} />
          <Route path="/pdf-to-ppt" element={<PDFtoPPT />} />
          <Route path="/ppt-to-pdf" element={<PPTtoPDF />} />
          <Route path="/html-to-pdf" element={<HTMLtoPDF />} />
          <Route path="/organize-pdf" element={<OrganizePDF />} />
          <Route path="/sign-pdf" element={<SignPDF />} />
          <Route path="/ocr-pdf" element={<OCR />} />
          <Route path="/crop-pdf" element={<CropPDF />} />
          <Route path="/repair-pdf" element={<RepairPDF />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
