import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import UserDetailContext from '../context/UserDetailContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { userDetails: { token } } = useContext(UserDetailContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to send a message');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/contact/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='my-24'>
      <div className='mx-auto px-6 lg:px-12 py-10 bg-gradient-to-r from-yellow-400 via-yellow-200 to-white'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-800 mb-6'>Contact Us</h1>
          <p className='text-gray-700 mb-8'>
            We'd love to hear from you! Whether you have a question about properties, feedback, or just want to say hello, feel free to reach out.
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Name *</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='Your name'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Email *</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                required
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='you@example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Contact Number</label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='e.g. +91 9876543210'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Subject</label>
              <input
                type='text'
                name='subject'
                value={formData.subject}
                onChange={handleInputChange}
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='Subject of your message'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Message *</label>
              <textarea
                name='message'
                value={formData.message}
                onChange={handleInputChange}
                required
                rows='4'
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='Write your message here...'
              ></textarea>
            </div>

            <button 
              type='submit'
              disabled={isSubmitting}
              className={`${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-yellow-500 hover:bg-yellow-600'
              } text-white font-semibold px-6 py-2 rounded-md transition-colors`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;