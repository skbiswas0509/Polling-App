import React from 'react'
import {MdRadioButtonChecked, MdRadioButtonUnchecked} from 'react-icons/md'

const OptionInputTile = ({
    isSelected,
    label,
    onSelect
}) => {
  return (
        <button className=''
            onClick={onSelect}
        >
            {isSelected ? (
                <MdRadioButtonChecked className='text-lg text-white'/>   
            ) : (
                <MdRadioButtonUnchecked className='text-lg text-slate-400' />
            )}

            <span className='text-[13px]'>{label}</span>
        </button>
  )
}

export default OptionInputTile