import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Check, Layers3, PackagePlus, RefreshCw, Sparkles } from 'lucide-react'
import api from './api'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'
import './App.css'

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  (error.code === 'ECONNABORTED'
    ? 'The server took too long to respond. Please try again.'
    : error.response
      ? 'The request could not be completed. Please try again.'
      : 'Unable to reach the API. Check that the backend is running.')

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [notice, setNotice] = useState(null)

  const fetchItems = useCallback(async () => {
    const response = await api.get('/')
    return response.data
  }, [])

  useEffect(() => {
    let active = true
    fetchItems()
      .then((loadedItems) => {
        if (active) setItems(loadedItems)
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [fetchItems])

  const handleRetry = () => {
    setLoading(true)
    setError('')
    fetchItems()
      .then(setItems)
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const handleSave = async (itemData) => {
    setSaving(true)
    setError('')
    try {
      if (editingItem) {
        const response = await api.put(`/${editingItem._id}`, itemData)
        setItems((current) =>
          current.map((item) => (item._id === response.data._id ? response.data : item)),
        )
        setEditingItem(null)
        setNotice({ type: 'success', message: 'Your item was updated.' })
      } else {
        const response = await api.post('/', itemData)
        setItems((current) => [response.data, ...current])
        setNotice({ type: 'success', message: 'Your new item was added.' })
      }
      return true
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setNotice({ type: 'error', message: getErrorMessage(requestError) })
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    setDeletingId(item._id)
    setError('')
    try {
      await api.delete(`/${item._id}`)
      setItems((current) => current.filter((currentItem) => currentItem._id !== item._id))
      if (editingItem?._id === item._id) setEditingItem(null)
      setNotice({ type: 'success', message: `"${item.title}" was removed.` })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setNotice({ type: 'error', message: getErrorMessage(requestError) })
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Stockroom home">
          <span className="brand-mark"><Layers3 size={19} strokeWidth={2.2} /></span>
          <span>stockroom<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="status-dot" />
          <span>Personal inventory</span>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><Sparkles size={14} /> SIMPLE INVENTORY, IN CONTROL</span>
            <h1>Everything you own,<br /><span>in one place.</span></h1>
            <p>A clear, effortless way to keep track of your catalog.</p>
          </div>
          <div className="hero-stat">
            <span className="stat-icon"><PackagePlus size={18} /></span>
            <div>
              <span className="stat-value">{loading ? '—' : items.length.toString().padStart(2, '0')}</span>
              <span className="stat-label">ITEMS TRACKED</span>
            </div>
          </div>
          <div className="hero-decoration" aria-hidden="true"><span /><span /><span /></div>
        </section>
        {notice && (
          <div className={`notice notice-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
            {notice.type === 'success' ? <Check size={17} /> : <AlertCircle size={17} />}
            <span>{notice.message}</span>
            <button aria-label="Dismiss notification" onClick={() => setNotice(null)} type="button">×</button>
          </div>
        )}

        {error && !notice && (
          <div className="alert-banner" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button className="button button-secondary retry-button" onClick={handleRetry} type="button">
              <RefreshCw size={15} /> Retry
            </button>
          </div>
        )}

        <div className="content-grid">
          <ItemForm
            editingItem={editingItem}
            error={error}
            key={editingItem?._id || 'new-item'}
            onCancel={() => { setEditingItem(null); setError('') }}
            onSubmit={handleSave}
            saving={saving}
          />
          <div className="inventory-column">
            {loading ? (
              <section className="panel loading-panel" aria-live="polite">
                <span className="large-spinner" />
                <h2>Loading your catalog</h2>
                <p>Getting your items ready...</p>
              </section>
            ) : (
              <ItemList
                deletingId={deletingId}
                items={items}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>STOCKROOM <span className="brand-period">·</span> YOUR SPACE, WELL KEPT</span>
        <span>Made for keeping things simple.</span>
      </footer>
    </div>
  )
}

export default App
