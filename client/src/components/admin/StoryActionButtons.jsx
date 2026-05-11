"use client";

import { Eye, Pencil, Trash2, Ban, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { toggleStoryStatusAction, deleteStoryAction } from "@/actions/admin-data.action";

export default function StoryActionButtons({ story }) {
  const [currentStatus, setCurrentStatus] = useState(story.status);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const confirmToggleStatus = async () => {
    setBlocking(true);
    const res = await toggleStoryStatusAction(story.id);
    setBlocking(false);
    setShowBlockModal(false);
    if (res.success) {
      setCurrentStatus(currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE');
      toast.success(`Story ${currentStatus === 'ACTIVE' ? 'blocked' : 'activated'}.`);
    } else {
      toast.error(res.message || "Failed to update status.");
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
    const res = await deleteStoryAction(story.id);
    if (res.success) {
      toast.success("Story deleted successfully.");
    } else {
      setIsDeleting(false);
      toast.error(res.message);
    }
  };

  if (isDeleting) return <span className="text-[10px] text-red-500 font-semibold animate-pulse tracking-wide uppercase px-4">Deleting...</span>;

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button type="button" onClick={() => setShowViewModal(true)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer" title="View Story">
          <Eye className="w-4 h-4" />
        </button>

        <Link href={`/dashboard/stories/edit/${story.id}`} className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all" title="Edit Story">
          <Pencil className="w-4 h-4" />
        </Link>

        <button type="button" onClick={() => setShowBlockModal(true)} className={`p-2 rounded-xl transition-all cursor-pointer ${currentStatus === 'ACTIVE' ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`} title={currentStatus === 'ACTIVE' ? "Block Story" : "Unblock Story"}>
          <Ban className="w-4 h-4" />
        </button>

        <button type="button" onClick={() => setShowDeleteModal(true)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer" title="Delete Story">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Block Confirmation */}
      {showBlockModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                <Ban className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{currentStatus === 'ACTIVE' ? 'Block' : 'Unblock'} this story?</h3>
              <p className="text-sm text-gray-500">Are you sure you want to change the status of this story?</p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button onClick={() => setShowBlockModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
              <button onClick={confirmToggleStatus} disabled={blocking} className="flex-1 py-3 text-sm font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                {blocking ? 'Processing...' : (currentStatus === 'ACTIVE' ? 'Block' : 'Unblock')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete this story?</h3>
              <p className="text-sm text-gray-500">This action cannot be undone. The story will be permanently removed.</p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{story.title}</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {story.thumbnailImage && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video">
                  <img src={story.thumbnailImage} className="w-full h-full object-cover" alt="" />
                </div>
              )}
              <div className="prose prose-sm max-w-none prose-img:rounded-xl">
                {/* Render JSON content blocks if needed, but for modal we can just show a preview or simplify */}
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {Array.isArray(story.content) ? story.content.map((block, idx) => (
                    <div key={idx}>
                      {block.type === 'text' && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
                      {block.type === 'image' && <img src={block.content} className="rounded-xl w-full" />}
                    </div>
                  )) : <div dangerouslySetInnerHTML={{ __html: story.content }} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
