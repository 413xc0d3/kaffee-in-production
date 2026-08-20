import type { MachineStatus } from '../types';

export const STATUS_LABEL: Record<MachineStatus, string> = {
  aus: 'Aus',
  aufheizen: 'Aufheizen …',
  bereit: 'Bereit',
  zubereitung: 'Zubereitung läuft …',
  fehler: 'Fehler',
};

/** Hinweistext, wenn die Bestellbuttons deaktiviert sind (Runde 4.3/4.4). */
export const BESTELLUNG_GESPERRT_HINWEIS: Partial<Record<MachineStatus, string>> = {
  aus: 'Maschine ist ausgeschaltet.',
  aufheizen: 'Maschine heizt auf …',
  zubereitung: 'Zubereitung läuft …',
  fehler: 'Fehler: bitte Vorrat auffüllen.',
};
