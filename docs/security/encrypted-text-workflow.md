# Client-Side Encryption Workflow
## Health-Grade Zero-Knowledge Architecture (mentalhealthGPT)

---

## 1. Ziel und Geltungsbereich

Dieses Dokument beschreibt die technische Architektur für die client-seitige
Verschlüsselung sensibler Nutzerdaten in mentalhealthGPT.

Der Workflow gilt einheitlich für folgende Datentypen:
- Text (Prompts, Chatnachrichten, Transkripte)
- Bilder (z. B. Profilbilder, Dokumentenscans)
- Audio (z. B. Sprachaufzeichnungen)
- Video (z. B. Sitzungsaufzeichnungen)

Ziel ist eine Zero-Knowledge-Architektur, bei der:
- kein Klartext serverseitig gespeichert wird
- keine unverschlüsselten Schlüssel persistiert werden
- Klartext nur temporär im Browser oder in autorisierten KI-Verarbeitungskontexten existiert

---

## 2. Grundprinzipien

- Client-Side Encryption (Verschlüsselung im Browser)
- Envelope Encryption (DEK + KEK)
- Trennung von Daten, Schlüsseln und Zugriffskontrolle
- Zweckgebundener, temporärer Klartextzugriff
- Einheitlicher Workflow für alle Medientypen

---

## 3. Kryptografische Rollen

### 3.1 Data Encryption Key (DEK)
- Wird im Browser erzeugt
- 256 Bit zufällig
- Gilt exakt für ein Objekt (z. B. ein Prompt, eine Audiodatei)
- Wird nach der Verschlüsselung nicht persistent gespeichert

### 3.2 Key Encryption Key (KEK)
- Zentral verwalteter Schlüssel in einem dedizierten Schlüsselverwaltungssystem
- Bezeichnung (konzeptionell): `kek-profile-media`
- Verlässt die Schlüsselverwaltung niemals
- Dient ausschließlich zum Ver- und Entschlüsseln von DEKs

---

## 4. Datenfluss im Browser (Upload)

### 4.1 Vorbereitung
1. Nutzerdaten werden im Browser erfasst
2. Optional: vorgelagerte Pseudonymisierung (siehe separates Dokument)
3. Auswahl oder Generierung eines neuen DEK

### 4.2 Verschlüsselung
- Algorithmus: AES-256-GCM
- Pro Objekt:
  - eigener DEK
  - eigener Initialisierungsvektor (IV)
  - kontextbindende Authenticated Data (AAD)

Ergebnis:
- Ciphertext (Binärdaten)
- Kryptografische Metadaten (IV, AAD, Algorithmus)

### 4.3 Upload
- Ciphertext wird direkt in einen Objektspeicher (z. B. S3-kompatibel) hochgeladen
- Upload erfolgt über zeitlich begrenzte, vorab signierte URLs
- Server erhält keinen Klartext

---

## 5. Schlüssel-Wrapping und Metadaten

### 5.1 Wrapping des DEK
- Der im Browser erzeugte DEK wird an das Backend übertragen
- Das Backend:
  - prüft Authentifizierung und Objektzuordnung
  - ruft die Schlüsselverwaltung auf
  - lässt den DEK mit dem KEK verschlüsseln (Wrapping)

### 5.2 Speicherung
In der relationalen Datenbank werden gespeichert:
- wrapped_dek
- iv
- aad
- verwendeter Algorithmus
- Objekt-Metadaten (Typ, Besitzer, Version)

Nicht gespeichert werden:
- Klartextdaten
- unverschlüsselte DEKs

---

## 6. Datenfluss beim Abruf (Download)

1. Client fordert Objekt an
2. Backend prüft Zugriff
3. Backend liefert:
   - signierte Download-URL für Ciphertext
   - kryptografische Metadaten
4. Client lädt Ciphertext
5. Client fordert DEK-Unwrap an
6. Backend:
   - prüft Zugriff erneut
   - unwrappt DEK über Schlüsselverwaltung
   - gibt DEK temporär zurück
7. Client entschlüsselt lokal

Klartext existiert nur im RAM des Browsers.

---

## 7. KI-Verarbeitung (konzeptionell)

Für KI-gestützte Verarbeitung gilt:
- KI ist ein temporärer Verarbeitungskontext
- Kein persistenter Klartext
- Kein dauerhafter Schlüsselbesitz

Der Zugriff auf Klartext erfolgt:
- zweckgebunden
- zeitlich begrenzt
- autorisiert
- vergleichbar mit client-seitiger Entschlüsselung

Die Architektur unterscheidet strikt zwischen:
- Speicherung (immer verschlüsselt)
- Verarbeitung (temporärer Klartext)

---

## 8. Einheitlichkeit über Medientypen

Der beschriebene Workflow ist identisch für:
- Text: Prompts, Chats, Transkripte
- Bilder: PNG, JPG, WebP
- Audio: WAV, MP3, OGG
- Video: MP4, WebM

Unterschiede bestehen ausschließlich in:
- Dateigröße
- MIME-Type
- optionalen Vorverarbeitungsschritten (z. B. Transkodierung)

Die kryptografische Architektur bleibt unverändert.

---

## 9. Sicherheits- und Compliance-Eigenschaften

- Zero-Knowledge Storage
- Keine serverseitige Klartextverarbeitung
- Kein direkter Client-Zugriff auf Schlüsselverwaltung
- Vollständige Auditierbarkeit
- Konform mit Privacy-by-Design-Prinzipien
- Geeignet für klinische und therapeutische Kontexte

---

## 10. Erweiterbarkeit

Die Architektur ist ausgelegt für:
- Versionierung
- Schlüsselrotation
- Multi-Device-Szenarien
- Institutionelle Mandanten
- Erweiterung auf weitere Datentypen
