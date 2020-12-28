const stripe=Stripe("pk_test_51I2iCfCF0ORVdl7FpJRrSls1v2GXpAmDDMmwvE1neD5dhmjd8bFkudRTDaxTDtOszKJEo7C3vgvIeMbGsOYOzLns00NSR68oCP");
import axios from "axios";
import {showAlert} from "./alerts";

export const bookTour=async tourId=>
{
    try{
     const session=await axios(`/api/v1/bookings/checkout-session/${tourId}`)
    //  console.log(session);
     await stripe.redirectToCheckout({
         sessionId:session.data.session.id
     })

    }catch(err)
    {
   console.log(err)
   showAlert("error",err);
    }
}                    