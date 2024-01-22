import { app } from "./app";

const port = process.env.API_PORT || 4555;

app.listen(port, () => {
   console.log(`Notifiy Service is listening at port ${port}`) 
});