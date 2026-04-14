import { ArrowLeft, UserCircle2, Tag, Calendar, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PreviewPostPage({ params }) {
  const { id } = await params;
  
  let post = null;
  try {
     const nextCookies = await import('next/headers');
     const cookieStore = await nextCookies.cookies();
     const listRes = await fetch("http://localhost:5000/api/v1/admin/posts?limit=250", { 
         headers: { Cookie: cookieStore.toString() },
         cache: "no-store" 
     });
     if(listRes.ok) {
         const data = await listRes.json();
         post = data.posts?.find(p => p.id === id);
     }
  } catch(e) {
     console.log("Database fetch disconnected.", e);
  }

  if(!post) return notFound();

  // Parsing Rich HTML nodes matching stored states efficiently without throwing crashes globally.
  let contentBlocks = [];
  try {
      contentBlocks = typeof post.content === 'object' ? post.content : JSON.parse(post.content);
  } catch(e) {}

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-gray-800">
      <div className="flex items-center justify-between">
         <Link href="/dashboard/posts" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#00453e] hover:bg-emerald-50 px-3 py-1.5 rounded transition-all cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Return to Posts List
         </Link>
         
         <div className="flex items-center gap-2">
            {post.status === 'PUBLISHED' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded shadow-sm tracking-wide uppercase"><CheckCircle2 className="w-3.5 h-3.5"/> Approved Live</span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold rounded shadow-sm tracking-wide uppercase"><ShieldAlert className="w-3.5 h-3.5"/> Action Required Pending</span>
            )}
         </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-8 border-b border-gray-100 pb-6 space-y-4">
              {post.category && (
                  <span className="inline-block bg-[#00453e]/10 text-[#00453e] font-semibold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded">
                     {post.category.name}
                  </span>
              )}
              
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {post.title}
              </h1>
              
              <p className="text-sm font-medium text-gray-500 italic border-l-2 border-gray-300 pl-4 py-1">
                  {post.excerpt || "No excerpt explicitly created by author."}
              </p>
              
              <div className="flex items-center gap-6 mt-4 flex-wrap text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  <div className="flex items-center gap-1.5 text-[#00453e]">
                     <UserCircle2 className="w-4 h-4" /> 
                     {post.author?.name || "Unknown Author"}
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Calendar className="w-4 h-4" /> 
                     {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
              </div>
          </div>
          
          {post.featuredImage && (
              <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-md bg-gray-50 flex items-center justify-center">
                 <img src={post.featuredImage} alt="Featured Thumbnail" className="w-full h-auto max-h-[500px] object-contain" />
              </div>
          )}

          <div className="max-w-none break-words overflow-hidden text-gray-800 leading-loose [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline">
             {Array.isArray(contentBlocks) ? contentBlocks.map((block, idx) => {
                 if(block.type === 'image') {
                     return (
                         <div key={idx} className="my-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm mx-auto flex justify-center bg-gray-50 max-h-[400px]">
                            <img src={block.content} alt={`Rich Block ${idx}`} className="object-contain w-full h-full" />
                         </div>
                     );
                 }
                 if(block.type === 'video') {
                     return (
                         <div key={idx} className="my-6 bg-gray-900 rounded-lg aspect-video flex items-center justify-center overflow-hidden border border-gray-800 shadow-md">
                            {block.metaInfo === 'url' ? (
                               <iframe src={block.content.replace('watch?v=', 'embed/')} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                            ) : (
                               <video src={block.content} controls className="w-full h-full"></video>
                            )}
                         </div>
                     );
                 }
                 return (
                     <div key={idx} className="my-3 font-medium text-gray-800" dangerouslySetInnerHTML={{ __html: block.content }} />
                 );
             }) : (
                 <div dangerouslySetInnerHTML={{ __html: post.content }} />
             )}
          </div>
          
          {post.tags && post.tags.length > 0 && (
             <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-2">
                <div className="w-full text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Attached Search Tags</div>
                {post.tags.map((t, idx) => (
                    <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1.5">
                        <Tag className="w-3 h-3" /> {t.tag?.name || "Global Tag"}
                    </span>
                ))}
             </div>
          )}
      </div>
    </div>
  );
}
