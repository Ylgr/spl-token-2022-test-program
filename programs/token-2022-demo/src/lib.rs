use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_2022_demo {
    use super::*;

    pub fn create_token_pool(ctx: Context<CreateTokenPool>) -> Result<()> {

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTokenPool<'info> {
    #[account(
    init,
    payer=signer,
    space= 4 + 32
    )]
    pub token_pool: Account<'info, TokenPool>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>,
}

#[account]
pub struct TokenPool {
    index: u32,
    fee_collector_address: Pubkey,
}