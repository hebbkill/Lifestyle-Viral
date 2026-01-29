/**
 * Environment Configuration
 * 
 * IMPORTANT: Replace the placeholder values below with your actual Supabase credentials
 * 
 * To get your credentials:
 * 1. Go to https://supabase.com/dashboard
 * 2. Select your project
 * 3. Go to Settings > API
 * 4. Copy the "Project URL" and "anon public" key
 */

window.ENV = {
    // Your Supabase project URL
    SUPABASE_URL: 'https://fzmfzccoeoejamjhrnmz.supabase.co',

    // Your Supabase anon/public key (safe to expose in frontend)
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bWZ6Y2NvZW9lamFtamhybm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTc5MjMsImV4cCI6MjA4NTEzMzkyM30.2eJlB7P2yEXiFZpcf8O_txK7YzXGwXteuQ-F171OAl0'
};

// Development mode detection
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Config] Running in development mode');

    // You can set different credentials for local development if needed
    // window.ENV.SUPABASE_URL = 'your_dev_url';
    // window.ENV.SUPABASE_ANON_KEY = 'your_dev_key';
}

// Validate configuration
if (window.ENV.SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' ||
    window.ENV.SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.warn('⚠️ [Config] Supabase credentials not configured! Please update config.js with your credentials.');
    console.warn('📖 See DEPLOYMENT.md for setup instructions.');
}
