export const Error = ({ msg = 'Something went wrong!' }) => (
  <small className='text-danger' role='alert'>
    {msg}
  </small>
)

export const Success = ({ msg = 'Success!', color = 'success' }) => (
  <small className={`text-${color}`} role='alert'>
    {msg}
  </small>
)
