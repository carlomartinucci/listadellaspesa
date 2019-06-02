const { protocol, hostname } = document.location;
const uri = `${protocol}//${hostname}:3000/`;

const endpoint = path => `${uri}${path}`;

export default endpoint;
