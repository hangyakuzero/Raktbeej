import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div>
        <h1 className="text-3xl font-bold pt-5 text-center text-slate-200">
          Contact Me
        </h1>
        <p className="text-center text-slate-200 font-semibold">
          If you have any questions or suggestions, feel free to reach out!
        </p>
        <div className="flex justify-center mt-5">
          <a
            href="mailto:hangyakuzero@gmail.com"
            className="underline"
          >
            Email Me : hangyakuzero@gmail.com
          </a>  
          <span className="mx-2 underline font-bold" >
            <a  href="https://x.com/imHangyaku">
            ,X
            </a>
            </span>  
            
    </div>
             <div className='text-center py-6 text-bold text-slate-200 justify-center'>
            <Link href="https://cal.com/hangyaku-zero-snsdqk">  
            <button className='bg-gradient-to-r from-slate-50 to-slate-200 via-slate-100 text-black btn hover:bg-none hover:text-slate-50 px-4 duration-300 ease-in-out'>
              Book a Call
              </button>
              </Link>
              
              </div>  
    </div>
  )
}
