/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'

const useUpdateEffect = (callback, dependencies) => {
  if (typeof callback !== 'function') {
    throw new Error('First argument must be a function')
  }
  if (!Array.isArray(dependencies)) {
    throw new Error('Second argument must be an array')
  }

  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    const cleanup = callback()
    return cleanup
  }, dependencies)
}

export default useUpdateEffect
