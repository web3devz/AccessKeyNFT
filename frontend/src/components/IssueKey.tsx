import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, txUrl } from '../config/network'
const enc = (s: string) => Array.from(new TextEncoder().encode(s))
interface Props { onSuccess?: () => void }
export default function IssueKey({ onSuccess }: Props) {
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [resource, setResource] = useState('')
  const [tier, setTier] = useState('Standard')
  const [validUntil, setValidUntil] = useState('')
  const [recipient, setRecipient] = useState('')
  const [txDigest, setTxDigest] = useState('')
  const [error, setError] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!account || !resource || !recipient) return
    setError(''); setTxDigest('')
    const tx = new Transaction()
    tx.moveCall({
      target: `${PACKAGE_ID}::access_key::issue`,
      arguments: [tx.pure.vector('u8', enc(resource)), tx.pure.vector('u8', enc(tier)), tx.pure.u64(BigInt(validUntil || '999999')), tx.pure.address(recipient)],
    })
    signAndExecute({ transaction: tx }, {
      onSuccess: (r) => { setTxDigest(r.digest); setResource(''); setTier('Standard'); setValidUntil(''); setRecipient(''); onSuccess?.() },
      onError: (e) => setError(e.message),
    })
  }
  return (
    <div className="card">
      <div className="card-header"><h2>Issue Access Key</h2><p className="card-desc">Mint an NFT key granting access to a resource.</p></div>
      <form onSubmit={submit} className="form">
        <div className="form-row">
          <label>Resource / Community *<input value={resource} onChange={e => setResource(e.target.value)} placeholder="e.g. Premium Discord, API Access" required /></label>
          <label>Tier<select value={tier} onChange={e => setTier(e.target.value)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '.75rem 1rem', color: 'var(--text)', fontSize: '.95rem', fontFamily: 'inherit' }}>
            <option>Standard</option><option>Premium</option><option>VIP</option><option>Admin</option>
          </select></label>
        </div>
        <div className="form-row">
          <label>Valid Until Epoch<input type="number" value={validUntil} onChange={e => setValidUntil(e.target.value)} placeholder="999999 (no expiry)" /></label>
          <label>Recipient Address *<input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="0x..." required /></label>
        </div>
        {error && <p className="error">⚠ {error}</p>}
        <button type="submit" className="btn-primary" disabled={isPending}>{isPending ? 'Issuing...' : '🔑 Issue Key'}</button>
      </form>
      {txDigest && <div className="tx-success"><span>✅ Key issued</span><a href={txUrl(txDigest)} target="_blank" rel="noreferrer">View tx ↗</a></div>}
    </div>
  )
}
