import CloseButton from "./CloseButton";
import "./Modal.css";
import NestedList from "./NestedList";

function Modal({ node, nodeInfo, onClose }) {
    return (
        <>
            <div className="modal-backdrop"></div>
            <div className="modal">
                <div className="modal-content">
                    <h3 className="modal-heading">{node.label}</h3>
                    <CloseButton onClose={onClose} />
                    {/*
                    <div className="modal-description">
                    <h4>Description</h4>
                    <p>{node.attributes.Description}</p>
                    </div>
                    */}
                    <div className="modal-inputs">
                        <h4>Inputs</h4>
                        <NestedList data={nodeInfo.inputs} />
                    </div>
                    <div className="modal-outputs">
                        <h4>Outputs</h4>
                        <NestedList data={nodeInfo.outputs} />
                    </div>
                    <div className="modal-references">
                        <h4>References</h4>
                        <p>{nodeInfo.references.join("; ")}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;
