import React from 'react';

export default function CardLoader(props) {
    return (
      <div className={`ui raised segment ${props.loading ? '' : 'hidden'}`}>

      </div>
    );
}