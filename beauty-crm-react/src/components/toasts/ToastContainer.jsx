import {Toast} from "./Toast.jsx";

export function ToastContainer({
                                 toastsArray,
                                 removeToast,
                               }) {
  return (
    <div className="toast-container">
      {toastsArray.map(toast => <Toast key={toast.id} {...toast} removeToast={removeToast} />)}
    </div>
  )
}