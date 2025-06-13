#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "Error: .env.production file not found"
    exit 1
fi

# Check required environment variables
required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "VITE_APP_URL"
    "VITE_API_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Required environment variable $var is not set"
        exit 1
    fi
done

echo "🔧 Starting production build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm run test

# Build the application
echo "🏗️ Building the application..."
npm run build

# Validate the build
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

# Deploy function to check SSL certificate expiration
check_ssl() {
    domain=$1
    exp_date=$(openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
    exp_epoch=$(date -d "$exp_date" +%s)
    now_epoch=$(date +%s)
    days_left=$(( ($exp_epoch - $now_epoch) / 86400 ))
    if [ $days_left -lt 30 ]; then
        echo "⚠️ Warning: SSL certificate for $domain will expire in $days_left days"
    fi
}

# Production environment checks
echo "🔍 Running production environment checks..."

# Check domain DNS
echo "Checking DNS configuration..."
if ! host $VITE_APP_URL > /dev/null; then
    echo "❌ DNS check failed for $VITE_APP_URL"
    exit 1
fi

# Check SSL certificates if domains are accessible
if curl -s https://${VITE_APP_URL#*//} > /dev/null; then
    check_ssl ${VITE_APP_URL#*//}
fi

# Check Supabase connection
echo "Checking Supabase connection..."
if ! curl -s "$VITE_SUPABASE_URL/rest/v1/" -H "apikey: $VITE_SUPABASE_ANON_KEY" > /dev/null; then
    echo "❌ Supabase connection check failed"
    exit 1
fi

echo "✅ Production environment checks completed"

# Generate deployment report
echo "📊 Generating deployment report..."
cat << EOF > deployment-report.txt
Deployment Report ($(date))
-------------------------
Build Status: Success
Environment: Production
Application URL: $VITE_APP_URL
API URL: $VITE_API_URL
Features Enabled:
- Job Recommendations: $VITE_ENABLE_JOB_RECOMMENDATIONS
- Document Generator: $VITE_ENABLE_DOCUMENT_GENERATOR
- Push Notifications: $VITE_ENABLE_PUSH_NOTIFICATIONS

Security Configuration:
- MFA Enabled: $VITE_ENABLE_MFA
- Session Timeout: $VITE_SESSION_TIMEOUT_MINUTES minutes
- Max Login Attempts: $VITE_MAX_LOGIN_ATTEMPTS
EOF

echo "✅ Build and validation completed successfully"
echo "🚀 Ready for deployment"
