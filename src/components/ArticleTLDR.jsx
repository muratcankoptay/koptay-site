import { Lightbulb } from 'lucide-react';

/**
 * ArticleTLDR
 *
 * Makalenin en ustunde gosterilen "ozet" kutusu.
 * - excerpt yoksa hicbir sey render etmez (graceful)
 * - Marka teal/lacivert renkleri ile uyumlu
 * - Erisilebilir: aria-label var
 */
const ArticleTLDR = ({ excerpt }) => {
  if (!excerpt || excerpt.trim().length === 0) return null;

  return (
    <aside
      className="my-8 rounded-xl border border-lawSecondary/20 bg-gradient-to-br from-primary-50 to-white p-6 md:p-7 shadow-sm"
      aria-label="Makale ozeti"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-lawSecondary/15 flex items-center justify-center text-lawSecondary">
          <Lightbulb className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-lawSecondary mb-2">
            Bilmeniz Gerekenler — Kisa Ozet
          </h2>
          <p className="text-gray-800 leading-relaxed text-base md:text-lg m-0">
            {excerpt}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default ArticleTLDR;
