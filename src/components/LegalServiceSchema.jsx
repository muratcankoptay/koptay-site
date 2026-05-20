import { Helmet } from 'react-helmet-async'
import { getLegalServiceJsonLd } from '../config/legalServiceSchema'

/** TBB uyumlu LegalService JSON-LD — tüm kamuya açık sayfalarda */
const LegalServiceSchema = () => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(getLegalServiceJsonLd())}</script>
  </Helmet>
)

export default LegalServiceSchema
