import React, { useState } from 'react';
import type { Order } from '../types';

interface AddTagModalProps {
  order: Order;
  /** All tags currently known across the system (DEFAULT_TAGS ∪ any user-added). */
  availableTags: string[];
  onClose: () => void;
  onSave: (orderId: string, nextTags: string[], newlyCreatedTags: string[]) => void;
}

/**
 * Modal that lets the user attach tags to an order. Surfaces three sections:
 *   1. Tags already on the order  (chips with × to remove)
 *   2. All system tags            (toggle to attach)
 *   3. Inline "Create new tag…"   (Enter or button to add)
 */
export const AddTagModal: React.FC<AddTagModalProps> = ({
  order,
  availableTags,
  onClose,
  onSave,
}) => {
  const [selected, setSelected] = useState<string[]>(order.tags);
  const [newTagDraft, setNewTagDraft] = useState('');
  const [createdTags, setCreatedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const addNewTag = () => {
    const trimmed = newTagDraft.trim();
    if (!trimmed) return;
    if (![...availableTags, ...createdTags].some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setCreatedTags((prev) => [...prev, trimmed]);
    }
    if (!selected.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setSelected((prev) => [...prev, trimmed]);
    }
    setNewTagDraft('');
  };

  const allTagsForPicker = Array.from(
    new Set([...availableTags, ...createdTags, ...order.tags]),
  );

  return (
    <div
      className="ord-ov"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-tag-title"
    >
      <div
        className="ord-modal"
        style={{ width: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ord-modal-hdr">
          <div>
            <div className="ord-modal-title" id="add-tag-title">
              Add Order Tag
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>
              Order ID: <b style={{ color: 'var(--ink2)' }}>{order.id}</b>
            </div>
          </div>
          <button type="button" className="ord-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ord-modal-body">
          <div className="ord-tag-section">
            <div className="ord-tag-section-lbl">Previously Added</div>
            {order.tags.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--ink3)' }}>No tags yet.</div>
            ) : (
              <div className="ord-tag-row">
                {order.tags.map((t) => (
                  <span key={t} className="ord-tag on">
                    {t}
                    <button
                      type="button"
                      className="ord-tag-x"
                      aria-label={`Remove tag ${t}`}
                      onClick={() => toggleTag(t)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="ord-tag-section">
            <div className="ord-tag-section-lbl">All Tags · click to attach</div>
            <div className="ord-tag-row">
              {allTagsForPicker.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`ord-tag ${selected.includes(t) ? 'on' : ''}`}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="ord-tag-section">
            <div className="ord-tag-section-lbl">Create New Tag</div>
            <div className="ord-tag-new">
              <input
                type="text"
                placeholder="e.g. Bulk Buyer"
                value={newTagDraft}
                onChange={(e) => setNewTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addNewTag();
                  }
                }}
              />
              <button
                type="button"
                className="ord-tag-add"
                onClick={addNewTag}
                disabled={!newTagDraft.trim()}
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        <div className="ord-modal-ft">
          <button type="button" className="ord-cta ord-cta-s" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="ord-cta ord-cta-p"
            onClick={() => onSave(order.id, selected, createdTags)}
          >
            Save Tags
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTagModal;
