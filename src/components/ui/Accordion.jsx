import { useState } from "react";
import "./Accordion.css";

function Accordion({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    function toggleAccordion() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="accordion-panel">
            <h4 className="accordion-title" onClick={toggleAccordion}>
                {title}
            </h4>
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
