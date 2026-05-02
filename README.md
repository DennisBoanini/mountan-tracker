# 🏔️ Mountain Tracker

Tracker personale per attività in montagna.

## Avvio

```bash
docker-compose up --build
```

App disponibile su **http://localhost:4200**

## Comandi utili

```bash
docker-compose up -d        # avvia in background
docker-compose down         # ferma (dati persistiti)
docker-compose down -v      # ferma e cancella i dati
```

## Stack

- **Frontend**: Angular 21 (Signals, Standalone, Angular Material)
- **Backend**: Node.js puro (HTTP nativo, niente framework)
- **Database**: MongoDB 7 (con persistenza volume Docker)

## API

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | /api/activities | Lista (filtri: type, done, guideType) |
| POST | /api/activities | Crea attività |
| GET | /api/activities/:id | Dettaglio |
| PUT | /api/activities/:id | Aggiorna |
| DELETE | /api/activities/:id | Elimina |
| PATCH | /api/activities/:id/done | Segna come fatta |
| DELETE | /api/activities/:id/done | Annulla completamento |
