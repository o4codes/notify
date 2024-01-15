import { app } from "./app";

const port = process.env.port || 3000;

app.listen(port, () => {
   console.log(`Notifiy Service is listening at port ${port}`) 
});