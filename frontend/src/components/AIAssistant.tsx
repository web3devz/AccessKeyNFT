import { useMemo, useState } from 'react'

type SuggestionType = 'policy' | 'tiering' | 'security'

const SYSTEM_PROMPT =
  'You are an access-control assistant for a blockchain dApp. Be concise, practical, and implementation-oriented. Focus on NFT-based token-gated access design, issuer rules, and revocation strategy.'

const suggestionLabels: Record<SuggestionType, string> = {
  policy: 'Generate Access Policy',
  tiering: 'Suggest Tier Matrix',
  security: 'Security Checklist',
}

function extractAssistantText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return ''

  const data = payload as {
    output_text?: unknown
    output?: Array<{ content?: Array<{ text?: unknown }> }>
  }

  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const chunks = data.output ?? []
  const lines: string[] = []
  for (const chunk of chunks) {
    const content = chunk?.content ?? []
    for (const item of content) {
      if (typeof item?.text === 'string' && item.text.trim()) {
        lines.push(item.text.trim())
      }
    }
  }

  return lines.join('\n\n').trim()
}

function normalizePlainText(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function AIAssistant() {
  const [resource, setResource] = useState('')
  const [tier, setTier] = useState('Standard')
  const [validityHint, setValidityHint] = useState('')
  const [customGoal, setCustomGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState('')

  const apiKey = import.meta.env.VITE_OPENAI_KEY as string | undefined
  const hasApiKey = Boolean(apiKey && apiKey.trim())

  const contextBlock = useMemo(
    () =>
      [
        `Resource: ${resource || 'N/A'}`,
        `Tier: ${tier || 'N/A'}`,
        `Validity/Epoch Notes: ${validityHint || 'N/A'}`,
      ].join('\n'),
    [resource, tier, validityHint],
  )

  const runAssistant = async (type: SuggestionType) => {
    if (!hasApiKey) {
      setError('Missing VITE_OPENAI_KEY in .env')
      return
    }

    setLoading(true)
    setError('')
    setAnswer('')

    const taskPrompt =
      type === 'policy'
        ? 'Draft an issuer-ready access policy with minting and revocation rules.'
        : type === 'tiering'
          ? 'Create a 4-tier matrix (Standard, Premium, VIP, Admin) with on-chain-friendly permissions.'
          : 'Provide a concise operational and smart-contract safety checklist before issuing keys.'

    const userPrompt = [
      'Project: AccessKeyNFT (NFT-based access control).',
      contextBlock,
      `Goal: ${customGoal || taskPrompt}`,
      'Output format: plain text only. Do not use markdown syntax, headings, bullets, numbering, or code fences. Keep it under 220 words.',
    ].join('\n\n')

    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.4,
          max_output_tokens: 420,
        }),
      })

      if (!response.ok) {
        const details = await response.text()
        throw new Error(`OpenAI request failed (${response.status}): ${details.slice(0, 220)}`)
      }

      const data = (await response.json()) as unknown
      const text = extractAssistantText(data)
      setAnswer(normalizePlainText(text || '') || 'No readable text returned. Try again with a more specific intent.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get AI response.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card ai-card">
      <div className="card-header">
        <h2>AI Access Assistant</h2>
        <p className="card-desc">
          Dashboard helper for policy drafting, tier design, and pre-issuance safety checks.
        </p>
      </div>

      <div className="form">
        <div className="form-row">
          <label>
            Resource
            <input
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              placeholder="e.g. Private DAO Forum"
            />
          </label>
          <label>
            Tier
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="form-select"
            >
              <option>Standard</option>
              <option>Premium</option>
              <option>VIP</option>
              <option>Admin</option>
            </select>
          </label>
        </div>

        <label>
          Validity / Epoch Notes
          <input
            value={validityHint}
            onChange={(e) => setValidityHint(e.target.value)}
            placeholder="e.g. 90 days, renewable"
          />
        </label>

        <label>
          Custom Intent (optional)
          <textarea
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            rows={3}
            placeholder="e.g. Need anti-abuse and temporary VIP passes for event week"
          />
        </label>

        <div className="ai-actions">
          {(Object.keys(suggestionLabels) as SuggestionType[]).map((kind) => (
            <button
              key={kind}
              type="button"
              className="btn-secondary"
              onClick={() => runAssistant(kind)}
              disabled={loading}
            >
              {loading ? 'Thinking...' : suggestionLabels[kind]}
            </button>
          ))}
        </div>

        {!hasApiKey && <p className="error">⚠ Add VITE_OPENAI_KEY in .env to enable this assistant.</p>}
        {error && <p className="error">⚠ {error}</p>}
      </div>

      <div className="ai-output" aria-live="polite">
        {answer ? <pre>{answer}</pre> : <p className="card-desc">Run one of the assistant actions to generate guidance.</p>}
      </div>
    </div>
  )
}