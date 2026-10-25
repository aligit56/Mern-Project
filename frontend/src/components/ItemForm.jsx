import { useState } from 'react'
import { LoaderCircle, Plus, Save, X } from 'lucide-react'

const emptyForm = { title: '', description: '', price: '', category: '' }

function ItemForm({ editingItem, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState(() =>
    editingItem
      ? {
          title: editingItem.title || '',
          description: editingItem.description || '',
          price: String(editingItem.price ?? ''),
          category: editingItem.category || '',
        }
      : emptyForm,
  )
  const [validationError, setValidationError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setValidationError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const title = form.title.trim()
    const price = Number(form.price)

    if (!title) {
      setValidationError('Add a title before saving this item.')
      return
    }
    if (form.price.trim() === '' || !Number.isFinite(price) || price < 0) {
      setValidationError('Enter a valid price of zero or more.')
      return
    }

    const saved = await onSubmit({
      title,
      description: form.description.trim(),
      price,
      category: form.category.trim(),
    })

    if (saved) {
      setForm(emptyForm)
      setValidationError('')
    }
  }

  return (
    <section className="panel form-panel" aria-labelledby="form-heading">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{editingItem ? 'MAKE CHANGES' : 'YOUR CATALOG'}</span>
          <h2 id="form-heading">{editingItem ? 'Edit item' : 'Add an item'}</h2>
        </div>
        {editingItem ? (
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Cancel editing">
            <X size={18} />
          </button>
        ) : (
          <span className="heading-icon"><Plus size={19} /></span>
        )}
      </div>

      <p className="form-intro">
        {editingItem
          ? 'Update the details and save your changes.'
          : 'Add a product to your collection. You can edit it any time.'}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Item name <span className="required">*</span></span>
          <input
            autoComplete="off"
            maxLength={120}
            name="title"
            onChange={handleChange}
            placeholder="e.g. Studio headphones"
            required
            value={form.title}
          />
        </label>

        <label className="field">
          <span>Description <span className="optional">Optional</span></span>
          <textarea
            maxLength={2000}
            name="description"
            onChange={handleChange}
            placeholder="A few details about this item..."
            rows={4}
            value={form.description}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Price <span className="required">*</span></span>
            <div className="price-input">
              <span aria-hidden="true">$</span>
              <input
                min="0"
                name="price"
                onChange={handleChange}
                placeholder="0.00"
                required
                step="0.01"
                type="number"
                value={form.price}
              />
            </div>
          </label>
          <label className="field">
            <span>Category <span className="optional">Optional</span></span>
            <input
              maxLength={80}
              name="category"
              onChange={handleChange}
              placeholder="e.g. Audio"
              value={form.category}
            />
          </label>
        </div>

        {(validationError || error) && (
          <p className="form-error" role="alert">{validationError || error}</p>
        )}

        <div className="form-actions">
          {editingItem && (
            <button className="button button-secondary" disabled={saving} onClick={onCancel} type="button">
              Cancel
            </button>
          )}
          <button className="button button-primary" disabled={saving} type="submit">
            {saving ? <LoaderCircle className="spin" size={17} /> : editingItem ? <Save size={17} /> : <Plus size={17} />}
            {saving ? 'Saving...' : editingItem ? 'Save changes' : 'Add item'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ItemForm
