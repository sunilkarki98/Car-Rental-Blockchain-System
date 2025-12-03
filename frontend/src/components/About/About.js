import React from 'react'
import './About.css'
import { FaCar, FaRoute, FaGlobe, FaMobileAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className='about-section'>
      <div className="container">
        <div className="heading-container">
          <h1 className="main-heading">About <span className="text-gold">CBMS</span></h1>
          <p className="sub-heading">Revolutionizing the way you rent cars with blockchain technology.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <FaCar />
            </div>
            <h3 className="card-title">Convenient Mobility</h3>
            <p className="card-text">
              Car rental services have become an integral part of modern transportation, offering flexibility and ease of use for individuals and businesses alike.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <FaRoute />
            </div>
            <h3 className="card-title">Flexibility & Freedom</h3>
            <p className="card-text">
              Whether for business trips or family vacations, renting a car offers the freedom to travel on your own terms, with a wide range of vehicles to suit your needs.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <FaGlobe />
            </div>
            <h3 className="card-title">Explore the World</h3>
            <p className="card-text">
              Discover hidden gems and local culture at your own pace. Our service empowers tourists to explore new cities and countries independently.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <FaMobileAlt />
            </div>
            <h3 className="card-title">Digital Experience</h3>
            <p className="card-text">
              The digital age has transformed car rentals. Browse, compare, and book with ease using our user-friendly platform equipped with advanced features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
