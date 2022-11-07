use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_2022_demo {
    use super::*;

    pub fn create_token_pool(ctx: Context<CreateTokenPool>) -> Result<()> {
        let token_pool = &mut ctx.accounts.token_pool;
        token_pool.index = 0;
        token_pool.fee_collector_address = *ctx.accounts.signer.to_account_info().key;
        Ok(())
    }

    pub fn registry_token(ctx: Context<RegistryToken>) -> Result<()> {
        let token_pool = &mut ctx.accounts.token_pool;
        token_pool.index += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTokenPool<'info> {
    #[account(
    init,
    payer=signer,
    space= 8 + 4 + 32
    )]
    pub token_pool: Account<'info, TokenPool>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>,
}

#[derive(Accounts)]
pub struct RegistryToken<'info> {
    #[account(mut)]
    pub token_pool: Account<'info, TokenPool>,
    #[account(mut)]
    pub token_key: Account<'info, TokenAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info,System>,
}

#[account]
pub struct TokenPool {
    index: u32,
    fee_collector_address: Pubkey,
}