import React, { useEffect, useRef, useState } from 'react';

interface NdrBulkUpdateModalProps {
  onClose: () => void;
  onCompleted?: (summary: BulkUpdateSummary) => void;
}

export interface BulkUpdateSummary {
  total: number;
  processed: number;
  skipped: number;
  errors: number;
  filename: string;
}

type ViewState = 'idle' | 'uploading' | 'result';

/**
 * Bulk NDR Update — CSV upload modal (matches `ui-source/screens/ndr-v4 (3).html`
 * "Bulk NDR Update" dialog). Three view states share the same modal shell:
 *
 *   • idle      — drag-and-drop zone, "How to use" instructions
 *   • uploading — animated progress bar
 *   • result    — Processed / Skipped / Errors summary tiles
 *
 * Reuses the shared `.ord-ov` + `.ord-modal*` shell so spacing, motion and
 * close-button visuals stay consistent with the rest of the system.
 */
export const NdrBulkUpdateModal: React.FC<NdrBulkUpdateModalProps> = ({
  onClose,
  onCompleted,
}) => {
  const [view, setView] = useState<ViewState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<BulkUpdateSummary | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Close on Escape ───────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* ── Clean up any in-flight progress timer on unmount ──────── */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ── File pick / clear ──────────────────────────────────────── */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };
  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  /* ── Drag and drop ──────────────────────────────────────────── */
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /* ── Fake upload + result generation (mirrors prototype JS) ─── */
  const startUpload = () => {
    if (!file) return;
    setView('uploading');
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const step = Math.floor(Math.random() * 14) + 8;
        const next = p + step;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          finalise(file);
          return 100;
        }
        return next;
      });
    }, 160);
  };

  const finalise = (f: File) => {
    const total = Math.floor(Math.random() * 30) + 15;
    const errors = Math.floor(Math.random() * 3);
    const skipped = Math.floor(Math.random() * 4);
    const processed = Math.max(0, total - errors - skipped);
    const s: BulkUpdateSummary = {
      total,
      processed,
      skipped,
      errors,
      filename: f.name,
    };
    setSummary(s);
    setView('result');
    onCompleted?.(s);
  };

  const resetToIdle = () => {
    setView('idle');
    setFile(null);
    setProgress(0);
    setSummary(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const fileSizeLabel = (f: File) => {
    return f.size > 1024 * 1024
      ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
      : `${(f.size / 1024).toFixed(1)} KB`;
  };

  return (
    <div
      className="ord-ov"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ndr-bn-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ord-modal" style={{ width: 520, maxWidth: '92vw' }}>
        <div className="ord-modal-hdr">
          <div>
            <div className="ord-modal-title" id="ndr-bn-title">
              Bulk NDR Update
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 3 }}>
              Export NDR and upload the same file after updates.
            </div>
          </div>
          <button
            type="button"
            className="ord-modal-x"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 22px' }}>
          {view === 'idle' && (
            <>
              <div
                className="ndr-bn-zone"
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ink3)"
                  strokeWidth="1.4"
                  className="ndr-bn-zone-ico"
                >
                  <path d="M12 15V4M9 7l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 17v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" strokeLinecap="round" />
                </svg>
                <div className="ndr-bn-zone-t">
                  Drag &amp; Drop or <span>Browse file</span>
                </div>
                <div className="ndr-bn-zone-s">Supports .CSV — max 5MB</div>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />

              {file && (
                <div className="ndr-bn-file-pill">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="1.5"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <rect x="3" y="1" width="10" height="14" rx="2" />
                    <path d="M6 5h4M6 8h4M6 11h2" strokeLinecap="round" />
                  </svg>
                  <div className="ndr-bn-file-meta">
                    <div className="ndr-bn-file-name">{file.name}</div>
                    <div className="ndr-bn-file-size">
                      {fileSizeLabel(file)} · .CSV
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ndr-bn-file-x"
                    onClick={clearFile}
                    aria-label="Remove selected file"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="ndr-bn-actions">
                <button type="button" className="ndr-ab ghost" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="ndr-ab primary"
                  onClick={startUpload}
                  disabled={!file}
                  style={!file ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
                >
                  Upload &amp; Process
                </button>
              </div>

              <div className="ndr-bn-howto">
                <div className="ndr-bn-howto-head">
                  <span>How to use</span>
                </div>
                <ol className="ndr-bn-howto-list">
                  <li>
                    <span className="ndr-bn-howto-num">1.</span>
                    <span>
                      <b>Export NDR</b> using the Export option on this page.
                    </span>
                  </li>
                  <li>
                    <span className="ndr-bn-howto-num">2.</span>
                    <span>
                      Fill the <b>'Seller Action'</b> and <b>'Seller Remarks'</b>{' '}
                      columns in the exported file.
                    </span>
                  </li>
                  <li>
                    <span className="ndr-bn-howto-num">✓</span>
                    <span className="ndr-bn-howto-muted">
                      <b>Valid actions:</b> Re-Attempt, RTO, Hold 48 Hours,
                      Update Phone, Update Address.
                    </span>
                  </li>
                  <li>
                    <span className="ndr-bn-howto-num">3.</span>
                    <span>
                      Save as <b>.CSV</b> and upload it using the zone above.
                    </span>
                  </li>
                </ol>
              </div>
            </>
          )}

          {view === 'uploading' && (
            <div style={{ padding: '12px 0' }}>
              <div className="ndr-bn-up-head">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="var(--orange)"
                  strokeWidth="1.5"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <rect x="3" y="1" width="10" height="14" rx="2" />
                  <path d="M6 5h4M6 8h4M6 11h2" strokeLinecap="round" />
                </svg>
                <div className="ndr-bn-up-label">
                  Uploading {file?.name ?? ''}…
                </div>
                <div className="ndr-bn-up-pct">{progress}%</div>
              </div>
              <div className="ndr-bn-bar">
                <div className="ndr-bn-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="ndr-bn-up-hint">
                Validating records and processing seller actions…
              </div>
            </div>
          )}

          {view === 'result' && summary && (
            <div style={{ padding: '4px 0' }}>
              <div className="ndr-bn-success">
                <div className="ndr-bn-success-ico" aria-hidden="true">
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="12"
                    height="12"
                  >
                    <path d="M2 6l2.5 2.5 5.5-5" />
                  </svg>
                </div>
                <div>
                  <div className="ndr-bn-success-title">Upload Successful</div>
                  <div className="ndr-bn-success-desc">
                    {summary.total} records uploaded · {summary.processed}{' '}
                    processed, {summary.skipped} skipped, {summary.errors} error
                    {summary.errors !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="ndr-bn-tiles">
                <div className="ndr-bn-tile ok">
                  <div className="ndr-bn-tile-n">{summary.processed}</div>
                  <div className="ndr-bn-tile-l">Processed</div>
                </div>
                <div className="ndr-bn-tile skip">
                  <div className="ndr-bn-tile-n">{summary.skipped}</div>
                  <div className="ndr-bn-tile-l">Skipped</div>
                </div>
                <div className="ndr-bn-tile err">
                  <div className="ndr-bn-tile-n">{summary.errors}</div>
                  <div className="ndr-bn-tile-l">Errors</div>
                </div>
              </div>

              <div className="ndr-bn-actions">
                <button type="button" className="ndr-ab ghost" onClick={resetToIdle}>
                  Upload Another
                </button>
                <button type="button" className="ndr-ab primary" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NdrBulkUpdateModal;
