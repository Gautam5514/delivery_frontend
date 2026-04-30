import { Rocket, Lightbulb, Handshake, Users } from "lucide-react";

const aboutItems = [
  {
    title: "Our Mission",
    description: "To build an ecosystem that brings out the photographer and socialite inside every human",
    icon: Rocket,
    bgColor: "bg-[#5fa8ca]", // Exact blue from the image
  },
  {
    title: "Our Vision",
    description: "To globally revolutionize photo-sharing using AI",
    icon: Lightbulb,
    bgColor: "bg-[#dced00]", // Exact yellow from the image
  },
  {
    title: "Our Value",
    description: "A community that values quality & convenience",
    icon: Handshake,
    bgColor: "bg-[#dced00]", // Exact yellow from the image
  },
  {
    title: "Our Culture",
    description: "Innovative, Fun & Progressive",
    icon: Users,
    bgColor: "bg-[#5fa8ca]", // Exact blue from the image
  },
];

export default function AboutMissionSection() {
  return (
    <section className="relative w-full bg-zinc-50 pb-24">
      
      {/* Background Image & Hero Overlay */}
      <div className="relative w-full h-[550px] lg:h-[600px]">
        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070&auto=format&fit=crop"
          alt="Indian event celebration crowd"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay to match the image's readable background */}
        <div className="absolute inset-0 bg-[#162135]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col items-center justify-start px-4 pt-20 text-center sm:pt-28">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            We Deliver Memories
          </h1>
          <p className="max-w-3xl text-base sm:text-lg lg:text-xl font-medium text-white/95 leading-relaxed">
            A photo sharing platform that allows you to seamlessly upload, share and store photos seamlessly
          </p>
        </div>
      </div>

      {/* Overlapping Grid Container */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-30 lg:-mt-40">
        <div className="bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-blue-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {aboutItems.map((item, index) => {
              const Icon = item.icon;
              
              // Logic to handle exact inner borders matching the image
              const isTopRow = index < 2;
              const isLeftCol = index % 2 === 0;

              return (
                <div
                  key={item.title}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 p-10 lg:px-12 lg:py-14
                    ${isTopRow ? "border-b border-sky-100" : ""}
                    ${isLeftCol ? "md:border-r border-sky-100" : ""}
                  `}
                >
                  {/* Icon Circle */}
                  <div
                    className={`flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full ${item.bgColor}`}
                  >
                    <Icon className="h-[38px] w-[38px] text-[#1a2b3c]" strokeWidth={1.25} />
                  </div>
                  
                  {/* Text Content */}
                  <div>
                    <h3 className="text-[28px] font-bold tracking-tight text-zinc-900 mb-2 font-serif">
                      {item.title}
                    </h3>
                    <p className="text-lg text-zinc-700 leading-snug font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
            
          </div>
        </div>
      </div>
      
    </section>
  );
}
