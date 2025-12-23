"use client"

type PersonalDetailsCardProps = {
  userData: {
    fullName: string
    email: string
    contactNumber: string
  }
}

export default function PersonalDetailsCard({ userData }: PersonalDetailsCardProps) {
  return (
    <div
      className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm"
      style={{
        clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
      }}
    >
      <h3 className="text-cyan-300 font-bold uppercase tracking-[0.15em] mb-4 text-sm">Personal Details</h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-cyan-400/70 text-xs uppercase tracking-[0.1em]">Full Name</p>
          <p className="text-white font-semibold">{userData.fullName}</p>
        </div>
        <div>
          <p className="text-cyan-400/70 text-xs uppercase tracking-[0.1em]">Email</p>
          <p className="text-white font-semibold">{userData.email}</p>
        </div>
        <div>
          <p className="text-cyan-400/70 text-xs uppercase tracking-[0.1em]">Contact</p>
          <p className="text-white font-semibold">{userData.contactNumber}</p>
        </div>
      </div>
    </div>
  )
}
