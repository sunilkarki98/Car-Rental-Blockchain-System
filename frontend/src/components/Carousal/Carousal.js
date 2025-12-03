// import React from 'react'
// import Carousal1a from '../../assets/Carousal 1a.jpg'
// import Carousal1b from '../../assets/Carousal 1b.jpg'
// import Carousal2 from '../../assets/Carousal 2.jpg'
// import Carousal3 from '../../assets/Carousal 3.jpg'

// export default function Carousal() {
//   return (
//     <>
//     <div id="carouselExampleSlidesOnly" className="carousel slide carousel-fade" style={{height: '80vh'}} data-bs-touch="false" data-bs-ride="carousel">
//         <div className="carousel-indicators">
//             <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
//             <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="1" aria-label="Slide 2"></button>
//             <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="2" aria-label="Slide 3"></button>
//         </div>
//         <div className="carousel-inner">
//             <div className="carousel-item d-flex active">
//             <img src={Carousal1a} style={{height: '80vh'}} className="d-block w-100 object-fit-sm-cover border rounded" alt="1" data-bs-interval="2000"/>
//             <img src={Carousal1b} style={{height: '80vh'}} className="d-block w-100 object-fit-sm-cover border rounded" alt="1" data-bs-interval="2000"/>
//             </div>
//             <div className="carousel-item" data-bs-interval="2000">
//             <img src={Carousal2} style={{height: '80vh'}} className="d-block w-100 object-fit-sm-cover border rounded" alt="2"/>
//             </div>
//             <div className="carousel-item" data-bs-interval="2000">
//             <img src={Carousal3} style={{height: '80vh'}} className="d-block w-100 object-fit-sm-cover border rounded" alt="3"/>
//                 <div className="carousel-caption d-none d-md-block">
//                     <h5>First slide label</h5>
//                     <p>Some representative placeholder content for the first slide.</p>
//                 </div>
//             </div>
//         </div>
//         {/* <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide="prev">
//             <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//             <span className="visually-hidden">Previous</span>
//         </button>
//         <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide="next">
//             <span className="carousel-control-next-icon" aria-hidden="true"></span>
//             <span className="visually-hidden">Next</span>
//         </button> */}
//     </div>
//     </>
//   )
// }
import React from 'react'
import { Link } from 'react-router-dom';
import './Carousal.css';
import Carousal1 from '../../assets/Carousal 1.jpeg'
import Carousal2 from '../../assets/Carousal 2.jpg'
import Carousal3 from '../../assets/Carousal 3.jpg'
import Carousal4 from '../../assets/Carousal 4.jpg'
import Carousal5 from '../../assets/Carousal 5.jpg'

export default function Carousal() {
    return (
        <>
            <div id="carouselExampleSlidesOnly" className="carousel slide carousel-fade" style={{ height: '90vh' }} data-bs-touch="false" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="3" aria-label="Slide 4"></button>
                    <button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="4" aria-label="Slide 5"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="3000">
                        <div className="overlay"></div>
                        <img src={Carousal1} className="d-block w-100 carousel-img" alt="1" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="animate__animated animate__fadeInDown">Multiple Delivery Options</h5>
                            <p className="animate__animated animate__fadeInUp">Get your car delivered at Doorstep, Airport, Hub or nearest SPOC location.</p>
                            <Link to="/rentacar" className="btn btn-primary btn-lg mt-3 animate__animated animate__fadeInUp cta-btn">Rent Now</Link>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="3000">
                        <div className="overlay"></div>
                        <img src={Carousal2} className="d-block w-100 carousel-img" alt="2" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="animate__animated animate__fadeInDown">Flexible Kms Options</h5>
                            <p className="animate__animated animate__fadeInUp">Drive our latest car models. Average age of our fleet is 20 months.</p>
                            <Link to="/rentacar" className="btn btn-primary btn-lg mt-3 animate__animated animate__fadeInUp cta-btn">Rent Now</Link>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="3000">
                        <div className="overlay"></div>
                        <img src={Carousal3} className="d-block w-100 carousel-img" alt="3" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="animate__animated animate__fadeInDown">Multiple Car Varieties</h5>
                            <p className="animate__animated animate__fadeInUp">Available all types of models from 2 seater to 8 seater.</p>
                            <Link to="/rentacar" className="btn btn-primary btn-lg mt-3 animate__animated animate__fadeInUp cta-btn">Rent Now</Link>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="3000">
                        <div className="overlay"></div>
                        <img src={Carousal4} className="d-block w-100 carousel-img" alt="4" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="animate__animated animate__fadeInDown">Secured & Fast Service</h5>
                            <p className="animate__animated animate__fadeInUp">Secure, swift, and stylish: our services offer the perfect blend of efficiency.</p>
                            <Link to="/rentacar" className="btn btn-primary btn-lg mt-3 animate__animated animate__fadeInUp cta-btn">Rent Now</Link>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="3000">
                        <div className="overlay"></div>
                        <img src={Carousal5} className="d-block w-100 carousel-img" alt="5" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="animate__animated animate__fadeInDown">Free to Roam Everywhere</h5>
                            <p className="animate__animated animate__fadeInUp">Service is available everywhere and free to drive for long tours and trips.</p>
                            <Link to="/rentacar" className="btn btn-primary btn-lg mt-3 animate__animated animate__fadeInUp cta-btn">Rent Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}