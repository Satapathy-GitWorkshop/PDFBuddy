import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000, // 2 minutes for large files
})

const processFile = async (endpoint, files, extraData = {}) => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  Object.entries(extraData).forEach(([k, v]) => formData.append(k, v))

  const res = await API.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const mergePDF = (files) => processFile('/merge', files)
export const splitPDF = (files, options) => processFile('/split', files, options)
export const compressPDF = (files, options) => processFile('/compress', files, options)
export const rotatePDF = (files, options) => processFile('/rotate', files, options)
export const watermarkPDF = (files, options) => processFile('/watermark', files, options)
export const protectPDF = (files, options) => processFile('/protect', files, options)
export const unlockPDF = (files, options) => processFile('/unlock', files, options)
export const pageNumbersPDF = (files, options) => processFile('/page-numbers', files, options)
export const pdfToJpg = (files, options) => processFile('/pdf-to-jpg', files, options)
export const jpgToPdf = (files, options) => processFile('/jpg-to-pdf', files, options)
export const pdfToWord = (files) => processFile('/pdf-to-word', files)
export const wordToPdf = (files) => processFile('/word-to-pdf', files)
export const pdfToExcel = (files) => processFile('/pdf-to-excel', files)
export const excelToPdf = (files) => processFile('/excel-to-pdf', files)
export const pdfToPpt = (files) => processFile('/pdf-to-ppt', files)
export const pptToPdf = (files) => processFile('/ppt-to-pdf', files)
export const htmlToPdf = (_, options) => processFile('/html-to-pdf', [], options)
export const organizePDF = (files, options) => processFile('/organize', files, options)
export const signPDF = (files, options) => processFile('/sign', files, options)
export const ocrPDF = (files, options) => processFile('/ocr', files, options)
export const cropPDF = (files, options) => processFile('/crop', files, options)
export const repairPDF = (files) => processFile('/repair', files)

export default API
