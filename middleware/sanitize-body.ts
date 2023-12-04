import fs from 'fs';

export const sanitizeBytecodeMiddlware = (req: any, res: any, next: any) => {
  console.log('Sanitizing bytecode...');
  const bytecode = req.body.bytecode;

  if (!bytecode) {
    console.log('No bytecode found');
    return res
      .status(400)
      .json({ error: 'No bytecode found', decompiled: null });
  }

  // Perform bytecode validation and sanitization here
  const ESCAPE_CHARS = /[;`&$!|*?<>^()#"'\\\[\]\{\}]/g;
  const sanitizedBytecode = bytecode.replace(ESCAPE_CHARS, '');

  // Perfrom a sanity check if the bytecode has the correct form or not
  const BYTECODE_REGEX = /^(0x)?([0-9a-fA-F]{2})+$/;
  const properBytecode = BYTECODE_REGEX.test(sanitizedBytecode)
    ? sanitizedBytecode
    : null;

  if (properBytecode) {
    console.log('Finished sanitizing. Bytecode is valid!');
    next();
  } else {
    console.log('Finished sanitizing. Bytecode is invalid!');
    return res
      .status(400)
      .json({ error: 'Invalid bytecode', decompiled: null });
  }
};

export const checkValidHashKey = (req: any, res: any, next: any) => {
  console.log('Checking unique hash key...');
  const hashKey = req.body.hashkey;

  if (!hashKey) {
    console.log('No hash key found');
    return res
      .status(400)
      .json({ error: 'No hash key found', decompiled: null });
  }

  // Perform hash key validation and sanitization here
  const ESCAPE_CHARS = /[;`&$!|*?<>^()#"'\\\[\]\{\}]/g;
  const sanitizedHashkey = hashKey.replace(ESCAPE_CHARS, '');

  // Perfrom a sanity check if the hashkey has the correct form or not
  const HASHKEY_REGEX = /^[0-9a-fA-F]{8}$/;
  const properHashKey = HASHKEY_REGEX.test(sanitizedHashkey)
    ? sanitizedHashkey
    : null;
  if (properHashKey) {
    console.log('Finished sanitizing. Hash key is valid!');
  } else {
    console.log('Finished sanitizing. Hash key is invalid!');
    return res
      .status(400)
      .json({ error: 'Invalid hash key', decompiled: null });
  }

  // Perform a check to see if a request with the unique hash key is still in process => abort the request
  if (fs.existsSync(`./${properHashKey}`)) {
    return res.status(400).json({
      error:
        'A request with this hashkey is processing. Please try again in a little later!',
      decompiled: null,
    });
  } else {
    next();
  }
};
