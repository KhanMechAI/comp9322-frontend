const axios = require('axios').default;

const witAPI = axios.create({
    method: 'get',
    baseURL: 'https://api.wit.ai/message',
});

export {witAPI};