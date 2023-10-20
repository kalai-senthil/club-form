import { component$ } from "@builder.io/qwik";
import { useGetDomains } from "~/routes/layout";
import Domain from "./Domain";

export default component$(() => {
  const domains = useGetDomains();

  return (
    <>
      {domains.value.map((e) => {
        return <Domain key={e.id} domain={e} />;
      })}
    </>
  );
});
