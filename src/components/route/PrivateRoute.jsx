import { Navigate } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'

const PrivateRoute = ({ element }) => {
  const token = getToken()
  return token ? element : <Navigate to='/' replace />
}

export default PrivateRoute
