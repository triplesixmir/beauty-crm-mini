# Beauty CRM Mini

A mini CRM for beauty professionals — manage clients and appointments in one place.

This is a personal learning project. It started as a plain HTML/CSS page and has grown into a modular vanilla JS app. A React rewrite (`beauty-crm-react/`) is in progress as a study exercise.

## Features

- **Client management** — add, edit, delete clients; search by name; sort by name or last visit date
- **Appointment management** — create and edit appointments with service, date, time, and price; filter by service, date range, and price; search by client name
- **Dashboard** — live stats: total clients, total appointments, total revenue, nearest upcoming appointment
- **Pagination** — both lists load 4 items at a time with a "Show more" button
- **Toast notifications** — non-blocking success/error/warning messages
- **Custom confirm dialogs** — promise-based modal replacing native `confirm()`
- **Persistent storage** — all data saved to `localStorage`

## Tech stack

**Vanilla version** (`/` root):
- Plain HTML, CSS, vanilla JavaScript
- ES modules (`type="module"`)
- No build step, no framework, no package manager required
- [Inputmask](https://github.com/RobinHerbots/Inputmask) (CDN) for phone number formatting

**React version** (`beauty-crm-react/`):
- React 19 + Vite
- Custom hooks: `useClients`, `useAppointments`
- Work in progress — being built alongside learning React

## Project structure

beauty-crm-mini/
├── index.html
├── css/styles.css
├── js/
│ ├── app.js # entry point
│ ├── init.js # bootstraps subsystems
│ ├── states.js # shared mutable state
│ ├── dom.js # centralized DOM references
│ ├── clients.js # client CRUD + UI
│ ├── appointments.js # appointment CRUD + filters + UI
│ ├── dashboard.js # stats rendering
│ ├── storage.js # localStorage wrappers
│ ├── toasts.js # toast notification system
│ ├── confirm.js # async confirm modal
│ └── utils.js # shared helpers + service map
└── beauty-crm-react/ # React rewrite (Vite)
└── src/
├── components/ # ClientForm, ClientCard, AppointmentForm, AppointmentCard
└── hooks/ # useClients, useAppointments


## Running locally

**Vanilla version** — just open `index.html` in a browser, or serve it statically:

bash
npx serve .

**React version:**

cd beauty-crm-react
npm install
npm run dev

## Data model

// Client
{ id, name, tel, telegram, lastVisit, totalSpent }

// Appointment
{ appointmentId, clientId, date, time, price, service }

IDs are generated with Date.now(). Data persists in localStorage under the keys "clients" and "appointments".

## Status

Active development. This is a learning project — the code evolves as new concepts are explored.
