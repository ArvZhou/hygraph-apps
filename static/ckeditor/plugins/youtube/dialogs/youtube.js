CKEDITOR.dialog.add("youtubeDialog", function (editor) {
    return {
        title: "Video",
        minWidth: 400,
        minHeight: 120,
        contents: [
            {
                id: "tabBasic",
                elements: [
                    {
                        type: "text",
                        id: "src",
                        label: "Youtube ID (ex: YImRjNurLoE)<br><br>Or video URL (ex: https://player.vimeo.com/video/videoid)",
                        labelStyle: "margin-bottom: 10px; display: block;",
                        validate: CKEDITOR.dialog.validate.notEmpty(
                            "Input cannot be empty."
                        ),
                        setup: function (widget) {
                            var value = widget.data.src || "";

                            this.setValue(value);
                        },
                        commit: function (widget) {
                            const validDomainsStr =
                                localStorage.getItem("whiteDomains");
                            const validDomains = validDomainsStr
                                ? JSON.parse(validDomainsStr)
                                : [];

                            let value = this.getValue() || "";
                            if (value.startsWith("http")) {
                                const [hostDomains, hashDomains] =
                                    validDomains.reduce(
                                        (
                                            [_hostDomains, _hashDomains],
                                            _domain
                                        ) => {
                                            if (
                                                _domain.validUrl.indexOf("?") >
                                                -1
                                            ) {
                                                return [
                                                    _hostDomains,
                                                    [..._hashDomains, _domain],
                                                ];
                                            }

                                            return [
                                                [..._hostDomains, _domain],
                                                _hashDomains,
                                            ];
                                        },
                                        [[], []]
                                    );

                                const hostDomain = hostDomains.find(
                                    ({ url, validUrl }) =>
                                        value.indexOf(url) > -1 ||
                                        value.indexOf(validUrl) > -1
                                );
                                const hashDomain = hashDomains.find(
                                    ({ url }) => value.indexOf(url) > -1
                                );

                                if (!hostDomain && !hashDomain) {
                                    const validVideoNames = validDomains
                                        .map(({ name }) => name)
                                        .join(" and ");

                                    editor.showNotification(
                                        `Only ${validVideoNames} video are allowed.`
                                    );
                                    return;
                                }

                                if (!!hostDomain) {
                                    if (!value.includes(hostDomain.validUrl)) {
                                        value = value.replace(
                                            hostDomain.url,
                                            hostDomain.validUrl
                                        );
                                    }

                                    if (value.includes('youtube-nocookie.com') && !value.includes('rel=0')) {
                                        value =
                                            value +
                                            (value.includes("?") ? '&rel=0' : '?rel=0')
                                    }
                                }

                                if (!!hashDomain) {
                                    const hashValue =
                                        hashDomain.validUrl.split("?")[1];
                                    if (!value.includes(hashValue)) {
                                        value =
                                            value +
                                            (value.includes("?")
                                                ? `&${hashValue}`
                                                : hashDomain.validUrl);
                                    }
                                }
                            } else {
                                value = `https://www.youtube-nocookie.com/embed/${value}?rel=0`;
                            }
                            widget.setData("src", value);
                        },
                    },
                ],
            },
        ],
    };
});
