import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"

interface SidebarItemProps {
	to : string 
	icon : ReactNode
	label : string
}
export default function SidebarItem({to , icon , label} : SidebarItemProps){
	return (
		<NavLink 
			to={to}		
			className={({isActive}) => 
				"flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-primary/10 "+ isActive ? "bg-primary/20 font-medium " : "font-normal"
			}
		>
		{icon}
		<span className="ml-2">{label}</span>
		</NavLink>
	)
}