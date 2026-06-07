import closeIcon from "../../assets/general-icons/close-icon.svg";

export function Modal({
                        title,
                        onClose,
                        children,
                      }) {
  return (
    <div className="modal__backdrop">
      <div className="modal__container">
        <button className="modal__close-button" type="button" onClick={onClose} aria-label="Закрыть">
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>

        <h2>{title}</h2>

        {children}
      </div>
    </div>
  )
}
