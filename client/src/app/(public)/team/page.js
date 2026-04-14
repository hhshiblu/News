import { Mail, Award, PenTool, Camera, Shield } from "lucide-react";
import Link from "next/link";

// Social Icons SVGs for v1.x compatibility
const SocialIcons = {
  Twitter: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Linkedin: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.205 24 24 23.227 24 22.271V1.729C24 .774 23.205 0 22.225 0z"/>
    </svg>
  )
};

export const metadata = {
  title: "Our Team — LabourPulse",
  description: "Meet the dedicated journalists and experts behind LabourPulse.",
};

const teamMembers = [
  {
    name: "Farhan Ahmed",
    role: "Editor-in-Chief",
    bio: "Farhan has over 20 years of experience in industrial journalism and has led LabourPulse since its inception.",
    image: "https://i.pravatar.cc/300?u=farhan",
    category: "Leadership",
    icon: Shield,
  },
  {
    name: "Sarah Jenkins",
    role: "Senior Political Analyst",
    bio: "Sarah specializes in global labor policy and its intersection with local governance.",
    image: "https://i.pravatar.cc/300?u=sarah",
    category: "Editorial",
    icon: PenTool,
  },
  {
    name: "Tanvir Hossain",
    role: "Investigative Journalist",
    bio: "A multi-award winning journalist focused on industrial safety and workers' rights.",
    image: "https://i.pravatar.cc/300?u=tanvir",
    category: "Editorial",
    icon: Award,
  },
  {
    name: "Elena Rodriguez",
    role: "Chief Photographer",
    bio: "Elena's lens captures the raw reality of the industrial world, from the frontlines of strikes to the halls of power.",
    image: "https://i.pravatar.cc/300?u=elena",
    category: "Creative",
    icon: Camera,
  },
  {
    name: "David Chen",
    role: "Economics Correspondent",
    bio: "David breaks down complex economic shifts into actionable insights for our readers.",
    image: "https://i.pravatar.cc/300?u=david",
    category: "Editorial",
    icon: PenTool,
  },
  {
    name: "Nusrat Jahan",
    role: "Head of Digital Strategy",
    bio: "Nusrat leads our digital innovation, ensuring our stories reach every corner of the globe.",
    image: "https://i.pravatar.cc/300?u=nusrat",
    category: "Leadership",
    icon: Shield,
  },
];

export default function TeamPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-[1280px] mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-[Playfair_Display] mb-6">The Faces of Truth</h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-[Inter] text-lg">
            Meet the dedicated team of journalists, analysts, and visionaries working to bring you the most critical labour and political news.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, i) => (
              <div key={i} className="group">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-xl grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <div className="flex gap-4">
                       <a href="#" className="text-white hover:text-primary transition-colors"><SocialIcons.Twitter /></a>
                       <a href="#" className="text-white hover:text-primary transition-colors"><SocialIcons.Linkedin /></a>
                       <a href="#" className="text-white hover:text-primary transition-colors"><Mail size={20} /></a>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <member.icon size={16} className="text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{member.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 font-[Playfair_Display]">{member.name}</h3>
                  <p className="text-primary font-bold text-sm font-[Inter]">{member.role}</p>
                  <p className="text-gray-500 text-sm font-[Inter] leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment CTA */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-[Playfair_Display] mb-6">Join Our Mission</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-10 font-[Inter]">
            We are always looking for passionate voices to join our editorial and technological teams. 
            If you have a story to tell or a vision to share, we want to hear from you.
          </p>
          <Link href="/contact" className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl font-[Inter]">
            View Open Positions
          </Link>
        </div>
      </section>
    </main>
  );
}
