import React from 'react'

const BlendPoint = ({ levels, row, col, cell, pA, pB, pC, ingredients }) => {
  let x = col / (levels-1);
  x += ((levels-1 - row) / (levels-1))*0.5;
  let y = row / (levels-1);

  return (
    <div className="blendPoint" style={{
      top: `${y * 100}%`,
      left: `${x * 100}%`,
    }}>
      <div className="blendPoint__data">
        <span className="blendPoint__info">
          <span className="blendPoint__cell">{cell+1}<br/></span>
          <span className="blendPoint__pA"><span className="blendPoint__label">A</span> <strong>{(pA*100).toFixed(1)}</strong></span><br/>
          <span className="blendPoint__pB"><span className="blendPoint__label">B</span> <strong>{(pB*100).toFixed(1)}</strong></span><br/>
          <span className="blendPoint__pC"><span className="blendPoint__label">C</span> <strong>{(pC*100).toFixed(1)}</strong></span>
        </span>
        <span className="blendPoint__ingredients">{ Object.keys(ingredients).map( ik => {
          let classes = ['ingredient_row'];
          classes.push( `ingredient_row--${ik.replace(/(^-\d-|^\d|^-\d|^--)/,'a$1').replace(/[\W]/g, '-').toLowerCase()}` );
          const iv = ingredients[ik];
          if ( iv === 0 ) classes.push('ingredients_row--zero')
          return <span key={ik} className={classes.join(' ')}><span className="ingredient_label">{ik}</span><span className="ingredient_ratio">{iv.toFixed(2)}</span></span>
        } ) }</span>
      </div>
    </div>
  )
}

export default BlendPoint
