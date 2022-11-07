import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {Token2022Demo} from "../target/types/token_2022_demo";
import {SystemProgram} from "@solana/web3.js";
import {assert} from "chai";
import {
    ExtensionType,
    createInitializeMintInstruction,
    mintTo,
    createAccount,
    getMintLen,
    TOKEN_2022_PROGRAM_ID, createInitializeTransferFeeConfigInstruction,
} from '@solana/spl-token';

describe("token-2022-demo", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(provider);
    const program = anchor.workspace.Token2022Demo as Program<Token2022Demo>;

    let pool;
    let feeCollector;
    let token1;
    let feeConfig;
    let withdrawWithheldAuthority;
    let mint;
    let mintAuthority;

    const extensions = [ExtensionType.TransferFeeConfig];

    const mintLen = getMintLen(extensions);
    const decimals = 9;
    const feeBasisPoints = 50;
    const maxFee = BigInt(5_000);

    it("Is initialized!", async () => {
        feeCollector = anchor.web3.Keypair.generate();
        pool = anchor.web3.Keypair.generate();
        const tx = await program.rpc.createTokenPool(
            {
                accounts: {
                    tokenPool: pool.publicKey,
                    signer: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId
                },
                signers: [pool],
            }
        );
        const tokenPoolInfo = await program.account.tokenPool.fetch(pool.publicKey);
        assert.equal(tokenPoolInfo.feeCollectorAddress.toString(), provider.wallet.publicKey.toString())
    });

    it("create a token fee", async () => {
        mint = anchor.web3.Keypair.generate();

        mintAuthority = anchor.web3.Keypair.generate();
        const mintLamports = await provider.connection.getMinimumBalanceForRentExemption(mintLen);
        SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: mint,
            space: mintLen,
            lamports: mintLamports,
            programId: TOKEN_2022_PROGRAM_ID,
        })
        feeConfig = anchor.web3.Keypair.generate();
        withdrawWithheldAuthority = anchor.web3.Keypair.generate();
        createInitializeTransferFeeConfigInstruction(
            mint.publicKey,
            feeConfig.publicKey,
            withdrawWithheldAuthority.publicKey,
            feeBasisPoints,
            maxFee,
            TOKEN_2022_PROGRAM_ID
        )
        createInitializeMintInstruction(mint, decimals, mintAuthority.publicKey, null, TOKEN_2022_PROGRAM_ID)
    })
});
