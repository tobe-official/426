
# 📝 FastAPI User Login Backend

Ein einfaches Backend für User-Registrierung, Login und geschützte Routen mit JWT Authentifizierung.

---

## 📦 Setup

### 1️⃣ Abhängigkeiten installieren:

```bash
pip install -r requirements.txt
```

### 2️⃣ .env Datei erstellen:

```env
secret=DEIN_SUPER_GEHEIMER_KEY
algorithm=HS256
```

### 3️⃣ App starten:

```bash
uvicorn main:app --reload
```

---

## 🔐 Endpoints

### 1️⃣ POST /register

Registriert einen neuen User.

**Body (JSON):**
```json
{
  "username": "deinusername",
  "password": "deinpasswort"
}
```

⚠ Der Username darf nur aus Kleinbuchstaben bestehen.

**Responses:**

- `200 OK` → User erfolgreich erstellt
- `400 Bad Request` → Username bereits registriert oder ungültig

---

### 2️⃣ POST /login

Authentifiziert den User und gibt ein JWT-Token zurück.

**Body (JSON):**
```json
{
  "username": "deinusername",
  "password": "deinpasswort"
}
```

**Responses:**

- `200 OK` → JWT Token:
```json
{
  "access_token": "TOKENSTRING"
}
```
- `401 Unauthorized` → Ungültige Zugangsdaten

---

### 3️⃣ GET /protected

Geschützte Route. Nur mit gültigem JWT Token zugänglich.

**Header:**
```bash
Authorization: Bearer <TOKENSTRING>
```

**Responses:**

- `200 OK` → Erfolgreicher Zugriff:
```json
{
  "message": "You are authenticated!"
}
```
- `403 Forbidden` → Ungültiger oder abgelaufener Token
