import React from 'react'

const NewInput = ( {text, value, onChange} ) =>
  <div>
    {text}: <input 
      value={value}
      onChange={onChange}
    />
  </div>
  
export default NewInput