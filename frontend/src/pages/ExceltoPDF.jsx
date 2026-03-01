import ToolPage from '../components/ToolPage'
import { excelToPdf } from '../utils/api'
export default function ExceltoPDF() {
  return <ToolPage
    title="Excel to PDF" description="Convert Excel spreadsheets to PDF"
    icon="📉" color="#16a34a"
    accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }}
    buttonLabel="Convert to PDF" onProcess={excelToPdf} />
}