import ToolPage from '../components/ToolPage'
import { wordToPdf } from '../utils/api'
export default function WordtoPDF() {
  return <ToolPage title="Word to PDF" description="Convert Word documents to PDF format" icon="📄" color="#2563eb" accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'application/msword': ['.doc'] }} buttonLabel="Convert to PDF" onProcess={wordToPdf} />
}
