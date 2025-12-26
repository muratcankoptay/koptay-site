import { useState, useEffect, useRef } from 'react'
import { 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon,
  Search,
  Loader,
  AlertCircle,
  X
} from 'lucide-react'

const API_URL = 'http://localhost:3001/api'

const ImageManager = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedUrl, setCopiedUrl] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, image: null })
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/images`)
      const data = await res.json()
      setImages(data || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)

    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        })

        if (res.ok) {
          const data = await res.json()
          setImages(prev => [{ filename: data.filename, url: data.url }, ...prev])
        }
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    showNotification(`${files.length} görsel yüklendi!`)
    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.image) return

    try {
      const res = await fetch(`${API_URL}/images/${deleteModal.image.filename}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setImages(images.filter(img => img.filename !== deleteModal.image.filename))
        showNotification('Görsel silindi')
      }
    } catch (error) {
      showNotification('Silme hatası', 'error')
    } finally {
      setDeleteModal({ open: false, image: null })
    }
  }

  const copyToClipboard = async (url) => {
    const fullUrl = url.startsWith('http') ? url : `https://koptay.av.tr${url}`
    await navigator.clipboard.writeText(fullUrl)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
    showNotification('URL kopyalandı!')
  }

  const filteredImages = images.filter(img => 
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Görseller</h1>
          <p className="text-gray-600 mt-1">{images.length} görsel yüklendi</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
          {uploading ? 'Yükleniyor...' : 'Görsel Yükle'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Görsel ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors"
      >
        {uploading ? (
          <Loader className="mx-auto mb-4 animate-spin text-amber-600" size={48} />
        ) : (
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        )}
        <p className="text-lg font-medium text-gray-700 mb-2">
          {uploading ? 'Yükleniyor...' : 'Görsel yüklemek için tıklayın veya sürükleyin'}
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, GIF, WEBP - Maksimum 10MB
        </p>
      </div>

      {/* Images Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.filename}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
            >
              <div className="aspect-square relative">
                <img
                  src={image.url.startsWith('http') ? image.url : `http://localhost:5173${image.url}`}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="URL Kopyala"
                  >
                    {copiedUrl === image.url ? (
                      <Check size={20} className="text-green-600" />
                    ) : (
                      <Copy size={20} className="text-gray-700" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, image })}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 truncate" title={image.filename}>
                  {image.filename}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? 'Sonuç bulunamadı' : 'Henüz görsel yok'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Arama kriterlerinizi değiştirmeyi deneyin'
              : 'Yukarıdaki alandan görsel yükleyebilirsiniz'}
          </p>
        </div>
      )}

      {/* Usage Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3">💡 Görsel Kullanımı</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Görselin üzerine gelip <strong>URL Kopyala</strong> butonuna tıklayın</li>
          <li>• Makale editöründe görseli eklemek için: <code className="bg-blue-100 px-1 rounded">![açıklama](url)</code></li>
          <li>• Veya makale oluştururken "Kapak Görseli" bölümünden doğrudan yükleyin</li>
          <li>• Görseller <code className="bg-blue-100 px-1 rounded">public/images/articles/</code> klasörüne kaydedilir</li>
        </ul>
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Görseli Sil</h3>
                <p className="text-sm text-gray-500">Bu işlem geri alınamaz!</p>
              </div>
            </div>
            
            {deleteModal.image && (
              <div className="mb-6">
                <img
                  src={deleteModal.image.url.startsWith('http') ? deleteModal.image.url : `http://localhost:5173${deleteModal.image.url}`}
                  alt={deleteModal.image.filename}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-2 truncate">{deleteModal.image.filename}</p>
              </div>
            )}
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ open: false, image: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageManager
