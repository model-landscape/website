import "./App.css";
import NetworkGraph from "./components/networkGraph/NetworkGraph";
import Accordion from "./components/ui/Accordion";

function App() {
    return (
        <>
            <NetworkGraph />
            <div className="accordion-container">
                <Accordion title="Description">
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Reiciendis incidunt autem exercitationem impedit
                        magnam obcaecati? Laudantium odio tenetur in? Libero,
                        placeat! Soluta, pariatur molestias. Placeat enim quidem
                        obcaecati dicta quibusdam?
                    </p>
                </Accordion>

                <Accordion title="References">
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Reiciendis incidunt autem exercitationem impedit
                        magnam obcaecati? Laudantium odio tenetur in? Libero,
                        placeat! Soluta, pariatur molestias. Placeat enim quidem
                        obcaecati dicta quibusdam? Lorem, ipsum dolor sit amet
                        consectetur adipisicing elit. Ea iusto aperiam voluptate
                        totam minima necessitatibus, quia voluptatum excepturi a
                        quasi ullam praesentium sequi odit. Quibusdam numquam
                        possimus minima quasi repudiandae.
                    </p>
                </Accordion>

                <Accordion title="Contact">
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Reiciendis incidunt autem exercitationem impedit
                        magnam obcaecati? Laudantium odio tenetur in? Libero,
                        placeat! Soluta, pariatur molestias. Placeat enim quidem
                        obcaecati dicta quibusdam?
                    </p>
                </Accordion>

                <Accordion title="Legals">
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Reiciendis incidunt autem exercitationem impedit
                        magnam obcaecati? Laudantium odio tenetur in? Libero,
                        placeat! Soluta, pariatur molestias. Placeat enim quidem
                        obcaecati dicta quibusdam?
                    </p>
                </Accordion>
            </div>
        </>
    );
}

export default App;
