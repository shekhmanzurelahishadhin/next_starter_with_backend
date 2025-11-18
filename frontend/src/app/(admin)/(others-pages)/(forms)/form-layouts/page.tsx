import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import GridForm from "../GridForm";

export const metadata: Metadata = {
  title: "Next.js Form Layouts | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Layouts page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormLayouts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Form Layouts" />
      <div className="grid grid-cols-1 gap-6">
        <VerticalForm />
        <HorizontalForm />
        <MultiStepForm />
        <InlineForm />
        <TwoColumnForm />
        <GridForm />
      </div>
    </div>
  );
}

// Vertical Form Component
function VerticalForm() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Vertical Form</h3>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="First Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Email Address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your address"
          ></textarea>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            I agree to the terms and conditions
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
}

// Horizontal Form Component
function HorizontalForm() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Horizontal Form</h3>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:text-right pt-2">
            First Name
          </label>
          <div className="md:col-span-3">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="First Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:text-right pt-2">
            Last Name
          </label>
          <div className="md:col-span-3">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:text-right pt-2">
            Email
          </label>
          <div className="md:col-span-3">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Email Address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:text-right pt-2">
            Phone
          </label>
          <div className="md:col-span-3">
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Phone Number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:text-right pt-2">
            Address
          </label>
          <div className="md:col-span-3">
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your address"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="md:col-start-2 md:col-span-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I agree to the terms and conditions
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-start-2 md:col-span-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Multi-Step Form Component
function MultiStepForm() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Multi-Step Form</h3>
      
      {/* Progress Steps */}
      <div className="flex justify-between mb-8 max-w-2xl mx-auto">
        {['Account', 'Profile', 'Contact', 'Finish'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              index === 0 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              index === 0 
                ? 'text-blue-600' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step}
            </span>
            {index < 3 && (
              <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4"></div>
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="First Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Email Address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Password"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
}

// Inline Form Component
function InlineForm() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Inline Form</h3>
      
      <form className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Your Name"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Your Email"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </div>
      </form>
    </div>
  );
}

// Two Column Form Component
function TwoColumnForm() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Two Column Form</h3>
      
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="First Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Last Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Email Address"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Phone Number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your address"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="City"
            />
          </div>
        </div>

        {/* Full Width Submit Button */}
        <div className="lg:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
