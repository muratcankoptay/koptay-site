import { useState } from 'react'
import { FileText, Calendar, Clock, User, Shield, Download, Eye } from 'lucide-react'

const ClientPanel = () => {
  const [isLoginMode, setIsLoginMode] = useState(false) // Demo önce gösterilsin
  const [loginData, setLoginData] = useState({
    clientId: '',
    password: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    // Bu kısım sonradan backend ile bağlanacak
    console.log('Login attempt:', loginData)
  }

  const mockClientData = {
    name: 'Örnek Müvekkil',
    caseNumber: 'DV-2024-001',
    status: 'Devam Ediyor',
    nextHearing: '15 Kasım 2024',
    documents: [
      { id: 1, name: 'Dilekçe.pdf', date: '10 Ekim 2024', type: 'Dilekçe' },
      { id: 2, name: 'Belge_Toplama.pdf', date: '08 Ekim 2024', type: 'Belge' },
      { id: 3, name: 'Duruşma_Tutanağı.pdf', date: '05 Ekim 2024', type: 'Tutanak' }
    ],
    timeline: [
      { date: '10 Ekim 2024', event: 'Dilekçe mahkemeye sunuldu', status: 'completed' },
      { date: '08 Ekim 2024', event: 'Belge toplama tamamlandı', status: 'completed' },
      { date: '05 Ekim 2024', event: 'İlk görüşme gerçekleşti', status: 'completed' },
      { date: '15 Kasım 2024', event: 'Duruşma tarihi', status: 'upcoming' }
    ]
  }

  return (
    <section id="client-panel" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-lawPrimary mb-6">
            Müvekkil Paneli
          </h2>
          <p className="font-sans text-xl text-gray-600 max-w-3xl mx-auto">
            Dosyanızın durumunu takip edin, belgelerinizi görüntüleyin ve duruşma tarihlerinizi kontrol edin.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {isLoginMode ? (
            /* Login Form */
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-lawPrimary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-lawPrimary" />
                </div>
                <h3 className="font-serif text-2xl text-lawDark mb-2">Güvenli Giriş</h3>
                <p className="text-gray-600">Müvekkil kimlik numaranız ve şifreniz ile giriş yapın</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-lawDark mb-2">
                    Müvekkil Kimlik No
                  </label>
                  <input
                    type="text"
                    value={loginData.clientId}
                    onChange={(e) => setLoginData({ ...loginData, clientId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                    placeholder="MV-2024-XXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-lawDark mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-lawPrimary text-white py-3 px-6 rounded-lg font-medium hover:bg-lawSecondary transition-all duration-300 transform hover:scale-105"
                >
                  Panele Giriş Yap
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Giriş bilgilerinizi unuttuysanız bizimle iletişime geçin.
                </p>
                <button
                  onClick={() => setIsLoginMode(false)}
                  className="text-lawPrimary font-medium hover:text-lawSecondary transition-colors"
                >
                  Demo Paneli Görüntüle
                </button>
              </div>
            </div>
          ) : (
            /* Dashboard Demo */
            <div>
              {/* Login Button at Top */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsLoginMode(true)}
                  className="bg-lawPrimary text-white px-6 py-3 rounded-lg font-medium hover:bg-lawSecondary transition-all duration-300 flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Giriş Yap
                </button>
              </div>
              
              {/* Demo Panel */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-lawPrimary to-lawSecondary text-white p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl">{mockClientData.name}</h3>
                    <p className="text-white/80">Dosya No: {mockClientData.caseNumber}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Status Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-lawGreen/10 border border-lawGreen/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-6 h-6 text-lawGreen" />
                      <h4 className="font-medium text-lawDark">Dosya Durumu</h4>
                    </div>
                    <p className="text-2xl font-bold text-lawGreen">{mockClientData.status}</p>
                  </div>

                  <div className="bg-lawSecondary/10 border border-lawSecondary/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-6 h-6 text-lawSecondary" />
                      <h4 className="font-medium text-lawDark">Sonraki Duruşma</h4>
                    </div>
                    <p className="text-lg font-semibold text-lawSecondary">{mockClientData.nextHearing}</p>
                  </div>

                  <div className="bg-lawPrimary/10 border border-lawPrimary/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-6 h-6 text-lawPrimary" />
                      <h4 className="font-medium text-lawDark">Toplam Belge</h4>
                    </div>
                    <p className="text-2xl font-bold text-lawPrimary">{mockClientData.documents.length}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Documents */}
                  <div>
                    <h4 className="font-serif text-xl text-lawDark mb-4">Belgeler</h4>
                    <div className="space-y-3">
                      {mockClientData.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-lawPrimary" />
                            <div>
                              <p className="font-medium text-lawDark">{doc.name}</p>
                              <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-lawSecondary hover:bg-lawSecondary hover:text-white rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-lawPrimary hover:bg-lawPrimary hover:text-white rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="font-serif text-xl text-lawDark mb-4">Süreç Takibi</h4>
                    <div className="space-y-4">
                      {mockClientData.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-4 h-4 rounded-full mt-1 ${
                            item.status === 'completed' ? 'bg-lawGreen' : 'bg-lawSecondary'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-lawDark">{item.event}</p>
                            <p className="text-sm text-gray-600">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Bu bir demo görünümüdür. Gerçek panel için giriş yapmanız gerekmektedir.
                  </p>
                  <button
                    onClick={() => setIsLoginMode(true)}
                    className="bg-lawPrimary text-white px-6 py-2 rounded-lg font-medium hover:bg-lawSecondary transition-colors"
                  >
                    Giriş Ekranına Dön
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-lawPrimary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-lawPrimary" />
            </div>
            <h3 className="font-serif text-xl text-lawDark mb-2">Güvenli Erişim</h3>
            <p className="text-gray-600">Bilgileriniz 256-bit SSL şifreleme ile korunmaktadır.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-lawSecondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-lawSecondary" />
            </div>
            <h3 className="font-serif text-xl text-lawDark mb-2">7/24 Erişim</h3>
            <p className="text-gray-600">Dosyanızı istediğiniz zaman kontrol edebilirsiniz.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-lawGreen/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-lawGreen" />
            </div>
            <h3 className="font-serif text-xl text-lawDark mb-2">Anlık Güncellemeler</h3>
            <p className="text-gray-600">Dosyanızdaki her gelişme anında panele yansır.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClientPanel