import React, { useEffect, useRef, useState } from 'react';
import type { CatalogProduct } from '../data/forwardOrderData';

interface ProductSearchSelectProps {
  products: CatalogProduct[];
  /** Fired when the user picks a product from the dropdown. */
  onSelect: (product: CatalogProduct) => void;
  /** Fired when the user clicks "+ Add new Product" in the footer. */
  onAddNew: () => void;
}

/**
 * Searchable product dropdown shown on the New Forward Order screen.
 * Mirrors the "Select Product dropdown" screenshot supplied with the brief:
 * search box at the top, image + name (highlighted match) + SKU + category
 * + price rows, and an "+ Add new Product" footer link.
 *
 * Built on top of the existing `.cdd*` primitives — same focus/hover/active
 * styling as every other dropdown in the codebase.
 */
export const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  products,
  onSelect,
  onAddNew,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      )
    : products;

  return (
    <div className="cdd" ref={ref}>
      <div className="ord-nf-search">
        <span className="ord-nf-search-ico" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="5" />
            <path d="m11 11 3 3" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search product name or SKU..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && (
        <div className="cdd-list ord-nf-prodlist">
          <div className="cdd-items" style={{ maxHeight: 320 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 16, fontSize: 12, color: 'var(--ink3)' }}>
                No products match "{query}"
              </div>
            ) : (
              filtered.map((p) => (
                <div
                  key={p.id}
                  className="ord-nf-prod-item"
                  onClick={() => {
                    onSelect(p);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <div className="ord-nf-prod-thumb" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <rect x="3" y="6" width="18" height="13" rx="2" />
                      <path d="M8 6V4h8v2" />
                    </svg>
                  </div>
                  <div className="ord-nf-prod-name">
                    {highlight(p.name, q)}
                  </div>
                  <div className="ord-nf-prod-sku">SKU :{p.sku}</div>
                  <div className="ord-nf-prod-cat">{p.category.toUpperCase()}</div>
                  <div className="ord-nf-prod-price">₹{p.price.toLocaleString('en-IN')}</div>
                </div>
              ))
            )}
          </div>

          <div className="ord-nf-prod-ft">
            <span className="ord-nf-prod-ft-l">
              {q ? <>{filtered.length} results for <b>"{query}"</b> in catalog</> : `${products.length} products in catalog`}
            </span>
            <span
              className="ord-nf-prod-ft-add"
              onClick={() => {
                setOpen(false);
                onAddNew();
              }}
            >
              + Add new Product
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/** Wraps the matching substring with a <b> so it renders in orange. */
function highlight(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <b className="ord-nf-prod-hi">{text.slice(i, i + q.length)}</b>
      {text.slice(i + q.length)}
    </>
  );
}

export default ProductSearchSelect;
