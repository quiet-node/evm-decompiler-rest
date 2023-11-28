import express from 'express';
import bodyParser from 'body-parser';
import decompilerRouter from './routes/api/decompile';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 7639;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
