"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  X,
  Ban,
  CircleCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AD_SLOT_PRESETS } from "@/lib/adSlots";
import { getApiV1Base, getClientSiteOrigin } from "@/lib/apiBaseUrl";

function mediaOrigin() {
  return getClientSiteOrigin();
}

function resolveMediaUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  const base = mediaOrigin();
  if (!base) return p;
  return `${base}${p}`;
}

export default function AdsManagementPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSlot, setModalSlot] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    slotKey: "",
    width: 728,
    height: 90,
    companyName: "",
    targetUrl: "",
    priority: 0,
    active: true,
  });

  const loadAds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiV1Base()}/admin/ads`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setAds(data.data || []);
    } catch (e) {
      toast.error(e.message || "Could not load ads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  const openCreate = (preset) => {
    setEditingId(null);
    setImageFile(null);
    setForm({
      slotKey: preset.key,
      width: preset.defaultWidth,
      height: preset.defaultHeight,
      companyName: "",
      targetUrl: "",
      priority: 10,
      active: true,
    });
    setModalSlot(preset);
  };

  const openEdit = (ad) => {
    setEditingId(ad.id);
    setImageFile(null);
    setForm({
      slotKey: ad.slotKey,
      width: ad.width,
      height: ad.height,
      companyName: ad.companyName || "",
      targetUrl: ad.targetUrl || "",
      priority: ad.priority,
      active: ad.active,
    });
    setModalSlot(
      AD_SLOT_PRESETS.find((p) => p.key === ad.slotKey) || {
        key: ad.slotKey,
        label: ad.slotKey,
      },
    );
  };

  const closeModal = () => {
    setModalSlot(null);
    setEditingId(null);
    setImageFile(null);
  };

  const appendFormFields = (fd) => {
    fd.append("slotKey", form.slotKey);
    fd.append("width", String(form.width));
    fd.append("height", String(form.height));
    fd.append("companyName", form.companyName || "");
    fd.append("targetUrl", form.targetUrl || "");
    fd.append("priority", String(form.priority));
    fd.append("active", form.active ? "true" : "false");
  };

  const saveAd = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error("Upload an image for this ad");
      return;
    }
    try {
      if (editingId) {
        if (imageFile) {
          const fd = new FormData();
          fd.append("image", imageFile);
          appendFormFields(fd);
          const res = await fetch(`${getApiV1Base()}/admin/ads/${editingId}`, {
            method: "PATCH",
            body: fd,
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Update failed");
        } else {
          const res = await fetch(`${getApiV1Base()}/admin/ads/${editingId}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slotKey: form.slotKey,
              width: form.width,
              height: form.height,
              companyName: form.companyName,
              targetUrl: form.targetUrl,
              priority: form.priority,
              active: form.active,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Update failed");
        }
      } else {
        const fd = new FormData();
        fd.append("image", imageFile);
        appendFormFields(fd);
        const res = await fetch(`${getApiV1Base()}/admin/ads`, {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Create failed");
      }
      toast.success(editingId ? "Ad updated" : "Ad created");
      closeModal();
      loadAds();
    } catch (err) {
      toast.error(err.message || "Save failed");
    }
  };

  const setAdActive = async (id, active) => {
    try {
      const res = await fetch(`${getApiV1Base()}/admin/ads/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update status");
      toast.success(active ? "Ad is active" : "Ad blocked");
      loadAds();
    } catch (e) {
      toast.error(e.message || "Status update failed");
    }
  };

  const deleteAd = async (id) => {
    if (!confirm("Delete this creative and its image file?")) return;
    try {
      const res = await fetch(`${getApiV1Base()}/admin/ads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Removed");
      loadAds();
    } catch {
      toast.error("Delete failed");
    }
  };

  const adsBySlot = (key) =>
    ads
      .filter((a) => a.slotKey === key)
      .sort((a, b) => b.priority - a.priority);

  const previewSrc = editingId
    ? ads.find((x) => x.id === editingId)?.imageUrl
    : null;
  const showPreview = imageFile
    ? URL.createObjectURL(imageFile)
    : previewSrc
      ? resolveMediaUrl(previewSrc)
      : null;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-start gap-4 mb-8">
        <div className=" bg-amber-100 text-amber-800 rounded-2xl">
          <Megaphone className="w-7 h-7" />
        </div>
        <div>
          <h1 className=" text-lg md:text-xl font-black text-gray-900 tracking-tight">
            Global ads & layouts
          </h1>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 animate-pulse">
          Loading inventory…
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AD_SLOT_PRESETS.map((preset) => {
            const slotAds = adsBySlot(preset.key);
            return (
              <div
                key={preset.key}
                className="border border-gray-200 bg-white rounded-2xl p-5 shadow-sm flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h2 className="font-bold text-gray-900 text-sm">
                      {preset.label}
                    </h2>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      {preset.defaultWidth} × {preset.defaultHeight} px ·{" "}
                      <code className="text-[10px]">{preset.key}</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreate(preset)}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-primary !text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-dark"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" /> Add
                  </button>
                </div>
                <ul className="space-y-2 mt-auto border-t border-gray-100 pt-3">
                  {slotAds.length === 0 ? (
                    <li className="text-[12px] text-gray-400 italic">
                      No creatives — public sees a dashed placeholder.
                    </li>
                  ) : (
                    slotAds.map((a) => (
                      <li
                        key={a.id}
                        className="flex flex-col gap-2 text-[12px] bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-10 shrink-0 rounded border border-gray-200 bg-white overflow-hidden">
                            {a.imageUrl ? (
                              <Image
                                src={resolveMediaUrl(a.imageUrl)}
                                alt=""
                                fill
                                unoptimized
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-[8px] text-gray-400 p-1">
                                No img
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-800 block truncate">
                              {a.companyName || "Sponsor"} · pri {a.priority}
                            </span>
                            {a.active ? (
                              <span className="text-[10px] font-bold text-emerald-600 uppercase">
                                Active
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-600 uppercase">
                                Blocked
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <button
                            type="button"
                            disabled={a.active}
                            onClick={() => setAdActive(a.id, true)}
                            className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 disabled:opacity-40 hover:bg-emerald-200"
                            title="Show on site"
                          >
                            <CircleCheck className="w-3 h-3 text-emerald-600" />{" "}
                            Active
                          </button>
                          <button
                            type="button"
                            disabled={!a.active}
                            onClick={() => setAdActive(a.id, false)}
                            className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-rose-100 text-rose-800 disabled:opacity-40 hover:bg-rose-200"
                            title="Hide from site"
                          >
                            <Ban className="w-3 h-3 text-rose-600" /> Block
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(a)}
                            className="p-1.5 text-gray-500 hover:text-emerald-600"
                            aria-label="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAd(a.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-600"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {modalSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">
                {editingId ? "Edit creative" : "New creative"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveAd} className="p-5 space-y-4">
              <p className="text-[11px] text-gray-500">
                Slot: <strong>{modalSlot.label}</strong> ({form.slotKey})
              </p>

              {showPreview && (
                <div
                  className="relative w-full rounded-lg border border-gray-200 overflow-hidden bg-gray-50 min-h-[100px] max-h-48"
                  style={{ aspectRatio: `${form.width} / ${form.height}` }}
                >
                  <Image
                    src={showPreview}
                    alt="Preview"
                    fill
                    unoptimized
                    sizes="400px"
                    className="object-contain"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Ad image (required for new ads)
                </label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="sm:col-span-2 relative block rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100/60 transition-colors cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="sr-only"
                      required={!editingId}
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                    <div className="p-6 sm:p-8 flex items-center justify-center min-h-[170px]">
                      {showPreview ? (
                        <div className="relative w-full h-[170px] rounded-xl overflow-hidden bg-white border border-gray-200">
                          <Image
                            src={showPreview}
                            alt="Preview"
                            fill
                            unoptimized
                            sizes="600px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-800">
                            Click to upload
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            PNG/JPG/WebP · max 5MB
                          </p>
                          {editingId && (
                            <p className="text-[11px] text-gray-400 mt-1">
                              Leave empty to keep current image
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Width (px)
                  </label>

                  <input
                    type="number"
                    readOnly
                    className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm bg-gray-100 cursor-not-allowed"
                    value={form.width}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Height (px)
                  </label>

                  <input
                    type="number"
                    readOnly
                    className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm bg-gray-100 cursor-not-allowed"
                    value={form.height}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Company / sponsor name
                </label>
                <input
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, companyName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Click URL
                </label>
                <input
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.targetUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, targetUrl: e.target.value }))
                  }
                  placeholder="https://advertiser.com/…"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Priority (higher wins among active)
                </label>
                <input
                  type="number"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.priority}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priority: +e.target.value || 0 }))
                  }
                />
              </div>
              <fieldset>
                <legend className="text-[10px] font-bold text-gray-500 uppercase mb-2">
                  Visibility
                </legend>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="vis"
                      checked={form.active}
                      onChange={() => setForm((f) => ({ ...f, active: true }))}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="vis"
                      checked={!form.active}
                      onChange={() => setForm((f) => ({ ...f, active: false }))}
                    />
                    Blocked
                  </label>
                </div>
              </fieldset>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary !text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark"
                >
                  {editingId ? "Update" : "Publish creative"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
