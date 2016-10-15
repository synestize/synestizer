import { VERSION } from '../settings'

const BrandingBox = () => (<div className='branding-box'>
  <div className='branding-info'>
    <h1>Synestizer <span className='version'>{VERSION} edition.</span></h1>
  </div>
</div>)

export default BrandingBox;
