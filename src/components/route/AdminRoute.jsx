import { Navigate } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'

const AdminRoute = ({ element }) => {
  const token = getToken()
  return token && token.role === 'admin' ? element : <Navigate to='/' replace />
}

export default AdminRoute
