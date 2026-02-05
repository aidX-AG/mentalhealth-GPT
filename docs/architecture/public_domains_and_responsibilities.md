Perfekt 👍
Dann machen wir das sauber, implementierungsnah und versionierbar.

⸻

Schritt 1️⃣ Datei anlegen

cd ~/git/frontend-git
mkdir -p docs/architecture
nano docs/architecture/public_domains_and_responsibilities.md


⸻

Schritt 2️⃣ Inhalt der .md (1:1 einfügen)

# Öffentliche Domains & Verantwortlichkeiten
## Health-Grade Architektur mentalhealthGPT

---

## 1. Ziel dieses Dokuments

Dieses Dokument beschreibt die öffentlichen Domains der mentalhealthGPT-Plattform
sowie deren jeweilige Verantwortlichkeiten und Sicherheitsgrenzen („Trust Boundaries“).

Ziel ist eine klare Trennung von:
- Benutzeroberfläche
- Geschäftslogik & Authentifizierung
- Medienübertragung
- Echtzeit-Streaming von KI-Antworten

Die Architektur ist von Beginn an auf klinische Anforderungen,
Datenschutz und Skalierbarkeit ausgelegt.

---

## 2. Überblick der öffentlichen Domains

www.mentalhealth-gpt.ch     → Frontend (statisches HTML / JS)
api.mentalhealth-gpt.ch     → REST API (Auth, Metadaten, Policies)
media.mentalhealth-gpt.ch   → Medien-Transfer (Ciphertext)
rt.mentalhealth-gpt.ch      → Realtime / Streaming (SSE)

Interne Systeme (nicht öffentlich erreichbar):
- Datenbank
- Schlüsselverwaltung
- KI-Verarbeitung / Inferenz

---

## 3. www.mentalhealth-gpt.ch (Frontend)

### Verantwortlichkeit
- Auslieferung statischer HTML-Seiten (z. B. `/de/`, `/fr/`)
- Client-seitige Logik (UI, State, Verschlüsselung im Browser)
- Keine Geschäftslogik
- Keine Schlüsselverwaltung

### Sicherheitsprinzipien
- Keine Session-Cookies
- Keine sensitiven API-Credentials
- Reiner Konsument von `api.*`, `media.*`, optional `rt.*`

---

## 4. api.mentalhealth-gpt.ch (Core REST API)

### Verantwortlichkeit
- Authentifizierung & Autorisierung
- Sitzungsverwaltung
- Metadaten (Chats, Prompts, Transkripte, Medien)
- Policy-Enforcement
- Gateway zur Schlüsselverwaltung (Key Wrapping / Unwrapping)

### Typische Endpunkte
- `/auth/*`
- `/profile/*`
- `/chat/*` (Request/Response, kein Streaming)
- `/media/init`
- `/media/finalize`
- `/keys/wrap`
- `/keys/unwrap`

### Sicherheitsprinzipien
- Session-Cookies (`HttpOnly`, `Secure`, restriktives SameSite)
- JSON-only Payloads
- Kein Klartext sensibler Inhalte
- Keine direkte Client-Verbindung zur Schlüsselverwaltung

---

## 5. media.mentalhealth-gpt.ch (Medien-Gateway)

### Verantwortlichkeit
- Orchestrierung von Uploads und Downloads
- Ausgabe zeitlich begrenzter, signierter URLs
- Übertragung ausschließlich verschlüsselter Daten (Ciphertext)

### Unterstützte Inhalte
- Textdateien (z. B. Transkripte)
- Bilder
- Audio
- Video

### Sicherheitsprinzipien
- Keine Geschäftslogik
- Keine dauerhaften Sessions
- Sehr restriktive CORS-Regeln
- Optional CDN-gestützt (Ciphertext only)

---

## 6. rt.mentalhealth-gpt.ch (Realtime / Streaming)

### Zweck
Diese Domain dient ausschließlich dem Streaming von KI-Antworten,
um eine schnelle und interaktive Nutzererfahrung zu ermöglichen.

Sie ist **keine Kollaborations- oder Kommunikationsplattform**.

### Konkreter Use Case
- Streaming von KI-Antworten (Token- oder Chunk-basiert)
- Anzeige von Fortschritt während längerer Inferenzprozesse

### Technische Umsetzung
- Server-Sent Events (SSE) über HTTPS
- Unidirektional (Server → Client)

### Beispielhafter Ablauf
1. Client sendet Prompt an `api.*`
2. API erzeugt eine Anfrage-ID
3. Client öffnet SSE-Stream auf `rt.*` mit dieser ID
4. KI-Antwort wird schrittweise gestreamt
5. Abschluss-Event signalisiert Ende der Antwort

### Sicherheitsprinzipien
- Keine Session-Cookies
- Kurzlebige Zugriffstoken
- Strikte Rate Limits
- Keine dauerhafte Datenhaltung

---

## 7. Abgrenzung: Was bewusst nicht enthalten ist

Nicht Bestandteil dieser Architektur:
- Video-Calls
- Live-Therapie
- Realtime-Kollaboration mit mehreren Schreibenden
- Persistente Chat-Sockets

Kollaboration ist konzeptionell als **asynchroner Review- und Sharing-Workflow**
vorgesehen (z. B. Teilen von pseudonymisierten Inhalten).

---

## 8. Gründe für diese Trennung

- Klare Security Boundaries
- Unterschiedliche Performance-Profile
- Bessere Skalierbarkeit
- Reduzierter Blast Radius bei Fehlern
- Klinisch auditierbare Architektur

---

## 9. Erweiterbarkeit

Die Architektur erlaubt:
- spätere Einführung von WebSockets (falls erforderlich)
- institutionelle Mandanten
- differenzierte Rate-Limits
- separate Monitoring- und Alerting-Pipelines


