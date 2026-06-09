import closeIcon from "../../assets/general-icons/close-icon.svg";
import {useEffect} from "react";

export function Modal({
                        title,
                        onClose,
                        children,
                      }) {

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);


  return (
    <div
      className="modal__backdrop"
      onClick={handleBackdropClick}
    >
      <div className="modal__container">
        <button
          className="modal__close-button"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <img
            src={closeIcon}
            alt=""
            aria-hidden="true"
          />
        </button>

        <h2>{title}</h2>

        {children}
      </div>
    </div>
  )
}
