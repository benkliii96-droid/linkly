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

  async function removeLink(id: number) {
    await api.delete(`/links/${id}`)
    await load()
  }

  return (
    <div className="shell">
      <header>
        <h1>Linkly</h1>
        <p className="muted">Сокращатель ссылок · React + PHP</p>
      </header>

      <form className="card" onSubmit={onCreate}>
        <h2>Сократить URL</h2>
        <label>
          Длинная ссылка
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/path"
            required
          />
        </label>
        <label>
          Кастомный код (опционально)
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="my-link" />
        </label>
        {error && <p className="error">{error}</p>}
        {lastShort && (
          <p className="ok">
            Готово: <code>{lastShort}</code>
          </p>
        )}
        <button type="submit">Создать</button>
      </form>

      <section className="card">
        <h2>Мои ссылки</h2>
        <table>
          <thead>
            <tr>
              <th>Код</th>
              <th>URL</th>
              <th>Клики</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id}>
                <td>
                  <code>{l.code}</code>
                </td>
                <td className="url">{l.url}</td>
                <td>{l.clicks}</td>
                <td>
                  <button type="button" className="danger" onClick={() => removeLink(l.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
