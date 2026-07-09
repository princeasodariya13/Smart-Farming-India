import React, { useState } from 'react'
import { Scan, Upload, Camera, CheckCircle, AlertTriangle, XCircle, Leaf, Info } from 'lucide-react'
import './PageCommon.css'
import './DiseaseDetectionPage.css'

const DISEASES = [
  { name: 'Wheat Rust', confidence: 97.3, severity: 'high', treatment: 'Apply Propiconazole fungicide. Remove infected leaves. Ensure proper spacing for airflow.' },
  { name: 'Healthy Crop', confidence: 99.1, severity: 'none', treatment: 'No treatment needed. Continue regular care.' },
  { name: 'Leaf Blight', confidence: 91.5, severity: 'medium', treatment: 'Apply Mancozeb. Avoid overhead irrigation. Rotate crops next season.' },
]

const CROP_TYPES = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize', 'Sugarcane', 'Tomato', 'Potato']

const DiseaseDetectionPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedCrop, setSelectedCrop] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<(typeof DISEASES)[0] | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setSelectedFile(file)
    setResult(null)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const analyze = async () => {
    if (!selectedFile) return
    setIsAnalyzing(true)
    // Simulate AI API call
    await new Promise(r => setTimeout(r, 2500))
    setResult(DISEASES[Math.floor(Math.random() * DISEASES.length)])
    setIsAnalyzing(false)
  }

  const severityColor = (s: string) => ({ high: '#dc2626', medium: '#d97706', low: '#2563eb', none: '#16a34a' }[s] || '#6b7280')
  const severityIcon = (s: string) => s === 'none' ? CheckCircle : s === 'high' ? XCircle : AlertTriangle

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Scan size={24} /> AI Disease Detection</h1>
          <p className="page-subtitle">Upload a photo of your crop — our AI identifies diseases in seconds</p>
        </div>
        <div className="badge badge-green">
          <Leaf size={12} /> 50+ Diseases Supported
        </div>
      </div>

      <div className="page-grid-2">
        {/* Upload Panel */}
        <div className="page-card">
          <h2 className="page-card__title" style={{ marginBottom: '1.25rem' }}>Upload Crop Photo</h2>

          {/* Crop Selector */}
          <div className="form-group">
            <label className="form-label">Crop Type (optional)</label>
            <select className="form-control" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
              <option value="">Auto-detect crop type</option>
              {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Drop Zone */}
          <div
            className={`disease-dropzone ${dragOver ? 'disease-dropzone--active' : ''} ${preview ? 'disease-dropzone--has-image' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="disease-preview-img" />
            ) : (
              <div className="disease-dropzone__content">
                <div className="disease-dropzone__icon"><Upload size={28} /></div>
                <p className="disease-dropzone__title">Drop your crop photo here</p>
                <p className="disease-dropzone__sub">or click to browse • JPG, PNG up to 10MB</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="disease-dropzone__input"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </div>

          {preview && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={analyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <><div className="spinner" style={{ width: '1rem', height: '1rem', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Analyzing with AI...</>
                ) : (
                  <><Scan size={16} /> Analyze Disease</>
                )}
              </button>
              <button className="btn btn-outline" onClick={() => { setPreview(null); setSelectedFile(null); setResult(null) }}>
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="page-card">
          <h2 className="page-card__title" style={{ marginBottom: '1.25rem' }}>Detection Result</h2>

          {!result && !isAnalyzing && (
            <div className="empty-state">
              <div className="empty-state__icon"><Camera size={28} /></div>
              <p className="empty-state__title">No analysis yet</p>
              <p className="empty-state__text">Upload a crop photo and click "Analyze Disease" to get instant AI-powered results.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="disease-analyzing">
              <div className="disease-analyzing__spinner" />
              <p className="disease-analyzing__title">Analyzing your crop...</p>
              <p className="disease-analyzing__sub">Our AI is examining the image for 50+ disease patterns</p>
              <div className="disease-analyzing__steps">
                {['Loading image...', 'Detecting crop type...', 'Scanning for diseases...', 'Generating report...'].map((s, i) => (
                  <div key={i} className="disease-analyzing__step">
                    <div className="disease-analyzing__step-dot" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !isAnalyzing && (() => {
            const SeverityIcon = severityIcon(result.severity)
            return (
              <div className="disease-result">
                <div className="disease-result__header" style={{ borderColor: severityColor(result.severity) + '33', background: severityColor(result.severity) + '10' }}>
                  <SeverityIcon size={24} style={{ color: severityColor(result.severity) }} />
                  <div>
                    <h3 style={{ fontWeight: 800, color: 'var(--gray-900)' }}>{result.name}</h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--gray-500)' }}>Confidence: {result.confidence}%</p>
                  </div>
                  <div className="badge" style={{ background: severityColor(result.severity) + '20', color: severityColor(result.severity), marginLeft: 'auto' }}>
                    {result.severity === 'none' ? 'Healthy' : result.severity.toUpperCase()}
                  </div>
                </div>

                <div className="disease-result__confidence-bar">
                  <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${result.confidence}%`, height: '100%', background: severityColor(result.severity), borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: severityColor(result.severity) }}>{result.confidence}%</span>
                </div>

                <div className="disease-result__treatment">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    <Info size={16} style={{ color: 'var(--green-600)' }} /> Recommended Treatment
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{result.treatment}</p>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  📤 Save Report & Get Expert Help
                </button>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Tips */}
      <div className="page-card">
        <h2 className="page-card__title" style={{ marginBottom: '1.25rem' }}>📸 Photo Tips for Best Results</h2>
        <div className="page-grid-3">
          {[
            { emoji: '🌞', tip: 'Take photos in natural daylight', desc: 'Avoid shadows and use natural sunlight for clearest results.' },
            { emoji: '🔍', tip: 'Focus on affected area', desc: 'Zoom into the diseased leaf, stem or fruit for accurate detection.' },
            { emoji: '🖼️', tip: 'Keep background simple', desc: 'Plain soil or sky background helps the AI focus on the crop.' },
          ].map(({ emoji, tip, desc }) => (
            <div key={tip} style={{ padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{emoji}</div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.375rem' }}>{tip}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DiseaseDetectionPage
