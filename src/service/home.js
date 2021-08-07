import {BASE_URL} from '../config/Config';
export default class HomeService{

    async upload(data){
    const key = localStorage.getItem('key');
    const response = await fetch(`${BASE_URL}/uploadDoc`, {     //url
            method: 'POST',                 //method
            headers : {                     //passing header 
                'Accept'        : 'application/json',
                // 'Content-Type'  : 'application/json',
                'access_token'  : key
            },
            body : data
        })
        const legStatus = await response.json();
        return legStatus;
    }
    async getDocs(){
        const key = localStorage.getItem('key');
        const response = await fetch(`${BASE_URL}/getDocs`, {     //url
            method: 'GET',                 //method
            headers : {                     //passing header 
                'Accept'        : 'application/json',
                // 'Content-Type'  : 'application/json',
                'access_token'  : key
            }
        })
        const legStatus = await response.json();
        return legStatus;
    }
    async downLoad(id){
        const key = localStorage.getItem('key');
        const response = await fetch(`${BASE_URL}/download/${id}`, {     //url
            method: 'GET',                 //method
            headers : {                     //passing header 
                // 'Accept'        : 'application/json',
                // 'Content-Type'  : 'application/json',
                'access_token'  : key
            }
        })
        // const legStatus = await response.json();
        return response;
    }
}
