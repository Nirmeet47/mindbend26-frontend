"use client";

const lecturers = [
  { name: "Dr. G. Satheesh Reddy", role: "Ex-Chairman, DRDO", img: "https://via.placeholder.com/150" },
  { name: "Mr. Sonam Wangchuk", role: "Innovator & Educationist", img: "https://via.placeholder.com/150" },
  { name: "Previous Speaker", role: "Tech Leader", img: "https://via.placeholder.com/150" },
];

const workshops = [
  "Generative AI & LLMs", "Cybersecurity in FinTech", "Robotics & Automation", "Blockchain Development"
];

export const Lecturers = () => (
  <section className="py-20 px-4 max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-white mb-10 border-l-4 border-mindbend-neon pl-4">Past Visionaries</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {lecturers.map((l, i) => (
        <div key={i} className="group relative overflow-hidden rounded-xl border border-gray-800 bg-mindbend-darkBlue/60 hover:border-mindbend-neon transition-all">
          <div className="h-48 bg-gray-700/50 flex items-center justify-center text-gray-500">
             {/* Replace img src with real images */}
             <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url(${l.img})`}}></div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white group-hover:text-mindbend-neon">{l.name}</h3>
            <p className="text-sm text-gray-400">{l.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const Workshops = () => (
  <section className="py-20 bg-mindbend-black relative">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-white mb-10 text-right border-r-4 border-mindbend-neon pr-4">Workshops</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {workshops.map((w, i) => (
          <div key={i} className="p-6 border border-mindbend-neon/20 rounded-lg hover:bg-mindbend-neon/10 transition-colors cursor-pointer">
            <h3 className="text-lg font-semibold text-white mb-2">{w}</h3>
            <p className="text-gray-500 text-sm">Hands-on experience with industry experts.</p>
            <div className="mt-4 text-mindbend-neon text-sm font-bold flex items-center gap-2">
              Learn More &rarr;
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);