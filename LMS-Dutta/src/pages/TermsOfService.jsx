import React from 'react';
import { motion } from 'framer-motion';
import { ArrowBack, Gavel, School, Payment, Security } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo1.png';

const TermsOfService = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <School className="text-red-600" style={{ fontSize: '28px' }} />,
      title: "1. Service Overview",
      content: `Our Learning Management System (LMS) provides online educational courses, resources, and certifications. By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.`
    },
    {
      icon: <Payment className="text-red-600" style={{ fontSize: '28px' }} />,
      title: "2. Payment Terms",
      content: `All course fees are processed securely through Razorpay, our authorized payment gateway. Payments are non-refundable unless otherwise stated in our Refund Policy. By making a purchase, you authorize us to charge the payment method you provide. All prices are listed in Indian Rupees (INR) and include applicable taxes.`,
      subsections: [
        "Course access is granted immediately upon successful payment confirmation",
        "Subscription-based courses renew automatically unless canceled",
        "Failed payments may result in temporary suspension of course access",
        "We reserve the right to modify course pricing with prior notice"
      ]
    },
    {
      icon: <Security className="text-red-600" style={{ fontSize: '28px' }} />,
      title: "3. User Account Responsibilities",
      content: `You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account.`,
      subsections: [
        "Provide accurate and complete registration information",
        "Keep your password secure and confidential",
        "Do not share your account with others",
        "Notify us immediately of any security breaches"
      ]
    },
    {
      icon: <Gavel className="text-red-600" style={{ fontSize: '28px' }} />,
      title: "4. Acceptable Use Policy",
      content: `You agree not to use our platform for any unlawful purpose or in any way that could damage, disable, or impair our services.`,
      subsections: [
        "Do not copy, distribute, or modify course content without permission",
        "Respect intellectual property rights of instructors and other users",
        "Do not engage in harassment, abuse, or fraudulent activities",
        "Do not attempt to gain unauthorized access to our systems",
        "Do not use automated tools to scrape or download content"
      ]
    },
    {
      title: "5. Intellectual Property",
      content: `All course materials, including videos, documents, quizzes, and assessments, are the intellectual property of our platform and respective course instructors. Users are granted a limited, non-transferable license to access and use the content solely for personal educational purposes.`
    },
    {
      title: "6. Refund and Cancellation Policy",
      content: `Refunds are available within 7 days of purchase if less than 20% of the course content has been accessed. Refund requests must be submitted through our support system. Processing time for approved refunds is 5-7 business days through Razorpay.`
    },
    {
      title: "7. Course Access and Availability",
      content: `Once enrolled, you will have lifetime access to purchased courses unless explicitly stated otherwise. We reserve the right to modify, update, or discontinue courses with reasonable notice to enrolled students. Platform maintenance and updates may temporarily affect course availability.`
    },
    {
      title: "8. Certification and Credentials",
      content: `Certificates of completion are awarded upon successful completion of course requirements. These certificates are for educational purposes and do not constitute professional accreditation unless specifically stated. We are not responsible for how third parties may interpret or accept our certificates.`
    },
    {
      title: "9. Third-Party Services",
      content: `Our platform integrates with third-party services including Razorpay for payments. We are not responsible for the actions, policies, or content of third-party services. Your use of these services is subject to their respective terms and privacy policies.`
    },
    {
      title: "10. Limitation of Liability",
      content: `We strive to provide accurate and high-quality educational content. However, we do not guarantee specific learning outcomes or career advancement. Our liability is limited to the amount you paid for the specific course or service in question.`
    },
    {
      title: "11. Termination",
      content: `We reserve the right to suspend or terminate your account for violation of these terms, fraudulent activity, or any other reason we deem necessary. Upon termination, your access to courses and content will be revoked.`
    },
    {
      title: "12. Modifications to Terms",
      content: `We may update these Terms of Service from time to time. Continued use of our platform after changes constitutes acceptance of the modified terms. We will notify users of significant changes via email or platform notifications.`
    },
    {
      title: "13. Governing Law",
      content: `These Terms of Service are governed by the laws of India. Any disputes arising from these terms or your use of our platform will be subject to the exclusive jurisdiction of courts in [Your City/State].`
    },
    {
      title: "14. Contact Information",
      content: `For questions regarding these Terms of Service, please contact us at support@yourplatform.com or through our help center.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowBack />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <img src={logo1} alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                LMS Platform
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Gavel style={{ fontSize: '40px' }} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform
            </p>
            <p className="text-sm text-red-200 mt-4">
              Last Updated: February 2, 2026
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
        >
          {/* Introduction */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Our Learning Platform
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of our Learning Management System platform, 
              including all courses, content, features, and services we provide. By creating an account or accessing our 
              platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {section.icon && (
                    <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      {section.icon}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed ml-16 mb-4">
                  {section.content}
                </p>
                {section.subsections && (
                  <ul className="ml-16 space-y-2">
                    {section.subsections.map((subsection, subIndex) => (
                      <li key={subIndex} className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-600 mt-1.5 flex-shrink-0">•</span>
                        <span className="leading-relaxed">{subsection}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

          {/* Acceptance */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Acceptance of Terms
              </h3>
              <p className="text-gray-600 leading-relaxed">
                By clicking "I Agree" or by accessing our services, you confirm that you have read, 
                understood, and agree to be bound by these Terms of Service. If you do not agree with 
                any part of these terms, please do not use our platform.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/privacy')}
            className="text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            Read our Privacy Policy →
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Back to Platform
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;