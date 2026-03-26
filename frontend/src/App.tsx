import { useState } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import MyKeys from './components/MyKeys'
import IssueKey from './components/IssueKey'
import AIAssistant from './components/AIAssistant'
import './App.css'
type Tab = 'keys' | 'issue' | 'assistant'
export default function App() {
  const account = useCurrentAccount()
  const [tab, setTab] = useState<Tab>('keys')
  return (
    <div className="app">
      <header className="header">
        <div className="header-brand"><span className="logo">🔑</span><div><div className="brand-name">AccessKeyNFT</div><div className="brand-sub">Token-Gated Access</div></div></div>
        <ConnectButton />
      </header>
      {!account ? (
        <>
          <section className="hero">
            <div className="hero-badge">Ownership-Based Access</div>
            <h1>Your Key,<br />Your Access</h1>
            <p className="hero-sub">NFT keys that unlock gated content, communities, and services. No passwords. No subscriptions. Just wallet ownership.</p>
            <div className="hero-features">
              <div className="feature"><span>🔑</span><span>NFT Keys</span></div>
              <div className="feature"><span>🚪</span><span>Token-Gated</span></div>
              <div className="feature"><span>✅</span><span>Verifiable</span></div>
              <div className="feature"><span>🌐</span><span>Portable</span></div>
            </div>
          </section>
          <div className="stats-bar">
            <div className="stat-item"><div className="stat-value">∞</div><div className="stat-label">Resources</div></div>
            <div className="stat-item"><div className="stat-value">0</div><div className="stat-label">Passwords</div></div>
            <div className="stat-item"><div className="stat-value">100%</div><div className="stat-label">On-Chain</div></div>
            <div className="stat-item"><div className="stat-value">&lt;1s</div><div className="stat-label">Verify</div></div>
          </div>
          <section className="how-section">
            <div className="section-title">How AccessKeyNFT Works</div>
            <p className="section-sub">Three steps to token-gated access</p>
            <div className="steps-grid">
              <div className="step-card"><div className="step-num">01</div><div className="step-icon">🎨</div><h3>Issue Key</h3><p>Issuer mints an NFT access key specifying the resource, tier, and validity period.</p></div>
              <div className="step-card"><div className="step-num">02</div><div className="step-icon">💼</div><h3>Hold in Wallet</h3><p>Recipient holds the NFT key in their wallet — it's their verifiable access credential.</p></div>
              <div className="step-card"><div className="step-num">03</div><div className="step-icon">🚪</div><h3>Access Granted</h3><p>Any service can verify key ownership on-chain. No centralized auth required.</p></div>
            </div>
          </section>
        </>
      ) : (
        <div className="dashboard">
          <div className="dashboard-inner">
            <nav className="tabs">
              {(['keys', 'issue', 'assistant'] as Tab[]).map(t => (
                <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                  {t === 'keys' && '🔑 My Keys'}{t === 'issue' && '✨ Issue Key'}{t === 'assistant' && '🤖 AI Assistant'}
                </button>
              ))}
            </nav>
            <main>{tab === 'keys' && <MyKeys />}{tab === 'issue' && <IssueKey onSuccess={() => setTab('keys')} />}{tab === 'assistant' && <AIAssistant />}</main>
          </div>
        </div>
      )}
      <footer className="footer"><span>AccessKeyNFT · OneChain Testnet</span><a href="https://onescan.cc/testnet" target="_blank" rel="noreferrer">Explorer ↗</a></footer>
    </div>
  )
}
