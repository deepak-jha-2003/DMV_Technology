import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, InnovaCorp",
      company: "Fortune 500 Technology Company",
      content: "DMV Technology transformed our entire infrastructure. Their cloud migration reduced our costs by 40% while improving performance dramatically. The team's expertise and dedication were exceptional.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Founder & CEO",
      company: "StartupLab",
      content: "From concept to launch, DMV Technology was instrumental in building our platform. Their agile approach and technical excellence helped us go to market 3 months ahead of schedule.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "VP of Digital",
      company: "RetailMax",
      content: "The mobile app DMV TechHub developed for us has been a game-changer. User engagement increased by 250% and our revenue grew by 60% in the first quarter after launch.",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "IT Director",
      company: "HealthCare Plus",
      content: "Security was our top concern when migrating to the cloud. TechFlow not only addressed all our security requirements but exceeded industry standards. Outstanding work!",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4 mr-2" />
            Client Testimonials
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            What Our Clients Say About
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent"> Our Work</span>
          </h2>
          <p className="text-xl text-gray-600">
            Don't just take our word for it. Here's what our clients have to say about their experience working with TechFlow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl text-white mb-6">
                <Quote className="h-6 w-6" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="border-t border-sky-100 pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sky-600 font-medium">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-sky-100">Client Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-sky-100">Average Project Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-sky-100">Client Retention Rate</div>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-xl text-sky-100 mb-6">Join hundreds of satisfied clients who trust TechFlow with their digital transformation.</p>
            <button className="bg-white text-sky-600 px-8 py-4 rounded-lg font-medium hover:bg-sky-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Start Your Project Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;