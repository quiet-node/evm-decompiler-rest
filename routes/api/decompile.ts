import fs from 'fs';
import express from 'express';
import { exec } from 'child_process';

const decompilerRouter = express.Router();

// @route: POST api/decompile
// @desc: attempts to decompile EVM bytecode into Soldiity smart contract
// @access: public
decompilerRouter.post('/', (req, res) => {
  const hashkey = req.body.hashkey;
  const bytecode = req.body.bytecode;

  if (bytecode) {
    console.log('Decompiling...');
    const HEIMDALL_RS_CMD =
      process.env.NODE_ENV === 'production'
        ? `./heimdall-rs/heimdall`
        : `heimdall`;

    const DECOMPILE_COMMAND = `${HEIMDALL_RS_CMD} decompile --include-sol -d ${bytecode} --output ${hashkey}`;
    exec(DECOMPILE_COMMAND, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}\nDone.`);
        return res.status(500).send({
          erorr: `Error: ${error.message}`,
          decompiled: null,
        });
      }
      if (stderr) {
        console.error(`stderr: ${stderr}\nDone.`);
        return res.status(500).send({
          error: `stderr: ${stderr}`,
          decompiled: null,
        });
      }

      const DECOMPILED_OUTPUT_DIR = `./${hashkey}`;

      // error returned by heimdall
      if (stdout.includes('error')) {
        if (fs.existsSync(DECOMPILED_OUTPUT_DIR)) {
          // delete the output dir
          console.log('Deleting decompiled contract output dir...');
          exec(`rm -rf ${DECOMPILED_OUTPUT_DIR}`);
        }
        console.error(stdout + `\nDone.`);
        return res.status(400).json({
          error: stdout,
          decompiled: null,
        });
      } else {
        try {
          if (fs.existsSync(DECOMPILED_OUTPUT_DIR)) {
            // retrieve decompiled
            console.log(
              'Retrieving solidity decompiled contract generated by Heimdall...'
            );
            const decompiled = fs
              .readFileSync(`${DECOMPILED_OUTPUT_DIR}/decompiled.sol`)
              .toLocaleString();

            // delete the output dir
            console.log('Deleting decompiled contract output dir...');
            exec(`rm -rf ${DECOMPILED_OUTPUT_DIR}`);

            // send decompiled contract to client
            console.log('Returning decompiled contract to client...\nDone.');
            return res.send({
              decompiled,
              error: null,
            });
          } else {
            console.error('Decompiled contract is not found');
            throw new Error('Decompiled contract is not found');
          }
        } catch (error) {
          console.error(error);
          console.log('Done.');
          return res.status(500).send({
            error: `Heimdall-rs did not exported data after decompilation.\nDone.`,
          });
        }
      }
    });
  }
});

export default decompilerRouter;
