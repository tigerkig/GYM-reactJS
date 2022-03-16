import React from "react";
import { SpinnerDotted } from 'spinners-react';

const CustomLoading = ({isStart, isFull}) => {

   return(
      <div>

         { isFull &&
            <div style={{textAlign: 'center'}}>
               {isStart &&
                  <div style={{width:'100%', height:'100%', opacity:'0.7', background:'grey', zIndex:'99', position:'fixed'}}></div>
               }
               <SpinnerDotted enabled={isStart} size={110} thickness={100} speed={74} color="rgb(254 202 0)" style={{position:"absolute", top:'calc(58% - 55px)', marginLeft: '-55px', zIndex:'100'}} />
            </div>
         }

         { !isFull && 
            <div>
               {isStart &&
                  <div style={{top:'0', right:'0', left:'0', bottom:'0', opacity:'0.7', background:'grey', zIndex:'99', position:'fixed'}}></div>
               }
               <SpinnerDotted enabled={isStart} size={110} thickness={100} speed={74} color="rgb(254 202 0)" style={{position:"absolute", top:'calc(50% - 55px)', zIndex:'100', left:'calc(50% - 55px)'}}/>
            </div>
         }

      </div>
   );
}

export default CustomLoading;