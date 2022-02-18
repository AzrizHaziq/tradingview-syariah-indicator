import browser from "webextension-polyfill";
import { createSignal, onMount } from "solid-js";
import { getStorageDetails, useCurrentData } from "@popup/popup-helpers";
import {
  Footer,
  Header,
  Version,
  Flags,
  RefreshData,
  ToggleDateAndCount,
} from "@popup/Components";

const { author } = browser.runtime.getManifest();

export const Popup = () => {
  const [, { setState }] = useCurrentData();
  const [view, setView] = createSignal<"date" | "count">("date");

  onMount(() => {
    document.body.focus();
    getStorageDetails().then(setState);
  });

  return (
    <div class="flex h-full p-2 space-x-2">
      <img
        class="self-start mt-2"
        src="/assets/shariah-icon.svg"
        alt="Tradingview shariah icon"
        width="25px"
        height="25px"
      />

      <div class="flex flex-col w-full">
        <Header />
        <div class="flex items-center justify-between h-6">
          <p class="text-xs text-gray-300">{author}</p>
          <div class="flex items-center">
            <RefreshData />
            <div class="mr-2" />
            <ToggleDateAndCount view={view} setView={setView} />
            <div class="mr-2" />
            <Version />
          </div>
        </div>
        <div class="mt-2 text-white grid grid-cols-2 gap-x-2">
          <Flags view={view} />
        </div>
        <hr class="my-2 border-gray-400 opacity-30" />
        <div class="flex flex-col justify-start text-xs gap-1">
          <Footer />
        </div>
      </div>
    </div>
  );
};
