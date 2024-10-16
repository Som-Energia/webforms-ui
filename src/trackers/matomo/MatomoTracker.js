class MatomoTracker {
    constructor() {
        this.initialize();
    }

    initialize() {
        const matomoUrl = import.meta.env.VITE_MATOMO_URL
        this._formTracker = window._formTracker = window._formTracker || [];

        const doc = document
        const scriptElement = doc.createElement('script')
        const scripts = doc.getElementsByTagName('script')[0]

        _formTracker.push({'_formTracker.startTime': (new Date().getTime()), 'event': '_formTracker.Start'});

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
            window._formTracker.push([name, ...args]);
        }
    
        return this;
    }
}

export default MatomoTracker