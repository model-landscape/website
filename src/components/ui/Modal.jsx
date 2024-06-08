import { useRef, useEffect } from "react";
import "./Modal.css";

function Modal({ isOpen, onClose, node }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const modal = modalRef.current;
        if (isOpen) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [isOpen]);

    const handleOutsideClick = (event) => {
        if (event.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <dialog ref={modalRef} className="modal" onClick={handleOutsideClick}>
            <div className="modal-content">
                <h2>Name</h2>
                <h3>Description</h3>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quidem itaque architecto reprehenderit eaque voluptates id
                    error asperiores eligendi ullam? Molestiae quae sunt nobis
                    suscipit beatae laborum! Ab adipisci soluta pariatur.
                </p>
                <h3>Inputs</h3>
                <p>awjhda wdhkak dkbw </p>
                <h3>Outputs</h3>
                <p>awkd wahb hwawbdk </p>
                <h3>References</h3>
                <p>adwwa jkawd jkaw bjk</p>
            </div>
        </dialog>
    );
}

export default Modal;
