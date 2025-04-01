import React from 'react'
import OptionInputTile from '../input/OptionInputTile';
import Rating from '../input/Rating';
import ImageOptionInputFile from '../input/ImageOptionInputFile';

const PollContent = ({
                type,
                options,
                selectedOptionIndex,
                onOptionSelect,
                rating,
                onRatingChange,
                userResponse,
                onResponseChange,
}) => {
  switch (type){
    case "single-choice":
        case "yes/no":
            return (
            <>
                {options.map((option, index) => (
                    <OptionInputTile
                        key={option._id || index} // Ensure a valid key
                        isSelected={selectedOptionIndex === index}
                        label={option.optionText || ""}
                        onSelect={() => onOptionSelect(index)}
                    />
                ))}
            </>
        );
        case "image-based":
            return (
                <div className='grid grid-cols-2 gap-4'>
                    {options.map((option, index) => {
                        <ImageOptionInputFile
                         key={option._id}
                         isSelected={selectedOptionIndex === index}
                         imgUrl={option.optionText || ""}
                         onSelect={() => onOptionSelect(index)}
                        />
                    })}
                </div>
            )
        case "rating":
            return <Rating value={rating} onChange={onRatingChange}/>
        case "open-ended":
            return (
                <div className='-mt-3'>
                    <textarea name="" id="" placeholder='Your Responsed'
                    className='w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md mt-2'
                    rows={4}
                    value={userResponse}
                    onChange={({target}) => onResponseChange(target.value)}></textarea>
                </div>
            )
        default:
            return null
  } 

}

export default PollContent