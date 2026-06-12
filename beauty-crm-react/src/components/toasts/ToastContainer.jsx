import {Toast} from "./Toast.jsx";

export function ToastContainer({
                                 toastsArray,
                                 removeToast,
                               }) {
  return (
    <>

      {toastsArray.map(toast => <Toast key={toast.id} {...toast} removeToast={removeToast} />)}

    </>
  )
}