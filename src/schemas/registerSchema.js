import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "الاسم قصير جداً"),
  email: z.email("بريد إلكتروني غير صحيح"),
  phone: z.string().length(11, "Phone number must be exactly 11 digits."),
  nationalId: z.string().length(14, "National ID must be exactly 14 digits."),
  profession: z.string().min(2),
  governorate: z.string().min(2),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام"),
});