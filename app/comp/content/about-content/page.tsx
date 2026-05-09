'use client'
import './page.css'

const AboutContent = () => {
  return (
    <div className='about-container'>
      <div className='about-content'>
        <div className='about-text'>
          <h1 className='about-title'>About MediaBase</h1>
          <video src="/bg-swirl.mp4" autoPlay loop muted></video>

          <div className='about'>
            <section className='about-section-1'>
              <div>
                <h2>What is MediaBase?</h2>
                <p>
                  MediaBase is a sole hosted music platform that allows people to expirence and discover new music. It is a platform where musicians can share their music and for people to discover new music.
                </p>
              </div>
              <div>
                <h2>Our Mission</h2>
                <p>
                  Our mission is to provide a platform for musicians to share their music and for people to discover new music. For music lovers to enjoy and expirence the best music expirence possible with our platform. They can discover and support their favorite artists.
                </p>
              </div>
              <div>
                <h2>Our Vision</h2>
                <p>
                  Our vision is to create a platform where musicians can share their music and for people to discover new music. We want to create a community where music lovers can connect and share their passion for music.
                </p>
              </div>
            </section>
            <section className='about-section-2'>
              <img src="/a-p-1.jpg" alt="About Section 2" />
              <div>
                <h2>Enjoy Your Favorite Music</h2>
                <p>
                  Discover and enjoy your favorite music with MediaBase. Our platform offers a wide range of music genres and artists to suit your taste.
                </p>
              </div>
            </section>
            <section className='about-section-3'>
              <div>
                <h2>Discover Your New Favorite Artist</h2>
                <p>
                  Discover and enjoy your favorite music with MediaBase. Our platform offers a wide range of music genres and artists to suit your taste.
                </p>
              </div>
              <img src="/a-p-2.jpg" alt="About Section 3" />
            </section>
          </div>
        </div>
      
      <footer>
        <div className='footer-content'>
          <div className='logo'>
            <img src="/logo.png" alt="MediaBase Logo" />
            <h2>MediaBase</h2>
          </div>
          <div className='contact-content' id='contact'>
            <h2>Contact Us</h2>
            <p>Email: mediabase@example.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
          <div className='social-media'>
            <h2>Follow Us</h2>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>
        </div>
        <div className='copyright'>
          <p>&copy; 2025 MediaBase. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  )
}

export default AboutContent