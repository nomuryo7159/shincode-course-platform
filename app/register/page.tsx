import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "新規登録",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
