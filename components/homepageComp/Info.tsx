export const Committee = () => (
  <section className="py-20 px-4 max-w-7xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-white mb-12">The <span className="text-mindbend-neon">Team</span></h2>
    <div className="flex flex-wrap justify-center gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-64 bg-mindbend-darkBlue border border-gray-800 rounded-2xl p-6 hover:scale-105 transition-transform">
          <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto mb-4 border-2 border-mindbend-neon"></div>
          <h3 className="text-xl text-white font-bold">Member Name</h3>
          <p className="text-mindbend-neon text-sm">Chairperson</p>
        </div>
      ))}
    </div>
  </section>
);

export const ContactMap = () => (
  <section className="py-10 bg-mindbend-darkBlue border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl text-white font-bold mb-4">Visit SVNIT</h3>
        <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.669837130635!2d72.7834!3d21.1663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dec8b56fdf3%3A0x6a17b07008603689!2sSardar%20Vallabhbhai%20National%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1625555555555!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-2xl text-white font-bold mb-4">Contact Us</h3>
        <p className="text-gray-400 mb-2">Ichchhanath, Surat, Gujarat 395007</p>
        <p className="text-gray-400 mb-2">Email: contact@mindbendsvnit.in</p>
        <p className="text-gray-400">Phone: +91 98765 43210</p>
      </div>
    </div>
  </section>
);