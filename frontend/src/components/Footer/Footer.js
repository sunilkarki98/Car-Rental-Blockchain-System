import React from 'react'
import './Footer.css'
import { NavLink } from 'react-router-dom'
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="p-5 sm-p-3">
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-12 col-md-4 mb-4">
                        <h5>Navigation</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2">
                                <NavLink to="/" className="footer-link">Home</NavLink>
                            </li>
                            <li className="nav-item mb-2">
                                <NavLink to="/about" className="footer-link">About Us</NavLink>
                            </li>
                            <li className="nav-item mb-2">
                                <NavLink to="/rentacar" className="footer-link">Rent A Car</NavLink>
                            </li>
                            <li className="nav-item mb-2">
                                <NavLink to="/balance" className="footer-link">My Balance</NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="col-12 col-md-5 mb-4">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <h5>Subscribe to our newsletter</h5>
                            <p className="footer-text mb-4">Monthly digest of what's new and exciting from us.</p>
                            <div className="d-flex flex-column flex-sm-row w-100 gap-3">
                                <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                                <input
                                    id="newsletter1"
                                    type="text"
                                    className="form-control newsletter-input"
                                    placeholder="Email address"
                                />
                                <button className="modern-btn primary-btn mt-0" type="button" style={{ width: 'auto', padding: '0.8rem 2rem' }}>
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 rule-divider align-items-center">
                    <p className="footer-text mb-0">© 2024 CarChain System. All rights reserved.</p>
                    <ul className="list-unstyled d-flex mb-0 gap-3">
                        <li className="ms-3">
                            <button className="btn btn-link social-icon p-0"><FaTwitter /></button>
                        </li>
                        <li className="ms-3">
                            <button className="btn btn-link social-icon p-0"><FaInstagram /></button>
                        </li>
                        <li className="ms-3">
                            <button className="btn btn-link social-icon p-0"><FaFacebook /></button>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}
