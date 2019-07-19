let _ = require('lodash');


// let a =[5,2,3,4,5,6];
// let b =[1,4,5,6,7,8];
// let c =[9,8,12,3,0,13];
// let d =[5,33,1,55,1,2];

let getMatrix = (a,b,c,d,ci,ri)=>{

let columnLeft =[a];
let columnRight =[c];
let rowTop =[a];
let rowBottom =[b];
let middleRows=[];
let middleRows2=[];

let dist = _.zipWith(a,b,(a,b)=>{
  return (b-a)/(ci-1);
});

let dist2 = _.zipWith(c,d,(c,d)=>{
  return (d-c)/(ci-1);
});

for(let i = 1; i <=ri-2; i++){
    let cc = _.zipWith(dist,(dist)=>{return dist*i});
    let ac = _.zipWith(a,cc,(a,cc)=>{return a+cc});
    columnLeft.push(ac);
    cc = _.zipWith(dist2,(dist2)=>{return dist2*i});
    ac = _.zipWith(c,cc,(c,cc)=>{return c+cc});
    columnRight.push(ac);
}

dist = _.zipWith(a,c,(a,c)=>{
  return (c-a)/(ri-1);
});

dist2 = _.zipWith(b,d,(b,d)=>{
  return (d-b)/(ri-1);
});

for(let i = 1; i <=ci-2; i++){
    let cc = _.zipWith(dist,(dist)=>{return dist*i});
    let ac = _.zipWith(a,cc,(a,cc)=>{return a+cc});
    rowTop.push(ac);
    cc = _.zipWith(dist2,(dist2)=>{return dist2*i});
    ac = _.zipWith(b,cc,(b,cc)=>{return b+cc});
    rowBottom.push(ac);

}

columnLeft.push(b);
columnRight.push(d);
rowTop.push(c);
rowBottom.push(d);

// console.log(rowTop.length,rowBottom.length);

for(let i = 1; i<ri-1;i++){

    middleRows.push([columnLeft[i]]);
    for(let ii = 1; ii <ci-1;ii++){
      let cc = _.zipWith(columnLeft[i],columnRight[i],rowTop[ii],rowBottom[ii],(a,b,c,d)=>{
        return (a+b+c+d)/4
      })

      middleRows[i-1].push(cc);

    }
    middleRows[middleRows.length-1].push(columnRight[i]);
}

let allRows = middleRows;
allRows.unshift(rowTop);
allRows.push(rowBottom);


//console.log(rowTop,rowBottom);

return allRows;
}

let getSingleLine = (a,b,ci,i)=>{


  let dist = _.zipWith(a,b,(a,b)=>{
    return (b-a)/(ci-1);
  });

  let cc = _.zipWith(dist,(dist)=>{return dist*i});
  let ac = _.zipWith(a,cc,(a,cc)=>{return a+cc});

  return ac;

}

let getSingleTime =(a,b,c,i)=>{
    let timediff = (b-a)/(c-1)
    return a+(timediff*i)
}


//getArrays(a,b,c,d,4,4);



module.exports = {
  getMatrix,
  getSingleLine,
  getSingleTime
}
