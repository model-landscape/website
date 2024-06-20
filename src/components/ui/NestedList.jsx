import "./NestedList.css";

function NestedList({ data }) {
    if (Array.isArray(data)) {
        return (
            <ul>
                {data.map((item, index) => (
                    <NestedList key={index} data={item} />
                ))}
            </ul>
        );
    }
    if (typeof data === "object" && data !== null) {
        return (
            <>
                {Object.keys(data).map((key, index) => (
                    <li key={index}>
                        {key}
                        <NestedList data={data[key]} />
                    </li>
                ))}
            </>
        );
    } else {
        return <li>{data}</li>;
    }
}

export default NestedList;
