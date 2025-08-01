import z from "zod";

export const createContentSchema = z.object({
	title : z.string().min(1) ,
	link : z.string().url().optional() ,
	type : z.enum(['tweet','youtube','link','image','note']) ,
	tags : z.array(z.string()).optional() ,
	categoryId : z.string().optional() ,
	categoryName : z.string().optional()
})

export const updateContentSchema = z.object({
	title: z.string().min(1).optional(),
  	link: z.string().url().optional(),
  	type: z.enum(['tweet','youtube','link','image','note']).optional(),
  	tags: z.array(z.string()).optional(),
  	categoryId: z.string().optional(),
})

export type createContentInput = z.infer<typeof createContentSchema> ;
export type updateCategorySchema = z.infer<typeof updateContentSchema> ;
