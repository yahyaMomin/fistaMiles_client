import { toast } from 'react-toastify'

const notify = (Type, msg) => {
  switch (Type) {
    case 'success':
      toast.success(msg)
      break
    case 'error':
      toast.error(msg)
      break
    case 'info':
      toast.info(msg)
      break
    case 'warn':
      toast.warn(msg)
      break
    default:
      toast(msg)
  }
}

export default notify
