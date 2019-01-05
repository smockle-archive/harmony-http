# harmony-http

Shortcuts for Logitech Harmony without cloud dependencies

# About

Logitech’s app for the Harmony Hub does not support Shortcuts on iOS. Some people work around this by leveraging IFTTT Webhooks. I wanted to control devices attached to my Harmony Hub using Shortcuts, but I did not want to rely on the cloud.

So I built `harmony-http`. It’s a tiny Express app with three endpoints:

- GET /volumeup
- GET /volumedown
- GET /mute

It is designed to run on an always-on server (e.g. a Raspberry Pi) on your local network.

# Configuration

The following environment variables are required. They will be loaded from a `.env` file if one is present:

- `IP_ADDRESS` is the IP address of your Harmony Hub
- `REMOTE_ID` is the unique identifier of your Harmony Hub, and can be obtained by running `node_modules/.bin/harmonyhub-remote-id $IP_ADDRESS`
- `DEVICE_ID` is the unique identifier of the Harmony Hub-connected device you want to control using Shortcuts
- `PORT` is the port for the `harmony-http` server

# Running as a `systemd` service

1. Clone this repository to `/var/lib/harmony-http`:

```Bash
sudo mkdir /var/lib/harmony-http
sudo chown -R `whoami` /var/lib/harmony-http
git clone https://github.com/smockle/harmony-http /var/lib/harmony-http
```

2. Create a `.env` file in `/var/lib/harmony-http` with variables described in [Configuration](#Configuration):

```Bash
tee /var/lib/harmony-http/.env << EOF
IP_ADDRESS=
REMOTE_ID=
DEVICE_ID=
PORT=
EOF
```

3. Create a system user: `sudo useradd --system harmony-http`

4. Create a `systemd` service:

```Bash
sudo tee /etc/systemd/system/harmony-http.service << EOF
[Unit]
Description=Harmony HTTP
Wants=network-online.target
After=syslog.target network-online.target

[Service]
Type=simple
User=harmony-http
ExecStart=/var/lib/harmony-http/index.js
Restart=on-failure
RestartSec=10
KillMode=process

[Install]
WantedBy=multi-user.target
EOF
```

5. Enable the `harmony-http` system user to access files in `/var/lib/harmony-http`: `sudo chown -R harmony-http:harmony-http /var/lib/harmony-http`

# Creating Shortcuts

1. Add a “URL” step:

- URL: http://IP_ADDRESS:PORT/(volumeup|volumedown|mute)

2. Add a “Get Contents of URL” step:

- Method: GET
