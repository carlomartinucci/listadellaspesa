let uri
if (process.env.NODE_ENV === 'development') {
  const { protocol, hostname } = document.location;
  uri = `${protocol}//${hostname}:3000/`;
} else {
  uri = `https://api-listadellaspesa.herokuapp.com/`
}

const endpoint = path => `${uri}${path}`;

export default endpoint;
