import React from 'react'
import OptionInputTile from '../input/OptionInputTile';

const PollContent = ({
                type,
                options,
                selectedOptionIndex,
                onOptionSelect,
                rating,
                onRatingChnage,
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
        

        default:
            return null
  } 

}

export default PollContent