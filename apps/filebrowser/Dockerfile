ARG VERSION
FROM filebrowser/filebrowser:v${VERSION} as upstream

FROM ghcr.io/kodeythomas/ubuntu:rolling@sha256:392a90e9fe92a8987aad8dd1aeec32256809c3505bafdd1cc97fd92e0dcc63d0


LABEL org.opencontainers.image.source = "https://github.com/filebrowser/filebrowser"

COPY --from=upstream /filebrowser /filebrowser
COPY apps/filebrowser/scripts/* /usr/local/bin/
COPY apps/filebrowser/branding /branding/

# So that we can allow use of the cd command, which doesn't actually exist in /bin/
USER root

ENV S6_OVERLAY_VERSION=3.2.0.0

# Possibly useful binaries
# RUN apk add --no-cache mlocate ncdu tree curl bash
RUN apt-get -y update && apt-get -y install curl xz-utils git tmux tree fish pipx python3-venv nano && \
	pipx ensurepath

# Add s6
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz
RUN chown -R beepboop:beepboop /run

# Add kubectl command (weird, I know, but we use it for some console actions)
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
	install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
	rm kubectl

# Get recyclarr
RUN curl -LO https://github.com/recyclarr/recyclarr/releases/latest/download/recyclarr-linux-x64.tar.xz && \
	tar xf \
	recyclarr-linux-x64.tar.xz -C \
	/usr/local/bin/ && \
	rm recyclarr-linux-x64.tar.xz

# splash-cli unsplash client
RUN \
	SPLASH_CLI_VERSION=$(curl -sX GET "https://api.github.com/repos/rawnly/splash-cli/releases/latest" \
	| jq -r .tag_name); \
	curl -o \
	/tmp/splash-cli.tar.gz -L \
	"https://github.com/rawnly/splash-cli/releases/download/${SPLASH_CLI_VERSION}/splash_${SPLASH_CLI_VERSION}_linux_amd64.tar.gz" && \
	tar zxvpf /tmp/splash-cli.tar.gz && \
	mv splash /usr/local/bin && \
	rm README.md


# Add ttyd
ADD --chmod=755 https://github.com/tsl0922/ttyd/releases/download/1.7.7/ttyd.x86_64 /usr/local/bin/ttyd

# This is our fake bash for command execution
RUN cp -p /bin/bash /bin/vstat

# Run beepboop in rbash
RUN usermod -s /bin/rbash beepboop && \
	mkdir -p /storage/config/plextraktsync && \
	mkdir -p /home/beepboop/.config && \
	ln -sf /storage/config/plextraktsync /home/beepboop/.config/PlexTraktSync
COPY --chown=568:568 apps/filebrowser/root /

USER 568

# We need plextraktsync
RUN pipx install PlexTraktSync

EXPOSE 8080

# Because filebrowser wants paths relative to its executable

WORKDIR /
ENTRYPOINT [ "/init" ]