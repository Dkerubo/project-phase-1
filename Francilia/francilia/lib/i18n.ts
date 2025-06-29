export interface Translation {
  [key: string]: string | Translation
}

export interface Translations {
  [locale: string]: Translation
}

export const translations: Translations = {
  en: {
    common: {
      welcome: "Welcome",
      loading: "Loading...",
      search: "Search",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      back: "Back",
      next: "Next",
      previous: "Previous",
      close: "Close",
      confirm: "Confirm",
      yes: "Yes",
      no: "No"
    },
    nav: {
      browse: "Browse",
      dashboard: "Dashboard",
      settings: "Settings",
      logout: "Sign Out",
      profile: "Profile"
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      welcomeBack: "Welcome back",
      createAccount: "Create Account",
      enterCredentials: "Enter your credentials to access your account",
      joinViewers: "Join thousands of viewers worldwide"
    },
    browse: {
      searchMovies: "Search movies...",
      latestMovies: "Latest Movies",
      searchResults: "Search Results",
      moviesAvailable: "movies available",
      noMoviesFound: "No movies found matching",
      playNow: "Play Now",
      moreInfo: "More Info",
      play: "Play"
    },
    subscription: {
      choosePlan: "Choose Your Experience",
      startFreeTrial: "Start Free Trial",
      premium: "Premium",
      standard: "Standard",
      premiumDesc: "Ultimate experience, no ads",
      standardDesc: "Great entertainment with ads",
      firstMonthFree: "First Month FREE",
      freeTrialDetails: "Free Trial Details",
      cancelAnytime: "Cancel anytime during your free trial with no charges"
    },
    dashboard: {
      welcomeBack: "Welcome back",
      happeningToday: "Here's what's happening with Francilia Films today",
      totalUsers: "Total Users",
      activeSubscriptions: "Active Subscriptions",
      monthlyRevenue: "Monthly Revenue",
      contentViews: "Content Views",
      subscriptionPlans: "Subscription Plans",
      topPerforming: "Top Performing Content",
      recentUsers: "Recent Users",
      systemHealth: "System Health",
      contentManagement: "Content Management",
      apiSettings: "API Settings",
      addNewMovie: "Add New Movie",
      editMovie: "Edit Movie",
      movieTitle: "Movie Title",
      movieDescription: "Movie Description",
      movieGenre: "Genre",
      movieYear: "Year",
      movieRating: "Rating",
      movieDuration: "Duration",
      thumbnailUrl: "Thumbnail URL",
      backdropUrl: "Backdrop URL",
      videoUrl: "Video URL",
      cast: "Cast",
      director: "Director",
      language: "Language",
      country: "Country",
      updateApiKey: "Update API Key",
      currentApiKey: "Current API Key",
      newApiKey: "New API Key",
      testConnection: "Test Connection",
      connectionStatus: "Connection Status",
      connected: "Connected",
      disconnected: "Disconnected",
      saveChanges: "Save Changes"
    },
    watch: {
      backToBrowse: "Back to Browse",
      yourPlan: "Your Plan",
      upgradeNow: "Upgrade Now",
      adFreeViewing: "Upgrade to Premium for ad-free viewing and 4K quality",
      advertisement: "Advertisement",
      upgradeMessage: "Upgrade to Premium to enjoy ad-free viewing"
    }
  },
  es: {
    common: {
      welcome: "Bienvenido",
      loading: "Cargando...",
      search: "Buscar",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      add: "Agregar",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      close: "Cerrar",
      confirm: "Confirmar",
      yes: "Sí",
      no: "No"
    },
    nav: {
      browse: "Explorar",
      dashboard: "Panel",
      settings: "Configuración",
      logout: "Cerrar Sesión",
      profile: "Perfil"
    },
    auth: {
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      email: "Correo",
      password: "Contraseña",
      fullName: "Nombre Completo",
      welcomeBack: "Bienvenido de vuelta",
      createAccount: "Crear Cuenta",
      enterCredentials: "Ingresa tus credenciales para acceder a tu cuenta",
      joinViewers: "Únete a miles de espectadores en todo el mundo"
    },
    browse: {
      searchMovies: "Buscar películas...",
      latestMovies: "Últimas Películas",
      searchResults: "Resultados de Búsqueda",
      moviesAvailable: "películas disponibles",
      noMoviesFound: "No se encontraron películas que coincidan con",
      playNow: "Reproducir Ahora",
      moreInfo: "Más Información",
      play: "Reproducir"
    },
    subscription: {
      choosePlan: "Elige Tu Experiencia",
      startFreeTrial: "Iniciar Prueba Gratuita",
      premium: "Premium",
      standard: "Estándar",
      premiumDesc: "Experiencia definitiva, sin anuncios",
      standardDesc: "Gran entretenimiento con anuncios",
      firstMonthFree: "Primer Mes GRATIS",
      freeTrialDetails: "Detalles de la Prueba Gratuita",
      cancelAnytime: "Cancela en cualquier momento durante tu prueba gratuita sin cargos"
    },
    dashboard: {
      welcomeBack: "Bienvenido de vuelta",
      happeningToday: "Esto es lo que está pasando con Francilia Films hoy",
      totalUsers: "Usuarios Totales",
      activeSubscriptions: "Suscripciones Activas",
      monthlyRevenue: "Ingresos Mensuales",
      contentViews: "Visualizaciones de Contenido",
      subscriptionPlans: "Planes de Suscripción",
      topPerforming: "Contenido Más Popular",
      recentUsers: "Usuarios Recientes",
      systemHealth: "Estado del Sistema",
      contentManagement: "Gestión de Contenido",
      apiSettings: "Configuración de API",
      addNewMovie: "Agregar Nueva Película",
      editMovie: "Editar Película",
      movieTitle: "Título de la Película",
      movieDescription: "Descripción de la Película",
      movieGenre: "Género",
      movieYear: "Año",
      movieRating: "Calificación",
      movieDuration: "Duración",
      thumbnailUrl: "URL de Miniatura",
      backdropUrl: "URL de Fondo",
      videoUrl: "URL de Video",
      cast: "Reparto",
      director: "Director",
      language: "Idioma",
      country: "País",
      updateApiKey: "Actualizar Clave API",
      currentApiKey: "Clave API Actual",
      newApiKey: "Nueva Clave API",
      testConnection: "Probar Conexión",
      connectionStatus: "Estado de Conexión",
      connected: "Conectado",
      disconnected: "Desconectado",
      saveChanges: "Guardar Cambios"
    },
    watch: {
      backToBrowse: "Volver a Explorar",
      yourPlan: "Tu Plan",
      upgradeNow: "Actualizar Ahora",
      adFreeViewing: "Actualiza a Premium para visualización sin anuncios y calidad 4K",
      advertisement: "Publicidad",
      upgradeMessage: "Actualiza a Premium para disfrutar de visualización sin anuncios"
    }
  },
  fr: {
    common: {
      welcome: "Bienvenue",
      loading: "Chargement...",
      search: "Rechercher",
      cancel: "Annuler",
      save: "Sauvegarder",
      delete: "Supprimer",
      edit: "Modifier",
      add: "Ajouter",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      close: "Fermer",
      confirm: "Confirmer",
      yes: "Oui",
      no: "Non"
    },
    nav: {
      browse: "Parcourir",
      dashboard: "Tableau de Bord",
      settings: "Paramètres",
      logout: "Se Déconnecter",
      profile: "Profil"
    },
    auth: {
      signIn: "Se Connecter",
      signUp: "S'inscrire",
      email: "Email",
      password: "Mot de Passe",
      fullName: "Nom Complet",
      welcomeBack: "Bon retour",
      createAccount: "Créer un Compte",
      enterCredentials: "Entrez vos identifiants pour accéder à votre compte",
      joinViewers: "Rejoignez des milliers de spectateurs dans le monde"
    },
    browse: {
      searchMovies: "Rechercher des films...",
      latestMovies: "Derniers Films",
      searchResults: "Résultats de Recherche",
      moviesAvailable: "films disponibles",
      noMoviesFound: "Aucun film trouvé correspondant à",
      playNow: "Lire Maintenant",
      moreInfo: "Plus d'Infos",
      play: "Lire"
    },
    subscription: {
      choosePlan: "Choisissez Votre Expérience",
      startFreeTrial: "Commencer l'Essai Gratuit",
      premium: "Premium",
      standard: "Standard",
      premiumDesc: "Expérience ultime, sans publicités",
      standardDesc: "Excellent divertissement avec publicités",
      firstMonthFree: "Premier Mois GRATUIT",
      freeTrialDetails: "Détails de l'Essai Gratuit",
      cancelAnytime: "Annulez à tout moment pendant votre essai gratuit sans frais"
    },
    dashboard: {
      welcomeBack: "Bon retour",
      happeningToday: "Voici ce qui se passe avec Francilia Films aujourd'hui",
      totalUsers: "Utilisateurs Totaux",
      activeSubscriptions: "Abonnements Actifs",
      monthlyRevenue: "Revenus Mensuels",
      contentViews: "Vues de Contenu",
      subscriptionPlans: "Plans d'Abonnement",
      topPerforming: "Contenu le Plus Performant",
      recentUsers: "Utilisateurs Récents",
      systemHealth: "Santé du Système",
      contentManagement: "Gestion de Contenu",
      apiSettings: "Paramètres API",
      addNewMovie: "Ajouter un Nouveau Film",
      editMovie: "Modifier le Film",
      movieTitle: "Titre du Film",
      movieDescription: "Description du Film",
      movieGenre: "Genre",
      movieYear: "Année",
      movieRating: "Note",
      movieDuration: "Durée",
      thumbnailUrl: "URL de Miniature",
      backdropUrl: "URL d'Arrière-plan",
      videoUrl: "URL Vidéo",
      cast: "Distribution",
      director: "Réalisateur",
      language: "Langue",
      country: "Pays",
      updateApiKey: "Mettre à Jour la Clé API",
      currentApiKey: "Clé API Actuelle",
      newApiKey: "Nouvelle Clé API",
      testConnection: "Tester la Connexion",
      connectionStatus: "État de la Connexion",
      connected: "Connecté",
      disconnected: "Déconnecté",
      saveChanges: "Sauvegarder les Modifications"
    },
    watch: {
      backToBrowse: "Retour à Parcourir",
      yourPlan: "Votre Plan",
      upgradeNow: "Mettre à Niveau Maintenant",
      adFreeViewing: "Passez à Premium pour un visionnage sans publicité et une qualité 4K",
      advertisement: "Publicité",
      upgradeMessage: "Passez à Premium pour profiter d'un visionnage sans publicité"
    }
  }
}

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
]

export class I18n {
  private static instance: I18n
  private currentLocale: string = 'en'
  private translations: Translations = translations

  private constructor() {
    // Load saved language from localStorage
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('francilia_language')
      if (savedLocale && this.translations[savedLocale]) {
        this.currentLocale = savedLocale
      }
    }
  }

  static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n()
    }
    return I18n.instance
  }

  setLocale(locale: string): void {
    if (this.translations[locale]) {
      this.currentLocale = locale
      if (typeof window !== 'undefined') {
        localStorage.setItem('francilia_language', locale)
      }
    }
  }

  getLocale(): string {
    return this.currentLocale
  }

  t(key: string): string {
    const keys = key.split('.')
    let value: any = this.translations[this.currentLocale]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = this.translations['en']
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found in fallback
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  getLanguageName(code: string): string {
    const language = languages.find(lang => lang.code === code)
    return language ? language.name : code
  }

  getLanguageFlag(code: string): string {
    const language = languages.find(lang => lang.code === code)
    return language ? language.flag : '🌐'
  }
}

export const i18n = I18n.getInstance()