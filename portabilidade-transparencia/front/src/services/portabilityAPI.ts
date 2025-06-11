import axios, { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';

const PortabilityAPI = axios.create({
  baseURL: 'http://localhost:8000',
});

PortabilityAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface UserInfo{
        sub: string,
        name: string
        email: string
        cpf: string
        phone: string
}

async function getUserInfo(token: string): Promise<UserInfo>{
    try{
        const { data } = await axios.get(`http://localhost:8000/integration/info/${token}`)
        return data as UserInfo
    }catch(e){
        if(e instanceof AxiosError && e.status === 401){
            localStorage.removeItem('token');
            redirect('/')
        }
        throw e
    }
}

async function getPortabilityToken(token: string){
    try{
        const { data } = await axios.post('http://localhost:8000/integration', {name: 'Sistema I'}, {headers: {Authorization: `Bearer ${token}`}})
        return data.token
    }catch(e){
        console.error(e)
        throw e
    }
}

export {PortabilityAPI, getUserInfo, getPortabilityToken}