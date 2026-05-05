import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini AI Service
class GeminiService {
  constructor() {
    // API anahtarı environment variable'dan alınacak
    // Şimdilik demo key kullanıyoruz - production'da değiştirilmeli
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key'
    this.genAI = null
    this.model = null
    
    if (this.apiKey && this.apiKey !== 'demo-key') {
      this.genAI = new GoogleGenerativeAI(this.apiKey)
      
      // Gemini'nin önerdiği güncel modeller (sırayla)
      const availableModels = [
        "gemini-2.5-flash",    // Gemini'nin önerdiği hızlı model ⚡
        "gemini-2.5-pro",      // Daha karmaşık akıl yürütme için 🧠
        "gemini-1.5-flash",    // Fallback eski sürüm
        "gemini-1.5-pro"       // Fallback eski sürüm
      ]
      
      // İlk mevcut modeli kullan (gemini-2.5-flash)
      this.modelName = availableModels[0]
      this.model = this.genAI.getGenerativeModel({ model: this.modelName })
      
      console.log(`🤖 Gemini AI başlatıldı: ${this.modelName}`)
    }
  }

  // API anahtarının geçerli olup olmadığını kontrol et
  isConfigured() {
    return this.apiKey && this.apiKey !== 'demo-key' && this.genAI
  }

  // Model değiştirme fonksiyonu
  async tryAlternativeModel() {
    const alternativeModels = [
      "gemini-2.5-pro",     // Gemini'nin önerdiği güçlü model
      "gemini-1.5-flash",   // Eski sürüm fallback
      "gemini-1.5-pro",     // Eski sürüm fallback
      "gemini-pro"          // Son çare eski model
    ]
    
    for (const modelName of alternativeModels) {
      try {
        console.log(`🔄 Alternatif model deneniyor: ${modelName}`)
        this.model = this.genAI.getGenerativeModel({ model: modelName })
        this.modelName = modelName
        return true
      } catch (error) {
        console.log(`❌ ${modelName} modeli başarısız`)
        continue
      }
    }
    return false
  }

  // Suç türü önerisi al
  async suggestCrimeType(description) {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'Gemini AI yapılandırılmamış. API anahtarı gerekli.'
      }
    }

    try {
      // Model'in mevcut olup olmadığını kontrol et
      console.log('🤖 Gemini AI ile analiz başlatılıyor...', this.modelName);
      const prompt = `
      Türk Ceza Kanunu uzmanı olarak aşağıdaki suç açıklamasını analiz et ve doğru suç türünü belirle:

      İşlenen Suç: "${description}"

      Aşağıdaki suç kategorilerinden EN UYGUN olanı seç:
      - kasten_oldurme: Kasten Öldürme
      - kasten_yaralama: Kasten Yaralama  
      - cinsel_saldiri: Cinsel Saldırı
      - hirsizlik: Hırsızlık
      - dolandiricilik: Dolandırıcılık
      - yagma: Yağma
      - tehdit: Tehdit
      - hakaret: Hakaret
      - zimmet: Zimmet
      - rusvet: Rüşvet
      - uyusturucu_imal_ticaret: Uyuşturucu İmal ve Ticareti
      - teror_orgut_uyeligik: Terör Örgütü Üyeliği
      - genel: Genel Suçlar

      Cevabını şu formatta ver:
      SUÇTUR: [suç_kodu]
      AÇIKLAMA: [kısa açıklama]
      GÜVEN: [%0-100 güven skoru]
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Response'u parse et
      const crimeTypeMatch = text.match(/SUÇTUR:\s*([^\n]+)/i)
      const explanationMatch = text.match(/AÇIKLAMA:\s*([^\n]+)/i)
      const confidenceMatch = text.match(/GÜVEN:\s*(\d+)/i)

      return {
        success: true,
        crimeType: crimeTypeMatch ? crimeTypeMatch[1].trim() : null,
        explanation: explanationMatch ? explanationMatch[1].trim() : text,
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
        modelUsed: this.modelName // Hangi modelin kullanıldığını göster
      }
    } catch (error) {
      console.error('Gemini API Error:', error)
      
      // 404 hatası durumunda alternatif model dene
      if (error.message.includes('404') || error.message.includes('not found')) {
        console.log('🔄 Model bulunamadı, alternatif model deneniyor...')
        const fallbackSuccess = await this.tryAlternativeModel()
        
        if (fallbackSuccess) {
          console.log('✅ Alternatif model başarılı, tekrar deneniyor...')
          // Alternatif model ile tekrar dene
          try {
            const result = await this.model.generateContent(prompt)
            const response = await result.response
            const text = response.text()

            // Response'u parse et
            const crimeTypeMatch = text.match(/SUÇTUR:\s*([^\n]+)/i)
            const explanationMatch = text.match(/AÇIKLAMA:\s*([^\n]+)/i)
            const confidenceMatch = text.match(/GÜVEN:\s*(\d+)/i)

            return {
              success: true,
              crimeType: crimeTypeMatch ? crimeTypeMatch[1].trim() : null,
              explanation: explanationMatch ? explanationMatch[1].trim() : text,
              confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
              modelUsed: this.modelName
            }
          } catch (fallbackError) {
            console.error('Fallback model de başarısız:', fallbackError)
          }
        }
      }
      
      // Spesifik hata mesajları
      let errorMessage = 'AI analizi sırasında hata oluştu.'
      
      if (error.message.includes('404')) {
        errorMessage = 'Gemini 2.5 modelleri mevcut değil. API anahtarınızın Gemini 2.5\'e erişim yetkisi var mı kontrol edin.'
      } else if (error.message.includes('400')) {
        errorMessage = 'Geçersiz istek formatı. Gemini 2.5 API parametreleri kontrol edilmeli.'
      } else if (error.message.includes('403')) {
        errorMessage = 'API anahtarı geçersiz veya Gemini 2.5\'e erişim izni yok.'
      } else if (error.message.includes('429')) {
        errorMessage = 'Gemini API limiti aşıldı. Lütfen daha sonra tekrar deneyin.'
      }
      
      return {
        success: false,
        message: errorMessage + ' Denenen model: ' + this.modelName
      }
    }
  }

  // Hukuki analiz yap
  async analyzeLegalCase(formData, calculationResult) {
    if (!this.isConfigured()) {
      return {
        success: false,
        analysis: 'AI analizi için API anahtarı gerekli.'
      }
    }

    try {
      const prompt = `
      Türk Ceza ve İnfaz Hukuku uzmanı olarak aşağıdaki vaka hakkında analiz yap:

      VAKA BİLGİLERİ:
      - Suç Türü: ${calculationResult.sucTuru}
      - Ceza Süresi: ${formData.years || 0} yıl ${formData.months || 0} ay ${formData.days || 0} gün
      - Yaş: ${calculationResult.yas || 'Belirtilmemiş'}
      - Cinsiyet: ${calculationResult.cinsiyet || 'Belirtilmemiş'}
      - Özel Durumlar: ${calculationResult.ozelDurumlar?.join(', ') || 'Yok'}
      
      HESAPLAMA SONUCU:
      - İnfaz Oranı: %${calculationResult.infazOrani}
      - Koşullu Salıverilme: ${calculationResult.kosulluSaliverme}
      - Denetimli Serbestlik: ${calculationResult.denetimliSerbestlik}

      Lütfen şu konularda analiz yap:
      1. Hukuki Durum: Bu hesaplama doğru mu?
      2. Dikkat Edilecek Hususlar: Hangi özel durumlar var?
      3. Öneriler: İnfaz sürecinde nelere dikkat edilmeli?
      4. Alternatif Senaryolar: Hangi durumlar değişirse sonuç nasıl etkilenir?

      Cevabını teknik doğrulukta ama anlaşılır şekilde ver.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return {
        success: true,
        analysis: text
      }
    } catch (error) {
      console.error('Gemini Legal Analysis Error:', error)
      return {
        success: false,
        analysis: 'Hukuki analiz sırasında hata oluştu: ' + error.message
      }
    }
  }

  // Risk değerlendirmesi yap
  async assessRisks(formData) {
    if (!this.isConfigured()) {
      return {
        success: false,
        risks: []
      }
    }

    try {
      const prompt = `
      Aşağıdaki infaz vakası için risk değerlendirmesi yap:

      VAKA:
      - Yaş: ${formData.age || 'Belirtilmemiş'}
      - Cinsiyet: ${formData.gender || 'Belirtilmemiş'}  
      - Mükerrir: ${formData.isRecidivist ? 'Evet' : 'Hayır'}
      - Hamile: ${formData.isPregnant ? 'Evet' : 'Hayır'}
      - İyi Hal: ${formData.goodBehavior}

      Şu riskler açısından değerlendir:
      1. İnfaz Sürecinde Dikkat Edilecekler
      2. Koşullu Salıverilme Riskleri  
      3. Denetimli Serbestlik Koşulları
      4. Özel Durumlar

      Her risk için:
      - Risk Seviyesi: YÜKSEK/ORTA/DÜŞÜK
      - Açıklama: Kısa açıklama
      - Öneri: Yapılması gerekenler

      JSON formatında yanıtla:
      \`\`\`json
      {
        "risks": [
          {
            "category": "kategori",
            "level": "YÜKSEK/ORTA/DÜŞÜK", 
            "description": "açıklama",
            "recommendation": "öneri"
          }
        ]
      }
      \`\`\`
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // JSON çıkarma
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        const parsedRisks = JSON.parse(jsonMatch[1])
        return {
          success: true,
          risks: parsedRisks.risks || []
        }
      }

      return {
        success: false,
        risks: []
      }
    } catch (error) {
      console.error('Gemini Risk Assessment Error:', error)
      return {
        success: false,
        risks: []
      }
    }
  }

  // Alternatif senaryolar öner
  async suggestAlternativeScenarios(formData, currentResult) {
    if (!this.isConfigured()) {
      return {
        success: false,
        scenarios: []
      }
    }

    try {
      const prompt = `
      Mevcut infaz hesaplaması için alternatif senaryolar öner:

      MEVCUT DURUM:
      - Ceza: ${formData.years || 0} yıl ${formData.months || 0} ay ${formData.days || 0} gün
      - İnfaz Oranı: %${currentResult.infazOrani}
      - Koşullu Salıverilme: ${currentResult.kosulluSaliverme}

      Şu alternatifler için önerilerde bulun:
      1. İyi hal kaybederse ne olur?
      2. Mükerrir olsaydı ne olurdu?
      3. 18 yaş altı olsaydı ne olurdu?
      4. Farklı suç türü olsaydı nasıl etkilenirdi?

      JSON formatında yanıtla:
      \`\`\`json
      {
        "scenarios": [
          {
            "title": "Senaryo Başlığı",
            "description": "Ne değişiyor",
            "impact": "Sonuç nasıl değişir",
            "newRatio": "Yeni oran (%)"
          }
        ]
      }
      \`\`\`
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // JSON çıkarma
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        const parsedScenarios = JSON.parse(jsonMatch[1])
        return {
          success: true,
          scenarios: parsedScenarios.scenarios || []
        }
      }

      return {
        success: false,
        scenarios: []
      }
    } catch (error) {
      console.error('Gemini Scenarios Error:', error)
      return {
        success: false,
        scenarios: []
      }
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService()

// Helper functions
export const isGeminiConfigured = () => geminiService.isConfigured()
export const suggestCrimeType = (description) => geminiService.suggestCrimeType(description)
export const analyzeLegalCase = (formData, result) => geminiService.analyzeLegalCase(formData, result)
export const assessRisks = (formData) => geminiService.assessRisks(formData)
export const suggestAlternativeScenarios = (formData, result) => geminiService.suggestAlternativeScenarios(formData, result)