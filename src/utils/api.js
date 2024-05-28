export async function getGephi() {
    const res = await fetch("./gephi.json");
    const data = await res.json();
    return data;
}
