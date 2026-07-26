# Clean Architecture & Code Quality Guidelines

For every backend and frontend feature built in this repository, follow this exact standard Clean Architecture flow and directory structure.

## Architecture Flow Summary
`Database (MySQL)` ➔ `ApplicationDbContext` ➔ `Domain Entities` ➔ `Repository Interfaces (Application)` ➔ `Repository Implementations (Infrastructure)` ➔ `Service Interfaces (Application)` ➔ `Service Implementations (Application/Services)` ➔ `API Controllers (Api)` ➔ `Frontend Services & React Query (Frontend)`

---

## Layer-by-Layer Rules

### 1. Domain Layer (`AiRecruitmentPlatform.Domain`)
- All domain entities reside in `Entities/`.
- **Entity Base Class Selection Rules**:
  - **Listing / Collection Domain Entities** (e.g. Skills, Languages, Categories, Experiences, Educations, Job Postings): Must inherit from `OrderableBaseEntity` (which includes `DisplayOrder` alongside `BaseEntity` audit fields).
  - **Single-Row / Summary Domain Entities** (e.g. Personal Profile Info, About Us, General Settings): Must inherit directly from `BaseEntity` (`Id`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`, `IsActive`, `IsDeleted`).
  - *(Note: Existing candidate entities remain unchanged, but all upcoming entities must strictly abide by this entity rule).*
- Domain Layer must NEVER reference Application or Infrastructure layers.

### 2. Application Layer (`AiRecruitmentPlatform.Application`)
- **Application Services (`Services/`)**:
  - All feature business services (e.g. `CandidateProfileService`, `RecruiterProfileService`, `JobPostingService`) MUST be placed in `Application/Services/`.
  - **Identity Abstraction (`IIdentityService`)**: Application services must NEVER inject `UserManager<ApplicationUser>` or ASP.NET Core Identity directly in the Application layer. Instead, inject `IIdentityService` (defined in `Interfaces/Services/IIdentityService.cs`) to get or update user details (`FirstName`, `LastName`, `Email`, `PhoneNumber`, `AvatarUrl`) on `ApplicationUser`.
  - **AutoMapper Usage (`IMapper`)**: For mapping between Domain Entities and DTOs (and vice-versa), always inject `IMapper` into Application Services. Configure mapping profiles in `Profiles/MappingProfile.cs`. Avoid writing verbose manual property assignment loops in services.
- **Service Interfaces (`Interfaces/Services/`)**:
  - Define clear application service interfaces (e.g., `ICandidateProfileService`, `IAuthService`, `IIdentityService`, `IFileService`, `IEmailService`) inside `Interfaces/Services/`.
- **DTO Organization Rules (`DTOs/[Feature]/`)**:
  - **Single Class Per File**: NEVER group/dump multiple DTO classes into a single file (such as `[Feature]Dtos.cs`).
  - Every DTO must be created as its own dedicated `.cs` file inside `DTOs/[Feature]/` (e.g., `CandidateExperienceDto.cs`, `CandidateEducationDto.cs`, `CandidateSkillDto.cs`).
- **Repository Interfaces (`Interfaces/Repositories/`)**:
  - All feature repositories must extend `IRepository<T>` (e.g. `I[Feature]Repository : IRepository<[Feature]Entity>`).

### 3. Infrastructure Layer (`AiRecruitmentPlatform.Infrastructure`)
- **Persistence (`Persistence/`)**:
  - `ApplicationDbContext.cs` manages DbSets. Table names and columns automatically follow `UseSnakeCaseNamingConvention()`.
  - **EF Core Migrations (`Persistence/Migrations/`)**: All database migrations MUST be placed inside `Persistence/Migrations/` using command:
    `dotnet ef migrations add <Name> --project src/AiRecruitmentPlatform.Infrastructure --startup-project src/AiRecruitmentPlatform.Api --output-dir Persistence/Migrations`
- **Repositories (`Repositories/`)**:
  - Implement concrete repositories in `Repositories/` (e.g., `[Feature]Repository : GenericRepository<T>, I[Feature]Repository`).
- **Identity Implementations (`Identity/`)**:
  - `IdentityService.cs` (implements `IIdentityService` using `UserManager<ApplicationUser>`) and `AuthService.cs` reside in `Infrastructure/Identity/`.
- **External Utility Services (`Services/`)**:
  - `Services/` in Infrastructure is strictly reserved for external services (e.g., `FileService`, `EmailService`).
- **DI Registration (`InfrastructureServicesRegistration.cs`)**:
  - Register all repository and service implementations using `services.AddScoped<I..., ...>()`.

### 4. API Layer (`AiRecruitmentPlatform.Api`)
- Controllers reside in `Controllers/`.
- Controller classes inject `I[Feature]Service` (NEVER repositories directly).
- Return responses wrapped in standard `ApiResponse<T>.SuccessResult(...)` or `ApiResponse<T>.FailureResult(...)`.
- Extract logged-in user identity using `User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("uid")`.

### 5. Frontend Layer (`frontend/src`)
- **Reuse Existing UI Shells & Pages FIRST (DO NOT Create Duplicate UI Pages)**:
  - BEFORE building any frontend feature, ALWAYS inspect `frontend/src/features/[feature]/pages/` and `components/` to check for pre-existing UI mockups or layout page shells.
  - **MANDATORY RULE**: Always preserve, update, and reuse existing UI layouts, design aesthetics, and components. NEVER re-create or duplicate an existing UI page shell from scratch. Instead, wire up and connect the existing page UI to real backend API endpoints via Axios services, Zustand stores, and `@tanstack/react-query` state.
- **API Services (`services/[feature].service.ts`)**: Define Axios calls wrapping the standard `api` client. For `FormData` file uploads, explicitly pass `headers: { 'Content-Type': 'multipart/form-data' }`.
- **Zustand Stores (`store/`)**: MANDATORY for all feature states (e.g. `company-store.ts`, `auth-store.ts`, `notification-store.ts`, `job-store.ts`, `candidate-store.ts`). Every frontend feature MUST create or update a dedicated Zustand store in `store/` to maintain and sync global client state alongside `@tanstack/react-query` server state.
- **Pages & Components (`features/[feature]/pages/`)**: Use `@tanstack/react-query` (`useQuery`, `useMutation`) for server state and real-time toast notifications (`react-hot-toast`), while syncing state updates into the corresponding Zustand store.

