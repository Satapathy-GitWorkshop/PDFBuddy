import ToolPage from '../components/ToolPage'
import { pdfToPpt } from '../utils/api'
export default function PDFtoPPT() {
  return <ToolPage title="PDF to PowerPoint" description="Convert PDF to editable PowerPoint slides"
    icon="📊" color="#ea580c" accept={{ 'application/pdf': ['.pdf'] }} buttonLabel="Convert to PPT" onProcess={pdfToPpt} />
}