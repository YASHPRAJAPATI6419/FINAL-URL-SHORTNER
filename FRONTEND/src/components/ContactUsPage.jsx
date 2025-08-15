import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Heroicons imports removed as per request to resolve 'EnvelopeIcon is not defined' error.
// Icons replaced with emojis or simple text for now.

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(''); // To display submission status

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    // Simulate API call
    try {
      // In a real application, you would send this data to your backend API endpoint
      // For example, if you have a backend at '/api/send-email' that handles email sending:
      /*
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
      } else {
        const errorData = await response.json();
        console.error('Error submitting contact form:', errorData);
        setStatus(`Failed to send message: ${errorData.message || 'Server error'}`);
      }
      */

      console.log('Form Data Submitted (simulated):', formData); // For now, just log to console
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      setStatus('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 flex flex-col items-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Contact Us
        </h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-10">
          Have questions, feedback, or need assistance? Reach out to us! We're here to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {/* Icon replaced with emoji for now */}
              <span className="text-blue-600 dark:text-blue-400 text-3xl">✉️</span> 
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Us</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <a href="mailto:prajapatiyash800285@gmail.com" className="hover:underline text-blue-600 dark:text-blue-400">
                    prajapatiyash800285@gmail.com
                  </a>
                  <br />
                  <a href="mailto:jay91451@gmail.com" className="hover:underline text-blue-600 dark:text-blue-400">
                    jay91451@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Icon replaced with emoji for now */}
              <span className="text-purple-600 dark:text-purple-400 text-3xl">📞</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Call Us</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  +91 - 9429570237
                  <br />
                  +91 - 7046249240
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Icon replaced with emoji for now */}
              
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                placeholder="Regarding your service..."
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                rows="5"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none resize-y"
                placeholder="Tell us how we can help..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              disabled={status === 'Submitting...'}
            >
              {status === 'Submitting...' ? 'Sending...' : 'Send Message'}
            </motion.button>
            {status && (
              <p className={`mt-4 text-center text-sm ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {status}
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUsPage;
