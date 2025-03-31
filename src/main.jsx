import { createRoot } from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
// import './responsive.css'
import './i18n/i18n'

const root = createRoot(document.getElementById('root'))
root.render(<App />)
