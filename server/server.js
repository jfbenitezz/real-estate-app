const express = require("express")
const connectDB = require('./config/conDB');
const {app} = require('./index');
const port = process.env.PORT || '5000'


const init = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)})
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running at http://0.0.0.0:${port}`);
    });
    
  }
  
  
  init();