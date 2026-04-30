<div align="center">
  <img src="./assets/logos/png/brewlingo_logo_black.png" width="300" alt="Brewlingo Logo" />
  <h2>DISCOVER THE WORLD OF COFFEE</h2>
</div>

> Deze repository bevat mijn eindwerkt als MCT student aan EHB.  </br>
> Hoewel de repository publiek is voor beoordeling door docenten, is dit **geen** open-source project. Pull requests of externe bijdragen worden niet geaccepteerd. </br>

## Project Overview
Brewlingo is een full-stack mobiele applicatie die gebruikers meeneemt in de uitgebreide **theorie achter koffie**. In plaats van alleen recepten, focust de app op de wetenschap en kennis die nodig is om een echte expert te worden. Denk aan de herkomst van bonen, de invloed van maalgraad op extractie, en de theoretische basis voor technieken zoals latte art.

Op basis van een interactieve onboarding flow genereert de app een gepersonaliseerde **learning roadmap**, zodat de gebruiker stap voor stap de theorie leert die relevant is voor hun eigen apparatuur en ambities.

## Repository Structure
Dit project bestaat uit twee aparte repositories. Deze README dient als centrale documentatie voor beide onderdelen.

* **[Brewlingo App (Frontend)](https://github.com/SamHoeterickx/final_work_app)**
* **[Brewlingo API (Backend)](https://github.com/SamHoeterickx/final_work_backend)**

## Tech Stack

### Frontend (Mobile App)
*   **Framework:** React Native met Expo (Expo Router voor file-based routing)
*   **State Management:** Zustand
*   **Data Fetching:** GraphQL Request & React Query
*   **Localization:** React-i18next (Ondersteunde talen: EN, NL, FR)

### Backend (API)
*   **Framework:** NestJS
*   **API Paradigm:** GraphQL (Code-first approach)
*   **Database & ORM:** PostgreSQL met TypeORM
*   **Authentication:** JWT (JSON Web Tokens) met hashed refresh tokens
*   **Mailing:** Resend (voor wachtwoordherstel codes)

### Tooling & CI/CD
*   **Code Quality:** ESLint 9 (Flat Config) & Prettier
*   **CI/CD:** GitHub Actions (Automated linting, PR checks, and semantic versioning releases)


## MVP-1 Features

*   **Interactieve Theorie Onboarding:** Een flow die bepaalt wat de gebruiker al weet en welke apparatuur ze bezitten om de juiste theorie aan te bieden.
*   **Personalized Roadmap:** Generatie van een uniek leertraject gebaseerd op tags, zoals `latte_art`, `bean_to_cup` en `tasting_skills`.
*   **Authenticatie Flow:** Beveiligd inlogsysteem met registratie, JWT tokens en wachtwoordherstel via e-mail verificatie.
*   **Meertaligheid:** De volledige interface is beschikbaar in het Nederlands, Engels en Frans.

## Auteur

Dit project is ontwikkeld door:

*   **Sam Hoeterickx**
    *   Linkedin: [Sam Hoeterickx](https://www.linkedin.com/in/sam-hoeterickx/)
    *   GitHub: [@SamHoeterickx](https://github.com/SamHoeterickx)