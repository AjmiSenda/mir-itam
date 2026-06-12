from pathlib import Path

from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY: keep secret key out of code
SECRET_KEY = config("DJANGO_SECRET_KEY")

# SECURITY: default debug off
DEBUG = config("DJANGO_DEBUG", cast=bool, default=False)

ALLOWED_HOSTS = [
    ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="*").split(",")
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "django_filters",
    "users",
    "assets",
]

AUTH_USER_MODEL = "users.CustomUser"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB", default="itam"),
        "USER": config("POSTGRES_USER", default="itam_user"),
        "PASSWORD": config("POSTGRES_PASSWORD"),
        "HOST": config("POSTGRES_HOST", default="localhost"),
        "PORT": config("POSTGRES_PORT", default="5432"),
    }
}

# Password validation
# Requirement: min 8 characters, must include a number and a special character.
class MinimumPasswordComplexityValidator:
    def validate(self, password, user=None):
        if password is None:
            from django.core.exceptions import ValidationError

            raise ValidationError("Password is required.")

        if len(password) < 8:
            from django.core.exceptions import ValidationError

            raise ValidationError("Password must be at least 8 characters long.")

        has_digit = any(ch.isdigit() for ch in password)
        if not has_digit:
            from django.core.exceptions import ValidationError

            raise ValidationError("Password must include at least one number.")

        has_special = any((not ch.isalnum()) for ch in password)
        if not has_special:
            from django.core.exceptions import ValidationError

            raise ValidationError("Password must include at least one special character.")

    def get_help_text(self):
        return "Your password must contain at least 8 characters, including at least one number and one special character."


AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
    {"NAME": "config.settings.MinimumPasswordComplexityValidator"},
]


LANGUAGE_CODE = "en-us"
TIME_ZONE = config("DJANGO_TIME_ZONE", default="UTC")
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS restricted to dev frontend
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in config("CORS_ALLOWED_ORIGINS", default="http://localhost:5173").split(",") if o.strip()
]
CORS_ALLOW_CREDENTIALS = True

# DRF / REST framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    # Conservative default; we will additionally apply stricter throttles specifically on /api/token/ in the JWT view wiring step.
    "DEFAULT_THROTTLE_RATES": {
        "anon": "20/min",
        "user": "60/min",
    },
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": config("DRF_PAGE_SIZE", cast=int, default=20),
}


# JWT configuration
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=config("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", cast=int, default=15)
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=config("JWT_REFRESH_TOKEN_LIFETIME_DAYS", cast=int, default=7)
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

SIMPLEJWT_ACCESS_TOKEN_LIFETIME = SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
SIMPLEJWT_REFRESH_TOKEN_LIFETIME = SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]
SIMPLEJWT_ROTATE_REFRESH_TOKENS = SIMPLE_JWT["ROTATE_REFRESH_TOKENS"]
SIMPLEJWT_BLACKLIST_AFTER_ROTATION = SIMPLE_JWT["BLACKLIST_AFTER_ROTATION"]
SIMPLEJWT_AUTH_HEADER_TYPES = SIMPLE_JWT["AUTH_HEADER_TYPES"]

# HTTPS-ready cookie settings (refresh token in httpOnly cookie will be handled by views)
SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", cast=bool, default=False)
CSRF_COOKIE_SECURE = config("CSRF_COOKIE_SECURE", cast=bool, default=False)

# Rate limiting (placeholder config flag; actual enforcement will be added via middleware/decorators in step 6/10)
REST_USE_DEFAULT_FORMAT = False

# Security headers
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_BROWSER_XSS_FILTER = True
SECURE_SSL_REDIRECT = config("DJANGO_SECURE_SSL_REDIRECT", cast=bool, default=False)
SECURE_HSTS_SECONDS = config("DJANGO_SECURE_HSTS_SECONDS", cast=int, default=0)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = bool(config("DJANGO_SECURE_HSTS_PRELOAD", cast=bool, default=False))


# Additional security
SECURE_HSTS_SECONDS = int(SECURE_HSTS_SECONDS)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
}


