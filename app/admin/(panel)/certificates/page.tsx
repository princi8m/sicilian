import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";
import { EditionSelector } from "./EditionSelector";
import { CertificatesClient } from "./CertificatesClient";
import { hasLaurelTemplate } from "@/lib/laurel";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

function templateExists() {
  return fs.existsSync(
    path.join(process.cwd(), "public/uploads/certificate-template-sicilian-empty.jpg"),
  );
}

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

  const hasTemplate = templateExists();
  const hasLaurel   = hasLaurelTemplate();
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

      {!hasTemplate && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-sm text-yellow-300">
          <strong>Template missing.</strong> Save a blank certificate JPG to{" "}
          <code className="bg-white/10 px-1 rounded">
            public/uploads/certificate-template-sicilian-empty.jpg
          </code>{" "}
          then reload.
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
