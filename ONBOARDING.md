# Berlin Indie Film Festival — Guida Operativa

## Continuare il progetto esistente

### Aprire una nuova chat con Claude
1. Apri Claude Code nella cartella `/Users/micheleprincigalli/Projects/bif`
2. Il file `CLAUDE.md` si carica automaticamente — Claude conosce già tutto il progetto
3. Descrivi cosa vuoi cambiare, Claude parte direttamente senza spiegazioni

### Pubblicare le modifiche
Dopo che Claude ha fatto le modifiche e creato il commit, esegui nel prompt:
```
! git push origin main
```
Poi vai sul pannello Hostinger e avvia il deploy.

### Regola database (importante)
Se si aggiungono campi allo schema Prisma, eseguire sempre:
```
! npx prisma db push
```
**Mai** usare `prisma migrate dev` — Hostinger non lo supporta.

---

## Clonare il progetto per un nuovo festival

### Passo 1 — Copiare il repository
```bash
git clone https://github.com/princi8m/bif.git nome-nuovo-festival
cd nome-nuovo-festival
```
Crea un nuovo repository vuoto su GitHub, poi collega:
```bash
git remote set-url origin https://github.com/princi8m/NUOVO-REPO.git
git push -u origin main
```

### Passo 2 — Cambiare i 5 file del festival

**`lib/festival.ts`** — tutti i dati specifici del festival:
- Nome, tagline, location
- Email di contatto e dominio
- Link Instagram e Facebook
- URL FilmFreeway (submit e profilo)
- URL IMDb
- Dati legali per l'Impressum (operatore, indirizzo, partita IVA, ecc.)
- Nomi delle cartelle Cloudinary

**`tailwind.config.ts`** — i colori:
- `accent` — colore principale (rosso per BIF: `#c8102e`)
- `star` — colore secondario/oro (per BIF: `#f5c518`)

**`public/uploads/logo4-1000.jpg`** — logo grande (usato nell'hero della home)

**`public/uploads/logo-mark.png`** — logo piccolo 32×32 (usato nel menu in alto)

**`app/icon.png`** e **`app/favicon.ico`** — favicon del browser

### Passo 3 — Nuovo database
Creare un nuovo database MySQL su Hostinger per il nuovo festival.
Creare il file `.env` nella cartella del progetto:
```
DATABASE_URL="mysql://utente:password@host:3306/database"
SESSION_SECRET="stringa-casuale-lunga"
SMTP_USER="email@dominio.com"
SMTP_PASS="password-smtp"
```
Poi inizializzare il database:
```
! npx prisma db push
```

### Passo 4 — Prima chat sul nuovo festival
Apri Claude Code nella nuova cartella del progetto e scrivi:

> "Questo è un clone del BIF per [nome festival]. Ho già cambiato festival.ts e i colori. Aiutami ad adattare i testi."

Claude legge il `CLAUDE.md` (già presente nel repo clonato) e ha tutto il contesto tecnico. Tu fornisci solo le informazioni specifiche del nuovo festival.

---

## Struttura del progetto — file chiave

| File/Cartella | Contenuto |
|---|---|
| `lib/festival.ts` | Configurazione specifica del festival |
| `CLAUDE.md` | Contesto completo per Claude (non modificare) |
| `app/(site)/` | Pagine pubbliche del sito |
| `app/admin/` | Pannello di amministrazione |
| `components/` | Componenti riutilizzabili |
| `lib/` | Email, Prisma, Cloudinary, config |
| `prisma/schema.prisma` | Schema del database |
| `public/uploads/` | Foto e loghi statici |
| `tailwind.config.ts` | Colori e design system |
| `.env` | Variabili d'ambiente — non committare mai |

## Pagine del sito

| URL | Descrizione |
|---|---|
| `/` | Home |
| `/submissions` | Iscrizioni con FilmFreeway |
| `/winners` | Vincitori per edizione |
| `/dates` | Date e scadenze |
| `/reviews` | Recensioni film |
| `/events` | Venue (Kino Babylon) |
| `/photos` | Galleria foto |
| `/shop` | Shop (statico) |
| `/contact` | Contatti |
| `/impressum` | Dati legali |
| `/admin` | Pannello admin |

---

## Contatti progetto
- GitHub: https://github.com/princi8m/bif
- Hosting: Hostinger
- Database: MySQL su Hostinger (srv1959.hstgr.io)
- Cloudinary: per tutte le immagini caricate dall'admin
