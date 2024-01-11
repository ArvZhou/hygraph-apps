export function isImageFile(name: string) {
    return (/\.(jpg|jpeg|png|gif|svg)$/i).test(name);
}

function getDomains(domainsStr: string) {
    if (!domainsStr) {
        return [];
    }

    try {
        return JSON.parse(domainsStr);
    } catch (error) {
        return [];
    }
}

type DomainTypes = [Record<string, string>[], Record<string, string>[]];

function replaceSrc(src: string, domains: Record<string, string>[]) {
    const [hostDomains, hashDomains] =
        domains.reduce<DomainTypes>((domainTypes: DomainTypes, _domain: Record<string, string>) => {
                const [_hostDomains, _hashDomains] = domainTypes;
                if ( _domain.validUrl.indexOf("?") > -1) {
                    return [_hostDomains, [..._hashDomains, _domain]];
                }

                return [ [..._hostDomains, _domain], _hashDomains];
            },
            [[], []]
        );
    const hostDomain = hostDomains.find(({ url, validUrl }) => src.indexOf(url) > -1 || src.indexOf(validUrl) > -1);
    const hashDomain = hashDomains.find(({ url }) => src.indexOf(url) > -1);
    if (!hostDomain && !hashDomain) {
        return '';
    }

    if (!!hostDomain) {
        let finalSrc: string = src;

        if (!src.includes(hostDomain.validUrl)) {
            finalSrc = src.replace(hostDomain.url, hostDomain.validUrl);
        }

        if (finalSrc.includes('youtube-nocookie.com') && !finalSrc.includes('rel=0')) {
            finalSrc = finalSrc + (finalSrc.includes("?") ? '&rel=0' : '?rel=0')
        }

        return finalSrc;
    }

    if (!!hashDomain) {
        const hashValue = hashDomain.validUrl.split("?")[1];

        if (!src.includes(hashValue)) {
            return src + (src.includes("?") ? `&${hashValue}` : hashDomain.validUrl);
        }
    }

    return '';
}

export function filterTextWithDomains(text: string, domainsStr: string) {
    const domains = getDomains(domainsStr);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = text;

    wrapper.querySelectorAll<HTMLIFrameElement>('.embed-responsive iframe').forEach((node) => {
        const src = replaceSrc(node.src, domains);

        if (src && src !== node.src) {
            node.src = src;
        }

        if (!src) {
            node.parentElement?.remove();
        }
    })

    return wrapper.innerHTML;
}

export function getArrayFormStr(str: string) {
    if (!str) {
        return [];
    }

    try {
        return JSON.parse(str);
    } catch (error) {
        return [];
    }
}