const {app} = require('./app');
const express=require("express");
const port = 3000;

const http= require('http');


const server = http.createServer(app);

server.listen(3000, ()=>
{
    console.log("server running...");
 });

