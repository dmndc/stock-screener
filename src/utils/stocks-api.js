
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';


export function getStocksFromDb() {
  const url = `${BASE_URL}/api/stocks/`;
  return axios.get(url).then(res => res.data);
}

