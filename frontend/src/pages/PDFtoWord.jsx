import ToolPage from '../components/ToolPage'
import { pdfToWord } from '../utils/api'
export default function PDFtoWord() {
  return <ToolPage title="PDF to Word" description="Convert PDF to editable Word document" icon="📝" color="#2563eb" accept={{ 'application/pdf': ['.pdf'] }} buttonLabel="Convert to Word" onProcess={pdfToWord} />
}
