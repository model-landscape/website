import { useState } from "react";
import "./Accordion.css";

function Accordion({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleAccordion() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="accordion-panel">
            <div className="accordion-title" onClick={toggleAccordion}>
                {title}
            </div>
            <div
                className={`accordion-content-container ${
                    isOpen ? "open" : ""
                }`}
            >
                <div className="accordion-content">{children}</div>
            </div>
        </div>
    );
}

export default Accordion;
