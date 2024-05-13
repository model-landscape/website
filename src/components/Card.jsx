import { useState } from "react";
import "./Card.css";

function Card({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleChange() {
        setIsOpen(!isOpen);
    }
    return (
        <div className="collapsible">
            <input
                type="checkbox"
                id="collapsible-head"
                checked={isOpen}
                onChange={handleChange}
            />
            <label htmlFor="collapsible-head">{title}</label>
            <div className="collapsible-text">
                <p>{children}</p>
            </div>
        </div>
    );
}

export default Card;
