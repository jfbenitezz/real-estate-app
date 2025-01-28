const connectDB = require('./config/conDB');
const {app} = require('./app');
const port = process.env.PORT


const init = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)})
  }
  
  
  init();