import {useCallback, useState} from "react";

export function useToasts() {

  const [toasts, setToasts] = useState([])

  function showToast(type, message, duration = 3000) {
    const config = {
      id: Date.now(),
      type: type,
      message: message,
      duration: duration,
    }

    setToasts(prevToasts => [...prevToasts, config]);
  }

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return {showToast, removeToast, toasts}
}