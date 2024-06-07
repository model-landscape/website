import "./App.css";
import NetworkGraph from "./components/NetworkGraph";
import Accordion from "./components/ui/Accordion";

function App() {
    return (
        <>
            <NetworkGraph />
            <div className="accordion-container">
                <Accordion title="Description">
                    <p>
                        This map represents the landscape of product models in
                        embodiment design, a visualization of the product models
                        currently used in embodiment design and the links
                        between them. Each gray node represents a product model,
                        each green node represents an input or output that
                        appeared multiple times and was therefore considered a
                        category, and each edge represents an identified link.
                        The map was created using the Gephi network
                        visualization software, and the layout was calculated
                        using the force-directed Yifan Hu layout algorithm. The
                        data of the map and its associated information are based
                        on the systematic literature review by Paehler, L., &
                        Matthiesen, S. (2024). Mapping the landscape of product
                        models in embodiment design. Research in Engineering
                        Design.{" "}
                        <a
                            href="https://doi.org/10.1007/s00163-024-00433-x"
                            target="_blank"
                        >
                            https://doi.org/10.1007/s00163-024-00433-x
                        </a>
                        . For more information on the map, its literature, or
                        other aspects of its background, please refer to this
                        publication.
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
                        Suggestions, improvements, and ideas for expanding the
                        product model landscape are always welcome. Please
                        contact us at:
                    </p>
                    <a href="mailto:model-landscape@ipek.kit.edu">
                        model-landscape@ipek.kit.edu
                    </a>
                </Accordion>

                <Accordion title="Legals">
                    <a
                        href="https://www.ipek.kit.edu/english/impressum.php"
                        target="_blank"
                    >
                        Go to Legals
                    </a>
                </Accordion>
            </div>
        </>
    );
}

export default App;
