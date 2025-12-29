"use client"

type AcademicDetailsCardProps = {
  userData: {
    collegeName: string
    yearOfStudy: string
  }
}

export default function AcademicDetailsCard({ userData }: AcademicDetailsCardProps) {
  return (
    <div
      className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm"
      style={{
        clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
      }}
    >
      <h3 className="text-cyan-300 font-bold uppercase tracking-[0.15em] mb-4 text-sm">Academic Details</h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-cyan-400/70 text-xs uppercase tracking-widest">College</p>
          <p className="text-white font-semibold">{userData.collegeName}</p>
        </div>
        <div>
          <p className="text-cyan-400/70 text-xs uppercase tracking-widest">Year of Study</p>
          <p className="text-white font-semibold">{userData.yearOfStudy}</p>
        </div>
      </div>
    </div>
  )
}
