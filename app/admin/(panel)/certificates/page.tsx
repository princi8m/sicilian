import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";
import { EditionSelector } from "./EditionSelector";
import { CertificatesClient } from "./CertificatesClient";
import { TemplateSection } from "./TemplateSection";
import { FieldPositionEditor } from "./FieldPositionEditor";
import { saveCertFieldPositions, saveLaurelFieldPositions, resetCertFieldPositions, resetLaurelFieldPositions } from "./field-position-actions";
import { hasCertificateTemplate, getCertificateTemplatePreviewUrl } from "@/lib/certificate";
import { hasLaurelTemplate, getLaurelTemplatePreviewUrl } from "@/lib/laurel";
import { getCertFieldPositions, getLaurelFieldPositions } from "@/lib/field-positions";
import { CERT_DEFAULT_LAYOUT } from "@/lib/certificate-config";
import { LAUREL_DEFAULT_LAYOUT } from "@/lib/laurel-config";

export const dynamic = "force-dynamic";

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: { editionId?: string };
}) {
  const editions = await prisma.edition.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
    select: { id: true, year: true, month: true },
  });

  const editionOptions = editions.map((e) => ({
    id:    e.id,
    label: `${MONTHS[e.month - 1]} ${e.year}`,
  }));

  const selectedId = searchParams.editionId || editions[0]?.id;
  const selectedEdition = editions.find((e) => e.id === selectedId);
  const editionDateLabel = selectedEdition
    ? `${MONTHS[selectedEdition.month - 1].toUpperCase()} ${selectedEdition.year}`
    : "";

  const [winners, pastMessages] = await Promise.all([
    selectedId
      ? prisma.winner.findMany({
          where:   { editionId: selectedId },
          orderBy: { order: "asc" },
          select: {
            id:                true,
            recipient:         true,
            filmTitle:         true,
            category:          true,
            email:             true,
            certificateSent:   true,
            certificateSentAt: true,
            certOverrides:     true,
            laurelOverrides:   true,
          },
        })
      : Promise.resolve([]),
    prisma.certMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const [hasTemplate, templatePreviewUrl, hasLaurel, laurelPreviewUrl, certFieldLayout, laurelFieldLayout] = await Promise.all([
    hasCertificateTemplate(),
    getCertificateTemplatePreviewUrl(),
    hasLaurelTemplate(),
    getLaurelTemplatePreviewUrl(),
    getCertFieldPositions(),
    getLaurelFieldPositions(),
  ]);
  const sentCount   = winners.filter((w) => w.certificateSent).length;
  const emailCount  = winners.filter((w) => w.email).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Certificates</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {editions.length > 0 && (
            <EditionSelector editions={editionOptions} selectedId={selectedId ?? ""} />
          )}
          {selectedId && hasTemplate && winners.length > 0 && (
            <a
              href={`/api/certificate/download-all?editionId=${selectedId}`}
              className="text-xs px-3 py-2 rounded bg-white/10 text-white/70 hover:bg-wine-red hover:text-white transition-colors"
            >
              ↓ Download all as ZIP
            </a>
          )}
        </div>
      </div>

      <TemplateSection
        previewUrl={templatePreviewUrl}
        usingLegacyLocal={hasTemplate && !templatePreviewUrl}
        laurelPreviewUrl={laurelPreviewUrl}
        usingLaurelLegacyLocal={hasLaurel && !laurelPreviewUrl}
      />

      {(hasTemplate || hasLaurel) && (
        <div className="flex gap-4 flex-wrap mb-6 items-start">
          {hasTemplate && (
            <FieldPositionEditor
              title="Certificate field positions"
              previewUrl={templatePreviewUrl ?? "/uploads/certificate-template-sicilian-empty.jpg"}
              fields={[
                { key: "category",  label: "Category",  sizeMin: 1, sizeMax: 8 },
                { key: "name",      label: "Name",       sizeMin: 2, sizeMax: 10 },
                { key: "filmTitle", label: "Film title", sizeMin: 2, sizeMax: 10 },
                { key: "date",      label: "Date",       sizeMin: 1, sizeMax: 6 },
              ]}
              initialLayout={certFieldLayout}
              codeDefaultLayout={CERT_DEFAULT_LAYOUT}
              saveAction={saveCertFieldPositions}
              resetAction={resetCertFieldPositions}
            />
          )}
          {hasLaurel && (
            <FieldPositionEditor
              title="Laurel field positions"
              previewUrl={laurelPreviewUrl ?? "/uploads/laurel-template-sicilian-empty.png"}
              fields={[
                { key: "category", label: "Category", sizeMin: 5, sizeMax: 35 },
                { key: "month",    label: "Month",     sizeMin: 1, sizeMax: 10 },
                { key: "year",     label: "Year",      sizeMin: 3, sizeMax: 25 },
              ]}
              initialLayout={laurelFieldLayout}
              codeDefaultLayout={LAUREL_DEFAULT_LAYOUT}
              saveAction={saveLaurelFieldPositions}
              resetAction={resetLaurelFieldPositions}
            />
          )}
        </div>
      )}

      {editions.length === 0 && <p className="text-white/60">No editions yet.</p>}

      {selectedId && (
        <>
          <p className="text-sm text-white/40 mb-4">
            {winners.length} winner{winners.length !== 1 ? "s" : ""} —{" "}
            {emailCount} with email — {sentCount} sent
          </p>

          <CertificatesClient
            editionId={selectedId}
            winners={winners}
            hasTemplate={hasTemplate}
            hasLaurel={hasLaurel}
            editionDateLabel={editionDateLabel}
            pastMessages={pastMessages}
          />
        </>
      )}
    </div>
  );
}
