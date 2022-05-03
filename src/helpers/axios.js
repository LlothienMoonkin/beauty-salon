import axios from 'axios';
//import * as https from "https";

const SERVER = 'https://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api';

let util = axios.create({
    //baseURL: SERVER,
    timeout: 60000,
    /*httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })*/
});

/*util.interceptors.response.use(response => {
    return response;
});*/

export default util;