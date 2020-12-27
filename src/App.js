import React, { useState } from 'react'
import BlendPoint from './modules/blendPoint'
import './App.css';

const defaultLevels = 5;
const defaultA =
{
  "Potash Feldspar": 80,
  "Synthetic Wood Ash": 20
}
const defaultB =
{
  "Synthetic Wood Ash": 60,
  "Kaolin": 40
}
const defaultC =
{
  "Potash Feldspar": 0,
  "Synthetic Wood Ash": 60,
  "Synthetic Straw Ash": 40
}
/*
    [0] [1] [2] [3] [4]
[0]  A
[1]  x   x
[2]  x   x   x
[3]  x   x   x   x
[4]  B   x   x   x   C
*/


function getBlends({pointA, pointB, pointC, levels}) {
  const ingredientKeys = Object.keys({ ...pointA, ...pointB, ...pointC }).sort();
  let blends = [];

  for (let row = 0; row < levels; row++) {
    let pA = (levels-1-row) / (levels-1);
    for (let col = 0; col < row+1; col++) {
      let cell = (row * (row + 1)) / 2 + col; // Partial sums
      let pB = row / (levels-1) - (col / (levels-1));
      let pC = col / (levels-1);
      let ingredient_values = ingredientKeys.map( ik => {
        let ingredient_value = [ pointA, pointB, pointC ].reduce( (accumlator, THE_POINT, idx) => {
          if ( THE_POINT.hasOwnProperty(ik) ) {
            let scaler = 0;
            if ( idx === 0 ) scaler = pA;
            if ( idx === 1 ) scaler = pB;
            if ( idx === 2 ) scaler = pC;
            return accumlator + THE_POINT[ik] * scaler;
          }
          return accumlator;
        }, 0 );
        return ingredient_value;
      });
      const ingredients = ingredientKeys.reduce((obj, key, index) => ({ ...obj, [key]: ingredient_values[index] }), {});
      let pointData = { row, col, cell, pA, pB, pC, ingredients };
      blends.push( pointData );
    }
  }
  return blends;
}

function App() {
  const [pointA, setPointA] = useState(defaultA);
  const [pointB, setPointB] = useState(defaultB);
  const [pointC, setPointC] = useState(defaultC);
  const [levels, setLevels] = useState(defaultLevels);
  const [errors, setErrors] = useState([]);
  const [showIngredient, setShowIngredient] = useState(true);

  function updatePoints({ A, B, C }) {
    let _errors = [];
    if ( A ) {
      try {
        const pA = JSON.parse( A );
        if ( pA ) setPointA( pA );
      } catch (err) {
        _errors.push('A');
      }
    }
    if ( B ) {
      try {
        const pB = JSON.parse( B );
        if ( pB ) setPointB( pB );
      } catch (err) {
        _errors.push('B');
      }
    }
    if ( C ) {
      try {
        const pC = JSON.parse( C );
        if ( pC ) setPointC( pC );
      } catch (err) {
        _errors.push('C');
      }
    }
    setErrors(_errors);
  }

  return (
    <div className={`App ${errors && errors.length>0 ? 'has-err' : 'no-err'} ${showIngredient? 'show-ingredient' : 'show-ratio'}`}>
      <div className="chart">
        {
          getBlends({pointA, pointB, pointC, levels}).map( blend => {
            return <BlendPoint key={blend.cell} levels={levels} {...blend} />
          } )
        }
      </div>

      <div className="controller">
        <div className="controller__row">
          <h4>A</h4>
          <textarea
            className={errors.indexOf('A')===-1 ? 'no-error' : 'has-error'}
            rows={5}
            defaultValue={JSON.stringify(pointA, null, 2)}
            onChange={e => updatePoints({"A": e.target.value})}
          />
        </div>

        <div className="controller__row">
          <h4>B</h4>
          <textarea
            className={errors.indexOf('B')===-1 ? 'no-error' : 'has-error'}
            rows={5}
            defaultValue={JSON.stringify(pointB, null, 2)}
            onChange={e => updatePoints({"B": e.target.value})}
          />
        </div>

        <div className="controller__row">
          <h4>C</h4>
          <textarea
            className={errors.indexOf('C')===-1 ? 'no-error' : 'has-error'}
            rows={5}
            defaultValue={JSON.stringify(pointC, null, 2)}
            onChange={e => updatePoints({"C": e.target.value})}
          />
        </div>

        <div className="controller__row">
          <h4>Levels</h4>
          <input type="range" min={3} max={7} defaultValue={levels} onChange={e => setLevels(e.target.value)} />&nbsp;<input type="number" value={levels} readOnly />
        </div>

        <div className="controller__row">
          <h4>Mode</h4>
          <p className="modeToggle">
            <button disabled={showIngredient?true:false} onClick={e => setShowIngredient(true)}>Ingredient</button>&nbsp;
            <button disabled={showIngredient?false:true} onClick={e => setShowIngredient(false)}>Ratio</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
