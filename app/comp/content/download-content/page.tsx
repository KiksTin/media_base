
import './page.css'
import SelectSong from '../select-song/select-song';

const DownloadContent = () => {
  return (
    <div className='download-container'>
    <div className="container">
    <div className='header'>
        <h1>Your Downloads</h1>
    </div>
    <div className='select-song'>
      <SelectSong/>
    </div>
  </div>
  </div>
  )
}

export default DownloadContent