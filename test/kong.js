const request = require('supertest');
const api = request("http://localhost:8000");
const items_sub_path = "/items"
const basic_auth = "Basic dXNlcjoxMTExMTEx"; // user:1111111

const item = {
    name: "Apple MacBook Pro 16",
    data: {
        year: 2019,
        price: 1849.99,
        "CPU model": "Intel Core i9",
        "Hard disk size": "1 TB"
    }
};

const updated_item = {
    ...item,
    data: { ...item.data, price: 2000 }
};


module.exports = {
    api,
    items_sub_path,
    basic_auth,
    item,
    updated_item
};