export function envelopFunction(xx,ep){
      let pitch = (ep[1]-ep[0])/2;
      let axisSection = ep[1]-(2*pitch);
      return (xx*pitch)+axisSection;
}

export function envelopCurve(c,e){

  
}
