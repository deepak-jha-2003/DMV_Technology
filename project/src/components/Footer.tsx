import React from 'react';
import { Code, Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">DMV Technology</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering businesses through innovative technology solutions. We transform ideas into digital realities that drive growth and success.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Cloud Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Web Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Mobile Apps</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">AI Integration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Cybersecurity</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Data Analytics</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Our Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">News & Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Partners</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-sky-400" />
                  <span className="text-gray-400">+91 (963) 196-7939</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-sky-400" />
                  <span className="text-gray-400">hello@DMVTechnology.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-sky-400 mt-0.5" />
                  <span className="text-gray-400">
                    123 Innovation Drive<br />
                    Tech City, TC 12345<br />
                    India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to our newsletter for the latest tech insights and company updates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              />
              <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} DMV Technology. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;