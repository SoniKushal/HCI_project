import React, { useState, useEffect } from 'react'
import immm from "../assets/italian.jpg"
import Header from '../components/Header'

export default function Booking() {
  const [activeTab, setActiveTab] = useState('offers')
  const [minDate, setMinDate] = useState('')
  const [maxDate, setMaxDate] = useState('')

  useEffect(() => {
    const today = new Date()
    const sevenDaysLater = new Date(today)
    sevenDaysLater.setDate(today.getDate() + 7)

    setMinDate(today.toISOString().split('T')[0])
    setMaxDate(sevenDaysLater.toISOString().split('T')[0])
  }, [])

  return (
    <>
    <Header/>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[400px] w-full">
          <img
            src={immm}
            alt="Italian restaurant interior"
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-2">The Italian Bistro</h1>
              <div className="flex items-center gap-4 text-white">
                <div>Kudasan, Gandhinagar</div>
                <div>4.0 (1 review)</div>
                <div>0.63k likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr,400px] gap-6">
          {/* Main Content */}
          <div>
            <div className="border-b mb-6">
              <ul className="flex gap-4">
                {['offers', 'menu', 'photos', 'about'].map((tab) => (
                  <li key={tab}>
                    <a
                      href={`#${tab}`}
                      className={`pb-2 px-1 inline-block ${activeTab === tab ? 'border-b-2 border-orange-500' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveTab(tab)
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {activeTab === 'offers' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Sample Bill (Approx Discount)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Bill</span>
                    <span>₹1200</span>
                  </div>
                  <div className="flex justify-between text-orange-500">
                    <span>EazyDiner Discount</span>
                    <span>-₹435</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>You Paid</span>
                    <span>₹765</span>
                  </div>
                  <a href="#" className="text-blue-500">Calculate Your Exact Discount</a>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((menu) => (
                  <div key={menu} className="bg-white rounded-lg shadow overflow-hidden">
                    <img
                      src={immm}
                      alt={`Menu page ${menu}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((photo) => (
                  <div key={photo} className="bg-white rounded-lg shadow overflow-hidden">
                    <img
                      src={immm}
                      alt={`Restaurant photo ${photo}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">About The Italian Bistro</h3>
                <p className="text-gray-600">
                  The Italian Bistro offers an authentic Italian dining experience in the heart of Kudasan, Gandhinagar. 
                  Our menu features a wide range of traditional Italian dishes prepared with the freshest ingredients. 
                  Enjoy our cozy atmosphere and excellent service for a memorable dining experience.
                </p>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Book Table</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" placeholder="Enter the name" id="name" name="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" placeholder="Enter the Mob. No." id="mobile" name="mobile" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                  </div>
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
                    <input type="number" placeholder="Enter the number" id="guests" name="guests" min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Visiting Date</label>
                    <input 
                      type="date" 
                      id="date" 
                      name="date" 
                      min={minDate} 
                      max={maxDate}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" placeholder="Enter the email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" placeholder="Enter the time" id="time" name="time" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                  </div>
                  <button type="submit" className="w-full px-4 py-3 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                    Book
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}