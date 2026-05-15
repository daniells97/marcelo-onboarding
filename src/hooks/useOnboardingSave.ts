import { useMutation } from '@tanstack/react-query';
import { n8nClient } from '../lib/n8nClient';

const DEFAULT_LOC = import.meta.env.VITE_DEFAULT_LOCATION_ID as string;

export function useOnboardingSave() {
  const loc = new URLSearchParams(window.location.search).get('loc') ?? DEFAULT_LOC;
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      n8nClient.post('onboarding-save', { locationId: loc, ...payload }),
  });
}
