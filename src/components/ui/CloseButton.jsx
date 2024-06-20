import "./CloseButton.css";

function CloseButton({ onClose }) {
    return <a className="close" onClick={onClose}></a>;
}

export default CloseButton;
