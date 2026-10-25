import { Archive, ArrowUpRight, Pencil, Trash2 } from 'lucide-react'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

function ItemList({ items, onEdit, onDelete, deletingId }) {
  return (
    <section className="panel list-panel" aria-labelledby="items-heading">
      <div className="panel-heading list-heading">
        <div>
          <span className="eyebrow">INVENTORY</span>
          <h2 id="items-heading">Your items <span className="item-count">{items.length}</span></h2>
        </div>
        <span className="list-caption">LATEST FIRST <ArrowUpRight size={14} /></span>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><Archive size={22} /></span>
          <h3>No items yet</h3>
          <p>Your catalog is ready. Add your first item using the form.</p>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <article className="item-card" key={item._id}>
              <div className="item-card-top">
                <span className="category-pill">{item.category || 'Uncategorized'}</span>
                <span className="item-price">{formatPrice(item.price)}</span>
              </div>
              <div className="item-copy">
                <h3>{item.title}</h3>
                <p>{item.description || 'No description added.'}</p>
              </div>
              <div className="item-card-footer">
                <span className="item-id">ITEM / {item._id.slice(-6).toUpperCase()}</span>
                <div className="item-actions">
                  <button
                    aria-label={`Edit ${item.title}`}
                    className="icon-button"
                    onClick={() => onEdit(item)}
                    type="button"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    aria-label={`Delete ${item.title}`}
                    className="icon-button icon-button-danger"
                    disabled={deletingId === item._id}
                    onClick={() => onDelete(item)}
                    type="button"
                  >
                    {deletingId === item._id ? <span className="small-spinner" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ItemList
