# evm-decompiler-rest (WIP)
REST service to decompile EVM bytecode into Solidity contract

## Get started

### A. Git & NPM
1. Clone the repo & install the project

```bash
git clone https://github.com/quiet-node/evm-decompiler-rest.git
cd evm-decompiler-rest
npm install
```

2. Run the server

```bash
npm run dev
```

### B. Docker 
```bash
docker pull logann131/evm-decompiler-rest:0.1.0
docker run -d -p 7639:7639 logann131/evm-decompiler-rest:0.1.0
```


## Basic Example Usage

```bash
curl --location 'localhost:7639/api/decompile' \
--header 'Content-Type: application/json' \
--data '{
    "bytecode": "608060405234801561000f575f80fd5b5060043610610034575f3560e01c80636b06623714610038578063e69f19cd14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea26469706673582212203730408c8004d51639b6ff1e841d6944bb83c335c0fe79a602ee0066681b007664736f6c63430008150033",
    "keyhash": "6612bd461092b9f52d"
}'
```

## Attribution
This decompiler uses the [heimdall-rs](https://github.com/Jon-Becker/heimdall-rs), an EVM bytecode tool, created and mainted by [@beckerrjon](https://twitter.com/beckerrjon)
