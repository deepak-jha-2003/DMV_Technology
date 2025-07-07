import { Award, Users, Target, Lightbulb } from 'lucide-react';

const About = () => {
  const stats = [
    { number: "5+", label: "Years Experience" },
    { number: "15+", label: "Team Members" },
    { number: "35+", label: "Projects Completed" },
    { number: "50+", label: "Countries Served" }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Mission-Driven",
      description: "We're committed to delivering solutions that create real business value and drive measurable results."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation First",
      description: "We stay ahead of technology trends to provide cutting-edge solutions that future-proof your business."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client-Centric",
      description: "Your success is our success. We work as an extension of your team to achieve your goals."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence Standard",
      description: "We maintain the highest standards of quality and professionalism in every project we undertake."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="h-4 w-4 mr-2" />
            About DMV Technology
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Building the Future of
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent"> Digital Excellence</span>
          </h2>
          <p className="text-xl text-gray-600">
            Founded in 2021, TechFlow has grown from a small startup to a leading IT solutions provider, helping businesses worldwide embrace digital transformation.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-sky-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Empowering Businesses Through Technology Innovation
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              At DMV Technology, we believe technology should be an enabler, not a barrier. Our team of expert developers, designers, and strategists work together to create solutions that not only solve today's challenges but anticipate tomorrow's opportunities.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From startups to Now 10+ companies, we've helped organizations across industries leverage technology to accelerate growth, improve efficiency, and create competitive advantages in an ever-evolving digital landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200">
                Our Story
              </button>
              <button className="border border-sky-300 text-sky-600 px-6 py-3 rounded-lg font-medium hover:bg-sky-50 transition-all duration-200">
                Meet the Team
              </button>
            </div>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="relative">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl p-8 text-white">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Certified</div>
                    <div className="text-sky-100 text-sm">Security & Quality Standards</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">A+</div>
                    <div className="text-sky-100 text-sm">Security Rating</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sky-100 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl text-white mb-4">
                {value.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;