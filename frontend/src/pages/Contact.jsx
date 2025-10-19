import React from 'react';

const Contact = () => {
  return (
    <main className='my-24'>
      <div className='mx-auto px-6 lg:px-12 py-10 bg-gradient-to-r from-yellow-400 via-yellow-200 to-white'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-800 mb-6'>Contact Us</h1>
          <p className='text-gray-700 mb-8'>
            We'd love to hear from you! Whether you have a question about properties, feedback, or just want to say hello, feel free to reach out.
          </p>

          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Name</label>
              <input
                type='text'
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='Your name'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Email</label>
              <input
                type='email'
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='you@example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Contact Number</label>
              <input
                type='tel'
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='e.g. +91 9876543210'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Message</label>
              <textarea
                rows='4'
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='Write your message here...'
              ></textarea>
            </div>

            <button className='bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md'>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;