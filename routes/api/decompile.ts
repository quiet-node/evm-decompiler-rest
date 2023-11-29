import express from 'express';
import { exec } from 'child_process';

const decompilerRouter = express.Router();

// @route: POST api/decompile
// @desc: attempts to decompile EVM bytecode into Soldiity smart contract
// @access: public
decompilerRouter.post('/', (req, res) => {
  const bytecode = req.body.bytecode;

  if (bytecode) {
    console.log('Decompiling...');
    const DECOMPILE_COMMAND = `heimdall decompile --include-sol -d ${bytecode} --output print`;
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

      // get decompiled contract from stdout
      if (stdout.includes('// SPDX-License-Identifier')) {
        console.log('Extracting source code...');
        const decompiled = stdout.substring(
          stdout.indexOf('// SPDX-License-Identifier')
        );

        console.log('Sending decompiled Solidity contract to client...\nDone.');
        return res.send({
          decompiled,
          error: null,
        });
      } else {
        // error returned by heimdall
        console.error(stdout);
        return res.status(400).json({
          error: stdout,
          decompiled: null,
        });
      }
    });
  }
});

export default decompilerRouter;
