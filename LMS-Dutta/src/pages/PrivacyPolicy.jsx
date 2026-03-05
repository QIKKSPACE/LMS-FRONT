import React from 'react';
import { motion } from 'framer-motion';
import { ArrowBack, Shield, Lock, Cookie, Visibility, CloudSync, DeleteForever } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo1.png';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Shield className="text-blue-600" style={{ fontSize: '28px' }} />,
      title: "1. Information We Collect",
      content: `We collect information that you provide directly to us, information we obtain automatically when you use our services, and information from third-party sources.`,
      subsections: [
        {
          subtitle: "Personal Information:",
          items: [
            "Name, email address, and phone number",
            "Profile picture and bio (optional)",
            "Educational background and learning preferences",
            "Payment information (processed securely through Razorpay)"
          ]
        },
        {
          subtitle: "Usage Information:",
          items: [
            "Course enrollment and completion data",
            "Quiz and assignment submissions and scores",
            "Time spent on courses and learning patterns",
            "Device information, IP address, and browser type"
          ]
        },
        {
          subtitle: "Communication Data:",
          items: [
            "Messages sent through our platform",
            "Support ticket history",
            "Email correspondence"
          ]
        }
      ]
    },
    {
      icon: <Lock className="text-blue-600" style={{ fontSize: '28px' }} />,
      title: "2. How We Use Your Information",
      content: `We use the information we collect to provide, maintain, and improve our services, as well as to protect our users and comply with legal obligations.`,
      subsections: [
        {
          subtitle: "Primary Uses:",
          items: [
            "Deliver educational content and personalized learning experiences",
            "Process payments and manage subscriptions through Razorpay",
            "Track your learning progress and issue certificates",
            "Send course updates, announcements, and promotional materials",
            "Provide customer support and respond to inquiries",
            "Analyze usage patterns to improve our platform",
            "Detect and prevent fraud, abuse, and security threats"
          ]
        }
      ]
    },
    {
      icon: <CloudSync className="text-blue-600" style={{ fontSize: '28px' }} />,
      title: "3. Information Sharing and Disclosure",
      content: `We do not sell your personal information. We share your information only in the limited circumstances described below.`,
      subsections: [
        {
          subtitle: "We may share your information with:",
          items: [
            "Service Providers: Including Razorpay for payment processing, cloud hosting providers, and analytics services",
            "Course Instructors: Limited information necessary for course delivery and student interaction",
            "Legal Requirements: When required by law, court order, or government regulations",
            "Business Transfers: In case of merger, acquisition, or sale of assets (with user notification)",
            "With Your Consent: When you explicitly authorize us to share specific information"
          ]
        }
      ]
    },
    {
      icon: <Cookie className="text-blue-600" style={{ fontSize: '28px' }} />,
      title: "4. Cookies and Tracking Technologies",
      content: `We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content.`,
      subsections: [
        {
          subtitle: "Types of Cookies We Use:",
          items: [
            "Essential Cookies: Required for platform functionality and security",
            "Performance Cookies: Help us understand how users interact with our platform",
            "Functionality Cookies: Remember your preferences and settings",
            "Analytics Cookies: Provide insights into user behavior and platform usage"
          ]
        },
        {
          subtitle: "Cookie Management:",
          items: [
            "You can control cookies through your browser settings",
            "Blocking cookies may affect platform functionality",
            "We respect Do Not Track signals where applicable"
          ]
        }
      ]
    },
    {
      icon: <Shield className="text-blue-600" style={{ fontSize: '28px' }} />,
      title: "5. Data Security",
      content: `We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.`,
      subsections: [
        {
          subtitle: "Security Measures:",
          items: [
            "SSL/TLS encryption for data transmission",
            "Secure payment processing through PCI-DSS compliant Razorpay",
            "Regular security audits and vulnerability assessments",
            "Access controls and authentication mechanisms",
            "Employee training on data protection and privacy",
            "Incident response procedures for data breaches"
          ]
        }
      ]
    },
    {
      icon: <Visibility className="text-blue-600" style={{ fontSize: '28px' }} />,
      title: "6. Your Privacy Rights",
      content: `You have certain rights regarding your personal information, subject to applicable laws.`,
      subsections: [
        {
          subtitle: "Your Rights Include:",
          items: [
            "Access: Request a copy of your personal information",
            "Correction: Update or correct inaccurate information",
            "Deletion: Request deletion of your personal information (subject to legal obligations)",
            "Data Portability: Receive your data in a structured, machine-readable format",
            "Opt-Out: Unsubscribe from marketing communications",
            "Object: Object to certain data processing activities",
            "Withdraw Consent: Withdraw previously given consent"
          ]
        },
        {
          subtitle: "To Exercise Your Rights:",
          items: [
            "Contact us at privacy@yourplatform.com",
            "Use your account settings to manage preferences",
            "We will respond to requests within 30 days"
          ]
        }
      ]
    },
    {
      icon: <DeleteForever className="text-blue-600" style={{ fontSize: '28px' }} />,
      title: "7. Data Retention",
      content: `We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy.`,
      subsections: [
        {
          subtitle: "Retention Periods:",
          items: [
            "Active accounts: Data retained while your account is active",
            "Closed accounts: Personal information deleted within 90 days (except as required by law)",
            "Payment records: Retained for 7 years for tax and accounting purposes",
            "Course completion data: Retained to maintain certificate validity",
            "Legal obligations: Some data may be retained longer to comply with legal requirements"
          ]
        }
      ]
    },
    {
      title: "8. Children's Privacy",
      content: `Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will delete such information.`
    },
    {
      title: "9. Third-Party Services",
      content: `Our platform integrates with third-party services, including Razorpay for payment processing. These services have their own privacy policies governing how they collect and use your information. We encourage you to review their privacy policies. We are not responsible for the privacy practices of third-party services.`
    },
    {
      title: "10. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We take appropriate safeguards to ensure your information receives adequate protection in accordance with this Privacy Policy.`
    },
    {
      title: "11. Updates to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. We will notify you of significant changes via email or platform notification. Your continued use of our services after changes become effective constitutes acceptance of the updated Privacy Policy.`
    },
    {
      title: "12. Contact Us",
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:`,
      contactInfo: {
        email: "privacy@yourplatform.com",
        address: "Your Company Name, Address Line 1, City, State, PIN Code, India",
        phone: "+91 XXXXX XXXXX"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowBack />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <img src={logo1} alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                LMS Platform
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Shield style={{ fontSize: '40px' }} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your data.
            </p>
            <p className="text-sm text-blue-200 mt-4">
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
              Our Commitment to Your Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This Privacy Policy describes how we collect, use, disclose, and protect your personal information 
              when you use our Learning Management System platform. We are committed to protecting your privacy 
              and ensuring the security of your personal information.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our platform, you consent to the collection and use of your information as described in 
              this Privacy Policy. Please read this policy carefully to understand our practices regarding your 
              personal information.
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
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
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
                  <div className="ml-16 space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        {subsection.subtitle && (
                          <h4 className="font-semibold text-gray-800 mb-3">
                            {subsection.subtitle}
                          </h4>
                        )}
                        <ul className="space-y-2">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-gray-600">
                              <span className="text-blue-600 mt-1.5 flex-shrink-0">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.contactInfo && (
                  <div className="ml-16 mt-4 bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {section.contactInfo.email}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Address:</span> {section.contactInfo.address}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Phone:</span> {section.contactInfo.phone}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* GDPR & Compliance Notice */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="text-blue-600" />
                Data Protection Compliance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to complying with applicable data protection laws, including the Information 
                Technology Act, 2000 and its amendments. We implement appropriate technical and organizational 
                measures to ensure a level of security appropriate to the risk, including encryption, access 
                controls, and regular security assessments.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/terms')}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Read our Terms of Service →
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Back to Platform
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;