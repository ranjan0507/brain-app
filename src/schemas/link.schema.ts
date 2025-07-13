import z from "zod" ;

export const createLinkSchema = z.object({
	contentId : z.string().min(1,"contentId is required") 
})

export type createLinkType = z.infer<typeof createLinkSchema>