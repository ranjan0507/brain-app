import React from 'react'

export interface ButtonInterface extends React.HTMLAttributes<HTMLButtonElement> {
	variant : {
		primary : string ;
		secondary : string ;
	}
	size : "sm" | "md" | "lg" ;
	text : string ;
	onClick : () => void ;
}

export const Button = (props: ButtonInterface) => {
  return (
	<button>
		 
	</button>
  )
}

export default Button