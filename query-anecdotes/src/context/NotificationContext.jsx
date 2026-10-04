import { createContext, useCallback, useEffect, useRef, useState } from 'react'

const NotificationContext = createContext(null)

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState(null)
  const timeoutRef = useRef(null)

  const notify = useCallback((message, duration = 5000) => {
    setNotification(message)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null)
      timeoutRef.current = null
    }, duration)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notification, setNotification, notify }}>
      {props.children}
    </NotificationContext.Provider>
  )
}