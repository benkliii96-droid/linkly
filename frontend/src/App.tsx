import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

type Link = {
  id: number
  code: string
  url: string
  clicks: number
  created_at: string
}

const api = axios.create({ baseURL: '/api' })

function App() {
  const [links, setLinks] = useState<Link[]>([])
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [lastShort, setLastShort] = useState('')

  async function load() {
    const { data } = await api.get<Link[]>('/links')
    setLinks(data)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const payload: { url: string; code?: string } = { url }
      if (code.trim()) payload.code = code.trim()
      const { data } = await api.post<Link>('/links', payload)
      setLastShort(`${window.location.origin}/api/r/${data.code}`)
      setUrl('')
      setCode('')
      await load()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(String(err.response?.data?.error ?? 'Ошибка создания'))
      } else {
        setError('Ошибка создания')
      }
    }
  }

  async function copyShort(codeValue: string) {
    const short = `${window.location.origin}/api/r/${codeValue}`
    await navigator.clipboard.writeText(short)
    setLastShort(short)
  }

  async function removeLink(id: number) {
    await api.delete(`/links/${id}`)
    await load()
  }

  return (
    <div className="ticket-wrap">
      <div className="glow" aria-hidden />
      <main className="ticket">
        <div className="perforation" aria-hidden />
        <header>
          <p className="brand">LINKLY</p>
          <h1>Короткие ссылки с характером</h1>
          <p className="sub">Вставь длинный URL — получи билет на клики.</p>
        </header>

        <form onSubmit={onCreate}>
          <label>
            Длинный URL
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/path"
              required
            />
          </label>
          <label>
            Свой код
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="optional-code" />
          </label>
          {error && <p className="error">{error}</p>}
          {lastShort && (
            <p className="ok">
              Скопировано / готово: <code>{lastShort}</code>
            </p>
          )}
          <button type="submit">SHORTEN</button>
        </form>

        <section className="stack">
          <h2>Твои билеты</h2>
          {links.map((l) => (
            <article key={l.id} className="stub">
              <div>
                <code>/{l.code}</code>
                <p>{l.url}</p>
              </div>
              <div className="meta">
                <span>{l.clicks} clicks</span>
                <button type="button" onClick={() => copyShort(l.code)}>copy</button>
                <button type="button" className="danger" onClick={() => removeLink(l.id)}>del</button>
              </div>
            </article>
          ))}
          {links.length === 0 && <p className="empty">Пока пусто — создай первую ссылку.</p>}
        </section>
      </main>
    </div>
  )
}

export default App
