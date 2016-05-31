
import React from 'react'


const VotesCount = ({ count }) =>
  <span>
    ({ count } vote{ Number(count) === 1 ? '' : 's'})
  </span>


export default VotesCount
