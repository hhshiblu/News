import { Facebook, Twitter, Youtube, Instagram, Github } from "lucide-react";

export default function SocialFollowInfo() {
  const socialLinks = [
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, name: "Facebook", color: "hover:bg-[#1877F2]", count: "420K" },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, name: "Twitter", color: "hover:bg-[#1DA1F2]", count: "115K" },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, name: "YouTube", color: "hover:bg-[#FF0000]", count: "890K" }
  ];

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="border-b-[3px] border-primary pb-2 mb-3">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 font-[Inter]">
          Follow Us
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href="#"
            className={`flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-sm transition-all duration-300 group ${social.color} hover:text-white hover:border-transparent`}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600 group-hover:text-white transition-colors">{social.icon}</span>
              <span className="text-[13px] font-bold font-[Inter]">{social.name}</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400 group-hover:text-white/80 transition-colors">{social.count} Followers</span>
          </a>
        ))}
      </div>
    </div>
  );
}
