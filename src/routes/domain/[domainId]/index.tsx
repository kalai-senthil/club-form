import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Loading from "~/components/ui/Loading";
import type { Domain } from "~/routes";
import { db } from "~/services/firebase";

export const useLoadDomainDetails = routeLoader$(async (event) => {
  try {
    const domainDoc = await getDoc(
      doc(db, `domainNames/${event.params.domainId}`)
    );
    return {
      success: true,
      data: { ...domainDoc.data(), id: domainDoc.id } as Domain,
    };
  } catch (error) {
    return { success: false, data: null };
  }
});
export type Submission = {
  domain: string;
  email: string;
  enroll: string;
  name: string;
  id: string;
};
export default component$(() => {
  const load = useLoadDomainDetails();
  const { params } = useLocation();
  const loading = useSignal(true);
  const submissions = useSignal<Submission[]>([]);
  useVisibleTask$(() => {
    const qu = query(
      collection(db, "submissions"),
      where("domain", "==", params.domainId)
    );
    onSnapshot(qu, (snap) => {
      const d: Submission[] = [];
      snap.docs.forEach((e) => {
        d.push({
          ...e.data(),
          id: e.id,
        } as Submission);
      });
      if (loading.value) {
        loading.value = false;
      }
      submissions.value = d;
    });
  });
  return (
    <section class="p-5">
      <div class="flex mb-10 gap-5 items-center ">
        <Link href="/report">
          <span class="material-symbols-outlined text-5xl cursor-pointer hover:bg-gray-900 transition-all rounded-full overflow-hidden">
            arrow_back
          </span>
        </Link>

        <h1 class="font-bold text-7xl ">{load.value.data?.name}</h1>
      </div>
      {loading.value ? (
        <div class="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <table class="w-full text-center">
          <thead class="sticky top-2 font-bold text-white">
            <th>
              <div>
                <span class="material-symbols-outlined">badge</span>
                Enroll No
              </div>
            </th>
            <th>
              <div>
                <span class="material-symbols-outlined">
                  supervisor_account
                </span>
                Name
              </div>
            </th>
            <th>
              <div>
                <span class="material-symbols-outlined">mail</span>
                Email
              </div>
            </th>
          </thead>
          <tbody>
            {submissions.value.map((submission) => (
              <tr key={submission.id} class="border-b">
                <td>{submission.enroll}</td>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
});
