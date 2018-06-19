import { setAttributes, toggleClass } from './utils/elements';

const logo = {
    setup() {
        // add custom logo
        if (this.config.logo && this.config.logo.url) {
            // build logo container
            const logoContainer = document.createElement('div');
            toggleClass(logoContainer, this.config.classNames.logo, true);

            // image put into logo container if link not present
            let imageContainer = logoContainer;

            if (this.config.logo.link) {
                // if logo.link setup, put image into a
                const linkElement = document.createElement('a');
                setAttributes(linkElement, {
                    href: this.config.logo.link,
                });
                logoContainer.appendChild(linkElement);
                imageContainer = linkElement;
            }

            // build logo image
            const logoElement = document.createElement('img');
            setAttributes(logoElement, {
                src: this.config.logo.url,
            });
            imageContainer.appendChild(logoElement);
            this.elements.container.appendChild(logoContainer);
        }
    },
};

export default logo;
