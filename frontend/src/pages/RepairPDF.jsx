import ToolPage from '../components/ToolPage'
import { repairPDF } from '../utils/api'
export default function RepairPDF() {
  return <ToolPage title="Repair PDF" description="Fix damaged or corrupted PDF files" icon="🔧" color="#7c3aed" accept={{ 'application/pdf': ['.pdf'] }} buttonLabel="Repair PDF" onProcess={repairPDF} />
}
