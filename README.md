
# 📘 Documentation de l’API – Port de Plaisance Russell

## 🛠️ Base URL
```
http://localhost:5002
```

## 🔐 Authentification
L’API utilise **JWT (JSON Web Token)** pour sécuriser certaines routes.

Inclure dans les **headers** :
```
Authorization: Bearer <votre_token_JWT>
```

## 📦 Endpoints

### 1. 👤 Utilisateurs

#### ✅ Créer un utilisateur
`POST /users`

**Body JSON** :
```json
{
  "username": "capitaine",
  "email": "capitaine@port.fr",
  "password": "123456"
}
```

#### ✅ Se connecter
`POST /users/login`

**Body JSON** :
```json
{
  "email": "capitaine@port.fr",
  "password": "123456"
}
```

**Réponse** :
```json
{
  "message": "Connexion réussie ✅",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "username": "capitaine",
    "email": "capitaine@port.fr"
  }
}
```

### 2. ⚓ Catways

#### ➕ Ajouter un catway
`POST /catways` (JWT requis)

**Body JSON** :
```json
{
  "name": "C1",
  "location": "Zone Nord"
}
```

#### 📋 Lister les catways disponibles
`GET /catways`

**Réponse** :
```json
[
  {
    "_id": "id",
    "name": "C1",
    "location": "Zone Nord",
    "isAvailable": true
  }
]
```

### 3. 📅 Réservations

#### ✅ Créer une réservation
`POST /reservations` (JWT requis)

**Body JSON** :
```json
{
  "catwayId": "id_du_catway",
  "date": "2025-06-05",
  "duration": 3
}
```

#### 👁 Voir ses réservations
`GET /reservations/me` (JWT requis)

**Réponse** :
```json
[
  {
    "_id": "...",
    "catway": {
      "name": "C1",
      "location": "Zone Nord"
    },
    "date": "2025-06-05T00:00:00.000Z",
    "duration": 3
  }
]
```

#### ❌ Annuler une réservation
`DELETE /reservations/:id` (JWT requis)

**Réponse** :
```json
{
  "message": "Réservation annulée ❌"
}
```

## ✅ Statut des routes

| Route                    | Méthode | JWT requis | Description                        |
|-------------------------|---------|------------|------------------------------------|
| `/users`                | POST    | ❌         | Créer un utilisateur               |
| `/users/login`          | POST    | ❌         | Se connecter et recevoir un token  |
| `/catways`              | POST    | ✅         | Ajouter un catway                  |
| `/catways`              | GET     | ❌         | Lister les catways disponibles     |
| `/reservations`         | POST    | ✅         | Réserver un catway                 |
| `/reservations/me`      | GET     | ✅         | Voir ses réservations              |
| `/reservations/:id`     | DELETE  | ✅         | Annuler une réservation            |

## 🗂️ Modèles MongoDB

### 🧍 User
```js
{
  username: String,
  email: String,
  password: String
}
```

### ⚓ Catway
```js
{
  name: String,
  location: String,
  isAvailable: Boolean (default: true)
}
```

### 📅 Reservation
```js
{
  user: ObjectId (ref User),
  catway: ObjectId (ref Catway),
  date: Date,
  duration: Number,
  createdAt: Date
}
```

## 🔚 Notes
- Données sauvegardées dans MongoDB.
- Mots de passe hachés avec `bcryptjs`.
- Middleware JWT (`auth.js`) pour protéger les routes.
