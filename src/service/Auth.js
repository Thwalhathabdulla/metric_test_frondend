import {BASE_URL} from '../config/Config';
// const key = localStorage.getItem('key');
export default class AuthService{
    //get the downline members
    async Login(data){
        const response = await fetch(`${BASE_URL}/login`, {     //url
            method: 'POST',                 //method
            headers : {                     //passing header 
                'Accept'        : 'application/json',
                'Content-Type'  : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const legStatus = await response.json();
        return legStatus;
    }
    async register(data){
        const response = await fetch(`${BASE_URL}/register`, {     //url
            method: 'POST',                 //method
            headers : {                     //passing header 
                'Accept'        : 'application/json',
                'Content-Type'  : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const legStatus = await response.json();
        return legStatus;
    }
    async checkTocken(){
        // console.log(localStorage.getItem('key'));
        const response = await fetch(`${BASE_URL}/checkToken`, {     //url
            method: 'GET',                 //method
            headers : {                     //passing header 
                'Accept'        : 'application/json',
                'Content-Type'  : 'application/json',
                'access_token'  : localStorage.getItem('key')
            }
        })
        const legStatus = await response.json();
        return legStatus;
    }
}