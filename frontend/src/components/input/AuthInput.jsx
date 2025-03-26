import React from 'react'

const AuthInput = ({value, onChange, label, placeholder, type}) => {
  return (
    <div>
        <label htmlFor="" className='text-[13px] text-slate-800'>{label}</label>

        <div className='input-box'>
            <input type="text" />
        </div>
    </div>
  )
}

export default AuthInput