import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type Domain } from "~/routes";
import Loading from "./Loading";
import { db } from "~/services/firebase";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { Link } from "@builder.io/qwik-city";

export default component$(({ domain }: { domain: Domain }) => {
  const nums = useSignal<number>();
  useVisibleTask$(async () => {
    try {
      const qu = query(
        collection(db, "submissions"),
        where("domain", "==", domain.id)
      );
      nums.value = (await getCountFromServer(qu)).data().count;
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <Link
      class="overflow-hidden text-xl flex items-center justify-between cursor-pointer bg-gray-900 hover:bg-gray-800 group col-span-12 md:col-span-6 lg:col-span-4 p-5 rounded-lg"
      href={`/domain/${domain.id}`}
    >
      <p>{domain.name}</p>
      {nums.value === undefined ? (
        <Loading />
      ) : (
        <span class="text-8xl font-bold text-ellipsis group-hover:scale-125 transition-transform">
          {nums.value}
        </span>
      )}
    </Link>
  );
});
