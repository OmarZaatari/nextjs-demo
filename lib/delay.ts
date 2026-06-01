/** Artificial delay so route `loading.tsx` skeletons are visible during navigation. */
export async function fakeDelay(ms = 600): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
