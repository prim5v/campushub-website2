
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

export function SignupForm() {
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!data.campus.trim()) newErrors.campus = 'Campus is required';
    if (!data.budget.trim()) newErrors.budget = 'Budget is required';
    if (!data.location.trim()) newErrors.location = 'Location is required';
    if (!data.moveInDate) newErrors.moveInDate = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');

    // Simulate network request
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 rounded-2xl p-8 md:p-12 text-center border border-emerald-100 my-8">
        
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">You're on the list!</h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Thanks for requesting early access. We'll be in touch soon with your personalized housing matches.
        </p>
      </motion.div>);

  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10 mb-8 relative overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50"></div>

      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Get Priority Access</h2>
        <p className="text-gray-600">Be the first to see listings before they go live.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            name="fullName"
            className={`w-full px-4 py-3.5 rounded-xl border ${errors.fullName ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-emerald-500 bg-gray-50/50'} focus:bg-white focus:border-transparent focus:ring-2 outline-none transition-all`}
            placeholder="John Doe" />
          
          {errors.fullName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone Number <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            className={`w-full px-4 py-3.5 rounded-xl border ${errors.phone ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-emerald-500 bg-gray-50/50'} focus:bg-white focus:border-transparent focus:ring-2 outline-none transition-all`}
            placeholder="e.g. 0712 345 678" />
          
          {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campus</label>
            <input
              type="text"
              name="campus"
              className={`w-full px-4 py-3.5 rounded-xl border ${errors.campus ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-emerald-500 bg-gray-50/50'} focus:bg-white focus:border-transparent focus:ring-2 outline-none transition-all`}
              placeholder="e.g. University of Nairobi" />
            
            {errors.campus && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.campus}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget (KES)</label>
            <input
              type="number"
              name="budget"
              className={`w-full px-4 py-3.5 rounded-xl border ${errors.budget ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-emerald-500 bg-gray-50/50'} focus:bg-white focus:border-transparent focus:ring-2 outline-none transition-all`}
              placeholder="e.g. 15000" />
            
            {errors.budget && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.budget}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Location</label>
            <input
              type="text"
              name="location"
              className={`w-full px-4 py-3.5 rounded-xl border ${errors.location ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-emerald-500 bg-gray-50/50'} focus:bg-white focus:border-transparent focus:ring-2 outline-none transition-all`}
              placeholder="e.g. Kilimani, South B" />
            
            {errors.location && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.location}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Move-in Date</label>
            <input
              type="date"
              name="moveInDate"
              className={`w-full px-4 py-3.5 rounded-xl border ${errors.moveInDate ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-emerald-500 bg-gray-50/50'} focus:bg-white focus:border-transparent focus:ring-2 outline-none transition-all text-gray-700`} />
            
            {errors.moveInDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.moveInDate}</p>}
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-center mb-4 text-amber-700 bg-amber-50/80 py-2.5 px-4 rounded-lg text-sm font-medium border border-amber-100/50">
            <Clock className="w-4 h-4 mr-2 text-amber-600" />
            Limited early access. We're onboarding students before listings go live.
          </div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center text-lg disabled:opacity-70 active:scale-[0.98]">
            
            {status === 'submitting' ?
            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span> :
            'Get Priority Access →'}
          </button>
        </div>
      </form>
    </motion.div>);

}