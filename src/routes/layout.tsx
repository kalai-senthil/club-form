import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <>
      <main>
        <Slot />
      </main>
    </>
  );
});

import {
  JSONObject,
  RequestEventAction,
  routeAction$,
} from "@builder.io/qwik-city";
import { doc, setDoc } from "firebase/firestore";
import { db } from "~/services/firebase";
export const useSubmitForm = routeAction$(
  async (data: JSONObject, req: RequestEventAction) => {
    console.log(data);

    if (data["email"] === "") {
      return { success: false, msg: "Invalid Email" };
    }
    if (data["name"] === "") {
      return { success: false, msg: "Provide your name" };
    }
    if (data["domain"] === "") {
      return { success: false, msg: "Select interested domain" };
    }
    if (data["enroll"] === "") {
      return { success: false, msg: "Provide enrollment no." };
    }
    // const domains = [
    //   "Full Stack Web Development",
    //   "Front End Developer",
    //   "Backend Developer",
    //   "App Development",
    //   "Cybersecurity",
    //   "AR & VR Development",
    //   "UI/UX",
    //   "Blockchain",
    //   "AI & ML & DL & NLP",
    //   "IOT",
    //   "Robotics",
    //   "3D Modelling",
    //   "DevOps",
    // ];
    // for (let index = 0; index < domains.length; index++) {
    //   const domain = domains[index];
    //   addDoc(collection(db, "domainNames"), {
    //     name: domain,
    //   });
    // }
    try {
      const docAdded = await setDoc(
        doc(db, `submissions/${data["enroll"]}`),
        data
      );
      return { success: true, msg: "Form Submitted" };
    } catch (error) {
      return { success: false, msg: `${error}` };
    }
  }
);
