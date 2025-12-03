import React from 'react'
import data from '../Data.json';
import './RentDetails.css'
import Rent from '../Rent/Rent';
export default function RentDetails({ contract }) {
  return (
    <div className='rentdetails'>
      <h1 className='top-heading'>Book A Ride Instantly</h1>
      <div className='cards-container'>
        {data.map((car, index) => (
          <Rent
            key={`${car.cbrand}-${car.cname}-${index}`}
            cbrand={car.cbrand}
            cname={car.cname}
            ethperday={car.ethperday}
            bagcount={car.bagcount}
            geartype={car.geartype}
            seatcount={car.seatcount}
            carimage={car.carimage}
            contract={contract}
          />
        ))}
      </div>
    </div>
  )
}



