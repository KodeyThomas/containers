FROM alpine:latest as cloner

ARG CHANNEL
ARG VERSION
ARG SSH_PRIVATE_KEY

RUN apk update && apk upgrade && \
	apk add --no-cache git openssh

RUN mkdir -p /root/.ssh && \
	chmod 0700 /root/.ssh && \
	ssh-keyscan github.com > /root/.ssh/known_hosts && \
	echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa && \
	chmod 600 /root/.ssh/id_rsa

RUN git clone git@github.com:debridmediamanager/zurg.git /source

FROM golang:1-alpine AS builder
ARG BuiltAt
ARG GitCommit
ARG Version
WORKDIR /app
COPY --from=cloner /source/. .
RUN apk add --no-cache bash git go gcc musl-dev curl fuse libxml2-utils
RUN go build -ldflags "-s -w -X 'github.com/debridmediamanager/zurg/internal/version.BuiltAt=$BuiltAt' -X 'github.com/debridmediamanager/zurg/internal/version.GitCommit=$GitCommit' -X 'github.com/debridmediamanager/zurg/internal/version.Version=$Version'" -o zurg ./cmd/zurg

FROM ghcr.io/kodeythomas/alpine:rolling
WORKDIR /app

COPY --from=builder /app/zurg .
COPY --from=cloner /source/config.example.yml /config/config.yml

# Install runtime dependencies and configure FUSE
RUN apk add curl python3 libxml2-utils ffmpeg

COPY ./apps/zurg/entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]