import { useState } from "react";

export function TagInput({ tags, setTags }){

    const [inputValue, setInputValue] = useState("");

    function handleInputChange(e){
        setInputValue(e.target.value);
    }

    function addNewTag(){
        if(inputValue.trim() !== ""){
            setTags((currentTags) => [...currentTags, inputValue.trim()])
            setInputValue("");
        }
    };

    function handleKeyDown(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            addNewTag();
        }
    }

    function handleRemoveTag(tagToRemove){
        setTags(tags.filter((tag)=> tag !== tagToRemove));
    };

    return(
        <div>
            
            {tags?.length>0 && (
                <div className="tag-input__list">
                    {tags.map((tag,index)=>(
                        <span key={index} className="tag-input__tag">
                            # {tag}
                            <button
                                className="tag-input__remove"
                                type="button"
                                onClick={()=>{handleRemoveTag(tag);}}
                            >
                                -
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="tag-input__controls">
                <input 
                    type="text"
                    value={inputValue}
                    className="tag-input__field"
                    placeholder="Add tags"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="tag-input__add"
                    type="button"
                    onClick={()=>{
                        addNewTag();
                    }}
                >
                    Add 
                </button>
            </div>
        </div>
    )
}
