function fetcher(...args) {
  return fetch(...args).then((response) => response.json());
}

export default fetcher;
