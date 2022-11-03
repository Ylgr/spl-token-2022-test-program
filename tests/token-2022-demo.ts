import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Token2022Demo } from "../target/types/token_2022_demo";

describe("token-2022-demo", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Token2022Demo as Program<Token2022Demo>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
