# Mentő Mancs – React + TypeScript frontend

A Figma-prototípus alapján készült felület a Laravel API-hoz (menhely_db csomag).
Az adományozás nincs benne.

## Indítás
```bash
npm install
npm run dev          # http://localhost:5173
```
A Laravelt közben futtasd: `php artisan serve` (http://localhost:8000).
A Vite fejlesztői szerver az `/api` hívásokat automatikusan átirányítja oda (lásd `vite.config.ts`),
így CORS beállítás fejlesztés közben nem kell.

Éles build: `npm run build` (a `dist/` mappa tölthető fel). Külön domain esetén
állítsd be a `.env` fájlban a `VITE_API_URL`-t és a Laravel `config/cors.php`-ban az `allowed_origins`-t.

## Képek
- `public/hero.jpg` – főoldali és belépő oldali háttérkép (tedd ide a saját fotódat)
- Az állatok fotóit az admin felületen töltöd fel, a Laravel `storage:link` + `APP_URL` beállítás szükséges.

## Oldalak
| Útvonal | Leírás |
|---|---|
| `/` | Főoldal, kiemelt állatok |
| `/orokbefogadas` | Lista + keresés/szűrés (faj, nem, kor) |
| `/orokbefogadas/:id` | Adatlap, „Örökbefogad” gomb (belépés szükséges) |
| `/talalt-allat` | Talált állat bejelentése (vendég is használhatja) |
| `/bejelentkezes`, `/regisztracio` | Hitelesítés |
| `/admin` | Vezérlőpult (csak admin) |
| `/admin/allatok` | Állatok kezelése: új, szerkesztés, törlés, státusz, oltások |
| `/admin/talalt-allatok` | Lakossági bejelentések |
| `/admin/orokbefogadasok` | Kérelmek elbírálása (szerződésszám, elfogadás/elutasítás) |
