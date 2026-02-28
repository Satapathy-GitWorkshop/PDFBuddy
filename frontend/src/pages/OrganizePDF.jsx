import ToolPage from '../components/ToolPage'
import { organizePDF } from '../utils/api'
export default function OrganizePDF() {
  return <ToolPage title="Organize PDF" description="Reorder, delete, or rotate pages in your PDF" icon="🗂️" color="#E8302A" accept={{ 'application/pdf': ['.pdf'] }} buttonLabel="Organize PDF" onProcess={organizePDF} />
}
