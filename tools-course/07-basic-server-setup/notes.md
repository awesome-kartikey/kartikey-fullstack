# Basic Server Setup Notes

## Cloud Information

* **Provider:** AWS EC2
* **Instance Type:** t2.micro
* **Public IP:** 13.235.79.30
* **Domain:** [https://kartikey-dev.duckdns.org/](https://kartikey-dev.duckdns.org/)
* **Default User:** `ubuntu`
* **My User:** `awskartikey`

---

## SSH Setup

Add this to `~/.ssh/config`:

```text
Host awsserver
    HostName 13.235.79.30
    User ubuntu
    IdentityFile ~/.ssh/aws-fullstack.pem
    
Host uawsserver
    HostName 13.235.79.30
    User awskartikey
    IdentityFile ~/.ssh/aws-fullstack.pem
```

---

## Creating a User on the Server

```bash
sudo adduser awskartikey
sudo usermod -aG sudo awskartikey

sudo mkdir /home/awskartikey/.ssh
sudo cp /home/ubuntu/.ssh/authorized_keys /home/awskartikey/.ssh/
sudo chown -R awskartikey:awskartikey /home/awskartikey/.ssh
sudo chmod 600 /home/awskartikey/.ssh/authorized_keys

su - awskartikey
```

---

## Running a Simple Website with Caddy

### Test on port 8080

```bash
caddy file-server --root ~/work/simple-site --listen :8080
```

Open:
[http://13.235.79.30:8080](http://13.235.79.30:8080)

### Enable HTTPS using DuckDNS

```bash
sudo caddy reverse-proxy --from kartikey-dev.duckdns.org --to localhost:8080
```

Open:
[https://kartikey-dev.duckdns.org](https://kartikey-dev.duckdns.org)

---

## Website File

Path: `~/work/simple-site/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloud Creation - Kartikey</title>
</head>
<body>
    <h1>Hello from my AWS Cloud Server!</h1>
    <p>kartikey-dev.duckdns.org</p>
</body>
</html>
```

---
