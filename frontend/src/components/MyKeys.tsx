import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { PACKAGE_ID } from '../config/network'
interface KeyFields { resource: string; tier: string; issuer: string; holder: string; valid_until_epoch: string; active: boolean }
export default function MyKeys() {
  const account = useCurrentAccount()
  const { data, isPending, error } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address ?? '',
    filter: { StructType: `${PACKAGE_ID}::access_key::AccessKey` },
    options: { showContent: true },
  })
  if (isPending) return <div className="status-box">Loading your keys...</div>
  if (error) return <div className="status-box">Error: {error.message}</div>
  const keys = data?.data ?? []
  if (keys.length === 0) return <div className="empty-state"><div className="empty-icon">🔑</div><h3>No keys yet</h3><p>You don't hold any access keys.</p></div>
  return (
    <div>
      <div className="card"><div className="card-header"><h2>My Access Keys</h2><p className="card-desc">{keys.length} key{keys.length !== 1 ? 's' : ''} in your wallet</p></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
        {keys.map(obj => {
          const content = obj.data?.content
          if (content?.dataType !== 'moveObject') return null
          const f = content.fields as unknown as KeyFields
          const objId = obj.data?.objectId ?? ''
          return (
            <div key={objId} style={{ background: 'var(--surface2)', border: `1px solid ${f.active ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: f.active ? 'linear-gradient(90deg,var(--accent),transparent)' : 'var(--border)' }} />
              <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🔑</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.3rem' }}>{f.resource}</div>
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '.72rem', background: 'rgba(16,185,129,.1)', color: 'var(--accent)', border: '1px solid rgba(16,185,129,.25)', borderRadius: '999px', padding: '.15rem .6rem', fontWeight: 700 }}>{f.tier}</span>
                <span style={{ fontSize: '.72rem', background: f.active ? 'rgba(74,222,128,.1)' : 'rgba(248,113,113,.1)', color: f.active ? '#4ade80' : '#f87171', border: `1px solid ${f.active ? 'rgba(74,222,128,.25)' : 'rgba(248,113,113,.25)'}`, borderRadius: '999px', padding: '.15rem .6rem', fontWeight: 700 }}>{f.active ? '● Active' : '✕ Revoked'}</span>
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Issued by {f.issuer.slice(0,8)}...</div>
              <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Valid until epoch {f.valid_until_epoch}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
