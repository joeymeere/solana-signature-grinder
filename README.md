# Solana Signature Grinder

A simple Node & TS script that utilizes Web3.js 2.0 to grind vanity transaction signatures. Inspired by the 0xbeef MEV guy on Ethereum.

## Usage

Install dependencies:

```bash
npm install
```

Run a Solana test validator:

```bash
solana-test-validator
```

Go to `src/index.ts` and change the `prefix` variable set at the bottom to your desired vanity prefix. Then run `npm test` to start the script.

## License

MIT

## Disclaimer

This is a proof of concept and probably should not be used in production. While this doesn't send any transactions or take any external keypairs, I will give the obligatory: Run this on your own risk.
