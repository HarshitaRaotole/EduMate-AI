import { Twitter, Facebook, Linkedin, Rss } from "lucide-react" // Using Rss for Medium-like icon

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Features Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">Features</h3>
          <ul className="space-y-2 sm:space-y-3">
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                Smart Scheduling
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                Subject Management
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                Assignment Tracking
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                Progress Analytics
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                AI Study Assistant
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                Smart Reminders
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">Contact</h3>
          <ul className="space-y-2 sm:space-y-3">
            <li>
              <p className="text-gray-300 text-sm sm:text-base">support@edumateai.com</p>
            </li>
            <li>
              <p className="text-gray-300 text-sm sm:text-base">+91 9340029112</p>
            </li>
            <li className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Rss className="h-5 w-5" /> {/* Using Rss as a placeholder for Medium-like icon */}
              </a>
            </li>
            <li className="mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 text-center">
        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
