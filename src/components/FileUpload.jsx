import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, X, AlertCircle, Loader, Image as ImageIcon } from 'lucide-react';
import { uploadToSupabaseStorage, isSupabaseConfigured } from '../supabase';

const FileUpload = ({
  label = 'Upload Image/File',
  folder = 'uploads',
  currentUrl = '',
  onUploadSuccess,
  accept = 'image/*',
  maxSizeMB = 5,
  helperText = 'Supported formats: PNG, JPG, WEBP, SVG, PDF (Max 5MB)'
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds maximum size limit of ${maxSizeMB}MB.`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const result = await uploadToSupabaseStorage(file, folder);
      setPreviewUrl(result.publicUrl);
      if (onUploadSuccess) {
        onUploadSuccess(result.publicUrl, result.path);
      }
    } catch (err) {
      setError(err.message || 'Error uploading file to storage.');
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

  const handleClear = () => {
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadSuccess) {
      onUploadSuccess('', '');
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
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {isImage(previewUrl) ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#0b0b12'
              }}
            />
          ) : (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}
            >
              <ImageIcon size={28} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              <CheckCircle size={14} style={{ color: 'var(--success)' }} /> File Attached
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'var(--font-mono)',
                marginTop: '4px'
              }}
              title={previewUrl}
            >
              {previewUrl}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Remove file"
          >
            <X size={16} />
          </button>
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
            background: isDragOver ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255, 255, 255, 0.01)',
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
                Click to browse or drag & drop file here
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                {helperText}
              </div>
            </>
          )}
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
