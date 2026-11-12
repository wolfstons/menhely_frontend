export interface Lakcim {
  id: number;
  iranyitoszam: string | null;
  varos: string | null;
  utca: string | null;
  hazszam: number | null;
}

export interface Felhasznalo {
  id: number;
  email: string;
  felhasznalonev: string;
  telefonszam: string | null;
  jogosultsag: 'regisztralt' | 'admin';
  anyja_neve?: string | null;
  szuletesi_ido?: string | null;
  lakcim?: Lakcim | null;
}

export interface Allapot {
  id: number;
  statusz: string;
}

export interface Oltas {
  id: number;
  neve: string;
  pivot?: { id: number; datum: string };
}

export interface Allat {
  id: number;
  faj: 'kutya' | 'macska';
  fajta: string;
  neve: string;
  neme: string | null;
  szuletesi_ido: string | null;
  kep: string | null;
  kep_url: string | null;
  allapot_id: number;
  chip: boolean;
  leirasa: string | null;
  allapot?: Allapot;
  oltasok?: Oltas[];
}

export interface Bejelentes {
  id: number;
  bejelentes_idopontja: string;
  allat_leiras: string | null;
  felhasznalo_id: number | null;
  megtalalas_helye: string;
  leiras: string | null;
  felhasznalo?: Partial<Felhasznalo> | null;
}

export interface Orokbefogadas {
  id: number;
  felhasznalo_id: number;
  dolgozo_id: number | null;
  allatok_id: number;
  orokbefogadas_idopontja: string;
  szerzodes_szam: string | null;
  felhasznalo?: Partial<Felhasznalo>;
  dolgozo?: Partial<Felhasznalo> | null;
  allat?: Partial<Allat>;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface Vezerlopult {
  legfrissebb_bejelentesek: Bejelentes[];
  mai_idopontok: Orokbefogadas[];
  fuggo_kerelmek: Orokbefogadas[];
}
