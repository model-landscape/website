import { useEffect, useState } from "react";
import "./App.css";
import Graph from "./components/Graph";
import Card from "./components/Card";

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("gephi.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setData(data);
            });
    }, []);

    return (
        <div>
            {data ? (
                <Graph nodes={data.nodes} edges={data.edges} />
            ) : (
                <div>Loading...</div>
            )}
            <div className="card-container">
                <Card title="Description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dignissimos porro aperiam molestias nobis in exercitationem
                    consequatur illum est. Nobis, dolor velit! Voluptas, sint!
                    Exercitationem blanditiis alias fuga. Est, mollitia maiores.
                </Card>
                <Card title="References">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Corrupti dolore sapiente unde repellat officiis quidem,
                    laudantium quibusdam, rerum eveniet cum ducimus perferendis
                    animi harum praesentium nihil minus dolorum et repellendus?
                </Card>
                <Card title="Contact">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Dolor, sint fugiat doloremque enim nemo eos. Neque,
                    doloribus tenetur. Qui vel necessitatibus magni officiis ad
                    iusto, molestias quos modi eos veritatis!
                </Card>
                <Card title="Legals">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Asperiores ipsum ipsam hic et doloremque maiores dolorum,
                    delectus facere harum recusandae sunt explicabo fugiat esse
                    quos id. Beatae magnam dolor mollitia.
                </Card>
            </div>
        </div>
    );
}

export default App;
