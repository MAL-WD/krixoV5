import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Now from "./assets/Now.svg"
import './App.css'
import Header from './components/Header'
import van3 from './assets/Van_Mockup_3.png'
import emailjs from '@emailjs/browser';
import { createCommand } from './services/apiWithProxy';

import Button from './components/Button'
import Gallery from './components/Gallery'
import Reveal from './components/Reveal'
import FAQ from './components/FAQ'
import RevealX from './components/RevealX'
import TestimonialSlider from './components/TestimonialSlider'
import Footer from './components/Footer'

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    services: [],
    floor: 0,
    isGroundOrFirst: '',
    itemType: '',
    workers: 0,
    start: '',
    end: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    if (type === 'checkbox') {
      // Handle service checkboxes
      const updatedServices = checked 
        ? [...form.services, value] 
        : form.services.filter(s => s !== value);
      
      // Update form with the new services array
      setForm(prev => {
        // Only require workers (set to 1) for "ترتيب" service
        // For "ترحيل" and "نقل المشتريات", workers can start at 0
        const needsWorkers = updatedServices.includes("ترتيب");
        const updatedWorkers = 
          needsWorkers && prev.workers === 0 ? 1 : prev.workers;
        
        // If no services are selected, reset workers to 0
        const finalWorkers = updatedServices.length > 0 ? updatedWorkers : 0;
        
        return {
          ...prev,
          services: updatedServices,
          workers: finalWorkers
        };
      });
      
      // Clear services error if any services are selected
      if (updatedServices.length > 0) {
        setErrors(prev => ({ ...prev, services: '' }));
      }
    } else if (type === 'number') {
      const numberValue = parseInt(value, 10);
      
      if (!isNaN(numberValue)) {
        setForm(prev => ({ ...prev, [name]: numberValue }));
      } else if (value === '') {
        setForm(prev => ({ ...prev, [name]: '' }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Calculate price whenever form changes
  useEffect(() => {
    calculatePrice();
  }, [form]);

  const calculatePrice = () => {
    let total = 0;
    let floorCostPerWorker = 0;
    
    // Calculate floor additional cost per worker
    if (form.isGroundOrFirst === '') {
      if (form.floor > 1) {
        // 250 دج إضافية لكل طابق فوق الأول لكل عامل
        floorCostPerWorker = (form.floor - 1) * 250;
      }
    }
    
    // Calculate base service costs
    if (form.services.includes("ترحيل")) {
      total += 8000;
    }
    
    if (form.services.includes("ترتيب")) {
      total += 2000;
    }
    
    if (form.services.includes("نقل المشتريات")) {
      total += 600;
    }
    
    // Base cost per worker - exactly 1500 per worker
    const baseWorkerCost = 1500;
    
    // Calculate worker costs including floor additions
    const totalWorkerCost = form.workers * (baseWorkerCost + floorCostPerWorker);
    total += totalWorkerCost;
    
    setPrice(total);
    return total;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // fullname validation
    if (!form.name.trim()) {
      newErrors.name = 'الرجاء إدخال الاسم واللقب';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'الاسم قصير جدًا';
    }
    
    // Phone validation - Algerian phone number format
    const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!form.phone) {
      newErrors.phone = 'الرجاء إدخال رقم الهاتف';
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'رقم هاتف غير صالح';
    }
    
    // Services validation
    if (form.services.length === 0) {
      newErrors.services = 'الرجاء اختيار خدمة واحدة على الأقل';
    }
    
    // Floor validation for relevant services
    if ((form.services.includes('ترحيل') || form.services.includes('ترتيب'))) {
      if (form.isGroundOrFirst === '' && (isNaN(form.floor) || form.floor < 2)) {
        newErrors.floor = 'الرجاء تحديد الطابق بشكل صحيح';
      }
    }
    
    // Item type validation for purchase transport service
    if (form.services.includes('نقل المشتريات') && !form.itemType.trim()) {
      newErrors.itemType = 'الرجاء إدخال نوع المنقول';
    }
    
    // Workers validation - Only require workers for "ترتيب" service
    if (form.services.includes('ترتيب') && form.workers < 1) {
      newErrors.workers = 'يجب أن يكون هناك عامل واحد على الأقل للترتيب';
    }
    
    // Location validation
    if (!form.start.trim()) {
      newErrors.start = 'الرجاء إدخال نقطة البداية';
    }
    
    if (!form.end.trim()) {
      newErrors.end = 'الرجاء إدخال نقطة النهاية';
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Calculate price
      const price = calculatePrice();
      
      // Prepare command data
      const commandData = {
        name: form.name,
        phone: form.phone,
        services: form.services,
        floor: form.isGroundOrFirst || form.floor,
        itemType: form.itemType,
        workers: form.workers,
        start: form.start,
        end: form.end,
        description: form.description,
        price: price,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Use the improved API service with multiple proxy fallbacks
      console.log('🚀 Submitting command with improved API service...');
      const response = await createCommand(commandData);
      console.log('✅ Command submitted successfully:', response);

      // Send email notification
      const templateParams = {
        fullname: form.name,
        phone: form.phone,
        services: form.services.join(', '),
        floor: form.isGroundOrFirst || `الطابق ${form.floor}`,
        itemType: form.itemType || 'غير محدد',
        workers: form.workers,
        start: form.start,
        end: form.end,
        description: form.description || 'لا يوجد',
        price: price,
      };

      await emailjs.send(
        'service_w2rjkio',
        'template_command_created', // Update this to your actual template
        templateParams,
        'u78EYyDgHj3kkBcVv'
      );

      // Success message
      toast.success('تم إرسال طلبك بنجاح، سنتصل بك قريبًا');
      
      // Reset form
      setForm({
        name: '',
        phone: '',
        services: [],
        floor: 2,
        isGroundOrFirst: '',
        itemType: '',
        workers: 0,
        start: '',
        end: '',
        description: '',
      });
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      toast.error(error.message || 'حدث خطأ أثناء إرسال النموذج، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Determine if workers are required based on selected services
  const isWorkersRequired = form.services.includes('ترتيب');
  const minWorkersValue = isWorkersRequired ? 1 : 0;

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            fontFamily: 'Cairo, sans-serif',
            direction: 'rtl',
            background: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#0066FF',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <main>
        <section id='Home' className="landing-page min-h-screen w-full flex items-center pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="container mx-auto px-4 flex flex-col gap-12">
            <div className="flex flex-col md:flex-row justify-between gap-12 items-center">
              <Reveal style={"flex-[70%]"}>
                <h1 className="font-extrabold flex-2/3 text-5xl md:text-7xl lg:text-9xl text-white leading-tight md:leading-tight text-center md:text-right">
                  <span className='text-blue'> تواصل</span> معنا  <br />
                  <div className="flex gap-4 md:gap-10 items-center justify-left md:justify-left mt-4"> 
                    ألآن  
                    <span className='text-yellow'>!</span> 
                    <img className='w-24 md:w-42 inline' src={Now} alt="الآن" /> 
                  </div>
                </h1>
              </Reveal>
              <Reveal delay={0.5} style={"flex-[40%]"}>
            <img className='w-full  mt-8' src={van3} alt="" />
              </Reveal>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-xl max-w-3xl mx-auto mt-8 text-right" dir="rtl">
              <h2 className="text-2xl font-bold mb-6 text-blue-500 text-center">طلب خدمة</h2>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">الاسم واللقب <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="أدخل اسمك الكامل" 
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} 
                  required 
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">رقم الهاتف <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="05xxxxxxxx" 
                  className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} 
                  required 
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">الخدمات <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['ترحيل', 'ترتيب', 'نقل المشتريات'].map(service => (
                    <label key={service} className={`flex items-center gap-2 text-black cursor-pointer p-3 border rounded-lg ${form.services.includes(service) ? 'bg-blue-50 border-blue-500' : 'border-gray-300'} transition-all hover:bg-blue-50`}>
                      <input 
                        type="checkbox" 
                        name="services"
                        value={service} 
                        checked={form.services.includes(service)} 
                        onChange={handleChange} 
                        className="h-5 w-5 text-blue-500 focus:ring-blue-500 rounded" 
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
                {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
              </div>
              
              {(form.services.includes('ترحيل') || form.services.includes('ترتيب')) && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2 text-gray-700">حدد الطابق <span className="text-red-500">*</span></label>
                  <select 
                    name="isGroundOrFirst" 
                    value={form.isGroundOrFirst} 
                    onChange={handleChange} 
                    className={`mb-4 w-full border ${errors.floor ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-2 p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                  >
                    <option value="">طابق آخر</option>
                    <option value="أرضي">أرضي</option>
                    <option value="الأول">الأول</option>
                  </select>
                  
                  {form.isGroundOrFirst === '' && (
                    <input 
                      type="number" 
                      name="floor" 
                      value={form.floor} 
                      min={2} 
                      onChange={handleChange} 
                      className={`w-full  border ${errors.floor ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} 
                    />
                  )}
                  {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
                </div>
              )}
              
              {form.services.includes('نقل المشتريات') && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2 text-gray-700">نوع المنقول <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="itemType" 
                    value={form.itemType} 
                    onChange={handleChange} 
                    placeholder="أدخل نوع السلعة أو المشتريات" 
                    className={`w-full border ${errors.itemType ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} 
                  />
                  {errors.itemType && <p className="text-red-500 text-sm mt-1">{errors.itemType}</p>}
                </div>
              )}
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  عدد اليد العاملة {isWorkersRequired && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => {
                      if (form.workers > minWorkersValue) {
                        setForm(prev => ({ ...prev, workers: prev.workers - 1 }));
                      }
                    }}
                    disabled={form.services.length === 0 || form.workers <= minWorkersValue}
                    className="px-4 py-3 bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 transition"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    name="workers" 
                    value={form.workers} 
                    min={minWorkersValue}
                    onChange={handleChange} 
                    className={`w-full text-center border-0 p-3 text-black focus:outline-none ${errors.workers ? 'bg-red-50' : 'bg-gray-100'}`} 
                    required={isWorkersRequired}
                    disabled={form.services.length === 0}
                  />
                  <button 
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, workers: prev.workers + 1 }))}
                    disabled={form.services.length === 0}
                    className="px-4 py-3 bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 transition"
                  >
                    +
                  </button>
                </div>
                {errors.workers && <p className="text-red-500 text-sm mt-1">{errors.workers}</p>}
                {form.services.length === 0 && <p className="text-gray-500 text-sm mt-1">يرجى اختيار خدمة أولاً</p>}
                {form.services.includes('ترتيب') && <p className="text-blue-500 text-sm mt-1">خدمة الترتيب تتطلب عامل واحد على الأقل</p>}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">نقطة البداية <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="start" 
                  value={form.start} 
                  onChange={handleChange} 
                  placeholder="مثال: حي البدر, بشار" 
                  className={`w-full border ${errors.start ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} 
                />
                {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">نقطة النهاية <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="end" 
                  value={form.end} 
                  onChange={handleChange} 
                  placeholder="مثال: شارع النخيل، قنادسة" 
                  className={`w-full border ${errors.end ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} 
                />
                {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">وصف إضافي (اختياري)</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="أدخل ملاحظات أو تفاصيل إضافية" 
                  className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                  rows={4}
                ></textarea>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-xl font-bold text-blue-500 bg-blue-50 px-6 py-3 rounded-lg">السعر: {price} دج</div>
                <button 
                  type="submit" 
                  className={`bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition min-w-[150px] flex items-center justify-center ${isSubmitting || form.services.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting || form.services.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : 'إرسال الطلب'}
                </button>
              </div>
            </form>
             
          </div>
        </section>
        {/* Footer Section */}
            <Footer/>
      
      </main>
    </>
  )
}

export default ContactPage;