import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm =({onInputChange, onButtonSubmit})=>{
    return(<div>
        <p className='f3 center'>
        {'This Magic brain will detect faces in your pictures'}
        </p>
        <div className='center'>
            <div className='center pa4 br3 shadow-5 form'>
                <input type='text' className='f4 pa2 w-70 center' onChange={onInputChange}/>
                <button className='w-30 grow f4 link ph3 pv2 white dib bg-light-purple' onClick={onButtonSubmit}>DETECT</button>
            </div>
        </div>
    </div>)
}

export default ImageLinkForm;