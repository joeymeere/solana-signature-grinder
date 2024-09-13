# Solana Signature Grinder

A script that utilizes Web3.js 2.0 to grind vanity transaction signatures. Inspired by the MEV guy on Ethereum.

## Usage

```bash
npm install
```

Go to `src/index.ts` and change the `prefix` variable set at the bottom to your desired vanity prefix. Then run `npm test` to start the script.

## License

MIT

## Disclaimer

This is a proof of concept and probably should not be used in production. While this doesn't send any transactions or take any external keypairs, I will give the obligatory: Run this on your own risk.
