import algosdk from 'algosdk';

const token = "ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1";
const server = "http://hackathon.algodev.network";
const port = 9100;

// algod client
const AlgorandClient = new algosdk.Algod(token, server, port);
export default AlgorandClient;