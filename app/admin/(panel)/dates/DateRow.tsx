"use client";
import { useFormState, useFormStatus } from "react-dom";
import { updateDate, deleteDate } from "./actions";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="md:col-span-3 px-3 py-1.5 bg-white/10 hover:bg-wine-red hover:text-white text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

const inp = "w-full bg-panel border border-white/10 px-3 py-2 text-sm";
const TYPE_LABELS = { EVENT: "Event", DEADLINE: "Deadline", OTHER: "Other" };

function toInputDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

interface DateItem {
  id: string;
  title: string;
  type: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  description: string | null;
}

export function DateRow({ date }: { date: DateItem }) {
  const [state, action] = useFormState(updateDate, null);

  return (
    <div className="flex gap-2 items-start bg-panel border border-white/10 p-3">
      <form action={action} className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2">
        <input type="hidden" name="id" value={date.id} />
        <input name="title" defaultValue={date.title} placeholder="Title" className={inp + " md:col-span-2"} />
        <select name="type" defaultValue={date.type} className={inp}>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <label className="block">
          <span className="text-[0.6rem] text-white/50 uppercase tracking-wide">Start *</span>
          <input type="date" name="startsAt" defaultValue={toInputDate(date.startsAt)} className={inp + " mt-0.5"} />
        </label>
        <label className="block">
          <span className="text-[0.6rem] text-white/50 uppercase tracking-wide">End</span>
          <input type="date" name="endsAt" defaultValue={date.endsAt ? toInputDate(date.endsAt) : ""} className={inp + " mt-0.5"} />
        </label>
        <input name="location" defaultValue={date.location || ""} placeholder="Location (optional)" className={inp} />
        <textarea name="description" defaultValue={date.description || ""} placeholder="Description (optional)" rows={2} className={inp + " md:col-span-3 resize-none"} />
        <div className="md:col-span-3 flex items-center gap-3">
          <SaveBtn />
          {state?.ok && <span className="text-xs text-green-400">Saved ✓</span>}
          {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
        </div>
      </form>
      <form action={deleteDate}>
        <input type="hidden" name="id" value={date.id} />
        <button className="text-red-400 hover:text-red-300 text-lg leading-none px-1 pt-1">×</button>
      </form>
    </div>
  );
}
