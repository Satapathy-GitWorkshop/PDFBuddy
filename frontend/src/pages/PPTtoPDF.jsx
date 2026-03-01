import ToolPage from '../components/ToolPage'
import { pptToPdf } from '../utils/api'
export default function PPTtoPDF() {
  return <ToolPage
    title="PowerPoint to PDF" description="Convert PowerPoint presentations to PDF"
    icon="📋" color="#ea580c"
    accept={{ 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'], 'application/vnd.ms-powerpoint': ['.ppt'] }}
    buttonLabel="Convert to PDF" onProcess={pptToPdf} />
}