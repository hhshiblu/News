"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Info, Camera, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { getPublicApiBase } from "@/lib/apiBaseUrl";

export default function ContactPage() {
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsData, setNewsData] = useState({ name: "", email: "", title: "", content: "" });
  const [newsImages, setNewsImages] = useState([]);
  const [submittingNews, setSubmittingNews] = useState(false);

  // Contact form state
  const [contactData, setContactData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submittingContact, setSubmittingContact] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmittingContact(true);
    try {
      const res = await fetch(`${getPublicApiBase()}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Your message has been sent successfully!");
        setContactData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data?.message || "Failed to send message.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmittingContact(false);
    }
  };

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
         const res = await fetch(`${getPublicApiBase()}/submissions`, {
             method: "POST",
             body: formData
         });
         const data = await res.json().catch(() => ({}));
         if(res.ok) {
             toast.success("News tip successfully dispatched to our editors!");
             setShowNewsModal(false);
             setNewsData({ name: "", email: "", title: "", content: "" });
             setNewsImages([]);
         } else {
             toast.error(data?.message || "Failed to submit news tip.");
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
      <section className="py-10 bg-gray-50 border-b border-gray-200 px-4">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold font-[Playfair_Display] text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-[13px] md:text-[14px] font-[Inter]">
            Have a story tip, a question about your subscription, or just want to say hello? 
            We're here to listen and help.
          </p>
        </div>
      </section>

      <section className="py-6 md:py-10 px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
            {/* Contact Form */}
            <div className="lg:w-2/3 bg-white p-[2px] rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 font-[Playfair_Display] mb-6 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#00a651]" />
                Send us a Message
              </h2>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 font-[Inter] ml-1">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={contactData.name}
                      onChange={e => setContactData({...contactData, name: e.target.value})}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 text-[13px] bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-[#00a651]/30 focus:ring-4 focus:ring-[#00a651]/5 transition-all outline-none font-[Inter]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 font-[Inter] ml-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={contactData.email}
                      onChange={e => setContactData({...contactData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 text-[13px] bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-[#00a651]/30 focus:ring-4 focus:ring-[#00a651]/5 transition-all outline-none font-[Inter]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-700 font-[Inter] ml-1">Subject</label>
                  <input 
                    type="text"
                    value={contactData.subject}
                    onChange={e => setContactData({...contactData, subject: e.target.value})}
                    placeholder="e.g. General Inquiry, Advertising..."
                    className="w-full px-4 py-2.5 text-[13px] bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-[#00a651]/30 focus:ring-4 focus:ring-[#00a651]/5 transition-all outline-none font-[Inter]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-700 font-[Inter] ml-1">Your Message *</label>
                  <textarea 
                    rows={5}
                    required
                    value={contactData.message}
                    onChange={e => setContactData({...contactData, message: e.target.value})}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-2.5 text-[13px] bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-[#00a651]/30 focus:ring-4 focus:ring-[#00a651]/5 transition-all outline-none font-[Inter] resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submittingContact}
                  className="w-full md:w-auto bg-[#00a651] hover:bg-[#008c44] disabled:opacity-50 text-white px-8 py-3 text-[13px] rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg font-[Inter]"
                >
                  <Send size={16} />
                  {submittingContact ? "Sending..." : "Submit Message"}
                </button>
              </form>
            </div>

            {/* Sidebar info */}
            <div className="lg:w-1/3 space-y-8">
              {/* HQ Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 font-[Playfair_Display]">Our Headquarters</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">Main Office</p>
                      <p className="text-gray-500 text-[12px] font-[Inter]">
                        Highlands Central, Level 15<br />
                        Panthapath, Dhaka 1215<br />
                        Bangladesh
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">Phone</p>
                      <p className="text-gray-500 text-[12px] font-[Inter]">+880 2 123 4567</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">General Email</p>
                      <p className="text-gray-500 text-[12px] font-[Inter]">hello@labourpulse.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit News Promo Section */}
      <section className="py-10 md:py-14 bg-[#f2fdf7] border-t border-b border-[#00a651]/10 px-4">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
               <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-3 flex items-center gap-2">
                  <Camera className="text-[#00a651]" size={24} />
                  Got an Exclusive Story?
               </h2>
               <p className="text-gray-600 text-[12px] md:text-[13px] font-[Inter] leading-relaxed">
                 LabourPulse thrives on tips from the public. If you have witnessed something newsworthy, caught an exclusive event on camera, or wish to blow the whistle anonymously—our editorial team wants to hear from you. You can attach up to 5 images.
               </p>
            </div>
            <button 
               onClick={() => setShowNewsModal(true)}
               className="bg-[#00a651] hover:bg-[#008c44] text-white px-8 py-3 text-[12px] rounded-lg font-black uppercase tracking-widest shadow-xl transition-all whitespace-nowrap"
            >
               Drop a News Tip
            </button>
        </div>
      </section>

      {/* Map Section Placeholder */}
      {/* <section className="py-12 md:py-16 bg-gray-900 text-white px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold font-[Playfair_Display] mb-3">Our Global Presence</h2>
            <p className="text-gray-400 text-[12px] md:text-[13px] font-[Inter]">With bureaus across 12 countries, we ensure local insight on a global scale.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {["Dhaka", "London", "New York", "Geneva", "Singapore", "Berlin", "Tokyo", "Dubai"].map((city) => (
              <div key={city} className="flex flex-col items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00a651] group-hover:scale-150 transition-all" />
                <span className="font-bold tracking-wide text-[10px] uppercase font-[Inter] text-gray-500 group-hover:text-white transition-colors">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* News Submission Modal */}
      {showNewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
             <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
                 <button onClick={() => setShowNewsModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={18} /></button>
                 
                 <div className="p-5 md:p-6 space-y-5">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 bg-[#f2fdf7] rounded-lg flex items-center justify-center text-[#00a651]"><UploadCloud size={20}/></div>
                        <div>
                           <h2 className="text-lg font-bold text-gray-900">Secure News Drop</h2>
                           <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Share tips directly with editors</p>
                        </div>
                    </div>

                    <form onSubmit={submitNewsTip} className="space-y-4">
                       <div className="grid grid-cols-2 gap-3">
                           <div>
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-0.5 mb-1 block">Full Name (Optional)</label>
                               <input value={newsData.name} onChange={e => setNewsData({...newsData, name: e.target.value})} type="text" className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-[12px] font-medium focus:bg-white focus:border-[#00a651]/20 outline-none transition-all" placeholder="Anonymous" />
                           </div>
                           <div>
                               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-0.5 mb-1 block">Email (Optional)</label>
                               <input value={newsData.email} onChange={e => setNewsData({...newsData, email: e.target.value})} type="email" className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-[12px] font-medium focus:bg-white focus:border-[#00a651]/20 outline-none transition-all" placeholder="To contact you back" />
                           </div>
                       </div>
                       
                       <div>
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-0.5 mb-1 block">Headline / Topic</label>
                           <input value={newsData.title} onChange={e => setNewsData({...newsData, title: e.target.value})} type="text" className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-[12px] font-medium focus:bg-white focus:border-[#00a651]/20 outline-none transition-all" placeholder="What is this about?" />
                       </div>

                       <div>
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-0.5 mb-1 block">Full Details *</label>
                           <textarea value={newsData.content} required onChange={e => setNewsData({...newsData, content: e.target.value})} rows="4" className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-[12px] font-medium focus:bg-white focus:border-[#00a651]/20 outline-none transition-all resize-none" placeholder="Provide complete facts about your news..." />
                       </div>

                       <div>
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-0.5 mb-1.5 flex items-center justify-between">
                              <span>Attach Evidence (Max 5 Images)</span>
                              <span className="text-[#00a651]">{newsImages.length}/5</span>
                           </label>
                           
                           {newsImages.length < 5 && (
                              <label className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-[#f2fdf7] hover:border-[#00a651]/20 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors group mb-2">
                                   <Camera className="text-gray-400 group-hover:text-[#00a651] mb-1 transition-colors" size={20}/>
                                   <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#00a651] transition-colors">Select files from mobile or PC</span>
                                   <input type="file" multiple accept="image/*" className="hidden" onChange={handleNewsImageChange} />
                              </label>
                           )}

                           {newsImages.length > 0 && (
                                <div className="grid grid-cols-5 gap-2 mt-2">
                                   {newsImages.map((file, idx) => (
                                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                          <button type="button" onClick={() => removeNewsImage(idx)} className="absolute top-0.5 right-0.5 bg-white/90 rounded-full p-0.5 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"><X size={10}/></button>
                                      </div>
                                   ))}
                                </div>
                           )}
                       </div>

                       <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                           <button type="button" onClick={() => setShowNewsModal(false)} className="px-4 py-2 text-[11px] font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                           <button type="submit" disabled={submittingNews} className="px-5 py-2 text-[11px] font-black text-white bg-[#00a651] hover:bg-[#008c44] disabled:opacity-50 rounded-lg shadow-lg shadow-[#00a651]/10 transition-all flex items-center gap-1.5">
                                {submittingNews ? 'Sending...' : 'Confirm Delivery'}
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
