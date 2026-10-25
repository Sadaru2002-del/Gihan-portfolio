import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import { uploadToSupabaseStorage, deleteFromSupabaseStorage, isSupabaseConfigured } from '../supabase';
import { toast } from '../context/ToastContext';

const FileUpload = ({
  label = 'Upload Image/File',
  folder = 'uploads',
  currentUrl = '',
  onUploadSuccess,
  accept = 'image/*',
  maxSizeMB = 5,
  helperText = 'Supported formats: PNG, JPG, WEBP, SVG, PDF (Max 5MB)',
  deleteFromStorage = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Synchronize internal preview when external currentUrl changes (e.g. editing a project or resetting)
  useEffect(() => {
    setPreviewUrl(currentUrl || '');
    setError('');
  }, [currentUrl]);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const errMsg = `File exceeds maximum size limit of ${maxSizeMB}MB.`;
      setError(errMsg);
      toast.warning(errMsg);
      return;
    }

    setError('');
    setNotice('');
    setUploading(true);

    try {
      const result = await uploadToSupabaseStorage(file, folder);
      setPreviewUrl(result.publicUrl);
      if (onUploadSuccess) {
        onUploadSuccess(result.publicUrl, result.path);
      }
      setNotice('✓ Photo uploaded successfully!');
      toast.success('Photo uploaded to storage successfully!');
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      const errMsg = err.message || 'Error uploading file to storage.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = async (e) => {
    if (e) e.stopPropagation();
    const urlToDelete = previewUrl;

    if (window.confirm ? !window.confirm('Are you sure you want to remove this photo?') : false) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      if (deleteFromStorage && urlToDelete && isSupabaseConfigured()) {
        await deleteFromSupabaseStorage(urlToDelete);
      }
    } catch (err) {
      console.warn('Storage delete notice:', err);
    } finally {
      setDeleting(false);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadSuccess) {
        onUploadSuccess('', '');
      }
      setNotice('✓ Photo removed. Remember to click "Update Project" / "Save" to apply changes.');
      toast.info('Photo removed from form. Remember to click "Update Project" to save changes.');
      setTimeout(() => setNotice(''), 6000);
    }
  };

  const isImage = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || url.startsWith('blob:') || url.startsWith('data:image');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UploadCloud size={15} style={{ color: 'var(--color-primary)' }} />
          {label}
        </label>
        <span style={{ fontSize: '0.7rem', color: isSupabaseConfigured() ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
          {isSupabaseConfigured() ? '🟢 Supabase Storage' : '🟡 Storage Ready (Local Preview)'}
        </span>
      </div>

      {previewUrl ? (
        <div
          style={{
            position: 'relative',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {isImage(previewUrl) ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-tertiary)'
              }}
            />
          ) : (
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}
            >
              <ImageIcon size={30} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              <CheckCircle size={15} style={{ color: 'var(--success)' }} /> Photo Attached
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'var(--font-mono)',
                marginTop: '4px',
                maxWidth: '280px'
              }}
              title={previewUrl}
            >
              {previewUrl}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {previewUrl.startsWith('http') && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--color-text-secondary)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
                title="Open full photo in new tab"
              >
                <ExternalLink size={13} />
                <span>View</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleClear}
              disabled={deleting}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#ef4444',
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: deleting ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              title="Delete this photo from project"
            >
              {deleting ? (
                <>
                  <Loader size={13} className="spinner" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Delete Photo</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: `2px dashed ${isDragOver ? 'var(--color-primary)' : 'var(--border-color)'}`,
            borderRadius: '12px',
            padding: '24px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragOver ? 'rgba(var(--color-primary-rgb), 0.08)' : 'var(--bg-secondary)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />

          {uploading ? (
            <>
              <Loader size={28} className="spinner" style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                Uploading to Supabase Storage...
              </span>
            </>
          ) : (
            <>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)'
                }}
              >
                <UploadCloud size={20} />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                Click to browse or drag & drop photo here
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                {helperText}
              </div>
            </>
          )}
        </div>
      )}

      {notice && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.78rem', marginTop: '2px', fontWeight: 500 }}>
          <CheckCircle size={14} /> {notice}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
