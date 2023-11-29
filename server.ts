import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import decompilerRouter from './routes/api/decompile';
import { sanitizeBytecodeMiddlware } from './middleware/sanitize-bytecode';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/decompile', sanitizeBytecodeMiddlware, decompilerRouter);

const PORT = process.env.PORT || 7639;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
