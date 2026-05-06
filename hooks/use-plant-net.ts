import { useCallback, useState } from 'react';
import { identify, type Organ, type PlantNetResult, PlantNetError } from '@/lib/plantnet';
import { getLang } from '@/lib/i18n';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; results: PlantNetResult[] }
  | { status: 'error'; code: PlantNetError['code']; message: string };

export function usePlantNet() {
  const [state, setState] = useState<State>({ status: 'idle' });

  const run = useCallback(async (photoUri: string, organ: Organ) => {
    setState({ status: 'loading' });
    try {
      const results = await identify(photoUri, organ, getLang());
      setState({ status: 'success', results });
    } catch (err) {
      if (err instanceof PlantNetError) {
        setState({ status: 'error', code: err.code, message: err.message });
      } else {
        setState({ status: 'error', code: 'UNKNOWN', message: String(err) });
      }
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, run, reset };
}
