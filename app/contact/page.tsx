import React from 'react'
import Link from 'next/link'
import { Jersey_10 } from 'next/font/google'


const jersey10 = Jersey_10({ subsets: ["latin"], weight: "400" });


export default function page() {
  return (
    <div>
        <h1 className={"text-5xl  pt-5 text-center text-yellow-200 " + jersey10.className}>
          Contact Me
        </h1>
        <p className="text-center text-slate-10 pt-2 max-w-2xl mx-auto font-bold">
          If you have any questions or suggestions, or if you just want to say Hi!, feel free to reach out!
        </p>
        <div className="flex font-bold justify-center mt-5">
          <a
            href="mailto:hangyakuzero@gmail.com"
            className="underline"
          >
            EMAIL ME : hangyakuzero@gmail.com
          </a>  
          <span className="mx-2 underline font-bold" >
            <a  href="https://x.com/imHangyaku">
            ,X
            </a>
            </span>  
            
    </div>
             <div className='text-center py-6 text-bold text-slate-20 justify-center '>
            <Link href="https://cal.com/hangyaku-zero-snsdqk">  
            <button className='bg-gradient-to-r from-slate-50 to-slate-200 via-slate-100 text-black btn hover:bg-none hover:text-slate-50 px-4 duration-300 ease-in-out rounded-lg'>
              Book a Call
              </button>
              </Link>
              
              </div>  
    </div>
  )
}
