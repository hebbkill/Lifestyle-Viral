/**
 * Mock implementation of Canva's SDKs for local development.
 * Uses localStorage to persist data.
 */

window.dataSdk = {
    dataHandler: null,

    async init(handler) {
        console.log("[DataSDK] Initializing...");
        this.dataHandler = handler;
        const data = this.getData();

        // Simulate network delay slightly for realism
        setTimeout(() => {
            if (handler && handler.onDataChanged) {
                handler.onDataChanged(data);
            }
        }, 50);
        return { isOk: true };
    },

    getData() {
        try {
            return JSON.parse(localStorage.getItem('lifestyle_viral_data') || '[]');
        } catch (e) {
            console.error("[DataSDK] Error reading data", e);
            return [];
        }
    },

    async create(item) {
        console.log("[DataSDK] Creating item:", item);
        const data = this.getData();
        
        // Generate a new ID. Use item.id if present, otherwise generate one.
        // We ensure BOTH id and __backendId are set to avoid compatibility issues.
        const newId = item.id || Date.now().toString();

        const newItem = {
            ...item,
            id: newId,
            __backendId: newId
        };

        data.push(newItem);
        this.saveData(data);
        return { isOk: true };
    },

    async update(item) {
        console.log("[DataSDK] Updating item:", item);
        const data = this.getData();
        const index = data.findIndex(d => d.__backendId === item.__backendId);

        if (index !== -1) {
            data[index] = { ...data[index], ...item };
            this.saveData(data);
            return { isOk: true };
        }
        console.warn("[DataSDK] Item not found for update:", item);
        return { isOk: false };
    },

    async delete(item) {
        console.log("[DataSDK] Deleting item:", item);
        let data = this.getData();
        const initialLength = data.length;
        data = data.filter(d => d.__backendId !== item.__backendId);

        if (data.length !== initialLength) {
            this.saveData(data);
            return { isOk: true };
        }
        return { isOk: false };
    },

    saveData(data) {
        localStorage.setItem('lifestyle_viral_data', JSON.stringify(data));
        if (this.dataHandler && this.dataHandler.onDataChanged) {
            this.dataHandler.onDataChanged(data);
        }
    }
};

window.elementSdk = {
    config: {},
    _clientOptions: null,

    init(options) {
        console.log("[ElementSDK] Initializing with options:", options);
        this._clientOptions = options;

        // Load config from localStorage if available
        try {
            const savedConfig = JSON.parse(localStorage.getItem('lifestyle_viral_config') || '{}');
            this.config = { ...options.defaultConfig, ...savedConfig };
        } catch (e) {
            console.error("[ElementSDK] Error loading config", e);
            this.config = options.defaultConfig || {};
        }

        // Trigger initial config change
        if (options.onConfigChange) {
            options.onConfigChange(this.config);
        }
    },

    setConfig(newConfig) {
        console.log("[ElementSDK] Setting config:", newConfig);
        this.config = { ...this.config, ...newConfig };

        // Persist to localStorage
        localStorage.setItem('lifestyle_viral_config', JSON.stringify(this.config));

        if (this._clientOptions && this._clientOptions.onConfigChange) {
            this._clientOptions.onConfigChange(this.config);
        }
    }
};
