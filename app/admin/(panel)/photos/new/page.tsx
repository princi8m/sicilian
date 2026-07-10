"use client";
import { useState } from "react";
import { uploadPhotoSingle, finishPhotoUpload } from "../actions";

export default function NewPhotoPage() {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("files") as HTMLInputElement;
    const files = Array.from(fileInput.files || []).filter((f) => f.size > 0);
    if (files.length === 0) return;

    const caption = String(new FormData(form).get("caption") || "");
    const featuredOnHome = (form.elements.namedItem("featuredOnHome") as HTMLInputElement).checked;

    setUploading(true);
    setDone(0);
    setTotal(files.length);
    setErrors([]);

    const failures: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("caption", caption);
      if (featuredOnHome) fd.append("featuredOnHome", "on");

      const result = await uploadPhotoSingle(fd);
      if (!result.ok) failures.push(`${file.name}: ${result.error ?? "failed"}`);
      setDone((d) => d + 1);
    }

    setErrors(failures);
    if (failures.length === 0) {
      await finishPhotoUpload();
    } else {
      setUploading(false);
    }
  }

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Upload Photo</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Image file *</label>
          <input
            type="file"
            name="files"
            accept="image/*"
            multiple
            required
            disabled={uploading}
            className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-white/10 file:text-white file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-white/20 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Caption</label>
          <input
            type="text"
            name="caption"
            placeholder="Optional caption"
            disabled={uploading}
            className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm rounded disabled:opacity-50"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="featuredOnHome" disabled={uploading} className="w-4 h-4" />
          <span className="text-sm">Featured on home page</span>
        </label>

        {uploading && (
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
              <div
                className="h-full bg-wine-red transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-white/60">
              Uploading {done} / {total} images…
            </p>
          </div>
        )}

        {errors.length > 0 && (
          <div className="text-xs text-red-400 space-y-1">
            {errors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={uploading}
            className="bg-wine-red text-white px-5 py-2 text-sm font-semibold hover:bg-wine-red/80 transition-colors disabled:opacity-50"
          >
            {uploading ? `Uploading… ${pct}%` : "Upload"}
          </button>
          <a href="/admin/photos" className="px-5 py-2 text-sm text-white/60 hover:text-white">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
