const infura_project_id = "c96843f106b04427a8edd5b85cda4e68"
const kovan_endpoint = `https://kovan.infura.io/v3/${infura_project_id}`

console.log('kovan endpoint: ', kovan_endpoint)
export const ethNodeEndpoint = () => kovan_endpoint