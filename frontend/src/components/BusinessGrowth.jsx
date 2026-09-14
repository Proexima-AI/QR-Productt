import React from 'react';
import { Shield, TrendingUp, Users, Smartphone, Zap, RefreshCw } from 'lucide-react';

const BusinessGrowth = () => {
  const cards = [
    {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      icon: Shield,
      title: 'Build Trust',
      text: 'More visible customer feedback helps new customers feel confident choosing the business.'
    },
    {
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      icon: TrendingUp,
      title: 'Strengthen Your Google Presence',
      text: 'Consistently collecting customer feedback gives the business more fresh reviews on its Google profile.'
    },
    {
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      icon: Users,
      title: 'Win More Customers',
      text: 'Strong social proof can help potential customers choose your business over competitors.'
    },
    {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      icon: Smartphone,
      title: 'Make Feedback Easy',
      text: 'A simple QR scan removes friction and gives customers a quick way to share their experience.'
    },
    {
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-500',
      icon: Zap,
      title: 'Save Staff Time',
      text: 'No complicated process for employees. Display the QR code and let customers start the feedback flow themselves.'
    },
    {
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      icon: RefreshCw,
      title: 'Turn Every Visit Into an Opportunity',
      text: 'Put the QR code at the counter, table, receipt, packaging, or other customer touchpoints.'
    }
  ];

  return (
    <section className="w-[100vw] ml-[calc(-50vw+50%)] py-12 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px]"></div>
      </div>

      <div className="w-[95%] max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-[3.5rem] font-serif font-extrabold text-[#0B1A30] leading-tight mb-4 tracking-tight">
            Turn Reviews Into <br className="hidden md:block" />
            <span className="text-blue-600">Business Growth</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            More genuine customer feedback. More trust. More customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col items-start text-left"
            >
              <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6`}>
                <card.icon className={`w-7 h-7 ${card.iconColor}`} strokeWidth={2} />
              </div>
              
              <h3 className="text-[#0B1A30] text-[1.35rem] font-bold mb-3 tracking-tight">
                {card.title}
              </h3>
              
              <p className="text-slate-500 leading-relaxed text-[0.95rem]">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessGrowth;
