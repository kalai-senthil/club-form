import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Form, type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { useSubmitForm } from "./layout";
import { isServer } from "@builder.io/qwik/build";
import { db } from "~/services/firebase";
import { collection, getDocs } from "firebase/firestore";
type Domain = {
  name: string;
  id: string;
};
export const useGetDomains = routeLoader$(async (requestEvent) => {
  const domainsDocs = await getDocs(collection(db, "domainNames"));
  return domainsDocs.docs.map((e) => ({ ...e.data(), id: e.id })) as Domain[];
});

export default component$(() => {
  const submitForm = useSubmitForm();
  const domains = useGetDomains();
  const searchVal = useSignal<string>("");
  const domainSelected = useSignal<Domain>();
  useTask$(({ track }) => {
    track(() => submitForm.value);
    if (isServer) return;
    alert(submitForm.value?.msg);
  });

  return (
    <section class="flex flex-col items-center justify-center gap-2 h-screen w-screen bg-black">
      <div class="bg-white text-black p-4 w-3/4 lg:max-w-xl rounded-lg ">
        <h1 class="text-2xl ">Club Regsitration Form</h1>
        <p>
          Dear students, We would like to inform you that we are in the process
          of organizing a division of students based on the specific domain or
          technology preferences you have for your studies. To facilitate this,
          we kindly request that each of you provide us with your details and
          the specific domain of interest you wish to pursue. Your cooperation
          in this matter will greatly assist us in making appropriate
          arrangements for your academic endeavors.
        </p>
      </div>
      {submitForm.value?.success === true ? (
        <span>Form Submitted</span>
      ) : (
        <Form
          action={submitForm}
          class="flex flex-col  w-3/4 lg:max-w-xl gap-5"
        >
          <input
            class="p-2.5"
            type="text"
            id="email"
            name="email"
            placeholder="Enter Email"
          />
          <input
            class="p-2.5"
            type="text"
            id="name"
            name="name"
            placeholder="Name"
          />
          <input
            class="p-2.5"
            type="text"
            id="enroll"
            name="enroll"
            placeholder="Your Enrollment No."
          />
          <input
            type="text"
            value={searchVal.value}
            onKeyUp$={(e) => {
              if (e.key === "Enter") {
                if (searchVal.value !== "") {
                  const domain = domains.value.find((e) =>
                    e.name.toLowerCase().includes(searchVal.value.toLowerCase())
                  );
                  if (domain) {
                    domainSelected.value = domain;
                    searchVal.value = "";
                  }
                }
              }
            }}
            onInput$={(e: InputEvent) => {
              searchVal.value = (e.target as HTMLInputElement).value;
            }}
            placeholder="Type the domain"
          />
          <input
            type="hidden"
            value={domainSelected?.value?.id}
            name="domain"
          />
          <div class="relative">
            {
              <section class="rounded-md max-h-32 absolute w-full z-10 bg-black top-0 overflow-auto">
                {!domainSelected && <span>No Domains Selected</span>}
                {searchVal.value !== "" &&
                  domains.value.map((domain) => {
                    return (
                      domain.name
                        .toLowerCase()
                        .includes(searchVal.value.toLowerCase()) && (
                        <option
                          onClick$={() => {
                            domainSelected.value = domain;
                            searchVal.value = "";
                          }}
                          key={domain.id}
                          class="p-2 cursor-pointer hover:bg-gray-500"
                          value={domain.id}
                        >
                          {domain.name}
                        </option>
                      )
                    );
                  })}
              </section>
            }
          </div>
          {domainSelected.value && (
            <h4>Domain Selected: {domainSelected.value?.name}</h4>
          )}
          <button
            disabled={submitForm.isRunning}
            class="bg-white text-black mt-3 p-3 rounded-md"
          >
            {submitForm.isRunning ? (
              <div class="flex justify-center items-center gap-2">
                <span class="w-5 aspect-square rounded-full border-t-transparent border-2 animate-spin border-black inline-block"></span>{" "}
                <span>Loading</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </Form>
      )}
    </section>
  );
});

export const head: DocumentHead = {
  title: "Techknocks Club",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
