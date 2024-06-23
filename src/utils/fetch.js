import yaml from "js-yaml";

export async function fetchGephi() {
    const gephiResponse = await fetch("gephi.json");
    const gephi = await gephiResponse.json();
    return gephi;
}

export async function fetchGephiIO() {
    const gephiIOResponse = await fetch("gephiIO.yaml");
    const gephiIOString = await gephiIOResponse.text();
    const gephiIO = yaml.load(gephiIOString);
    return gephiIO;
}

export async function fetchGeneralInfo() {
    const generalInfoResponse = await fetch("generalInfo.json");
    const generalInfo = await generalInfoResponse.json();
    return generalInfo;
}
