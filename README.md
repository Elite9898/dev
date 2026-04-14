# 🎓 SchoolDesk
Nowoczesna aplikacja desktopowa do organizacji nauki dla uczniów.

Zbudowana jako pełnoprawna aplikacja z interfejsem webowym (React) opakowanym w natywną aplikację desktopową przy użyciu **Tauri**.

---

## ✨ Funkcje

### 📊 Dashboard
- podgląd najważniejszych informacji
- dynamiczne statystyki
- szybkie akcje (np. rozpoczęcie sesji nauki)
- integracja danych z całej aplikacji

---

### ✅ Zadania
- dodawanie, edycja i usuwanie zadań
- oznaczanie jako wykonane
- filtrowanie i sortowanie
- priorytety (High / Medium / Low)
- przechowywanie danych lokalnie

---

### 📝 Sprawdziany
- zarządzanie nadchodzącymi sprawdzianami
- sortowanie po dacie
- licznik czasu do wydarzenia (np. „za 2 dni”)
- filtrowanie według ważności

---

### 📅 Plan lekcji
- organizacja zajęć według dni tygodnia
- edycja i usuwanie lekcji
- grupowanie według dni
- sortowanie według godzin

---

### 🧠 Tryb skupienia (Focus)
- timer nauki (Pomodoro)
- start / pauza / wznowienie / reset
- własne ustawienia czasu nauki i przerwy
- szybkie uruchamianie sesji z sidebaru

---

### 📒 Notatki
- tworzenie i edycja notatek
- wyszukiwanie
- automatyczne sortowanie po ostatniej edycji
- przechowywanie lokalne

---

## 🛠️ Technologie

- **React**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Tauri (desktop app)**
- **Rust (backend Tauri)**

---

## 🖥️ Aplikacja desktopowa

Projekt został opakowany w aplikację desktopową przy użyciu **Tauri**, co zapewnia:

- natywną aplikację Windows (.exe)
- szybkie działanie
- niskie zużycie zasobów
- większe bezpieczeństwo niż Electron

---

## 🚀 Uruchomienie projektu
```bash
npm install
npm run dev

Desktop (Tauri)
npm run tauri dev

Build aplikacji
npm run tauri build

📦 Struktura projektu
src/
  components/
  pages/
  data/
  hooks/
  lib/

src-tauri/
  (backend Rust + konfiguracja Tauri)
```
💾 Dane

Aplikacja wykorzystuje LocalStorage do przechowywania danych:

zadania
sprawdziany
plan lekcji
notatki
ustawienia timera
📌 Status projektu

Projekt ukończony jako MVP (Minimum Viable Product):

✔ działający UI
✔ pełna logika aplikacji
✔ zapis danych
✔ wersja desktopowa (.exe)

🔮 Możliwy rozwój
eksport / import danych (JSON)
synchronizacja w chmurze
statystyki nauki
system kont użytkowników
powiadomienia systemowe
🎯 Cel projektu

Celem projektu było stworzenie realnej aplikacji:

z dopracowanym UI/UX
z działającą logiką biznesową
jako aplikacja desktopowa (nie tylko web)
z użyciem nowoczesnego stacku frontend + Rust

👤 Autor

Projekt stworzony w ramach nauki:

frontend development
aplikacje desktopowe
integracja React + Tauri  
