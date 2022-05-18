const express = require('express');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());


port = process.env.PORT || 8080;
app.listen(port, () => { console.log('server started!')});