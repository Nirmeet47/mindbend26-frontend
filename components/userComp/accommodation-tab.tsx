"use client"

type Accommodation = {
  id: number
  hostel: string
  room: string
  checkIn: string
  checkOut: string
  status: string
}

type AccommodationTabProps = {
  accommodations: Accommodation[]
}

export default function AccommodationTab({ accommodations }: AccommodationTabProps) {
  if (accommodations.length === 0) {
    return <div className="text-cyan-300/60 text-center py-8">You have no accommodation bookings yet.</div>;
  }
  return (
    <div className="space-y-4">
      {accommodations.map((booking) => (
        <div
          key={booking.id}
          className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm hover:border-cyan-400 transition-all"
          style={{
            clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-cyan-400/70 text-xs uppercase tracking-widest mb-1">Hostel</p>
              <p className="text-white font-bold text-lg">{booking.hostel}</p>
            </div>
            <div>
              <p className="text-cyan-400/70 text-xs uppercase tracking-widest mb-1">Room</p>
              <p className="text-white font-bold text-lg">{booking.room}</p>
            </div>
            <div>
              <p className="text-cyan-400/70 text-xs uppercase tracking-widest mb-1">Check-in</p>
              <p className="text-white font-semibold">{booking.checkIn}</p>
            </div>
            <div>
              <p className="text-cyan-400/70 text-xs uppercase tracking-widest mb-1">Check-out</p>
              <p className="text-white font-semibold">{booking.checkOut}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest bg-green-600/30 text-green-300 border border-green-500/60">
              Booked
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
