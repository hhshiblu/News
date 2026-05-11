export const REPORTERS = [
  {
    id: "a1",
    name: "Rahim Uddin",
    role: "Senior Labour Correspondent",
    avatar: "https://picsum.photos/seed/reporter_rahim/80/80",
    bio: "Rahim covers Bangladesh's garment sector, trade unions, and workplace safety.",
    socials: {
      twitter: "https://twitter.com/rahim_labour",
      linkedin: "https://linkedin.com/in/rahimuddin",
      email: "rahim@labourpulse.com",
      website: "https://rahimuddin.me"
    }
  },
  {
    id: "a2",
    name: "Tariq Mahmud",
    role: "Economy Editor",
    avatar: "https://picsum.photos/seed/reporter_tariq/80/80",
    bio: "Tariq specializes in macroeconomics, banking, and infrastructure projects.",
    socials: {
      twitter: "https://twitter.com/tariq_econ",
      linkedin: "https://linkedin.com/in/tariqmahmud",
      email: "tariq@labourpulse.com"
    }
  },
  {
    id: "a3",
    name: "Meher Banu",
    role: "International Affairs Desk",
    avatar: "https://picsum.photos/seed/reporter_meher/80/80",
    bio: "Meher writes about global geopolitics, foreign policy, and climate diplomacy.",
    socials: {
      twitter: "https://twitter.com/meher_intl",
      linkedin: "https://linkedin.com/in/meherbanu",
      email: "meher@labourpulse.com"
    }
  },
  {
    id: "a4",
    name: "Nasrin Akter",
    role: "Chief Political Reporter",
    avatar: "https://picsum.photos/seed/reporter_nasrin/80/80",
    bio: "Nasrin is a veteran political analyst covering parliament and elections.",
    socials: {
      twitter: "https://twitter.com/nasrin_pol",
      linkedin: "https://linkedin.com/in/nasrinakter",
      email: "nasrin@labourpulse.com"
    }
  },
  {
    id: "a5",
    name: "Dr. Salma Haque",
    role: "Professor of Political Economy",
    avatar: "https://picsum.photos/seed/reporter1/80/80",
    bio: "Guest columnist focusing on inequality, labour rights, and democracy.",
    socials: {
      twitter: "https://twitter.com/salma_haque",
      linkedin: "https://linkedin.com/in/salmahaque",
      email: "salma@university.edu"
    }
  },
];

export const CATEGORIES = [
  { id: "c1", slug: "politics", label: "Politics", color: "red-600" },
  { id: "c2", slug: "economy", label: "Economy", color: "blue-600" },
  { id: "c3", slug: "labour", label: "Labour", color: "orange-600" },
  { id: "c4", slug: "international", label: "International", color: "teal-600" },
  { id: "c5", slug: "bangladesh", label: "Bangladesh", color: "green-700" },
];

const mockBody = `
<p>For the third consecutive day, the streets outside the export processing zones remained eerily quiet as garment workers stayed away from factory floors, demanding a new minimum wage of Tk 23,000 per month.</p>
<p>A second round of emergency negotiations ended without agreement after factory owners rejected the demand, countering with a proposed monthly wage of Tk 17,500.</p>
<h2>Government Response</h2>
<p>The Labour Minister called for calm and urged both sides to return to the negotiating table, promising to convene a tripartite meeting.</p>
<p>International buyers have reportedly been in contact, expressing concern over the disruption to supply chains ahead of the winter apparel manufacturing season.</p>
`;

export const ARTICLES = [
  // FEATURED / HERO
  {
    id: "art1",
    slug: "garment-workers-strike-third-day",
    title: "Bangladesh Garment Workers' Strike Enters Third Day as Unions Demand Living Wage",
    subtitle: "Hundreds of thousands of RMG workers remain off production lines as negotiations collapse.",
    excerpt: "Hundreds of thousands of workers across Dhaka's industrial belt walked off production lines demanding a minimum monthly wage of Tk 23,000.",
    body: mockBody,
    category_slug: "labour",
    subcategory: "Wages & Rights",
    reporter_id: "a1",
    tags: ["Garment Workers", "Strike", "Wages", "RMG"],
    publishedAt: "April 4, 2026",
    publishedTime: "06:30 AM BST",
    readTime: "7 min read",
    views: "14,280",
    image: "https://picsum.photos/seed/strike_hero/1200/630",
    heroImage: "https://picsum.photos/seed/strike_hero/1200/630",
    heroCaption: "Workers gather outside a garment factory in Ashulia.",
    featured: true,
    keyFacts: [
      { icon: "👷", label: "Workers affected", value: "~1.2 million" },
      { icon: "💰", label: "Demanded wage", value: "Tk 23,000/month" }
    ],
    pullQuote: {
      text: "We are asking for the right to eat three meals a day.",
      attribution: "Nasrin Begum, Union Leader"
    }
  },
  {
    id: "art2",
    slug: "finance-minister-unveils-budget",
    title: "Finance Minister Unveils Tk 7.97 Trillion National Budget for FY2025-26",
    excerpt: "The new budget prioritizes social safety nets and infrastructure, aiming for a 7.5% GDP growth amidst inflationary pressures.",
    body: mockBody,
    category_slug: "economy",
    reporter_id: "a2",
    tags: ["Budget", "Economy", "GDP"],
    publishedAt: "April 3, 2026",
    publishedTime: "02:00 PM BST",
    readTime: "5 min read",
    views: "12,100",
    image: "https://picsum.photos/seed/budget2026/800/600",
    featured: true,
  },
  {
    id: "art3",
    slug: "supreme-court-rules-anti-discrimination",
    title: "Supreme Court Rules in Favour of Government on Anti-Discrimination Law",
    excerpt: "In a landmark verdict, the highest court upheld the key provisions of the controversial workplace equity legislation.",
    body: mockBody,
    category_slug: "politics",
    reporter_id: "a4",
    tags: ["Law", "Supreme Court", "Rights"],
    publishedAt: "April 3, 2026",
    publishedTime: "11:15 AM BST",
    readTime: "6 min read",
    views: "9,450",
    image: "https://picsum.photos/seed/scourt/800/600",
    featured: true,
  },
  
  // LABOUR
  { id: "art4", slug: "migrant-remittance-21-billion", title: "Migrant workers remittance crosses $21 billion mark in 2024-25 fiscal year", excerpt: "Official figures show Bangladesh received over $21 billion in remittances, a 12% jump year-on-year.", body: mockBody, category_slug: "labour", reporter_id: "a1", tags: ["Remittance", "Migrants"], publishedAt: "April 2, 2026", image: "https://picsum.photos/seed/remit/500/300" },
  { id: "art5", slug: "labour-court-ctg-epz", title: "New Labour Court to Be Established in Chattogram Export Zone", excerpt: "To expedite worker-management disputes, a dedicated tribunal will operate within the CEPZ.", body: mockBody, category_slug: "labour", reporter_id: "a1", tags: ["Courts", "EPZ"], publishedAt: "April 1, 2026", image: "https://picsum.photos/seed/labcourt/400/280" },
  { id: "art6", slug: "ilo-bangladesh-safety-compliance", title: "ILO Mission Visits Bangladesh to Review Workplace Safety Compliance", excerpt: "International observers note significant progress but highlight gaps in boiler safety regulations.", body: mockBody, category_slug: "labour", reporter_id: "a1", tags: ["ILO", "Safety"], publishedAt: "March 30, 2026", image: "https://picsum.photos/seed/ilo/400/280" },
  { id: "art7", slug: "bgmea-order-cancellations-warning", title: "BGMEA Warns of Order Cancellations if Strike Continues Beyond Week", excerpt: "Factory owners are urging swift resolution as international buyers express deep concern.", body: mockBody, category_slug: "labour", reporter_id: "a2", tags: ["RMG", "Export"], publishedAt: "April 4, 2026", image: "https://picsum.photos/seed/bgmea_warn/400/280" },
  
  // ECONOMY
  { id: "art8", slug: "adb-infrastructure-deal", title: "Bangladesh signs $3.5B infrastructure deal with Asian Development Bank", excerpt: "The landmark agreement will fund road, rail, and energy projects across six southern districts.", body: mockBody, category_slug: "economy", reporter_id: "a2", tags: ["ADB", "Infrastructure"], publishedAt: "April 3, 2026", image: "https://picsum.photos/seed/adb/500/300" },
  { id: "art9", slug: "dse-3-month-high", title: "Dhaka Stock Exchange hits 3-month high amid positive GDP data", excerpt: "Investors responded positively to the latest manufacturing index reports, driving the broad index up by 1.2%.", body: mockBody, category_slug: "economy", reporter_id: "a2", tags: ["Stock Market", "DSE"], publishedAt: "April 3, 2026", image: "https://picsum.photos/seed/stocks/800/600" },
  { id: "art10", slug: "central-bank-interest-rate", title: "Central Bank raises interest rate to curb inflation", excerpt: "The monetary policy committee voted to increase the policy rate by 50 basis points.", body: mockBody, category_slug: "economy", reporter_id: "a2", tags: ["Banking", "Inflation"], publishedAt: "April 2, 2026", image: "https://picsum.photos/seed/cbank/800/600" },
  { id: "art11", slug: "rmg-exports-record", title: "RMG sector exports reach record $5.2 billion in March", excerpt: "Despite unrest in some areas, overall shipment volumes hit historic highs before the Eid holidays.", body: mockBody, category_slug: "economy", reporter_id: "a2", tags: ["RMG", "Exports"], publishedAt: "April 1, 2026", image: "https://picsum.photos/seed/rmgexport/800/600" },
  
  // POLITICS
  { id: "art12", slug: "coalition-talks-election-reform", title: "Coalition Talks Reach Critical Juncture as Opposition Tables Charter", excerpt: "Senior party officials from both sides emerged from a late-night session describing the atmosphere as constructive.", body: mockBody, category_slug: "politics", reporter_id: "a4", tags: ["Elections", "Politics"], publishedAt: "April 3, 2026", image: "https://picsum.photos/seed/pol_hero/1200/600" },
  { id: "art13", slug: "cybercrime-bill-parliament", title: "Parliament passes new cybercrime bill amid opposition walkout", excerpt: "Human rights groups have expressed concern over ambiguous clauses regarding digital speech.", body: mockBody, category_slug: "politics", reporter_id: "a4", tags: ["Parliament", "Law"], publishedAt: "April 2, 2026", image: "https://picsum.photos/seed/parliament/800/600" },
  { id: "art14", slug: "dhaka-chattogram-expressway", title: "Dhaka-Chattogram expressway project gets green signal", excerpt: "The long-awaited megaproject has finally been approved by the cabinet committee on public purchase.", body: mockBody, category_slug: "politics", reporter_id: "a4", tags: ["Infrastructure", "Cabinet"], publishedAt: "April 1, 2026", image: "https://picsum.photos/seed/highway/800/600" },
  { id: "art15", slug: "tech-workers-union-dhaka-it-park", title: "Tech workers union formed at Dhaka IT Park", excerpt: "In a rare move for the tech industry, software engineers have officially registered a collective bargaining unit.", body: mockBody, category_slug: "politics", reporter_id: "a4", tags: ["Tech", "Unions"], publishedAt: "March 31, 2026", image: "https://picsum.photos/seed/tech/800/600" },

  // INTERNATIONAL
  { id: "art16", slug: "rohingya-repatriation-talks", title: "Rohingya repatriation talks resume with Myanmar envoy in Dhaka", excerpt: "Bilateral discussions, mediated by regional partners, seek a sustainable framework for safe return.", body: mockBody, category_slug: "international", reporter_id: "a3", tags: ["Rohingya", "Diplomacy"], publishedAt: "April 3, 2026", image: "https://picsum.photos/seed/rohingya/800/600", countryTag: "🇲🇲 Myanmar" },
  { id: "art17", slug: "bangladesh-india-trade-corridor", title: "Bangladesh-India trade corridor: new checkpost opens", excerpt: "The new integrated checkpost aims to reduce cargo waiting times from days to hours.", body: mockBody, category_slug: "international", reporter_id: "a3", tags: ["India", "Trade"], publishedAt: "April 1, 2026", image: "https://picsum.photos/seed/border/800/600", countryTag: "🇮🇳 India" },
  { id: "art18", slug: "g20-bangladesh-climate-finance", title: "G20 Summit: Bangladesh Pushes for Climate Finance Commitments", excerpt: "The finance minister made a passionate call for wealthier nations to honour their annual pledges.", body: mockBody, category_slug: "international", reporter_id: "a3", tags: ["G20", "Climate"], publishedAt: "March 30, 2026", image: "https://picsum.photos/seed/intl_hero/1200/600", countryTag: "🌍 Global" },
  { id: "art19", slug: "eu-duty-free-access", title: "BGMEA requests duty-free access from EU for 5 more years", excerpt: "With LDC graduation approaching, the apparel body seeks an extension of the Everything But Arms (EBA) scheme.", body: mockBody, category_slug: "international", reporter_id: "a2", tags: ["EU", "Trade", "RMG"], publishedAt: "March 28, 2026", image: "https://picsum.photos/seed/euflag/800/600", countryTag: "🇪🇺 Europe" },

  // BANGLADESH
  { id: "art20", slug: "padma-bridge-gdp-south-bengal", title: "Padma Bridge Boosts South Bengal Economy", excerpt: "Official economic data shows unprecedented growth in southern districts since the bridge opened.", body: mockBody, category_slug: "bangladesh", reporter_id: "a2", tags: ["Economy", "Padma Bridge"], publishedAt: "April 3, 2026", image: "https://picsum.photos/seed/padma_hero/1200/600" },
  { id: "art21", slug: "sylhet-flood-rehabilitation", title: "Sylhet flood rehabilitation funds approved", excerpt: "The national disaster management council has greenlit Tk 500 crore for rebuilding damaged infrastructure.", body: mockBody, category_slug: "bangladesh", reporter_id: "a1", tags: ["Sylhet", "Disaster Relief"], publishedAt: "April 2, 2026", image: "https://picsum.photos/seed/flood/800/600" },
  { id: "art22", slug: "rajshahi-mango-export", title: "Rajshahi mango exporters target European markets this season", excerpt: "Farmers are adopting contract farming and improved bagging techniques to meet EU phytosanitary standards.", body: mockBody, category_slug: "bangladesh", reporter_id: "a2", tags: ["Agriculture", "Rajshahi", "Export"], publishedAt: "April 1, 2026", image: "https://picsum.photos/seed/mango/800/600" },

  // OPINION
  { id: "art23", slug: "silence-of-our-spring-workers-democracy", title: "The Silence of Our Spring: On What Bangladesh's Workers Deserve", excerpt: "When garment factories go dark, Bangladesh is witnessing the articulation of democracy in its purest form.", body: mockBody, category_slug: "opinion", reporter_id: "a5", tags: ["Democracy", "Labour"], publishedAt: "April 4, 2026", image: "https://picsum.photos/seed/essay/1200/500", isOpinion: true },
  { id: "art24", slug: "minimum-wage-board-worker-representation", title: "Why Bangladesh Needs a Minimum Wage Board With Real Representation", excerpt: "The structural flaws in how wages are negotiated ensure outcomes that rarely reflect the cost of living.", body: mockBody, category_slug: "opinion", reporter_id: "a5", tags: ["Wages", "Policy"], publishedAt: "April 2, 2026", image: "https://picsum.photos/seed/opinion1/400/300", isOpinion: true },
  { id: "art25", slug: "informal-workers-safety-net-crisis", title: "The Silent Crisis: How Informal Workers Are Falling Through the Safety Net", excerpt: "Without formal contracts or state support, millions face ruin during economic downturns.", body: mockBody, category_slug: "opinion", reporter_id: "a1", tags: ["Informal Sector", "Social Protection"], publishedAt: "April 1, 2026", image: "https://picsum.photos/seed/opinion2/400/300", isOpinion: true },

  // VIDEOS
  { id: "art26", slug: "inside-factories-documentary", title: "Inside the Factories: An Investigative Documentary", excerpt: "LabourPulse's award-winning documentary takes viewers inside the factory floors and dormitories.", body: mockBody, category_slug: "videos", reporter_id: "a1", tags: ["Documentary", "RMG"], publishedAt: "March 28, 2026", image: "https://picsum.photos/seed/video_feat/1200/675", isVideo: true, videoDuration: "38:12" },
  { id: "art27", slug: "dse-market-watch-april", title: "DSE Market Watch: Weekly Analysis — April 2026 Edition", excerpt: "Our analysts break down the mixed signals from the Dhaka Stock Exchange.", body: mockBody, category_slug: "videos", reporter_id: "a2", tags: ["DSE", "Markets"], publishedAt: "April 3, 2026", image: "https://picsum.photos/seed/video2/400/225", isVideo: true, videoDuration: "8:15" },
  { id: "art28", slug: "street-voices-strike", title: "Street Voices: What Dhaka Workers Think About the Strike", excerpt: "On-the-ground interviews with garment workers in Ashulia.", body: mockBody, category_slug: "videos", reporter_id: "a1", tags: ["Interviews", "Strike"], publishedAt: "April 4, 2026", image: "https://picsum.photos/seed/video7/400/225", isVideo: true, videoDuration: "4:45" }
];

export const BREAKING_NEWS = [
  { id: 1, title: "Bangladesh prepares for fuel price revision according to IMF guidelines", slug: "fuel-price-revision-imf" },
  { id: 2, title: "IMF approves $700M loan tranche for Bangladesh amid reform compliance", slug: "imf-loan-tranche-approved" },
  { id: 3, title: "National election commission announces schedule for local government polls", slug: "election-commission-local-polls" },
];

export const MARKET_DATA = [
  { id: 1, label: "DSEX", value: "6,342.50", change: "+45.20", up: true },
  { id: 2, label: "DSES", value: "1,382.10", change: "+12.05", up: true },
  { id: 3, label: "DS30", value: "2,145.80", change: "-5.40", up: false },
  { id: 4, label: "BDT/USD", value: "118.50", change: "0.00", up: true },
  { id: 5, label: "GOLD", value: "Tk 112K/Bhori", change: "+1.2K", up: true },
];

export const PHOTO_STORIES = [
  { id: 1, title: "Lives on the line: Fishermen of the Bay", slug: "fishermen-bay", image: "https://picsum.photos/seed/photo1/300/400" },
  { id: 2, title: "Urban sprawl: Dhaka from above", slug: "dhaka-from-above", image: "https://picsum.photos/seed/photo2/300/400" },
  { id: 3, title: "The vanishing art of handloom weaving", slug: "handloom-weaving", image: "https://picsum.photos/seed/photo3/300/400" },
  { id: 4, title: "Monsoon floods inundate northern lowlands", slug: "monsoon-floods-north", image: "https://picsum.photos/seed/photo4/300/400" },
  { id: 5, title: "A day in the life of a tea garden worker", slug: "tea-garden-worker", image: "https://picsum.photos/seed/photo5/300/400" },
];
