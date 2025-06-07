
import { title } from "@/components/primitives";
import BaseLayout from "@/layouts/base-layout";

export default function LoginPage() {
  return (
    <BaseLayout showNavbar={false}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <span className={title()}>Login</span>
      </section>
    </BaseLayout>
  );
}
