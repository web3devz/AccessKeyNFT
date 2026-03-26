# AccessKeyNFT 🔑

NFT-based access control on OneChain. Issue NFT keys that grant access to gated resources, communities, and services. No passwords — just wallet ownership.

## Deployed Contract

- **Package:** [`0xf0d0fc4da863b7da57cc9ef9d9525e6fcdb51934f1d18df9901d179e5268163c`](https://onescan.cc/testnet/packageDetail?packageId=0xf0d0fc4da863b7da57cc9ef9d9525e6fcdb51934f1d18df9901d179e5268163c)
- **Network:** OneChain Testnet

## Features
- Issue NFT access keys with resource name, tier (Standard/Premium/VIP/Admin), and validity epoch
- View all keys in connected wallet with active/revoked status
- Issuers can revoke keys on-chain
- Dashboard tabs for My Keys, Issue Key, and AI Assistant
- AI Assistant supports access policy drafting, tier matrix suggestions, and security checklist generation
- Modern slate/orange UI theme optimized for desktop and mobile

## Contract API
```move
public fun issue(resource: vector<u8>, tier: vector<u8>, valid_until_epoch: u64, recipient: address, ctx: &mut TxContext)
public fun revoke(key: &mut AccessKey, ctx: &mut TxContext)
public fun burn(key: AccessKey, ctx: &TxContext)
```

## Setup
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open http://localhost:5173 in your browser.

### Environment Variables

Create `frontend/.env` with:

```dotenv
VITE_PACKAGE_ID=0xf0d0fc4da863b7da57cc9ef9d9525e6fcdb51934f1d18df9901d179e5268163c
VITE_OPENAI_KEY=<your_openai_api_key>
```

Notes:
- `VITE_PACKAGE_ID` points to the deployed contract package.
- `VITE_OPENAI_KEY` is used by the dashboard AI Assistant.
- For production, avoid exposing API keys in client-side env vars and route AI calls through a backend service.

## Dashboard AI Assistant

After wallet connection, open the `AI Assistant` tab in the dashboard and provide:
- Resource context
- Tier (Standard/Premium/VIP/Admin)
- Validity/epoch notes
- Optional custom intent

Then choose one action:
- Generate Access Policy
- Suggest Tier Matrix
- Security Checklist

The assistant returns plain-text operational guidance aligned with AccessKeyNFT workflows.

## Build

```bash
cd frontend
npm run build
```

## License
MIT
