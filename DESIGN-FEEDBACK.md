# Uwagi do plików Figmy

Lista zebrana podczas budowy `brevy-ds`. Każda pozycja ma node-id, żeby dało się ją odnaleźć.
Nic z tego nie zostało poprawione w kodzie — kod odwzorowuje to, co jest narysowane.

Pliki:

- **app** — `Brevy_app_shadcn`, fileKey `6NGEMJh4TItgcDPi2KzQG7`
- **website** — `Brevy Website`, fileKey `2n63p266wr49k1FNXjT1uw`

---

## Blokujące

### 1. Button website nie ma stanu Focus

**website**, frame `22912:1932` „Buttons States"

Kolumny to Default / Hover / Disabled / Active. Brak Focus oznacza brak wskaźnika
fokusu klawiaturowego, czyli przyciski nieużywalne bez myszy.

Decyzja po stronie kodu: wariant website dostanie ten sam pierścień co app
(3 px, `ring/50`), niezależnie od Figmy. Prosimy o dorysowanie, żeby pliki się zgadzały.

### 2. Button website wiąże się z surową paletą zamiast z warstwą semantyczną

**website**, frame `22912:1932`

Przyciski są podpięte pod `tailwind colors/emerald/500`, `tailwind colors/olive/500`,
`tailwind colors/beige/600` — czyli pod kolekcję o **jednym trybie**. Plik app używa
w tych samych miejscach `base/primary`, `base/accent`, `base/input` z kolekcji
`3. Mode`, która ma tryby Light i Dark.

Skutek: przyciski website nie zmienią się w trybie ciemnym. Prosimy o przepięcie
na warstwę semantyczną.

### 3. Badge: `default` i `destructive` też wiszą na surowej palecie

**app**, component set `26:169`

- `default` → `tailwind colors/olive/500` + `tailwind colors/brand/500`
- `destructive` → `tailwind colors/red/200` + `tailwind colors/red/800`

Oba warianty nie reagują na tryb ciemny. W pliku istnieją gotowe pary, których
nikt tu nie użył: `custom/olive-500 dark:neutral-700`, `custom/red-200 dark:red-950`,
`custom/red-800 dark:red-300`.

Że to przeoczenie, a nie decyzja, sugeruje wariant `Verified` — on **jest**
podpięty pod mode-aware `custom/blue-500 dark:blue-600`.

---

## Sprzeczności w pliku

### 4. `base/primary` omija własną indirekcję

**app**, kolekcja `3. Mode`

Wszystkie 32 tokeny `base/*` wskazują na `colors/*-light`. Jedynym wyjątkiem jest
`base/primary`, który w trybie Light wskazuje bezpośrednio na
`tailwind colors/emerald/500`. Przez to `colors/primary-light` (= `neutral/900`)
jest martwy — nic go nie używa.

Do usunięcia albo do przepięcia, zależnie od tego, co było zamierzone.
Kod idzie za `base/primary`, czyli `emerald/500`.

### 5. Rampa `olive` łamie monotoniczność

**app**, kolekcja `1. TailwindCSS`

`olive/400` = `#d4e2c6` jest **ciemniejszy** niż `olive/500` = `#d7e4c9`.
Sprawdzone luminancją na wszystkich dziesięciu rampach Brevy — to jedyna z inwersją.

### 6. `border-width/border-7` ma wartość 6

**app**, kolekcja `1. TailwindCSS`

Identyczna jak `border-6`. Wygląda na literówkę.

---

## Braki i niejasności

### 7. Badge: brak `Secondary/Hover` i `Outline/Hover`

**app**, component set `26:169` — 13 wariantów zamiast 15.

### 8. Badge: `Destructive/Hover` i `Verified/Hover` są identyczne z `Default`

**app**, component set `26:169`

Warianty istnieją, ale nie różnią się niczym mierzalnym. Celowe czy niedokończone?
W kodzie pominięte.

### 9. Button: 11 brakujących kombinacji

**app**, component set `37:931` — 133 ze 144.

Brakuje całego `Link/icon/*` (6 stanów) oraz `{Default, Secondary, Destructive,
Outline, Ghost}/icon/Loading` (5). Kod odwzorowuje to 1:1, ale warto potwierdzić,
że to celowe zawężenie, a nie luka.

### 10. Active zmieniające rozmiar

**website**, okrągły przycisk `22912:1918`

W stanie Active przycisk rośnie z 48×48 na **50×50**, przy zmianie promienia
z `9999` na `45.5`. Pozostałe przyciski w tym frame nie zmieniają rozmiaru.
Celowe czy przypadkowe rozciągnięcie?

### 11. Paleta to Tailwind v3

**app**, kolekcja `1. TailwindCSS`

49 sprawdzonych stopni zgadza się co do hexa z `tailwindcss@3.4.17`. Projekt stoi
na Tailwindzie v4, który przeliczył paletę na oklch — stąd rozjazdy do Δ38
(np. `red/600` `#dc2626` w Figmie vs `#e7000b` w v4).

Rodziny przebrandowane przez Brevy (`emerald`, `green`, `orange`, `stone`, `violet`,
`yellow`) i własne (`brand`, `olive`, `beige`, `taupe`) tego nie dotyczą.

Kod trzyma wartości z Figmy. Migracja do v4 to osobna decyzja.

### 12. Logo nie ma dedykowanej wersji na ciemne tło

**website**

Podstawowy lockup `20919:10347` jest w `brand/500`. Jedyne wystąpienie wordmarku
w jasnym kolorze to `25187:629` — wyciągnięte z grafiki Open Graph, w `olive/500`.

Oba lockupy mają **niekompatybilne proporcje**: przy tej samej wysokości wordmark
w wersji jasnej jest o 56% mniejszy (15,9 px vs 24,8 px), a znak większy
(28 px vs 24,1 px).

Katalog używa geometrii z `25187:629` w obu motywach, przemalowanej tokenem.
Prosimy o jedną parę o zgodnych proporcjach.

---

## Do przeniesienia, nie do poprawy

### 13. Materiał na `packages/blocks`

- **website** `22912:1932` — okrągły przycisk 48 px z gradientowym obrysem,
  wewnętrznym cieniem i poświatą `#aee177` przy 30%
- **website** `22912:1932` — „Chips" 132×32
- **app** `15003:160044` i dalsze — `Pro Blocks / Card / 1.–8.`
- **app** `297:2355` — `Input + Button`

To kompozycje, nie prymitywy. Nie wchodzą do `@brevy/ui`.

### 14. Pełny zestaw stanów dla Buttona website

Zanim wariant website wejdzie do `@brevy/ui` jako drugi zestaw wariantów,
potrzebny jest komplet: Default, Hover, Focus, Active, Disabled, Loading —
dla każdego typu przycisku w `22912:1932`.
