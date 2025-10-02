import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-white shadow-md border-b border-gray-200'>
      <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-2'>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className='text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Todo App
            </h1>
            <a href='https://www.onela.in' target='_blank' rel='noopener noreferrer' className='text-xs text-gray-500 hover:text-purple-600 transition-colors cursor-pointer'>
              by <strong className='text-gray-700'>Onela</strong>
            </a>
          </div>
        </div>

        <div className='hidden sm:flex items-center gap-2'>
          <span className='px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-sm font-semibold'>
            ✨ Stay Organized
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar