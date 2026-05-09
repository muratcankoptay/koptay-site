import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Calculator, Home, ChevronRight, Info, AlertTriangle, FileText,
  Scale, CheckCircle, RefreshCw, ChevronDown, BookOpen, Calendar,
  ListChecks, Gavel, ArrowLeft
} from 'lucide-react'
import SEO from '../components/SEO'
import HesaplamaDisclaimer from '../components/HesaplamaDisclaimer'
import motor, {
  SUC_KATEGORILERI, MUEBBET_KS_YIL, AZAMI_KS_YIL,
  hesapla, muebbetHesapla, validateInput, formatYilAyGun, gunuYilAyGuneCevir
} from '../utils/infazHesapMotoru'

// ============ SAYFA İÇİ İÇERİK BLOKLARI (SEO için) ============

const SSS_LISTESI = [
  {
    soru: 'İnfaz yatar hesaplama nedir?',
    cevap: 'İnfaz yatar hesaplama, kesinleşmiş bir hapis cezasının ne kadar süreyle kapalı ceza infaz kurumunda, ne kadar süreyle açık ceza infaz kurumunda ve ne kadar süreyle denetimli serbestlik tedbiri altında geçirileceğini, ayrıca koşullu salıverme ve hak ederek tahliye tarihlerini gösteren hesaptır. Hesap, 5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazına Dair Kanun temelinde yapılır.',
  },
  {
    soru: 'Koşullu salıverme oranı nasıl belirlenir?',
    cevap: '5275 SK 107/2 gereği genel kural toplam cezanın 1/2\'sidir. Ancak kasten öldürme, neticesi sebebiyle ağırlaşmış yaralama, işkence, cinsel saldırı/taciz, özel hayata karşı suçlar, devlet sırlarına karşı suçlar gibi 107/2 istisnaları için 2/3; örgüt suçları (107/4) için 2/3; tekerrür halinde (108/1) 2/3; nitelikli cinsel saldırı, çocukların cinsel istismarı, uyuşturucu imal/ticareti (108/9) için 3/4; terör suçları (3713 SK 17) için 3/4 oranı uygulanır.',
  },
  {
    soru: 'Denetimli serbestlik süresi ne kadardır?',
    cevap: '5275 SK 105/A maddesi gereği genel kural koşullu salıverme tarihine 1 yıl veya daha az süre kalmış olmaktır. 0-6 yaş arası çocuğu olan kadın hükümlüler için 2 yıl, ağır hastalık veya engellilik nedeniyle hayatını yalnız idame ettiremeyenler için 3 yıl önceden denetime ayrılma mümkündür. 30/03/2020 öncesi işlenen ve istisna olmayan suçlarda 7242 SK Geçici 6/1 ile 3 yıl, 31/07/2023 itibariyle kapalıda bulunan istisna olmayan hükümlüler için 7456 SK Geçici 10/6 ile ek 3 yıl daha erken denetim hakkı bulunmaktadır.',
  },
  {
    soru: 'Hangi suçlar koşullu salıverme dışında kalır?',
    cevap: '5275 SK ve diğer mevzuat gereği şu hallerde koşullu salıverme uygulanmaz: ikinci kez mükerrirler (108/3), koşullu salıverilmesi geri alınanlar (107/13), disiplin hapsi hükümlüleri, 01/03/2008 sonrası adli para cezasından çevrilen hapis (106/9), TCK 2. kitap 4. kısım 4-5-6. bölümlerde yer alan suçlardan ağırlaştırılmış müebbet hapis cezasına mahkum olanlar (107/16).',
  },
  {
    soru: 'Müebbet hapis cezasında ne kadar yatılır?',
    cevap: '5275 SK 107/2 gereği müebbet hapis cezasında koşullu salıverme süresi 24 yıl, ağırlaştırılmış müebbet hapis cezasında 30 yıldır. Örgüt suçları (107/4) ve terör suçları (3713 SK 17) için bu süreler sırasıyla 30 ve 36 yıla yükselir. TCK 2. kitap 4. kısım 4, 5 ve 6. bölümlerde yer alan suçlardan ağırlaştırılmış müebbet hapis cezasına mahkum olanlar hakkında ise koşullu salıverme uygulanmaz.',
  },
  {
    soru: 'Açık ceza infaz kurumuna ne zaman ayrılınır?',
    cevap: 'Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği gereği: toplam ceza 10 yıldan az ise hükümlü cezasının 1/10\'unu, 10 yıl ve üzeri ise 1/3\'ünü kapalı ceza infaz kurumunda geçirmek zorundadır. Toplam ceza kasten işlenen suçlarda 3 yıl, taksirli suçlarda 5 yıldan fazla değilse hükümlü doğrudan açık ceza infaz kurumuna alınır. Adli para cezasından çevrili hapis ve İİK kaynaklı tazyik hapislerinde de doğrudan açık infaz uygulanır.',
  },
  {
    soru: 'Mahsup nedir, nasıl uygulanır?',
    cevap: 'TCK 63 gereği tutuklulukta, gözaltında, gözlem altında ve adli kontrol kapsamındaki konutu terk etmeme yükümlülüğünde geçirilen süreler hapis cezasından mahsup edilir (konutu terk etmeme süresinin yarısı sayılır). Mahsup, koşullu salıverme süresini ve hak ederek tahliye tarihini geriye çeker.',
  },
  {
    soru: 'Çocuk hükümlülerde mahsup farklı mıdır?',
    cevap: 'Evet. 5275 SK 107/5 gereği hükümlünün 15 yaşını dolduruncaya kadar ceza infaz kurumunda geçirdiği bir günü iki gün sayılır. 7242 SK ile eklenen Geçici 6/4 maddesi gereği 30/03/2020 tarihine kadar işlenen suçlarda 15 yaşa kadar 1 gün üç gün, 18 yaşa kadar 1 gün iki gün olarak mahsup edilir. Ayrıca suç tarihinde çocuk olan hükümlülere 108/9 ve 3713 SK 17 kapsamında 3/4 oranı yerine 2/3 oranı uygulanır.',
  },
  {
    soru: '01/06/2005 öncesi işlenen suçlarda ne uygulanır?',
    cevap: 'TCK 7/3 lehe uygulama ilkesi gereği koşullu salıverme oranları bakımından lehe olan 647 sayılı (mülga) İnfaz Kanunu hükümleri uygulanır. Genel kural toplam cezanın 1/2\'sidir; ayrıca 647 SK Ek 2. madde uyarınca bakiye gün sayısından her ay için 6 gün ek indirim yapılır. Terör suçlarında ise 3/4 oranı uygulanır ve Ek 2 indirimi yapılmaz.',
  },
  {
    soru: 'Tekerrür halinde infaz nasıl hesaplanır?',
    cevap: '5275 SK 108/1 gereği tekerrür halinde koşullu salıvermeye esas süre toplam cezanın 2/3\'üdür. Ne var ki tekerrür halinde koşullu salıverme süresine eklenecek miktar, tekerrüre esas alınan cezaların en ağırından fazla olamaz. İkinci kez mükerrirler hakkında ise koşullu salıverme hükümleri uygulanmaz (108/3).',
  },
  {
    soru: 'Hapis cezasının ertelenmesi mümkün müdür?',
    cevap: 'Evet. 5275 SK 17. madde gereği isteme bağlı erteleme için: infazı gereken toplam cezanın kasıtlı suçlarda 3 yıl, taksirli suçlarda 5 yıldan fazla olmaması; suçun terör, örgüt, cinsel dokunulmazlık, tekerrürlü, adli para, disiplin/tazyik hapsi olmaması; hükümlünün 10 günlük çağrı süresi içinde savcılığa başvurmuş olması gerekir. Erteleme süresi en fazla 1 yıl + 1 yıl, en fazla iki parça halindedir.',
  },
  {
    soru: 'Hastalık nedeniyle erteleme şartları nelerdir?',
    cevap: '5275 SK 16. madde gereği akıl hastalığı (16/1), hayatı için kesin tehlike teşkil eden fiziki hastalık (16/2), toplum bakımından ağır ve somut tehlike oluşturmayan ve ağır hastalık veya engellilik nedeniyle hayatını yalnız idame ettiremeyenler (16/6) hakkında erteleme kararı verilebilir. Karar Adalet Bakanlığınca belirlenen tam teşekküllü hastane sağlık kurullarının ve ATK\'nın raporu üzerine verilir; süre raporda aksi yoksa 1 yıldır. Ağırlaştırılmış müebbet hapis cezasının infazında uygulanmaz (25/1-ı).',
  },
  {
    soru: 'Çağrı kağıdı mı, yakalama emri mi çıkarılır?',
    cevap: '5275 SK 19. madde gereği infazı gereken toplam ceza kasten işlenen suçlarda 3 yıl, taksirli suçlarda 5 yıldan fazla değilse çağrı kağıdı çıkarılır; bu sınırın üstünde ise yakalama emri çıkarılır. Çağrı kağıdı tebliğinden itibaren hükümlüye 10 günlük teslim olma süresi tanınır.',
  },
  {
    soru: 'Adli para cezasından çevrili hapis cezası nasıl infaz edilir?',
    cevap: '5275 SK 106. madde gereği adli para cezasının ödenmemesi halinde hükümlü hakkında önce kamuya yararlı işte çalıştırma (KYİÇ) — 1 gün hapis = 2 saat çalışma — kararı verilir. Çalışma yükümlülüğü ihlal edilirse para cezası hapse çevrilir. 01/03/2008 tarihinden sonra işlenen suçlarda 5275 SK 106/9 gereği bu hapis cezalarında koşullu salıverme uygulanmaz; hükümlü hak ederek tahliye tarihine kadar açık ceza infaz kurumunda cezasını çeker.',
  },
  {
    soru: '7242 sayılı Kanun (Geçici 6) avantajı kimler için geçerlidir?',
    cevap: '7242 SK ile eklenen 5275 SK Geçici 6. madde, 30/03/2020 tarihine kadar işlenen ve maddede sayılan istisna suçlar (kasten öldürme, cinsel dokunulmazlık, terör, örgüt, uyuşturucu imal/ticareti vb.) hariç olmak üzere, koşullu salıverilmesine 3 yıl veya daha az süre kalan hükümlülere denetimli serbestlik yolunu açtı. Ayrıca 15 yaşa kadar 1 gün=3 gün, 18 yaşa kadar 1 gün=2 gün şeklinde çocuk mahsubu avantajı getirildi.',
  },
  {
    soru: '7456 sayılı Kanun (Geçici 10) hangi avantajları sağlar?',
    cevap: '7456 SK ile eklenen Geçici 10. madde 31 Temmuz 2023 tarihini kriter alır. Bu tarihte kapalı ceza infaz kurumunda bulunan ve istisna suçlar (TCK 302-339, terör, örgüt, koşullu salıvermesi geri alınanlar, ikinci kez mükerrirler) kapsamında olmayan hükümlüler 10 yıldan az ceza için 1 ay, 10 yıl ve üzeri için 3 ay kapalıda kalmak şartıyla 3 yıl erken açığa ayrılır ve 3 yıl erken denetimli serbestliğe geçer.',
  },
  {
    soru: 'Koşullu salıverme nasıl geri alınır?',
    cevap: '5275 SK 107/12-13 gereği koşullu salıverilen hükümlü denetim süresinde hapis cezasını gerektiren kasıtlı bir suç işlerse, sonraki suç tarihinden başlayıp hak ederek tahliye tarihini geçmemek üzere, sonradan işlediği her bir suç için verilen hapis cezasının iki katı süreyle koşullu salıverme geri alınır (107/12-13a). Koşullu salıverme yükümlülüklerine aykırılık halinde ise uymama tarihi ile hak ederek tahliye tarihi arasındaki süreyi geçmemek üzere takdir edilen bir süreyle geri alınır (107/12-13b).',
  },
  {
    soru: 'Disiplin hapislerinin (tazyik, hapsen tazyik, disiplin hapsi) infazı farklı mıdır?',
    cevap: 'Evet. Disiplin hapsi türleri için koşullu salıverilme uygulanmaz, denetimli serbestlik uygulanmaz, ertelenmez, tekerrür hükümleri uygulanmaz ve adli sicil kaydına geçirilmez. İcra İflas Kanunu kaynaklı tazyik hapisleri dışındaki disiplin hapisleri kapalı ceza infaz kurumunda infaz edilir. İİK\'daki tazyik ve hapsen tazyik için ceza zamanaşımı 2 yıl (İİK 354/2), diğer disiplin hapislerinde 10 yıldır (TCK 68/1-e).',
  },
  {
    soru: 'Hangi suçlarda hükümlü daima kapalıda kalır?',
    cevap: 'Açığa Ayrılma Yönetmeliği 8. madde gereği ağırlaştırılmış müebbet hapis cezasına mahkum olanlar, ikinci defa tekerrür hükmü uygulananlar, beş ve daha fazla hücreye koyma cezası alanlar, koşullu salıvermeleri geri alınanlar, kapalıdan bir kez veya açıktan iki kez firar edenler, İİK dışında tazyik/disiplin/zorlama hapsi alanlar hiçbir şekilde açığa ayrılamayıp cezalarının tamamını kapalı ceza infaz kurumunda çekerler.',
  },
  {
    soru: 'İçtima (toplama) nedir?',
    cevap: 'Bir kişi hakkında başka başka kesinleşmiş hükümler bulunması halinde, koşullu salıverme hükümlerinin uygulanabilmesi için mahkemeden bir toplama kararı istenir. Toplanması gereken cezalar: aynı hükümlü hakkında kesinleşmiş hapis cezaları ve ceza infaz kurumunda infaz edilme aşamasına gelmiş adli para cezalarıdır (5275 SK 99). Yetkili mahkeme en fazla cezayı veren mahkemenin yer infaz hakimliğidir; birden fazla hüküm varsa son hükmü vermiş mahkeme yer infaz hakimliği yetkilidir (5275 SK 101/2).',
  },
  {
    soru: 'Hükümlü hangi durumlarda denetim hakkını kaybeder?',
    cevap: '5275 SK 105/A-6 gereği hükümlü ceza infaz kurumundan ayrıldıktan sonra talebinde belirttiği denetimli serbestlik müdürlüğüne 5 gün içinde başvurmazsa, denetim planına uymakta ısrar ederse (birinci ihlal, uyarı tebliği, ikinci ihlal) veya ceza infaz kurumuna geri dönmeyi talep ederse infaz hakimliği kararıyla açık ceza infaz kurumuna geri gönderilir. Ayrıca denetim sonrası alt sınırı bir yıl veya daha fazla hapis cezasını gerektiren kasıtlı bir suçtan kamu davası açılırsa infaz hakimi takdiren kapalıya gönderme kararı verebilir.',
  },
  {
    soru: 'Müddetname nedir, hangi unsurları içerir?',
    cevap: '5275 SK 20/4 gereği müddetname (süre belgesi), hükümlünün infaz sürecini gösteren resmi belgedir. Şu unsurları içermelidir: hükümlünün kimlik ve adres bilgileri, toplam ceza miktarı, her bir cezanın infaz rejimi ve koşulluya esas indirim oranları, mahsup bilgileri, infaza başlama tarihi, hak ederek salıverme tarihi, koşullu salıverme tarihi ve gerekli açıklamalar. Hatalı düzenlenmiş bir müddetname kazanılmış hak oluşturmaz.',
  },
  {
    soru: 'Bu hesaplama aracı resmi midir?',
    cevap: 'Hayır. Bu araç 5275 sayılı Kanun ve ilgili mevzuat hükümlerine göre yaklaşık bir hesaplama yapar; bilgilendirme amaçlıdır ve hukuki görüş niteliği taşımaz. Resmi süre belgesi yalnızca müddetname olup, hükümlünün gerçek koşullu salıverme ve tahliye tarihleri ilgili Cumhuriyet Başsavcılığı tarafından düzenlenir, infaz hakimliğince denetlenir. Somut olaya özgü hesaplama için bir avukata danışmanız önerilir.',
  },
  {
    soru: 'Hesaplama hangi mevzuata göre yapılıyor?',
    cevap: 'Bu hesaplama aracı şu mevzuat kaynaklarına dayanmaktadır: 5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazına Dair Kanun, 647 sayılı (mülga) Cezaların İnfazı Hakkında Kanun (01/06/2005 öncesi suçlarda lehe uygulama), 5402 sayılı Denetimli Serbestlik Hizmetleri Kanunu, 4675 sayılı İnfaz Hakimliği Kanunu, 3713 sayılı Terörle Mücadele Kanunu, 7242 sayılı Kanun (Geçici 6), 7456 sayılı Kanun (Geçici 10), Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği, Denetimli Serbestlik Hizmetleri Yönetmeliği.',
  },
  {
    soru: 'Karma cezalarda (birden fazla suç) hesap nasıl yapılır?',
    cevap: 'Birden fazla suçtan kesinleşmiş hüküm bulunduğunda her bir ceza için suç türüne uygun koşullu salıverme oranı ayrı ayrı uygulanır, sonuçlar toplanır ve toplam mahsup düşülür. Örneğin 3 yıl hırsızlık (1/2 → 547 gün) + 2 yıl cinsel taciz (2/3 → 486 gün) = 1033 gün koşullu salıvermeye esas süre. Bu hesaplama aracı tek bir kategori seçtirdiğinden karma cezalarda baskın olan kategoriyi seçmeniz veya her ceza için ayrı hesap yapmanız önerilir.',
  },
];

const SUC_TURU_TABLOSU = [
  { oran: '1/2',  suclar: 'Genel suçlar (özel istisna kapsamında olmayan tüm suçlar)', dayanak: '5275 SK 107/2' },
  { oran: '2/3',  suclar: 'Kasten öldürme (TCK 81-83), neticesi sebebiyle ağırlaşmış yaralama (TCK 87/2-d), işkence/eziyet (TCK 94-96), cinsel saldırı (basit), reşit olmayanla cinsel ilişki (basit), cinsel taciz (TCK 105), özel hayata karşı suçlar (TCK 132-138), devlet sırlarına karşı suçlar (TCK 326-339)', dayanak: '5275 SK 107/2' },
  { oran: '2/3',  suclar: 'Suç işlemek için örgüt kurmak/yönetmek/üye olmak/örgüt faaliyeti kapsamında işlenen suçlar', dayanak: '5275 SK 107/4' },
  { oran: '2/3',  suclar: 'Tekerrür hükümleri uygulanan suçlar', dayanak: '5275 SK 108/1' },
  { oran: '3/4',  suclar: 'Nitelikli cinsel saldırı (TCK 102/2), çocukların cinsel istismarı (TCK 103), reşit olmayanla cinsel ilişki nitelikli (TCK 104/2-3), uyuşturucu/uyarıcı madde imal ve ticareti (TCK 188)', dayanak: '5275 SK 108/9' },
  { oran: '3/4',  suclar: 'Terörle Mücadele Kanunu kapsamına giren suçlar', dayanak: '3713 SK 17' },
];

// ============ FORMÜL: ANA SAYFA BİLEŞENİ ============

const InfazYatarPage = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  // form modu
  const [mod, setMod] = useState('sureli') // 'sureli' veya 'muebbet'

  // süreli hapis için form
  const [form, setForm] = useState({
    cezaYil: 0, cezaAy: 0, cezaGun: 0,
    sucTarihi: '',
    sucKategoriKodu: 'genel',
    taksirliMi: false,
    dogumTarihi: '',
    tutukluGun: 0,
    cezaevineGirisTarihi: '',
    ozelDurum: 'normal',
    gecici10Uygula: false,
    lehe647Uygula: true,
  })

  // müebbet için form
  const [muebbetForm, setMuebbetForm] = useState({
    muebbetTuru: 'muebbet',
    sucKategoriKodu: 'genel',
    cezaevineGirisTarihi: '',
    tutukluGun: 0,
  })

  const [sonuc, setSonuc] = useState(null)
  const [hatalar, setHatalar] = useState([])
  const [acikSss, setAcikSss] = useState(null)

  const handleHesapla = () => {
    if (mod === 'sureli') {
      const errs = validateInput(form)
      setHatalar(errs)
      if (errs.length === 0) {
        setSonuc({ tip: 'sureli', data: hesapla(form) })
      } else {
        setSonuc(null)
      }
    } else {
      setSonuc({ tip: 'muebbet', data: muebbetHesapla(muebbetForm) })
      setHatalar([])
    }
    setTimeout(() => {
      const el = document.getElementById('sonuc-bolumu')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleSifirla = () => {
    setForm({
      cezaYil: 0, cezaAy: 0, cezaGun: 0,
      sucTarihi: '', sucKategoriKodu: 'genel', taksirliMi: false,
      dogumTarihi: '', tutukluGun: 0, cezaevineGirisTarihi: '',
      ozelDurum: 'normal', gecici10Uygula: false, lehe647Uygula: true,
    })
    setMuebbetForm({ muebbetTuru: 'muebbet', sucKategoriKodu: 'genel', cezaevineGirisTarihi: '', tutukluGun: 0 })
    setSonuc(null)
    setHatalar([])
  }

  // ============ JSON-LD STRUCTURED DATA ============
  const jsonLd = useMemo(() => {
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://koptay.av.tr/' },
        { '@type': 'ListItem', position: 2, name: 'Hesaplama Araçları', item: 'https://koptay.av.tr/hesaplama-araclari' },
        { '@type': 'ListItem', position: 3, name: 'İnfaz Yatar Hesaplama', item: 'https://koptay.av.tr/hesaplama-araclari/infaz-yatar' },
      ],
    }
    const howTo = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'İnfaz Yatar Hesaplama Nasıl Yapılır?',
      description: '5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazına Dair Kanun\'a göre koşullu salıverme, denetimli serbestlik ve açık ceza infaz kurumu sürelerinin hesaplanması.',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Toplam ceza miktarını belirleyin', text: 'Hükmedilen hapis cezasının toplam yıl, ay ve gün miktarı tespit edilir. Birden fazla hüküm varsa içtima (toplama) sonrası toplam ceza esas alınır.' },
        { '@type': 'HowToStep', position: 2, name: 'Suç türüne göre koşullu salıverme oranını uygulayın', text: 'Suç türüne göre 1/2 (genel), 2/3 (107/2 istisnaları, örgüt, tekerrür) veya 3/4 (108/9, terör) oranı uygulanarak koşullu salıvermeye esas süre bulunur.' },
        { '@type': 'HowToStep', position: 3, name: 'Mahsupları düşün', text: 'TCK 63 gereği tutukluluk, gözaltı ve adli kontrol süreleri hesaptan düşülür. 18 yaş altı hükümlüler için 5275 SK 107/5 ve Geçici 6/4 ek mahsup avantajı sağlar.' },
        { '@type': 'HowToStep', position: 4, name: 'Denetimli serbestlik süresini ayırın', text: '5275 SK 105/A gereği koşullu salıverme tarihine 1 yıl kala denetimli serbestlik tedbiri başlar. Geçici 6/1 ve Geçici 10/6 hükümlerine göre bu süre 3 veya 6 yıla kadar uzayabilir.' },
        { '@type': 'HowToStep', position: 5, name: 'Açığa ayrılma süresini hesaplayın', text: 'Toplam ceza 10 yıldan az ise cezanın 1/10\'u, 10 yıl ve üzeri ise 1/3\'ü kapalı ceza infaz kurumunda geçirilir. ≤3 yıl kasten / ≤5 yıl taksirli cezalarda doğrudan açık infaz uygulanır.' },
      ],
    }
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: SSS_LISTESI.map(s => ({
        '@type': 'Question', name: s.soru,
        acceptedAnswer: { '@type': 'Answer', text: s.cevap },
      })),
    }
    return [breadcrumb, howTo, faq]
  }, [])

  return (
    <>
      <SEO
        title="İnfaz Yatar Hesaplama 2026 — Koşullu Salıverme & Denetimli Serbestlik | Koptay Hukuk"
        description="5275 sayılı Kanun'a göre güncel infaz yatar hesaplama. Koşullu salıverme tarihi, denetimli serbestlik, açık ceza infaz kurumu süreleri. Süreli hapis, müebbet, çocuk hükümlü, 7242 ve 7456 SK Geçici 6 ve 10 avantajları dahil 2026 hesabı."
        url="https://koptay.av.tr/hesaplama-araclari/infaz-yatar"
        preloadImage={false}
      />
      <Helmet>
        {jsonLd.map((ld, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
        ))}
      </Helmet>

      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-3 border-b border-gray-200" aria-label="Breadcrumb">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <li><Link to="/" className="hover:text-lawPrimary inline-flex items-center gap-1"><Home className="w-4 h-4" />Ana Sayfa</Link></li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li><Link to="/hesaplama-araclari" className="hover:text-lawPrimary">Hesaplama Araçları</Link></li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li className="text-gray-900 font-medium">İnfaz Yatar Hesaplama</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-lawDark to-lawPrimary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm mb-4">
              <Calculator className="w-4 h-4" /> 2026 Güncel Hesaplama Aracı
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              İnfaz Yatar Hesaplama
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazına Dair Kanun ve ilgili mevzuat
              uyarınca koşullu salıverme tarihi, denetimli serbestlik süresi, açık ceza infaz
              kurumuna ayrılma tarihi ve hak ederek tahliye tarihi hesaplaması.
            </p>
          </div>
        </div>
      </section>

      {/* Hesaplama Aracı */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Mod Seçici */}
            <div className="flex border-b">
              <button onClick={() => setMod('sureli')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${mod === 'sureli' ? 'bg-lawPrimary text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                Süreli Hapis Cezası
              </button>
              <button onClick={() => setMod('muebbet')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${mod === 'muebbet' ? 'bg-lawPrimary text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                Müebbet / Ağırlaştırılmış Müebbet
              </button>
            </div>

            <div className="p-6 md:p-8">
              {mod === 'sureli' ? (
                <SureliForm form={form} setForm={setForm} hatalar={hatalar} />
              ) : (
                <MuebbetForm form={muebbetForm} setForm={setMuebbetForm} />
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button onClick={handleHesapla}
                  className="flex-1 bg-lawPrimary hover:bg-lawSecondary text-white py-3 px-6 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
                  <Calculator className="w-5 h-5" /> Hesapla
                </button>
                <button onClick={handleSifirla}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Sıfırla
                </button>
              </div>
            </div>
          </div>

          {/* Sonuç */}
          {sonuc && (
            <div id="sonuc-bolumu" className="mt-8 scroll-mt-20">
              {sonuc.tip === 'sureli' ? <SureliSonuc data={sonuc.data} /> : <MuebbetSonuc data={sonuc.data} />}
            </div>
          )}
        </div>
      </section>

      {/* Suç Türleri ve Oranlar Tablosu */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-lawDark mb-2 flex items-center gap-2">
            <Scale className="w-7 h-7 text-lawPrimary" /> Suç Türlerine Göre Koşullu Salıverme Oranları
          </h2>
          <p className="text-gray-600 mb-6">
            5275 sayılı Kanun ve ilgili mevzuat uyarınca uygulanan koşullu salıvermeye esas oranlar.
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-lawDark text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold w-24">Oran</th>
                  <th className="px-4 py-3 font-semibold">Suç Türleri</th>
                  <th className="px-4 py-3 font-semibold w-40">Mevzuat Dayanağı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {SUC_TURU_TABLOSU.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-bold text-lawPrimary text-lg">{row.oran}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.suclar}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{row.dayanak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-primary-50 border-l-4 border-primary-500 p-4 rounded text-sm text-primary-900">
            <strong>Önemli:</strong> Suç tarihinde 18 yaşından küçük hükümlülere 3/4 oranı yerine 2/3 oranı uygulanır.
            5275 SK 108/9 kapsamındaki suçlar 28/06/2014 öncesinde işlenmişse 3/4 yerine 2/3 oranı geçerlidir.
            01/06/2005 öncesi işlenen suçlarda TCK 7/3 lehe uygulama ilkesi gereği 647 sayılı (mülga) Kanun hükümleri uygulanır.
          </div>
        </div>
      </section>

      {/* Müebbet Süreleri Tablosu */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-lawDark mb-2 flex items-center gap-2">
            <Gavel className="w-7 h-7 text-lawPrimary" /> Müebbet Hapis Cezalarında Koşullu Salıverme Süreleri
          </h2>
          <p className="text-gray-600 mb-6">5275 sayılı Kanun 107/2, 107/4 ve 3713 SK 17. madde uyarınca.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <h3 className="font-bold text-lg text-lawDark mb-3">Genel Hükümlüler (107/2)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2"><span>Müebbet hapis</span><span className="font-bold text-lawPrimary">{MUEBBET_KS_YIL.GENEL.muebbet} yıl</span></div>
                <div className="flex justify-between"><span>Ağırlaştırılmış müebbet</span><span className="font-bold text-lawPrimary">{MUEBBET_KS_YIL.GENEL.agirlastirilmis} yıl</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <h3 className="font-bold text-lg text-lawDark mb-3">Örgüt / Terör Suçları (107/4 — 3713/17)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2"><span>Müebbet hapis</span><span className="font-bold text-lawPrimary">{MUEBBET_KS_YIL.ORGUT_TEROR.muebbet} yıl</span></div>
                <div className="flex justify-between"><span>Ağırlaştırılmış müebbet</span><span className="font-bold text-lawPrimary">{MUEBBET_KS_YIL.ORGUT_TEROR.agirlastirilmis} yıl</span></div>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-sm text-amber-900">
            <strong>Dikkat:</strong> 5275 SK 107/16 gereği TCK 2. kitap 4. kısım 4, 5 ve 6. bölümlerde
            yer alan suçlardan ağırlaştırılmış müebbet hapis cezasına mahkum olanlar hakkında koşullu
            salıverme uygulanmaz.
          </div>
        </div>
      </section>

      {/* Mevzuat Dayanakları */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-lawDark mb-6 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-lawPrimary" /> Hesaplamada Esas Alınan Mevzuat
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { kod: '5275 sayılı Kanun', baslik: 'Ceza ve Güvenlik Tedbirlerinin İnfazına Dair Kanun', ozet: 'İnfaz hukukunun temel kanunu. Koşullu salıverme (107), denetimli serbestlik (105/A), açığa ayrılma, içtima (99) gibi tüm temel kuralları içerir.' },
              { kod: '647 sayılı (Mülga) Kanun', baslik: 'Cezaların İnfazı Hakkında Kanun', ozet: '01/06/2005 öncesi işlenen suçlarda TCK 7/3 lehe uygulama ilkesi gereği uygulanır. 1/2 oranı + ayda 6 gün ek indirim sağlar.' },
              { kod: '3713 sayılı Kanun', baslik: 'Terörle Mücadele Kanunu', ozet: 'Terör suçları için 3/4 koşullu salıverme oranı (m.17). Müebbette 30 yıl, ağırlaştırılmış müebbette 36 yıl.' },
              { kod: '5402 sayılı Kanun', baslik: 'Denetimli Serbestlik Hizmetleri Kanunu', ozet: 'Denetim altında infaz, yükümlülük türleri ve denetimli serbestlik müdürlüklerinin görev alanı.' },
              { kod: '4675 sayılı Kanun', baslik: 'İnfaz Hakimliği Kanunu', ozet: 'Koşullu salıverme kararları, denetim kararları ve infaz işlemlerine ilişkin şikayetlerin karara bağlanması.' },
              { kod: '7242 sayılı Kanun', baslik: '5275 SK Geçici 6. Madde', ozet: '30/03/2020 milat. İstisna olmayan suçlarda KS\'ye 3 yıl kala denetim. 15 yaş altı 1=3, 18 yaş altı 1=2 çocuk mahsubu.' },
              { kod: '7456 sayılı Kanun', baslik: '5275 SK Geçici 10. Madde', ozet: '31/07/2023 kriter tarihi. Kapalıda olup istisna olmayan hükümlüler için 3 yıl erken açığa + 3 yıl erken denetim.' },
              { kod: 'Yönetmelik', baslik: 'Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği', ozet: 'Toplam ceza <10 yıl ise 1/10\'u, ≥10 yıl ise 1/3\'ü kapalıda. ≤3 yıl kasten / ≤5 yıl taksirli direkt açık.' },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <div className="text-xs font-mono text-lawPrimary font-semibold mb-1">{item.kod}</div>
                <h3 className="font-bold text-lawDark mb-2">{item.baslik}</h3>
                <p className="text-sm text-gray-600">{item.ozet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-lawDark mb-2 flex items-center gap-2">
            <ListChecks className="w-7 h-7 text-lawPrimary" /> Sıkça Sorulan Sorular
          </h2>
          <p className="text-gray-600 mb-6">İnfaz hukuku ve infaz yatar hesaplamaya ilişkin temel sorular ve mevzuata dayalı cevapları.</p>
          <div className="space-y-2">
            {SSS_LISTESI.map((item, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button onClick={() => setAcikSss(acikSss === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-lawDark pr-4">{item.soru}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${acikSss === i ? 'rotate-180' : ''}`} />
                </button>
                {acikSss === i && (
                  <div className="px-5 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
                    {item.cevap}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sorumluluk Reddi */}
      <HesaplamaDisclaimer
        aracAdi="infaz yatar hesaplama aracı"
        mevzuat="5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazına Dair Kanun"
        ekNotlar={[
          'Resmi süre belgesi yalnızca müddetnamedir. Gerçek koşullu salıverme ve tahliye tarihleri ilgili Cumhuriyet Başsavcılığı tarafından düzenlenir, infaz hakimliğince denetlenir.',
          'Karma cezalarda her bir suç için ayrı ayrı oran uygulanması gerektiğinden bu araç tek bir kategori seçtirir; uygulamada içtima sonrası her ceza ayrı hesaplanır.',
        ]}
      />

      {/* Diğer Araçlar */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-serif font-bold text-lawDark mb-6">İlgili Hesaplama Araçları</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/hesaplama-araclari/dava-suresi" className="block p-5 border border-gray-200 rounded-lg hover:border-lawPrimary hover:shadow-md transition-all">
              <Calendar className="w-8 h-8 text-lawPrimary mb-2" />
              <h3 className="font-bold text-lawDark mb-1">Dava Süresi & Zamanaşımı</h3>
              <p className="text-sm text-gray-600">Dava açma süreleri ve zamanaşımı hesaplama</p>
            </Link>
            <Link to="/hesaplama-araclari" className="block p-5 border border-gray-200 rounded-lg hover:border-lawPrimary hover:shadow-md transition-all">
              <Calculator className="w-8 h-8 text-lawPrimary mb-2" />
              <h3 className="font-bold text-lawDark mb-1">Tüm Hesaplama Araçları</h3>
              <p className="text-sm text-gray-600">Hukuki hesaplama araçlarının tamamı</p>
            </Link>
            <Link to="/makaleler" className="block p-5 border border-gray-200 rounded-lg hover:border-lawPrimary hover:shadow-md transition-all">
              <FileText className="w-8 h-8 text-lawPrimary mb-2" />
              <h3 className="font-bold text-lawDark mb-1">Makaleler</h3>
              <p className="text-sm text-gray-600">Hukuk alanında bilgilendirici yazılar</p>
            </Link>
          </div>
          <div className="mt-8 text-center">
            <Link to="/hesaplama-araclari" className="inline-flex items-center gap-2 text-lawPrimary hover:text-lawSecondary font-medium">
              <ArrowLeft className="w-4 h-4" /> Hesaplama Araçlarına Dön
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// ============ FORM BİLEŞENLERİ ============

const SureliForm = ({ form, setForm, hatalar }) => {
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="space-y-5">
      {/* Ceza miktarı */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hapis Cezası Miktarı</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { k: 'cezaYil', l: 'Yıl' },
            { k: 'cezaAy', l: 'Ay' },
            { k: 'cezaGun', l: 'Gün' },
          ].map(({ k, l }) => (
            <div key={k}>
              <input type="number" min="0" value={form[k]} onChange={e => upd(k, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent" />
              <span className="text-xs text-gray-500 mt-1 block">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suç türü */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Suç Türü (Koşullu Salıverme Oranını Belirler)</label>
        <select value={form.sucKategoriKodu} onChange={e => upd('sucKategoriKodu', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary">
          {SUC_KATEGORILERI.map(k => (
            <option key={k.kod} value={k.kod}>{k.label} — {k.oran === 1/2 ? '1/2' : k.oran === 2/3 ? '2/3' : '3/4'}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Suç Tarihi *</label>
          <input type="date" value={form.sucTarihi} onChange={e => upd('sucTarihi', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cezaevine Giriş Tarihi (opsiyonel)</label>
          <input type="date" value={form.cezaevineGirisTarihi} onChange={e => upd('cezaevineGirisTarihi', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi (çocuk mahsubu için)</label>
          <input type="date" value={form.dogumTarihi} onChange={e => upd('dogumTarihi', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tutukluluk + Gözaltı (gün)</label>
          <input type="number" min="0" value={form.tutukluGun} onChange={e => upd('tutukluGun', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Özel Durum (denetimli serbestlik için)</label>
        <select value={form.ozelDurum} onChange={e => upd('ozelDurum', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary">
          <option value="normal">Normal hükümlü</option>
          <option value="kadin_0_6_cocuk">0-6 yaş çocuğu olan kadın hükümlü (KS\'ye 2 yıl kala denetim)</option>
          <option value="agir_hastalik">Ağır hastalık / engellilik (KS\'ye 3 yıl kala denetim)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={form.taksirliMi} onChange={e => upd('taksirliMi', e.target.checked)}
            className="mt-1 rounded text-lawPrimary focus:ring-lawPrimary" />
          <span className="text-sm text-gray-700"><strong>Taksirli suç</strong> (5 yıla kadar direkt açık infaz)</span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={form.gecici10Uygula} onChange={e => upd('gecici10Uygula', e.target.checked)}
            className="mt-1 rounded text-lawPrimary focus:ring-lawPrimary" />
          <span className="text-sm text-gray-700"><strong>7456 SK Geçici 10/6 avantajı</strong> — 31/07/2023\'te kapalıda olan istisna olmayan hükümlüler için 3 yıl erken açığa + 3 yıl erken denetim</span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={form.lehe647Uygula} onChange={e => upd('lehe647Uygula', e.target.checked)}
            className="mt-1 rounded text-lawPrimary focus:ring-lawPrimary" />
          <span className="text-sm text-gray-700"><strong>647 SK lehe uygulaması</strong> — 01/06/2005 öncesi suçlar için (TCK 7/3)</span>
        </label>
      </div>

      {hatalar.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <ul className="text-sm text-red-800 space-y-1 list-disc pl-5">
            {hatalar.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

const MuebbetForm = ({ form, setForm }) => {
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Müebbet Türü</label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all ${form.muebbetTuru === 'muebbet' ? 'border-lawPrimary bg-lawPrimary/5' : 'border-gray-200'}`}>
            <input type="radio" name="muebbetTuru" value="muebbet" checked={form.muebbetTuru === 'muebbet'} onChange={e => upd('muebbetTuru', e.target.value)} />
            <span className="font-medium">Müebbet hapis</span>
          </label>
          <label className={`flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all ${form.muebbetTuru === 'agirlastirilmis' ? 'border-lawPrimary bg-lawPrimary/5' : 'border-gray-200'}`}>
            <input type="radio" name="muebbetTuru" value="agirlastirilmis" checked={form.muebbetTuru === 'agirlastirilmis'} onChange={e => upd('muebbetTuru', e.target.value)} />
            <span className="font-medium">Ağırlaştırılmış müebbet</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Suç Türü</label>
        <select value={form.sucKategoriKodu} onChange={e => upd('sucKategoriKodu', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary">
          <option value="genel">Genel suç (107/2 kapsamı)</option>
          <option value="orgut">Örgüt suçu (107/4)</option>
          <option value="teror">Terör suçu (3713 SK 17)</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cezaevine Giriş Tarihi (opsiyonel)</label>
          <input type="date" value={form.cezaevineGirisTarihi} onChange={e => upd('cezaevineGirisTarihi', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tutukluluk + Gözaltı (gün)</label>
          <input type="number" min="0" value={form.tutukluGun} onChange={e => upd('tutukluGun', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary" />
        </div>
      </div>
    </div>
  )
}

// ============ SONUÇ BİLEŞENLERİ ============

const SureliSonuc = ({ data }) => {
  if (data.hata) {
    return <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">{data.hata}</div>
  }
  return (
    <div className="space-y-4">
      {/* Ana sonuç kartları */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-lawDark mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" /> Hesaplama Sonucu
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <SonucKart renk="red" baslik="Kapalıda" deger={data.ozet.kapaliFormat} altMetin={`${data.kurum.kapaliGun} gün`} />
          <SonucKart renk="amber" baslik="Açıkta" deger={data.ozet.acikFormat} altMetin={`${data.kurum.acikGun} gün`} />
          <SonucKart renk="emerald" baslik="Denetimli Serbestlik" deger={data.ozet.denetimFormat} altMetin={`${data.denetim.gun} gün`} />
          <SonucKart renk="blue" baslik="Toplam Yatış" deger={data.ozet.ksFormat} altMetin={`${data.ks.ksGunNet} gün`} />
        </div>
        {(data.ks.ksTarih || data.hakEderekTahliyeTarih) && (
          <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-3 gap-4 text-sm">
            {data.kurum.acikGirisTarih && (
              <div><div className="text-gray-500">Açığa Geçiş</div><div className="font-bold text-lawDark">{data.kurum.acikGirisTarih}</div></div>
            )}
            {data.denetim.baslangicTarih && (
              <div><div className="text-gray-500">Denetim Başlangıcı</div><div className="font-bold text-lawDark">{data.denetim.baslangicTarih}</div></div>
            )}
            {data.ks.ksTarih && (
              <div><div className="text-gray-500">Koşullu Salıverme</div><div className="font-bold text-lawPrimary">{data.ks.ksTarih}</div></div>
            )}
            {data.hakEderekTahliyeTarih && (
              <div className="md:col-span-3 pt-3 border-t border-gray-200">
                <div className="text-gray-500">Hak Ederek Tahliye Tarihi</div>
                <div className="font-bold text-green-700 text-lg">{data.hakEderekTahliyeTarih}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Adım adım açıklama */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-lawDark mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-lawPrimary" /> Adım Adım Hesaplama
        </h3>
        <div className="space-y-3">
          {data.adimlar.map((a, i) => (
            <div key={i} className="border-l-4 border-lawPrimary pl-4 py-2">
              <div className="font-semibold text-lawDark">{a.baslik}</div>
              <div className="text-sm text-gray-700 mt-1">{a.metin}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Uyarılar */}
      {data.uyarilar.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Dikkat Edilecek Hususlar
          </h3>
          <ul className="space-y-2 text-sm text-amber-900 list-disc pl-5">
            {data.uyarilar.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

const MuebbetSonuc = ({ data }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-lawDark mb-4 flex items-center gap-2">
      <CheckCircle className="w-6 h-6 text-green-600" /> Müebbet Hesaplama Sonucu
    </h3>
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div className="bg-lawPrimary text-white rounded-xl p-5">
        <div className="text-sm opacity-90 mb-1">Koşullu Salıverme Süresi</div>
        <div className="text-3xl font-bold">{data.ksYil} yıl</div>
        <div className="text-sm opacity-90 mt-1">{data.ksGun.toLocaleString('tr-TR')} gün</div>
      </div>
      {data.ksTarih && (
        <div className="bg-gray-100 rounded-xl p-5">
          <div className="text-sm text-gray-600 mb-1">Koşullu Salıverme Tarihi</div>
          <div className="text-2xl font-bold text-lawDark">{data.ksTarih}</div>
        </div>
      )}
    </div>
    <p className="text-gray-700 mb-3">{data.aciklama}</p>
    {data.uyarilar.length > 0 && (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
        <ul className="text-sm text-amber-900 list-disc pl-5 space-y-1">
          {data.uyarilar.map((u, i) => <li key={i}>{u}</li>)}
        </ul>
      </div>
    )}
  </div>
)

const SonucKart = ({ renk, baslik, deger, altMetin }) => {
  const renkler = {
    red:     'bg-red-50 border-red-200 text-red-900',
    amber:   'bg-amber-50 border-amber-200 text-amber-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    blue:    'bg-primary-50 border-blue-200 text-primary-900',
  }[renk]
  return (
    <div className={`${renkler} border-2 rounded-xl p-4`}>
      <div className="text-xs font-medium opacity-75 mb-1">{baslik}</div>
      <div className="text-lg font-bold leading-tight">{deger}</div>
      <div className="text-xs opacity-75 mt-1">{altMetin}</div>
    </div>
  )
}

export default InfazYatarPage
