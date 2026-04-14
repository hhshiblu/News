"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Briefcase, Info, Camera, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsData, setNewsData] = useState({ name: "", email: "", title: "", content: "" });
  const [newsImages, setNewsImages] = useState([]);
  const [submittingNews, setSubmittingNews] = useState(false);

  const handleNewsImageChange = (e) => {
    const files = Array.from(e.target.files);
    if(newsImages.length + files.length > 5) {
       toast.error("You can only upload up to 5 high quality images.");
       return;
    }
    setNewsImages([...newsImages, ...files]);
  };

  const removeNewsImage = (index) => {
      setNewsImages(prev => prev.filter((_, i) => i !== index));
  };

  const submitNewsTip = async (e) => {
     e.preventDefault();
     if(!newsData.content) {
         toast.error("Please provide the news content!");
         return;
     }

     const formData = new FormData();
     formData.append("senderName", newsData.name);
     formData.append("senderEmail", newsData.email);
     formData.append("title", newsData.title);
     formData.append("content", newsData.content);
     newsImages.forEach(img => formData.append("images", img));

     setSubmittingNews(true);
     try {
         const res = await fetch("http://localhost:5000/api/v1/public/submissions", {
             method: "POST",
             body: formData
         });
         if(res.ok) {
             toast.success("News tip successfully dispatched to our editors!");
             setShowNewsModal(false);
             setNewsData({ name: "", email: "", title: "", content: "" });
             setNewsImages([]);
         } else {
             toast.error("Failed to submit news tip.");
         }
     } catch(err) {
         toast.error("Network error.");
     } finally {
         setSubmittingNews(false);
     }
  };

  const departments = [
    { name: "Newsroom", email: "news@labourpulse.com", info: "Submit news tips and story ideas." },
    { name: "Advertising", email: "ads@labourpulse.com", info: "Inquire about advertising opportunities." },
    { name: "Support", email: "support@labourpulse.com", info: "Get help with your subscription or account." },
    { name: "Press & Media", email: "press@labourpulse.com", info: "Media inquiries and official statements." },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[Playfair_Display] text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-[Inter]">
            Have a story tip, a question about your subscription, or just want to say hello? 
            We're here to listen and help.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Form */}
            <div className="lg:w-2/3 bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-8 flex items-center gap-2">
                <MessageSquare className="text-primary" />
                Send us a Message
              </h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 font-[Inter] ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name"
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-[Inter]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 font-[Inter] ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-[Inter]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 font-[Inter] ml-1">Subject</label>
                  <select className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-[Inter] appearance-none">
                    <option>General Inquiry</option>
                    <option>News Tip / Press Release</option>
                    <option>Subscription Support</option>
                    <option>Advertising & Sponsorship</option>
                    <option>Careers</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 font-[Inter] ml-1">Your Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-[Inter] resize-none"
                  />
                </div>

                <button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] font-[Inter]">
                  <Send size={18} />
                  Submit Message
                </button>
              </form>
            </div>

            {/* Sidebar info */}
            <div className="lg:w-1/3 space-y-12">
              {/* HQ Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 font-[Playfair_Display]">Our Headquarters</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={22} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Main Office</p>
                      <p className="text-gray-500 text-sm font-[Inter]">
                        Highlands Central, Level 15<br />
                        Panthapath, Dhaka 1215<br />
                        Bangladesh
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Phone size={22} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Phone</p>
                      <p className="text-gray-500 text-sm font-[Inter]">+880 2 123 4567</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Mail size={22} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">General Email</p>
                      <p className="text-gray-500 text-sm font-[Inter]">hello@labourpulse.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 font-[Playfair_Display]">Department Contacts</h3>
                <div className="grid gap-6">
                  {departments.map((dept, i) => (
                    <div key={i} className="p-5 bg-gray-50 hover:bg-gray-100/80 transition-colors rounded-2xl group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900 text-sm">{dept.name}</span>
                        <Info size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-gray-500 mb-2 font-[Inter]">{dept.info}</p>
                      <a href={`mailto:${dept.email}`} className="text-primary text-xs font-bold hover:underline">{dept.email}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit News Promo Section */}
      <section className="py-16 bg-emerald-50 border-t border-b border-emerald-100">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
               <h2 className="text-3xl font-bold text-gray-900 font-[Playfair_Display] mb-4 flex items-center gap-3">
                  <Camera className="text-emerald-600" size={32} />
                  Got an Exclusive Story?
               </h2>
               <p className="text-gray-600 font-[Inter] leading-relaxed">
                 LabourPulse thrives on tips from the public. If you have witnessed something newsworthy, caught an exclusive event on camera, or wish to blow the whistle anonymously—our editorial team wants to hear from you. You can attach up to 5 high-quality images.
               </p>
            </div>
            <button 
               onClick={() => setShowNewsModal(true)}
               className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all whitespace-nowrap"
            >
               Drop a News Tip
            </button>
        </div>
      </section>

      {/* Map/Office Locations Placeholder */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-[Playfair_Display] mb-4">Our Global Presence</h2>
            <p className="text-gray-400 font-[Inter]">With bureaus across 12 countries, we ensure local insight on a global scale.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {["Dhaka", "London", "New York", "Geneva", "Singapore", "Berlin", "Tokyo", "Dubai"].map((city) => (
              <div key={city} className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-all" />
                <span className="font-bold tracking-wide text-sm font-[Inter]">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* News Submission Modal */}
      {showNewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
             <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
                 <button onClick={() => setShowNewsModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24} /></button>
                 
                 <div className="p-8 md:p-10 space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600"><UploadCloud size={28}/></div>
                        <div>
                           <h2 className="text-2xl font-black text-gray-900">Secure News Drop</h2>
                           <p className="text-xs uppercase font-bold text-gray-400 tracking-widest">Share tips directly with editors</p>
                        </div>
                    </div>

                    <form onSubmit={submitNewsTip} className="space-y-5">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-1 block">Full Name (Optional)</label>
                               <input value={newsData.name} onChange={e => setNewsData({...newsData, name: e.target.value})} type="text" className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all" placeholder="Anonymous" />
                           </div>
                           <div>
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-1 block">Email (Optional)</label>
                               <input value={newsData.email} onChange={e => setNewsData({...newsData, email: e.target.value})} type="email" className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all" placeholder="To contact you back" />
                           </div>
                       </div>
                       
                       <div>
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-1 block">Headline / Topic</label>
                           <input value={newsData.title} onChange={e => setNewsData({...newsData, title: e.target.value})} type="text" className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all" placeholder="What is this about?" />
                       </div>

                       <div>
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-1 block">Full Details *</label>
                           <textarea value={newsData.content} required onChange={e => setNewsData({...newsData, content: e.target.value})} rows="5" className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none" placeholder="Provide complete facts about your news..." />
                       </div>

                       <div>
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-2 flex items-center justify-between">
                              <span>Attach Evidence (Max 5 High-Quality Images)</span>
                              <span className="text-emerald-500">{newsImages.length}/5</span>
                           </label>
                           
                           {newsImages.length < 5 && (
                              <label className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group mb-3">
                                  <Camera className="text-gray-400 group-hover:text-emerald-500 mb-2 transition-colors" size={28}/>
                                  <span className="text-xs font-bold text-gray-500 group-hover:text-emerald-600 transition-colors">Select files from mobile or PC</span>
                                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleNewsImageChange} />
                              </label>
                           )}

                           {newsImages.length > 0 && (
                               <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                                  {newsImages.map((file, idx) => (
                                     <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                         <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                         <button type="button" onClick={() => removeNewsImage(idx)} className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"><X size={12}/></button>
                                     </div>
                                  ))}
                               </div>
                           )}
                       </div>

                       <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                           <button type="button" onClick={() => setShowNewsModal(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                           <button type="submit" disabled={submittingNews} className="px-8 py-3 font-black text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2">
                               {submittingNews ? 'Uploading assets...' : 'Confirm Delivery'}
                           </button>
                       </div>
                    </form>
                 </div>
             </div>
          </div>
      )}
    </main>
  );
}
