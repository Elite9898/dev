# 🎓 SchoolDesk

Nowoczesna aplikacja desktopowa do organizacji nauki dla uczniów.

Zbudowana jako pełnoprawna aplikacja z interfejsem webowym (React) opakowanym w desktopową aplikację (Tauri).

---

## ✨ Funkcje

### 📊 Dashboard
- podgląd najważniejszych informacji
- szybki dostęp do zadań, sprawdzianów i planu lekcji
- dynamiczne statystyki

### ✅ Zadania
- dodawanie, edycja i usuwanie zadań
- oznaczanie jako wykonane
- filtrowanie i sortowanie

### 📝 Sprawdziany
- zarządzanie nadchodzącymi sprawdzianami
- sortowanie po dacie
- licznik czasu do wydarzenia

### 📅 Plan lekcji
- organizacja lekcji według dni tygodnia
- edycja i usuwanie wpisów
- logiczne grupowanie i sortowanie

### 🧠 Tryb skupienia (Focus)
- timer nauki (Pomodoro)
- pauza / wznowienie / reset
- szybkie uruchamianie sesji

### 📒 Notatki
- tworzenie i edycja notatek
- wyszukiwanie
- automatyczne sortowanie po aktualizacji

---

## 🛠️ Technologie

- **React + TypeScript**
- **Vite**
- **TailwindCSS**
- **Tauri (desktop app)**
- **Rust (backend Tauri)**
- LocalStorage (persistencja danych)

---

## 🖥️ Aplikacja desktopowa

Projekt został opakowany w aplikację desktopową przy użyciu **Tauri**, co pozwala na:

- uruchamianie jako natywna aplikacja Windows (.exe)
- niskie zużycie zasobów
- szybkie działanie

---

## 🚀 Uruchomienie projektu

### Development

```bash
npm install
npm run dev
