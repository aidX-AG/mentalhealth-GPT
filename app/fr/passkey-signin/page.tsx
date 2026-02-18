"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PasskeyForm from "@/templates/SignInPage/PasskeyForm";

function PageContent() {
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

export default function Page() {
  return <Suspense><PageContent /></Suspense>;
}
