import {
  createTransactionMessage,
  getSignatureFromTransaction,
  createSolanaRpc,
  devnet,
  airdropFactory,
  lamports,
  address,
  createSolanaRpcSubscriptions,
  setTransactionMessageFeePayerSigner,
  pipe,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  prependTransactionMessageInstructions,
  generateKeyPairSigner,
  // compileTransactionMessage,
  // compileTransaction,
  // getBase58Decoder,
} from "@solana/web3.js";
import { getTransferSolInstruction } from "@solana-program/system";
import { getSetComputeUnitLimitInstruction } from "@solana-program/compute-budget";
// import crypto from "node:crypto";

// For benchmarking
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function grindSignature(prefix: string) {
  const rpc = createSolanaRpc("http://127.0.0.1:8899");
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    devnet("ws://127.0.0.1:8900")
  );

  const signer = await generateKeyPairSigner();

  const airdrop = airdropFactory({ rpc, rpcSubscriptions });

  await airdrop({
    commitment: "confirmed",
    recipientAddress: signer.address,
    lamports: lamports(BigInt(10_000_000)),
  });

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (msg) => setTransactionMessageFeePayerSigner(signer, msg),
    (msg) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, msg),
    (msg) =>
      appendTransactionMessageInstructions(
        [
          getTransferSolInstruction({
            amount: lamports(BigInt(1_000_000)),
            destination: address("godeYaXfVFa32acSUa39BTfFYrr9TeBkzgDanYowdo8"),
            source: signer,
          }),
        ],
        msg
      )
  );

  let hash = "";
  let i = 0;

  console.log(`🚀 Grinding signature with prefix ${prefix}...`);
  const start = performance.now();
  while (!hash.startsWith(prefix)) {
    const withCompute = prependTransactionMessageInstructions(
      [
        getSetComputeUnitLimitInstruction({
          units: i,
        }),
      ],
      message
    );

    const signedTransaction = await signTransactionMessageWithSigners(
      withCompute
    );
    hash = getSignatureFromTransaction(signedTransaction);

    // Another way to do this, that runs slightly faster on avg:
    // #########################################################
    // const compiled = compileTransaction(withCompute);
    // const base58 = getBase58Decoder();
    // const signature = await crypto.subtle.sign(
    //   "Ed25519",
    //   signer.keyPair.privateKey,
    //   compiled.messageBytes
    // );
    // hash = base58.decode(new Uint8Array(signature));

    if (i !== 0 && i % 1_000 === 0) {
      console.log(`⏳ ${i} attempts...`);
    }
    i++;
  }
  const end = performance.now();

  console.log(`\n\n`);
  console.log(`✅ Transaction signature found after ${i} attempts: `, hash);
  console.log("⏰ Total Time Elapsed: ", end - start, "ms");
}

grindSignature("joe");
