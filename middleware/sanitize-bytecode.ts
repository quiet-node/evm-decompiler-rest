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
    ? bytecode
    : null;

  if (properBytecode) {
    console.log('Finished sanitizing. Bytecode is valid!');
    next();
  } else {
    console.log('Finished sanitizing. Bytecode is invalid!');
    res.status(400).json({ error: 'Invalid bytecode', decompiled: null });
  }
};
