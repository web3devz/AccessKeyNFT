# AccessKeyNFT 🔑

NFT-based access control on OneChain. Issue NFT keys that grant access to gated resources, communities, and services. No passwords — just wallet ownership.

## Deployed Contract

- **Package:** [`0xf0d0fc4da863b7da57cc9ef9d9525e6fcdb51934f1d18df9901d179e5268163c`](https://onescan.cc/testnet/packageDetail?packageId=0xf0d0fc4da863b7da57cc9ef9d9525e6fcdb51934f1d18df9901d179e5268163c)
- **Network:** OneChain Testnet

## Features
- Issue NFT access keys with resource name, tier (Standard/Premium/VIP/Admin), and validity epoch
- View all keys in connected wallet with active/revoked status
- Issuers can revoke keys on-chain

## Contract API
```move
public fun issue(resource: vector<u8>, tier: vector<u8>, valid_until_epoch: u64, recipient: address, ctx: &mut TxContext)
public fun revoke(key: &mut AccessKey, ctx: &mut TxContext)
public fun burn(key: AccessKey, ctx: &TxContext)
```

## Setup
```bash
cd frontend && npm install && npm run dev
```
`frontend/.env`: `VITE_PACKAGE_ID=<package_id>`

## License
MIT
