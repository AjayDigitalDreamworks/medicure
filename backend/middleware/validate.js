import { z } from 'zod';


export const validators = {
register: z.object({
name: z.string().min(2).max(80),
email: z.string().email(),
password: z.string().min(8),
phone: z.string().min(7).max(20).optional(),
}),
login: z.object({ email: z.string().email(), password: z.string().min(8) }),
cityId: z.object({ cityId: z.string().length(24) }),
hospitalId: z.object({ hospitalId: z.string().length(24) }),
};


export function validate(schema, part = 'body') {
return (req, res, next) => {
const data = req[part];
const parsed = schema.safeParse(data);
if (!parsed.success) {
return res.status(400).json({ error: 'validation', details: parsed.error.flatten() });
}
req.valid = { ...(req.valid || {}), ...parsed.data };
next();
};
}