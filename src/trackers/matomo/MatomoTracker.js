class MatomoTracker {
    constructor() {
        this.initialize();
    }

    initialize() {
        const matomoUrl = import.meta.env.VITE_MATOMO_URL
        this._paq = window._paq = window._paq || [];

        const doc = document
        const scriptElement = doc.createElement('script')
        const scripts = doc.getElementsByTagName('script')[0]

        _paq.push({'_paq.startTime': (new Date().getTime()), 'event': '_paq.Start'});

        scriptElement.type = 'text/javascript'
        scriptElement.async = true
        scriptElement.defer = true
        scriptElement.src = matomoUrl

        scripts.parentNode.insertBefore(scriptElement,scripts);
    }

    trackEvent({ category, action, name, value, ...otherParams }) {
        if (category && action) {
          this.track({
            data: ['trackEvent', category, action, name, value],
            ...otherParams,
          });
        } else {
          throw new Error(`Error: category and action are required.`);
        }
    }
    
    track({
        data = [],
        documentTitle = window.document.title,
        href,
        customDimensions = false,
    }) {
        if (data.length) {
            if (customDimensions && Array.isArray(customDimensions) && customDimensions.length) {
                customDimensions.map((customDimension) =>
                    this.pushInstruction(
                        'setCustomDimension',
                        customDimension.id,
                        customDimension.value,
                    ),
                );
            }
    
            this.pushInstruction('setCustomUrl', href ?? window.location.href);
            this.pushInstruction('setDocumentTitle', documentTitle);
            this.pushInstruction(...data);
        }
    }

    pushInstruction(name, ...args) {
        if (typeof window !== 'undefined') {
            window._paq.push([name, ...args]);
        }
    
        return this;
    }
}

export default MatomoTracker