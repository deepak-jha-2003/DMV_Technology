import React from 'react';
import { Cloud, Smartphone, Globe, Shield, Database, Cpu, Zap, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and migration services to optimize your business operations and reduce costs.",
      features: ["AWS/Azure Migration", "Auto-scaling", "Cost Optimization"]
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.",
      features: ["iOS & Android", "React Native", "Flutter"]
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Web Development",
      description: "Modern, responsive web applications built with cutting-edge technologies and best practices.",
      features: ["React/Next.js", "Node.js", "Progressive Web Apps"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets and ensure compliance.",
      features: ["Penetration Testing", "Security Audits", "Compliance"]
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Analytics",
      description: "Turn your data into actionable insights with advanced analytics and machine learning solutions.",
      features: ["Business Intelligence", "ML Models", "Real-time Analytics"]
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "AI Integration",
      description: "Leverage artificial intelligence to automate processes and enhance decision-making capabilities.",
      features: ["Custom AI Models", "Automation", "NLP Solutions"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Our Services
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Comprehensive IT Solutions for
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent"> Modern Businesses</span>
          </h2>
          <p className="text-xl text-gray-600">
            We offer a full spectrum of technology services designed to accelerate your digital transformation journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-sky-600 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="text-sky-600 font-medium hover:text-sky-700 transition-colors group-hover:translate-x-1 transform duration-200 inline-flex items-center">
                  Learn More
                  <span className="ml-1 group-hover:ml-2 transition-all duration-200">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Need a custom solution? We've got you covered.</p>
          <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Discuss Your Project
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;