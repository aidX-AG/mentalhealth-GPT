"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PasskeyForm from "@/templates/SignInPage/PasskeyForm";

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();
  const email = sp.get("email") || "";

  return (
    <PasskeyForm
      email={email}
      mode="signin"
      onSuccess={() => {
        router.push("/");
      }}
    />
  );
}
