import { component$ } from "@builder.io/qwik";
import Domains from "~/components/ui/Domains";

export default component$(() => {
  return (
    <section class="p-10">
      <h1 class="text-5xl font-bold bg-black sticky top-0 p-2">Domains</h1>
      <section class="grid grid-cols-12 gap-5 p-5">
        <Domains />
      </section>
    </section>
  );
});
