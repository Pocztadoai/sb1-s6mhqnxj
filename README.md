# EmailPro - Profesjonalna Aplikacja Email Marketing

Nowoczesna aplikacja do zarządzania kampaniami email marketingowymi z zaawansowanymi funkcjami planowania i personalizacji.

## 🚀 Funkcje

- **Zarządzanie kontaktami** - Import z plików CSV, filtrowanie, kategoryzacja
- **Kampanie email** - Tworzenie i zarządzanie kampaniami z zaawansowanym planowaniem
- **Szablony** - Kreator szablonów email z personalizacją
- **Harmonogram wysyłki** - Inteligentne planowanie z uwzględnieniem godzin pracy
- **Uwierzytelnianie** - Bezpieczne logowanie przez Firebase Auth
- **Baza danych** - Przechowywanie danych w Firebase Firestore
- **Responsywny design** - Optymalizacja dla wszystkich urządzeń

## 🛠️ Technologie

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Hosting**: Netlify
- **Ikony**: Lucide React
- **Build**: Vite

## 📋 Wymagania

- Node.js 18+
- Konto Firebase
- Konto Netlify (do hostingu)

## 🔧 Instalacja i konfiguracja

### 1. Klonowanie repozytorium
```bash
git clone <repository-url>
cd emailpro-app
npm install
```

### 2. Konfiguracja Firebase

1. Utwórz nowy projekt w [Firebase Console](https://console.firebase.google.com/)
2. Włącz Authentication (Email/Password)
3. Utwórz bazę danych Firestore
4. Skopiuj konfigurację Firebase

### 3. Zmienne środowiskowe

Utwórz plik `.env` na podstawie `.env.example`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Uruchomienie lokalnie

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`

## 🚀 Wdrożenie na Netlify

### Automatyczne wdrożenie

1. Połącz repozytorium z Netlify
2. Ustaw zmienne środowiskowe w Netlify Dashboard
3. Netlify automatycznie zbuduje i wdroży aplikację

### Ręczne wdrożenie

```bash
npm run build
# Prześlij folder 'dist' do Netlify
```

## 📊 Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── Navigation.tsx   # Nawigacja główna
│   ├── Dashboard.tsx    # Panel główny
│   ├── ContactsList.tsx # Lista kontaktów
│   ├── ContactImport.tsx# Import kontaktów
│   ├── Settings.tsx     # Panel ustawień
│   └── Login.tsx        # Formularz logowania
├── contexts/            # Konteksty React
│   └── AuthContext.tsx  # Kontekst uwierzytelniania
├── config/              # Konfiguracja
│   └── firebase.ts      # Konfiguracja Firebase
├── utils/               # Narzędzia pomocnicze
│   ├── storage.ts       # Zarządzanie localStorage
│   ├── csvParser.ts     # Parser plików CSV
│   └── scheduler.ts     # Harmonogram wysyłki
└── types/               # Definicje typów TypeScript
    └── index.ts
```

## 🔐 Bezpieczeństwo

- Uwierzytelnianie przez Firebase Auth
- Bezpieczne przechowywanie danych w Firestore
- Walidacja danych po stronie klienta i serwera
- Ochrona przed atakami XSS i CSRF

## 📈 Funkcje zaawansowane

### Import kontaktów
- Obsługa plików CSV
- Automatyczna walidacja adresów email
- Mapowanie kolumn (imię, nazwisko, firma, stanowisko)
- Podgląd przed importem

### Harmonogram kampanii
- Ustawienia godzin pracy
- Wybór dni roboczych
- Interwały wysyłki
- Strefy czasowe

### Personalizacja
- Zmienne w szablonach email
- Dynamiczne podstawianie danych kontaktów
- Podgląd przed wysyłką

## 🤝 Wsparcie

W przypadku problemów lub pytań:
1. Sprawdź dokumentację Firebase
2. Sprawdź logi w konsoli przeglądarki
3. Sprawdź konfigurację zmiennych środowiskowych

## 📄 Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT.