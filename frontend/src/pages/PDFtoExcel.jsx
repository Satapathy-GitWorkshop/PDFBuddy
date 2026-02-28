import ToolPage from '../components/ToolPage'
import { pdfToExcel } from '../utils/api'
export default function PDFtoExcel() {
  return <ToolPage title="PDF to Excel" description="Extract tables from PDF to Excel spreadsheet" icon="📈" color="#16a34a" accept={{ 'application/pdf': ['.pdf'] }} buttonLabel="Convert to Excel" onProcess={pdfToExcel} />
}
