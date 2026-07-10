"use client";
import { useRef } from "react";
import { createDate } from "./actions";

const inp = "w-full bg-panel border border-white/10 px-3 py-2 text-sm";

const TYPE_LABELS = { EVENT: "Event", DEADLINE: "Deadline", OTHER: "Other" };

export default function AddDateForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createDate(formData);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-panel/50 border border-white/10 p-4">
      <input name="title" placeholder="Title *" required className={inp + " md:col-span-2"} />
      <select name="type" className={inp}>
        {Object.entries(TYPE_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <label className="block">
        <span className="text-[0.6rem] text-white/50 uppercase tracking-wide">Start *</span>
        <input type="date" name="startsAt" required className={inp + " mt-0.5"} />
      </label>
      <label className="block">
        <span className="text-[0.6rem] text-white/50 uppercase tracking-wide">End</span>
        <input type="date" name="endsAt" className={inp + " mt-0.5"} />
      </label>
      <input name="location" placeholder="Location (optional)" className={inp} />
      <textarea name="description" placeholder="Description (optional)" rows={2} className={inp + " md:col-span-3 resize-none"} />
      <button type="submit" className="md:col-span-3 px-4 py-2 bg-wine-red text-white text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors">
        + Add
      </button>
    </form>
  );
}
