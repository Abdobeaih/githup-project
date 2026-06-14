import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../schemas/registerSchema";
import { registerUser } from "../services/authService";
import { PasswordInput } from "../components/ui/PasswordInput";

export default function Join() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");
      setSuccess("");

      const response = await registerUser(data);

      localStorage.setItem(
        "token",
        response.token
      );

      setSuccess("تم إنشاء الحساب بنجاح");

      reset();
    } catch (error) {
      setServerError(
        error?.response?.data?.message ||
          "حدث خطأ أثناء التسجيل"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          انضم إلى مستقلين
        </h1>

        <p className="text-center text-gray-500 mb-8">
          سجل الآن للاستفادة من التأمينات والخصومات الحصرية
        </p>

        {serverError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {serverError}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium">
              الاسم الكامل
            </label>

            <input
              type="text"
              {...register("fullName")}
              className="w-full border rounded-lg p-3"
            />

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              البريد الإلكتروني
            </label>

            <input
              type="email"
              {...register("email")}
              className="w-full border rounded-lg p-3"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">
              رقم الهاتف
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              {...register("phone")}
              onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
              className="w-full border rounded-lg p-3"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* National ID */}
          <div>
            <label className="block mb-1 font-medium">
              الرقم القومي
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={14}
              {...register("nationalId")}
              onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
              className="w-full border rounded-lg p-3"
            />

            {errors.nationalId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nationalId.message}
              </p>
            )}
          </div>

          {/* Profession */}
          <div>
            <label className="block mb-1 font-medium">
              التخصص
            </label>

            <input
              type="text"
              {...register("profession")}
              className="w-full border rounded-lg p-3"
            />

            {errors.profession && (
              <p className="text-red-500 text-sm mt-1">
                {errors.profession.message}
              </p>
            )}
          </div>

          {/* Governorate */}
          <div>
            <label className="block mb-1 font-medium">
              المحافظة
            </label>

            <input
              type="text"
              {...register("governorate")}
              className="w-full border rounded-lg p-3"
            />

            {errors.governorate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.governorate.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              كلمة المرور
            </label>

            <PasswordInput
              value={watch("password")}
              showStrength
              {...register("password")}
              className="w-full border rounded-lg p-3"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading
              ? "جاري التسجيل..."
              : "إنشاء الحساب"}
          </button>
        </form>
      </div>
    </section>
  );
}