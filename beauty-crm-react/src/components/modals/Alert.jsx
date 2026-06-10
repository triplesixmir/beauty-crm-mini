import closeIcon from "../../assets/general-icons/close-icon.svg";
import {useEffect} from "react";

export function Alert({
                        title,
                        description,
                        secondDescription,
                        submitButtonText,
                        cancelButtonText,
                        onClose,
                        onSubmit,
                      }) {

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

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
      className="alert__backdrop"
      onClick={handleBackdropClick}
    >
      <div className="alert__container">
        <button
          className="alert__close-button"
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
        {description && <p>{description}</p>}
        {secondDescription && <p>{secondDescription}</p>}

        <div className="alert__buttons">
          <button
            type="button"
            onClick={onSubmit}
          >{submitButtonText}
          </button>
          {cancelButtonText && <button
            type="button"
            onClick={onClose}
          >{cancelButtonText}
          </button>}
        </div>

      </div>
    </div>
  )
}