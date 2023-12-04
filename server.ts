import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import decompilerRouter from './routes/api/decompile';
import {
  checkValidHashKey,
  sanitizeBytecodeMiddlware,
} from './middleware/sanitize-body';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(checkValidHashKey);
app.use(sanitizeBytecodeMiddlware);
app.use('/api/decompile', decompilerRouter);

const PORT = process.env.PORT || 7639;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
