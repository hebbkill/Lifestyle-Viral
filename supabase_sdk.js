/**
 * Supabase SDK implementation for Lifestyle Viral Planner
 * Replaces mock_sdk.js with real cloud database functionality
 */

// Supabase client will be initialized after config is loaded
let supabaseClient = null;

/**
 * Initialize Supabase client with environment configuration
 */
function initSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    const supabaseUrl = window.ENV?.SUPABASE_URL;
    const supabaseKey = window.ENV?.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('[Supabase] Missing configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in config.js');
        throw new Error('Supabase configuration missing');
    }

    console.log('[Supabase] Initializing client...');
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    return supabaseClient;
}

/**
 * Data SDK - Manages video data in Supabase
 */
window.dataSdk = {
    dataHandler: null,
    subscription: null,

    async init(handler) {
        console.log('[DataSDK] Initializing...');
        this.dataHandler = handler;

        try {
            const client = initSupabaseClient();

            // Get initial data
            const data = await this.getData();

            // Set up real-time subscription for changes
            this.subscription = client
                .channel('videos_changes')
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'videos' },
                    async (payload) => {
                        console.log('[DataSDK] Real-time update:', payload);
                        // Refresh data when changes occur
                        const updatedData = await this.getData();
                        if (this.dataHandler?.onDataChanged) {
                            this.dataHandler.onDataChanged(updatedData);
                        }
                    }
                )
                .subscribe();

            // Trigger initial data load
            if (handler?.onDataChanged) {
                handler.onDataChanged(data);
            }

            return { isOk: true };
        } catch (error) {
            console.error('[DataSDK] Initialization error:', error);
            return { isOk: false, error: error.message };
        }
    },

    async getData() {
        try {
            const client = initSupabaseClient();
            const { data, error } = await client
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to match app's expected format
            return (data || []).map(video => ({
                ...video,
                __backendId: video.id, // For compatibility with existing code
            }));
        } catch (error) {
            console.error('[DataSDK] Error reading data:', error);
            return [];
        }
    },

    async create(item) {
        console.log('[DataSDK] Creating item:', item);
        try {
            const client = initSupabaseClient();

            // Remove client-side only fields
            const { __backendId, id, ...videoData } = item;

            const { data, error } = await client
                .from('videos')
                .insert([videoData])
                .select()
                .single();

            if (error) throw error;

            console.log('[DataSDK] Created successfully:', data);
            return { isOk: true, data };
        } catch (error) {
            console.error('[DataSDK] Create error:', error);
            return { isOk: false, error: error.message };
        }
    },

    async update(item) {
        console.log('[DataSDK] Updating item:', item);
        try {
            const client = initSupabaseClient();

            // Use either __backendId or id
            const itemId = item.__backendId || item.id;
            if (!itemId) {
                throw new Error('No ID found for update');
            }

            // Remove metadata fields
            const { __backendId, id, created_at, ...videoData } = item;

            const { data, error } = await client
                .from('videos')
                .update(videoData)
                .eq('id', itemId)
                .select()
                .single();

            if (error) throw error;

            console.log('[DataSDK] Updated successfully:', data);
            return { isOk: true, data };
        } catch (error) {
            console.error('[DataSDK] Update error:', error);
            return { isOk: false, error: error.message };
        }
    },

    async delete(item) {
        console.log('[DataSDK] Deleting item:', item);
        try {
            const client = initSupabaseClient();

            const itemId = item.__backendId || item.id;
            if (!itemId) {
                throw new Error('No ID found for delete');
            }

            const { error } = await client
                .from('videos')
                .delete()
                .eq('id', itemId);

            if (error) throw error;

            console.log('[DataSDK] Deleted successfully');
            return { isOk: true };
        } catch (error) {
            console.error('[DataSDK] Delete error:', error);
            return { isOk: false, error: error.message };
        }
    },

    // Cleanup subscription on page unload
    cleanup() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};

/**
 * Element SDK - Manages app configuration in Supabase
 */
window.elementSdk = {
    config: {},
    _clientOptions: null,
    configId: null,

    async init(options) {
        console.log('[ElementSDK] Initializing with options:', options);
        this._clientOptions = options;

        try {
            const client = initSupabaseClient();

            // Try to load existing config
            const { data, error } = await client
                .from('app_config')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (data) {
                // Use existing config
                this.configId = data.id;
                this.config = {
                    app_title: data.app_title,
                    creator_name: data.creator_name,
                    weekly_goal: data.weekly_goal,
                    weekly_goal_number: data.weekly_goal_number,
                    word_preset: data.word_preset,
                    word_max: data.word_max
                };
                console.log('[ElementSDK] Loaded existing config:', this.config);
            } else {
                // Create initial config with defaults
                this.config = options.defaultConfig || {};
                const { data: newConfig, error: insertError } = await client
                    .from('app_config')
                    .insert([{
                        app_title: this.config.app_title,
                        creator_name: this.config.creator_name,
                        weekly_goal: this.config.weekly_goal,
                        weekly_goal_number: this.config.weekly_goal_number,
                        word_preset: this.config.word_preset,
                        word_max: this.config.word_max
                    }])
                    .select()
                    .single();

                if (insertError) throw insertError;
                this.configId = newConfig.id;
                console.log('[ElementSDK] Created new config:', this.config);
            }

            // Trigger initial config change
            if (options.onConfigChange) {
                options.onConfigChange(this.config);
            }
        } catch (error) {
            console.error('[ElementSDK] Error loading config:', error);
            // Fallback to default config
            this.config = options.defaultConfig || {};
            if (options.onConfigChange) {
                options.onConfigChange(this.config);
            }
        }
    },

    async setConfig(newConfig) {
        console.log('[ElementSDK] Setting config:', newConfig);
        this.config = { ...this.config, ...newConfig };

        try {
            const client = initSupabaseClient();

            if (this.configId) {
                // Update existing config
                const { error } = await client
                    .from('app_config')
                    .update({
                        app_title: this.config.app_title,
                        creator_name: this.config.creator_name,
                        weekly_goal: this.config.weekly_goal,
                        weekly_goal_number: this.config.weekly_goal_number,
                        word_preset: this.config.word_preset,
                        word_max: this.config.word_max,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', this.configId);

                if (error) throw error;
            } else {
                // Create new config if none exists
                const { data, error } = await client
                    .from('app_config')
                    .insert([{
                        app_title: this.config.app_title,
                        creator_name: this.config.creator_name,
                        weekly_goal: this.config.weekly_goal,
                        weekly_goal_number: this.config.weekly_goal_number,
                        word_preset: this.config.word_preset,
                        word_max: this.config.word_max
                    }])
                    .select()
                    .single();

                if (error) throw error;
                this.configId = data.id;
            }

            // Trigger config change callback
            if (this._clientOptions?.onConfigChange) {
                this._clientOptions.onConfigChange(this.config);
            }
        } catch (error) {
            console.error('[ElementSDK] Error saving config:', error);
        }
    }
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.dataSdk.cleanup();
});
