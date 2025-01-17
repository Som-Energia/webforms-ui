class MatomoTracker {
    constructor() {
        this.initialize();
    }

    initialize() {
        const matomoUrl = import.meta.env.VITE_MATOMO_URL
        this._paq = window._paq = window._paq || []

        const doc = document
        const scriptElement = doc.createElement('script')
        const scripts = doc.getElementsByTagName('script')[0]

        scriptElement.type = 'text/javascript'
        scriptElement.async = true
        scriptElement.defer = true
        scriptElement.src = matomoUrl

        scripts.parentNode.insertBefore(scriptElement,scripts);
    }

    trackEvent({ category, action, name, value }) {
        if (category && action) {
          this.pushInstruction('trackEvent', category, action, name, value);
        } else {
          throw new Error(`Error: category and action are required.`);
        }
    }

    pushInstruction(matomoFunctionName,  category, action, name, value) {
        if (typeof window !== 'undefined') {
          window._paq.push([matomoFunctionName, category, action, name, value]);
        }
    
        return this;
    }
}

export default MatomoTracker