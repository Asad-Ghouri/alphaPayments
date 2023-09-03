const express = require('express');
const app =express();
const doteenv =require('dotenv');
const cors = require('cors');

doteenv.config({path: './config.env'});
require('./DB/connection');
const port = 5000;

const corsOptions = {
    origin: 'https://payment-asad-ghouri.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, HTTP authentication) if needed
    optionsSuccessStatus: 204, // Respond to preflight requests with a 204 status code
  };
  
  app.use(cors(corsOptions)); // Use the CORS middleware with the specified options
  

app.use(express.json());
app.use(require('./Router/auth'));



app.listen(port,() =>{
    console.log(`Sever is running at localhost ${port}`);
    
})