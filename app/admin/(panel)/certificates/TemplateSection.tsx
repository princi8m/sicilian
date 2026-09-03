import { uploadCertificateTemplate, uploadLaurelTemplate } from "./template-actions";

function TemplateBox({
  title,
  action,
  previewUrl,
  usingLegacyLocal,
  missingCopy,
}: {
  title:            string;
  action:           (formData: FormData) => Promise<void>;
  previewUrl:       string | null;
  usingLegacyLocal: boolean;
  missingCopy:      string;
}) {
  const hasTemplate = !!previewUrl || usingLegacyLocal;

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex-1 min-w-[280px]">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="w-40 shrink-0">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={title}
              className="w-full rounded border border-white/10"
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded border border-dashed border-white/20 flex items-center justify-center text-xs text-white/30 text-center px-2">
              No preview
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[220px]">
          <h2 className="text-sm font-semibold mb-1">{title}</h2>
          {previewUrl ? (
            <p className="text-xs text-white/50 mb-3">Stored on Cloudinary.</p>
          ) : usingLegacyLocal ? (
            <p className="text-xs text-yellow-300/80 mb-3">
              Using a legacy local file. Upload one below to move it to Cloudinary storage
              (survives redeploys).
            </p>
          ) : (
            <p className="text-xs text-yellow-300/80 mb-3">{missingCopy}</p>
          )}

          <form action={action} className="flex items-center gap-2 flex-wrap">
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png"
              required
              className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-white/20 file:bg-white/5 file:text-white/70 file:text-xs hover:file:border-accent"
            />
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded border border-white/20 text-white/70 hover:bg-accent hover:border-accent hover:text-white transition-colors"
            >
              {hasTemplate ? "Replace template" : "Upload template"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function TemplateSection({
  previewUrl,
  usingLegacyLocal,
  laurelPreviewUrl,
  usingLaurelLegacyLocal,
}: {
  previewUrl:             string | null;
  usingLegacyLocal:       boolean;
  laurelPreviewUrl:       string | null;
  usingLaurelLegacyLocal: boolean;
}) {
  return (
    <div className="flex gap-4 flex-wrap mb-6">
      <TemplateBox
        title="Certificate template"
        action={uploadCertificateTemplate}
        previewUrl={previewUrl}
        usingLegacyLocal={usingLegacyLocal}
        missingCopy="No template uploaded — certificates cannot be generated until one is added."
      />
      <TemplateBox
        title="Laurel template"
        action={uploadLaurelTemplate}
        previewUrl={laurelPreviewUrl}
        usingLegacyLocal={usingLaurelLegacyLocal}
        missingCopy="No template uploaded — laurels cannot be generated until one is added."
      />
    </div>
  );
}
